//
//  LicensesView.swift
//  Turn Off the Lights for Safari
//
//  Created by Stefan Van Damme on 01/03/2024.
//

import SwiftUI

struct LicensesView: View {
    var body: some View {
        NavigationStack {
            List {
                Section(header: Text(StefanFunctions().i18string(text: "lblbrowserextension")))
                {
                    Button(action: {
                        openURL(URL(string: "https://www.stefanvd.net")!)
                    }) {
                        Text(StefanFunctions().i18string(text: "lblgpl"))
                    }

                }

           }
        }
        .navigationTitle(StefanFunctions().i18string(text: "lbllicenses"))
    }
    
    func opentranslate(_ sender: Any) {
        if let url = URL(string: StefanFunctions().webtranslate()) {
            UIApplication.shared.open(url)
        }
    }
    
    func openURL(_ url: URL) {
           guard let absoluteURL = URL(string: url.absoluteString) else { return }
           UIApplication.shared.open(absoluteURL)
    }
}

#Preview {
    LicensesView()
}
