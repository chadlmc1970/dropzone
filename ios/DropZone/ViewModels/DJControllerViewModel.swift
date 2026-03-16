import Foundation
import Combine

/// Main ViewModel for DJ Controller
/// Coordinates between AudioEngine, SpotifyService, and APIClient
@MainActor
class DJControllerViewModel: ObservableObject {
    // Services
    private let audioEngine = AudioEngine.shared
    private let spotifyService = SpotifyService.shared
    private let apiClient = APIClient.shared

    // Published state
    @Published var deck1Track: Track?
    @Published var deck2Track: Track?

    @Published var deck1IsPlaying: Bool = false
    @Published var deck2IsPlaying: Bool = false

    @Published var deck1Volume: Float = 0.8
    @Published var deck2Volume: Float = 0.8

    @Published var deck1EQ = EQState()
    @Published var deck2EQ = EQState()

    @Published var crossfaderPosition: Float = 0.5
    @Published var mainVolume: Float = 0.8

    @Published var searchQuery: String = ""
    @Published var searchResults: [Track] = []
    @Published var isSearching: Bool = false

    @Published var savedMixes: [Mix] = []

    // Cancellables
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupBindings()
        Task {
            try? await audioEngine.start()
            await loadSavedMixes()
        }
    }

    // MARK: - Setup

    private func setupBindings() {
        // Observe audio engine state
        audioEngine.$deck1State
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                self?.deck1Track = state.track
                self?.deck1IsPlaying = state.isPlaying
                self?.deck1Volume = state.volume
                self?.deck1EQ = EQState(high: state.eqHigh, mid: state.eqMid, low: state.eqLow)
            }
            .store(in: &cancellables)

        audioEngine.$deck2State
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                self?.deck2Track = state.track
                self?.deck2IsPlaying = state.isPlaying
                self?.deck2Volume = state.volume
                self?.deck2EQ = EQState(high: state.eqHigh, mid: state.eqMid, low: state.eqLow)
            }
            .store(in: &cancellables)

        audioEngine.$crossfaderPosition
            .receive(on: DispatchQueue.main)
            .assign(to: &$crossfaderPosition)

        audioEngine.$mainVolume
            .receive(on: DispatchQueue.main)
            .assign(to: &$mainVolume)
    }

    // MARK: - Track Loading

    func loadTrack(_ track: Track, toDeck deckIndex: Int) async {
        do {
            try await audioEngine.loadTrack(track, toDeck: deckIndex)
        } catch {
            print("Failed to load track: \(error)")
        }
    }

    // MARK: - Playback Control

    func togglePlayback(deckIndex: Int) {
        let isPlaying = deckIndex == 1 ? deck1IsPlaying : deck2IsPlaying

        if isPlaying {
            audioEngine.pause(deckIndex: deckIndex)
        } else {
            do {
                try audioEngine.play(deckIndex: deckIndex)
            } catch {
                print("Failed to play: \(error)")
            }
        }
    }

    func stopDeck(deckIndex: Int) {
        audioEngine.stop(deckIndex: deckIndex)
    }

    // MARK: - EQ Control

    func setEQ(deckIndex: Int, high: Float? = nil, mid: Float? = nil, low: Float? = nil) {
        let currentEQ = deckIndex == 1 ? deck1EQ : deck2EQ

        let newHigh = high ?? currentEQ.high
        let newMid = mid ?? currentEQ.mid
        let newLow = low ?? currentEQ.low

        audioEngine.setEQ(deckIndex: deckIndex, high: newHigh, mid: newMid, low: newLow)
    }

    func resetEQ(deckIndex: Int) {
        audioEngine.setEQ(deckIndex: deckIndex, high: 0.5, mid: 0.5, low: 0.5)
    }

    // MARK: - Crossfader

    func setCrossfader(_ position: Float) {
        audioEngine.setCrossfader(position)
    }

    // MARK: - Volume Control

    func setVolume(deckIndex: Int, volume: Float) {
        audioEngine.setVolume(deckIndex: deckIndex, volume: volume)
    }

    func setMainVolume(_ volume: Float) {
        audioEngine.setMainVolume(volume)
    }

    // MARK: - BPM / Tempo

    func setTempo(deckIndex: Int, bpm: Int) {
        audioEngine.setTempo(deckIndex: deckIndex, bpm: bpm)
    }

    func syncDecks() {
        audioEngine.syncDecks()
    }

    // MARK: - Track Search

    func searchTracks() async {
        guard !searchQuery.isEmpty else {
            searchResults = []
            return
        }

        isSearching = true

        do {
            let response = try await apiClient.searchTracks(query: searchQuery)
            searchResults = response.tracks
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

    // MARK: - Mix Management

    func saveMix(name: String) async {
        guard let track1 = deck1Track, let track2 = deck2Track else { return }

        let request = CreateMixRequest(
            name: name,
            track1URI: track1.spotifyURI,
            track2URI: track2.spotifyURI,
            transitionType: "club_beat",
            transitionPoint: 16,
            settings: MixSettings(
                eq: EQSettings(
                    high: deck1EQ.high,
                    mid: deck1EQ.mid,
                    low: deck1EQ.low
                ),
                crossfader: Double(crossfaderPosition)
            ),
            durationSeconds: Int(track1.durationSeconds + track2.durationSeconds)
        )

        do {
            let mix = try await apiClient.createMix(request)
            savedMixes.insert(mix, at: 0)
        } catch {
            print("Failed to save mix: \(error)")
        }
    }

    func loadSavedMixes() async {
        do {
            let response = try await apiClient.getMixes()
            savedMixes = response.mixes
        } catch {
            print("Failed to load mixes: \(error)")
        }
    }

    // MARK: - Jog Wheel

    func jogWheel(deckIndex: Int, delta: Double) {
        audioEngine.nudge(deckIndex: deckIndex, delta: delta)
    }
}

// MARK: - EQ State

struct EQState {
    var high: Float = 0.5
    var mid: Float = 0.5
    var low: Float = 0.5
}
