import Foundation
import AVFoundation
import UIKit

/// AudioEngine manages audio playback and mixing for the DJ app
@MainActor
class AudioEngine: ObservableObject {
    static let shared = AudioEngine()

    // Audio processor
    private let processor = AudioProcessor()

    // Published state
    @Published var isEngineRunning = false
    @Published var deck1State = DeckState()
    @Published var deck2State = DeckState()
    @Published var crossfaderPosition: Float = 0.5
    @Published var mainVolume: Float = 0.8

    // Haptic feedback
    private let hapticEngine = UIImpactFeedbackGenerator(style: .medium)

    private init() {
        configureAudioSession()
        hapticEngine.prepare()
    }

    // MARK: - Audio Session Configuration

    private func configureAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch {
            print("Failed to configure audio session: \(error)")
        }
    }

    // MARK: - Engine Control

    func start() async throws {
        try processor.start()
        isEngineRunning = true
    }

    func stop() {
        processor.stop()
        isEngineRunning = false
    }

    // MARK: - Track Loading

    func loadTrack(_ track: Track, toDeck deckIndex: Int) async throws {
        // For mock implementation, we don't actually load audio files
        // In production, this would download/cache the track and load into AVAudioFile

        if deckIndex == 1 {
            deck1State.track = track
            deck1State.isLoaded = true
        } else {
            deck2State.track = track
            deck2State.isLoaded = true
        }

        triggerHaptic()
    }

    // MARK: - Playback Control

    func play(deckIndex: Int) throws {
        processor.play(deckIndex: deckIndex)

        if deckIndex == 1 {
            deck1State.isPlaying = true
        } else {
            deck2State.isPlaying = true
        }

        triggerHaptic()
    }

    func pause(deckIndex: Int) {
        processor.pause(deckIndex: deckIndex)

        if deckIndex == 1 {
            deck1State.isPlaying = false
        } else {
            deck2State.isPlaying = false
        }

        triggerHaptic()
    }

    func stop(deckIndex: Int) {
        processor.pause(deckIndex: deckIndex)
        processor.seek(deckIndex: deckIndex, to: 0)

        if deckIndex == 1 {
            deck1State.isPlaying = false
            deck1State.playheadPosition = 0.0
        } else {
            deck2State.isPlaying = false
            deck2State.playheadPosition = 0.0
        }

        triggerHaptic()
    }

    // MARK: - Jog Wheel / Seek

    func seek(deckIndex: Int, to position: Double) {
        let state = deckIndex == 1 ? deck1State : deck2State
        guard let track = state.track else { return }

        let clampedPosition = max(0.0, min(position, track.durationSeconds))

        // Convert to frame position (assuming 44.1kHz)
        let framePosition = AVAudioFramePosition(clampedPosition * 44100)
        processor.seek(deckIndex: deckIndex, to: framePosition)

        if deckIndex == 1 {
            deck1State.playheadPosition = clampedPosition
        } else {
            deck2State.playheadPosition = clampedPosition
        }
    }

    func nudge(deckIndex: Int, delta: Double) {
        let state = deckIndex == 1 ? deck1State : deck2State
        let newPosition = state.playheadPosition + delta
        seek(deckIndex: deckIndex, to: newPosition)
    }

    // MARK: - EQ Control

    func setEQ(deckIndex: Int, high: Float, mid: Float, low: Float) {
        processor.setEQ(deckIndex: deckIndex, high: high, mid: mid, low: low)

        if deckIndex == 1 {
            deck1State.eqHigh = high
            deck1State.eqMid = mid
            deck1State.eqLow = low
        } else {
            deck2State.eqHigh = high
            deck2State.eqMid = mid
            deck2State.eqLow = low
        }
    }

    // MARK: - Crossfader

    func setCrossfader(_ position: Float) {
        crossfaderPosition = position
        processor.setCrossfader(position)
    }

    // MARK: - Volume

    func setVolume(deckIndex: Int, volume: Float) {
        processor.setVolume(deckIndex: deckIndex, volume: volume)

        if deckIndex == 1 {
            deck1State.volume = volume
        } else {
            deck2State.volume = volume
        }
    }

    func setMainVolume(_ volume: Float) {
        mainVolume = volume
        processor.setMainVolume(volume)
    }

    // MARK: - Tempo/Pitch

    func setTempo(deckIndex: Int, bpm: Int) {
        // Calculate playback rate based on original BPM
        let state = deckIndex == 1 ? deck1State : deck2State
        guard let track = state.track, let originalBPM = track.bpm else { return }

        let rate = Float(bpm) / Float(originalBPM)
        processor.setPlaybackRate(deckIndex: deckIndex, rate: rate)

        if deckIndex == 1 {
            deck1State.currentBPM = bpm
        } else {
            deck2State.currentBPM = bpm
        }
    }

    func adjustPitch(deckIndex: Int, cents: Int) {
        // Pitch adjustment in cents (-100 to +100)
        let rate = pow(2.0, Float(cents) / 1200.0)
        processor.setPlaybackRate(deckIndex: deckIndex, rate: rate)
    }

    // MARK: - Effects

    func setReverb(_ wetDryMix: Float) {
        processor.setReverb(wetDryMix)
    }

    func setDelay(_ wetDryMix: Float) {
        processor.setDelay(wetDryMix)
    }

    // MARK: - Sync/Beat Matching

    func syncDecks() {
        // Sync deck 2 BPM to deck 1
        guard let deck1BPM = deck1State.track?.bpm else { return }
        setTempo(deckIndex: 2, bpm: deck1BPM)
        triggerHaptic()
    }

    // MARK: - Haptic Feedback

    private func triggerHaptic() {
        hapticEngine.impactOccurred()
    }

    func triggerBeatHaptic() {
        // Lighter haptic for beat markers
        let lightHaptic = UIImpactFeedbackGenerator(style: .light)
        lightHaptic.impactOccurred()
    }
}

// MARK: - Deck State

struct DeckState {
    var track: Track?
    var isLoaded: Bool = false
    var isPlaying: Bool = false
    var playheadPosition: Double = 0.0
    var volume: Float = 0.8
    var eqHigh: Float = 0.5
    var eqMid: Float = 0.5
    var eqLow: Float = 0.5
    var currentBPM: Int?
}
