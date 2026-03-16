import SwiftUI

/// Canvas-based waveform visualization with beat markers
struct WaveformView: View {
    let isPlaying: Bool
    @State private var playheadPosition: Double = 0.0

    // Mock waveform data (in production, this would come from audio analysis)
    private let waveformData: [Float] = (0..<100).map { index in
        // Generate realistic waveform with peaks at "beat" positions
        let beatPosition = index % 16 == 0
        let baseAmplitude = Float.random(in: 0.3...0.7)
        return beatPosition ? 1.0 : baseAmplitude
    }

    var body: some View {
        Canvas { context, size in
            // Background
            context.fill(
                Path(CGRect(origin: .zero, size: size)),
                with: .color(.black.opacity(0.5))
            )

            // Draw waveform bars
            let barWidth = size.width / CGFloat(waveformData.count)

            for (index, amplitude) in waveformData.enumerated() {
                let x = CGFloat(index) * barWidth
                let barHeight = CGFloat(amplitude) * (size.height * 0.9)
                let y = (size.height - barHeight) / 2

                // Determine bar color based on playhead position
                let progress = CGFloat(index) / CGFloat(waveformData.count)
                let barColor: Color

                if progress < playheadPosition {
                    // Played section
                    barColor = .cyan.opacity(0.8)
                } else if progress < playheadPosition + 0.05 {
                    // Playhead region
                    barColor = .white
                } else {
                    // Unplayed section
                    barColor = .white.opacity(0.3)
                }

                // Draw bar with rounded corners
                let barRect = CGRect(x: x, y: y, width: max(barWidth - 1, 1), height: barHeight)
                let barPath = RoundedRectangle(cornerRadius: 2).path(in: barRect)
                context.fill(barPath, with: .color(barColor))

                // Draw beat marker (red line at peaks)
                if amplitude > 0.95 {
                    let markerPath = Path { path in
                        path.move(to: CGPoint(x: x + barWidth / 2, y: 0))
                        path.addLine(to: CGPoint(x: x + barWidth / 2, y: size.height))
                    }
                    context.stroke(markerPath, with: .color(.red.opacity(0.5)), lineWidth: 1)
                }
            }

            // Draw playhead line
            let playheadX = size.width * playheadPosition
            let playheadPath = Path { path in
                path.move(to: CGPoint(x: playheadX, y: 0))
                path.addLine(to: CGPoint(x: playheadX, y: size.height))
            }
            context.stroke(playheadPath, with: .color(.yellow), lineWidth: 2)
        }
        .background(Color.black.opacity(0.5))
        .cornerRadius(8)
        .onAppear {
            if isPlaying {
                startPlayhead()
            }
        }
        .onChange(of: isPlaying) { oldValue, newValue in
            if newValue {
                startPlayhead()
            }
        }
    }

    private func startPlayhead() {
        guard isPlaying else { return }

        Task {
            while isPlaying && playheadPosition < 1.0 {
                try? await Task.sleep(nanoseconds: 50_000_000) // 50ms
                playheadPosition += 0.005
            }

            if playheadPosition >= 1.0 {
                playheadPosition = 0.0
            }
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        Text("Paused Waveform")
            .foregroundColor(.white)
        WaveformView(isPlaying: false)
            .frame(height: 80)

        Text("Playing Waveform")
            .foregroundColor(.white)
        WaveformView(isPlaying: true)
            .frame(height: 80)
    }
    .padding()
    .background(Color.black)
}
