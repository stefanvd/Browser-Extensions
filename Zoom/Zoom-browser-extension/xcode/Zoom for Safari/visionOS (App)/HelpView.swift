//
//  HelpView.swift
//  Turn Off the Lights for Safari
//
//  Created by Stefan Van Damme on 28/02/2024.
//

import SwiftUI

struct MenuItem: Identifiable {
    let id = UUID()
    let title: String
    let url: URL
}

struct HelpView: View {
    @Environment(\.dismiss) var dismiss
    @State private var isShareSheetPresented = false
    
    let HelpItems: [MenuItem] = [
        MenuItem(title: StefanFunctions().i18string(text: "lbldeveloperwebsite"), url: URL(string: StefanLinks().linkdeveloperwebsite())!),
            MenuItem(title: StefanFunctions().i18string(text: "lblprivacypolicy"), url: URL(string: StefanLinks().linkprivacy())!),
            MenuItem(title: StefanFunctions().i18string(text: "lblhelpfeedback"), url: URL(string: StefanLinks().linksupport())!)
        ]
    
    let versionNumber = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "Unknown"

    var body: some View {
        NavigationStack {
            List {
                Section(header: Text(StefanFunctions().i18string(text: "lblabout"))){
                    HStack{
                        Text(StefanFunctions().i18string(text: "lblicon"))
                        Spacer()
                        Image("Abouticon")
                            .resizable()
                            .frame(width: 64, height: 64, alignment: .bottom)
                    }
                    
                    HStack{
                        Text(StefanFunctions().i18string(text: "lblname"))
                        Spacer()
                        Text("Zoom")
                    }
                    HStack{
                        Text(StefanFunctions().i18string(text: "lblversion"))
                        Spacer()
                        Text("\(versionNumber)")
                    }
                    HStack{
                        Text(StefanFunctions().i18string(text: "lblcopyright"))
                        Text("© 2025 Stefan vd")
                    }
                    NavigationLink {
                        LicensesView()
                    } label: {
                        Text(StefanFunctions().i18string(text: "lbllicenses"))
                    }
                }
                
                Section(header: Text(StefanFunctions().i18string(text: "lblhelp")))
                {
                    ForEach(HelpItems) { menuItem in  Button(action: {
                        openURL(menuItem.url)
                    }) {
                        Text(menuItem.title)
                    }
                    }
                }
                
                Section(header: Text(StefanFunctions().i18string(text: "lblyouandus")))
                {
                    NavigationLink {
                        OtherAppsView()
                    } label: {
                        Text(StefanFunctions().i18string(text: "lblotherapps"))
                    }
                    Button(action: {
                        openreview()
                    }) {
                        Text(StefanFunctions().i18string(text: "lblratereviewapp"))
                    }
                    
                    Button(action: {
                        openshare()
                    }) {
                        Text(StefanFunctions().i18string(text: "lblshareapp"))
                    }
                }
           }
        }
        .navigationTitle(StefanFunctions().i18string(text: "lblhelp"))
        .sheet(isPresented: $isShareSheetPresented) {
            ShareSheetView(activityItems: [productURL])
        }
    }
    
    var productURL = URL(string: StefanFunctions().webappzoom())!
    
    func openshare(){
        self.isShareSheetPresented.toggle()
    }
    
    func openreview() {
        // 1.
        var components = URLComponents(url: productURL, resolvingAgainstBaseURL: false)

        // 2.
        components?.queryItems = [
        URLQueryItem(name: "action", value: "write-review")
        ]

        // 3.
        guard let writeReviewURL = components?.url else {
        return
        }

        // 4.
        UIApplication.shared.open(writeReviewURL)
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

struct ShareSheetView: UIViewControllerRepresentable {
   typealias Callback = (_ activityType: UIActivity.ActivityType?, _ completed: Bool, _ returnedItems: [Any]?, _ error: Error?) -> Void
   let activityItems: [Any]
   let applicationActivities: [UIActivity]? = nil
   let excludedActivityTypes: [UIActivity.ActivityType]? = nil
   let callback: Callback? = nil
   func makeUIViewController(context: Context) -> UIActivityViewController {
       let controller = UIActivityViewController(
           activityItems: activityItems,
           applicationActivities: applicationActivities)
       controller.excludedActivityTypes = excludedActivityTypes
       controller.completionWithItemsHandler = callback
       return controller
   }
   func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {
       // nothing to do here
   }
}

#Preview {
    HelpView()
}
