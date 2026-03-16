import SwiftUI

/// Simple waveform visualization
/// Will be enhanced with Canvas in Task 8
struct WaveformView: View {
    let isPlaying: Bool

    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: 2) {
                ForEach(0..<50, id: \.self) { index in
                    RoundedRectangle(cornerRadius: 2)
                        .fill(isPlaying ? Color.cyan.opacity(0.8) : Color.white.opacity(0.3))
                        .frame(height: CGFloat.random(in: 10...geometry.size.height))
                }
            }
        }
        .background(Color.black.opacity(0.5))
        .cornerRadius(8)
    }
}

#Preview {
    VStack(spacing: 20) {
        WaveformView(isPlaying: false)
            .frame(height: 80)

        WaveformView(isPlaying: true)
            .frame(height: 80)
    }
    .padding()
    .background(Color.black)
}
