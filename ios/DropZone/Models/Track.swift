import Foundation

struct Track: Codable, Identifiable, Equatable {
    let id: String
    let title: String
    let artist: String
    let album: String
    let durationMs: Int
    let spotifyURI: String
    let previewURL: String?
    let bpm: Int?
    let key: Int?
    let mode: Int?
    let energy: Double?
    let danceability: Double?
    let valence: Double?

    enum CodingKeys: String, CodingKey {
        case id
        case title
        case artist
        case album
        case durationMs = "duration_ms"
        case spotifyURI = "spotify_uri"
        case previewURL = "preview_url"
        case bpm
        case key
        case mode
        case energy
        case danceability
        case valence
    }

    // Computed property for duration in seconds
    var durationSeconds: Double {
        return Double(durationMs) / 1000.0
    }

    // Formatted duration (e.g., "5:23")
    var formattedDuration: String {
        let totalSeconds = Int(durationSeconds)
        let minutes = totalSeconds / 60
        let seconds = totalSeconds % 60
        return String(format: "%d:%02d", minutes, seconds)
    }

    // Key name (0 = C, 1 = C#, 2 = D, etc.)
    var keyName: String? {
        guard let key = key else { return nil }
        let keys = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]
        guard key >= 0 && key < keys.count else { return nil }
        let modeName = mode == 1 ? "" : "m"
        return "\(keys[key])\(modeName)"
    }
}
