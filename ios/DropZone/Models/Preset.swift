import Foundation

struct Preset: Codable, Identifiable, Equatable {
    let id: Int
    let name: String
    let description: String?
    let eq: EQSettings
    let effects: EffectSettings?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case description
        case eq
        case effects
        case createdAt = "created_at"
    }
}

struct EffectSettings: Codable, Equatable {
    let reverb: Double?
    let delay: Double?
    let filter: Double?
}

// Request model for creating a preset
struct CreatePresetRequest: Codable {
    let name: String
    let description: String?
    let eq: EQSettings
    let effects: EffectSettings?
}
