//
//  ViewController.swift
//  Zoom for Safari
//
//  Created by Stefan Van Damme on 04/01/2021.
//

import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager
import AVKit
import AVFoundation

let appName = "Zoom for Safari"
let extensionBundleIdentifier = "com.stefanvd.Zoom-for-Safari.Extension"

extension String {
    func localized(withComment comment: String? = nil) -> String {
        return NSLocalizedString(self, tableName: "Main",comment: comment ?? "")
    }
}

class ViewController: NSViewController {
    var observer: NSKeyValueObservation?
    
    @IBOutlet weak var bottombar: NSView!
    
    let thatvideo = AVPlayerView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.wantsLayer = true
        
        // Do any additional setup after loading the view.
        self.view.layer?.backgroundColor = NSColor.white.cgColor
        
        self.updateExtensionStatus()
    }
    
    @IBOutlet weak var welcomescreen: NSView!
    @IBOutlet weak var openactionbutton: NSButton!
    @IBOutlet weak var extensionStatusLabel: NSTextField!
    @IBOutlet weak var lblenableextension: NSTextField!
    @IBOutlet weak var installimage: NSImageView!
    @IBOutlet weak var safaripreview: NSImageView!
    
    override func viewWillAppear() {
    }
    
    override func viewDidAppear() {
    }
    
    @IBAction func lampbonus(_ sender: Any) {
        if let url = URL(string: "https://www.stefanvd.net/donate.htm"), NSWorkspace.shared.open(url) {
            //print("default browser was successfully opened")
        }
    }
    
    func updateExtensionStatus() {
        let titlestatuslavelenabled = "Safari extension is Enabled".localized()
        let titlestatuslaveldisabled = "Safari extension is Disabled".localized()
        let titleactiondisabled = "Disable Zoom".localized()
        let titleactionenabled = "Enable Zoom".localized()
        
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            //NSLog("extension: \(String(describing: state)), \(String(describing: error))")
            if error != nil {
                //print("Error determining the state of extension: \(String(describing: error))");
                return;
            }
            
            DispatchQueue.global().async(execute: {
                DispatchQueue.main.sync {
                    if state!.isEnabled {
                        self.extensionStatusLabel.stringValue = titlestatuslavelenabled
                        self.openactionbutton.title = titleactiondisabled
                        self.lblenableextension.isHidden = true
                        self.installimage.isHidden = true
                        self.safaripreview.isHidden = false
                    } else {
                        self.extensionStatusLabel.stringValue = titlestatuslaveldisabled
                        self.openactionbutton.title = titleactionenabled
                        self.lblenableextension.isHidden = false
                        self.installimage.isHidden = false
                        self.safaripreview.isHidden = true
                    }
                }
            })
            
            
        }
        
        
        // Recheck the status every 1.5 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5, execute: {
            self.updateExtensionStatus()
        })
    }
    
    override var representedObject: Any? {
        didSet {
        // Update the view, if already loaded.
        }
    }

    @IBAction func opensafari(_ sender: Any) {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            if error != nil {
                print("Error determining the state of extension: %@", error!);
                return;
            }

            //if state!.isEnabled {
                // The extension is already on.
                //NSWorkspace.shared.launchApplication("Safari")
                //NSApplication.shared().terminate(self)
            //} else {
                // Provide instructions to users on how to turn on your extension in Safari.
                SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { (error) in
                    if error != nil {
                        print("Error launching the extension's preferences: %@", error!);
                        return;
                    }
                }
                //NSApplication.shared().terminate(self)
            //}
            
            DispatchQueue.main.async {
                //NSApplication.shared.terminate(nil)
            }
        }
    }
    
    @IBAction func opensupport(_ sender: Any){
        if let url = URL(string: "https://www.stefanvd.net/support"), NSWorkspace.shared.open(url) {
            //print("default browser was successfully opened")
        }
    }
    
    deinit {
        // perform the deinitialization
        NotificationCenter.default.removeObserver(self)
        thatvideo.player = nil
    }
}
