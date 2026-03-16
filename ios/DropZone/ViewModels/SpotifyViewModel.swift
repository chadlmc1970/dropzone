import Foundation
import Combine

/// ViewModel for Spotify integration
@MainActor
class SpotifyViewModel: ObservableObject {
    private let spotifyService = SpotifyService.shared

    // Published state
    @Published var isConnected: Bool = false
    @Published var currentTrack: Track?
    @Published var isPlaying: Bool = false
    @Published var playbackPosition: Double = 0.0

    @Published var searchQuery: String = ""
    @Published var searchResults: [Track] = []
    @Published var isSearching: Bool = false

    // Cancellables
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupBindings()
    }

    // MARK: - Setup

    private func setupBindings() {
        // Observe Spotify service state
        spotifyService.$isConnected
            .assign(to: &$isConnected)

        spotifyService.$currentTrack
            .assign(to: &$currentTrack)

        spotifyService.$isPlaying
            .assign(to: &$isPlaying)

        spotifyService.$playbackPosition
            .assign(to: &$playbackPosition)
    }

    // MARK: - Authentication

    func connect() async {
        do {
            try await spotifyService.connect()
        } catch {
            print("Spotify connection failed: \(error)")
        }
    }

    func disconnect() {
        spotifyService.disconnect()
    }

    // MARK: - Playback Control

    func play(_ track: Track) async {
        do {
            try await spotifyService.play(track: track)
        } catch {
            print("Playback failed: \(error)")
        }
    }

    func togglePlayback() {
        if isPlaying {
            spotifyService.pause()
        } else {
            spotifyService.resume()
        }
    }

    func stop() {
        spotifyService.stop()
    }

    func seek(to position: Double) async {
        do {
            try await spotifyService.seek(to: position)
        } catch {
            print("Seek failed: \(error)")
        }
    }

    // MARK: - Track Search

    func searchTracks() async {
        guard !searchQuery.isEmpty else {
            searchResults = []
            return
        }

        isSearching = true

        do {
            searchResults = try await spotifyService.searchTracks(query: searchQuery)
        } catch {
            print("Search failed: \(error)")
            searchResults = []
        }

        isSearching = false
    }

    func clearSearch() {
        searchQuery = ""
        searchResults = []
    }

    // MARK: - Helpers

    var formattedPosition: String {
        let minutes = Int(playbackPosition) / 60
        let seconds = Int(playbackPosition) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }

    var formattedDuration: String {
        guard let track = currentTrack else { return "0:00" }
        return track.formattedDuration
    }

    var progress: Double {
        guard let track = currentTrack else { return 0.0 }
        return playbackPosition / track.durationSeconds
    }
}
