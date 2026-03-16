import Foundation

struct Mix: Codable, Identifiable, Equatable {
    let id: Int
    let name: String
    let track1URI: String
    let track2URI: String
    let transitionType: String?
    let transitionPoint: Int?
    let settings: MixSettings?
    let durationSeconds: Int?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case track1URI = "track_1_uri"
        case track2URI = "track_2_uri"
        case transitionType = "transition_type"
        case transitionPoint = "transition_point"
        case settings
        case durationSeconds = "duration_seconds"
        case createdAt = "created_at"
    }
}

struct MixSettings: Codable, Equatable {
    let eq: EQSettings?
    let crossfader: Double?
}

struct EQSettings: Codable, Equatable {
    let high: Double
    let mid: Double
    let low: Double
}

// Request model for creating a mix
struct CreateMixRequest: Codable {
    let name: String
    let track1URI: String
    let track2URI: String
    let transitionType: String?
    let transitionPoint: Int?
    let settings: MixSettings?
    let durationSeconds: Int?

    enum CodingKeys: String, CodingKey {
        case name
        case track1URI = "track_1_uri"
        case track2URI = "track_2_uri"
        case transitionType = "transition_type"
        case transitionPoint = "transition_point"
        case settings
        case durationSeconds = "duration_seconds"
    }
}
