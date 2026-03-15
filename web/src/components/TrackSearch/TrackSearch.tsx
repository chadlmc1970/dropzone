import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadTrack } from '../../store/decksSlice';
import type { Track } from '../../types';
import apiClient from '../../services/api';

interface TrackSearchProps {
  targetDeck: 'A' | 'B';
  onClose: () => void;
}

const TrackSearch: React.FC<TrackSearchProps> = ({ targetDeck, onClose }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.searchTracks(query);
      setResults(response.data.tracks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLoadTrack = (track: Track) => {
    dispatch(loadTrack({ deck: targetDeck, track }));
    onClose();
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Search Tracks for Deck {targetDeck}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by track name, artist, or album..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!error && results.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {query ? 'No tracks found. Try a different search.' : 'Enter a search query to find tracks'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-400">Searching...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleLoadTrack(track)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{track.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    <p className="text-gray-500 text-xs truncate">{track.album}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {track.bpm && (
                      <span className="text-purple-400 text-sm font-mono">{track.bpm} BPM</span>
                    )}
                    {track.key && (
                      <span className="text-purple-400 text-sm font-mono">{track.key}</span>
                    )}
                    <span className="text-gray-500 text-sm">{formatDuration(track.duration_ms)}</span>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded transition-colors">
                      Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackSearch;
