//
//  WelcomeViewController.swift
//  Zoom for Safari (iOS)
//
//  Created by Stefan Van Damme on 13/06/2021.
//

import Foundation
import UIKit
import SafariServices
import LinkPresentation
import AVKit
import AVFoundation

class WelcomeViewController: UITableViewController, UIActivityItemSource {
    var metadata: LPLinkMetadata?

    var defaults = UserDefaults(suiteName: "group.stefanvd.zoomforsafari")

    func activityViewControllerLinkMetadata(_ activityViewController: UIActivityViewController) -> LPLinkMetadata? {
        let metadata = LPLinkMetadata()
        metadata.originalURL = URL(string: "https://www.stefanvd.net/project/zoom/")
        metadata.url = metadata.originalURL
        metadata.title = String.localizedStringWithFormat(NSLocalizedString("lblplaceholder", comment: ""), "")
        metadata.imageProvider = NSItemProvider.init(contentsOf:Bundle.main.url(forResource: "share-zoom", withExtension: "png"))
        return metadata
    }

    func activityViewControllerPlaceholderItem(_ activityViewController: UIActivityViewController) -> Any {
        return String.localizedStringWithFormat(NSLocalizedString("lblplaceholder", comment: ""), "")
    }

    let websitelink = "https://www.stefanvd.net/project/zoom/"
    func activityViewController(_ activityViewController: UIActivityViewController, itemForActivityType activityType: UIActivity.ActivityType?) -> Any? {
        if activityType == .postToTwitter {
            return String.localizedStringWithFormat(NSLocalizedString("lblsharex", comment: ""), "") + " " + websitelink
        } else {
            return String.localizedStringWithFormat(NSLocalizedString("lblshareregular", comment: ""), "") + " " + websitelink
        }
    }
    
    func activityViewController(_ activityViewController: UIActivityViewController, subjectForActivityType activityType: UIActivity.ActivityType?) -> String {
        return String.localizedStringWithFormat(NSLocalizedString("lblemailsubject", comment: ""), "")
    }
    
    @IBAction func openoptions(_ sender: Any) {
        if let url = URL(string: "https://www.stefanvd.net/project/zoom/") {
            UIApplication.shared.open(url)
        }
    }

    @IBOutlet weak var boxguide: UIView!
    @IBOutlet weak var theguide: UIView!
    @IBAction func closeguide(_ sender: Any) {
        defaults!.set(true, forKey: "launchedBefore")
        boxguide.frame.size.height = 30
        theguide.isHidden = true
        self.tableView.reloadData()
    }

    @IBOutlet weak var lblstep1settings: UILabel!
    @IBOutlet weak var lblstep2safari: UILabel!
    @IBOutlet weak var lblstep3extensions: UILabel!
    @IBOutlet weak var lblstep4name: UILabel!
    @IBOutlet weak var lblstep5newtab: UILabel!
    override func viewDidLoad(){
        super.viewDidLoad()
        
        // debug
        //defaults!.set(false, forKey: "launchedBefore")
        
        let launchedBefore = defaults!.bool(forKey: "launchedBefore")
        if launchedBefore {
            //print("Not first launch.")
            boxguide.frame.size.height = 30
            theguide.isHidden = true
        } else {
            //print("First launch, setting UserDefault.")
            theguide.isHidden = false
        }
        
        let boldAttribute = [
          NSAttributedString.Key.font: UIFont(name: "HelveticaNeue-Bold", size: 17.0)!
        ]
        let regularAttribute = [
          NSAttributedString.Key.font: UIFont(name: "HelveticaNeue", size: 17.0)!
        ]

        //step1
        let regularText = NSAttributedString(string: "Open the ", attributes: regularAttribute)
        let boldText = NSAttributedString(string: "Settings ", attributes: boldAttribute)
        let regularTextb = NSAttributedString(string: "app", attributes: regularAttribute)
        let newString1 = NSMutableAttributedString()
        newString1.append(regularText)
        newString1.append(boldText)
        newString1.append(regularTextb)
        lblstep1settings.attributedText = newString1
        
        //step2
        let regularTextstep2a = NSAttributedString(string: "Select ", attributes: regularAttribute)
        let boldTextstep2a = NSAttributedString(string: "Apps", attributes: boldAttribute)
        let regularTextstep2b = NSAttributedString(string: ", then choose ", attributes: regularAttribute)
        let boldTextstep2b = NSAttributedString(string: "Safari", attributes: boldAttribute)
        let newString2 = NSMutableAttributedString()
        newString2.append(regularTextstep2a)
        newString2.append(boldTextstep2a)
        newString2.append(regularTextstep2b)
        newString2.append(boldTextstep2b)
        lblstep2safari.attributedText = newString2
        
        //step3
        let regularTextstep3 = NSAttributedString(string: "Select ", attributes: regularAttribute)
        let boldTextstep3 = NSAttributedString(string: "Extensions", attributes: boldAttribute)
        let newString3 = NSMutableAttributedString()
        newString3.append(regularTextstep3)
        newString3.append(boldTextstep3)
        lblstep3extensions.attributedText = newString3
        
        //step4
        let regularTextstep4 = NSAttributedString(string: "Turn on ", attributes: regularAttribute)
        let boldTextstep4 = NSAttributedString(string: "Zoom for Safari", attributes: boldAttribute)
        let newString4 = NSMutableAttributedString()
        newString4.append(regularTextstep4)
        newString4.append(boldTextstep4)
        lblstep4name.attributedText = newString4
        
        //step5
        let regularTextstep5 = NSAttributedString(string: "Open New Tabs in ", attributes: regularAttribute)
        let boldTextstep5b = NSAttributedString(string: "Zoom", attributes: boldAttribute)
        let newString5 = NSMutableAttributedString()
        newString5.append(regularTextstep5)
        newString5.append(boldTextstep5b)
        lblstep5newtab.attributedText = newString5
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.section == 0 {
            if indexPath.row == 0 {

            }else if indexPath.row == 1 {

            }
        }
        tableView.deselectRow(at: indexPath, animated: true)
    }

    // Fixed to update size on iPad to full size
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        theguide.layer.cornerRadius = 10
        theguide.layer.maskedCorners = [.layerMaxXMaxYCorner,.layerMaxXMinYCorner,.layerMinXMaxYCorner,.layerMinXMinYCorner]
        theguide.clipsToBounds = true
        
        if traitCollection.horizontalSizeClass == .compact {
            // iPhone size
            self.navigationItem.title = "Zoom"
        } else {
            // large iPad size
            self.navigationItem.title = "Zoom"
        }
        
    }
    
    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        if traitCollection.horizontalSizeClass == .compact {
            // iPhone size
            self.navigationItem.title = "Zoom"
        } else {
            // large iPad size
            self.navigationItem.title = "Zoom"
        }
    }
        
    
    @IBAction func bigshare(_ sender: Any) {
        bigshareaction()
    }
    
    @IBOutlet weak var btnshare: UIBarButtonItem!
    func bigshareaction() {
        let items = [self]
        let ac = UIActivityViewController(activityItems: items, applicationActivities: nil)
        // Check if user is on iPad and present popover
        if UIDevice.current.userInterfaceIdiom == .pad {
            DispatchQueue.main.async {
                if let popoverPresentationController = ac.popoverPresentationController {
                    popoverPresentationController.barButtonItem = self.btnshare
                    popoverPresentationController.permittedArrowDirections = UIPopoverArrowDirection.down;
                }
            }
        }

        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()

        // Present share activityView on regular iPhone
        DispatchQueue.main.async {
            self.present(ac, animated: true)
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
    }
}
