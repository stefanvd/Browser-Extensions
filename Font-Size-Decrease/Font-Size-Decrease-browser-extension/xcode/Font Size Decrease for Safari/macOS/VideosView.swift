//
//  VideoView.swift
//  Font Size Decrease for Safari
//
//  Created by Stefan Van Damme on 26/07/2025.
//

import SwiftUI
import SafariServices
import AVFoundation
import AVKit

struct VideosView: View {
    let videoProducts: [VideoApp] =  [
        VideoApp(appName: "🔍 Zoom browser extension", appDownloadLink: "vNJ2FfBrn70"),
        VideoApp(appName: "➕ Proper Menubar browser extension", appDownloadLink: "0wAsMxqeMfE"),
        VideoApp(appName: "🖨️ Print browser extension", appDownloadLink: "CXJm-KLNHTI"),
        VideoApp(appName: "📐 Font Size Increase & Font Size Decrease browser extension", appDownloadLink: "P02tiIL9OGw"),
        VideoApp(appName: "📺 Rotate that Video Player browser extension", appDownloadLink: "xwYHlDirdF8"),
        VideoApp(appName: "🕓 Date Today browser extension", appDownloadLink: "hj-UqAG9IJc"),
        VideoApp(appName: "💻 Full Screen browser extension", appDownloadLink: "GGwmhC6QTSA"),
        VideoApp(appName: "🗂️ Page Sidebar browser extension", appDownloadLink: "1Wbs_etCkTs"),
        VideoApp(appName: "📝 Note Sidebar browser extension", appDownloadLink: "KljdoQuUcKE"),
        VideoApp(appName: "❄️ Snow browser extension", appDownloadLink: "yOmeDeuCbCc"),
        VideoApp(appName: "🖼️ Ambient Aurea browser extension", appDownloadLink: "QICyS0w3w9k"),
        VideoApp(appName: "Stefan vd introduction", appDownloadLink: "fsxi4Ehxb4g")
      ]
    
    private let player = AVPlayer(url: Bundle.main.url(forResource: "forest", withExtension: "mov")!)
    
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
 
    var body: some View {
        NavigationStack{
            Form{
                Section{
                    ZStack(alignment:.leading) {
                        VStack(spacing:0){
                            VideoPlayerView(player: player, showsPlaybackControls: false)
                                .frame(height: 100)
                                .edgesIgnoringSafeArea(.all)
                                .allowsHitTesting(false)
                                .onAppear {
                                    if reduceMotion == false {
                                        startLoopingVideo()
                                    } else {
                                        stopVideo()
                                    }
                                }
                                .onChange(of: reduceMotion) { _, newValue in
                                    if newValue == false {
                                        startLoopingVideo()
                                    } else {
                                        stopVideo()
                                    }
                                }
                                .overlay(alignment: .bottomLeading) {
                                    Group {
                                        if reduceTransparency {
                                            LinearGradient(
                                                colors: [
                                                    Color.black.opacity(colorScheme == .dark ? 0.55 : 0.65),
                                                    Color.black.opacity(colorScheme == .dark ? 0.35 : 0.45),
                                                    Color.clear
                                                ],
                                                startPoint: .bottom,
                                                endPoint: .top
                                            )
                                        } else {
                                            LinearGradient(
                                                colors: [
                                                    Color.black.opacity(0.55),
                                                    Color.black.opacity(0.30),
                                                    Color.clear
                                                ],
                                                startPoint: .bottom,
                                                endPoint: .top
                                            )
                                        }
                                    }
                                    .frame(height: 100)
                                }
                        }
                        
                        HStack {
                            Image("share-stefanvd")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 72, height: 72)
                                .cornerRadius(8)
                            VStack(alignment: .leading, spacing: 6){
                                Text("Stefan vd")
                                    .font(.headline)
                                    .foregroundStyle(.white)
                                    .shadow(color: .black.opacity(0.6), radius: 2, x: 0, y: 1)
                                Button(action: {
                                    if let url = URL(string: "https://www.youtube.com/@stefanvandamme?sub_confirmation=1") {
                                        StefanFunctions().openURL(url)
                                    }
                                }) {
                                    Text("Subscribe")
                                        .font(.subheadline.weight(.semibold))
                                }
                                .buttonStyle(.borderedProminent)
                                .controlSize(.small)
                            }
                            
                        }
                        .padding(.horizontal, 25)
                    }
                }
                .padding(-10)
 
                Section(){
                    ScrollView {
                        let columns = Array(repeating: GridItem(.flexible(), spacing: 16, alignment: .top), count: 3)
                        LazyVGrid(columns: columns, alignment: .leading, spacing: 16) {
                            ForEach(videoProducts, id: \.appName) { video in
                                Button {
                                    StefanLinks().openURL(video.youtubeURL)
                                } label: {
                                    VideoCard(video: video)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                    }
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                }
                
                Section {
                    Button {
                        if let url = URL(string: "https://www.youtube.com/@stefanvandamme/videos") {
                            StefanFunctions().openURL(url)
                        }
                    } label: {
                        HStack {
                            Image(systemName: "play.rectangle.on.rectangle")
                            Text("See more videos")
                        }
                        .frame(maxWidth: .infinity, alignment: .center)
                    }
                    .buttonStyle(.borderedProminent)
                }
                .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0))
                .listRowBackground(Color.clear)
                
            }
            .formStyle(.grouped)
            .navigationTitle("Videos")
            
        }
    }
    
    private func startLoopingVideo() {
        player.isMuted = true
        player.actionAtItemEnd = .none
        player.play()
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: player.currentItem,
            queue: nil
        ) { _ in
            player.seek(to: .zero)
            player.play()
        }
    }

    private func stopVideo() {
        player.pause()
    }
}

struct VideoPlayerView: NSViewRepresentable {
    let player: AVPlayer
    let showsPlaybackControls: Bool

    func makeNSView(context: Context) -> AVPlayerView {
        let playerView = AVPlayerView()
        playerView.controlsStyle = showsPlaybackControls ? .default : .none
        playerView.player = player
        playerView.videoGravity = .resizeAspectFill
        player.isMuted = true
        player.actionAtItemEnd = .none
        return playerView
    }

    func updateNSView(_ nsView: AVPlayerView, context: Context) {
        nsView.player = player
    }
}

struct VideoRow: View {
    @State private var thumbnailImage: NSImage?

    let video: VideoApp

    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            Text("")
            HStack(alignment: .top, spacing: 12){
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.gray.opacity(0.25))
                        .frame(width: 280, height: 157)
                    if let thumbnailImage = thumbnailImage {
                        Image(nsImage: thumbnailImage)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 280, height: 157)
                            .cornerRadius(8)
                    } else {
                        Image(systemName: "photo")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 64, height: 64)
                            .foregroundStyle(.secondary)
                    }
                }
                Text(video.appName)
                    .font(.headline)
                    .foregroundStyle(.primary)
            }
        }
        .onAppear {
            fetchThumbnail()
        }
    }

    private func fetchThumbnail() {
        let url = URL(string: "https://img.youtube.com/vi/\(video.appDownloadLink)/maxresdefault.jpg")!

        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Failed to fetch thumbnail:", error?.localizedDescription ?? "")
                return
            }

            DispatchQueue.main.async {
                self.thumbnailImage = NSImage(data: data)
            }
        }.resume()
    }
}

struct VideoCard: View {
    @State private var thumbnailImage: NSImage?
    let video: VideoApp

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.gray.opacity(0.22))
                    .aspectRatio(16/9, contentMode: .fit)
                if let image = thumbnailImage {
                    Image(nsImage: image)
                        .resizable()
                        .aspectRatio(16/9, contentMode: .fit)
                        .cornerRadius(8)
                } else {
                    Image(systemName: "photo")
                        .font(.system(size: 28, weight: .regular))
                        .foregroundStyle(.secondary)
                        .padding(12)
                }
            }
            Text(video.appName)
                .font(.headline)
                .multilineTextAlignment(.leading)
                .lineLimit(nil)
                .foregroundStyle(.primary)
                .frame(maxWidth: .infinity, alignment: .topLeading)
        }
        .onAppear {
            fetchThumbnail()
        }
    }

    private func fetchThumbnail() {
        let url = URL(string: "https://img.youtube.com/vi/\(video.appDownloadLink)/maxresdefault.jpg")!
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else { return }
            DispatchQueue.main.async {
                self.thumbnailImage = NSImage(data: data)
            }
        }.resume()
    }
}

struct VideoApp {
    let appName: String
    let appDownloadLink: String

    var youtubeURL: URL {
        return URL(string: "https://www.youtube.com/watch?v=\(appDownloadLink)")!
    }
}

#Preview {
    VideosView()
}
