import Foundation
import AVFoundation

/// AudioProcessor manages the AVAudioEngine graph for DJ mixing
/// Supports dual deck mixing, 3-band EQ, crossfader, and effects
class AudioProcessor {
    // Audio engine
    private let engine = AVAudioEngine()

    // Player nodes (2 decks)
    private let deck1Player = AVAudioPlayerNode()
    private let deck2Player = AVAudioPlayerNode()

    // EQ nodes (3-band per deck)
    private let deck1EQHigh = AVAudioUnitEQ(numberOfBands: 1)
    private let deck1EQMid = AVAudioUnitEQ(numberOfBands: 1)
    private let deck1EQLow = AVAudioUnitEQ(numberOfBands: 1)

    private let deck2EQHigh = AVAudioUnitEQ(numberOfBands: 1)
    private let deck2EQMid = AVAudioUnitEQ(numberOfBands: 1)
    private let deck2EQLow = AVAudioUnitEQ(numberOfBands: 1)

    // Mixer nodes for crossfader
    private let deck1Mixer = AVAudioMixerNode()
    private let deck2Mixer = AVAudioMixerNode()
    private let mainMixer = AVAudioMixerNode()

    // Effect nodes
    private let reverb = AVAudioUnitReverb()
    private let delay = AVAudioUnitDelay()

    // Crossfader position (0.0 = full deck1, 1.0 = full deck2)
    private(set) var crossfaderPosition: Float = 0.5

    init() {
        setupAudioGraph()
        configureEQ()
        configureEffects()
    }

    // MARK: - Audio Graph Setup

    private func setupAudioGraph() {
        // Attach all nodes to engine
        engine.attach(deck1Player)
        engine.attach(deck2Player)

        engine.attach(deck1EQHigh)
        engine.attach(deck1EQMid)
        engine.attach(deck1EQLow)

        engine.attach(deck2EQHigh)
        engine.attach(deck2EQMid)
        engine.attach(deck2EQLow)

        engine.attach(deck1Mixer)
        engine.attach(deck2Mixer)
        engine.attach(mainMixer)

        engine.attach(reverb)
        engine.attach(delay)

        // Connect deck 1: player -> EQ chain -> mixer
        engine.connect(deck1Player, to: deck1EQHigh, format: nil)
        engine.connect(deck1EQHigh, to: deck1EQMid, format: nil)
        engine.connect(deck1EQMid, to: deck1EQLow, format: nil)
        engine.connect(deck1EQLow, to: deck1Mixer, format: nil)

        // Connect deck 2: player -> EQ chain -> mixer
        engine.connect(deck2Player, to: deck2EQHigh, format: nil)
        engine.connect(deck2EQHigh, to: deck2EQMid, format: nil)
        engine.connect(deck2EQMid, to: deck2EQLow, format: nil)
        engine.connect(deck2EQLow, to: deck2Mixer, format: nil)

        // Connect both decks to main mixer
        engine.connect(deck1Mixer, to: mainMixer, format: nil)
        engine.connect(deck2Mixer, to: mainMixer, format: nil)

        // Connect main mixer through effects to output
        engine.connect(mainMixer, to: reverb, format: nil)
        engine.connect(reverb, to: delay, format: nil)
        engine.connect(delay, to: engine.mainMixerNode, format: nil)
    }

    private func configureEQ() {
        // Deck 1 EQ
        configureEQBand(deck1EQHigh.bands[0], frequency: 12000, type: .highShelf)
        configureEQBand(deck1EQMid.bands[0], frequency: 1000, type: .parametric)
        configureEQBand(deck1EQLow.bands[0], frequency: 80, type: .lowShelf)

        // Deck 2 EQ
        configureEQBand(deck2EQHigh.bands[0], frequency: 12000, type: .highShelf)
        configureEQBand(deck2EQMid.bands[0], frequency: 1000, type: .parametric)
        configureEQBand(deck2EQLow.bands[0], frequency: 80, type: .lowShelf)
    }

    private func configureEQBand(_ band: AVAudioUnitEQFilterParameters, frequency: Float, type: AVAudioUnitEQFilterType) {
        band.filterType = type
        band.frequency = frequency
        band.bandwidth = 1.0
        band.gain = 0.0 // Neutral position
        band.bypass = false
    }

    private func configureEffects() {
        // Reverb
        reverb.loadFactoryPreset(.mediumHall)
        reverb.wetDryMix = 0.0 // Start with dry signal

        // Delay
        delay.delayTime = 0.5 // 500ms
        delay.feedback = 30.0 // 30%
        delay.wetDryMix = 0.0 // Start with dry signal
    }

    // MARK: - Engine Control

    func start() throws {
        if !engine.isRunning {
            try engine.start()
        }
    }

    func stop() {
        if engine.isRunning {
            engine.stop()
        }
    }

    // MARK: - Playback Control

    func loadTrack(deckIndex: Int, audioFile: AVAudioFile) {
        let player = deckIndex == 1 ? deck1Player : deck2Player

        player.stop()
        player.scheduleFile(audioFile, at: nil)
    }

    func play(deckIndex: Int) {
        let player = deckIndex == 1 ? deck1Player : deck2Player
        if !player.isPlaying {
            player.play()
        }
    }

    func pause(deckIndex: Int) {
        let player = deckIndex == 1 ? deck1Player : deck2Player
        player.pause()
    }

    func seek(deckIndex: Int, to time: AVAudioFramePosition) {
        // Seeking requires stopping and rescheduling
        let player = deckIndex == 1 ? deck1Player : deck2Player
        player.stop()
        // Note: Full seek implementation requires tracking the AVAudioFile
        // and rescheduling from the new position
    }

    // MARK: - EQ Control

    func setEQ(deckIndex: Int, high: Float, mid: Float, low: Float) {
        let eqHigh = deckIndex == 1 ? deck1EQHigh : deck2EQHigh
        let eqMid = deckIndex == 1 ? deck1EQMid : deck2EQMid
        let eqLow = deckIndex == 1 ? deck1EQLow : deck2EQLow

        // Convert UI range (0.0-1.0) to gain in dB (-12dB to +12dB)
        eqHigh.bands[0].gain = (high - 0.5) * 24
        eqMid.bands[0].gain = (mid - 0.5) * 24
        eqLow.bands[0].gain = (low - 0.5) * 24
    }

    // MARK: - Crossfader Control

    func setCrossfader(_ position: Float) {
        crossfaderPosition = max(0.0, min(1.0, position))

        // Power law crossfade for smoother transitions
        let deck1Volume = sqrt(1.0 - crossfaderPosition)
        let deck2Volume = sqrt(crossfaderPosition)

        deck1Mixer.volume = deck1Volume
        deck2Mixer.volume = deck2Volume
    }

    // MARK: - Effects Control

    func setReverb(_ wetDryMix: Float) {
        reverb.wetDryMix = max(0.0, min(100.0, wetDryMix * 100))
    }

    func setDelay(_ wetDryMix: Float) {
        delay.wetDryMix = max(0.0, min(100.0, wetDryMix * 100))
    }

    func setDelayTime(_ time: TimeInterval) {
        delay.delayTime = max(0.0, min(2.0, time))
    }

    func setDelayFeedback(_ feedback: Float) {
        delay.feedback = max(-100.0, min(100.0, feedback))
    }

    // MARK: - Volume Control

    func setVolume(deckIndex: Int, volume: Float) {
        let mixer = deckIndex == 1 ? deck1Mixer : deck2Mixer
        mixer.volume = max(0.0, min(1.0, volume))
    }

    func setMainVolume(_ volume: Float) {
        mainMixer.volume = max(0.0, min(1.0, volume))
    }

    // MARK: - Playback State

    func isPlaying(deckIndex: Int) -> Bool {
        let player = deckIndex == 1 ? deck1Player : deck2Player
        return player.isPlaying
    }

    // MARK: - Tempo/Pitch Control

    func setPlaybackRate(deckIndex: Int, rate: Float) {
        let player = deckIndex == 1 ? deck1Player : deck2Player
        player.rate = max(0.5, min(2.0, rate)) // 50% to 200% speed
    }
}
