import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [.purple, .blue],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 20) {
                Text("DropZone")
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(.white)

                Text("Professional DJ Mixing")
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.8))
            }
        }
    }
}
