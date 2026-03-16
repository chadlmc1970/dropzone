import Foundation

// API Error Model
struct APIError: Codable, Error {
    let error: String
    let message: String
    let code: String?
}

extension APIError: LocalizedError {
    var errorDescription: String? {
        return message
    }
}

// Common API response wrappers
struct TracksResponse: Codable {
    let tracks: [Track]
    let total: Int
}

struct MixesResponse: Codable {
    let mixes: [Mix]
    let total: Int
}

struct HealthResponse: Codable {
    let status: String
    let version: String
}

// Auth models
struct LoginRequest: Codable {
    let email: String?
    let password: String?
    let token: String? // For Auth0 token exchange
}

struct AuthResponse: Codable {
    let accessToken: String
    let refreshToken: String?
    let expiresIn: Int?

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
    }
}

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String?
    let spotifyConnected: Bool?

    enum CodingKeys: String, CodingKey {
        case id
        case email
        case name
        case spotifyConnected = "spotify_connected"
    }
}
