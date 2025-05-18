//
//  ContentView.swift
//  Zoom for Safari
//
//  Created by Stefan Van Damme on 10/05/2025.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            HomeView()
            .tabItem {
                Label(StefanFunctions().i18string(text: "lblhome"), systemImage: "house.fill")
            }

            NewsView()
            .tabItem {
                Label(StefanFunctions().i18string(text: "lblnews"), systemImage: "newspaper.fill")
            }
            
            SettingsView()
            .tabItem {
                Label(StefanFunctions().i18string(text: "lblsettings"), systemImage: "gearshape.fill")
            }
        }
    }
}

#Preview(windowStyle: .automatic) {
    ContentView()
}
