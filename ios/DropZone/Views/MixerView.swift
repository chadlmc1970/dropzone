import SwiftUI

/// Mixer section with crossfader and main controls
struct MixerView: View {
    @Binding var crossfaderPosition: Float
    @Binding var mainVolume: Float

    let onCrossfaderChange: (Float) -> Void
    let onMainVolumeChange: (Float) -> Void
    let onSyncDecks: () -> Void

    @State private var localCrossfader: Double
    @State private var localMainVolume: Double

    init(
        crossfaderPosition: Binding<Float>,
        mainVolume: Binding<Float>,
        onCrossfaderChange: @escaping (Float) -> Void,
        onMainVolumeChange: @escaping (Float) -> Void,
        onSyncDecks: @escaping () -> Void
    ) {
        self._crossfaderPosition = crossfaderPosition
        self._mainVolume = mainVolume
        self.onCrossfaderChange = onCrossfaderChange
        self.onMainVolumeChange = onMainVolumeChange
        self.onSyncDecks = onSyncDecks

        _localCrossfader = State(initialValue: Double(crossfaderPosition.wrappedValue))
        _localMainVolume = State(initialValue: Double(mainVolume.wrappedValue))
    }

    var body: some View {
        VStack(spacing: 16) {
            // Mixer header
            HStack {
                Text("MIXER")
                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                    .foregroundColor(.white.opacity(0.8))

                Spacer()

                Button(action: onSyncDecks) {
                    Label("SYNC", systemImage: "link")
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.cyan)
                        .foregroundColor(.black)
                        .cornerRadius(6)
                }
            }

            // Crossfader
            VStack(spacing: 8) {
                HStack {
                    Text("DECK 1")
                        .font(.caption)
                        .foregroundColor(localCrossfader < 0.3 ? .cyan : .white.opacity(0.5))
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Text("CROSSFADER")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.6))

                    Text("DECK 2")
                        .font(.caption)
                        .foregroundColor(localCrossfader > 0.7 ? .purple : .white.opacity(0.5))
                        .frame(maxWidth: .infinity, alignment: .trailing)
                }

                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        // Track
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.white.opacity(0.2))
                            .frame(height: 8)

                        // Gradient fill
                        LinearGradient(
                            colors: [Color.cyan, Color.purple],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .frame(width: geometry.size.width * CGFloat(localCrossfader), height: 8)
                        .cornerRadius(4)

                        // Fader handle
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [.white, .gray],
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                            )
                            .frame(width: 40, height: 40)
                            .shadow(color: .black.opacity(0.5), radius: 4, x: 0, y: 2)
                            .offset(x: geometry.size.width * CGFloat(localCrossfader) - 20)
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newValue = max(0, min(1, value.location.x / geometry.size.width))
                                        localCrossfader = newValue
                                        onCrossfaderChange(Float(newValue))
                                    }
                            )
                    }
                }
                .frame(height: 40)

                Text("\(Int(localCrossfader * 100))%")
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.8))
            }
            .padding()
            .background(Color.white.opacity(0.05))
            .cornerRadius(12)

            // Main volume
            HStack(spacing: 16) {
                Image(systemName: "speaker.fill")
                    .foregroundColor(.white.opacity(0.6))

                VStack(spacing: 4) {
                    Slider(value: $localMainVolume, in: 0...1) { editing in
                        if !editing {
                            onMainVolumeChange(Float(localMainVolume))
                        }
                    }
                    .tint(.green)

                    Text("MAIN VOLUME: \(Int(localMainVolume * 100))%")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.8))
                }

                Image(systemName: "speaker.wave.3.fill")
                    .foregroundColor(.white.opacity(0.6))
            }
            .padding()
            .background(Color.white.opacity(0.05))
            .cornerRadius(12)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.green, lineWidth: 1)
                )
        )
    }
}

#Preview {
    MixerView(
        crossfaderPosition: .constant(0.5),
        mainVolume: .constant(0.8),
        onCrossfaderChange: { _ in },
        onMainVolumeChange: { _ in },
        onSyncDecks: {}
    )
    .frame(height: 300)
    .background(Color.black)
}
