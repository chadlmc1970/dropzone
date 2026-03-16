import SwiftUI

/// Individual deck view with playback controls and EQ
struct DeckView: View {
    let deckIndex: Int
    let track: Track?
    let isPlaying: Bool
    let volume: Float
    let eq: EQState

    let onPlayPause: () -> Void
    let onStop: () -> Void
    let onVolumeChange: (Float) -> Void
    let onEQChange: (Float, Float, Float) -> Void
    let onLoadTrack: () -> Void

    @State private var localVolume: Double
    @State private var localEQHigh: Double
    @State private var localEQMid: Double
    @State private var localEQLow: Double

    init(
        deckIndex: Int,
        track: Track?,
        isPlaying: Bool,
        volume: Float,
        eq: EQState,
        onPlayPause: @escaping () -> Void,
        onStop: @escaping () -> Void,
        onVolumeChange: @escaping (Float) -> Void,
        onEQChange: @escaping (Float, Float, Float) -> Void,
        onLoadTrack: @escaping () -> Void
    ) {
        self.deckIndex = deckIndex
        self.track = track
        self.isPlaying = isPlaying
        self.volume = volume
        self.eq = eq
        self.onPlayPause = onPlayPause
        self.onStop = onStop
        self.onVolumeChange = onVolumeChange
        self.onEQChange = onEQChange
        self.onLoadTrack = onLoadTrack

        _localVolume = State(initialValue: Double(volume))
        _localEQHigh = State(initialValue: Double(eq.high))
        _localEQMid = State(initialValue: Double(eq.mid))
        _localEQLow = State(initialValue: Double(eq.low))
    }

    var body: some View {
        VStack(spacing: 12) {
            // Deck header
            HStack {
                Text("DECK \(deckIndex)")
                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                    .foregroundColor(.white.opacity(0.8))

                Spacer()

                Circle()
                    .fill(isPlaying ? Color.green : Color.red)
                    .frame(width: 8, height: 8)
            }

            // Track info
            if let track = track {
                VStack(alignment: .leading, spacing: 4) {
                    Text(track.title)
                        .font(.headline)
                        .foregroundColor(.white)
                        .lineLimit(1)

                    Text(track.artist)
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.7))
                        .lineLimit(1)

                    HStack {
                        if let bpm = track.bpm {
                            Text("\(bpm) BPM")
                                .font(.caption)
                                .foregroundColor(.cyan)
                        }

                        if let keyName = track.keyName {
                            Text(keyName)
                                .font(.caption)
                                .foregroundColor(.purple)
                        }

                        Spacer()

                        Text(track.formattedDuration)
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .padding(8)
                .background(Color.white.opacity(0.1))
                .cornerRadius(8)
            } else {
                Button(action: onLoadTrack) {
                    VStack {
                        Image(systemName: "plus.circle")
                            .font(.largeTitle)
                        Text("Load Track")
                            .font(.caption)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(8)
                }
            }

            // Waveform placeholder
            WaveformView(isPlaying: isPlaying)
                .frame(height: 80)

            // Playback controls
            HStack(spacing: 20) {
                Button(action: onStop) {
                    Image(systemName: "stop.fill")
                        .font(.title2)
                        .frame(width: 44, height: 44)
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(8)
                }

                Button(action: onPlayPause) {
                    Image(systemName: isPlaying ? "pause.fill" : "play.fill")
                        .font(.title)
                        .frame(width: 60, height: 60)
                        .background(isPlaying ? Color.orange : Color.green)
                        .cornerRadius(12)
                }

                Button(action: {}) {
                    Image(systemName: "arrow.clockwise")
                        .font(.title2)
                        .frame(width: 44, height: 44)
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(8)
                }
            }

            // EQ controls
            HStack(spacing: 12) {
                EQKnob(label: "HIGH", value: $localEQHigh, color: .red) { newValue in
                    onEQChange(Float(newValue), Float(localEQMid), Float(localEQLow))
                }

                EQKnob(label: "MID", value: $localEQMid, color: .yellow) { newValue in
                    onEQChange(Float(localEQHigh), Float(newValue), Float(localEQLow))
                }

                EQKnob(label: "LOW", value: $localEQLow, color: .blue) { newValue in
                    onEQChange(Float(localEQHigh), Float(localEQMid), Float(newValue))
                }
            }

            // Volume slider
            VStack(spacing: 4) {
                Text("VOLUME")
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.6))

                Slider(value: $localVolume, in: 0...1) { editing in
                    if !editing {
                        onVolumeChange(Float(localVolume))
                    }
                }
                .tint(.cyan)

                Text("\(Int(localVolume * 100))%")
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.8))
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(deckIndex == 1 ? Color.cyan : Color.purple, lineWidth: 1)
                )
        )
    }
}

// MARK: - EQ Knob

struct EQKnob: View {
    let label: String
    @Binding var value: Double
    let color: Color
    let onChange: (Double) -> Void

    var body: some View {
        VStack(spacing: 4) {
            Text(label)
                .font(.caption2)
                .foregroundColor(.white.opacity(0.6))

            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.2), lineWidth: 2)
                    .frame(width: 50, height: 50)

                Circle()
                    .trim(from: 0, to: CGFloat(value))
                    .stroke(color, lineWidth: 3)
                    .frame(width: 50, height: 50)
                    .rotationEffect(.degrees(-90))

                Circle()
                    .fill(color.opacity(0.3))
                    .frame(width: 40, height: 40)

                Text("\(Int(value * 100))")
                    .font(.caption2)
                    .foregroundColor(.white)
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { gesture in
                        let center = CGPoint(x: 25, y: 25)
                        let vector = CGPoint(x: gesture.location.x - center.x, y: gesture.location.y - center.y)
                        let angle = atan2(vector.y, vector.x) + .pi / 2
                        let normalizedAngle = (angle + 2 * .pi).truncatingRemainder(dividingBy: 2 * .pi)
                        let newValue = normalizedAngle / (2 * .pi)
                        value = min(1.0, max(0.0, newValue))
                        onChange(value)
                    }
            )
        }
    }
}

#Preview {
    DeckView(
        deckIndex: 1,
        track: Track(
            id: "1",
            title: "One More Time",
            artist: "Daft Punk",
            album: "Discovery",
            durationMs: 320000,
            spotifyURI: "spotify:track:1",
            previewURL: nil,
            bpm: 123,
            key: 9,
            mode: 1,
            energy: 0.85,
            danceability: 0.88,
            valence: 0.82
        ),
        isPlaying: true,
        volume: 0.8,
        eq: EQState(),
        onPlayPause: {},
        onStop: {},
        onVolumeChange: { _ in },
        onEQChange: { _, _, _ in },
        onLoadTrack: {}
    )
    .frame(width: 400, height: 600)
    .background(Color.black)
}
