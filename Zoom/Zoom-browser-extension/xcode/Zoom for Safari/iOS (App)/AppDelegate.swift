//
//  AppDelegate.swift
//  Zoom for Safari (iOS)
//
//  Created by Stefan Van Damme on 16/06/2021.
//

import UIKit
import Network

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        monitorNetwork()
        return true
    }

    let monitor = NWPathMonitor()
    let queue = DispatchQueue(label: "Monitor")
    func monitorNetwork(){
        monitor.pathUpdateHandler = { path in
            if path.status == .satisfied {
                //print("There is internet")
                UserDefaults.standard.set(true, forKey: "connected")

                NotificationCenter.default.post(name: Notification.Name(rawValue: "callbackonline"), object: nil)
            } else {
                //print("No internet")
                UserDefaults.standard.set(false, forKey: "connected")

                NotificationCenter.default.post(name: Notification.Name(rawValue: "calloffline"), object: nil)
            }
        }
        monitor.start(queue: queue)
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }

}
