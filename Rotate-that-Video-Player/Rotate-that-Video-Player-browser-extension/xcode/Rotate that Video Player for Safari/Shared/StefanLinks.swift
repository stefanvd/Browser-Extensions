//
//  StefanLinks.swift
//  Font Size Decrease for Safari
//
//  Created by Stefan Van Damme on 19/11/2024.
//

import Foundation

#if os(iOS) || os(visionOS)
import UIKit
#elseif os(macOS)
import AppKit
#endif

class StefanLinks {
    func openURL(_ url: URL) {
#if os(iOS) || os(visionOS)
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
#elseif os(watchOS)
        WKExtension.shared().openSystemURL(url)
#elseif os(macOS)
        NSWorkspace.shared.open(url)
#endif
    }
    
    func linkredirectionoptions() -> String{
        return "https://www.stefanvd.net/project/rotate-that-video-player/browser/options/"
    }
    
    func linktranslate() -> String{
        return "https://www.stefanvd.net/project/translate/"
    }
    
    func linkdeveloperwebsite() -> String{
        return "https://www.stefanvd.net"
    }
    
    func linkdeveloperblog() -> String{
        return "https://www.stefanvd.net/blog/"
    }
    
    func linkdeveloper() -> String{
        return "https://www.stefanvd.net/project/code/"
    }
    
    func linksocial() -> String{
        return "https://www.stefanvd.net/social/"
    }
    
    func linkdonate() -> String{
        return "https://www.stefanvd.net/donate/"
    }
    
    func linksupport() -> String{
        return "https://www.stefanvd.net/support/"
    }
    
    func linkdeveloperblogfeed() -> String{
        return "https://www.stefanvd.net/blog/feed/"
    }
    
    func linkprivacy() -> String{
        return "https://www.stefanvd.net/privacy/"
    }
 
    func linksourcecode() -> String{
        return "https://github.com/stefanvd/Browser-Extensions/tree/master/Rotate-that-Video-Player/Rotate-that-Video-Player-browser-extension"
    }
    
    func linkappstore() -> String{
        return "https://apps.apple.com/app/id6756031106"
    }
    
    // Other apps
    func webapphellooffice() -> String{
        return "https://apps.apple.com/app/id1569818870"
    }
    
    func webappcanadarace() -> String{
        return "https://apps.apple.com/app/id1416358359"
    }
    
    func webapphometab() -> String{
        return "https://apps.apple.com/app/id1585512140"
    }
    
    func webappturnoffthelights() -> String{
        return "https://apps.apple.com/app/id1273998507"
    }
    
    func webappzoom() -> String{
        return "https://apps.apple.com/app/id1423085875"
    }
    
    func webappdatetoday() -> String{
        return "https://apps.apple.com/app/id1523093827"
    }
    
    func webappharddisk() -> String{
        return "https://apps.apple.com/app/id1043842695"
    }
    
    func webappsunrise() -> String{
        return "https://apps.apple.com/app/id1530008755"
    }
    
    func webapptrafficblinker() -> String{
        return "https://apps.apple.com/app/id1073990483"
    }
   
    func webappmylunarnewyear() -> String{
        return "https://apps.apple.com/app/id1596469569"
    }
    
    func webappmychristmastree() -> String{
        return "https://apps.apple.com/app/id1062397646"
    }
    
    func webappfullscreen() -> String{
        return "https://apps.apple.com/app/id1462623715"
    }
    
    func webappsnow() -> String{
        return "https://apps.apple.com/app/id6755977850"
    }
    
    func webappfontsizeincrease() -> String{
        return "https://apps.apple.com/app/id6756031354"
    }
    
    func webappfontsizedecrease() -> String{
        return "https://apps.apple.com/app/id6756031162"
    }
    
    func webapprotatethatvideoplayer() -> String{
        return "https://apps.apple.com/app/id6756031106"
    }
    
}
