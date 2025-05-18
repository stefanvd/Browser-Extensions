//
//  GalleryController.swift
//  Date Today
//
//  Created by Stefan Van Damme on 06/10/2020.
//

import Foundation
import UIKit
import SafariServices

@IBDesignable extension UIButton {

    @IBInspectable var borderWidth: CGFloat {
        set {
            layer.borderWidth = newValue
        }
        get {
            return layer.borderWidth
        }
    }

    @IBInspectable var cornerRadius: CGFloat {
        set {
            layer.cornerRadius = newValue
        }
        get {
            return layer.cornerRadius
        }
    }

    @IBInspectable var borderColor: UIColor? {
        set {
            guard let uiColor = newValue else { return }
            layer.borderColor = uiColor.cgColor
        }
        get {
            guard let color = layer.borderColor else { return nil }
            return UIColor(cgColor: color)
        }
    }
}

class GalleryController: UITableViewController,SFSafariViewControllerDelegate{
    
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationItem.largeTitleDisplayMode = .never
    }
    
    @IBOutlet weak var iconmytree: UIImageView!
    @IBOutlet weak var iconsunrise: UIImageView!
    @IBOutlet weak var icondisk: UIImageView!
    @IBOutlet weak var icondatetoday: UIImageView!
    @IBOutlet weak var iconmylunar: UIImageView!
    @IBOutlet weak var iconlamp: UIImageView!
    @IBOutlet weak var iconhellooffice: UIImageView!
    @IBOutlet weak var iconthecanadarace: UIImageView!
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        iconmytree.layer.borderColor = UIColor.separator.cgColor
        iconmytree.layer.masksToBounds = true
        iconmytree.contentMode = .scaleToFill
        iconmytree.layer.borderWidth = 1
        
        iconsunrise.layer.borderColor = UIColor.separator.cgColor
        iconsunrise.layer.masksToBounds = true
        iconsunrise.contentMode = .scaleToFill
        iconsunrise.layer.borderWidth = 1
        
        icondisk.layer.borderColor = UIColor.separator.cgColor
        icondisk.layer.masksToBounds = true
        icondisk.contentMode = .scaleToFill
        icondisk.layer.borderWidth = 1
        
        icondatetoday.layer.borderColor = UIColor.separator.cgColor
        icondatetoday.layer.masksToBounds = true
        icondatetoday.contentMode = .scaleToFill
        icondatetoday.layer.borderWidth = 1
        
        iconmylunar.layer.borderColor = UIColor.separator.cgColor
        iconmylunar.layer.masksToBounds = true
        iconmylunar.contentMode = .scaleToFill
        iconmylunar.layer.borderWidth = 1
        
        iconlamp.layer.borderColor = UIColor.separator.cgColor
        iconlamp.layer.masksToBounds = true
        iconlamp.contentMode = .scaleToFill
        iconlamp.layer.borderWidth = 1
        
        iconhellooffice.layer.borderColor = UIColor.separator.cgColor
        iconhellooffice.layer.masksToBounds = true
        iconhellooffice.contentMode = .scaleToFill
        iconhellooffice.layer.borderWidth = 1
        
        iconthecanadarace.layer.borderColor = UIColor.separator.cgColor
        iconthecanadarace.layer.masksToBounds = true
        iconthecanadarace.contentMode = .scaleToFill
        iconthecanadarace.layer.borderWidth = 1
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.row == 0 {
            openapplink(url: "https://apps.apple.com/app/id1062397646")
        }else if indexPath.row == 1 {
            openapplink(url: "https://apps.apple.com/app/id1530008755")
        }else if indexPath.row == 2 {
            openapplink(url: "https://apps.apple.com/app/id1043842695")
        }else if indexPath.row == 3 {
            openapplink(url: "https://apps.apple.com/app/id1523093827")
        }else if indexPath.row == 4 {
            openapplink(url: "https://apps.apple.com/app/id1596469569")
        }else if indexPath.row == 5 {
            openapplink(url: "https://apps.apple.com/app/id1273998507")
        }else if indexPath.row == 6 {
            openapplink(url: "https://apps.apple.com/app/id1416358359")
        }else if indexPath.row == 7 {
            openapplink(url: "https://apps.apple.com/app/id1569818870")
        }
        
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    func openapplink(url: String){
        // check if website exists
        guard let url = URL(string: url) else {
        return
        }

        let safariVC = SFSafariViewController(url: url)
        // Check if user is on iPad and present popover
        if UIDevice.current.userInterfaceIdiom == .pad {
            safariVC.modalPresentationStyle = UIModalPresentationStyle.fullScreen
        }else{
            safariVC.modalPresentationStyle = UIModalPresentationStyle.popover
        }
        safariVC.delegate = self
        present(safariVC, animated: true, completion: nil)
    }
    
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        controller.dismiss(animated: true, completion: nil)
    }
}
