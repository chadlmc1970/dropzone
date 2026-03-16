import Foundation
import Combine

/// SpotifyService handles Spotify authentication and playback
/// Currently using MOCK implementation - will integrate real Spotify iOS SDK when ready
@MainActor
class SpotifyService: ObservableObject {
    static let shared = SpotifyService()

    // Spotify Client ID from Claude 1
    private let clientID = "c7542388e8dc4ee18d0496383e1d0443"

    @Published var isConnected = false
    @Published var currentTrack: Track?
    @Published var isPlaying = false
    @Published var playbackPosition: Double = 0.0

    private let useMock = true // Toggle when integrating real SDK

    private init() {
        // Initialize mock connection
        if useMock {
            isConnected = true
        }
    }

    // MARK: - Authentication

    func connect() async throws {
        if useMock {
            try await Task.sleep(nanoseconds: 500_000_000) // Simulate network delay
            isConnected = true
            return
        }

        // TODO: Implement real Spotify iOS SDK authentication
        // 1. Configure SPTConfiguration with clientID
        // 2. Set redirect URI (registered in Spotify Dashboard)
        // 3. Present SPTSessionManager.initiateSession()
        // 4. Handle callback in SceneDelegate
        throw NSError(domain: "SpotifyService", code: -1, userInfo: [
            NSLocalizedDescriptionKey: "Real Spotify SDK not yet integrated"
        ])
    }

    func disconnect() {
        isConnected = false
        stop()
    }

    // MARK: - Playback Control

    func play(track: Track) async throws {
        if useMock {
            currentTrack = track
            isPlaying = true
            playbackPosition = 0.0
            startMockPlayback()
            return
        }

        // TODO: Implement real Spotify playback
        // SPTAppRemote.playerAPI.play(track.spotifyURI)
        throw NSError(domain: "SpotifyService", code: -1, userInfo: [
            NSLocalizedDescriptionKey: "Real Spotify playback not yet integrated"
        ])
    }

    func pause() {
        if useMock {
            isPlaying = false
            return
        }

        // TODO: SPTAppRemote.playerAPI.pause()
    }

    func resume() {
        if useMock {
            isPlaying = true
            return
        }

        // TODO: SPTAppRemote.playerAPI.resume()
    }

    func stop() {
        if useMock {
            isPlaying = false
            playbackPosition = 0.0
            currentTrack = nil
            return
        }

        // TODO: SPTAppRemote.playerAPI.pause() and reset
    }

    func seek(to position: Double) async throws {
        if useMock {
            guard let track = currentTrack else { return }
            playbackPosition = min(position, track.durationSeconds)
            return
        }

        // TODO: SPTAppRemote.playerAPI.seek(to: position)
    }

    // MARK: - Mock Playback

    private func startMockPlayback() {
        Task {
            while isPlaying, let track = currentTrack {
                try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 second
                if playbackPosition < track.durationSeconds {
                    playbackPosition += 0.1
                } else {
                    isPlaying = false
                    playbackPosition = 0.0
                }
            }
        }
    }

    // MARK: - Search (delegates to APIClient)

    func searchTracks(query: String) async throws -> [Track] {
        let response = try await APIClient.shared.searchTracks(query: query)
        return response.tracks
    }
}

// MARK: - Real Spotify SDK Integration Notes

/*
 When integrating real Spotify iOS SDK:

 1. Add Spotify SDK dependency:
    - SPM: Add https://github.com/spotify/ios-sdk
    - Or use CocoaPods: pod 'SpotifyiOS'

 2. Configure Info.plist:
    - Add URL scheme for OAuth callback
    - Add LSApplicationQueriesSchemes: ["spotify"]

 3. Configure in AppDelegate/SceneDelegate:
    ```swift
    let configuration = SPTConfiguration(
        clientID: "c7542388e8dc4ee18d0496383e1d0443",
        redirectURL: URL(string: "dropzone://callback")!
    )
    let sessionManager = SPTSessionManager(
        configuration: configuration,
        delegate: self
    )
    ```

 4. Handle OAuth callback:
    ```swift
    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        sessionManager.application(UIApplication.shared, open: url)
    }
    ```

 5. Initialize AppRemote for playback:
    ```swift
    let appRemote = SPTAppRemote(
        configuration: configuration,
        logLevel: .debug
    )
    appRemote.connect()
    ```

 6. Play tracks:
    ```swift
    appRemote.playerAPI?.play(track.spotifyURI) { result, error in
        // Handle result
    }
    ```
 */
