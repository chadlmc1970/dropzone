import Foundation

@MainActor
class APIClient: ObservableObject {
    static let shared = APIClient()

    private let baseURL = "https://dropzone-api.onrender.com"
    private let useMock = true // Toggle to false when backend is ready

    @Published var isAuthenticated = false
    private var accessToken: String?

    private init() {}

    // MARK: - Authentication

    func login(email: String, password: String) async throws -> AuthResponse {
        if useMock {
            return mockLogin()
        }

        let request = LoginRequest(email: email, password: password, token: nil)
        let response: AuthResponse = try await post("/api/auth/login", body: request)
        accessToken = response.accessToken
        isAuthenticated = true
        return response
    }

    func logout() async throws {
        if useMock {
            isAuthenticated = false
            accessToken = nil
            return
        }

        try await post("/api/auth/logout", body: EmptyRequest())
        isAuthenticated = false
        accessToken = nil
    }

    func getCurrentUser() async throws -> User {
        if useMock {
            return mockUser()
        }

        return try await get("/api/users/me")
    }

    // MARK: - Tracks

    func searchTracks(query: String, limit: Int = 20) async throws -> TracksResponse {
        if useMock {
            return mockSearchResults(query: query)
        }

        let queryItems = [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await get("/api/tracks/search", queryItems: queryItems)
    }

    func getTrackDetails(spotifyURI: String) async throws -> Track {
        if useMock {
            return mockTrackDetails(spotifyURI: spotifyURI)
        }

        let encodedURI = spotifyURI.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? spotifyURI
        return try await get("/api/tracks/\(encodedURI)")
    }

    // MARK: - Mixes

    func getMixes(limit: Int = 10, offset: Int = 0) async throws -> MixesResponse {
        if useMock {
            return mockMixes()
        }

        let queryItems = [
            URLQueryItem(name: "limit", value: "\(limit)"),
            URLQueryItem(name: "offset", value: "\(offset)")
        ]
        return try await get("/api/mixes", queryItems: queryItems)
    }

    func createMix(_ request: CreateMixRequest) async throws -> Mix {
        if useMock {
            return mockCreateMix(request)
        }

        return try await post("/api/mixes", body: request)
    }

    // MARK: - Health

    func healthCheck() async throws -> HealthResponse {
        if useMock {
            return HealthResponse(status: "healthy", version: "1.0.0-mock")
        }

        return try await get("/health")
    }

    // MARK: - Network Layer

    private func get<T: Decodable>(_ path: String, queryItems: [URLQueryItem]? = nil) async throws -> T {
        var urlComponents = URLComponents(string: baseURL + path)!
        urlComponents.queryItems = queryItems

        var request = URLRequest(url: urlComponents.url!)
        request.httpMethod = "GET"
        addAuthHeader(to: &request)

        return try await performRequest(request)
    }

    private func post<T: Encodable, U: Decodable>(_ path: String, body: T) async throws -> U {
        var request = URLRequest(url: URL(string: baseURL + path)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        addAuthHeader(to: &request)

        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        request.httpBody = try encoder.encode(body)

        return try await performRequest(request)
    }

    private func addAuthHeader(to request: inout URLRequest) {
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
    }

    private func performRequest<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }

        if httpResponse.statusCode >= 400 {
            let apiError = try? JSONDecoder().decode(APIError.self, from: data)
            throw apiError ?? URLError(.badServerResponse)
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601

        return try decoder.decode(T.self, from: data)
    }

    // MARK: - Mock Data

    private func mockLogin() -> AuthResponse {
        accessToken = "mock_token_\(UUID().uuidString)"
        isAuthenticated = true
        return AuthResponse(
            accessToken: accessToken!,
            refreshToken: "mock_refresh_token",
            expiresIn: 3600
        )
    }

    private func mockUser() -> User {
        return User(
            id: "mock_user_1",
            email: "dj@dropzone.app",
            name: "DJ Test User",
            spotifyConnected: true
        )
    }

    private func mockSearchResults(query: String) -> TracksResponse {
        let tracks = [
            Track(
                id: "mock1",
                title: "One More Time",
                artist: "Daft Punk",
                album: "Discovery",
                durationMs: 320000,
                spotifyURI: "spotify:track:mock1",
                previewURL: nil,
                bpm: 123,
                key: 9, // A
                mode: 1,
                energy: 0.85,
                danceability: 0.88,
                valence: 0.82
            ),
            Track(
                id: "mock2",
                title: "Get Lucky",
                artist: "Daft Punk",
                album: "Random Access Memories",
                durationMs: 365000,
                spotifyURI: "spotify:track:mock2",
                previewURL: nil,
                bpm: 116,
                key: 6, // F#
                mode: 0,
                energy: 0.78,
                danceability: 0.91,
                valence: 0.89
            ),
            Track(
                id: "mock3",
                title: "Around the World",
                artist: "Daft Punk",
                album: "Homework",
                durationMs: 429000,
                spotifyURI: "spotify:track:mock3",
                previewURL: nil,
                bpm: 121,
                key: 2, // D
                mode: 0,
                energy: 0.72,
                danceability: 0.85,
                valence: 0.76
            )
        ]

        return TracksResponse(tracks: tracks, total: tracks.count)
    }

    private func mockTrackDetails(spotifyURI: String) -> Track {
        return Track(
            id: "mock1",
            title: "One More Time",
            artist: "Daft Punk",
            album: "Discovery",
            durationMs: 320000,
            spotifyURI: spotifyURI,
            previewURL: nil,
            bpm: 123,
            key: 9,
            mode: 1,
            energy: 0.85,
            danceability: 0.88,
            valence: 0.82
        )
    }

    private func mockMixes() -> MixesResponse {
        let dateFormatter = ISO8601DateFormatter()
        let now = Date()

        let mixes = [
            Mix(
                id: 1,
                name: "Daft Punk Classics",
                track1URI: "spotify:track:mock1",
                track2URI: "spotify:track:mock2",
                transitionType: "club_beat",
                transitionPoint: 16,
                settings: MixSettings(
                    eq: EQSettings(high: 0.5, mid: 0.0, low: -0.5),
                    crossfader: 0.5
                ),
                durationSeconds: 180,
                createdAt: now
            )
        ]

        return MixesResponse(mixes: mixes, total: mixes.count)
    }

    private func mockCreateMix(_ request: CreateMixRequest) -> Mix {
        return Mix(
            id: Int.random(in: 1...1000),
            name: request.name,
            track1URI: request.track1URI,
            track2URI: request.track2URI,
            transitionType: request.transitionType,
            transitionPoint: request.transitionPoint,
            settings: request.settings,
            durationSeconds: request.durationSeconds,
            createdAt: Date()
        )
    }
}

// Empty request for endpoints with no body
private struct EmptyRequest: Encodable {}
