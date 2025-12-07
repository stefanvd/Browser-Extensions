//
//  GuideView.swift
//  Full Screen for Safari
//
//  Created by Stefan Van Damme on 26/07/2025.
//

import SwiftUI
import AVKit
import AVFoundation

struct Page1: View{
    @State private var animate = false
    @Environment(\.accessibilityReduceMotion) var reduceMotion

    var body: some View{
        VStack{
            VStack{
                HStack{
                    Image(.totlIosGuideLarge1)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 210, height: 100)
                        .accessibilityHidden(true)
                    Image(.totlIosGuideSmall3)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 100, height: 100)
                        .accessibilityHidden(true)
                }
                HStack{
                    Image(.totlIosGuideSmall4)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 100, height: 100)
                        .accessibilityHidden(true)
                    VStack{
                        #if os(iOS)
                        if #available(iOS 26.0, *) {
                            Image(.template)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width:64, height:64)
                                .foregroundStyle(.tint)
                                .padding(15)
                                .glassEffect(in: .rect(cornerRadius: 16.0))
                        } else {
                            Image(.template)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width:64, height:64)
                                .foregroundStyle(.tint)
                                .padding(15)
                        }
                        #elseif os(visionOS)
                        Image(.template)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width:64, height:64)
                            .foregroundStyle(.tint)
                            .padding(15)
                            .glassBackgroundEffect(in: .rect(cornerRadius: 16))
                        #else
                        // macOS fallback without glass effect
                        Image(.template)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width:64, height:64)
                            .foregroundStyle(.tint)
                            .padding(15)
                        #endif
                    }.frame(width: 100, height: 100)
                    .accessibilityHidden(true)

                    Image(.totlIosGuideSmall2)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 100, height: 100)
                        .accessibilityHidden(true)
                }
                HStack{
                    Image(.totlIosGuideSmall1)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 100, height: 100)
                        .accessibilityHidden(true)
                    Image(.totlIosGuideLarge2)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 210, height: 100)
                        .accessibilityHidden(true)
                }
            }
            .padding(.bottom, 32)
            
            Text("Welcome")
              .fontWeight(.bold)
              .font(.title)
              .multilineTextAlignment(.center)
              .padding(.bottom, 8)
              .opacity(animate ? 1 : 0)
              .offset(y: animate ? 0 : 20)
              .animation(
                  reduceMotion
                      ? .none
                      : .easeOut(duration: 1.0).delay(1.0),
                  value: animate
              )
          
            Text("Let us walk you through the awesome Rotate that Video Player Safari extension features.")
              .multilineTextAlignment(.center)
              .opacity(animate ? 1 : 0)
              .offset(y: animate ? 0 : 20)
              .animation(
                  reduceMotion
                      ? .none
                      : .easeOut(duration: 1.0).delay(2.0),
                  value: animate
              )
              .padding()
        }
        .padding()
        .onAppear {
            // If reduce motion is enabled, skip animation
            if reduceMotion {
                animate = true
            } else {
                withAnimation {
                    animate = true
                }
            }
        }
        
    }
}

struct Page2: View{
    var body: some View{
        ScrollView{
            VStack{
                VStack{
                    Image(systemName: "lock.shield.fill")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .foregroundStyle(.tint)
                        .frame(width:200, height:200)
                        .accessibilityHidden(true)
                }
                .frame(
                      minWidth: 0,
                      maxWidth: .infinity,
                      minHeight: 425,
                      maxHeight: 425,
                      alignment: .center
                    )
                .background(.thinMaterial)
                .accessibilityHidden(true)
                
                VStack(alignment: .leading){
                    HStack{
                        VStack(alignment: .leading, spacing: 10){
                            Text("Permissions")
                                .font(.subheadline)
                            Text("Privacy and Open-Source")
                                .font(.headline)
                                .fontWeight(.bold)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 4)
                                        .foregroundStyle(.tint)
                                        .offset(y: 16),
                                    alignment: .bottomLeading
                                    
                                )
                        }
                        
                        Spacer()
                        
                        Button(action: {
                            StefanFunctions().openURL(URL(string: StefanLinks().linksourcecode())!)
                        }) {
                            HStack(spacing:10) {
                                Text("GitHub")
                            }
                        }
                        .buttonStyle(.bordered)
                        .tint(.blue)
                        .accessibilityHint(Text("Opens in your web browser"))
                    }
                    .padding(.bottom, 30)
                    
                    Text("I take your privacy and security very seriously. I built the Rotate that Video Player browser extension with my users in mind first, to ensure a great web experience for everyone. When you add Rotate that Video Player, the browser states that it can \"Read and change all your data on the websites you visit\". This permission is required only so that Rotate that Video Player can control the current video on the web page. I have never collected, and will never collect, any personal data, credit card information, browsing history, or passwords.\n\nFurthermore, the Rotate that Video Player browser extension is free and Open-Source with the source code publicly available on GitHub.")
                     
                    Link(destination: URL(string: "https://github.com/stefanvd/Browser-Extensions/tree/master/Rotate-that-Video-Player/Rotate-that-Video-Player-browser-extension")!) {
                        Text("https://github.com/stefanvd/Browser-Extensions/tree/master/Rotate-that-Video-Player/Rotate-that-Video-Player-browser-extension")
                            .multilineTextAlignment(.leading)
                            .lineLimit(nil)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    
                    Spacer(minLength: 100)
                }
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity, alignment: .topLeading)
                .padding()
            }
        }
        //.frame(width: .infinity, height: .infinity)
        
    }
}

struct Page3: View{
    var body: some View{
        ScrollView{
            VStack{
                VStack{
                    Image(.totlIosGuideImage1)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width:320, height:320)
                        .accessibilityHidden(true)
                }
                .frame(
                      minWidth: 0,
                      maxWidth: .infinity,
                      minHeight: 425,
                      maxHeight: 425,
                      alignment: .center
                    )
                .background(.thinMaterial)
                .accessibilityHidden(true)
                
                VStack(alignment: .leading){
                    VStack(alignment: .leading, spacing: 10){
                        Text("Button")
                            .font(.subheadline)
                        Text("Quick Menu")
                            .font(.headline)
                            .fontWeight(.bold)
                            .overlay(
                                Rectangle()
                                    .frame(height: 4)
                                    .foregroundStyle(.tint)
                                    .offset(y: 16),
                                alignment: .bottomLeading
                                
                            )
                    }
                    .padding(.bottom, 30)
                    
                    Text("When you tap the rotate icon, a quick menu appears where you can instantly adjust the video player. You can rotate it to your desired angle using the slider. You can also move the video up and down, shift it left or right, and resize it to make it smaller or larger.")
                    
                    Spacer(minLength: 100)
                }
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity, alignment: .topLeading)
                .padding()
            }
        }
        //.frame(width: .infinity, height: .infinity)
        
    }
}

struct Page4: View{
    var body: some View{
        ScrollView{
            VStack{
                VStack{
                    Image(.totlIosGuideImage2)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width:320, height:320)
                        .accessibilityHidden(true)
                }
                .frame(
                      minWidth: 0,
                      maxWidth: .infinity,
                      minHeight: 425,
                      maxHeight: 425,
                      alignment: .center
                    )
                .background(.thinMaterial)
                .accessibilityHidden(true)
                
                VStack(alignment: .leading){
                    HStack{
                        VStack(alignment: .leading, spacing: 10){
                            Text("Settings")
                                .font(.subheadline)
                            Text("Select which slider to show")
                                .font(.headline)
                                .fontWeight(.bold)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 4)
                                        .foregroundStyle(.tint)
                                        .offset(y: 16),
                                    alignment: .bottomLeading
                                    
                                )
                        }
                        
//                        Spacer()
//                        
//                        Button(action: {
//                            StefanFunctions().openyoutubeapporweb(text: "fsxi4Ehxb4g")
//                        }) {
//                            HStack(spacing:10) {
//                                Text("Watch Video")
//                            }
//                        }
//                        .buttonStyle(.bordered)
//                        .tint(.blue)
//                        .accessibilityHint(Text("Opens in your web browser"))
                    }
                    .padding(.bottom, 30)
                    
                    Text("On the Rotate-that-Video Player Options page, you can choose which sliders you want to display in the popup panel. You can also enable the reset button, which restores all values to the default video settings.")
                    
                    Spacer(minLength: 100)
                }
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity, alignment: .topLeading)
                .padding()
            }
        }
        //.frame(width: .infinity, height: .infinity)
        
    }
}

struct Page5: View{
    var body: some View{
        ScrollView{
            VStack{
                VStack{
                    Image(.totlIosGuideImage3)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width:320, height:320)
                        .accessibilityHidden(true)
                }
                .frame(
                      minWidth: 0,
                      maxWidth: .infinity,
                      minHeight: 425,
                      maxHeight: 425,
                      alignment: .center
                    )
                .background(.thinMaterial)
                .accessibilityHidden(true)
                
                VStack(alignment: .leading){
                    HStack{
                        VStack(alignment: .leading, spacing: 10){
                            Text("Settings")
                                .font(.subheadline)
                            Text("Customizable Icon")
                                .font(.headline)
                                .fontWeight(.bold)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 4)
                                        .foregroundStyle(.tint)
                                        .offset(y: 16),
                                    alignment: .bottomLeading
                                    
                                )
                        }
                        
//                        Spacer()
//                        
//                        Button(action: {
//                            StefanFunctions().openyoutubeapporweb(text: "fsxi4Ehxb4g")
//                        }) {
//                            HStack(spacing:10) {
//                                Text("Watch Video")
//                            }
//                        }
//                        .buttonStyle(.bordered)
//                        .tint(.blue)
//                        .accessibilityHint(Text("Opens in your web browser"))
                    }
                    .padding(.bottom, 30)
                    
                    Text("It includes a customizable toolbar icon, allowing you to personalize your experience. Choose from multiple styles and colors to match your preferences. It is a small touch that makes the extension feel more natural and intuitive to use.")
                    
                    Spacer(minLength: 100)
                }
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity, alignment: .topLeading)
                .padding()
            }
        }
        //.frame(width: .infinity, height: .infinity)
        
    }
}

struct CustomVideoPlayer: UIViewControllerRepresentable {
    let player: AVPlayer

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        controller.player = player
        controller.showsPlaybackControls = false
        controller.videoGravity = .resizeAspectFill
        return controller
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        // no-op
    }
}

struct Page7: View{
    // AVQueuePlayer with AVPlayerLooper for infinite looping
    private let player: AVQueuePlayer
    private let looper: AVPlayerLooper?

    init() {
        if let url = Bundle.main.url(forResource: "forest", withExtension: "mov") {
            let item = AVPlayerItem(url: url)
            let queuePlayer = AVQueuePlayer()
            self.player = queuePlayer
            self.player.isMuted = true
            self.looper = AVPlayerLooper(player: queuePlayer, templateItem: item)
        } else {
            fatalError("Video file 'forest.mov' not found in bundle.")
        }
    }
    
    var body: some View{
        ScrollView{
            VStack{
                
                ZStack(alignment: .top){
                    CustomVideoPlayer(player: player)
                        .frame(height: 220)
                        .clipped()
                        .onAppear {
                            player.play()
                        }
                        .accessibilityHidden(true)
    
                    VStack{
                        #if os(iOS)
                        if #available(iOS 26.0, *) {
                            Image(.template)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width:64, height:64)
                                .foregroundStyle(.tint)
                                .padding(15)
                                .glassEffect(in: .rect(cornerRadius: 16.0))
                        } else {
                            Image(.template)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width:64, height:64)
                                .foregroundStyle(.tint)
                                .padding(15)
                        }
                        #elseif os(visionOS)
                        Image(.template)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width:64, height:64)
                            .foregroundStyle(.tint)
                            .padding(15)
                            .glassBackgroundEffect(in: .rect(cornerRadius: 16))
                        #else
                        // macOS fallback without glass effect
                        Image(.template)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width:64, height:64)
                            .foregroundStyle(.tint)
                            .padding(15)
                        #endif
                    }
                    .frame(
                        minWidth: 0,
                        maxWidth: .infinity,
                        minHeight: 220,
                        maxHeight: 220,
                        alignment: .center
                    )
                    .accessibilityHidden(true)
                }
                
                VStack(alignment: .leading){
                    HStack{
                        VStack(alignment: .leading, spacing: 10){
                            Text("Easy to set this up")
                                .font(.subheadline)
                            Text("Activate")
                                .font(.headline)
                                .fontWeight(.bold)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 4)
                                        .foregroundStyle(.tint)
                                        .offset(y: 16),
                                    alignment: .bottomLeading
                                    
                                )
                        }
                        
//                        Spacer()
//                        
//                        Button(action: {
//                            StefanFunctions().openyoutubeapporweb(text: "fsxi4Ehxb4g")
//                        }) {
//                            HStack(spacing:10) {
//                                Text("Watch Video")
//                            }
//                        }
//                        .buttonStyle(.bordered)
//                        .tint(.blue)
//                        .accessibilityHint(Text("Opens in your web browser"))
                    }
                    .padding(.bottom, 30)
                    
                    HStack(spacing: 20) {
                        Image(systemName: "1.circle.fill")
                            .resizable()
                            .foregroundStyle(.tint)
                            .frame(width: 35, height: 35)
                            .accessibilityHidden(true)
                        Text("Leave this app")
                    }

                    HStack(spacing: 20) {
                        Image(systemName: "2.circle.fill")
                            .resizable()
                            .foregroundStyle(.tint)
                            .frame(width: 35, height: 35)
                            .accessibilityHidden(true)
                        Text("Open the **\"Settings\"** app on your device")
                    }

                    HStack(spacing: 20) {
                        Image(systemName: "3.circle.fill")
                            .resizable()
                            .foregroundStyle(.tint)
                            .frame(width: 35, height: 35)
                            .accessibilityHidden(true)
                        Text("Scroll down and tap **\"Apps\"**")
                    }

                    HStack(spacing: 20) {
                        Image(systemName: "4.circle.fill")
                            .resizable()
                            .foregroundStyle(.tint)
                            .frame(width: 35, height: 35)
                            .accessibilityHidden(true)
                        Text("Select **\"Safari\"**, then tap **\"Extensions\"**")
                    }

                    HStack(spacing: 20) {
                        Image(systemName: "5.circle.fill")
                            .resizable()
                            .foregroundStyle(.tint)
                            .frame(width: 35, height: 35)
                            .accessibilityHidden(true)
                        Text("Enable **\"Rotate that Video Player\"**")
                    }
                    
                    Spacer(minLength: 100)
                }
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity, alignment: .topLeading)
                .padding()
            }
        }
        //.frame(width: .infinity, height: .infinity)
        
    }
}

struct GuideView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        ZStack(alignment: .topTrailing) {
            TabView {
                Tab() {
                    Page1()
                }
                Tab() {
                   Page2()
                }
                Tab() {
                    Page3()
                }
                Tab() {
                    Page4()
                }
                Tab() {
                    Page5()
                }
                Tab() {
                    Page7()
                }
            }
            #if os(iOS) || os(visionOS)
            .tabViewStyle(.page)
            .indexViewStyle(.page(backgroundDisplayMode: .always))
            #endif
            
            // Manual Close Button
            #if os(visionOS)
            Button(action: {
                dismiss()
            }) {
                Label("Close", systemImage: "xmark")
                    .labelStyle(.iconOnly)
            }
            .padding(16)
            #elseif os(iOS)
            Button(action: {
                dismiss()
            }) {
                if #available(iOS 26.0, *) {
                    Image(systemName: "xmark")
                        .font(.system(size: 16, weight: .bold))
                        .frame(width: 36, height: 36)
                        .foregroundStyle(.primary)
                        .background(.ultraThinMaterial, in: Circle())
                        .glassEffect()
                } else {
                    // Fallback on earlier versions
                    Image(systemName: "xmark")
                        .font(.system(size: 16, weight: .bold))
                        .frame(width: 36, height: 36)
                        .foregroundStyle(.primary)
                        .background(.ultraThinMaterial, in: Circle())
                }
            }
            .padding(16)
            .accessibilityLabel("Close")
            #else
            // macOS close button (simple fallback)
            Button(action: {
                dismiss()
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .bold))
                    .frame(width: 28, height: 28)
                    .foregroundStyle(.primary)
                    .background(.thinMaterial, in: Circle())
            }
            .buttonStyle(.plain)
            .padding(16)
            .accessibilityLabel("Close")
            #endif
        }
        .accessibilityAddTraits(.isModal)
        
    }
}

#Preview {
    GuideView()
}
