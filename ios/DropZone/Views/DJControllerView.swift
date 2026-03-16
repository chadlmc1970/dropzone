import SwiftUI

/// Main DJ Controller view with dual decks and mixer
struct DJControllerView: View {
    @StateObject private var viewModel = DJControllerViewModel()
    @State private var showTrackSearch = false

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.15)],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Decks row
                    HStack(spacing: 16) {
                        // Deck 1
                        DeckView(
                            deckIndex: 1,
                            track: viewModel.deck1Track,
                            isPlaying: viewModel.deck1IsPlaying,
                            volume: viewModel.deck1Volume,
                            eq: viewModel.deck1EQ,
                            onPlayPause: { viewModel.togglePlayback(deckIndex: 1) },
                            onStop: { viewModel.stopDeck(deckIndex: 1) },
                            onVolumeChange: { viewModel.setVolume(deckIndex: 1, volume: $0) },
                            onEQChange: { high, mid, low in
                                viewModel.setEQ(deckIndex: 1, high: high, mid: mid, low: low)
                            },
                            onLoadTrack: { showTrackSearch = true }
                        )

                        // Deck 2
                        DeckView(
                            deckIndex: 2,
                            track: viewModel.deck2Track,
                            isPlaying: viewModel.deck2IsPlaying,
                            volume: viewModel.deck2Volume,
                            eq: viewModel.deck2EQ,
                            onPlayPause: { viewModel.togglePlayback(deckIndex: 2) },
                            onStop: { viewModel.stopDeck(deckIndex: 2) },
                            onVolumeChange: { viewModel.setVolume(deckIndex: 2, volume: $0) },
                            onEQChange: { high, mid, low in
                                viewModel.setEQ(deckIndex: 2, high: high, mid: mid, low: low)
                            },
                            onLoadTrack: { showTrackSearch = true }
                        )
                    }
                    .frame(height: geometry.size.height * 0.6)
                    .padding()

                    // Mixer section
                    MixerView(
                        crossfaderPosition: $viewModel.crossfaderPosition,
                        mainVolume: $viewModel.mainVolume,
                        onCrossfaderChange: { viewModel.setCrossfader($0) },
                        onMainVolumeChange: { viewModel.setMainVolume($0) },
                        onSyncDecks: { viewModel.syncDecks() }
                    )
                    .frame(height: geometry.size.height * 0.3)
                    .padding()

                    Spacer()
                }
            }
        }
        .sheet(isPresented: $showTrackSearch) {
            TrackSearchView(viewModel: viewModel)
        }
    }
}

// MARK: - Track Search View

struct TrackSearchView: View {
    @ObservedObject var viewModel: DJControllerViewModel
    @Environment(\.dismiss) var dismiss
    @State private var selectedDeck: Int = 1

    var body: some View {
        NavigationView {
            VStack {
                // Deck selector
                Picker("Deck", selection: $selectedDeck) {
                    Text("Deck 1").tag(1)
                    Text("Deck 2").tag(2)
                }
                .pickerStyle(.segmented)
                .padding()

                // Search bar
                HStack {
                    TextField("Search tracks...", text: $viewModel.searchQuery)
                        .textFieldStyle(.roundedBorder)
                        .onSubmit {
                            Task { await viewModel.searchTracks() }
                        }

                    Button("Search") {
                        Task { await viewModel.searchTracks() }
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding(.horizontal)

                // Results list
                if viewModel.isSearching {
                    ProgressView("Searching...")
                        .padding()
                } else if viewModel.searchResults.isEmpty {
                    Text("No results")
                        .foregroundColor(.secondary)
                        .padding()
                } else {
                    List(viewModel.searchResults) { track in
                        Button {
                            Task {
                                await viewModel.loadTrack(track, toDeck: selectedDeck)
                                dismiss()
                            }
                        } label: {
                            TrackRow(track: track)
                        }
                    }
                }
            }
            .navigationTitle("Load Track")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}

struct TrackRow: View {
    let track: Track

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(track.title)
                .font(.headline)

            Text(track.artist)
                .font(.subheadline)
                .foregroundColor(.secondary)

            HStack {
                if let bpm = track.bpm {
                    Text("\(bpm) BPM")
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.blue.opacity(0.2))
                        .cornerRadius(4)
                }

                if let keyName = track.keyName {
                    Text(keyName)
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.purple.opacity(0.2))
                        .cornerRadius(4)
                }

                Text(track.formattedDuration)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    DJControllerView()
}
