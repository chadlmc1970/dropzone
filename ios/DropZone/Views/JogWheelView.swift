import SwiftUI

/// Touch-interactive jog wheel for deck control
/// Supports rotation, nudge, and scratch gestures
struct JogWheelView: View {
    let deckIndex: Int
    let isPlaying: Bool
    let onRotate: (Double) -> Void // Delta in seconds
    let onTouch: () -> Void
    let onRelease: () -> Void

    @State private var rotationAngle: Double = 0
    @State private var lastAngle: Double = 0
    @State private var isTouching = false

    var body: some View {
        ZStack {
            // Outer ring
            Circle()
                .stroke(
                    LinearGradient(
                        colors: [Color.gray, Color.white, Color.gray],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 8
                )

            // Middle ring (grooves)
            Circle()
                .stroke(Color.black.opacity(0.3), lineWidth: 20)
                .padding(10)

            // Inner platter
            Circle()
                .fill(
                    RadialGradient(
                        colors: [Color.black, Color.gray.opacity(0.5)],
                        center: .center,
                        startRadius: 0,
                        endRadius: 100
                    )
                )
                .padding(30)

            // Center label
            VStack(spacing: 4) {
                Text("JOG")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.white.opacity(0.8))

                Text("DECK \(deckIndex)")
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.6))
            }

            // Touch indicator
            if isTouching {
                Circle()
                    .fill(Color.cyan.opacity(0.3))
                    .padding(25)
            }

            // Rotation indicator line
            Rectangle()
                .fill(isPlaying ? Color.green : Color.red)
                .frame(width: 3, height: 80)
                .offset(y: -40)
                .rotationEffect(.degrees(rotationAngle))
        }
        .frame(width: 200, height: 200)
        .rotationEffect(.degrees(isPlaying ? rotationAngle : 0))
        .animation(isPlaying ? .linear(duration: 0.1).repeatForever(autoreverses: false) : .default, value: isPlaying)
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { value in
                    if !isTouching {
                        isTouching = true
                        onTouch()
                        lastAngle = angle(for: value.location, in: CGSize(width: 200, height: 200))
                    }

                    let currentAngle = angle(for: value.location, in: CGSize(width: 200, height: 200))
                    var delta = currentAngle - lastAngle

                    // Handle wraparound
                    if delta > 180 {
                        delta -= 360
                    } else if delta < -180 {
                        delta += 360
                    }

                    // Convert angle delta to time delta (roughly)
                    // Full rotation = 1 second of audio
                    let timeDelta = delta / 360.0
                    onRotate(timeDelta)

                    lastAngle = currentAngle
                    rotationAngle += delta
                }
                .onEnded { _ in
                    isTouching = false
                    onRelease()
                }
        )
    }

    // Calculate angle from center
    private func angle(for point: CGPoint, in size: CGSize) -> Double {
        let center = CGPoint(x: size.width / 2, y: size.height / 2)
        let deltaX = point.x - center.x
        let deltaY = point.y - center.y
        let radians = atan2(deltaY, deltaX)
        let degrees = radians * 180 / .pi
        return degrees + 90 // Offset so 0° is at top
    }
}

#Preview {
    VStack(spacing: 40) {
        JogWheelView(
            deckIndex: 1,
            isPlaying: false,
            onRotate: { delta in print("Rotate: \(delta)") },
            onTouch: { print("Touch") },
            onRelease: { print("Release") }
        )

        JogWheelView(
            deckIndex: 2,
            isPlaying: true,
            onRotate: { delta in print("Rotate: \(delta)") },
            onTouch: { print("Touch") },
            onRelease: { print("Release") }
        )
    }
    .padding()
    .background(Color.black)
}
