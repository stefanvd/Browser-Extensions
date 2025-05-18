//
//  EnableViewController.swift
//  Zoom for Safari (iOS)
//
//  Created by Stefan Van Damme on 16/06/2021.
//

import Foundation
import UIKit
import AVFoundation
import AVKit
import AudioToolbox

class EnableViewController: UIViewController,AVPlayerViewControllerDelegate{

    @IBOutlet weak var videolayer: UIView!
    @IBOutlet weak var imageinspiration: UIImageView!
    override func viewDidLoad(){
        super.viewDidLoad()
        addvideo()
        settranslationtext()
    }
    
    @IBOutlet weak var lbleasysetup: UILabel!
    @IBOutlet weak var lblactivate: UILabel!
    @IBOutlet weak var lblwatchvideo: UIButton!
    @IBOutlet weak var lblstep1: UILabel!
    @IBOutlet weak var lblstep2: UILabel!
    @IBOutlet weak var lblstep3: UILabel!
    @IBOutlet weak var lblstep4: UILabel!
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }

    func settranslationtext(){
        lbleasysetup.text = String.localizedStringWithFormat(NSLocalizedString("lbleasytosetup", comment: ""), "").uppercased()
        lblactivate.text = String.localizedStringWithFormat(NSLocalizedString("lblactivate", comment: ""), "")
        lblwatchvideo.setTitle(String.localizedStringWithFormat(NSLocalizedString("lblwatchvideo", comment: ""), ""), for: .normal)
        
        // steps list
        lblstep1.text = String.localizedStringWithFormat(NSLocalizedString("lblstep1", comment: ""), "")
        
        let part2a = String.localizedStringWithFormat(NSLocalizedString("lblstep2a", comment: ""), "") + " "
        let part2b = String.localizedStringWithFormat(NSLocalizedString("lblstep2b", comment: ""), "")
        let part2c = " " + String.localizedStringWithFormat(NSLocalizedString("lblstep2c", comment: ""), "")
        let part2d = " " + String.localizedStringWithFormat(NSLocalizedString("lblstep2d", comment: ""), "")
        let attributedString = NSMutableAttributedString(string:part2a)
        let attrs = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 14)]
        let boldString = NSMutableAttributedString(string:part2b, attributes:attrs)
        let lastString = NSMutableAttributedString(string:part2c)
        let otherboldString = NSMutableAttributedString(string:part2d, attributes:attrs)
        attributedString.append(boldString)
        attributedString.append(lastString)
        attributedString.append(otherboldString)
        lblstep2.attributedText = attributedString

        let part3a = String.localizedStringWithFormat(NSLocalizedString("lblstep3a", comment: ""), "") + " "
        let part3b = String.localizedStringWithFormat(NSLocalizedString("lblstep3b", comment: ""), "")
        let part3c = String.localizedStringWithFormat(NSLocalizedString("lblstep3c", comment: ""), "") + " "
        let part3d = String.localizedStringWithFormat(NSLocalizedString("lblstep3d", comment: ""), "")
        
        let attributedString3 = NSMutableAttributedString(string:part3a)
        let attrs3 = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 14)]
        let boldString3b = NSMutableAttributedString(string:part3b, attributes:attrs3)
        let lastString3c = NSMutableAttributedString(string:part3c)
        attributedString3.append(boldString3b)
        attributedString3.append(lastString3c)
        let boldString3d = NSMutableAttributedString(string:part3d, attributes:attrs3)
        attributedString3.append(boldString3d)
        lblstep3.attributedText = attributedString3

        let part4a = String.localizedStringWithFormat(NSLocalizedString("lblstep4a", comment: ""), "") + " "
        let part4b = String.localizedStringWithFormat(NSLocalizedString("lblstep4b", comment: ""), "")

        let attributedString4 = NSMutableAttributedString(string:part4a)
        let attrs4 = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 14)]
        let boldString4b = NSMutableAttributedString(string:part4b, attributes:attrs4)
        attributedString4.append(boldString4b)
        lblstep4.attributedText = attributedString4

    }
    
    func imagePreview(from moviePath: URL, in seconds: Double) -> UIImage? {
        let timestamp = CMTime(seconds: seconds, preferredTimescale: 60)
        let asset = AVURLAsset(url: moviePath)
        let generator = AVAssetImageGenerator(asset: asset)
        generator.appliesPreferredTrackTransform = true

        var resultImage: UIImage?

        generator.generateCGImageAsynchronously(for: timestamp) { cgImage, actualTime, error in
            if let cgImage = cgImage {
                resultImage = UIImage(cgImage: cgImage)
            }
        }

        return resultImage
    }
    
    private var player: AVQueuePlayer!
    private var playerLayer: AVPlayerLayer!
    private var playerItem: AVPlayerItem!
    private var playerLooper: AVPlayerLooper!

    // Fixed to update size on iPad to full size
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        playerLayer.frame = videolayer.layer.bounds
    }
    
    func addvideo() {
        guard let path = Bundle.main.path(forResource: "forest", ofType: "mov") else { return }
        let pathURL = URL(fileURLWithPath: path)
        let asset = AVURLAsset(url: pathURL)
        
        Task {
            do {
                let duration = try await asset.load(.duration)
                let durationSeconds = CMTimeGetSeconds(duration)
                let roundedDuration = Int64(((durationSeconds * 10.0) - 1) / 10.0)
                
                DispatchQueue.main.async {
                    self.player = AVQueuePlayer()
                    self.player.volume = 0
                    self.playerLayer = AVPlayerLayer(player: self.player)
                    self.playerItem = AVPlayerItem(asset: asset)
                    
                    let timeRange = CMTimeRange(start: .zero, end: CMTimeMake(value: roundedDuration, timescale: 1))
                    self.playerLooper = AVPlayerLooper(player: self.player, templateItem: self.playerItem, timeRange: timeRange)
                    
                    self.playerLayer.videoGravity = .resizeAspectFill
                    self.playerLayer.frame = self.videolayer.layer.bounds
                    self.videolayer.layer.insertSublayer(self.playerLayer, at: 1)
                    self.player.play()
                    
                    self.imageinspiration.image = self.imagePreview(from: pathURL, in: 0.0)
                }
            } catch {
                print("Failed to load duration: \(error)")
            }
        }
    }


    
    @IBAction func opentutorialvideo(_ sender: Any) {
        var path = Bundle.main.path(forResource: "enable-safari-extension-iphone", ofType: "mp4")
        if UIDevice.current.userInterfaceIdiom == .pad {
            path = Bundle.main.path(forResource: "enable-safari-extension-ipad", ofType: "mov")
        }else{
            path = Bundle.main.path(forResource: "enable-safari-extension-iphone", ofType: "mp4")
        }
        let url = NSURL(fileURLWithPath: path!)
        let player = AVPlayer(url:url as URL)
        playerController = AVPlayerViewController()
        playerController.player = player
        playerController.allowsPictureInPicturePlayback = true
        playerController.delegate = self
        playerController.player?.play()
        self.present(playerController,animated:true,completion:nil)
    }
    
    var playerController = AVPlayerViewController()
    func didfinishplaying(note : NSNotification)
    {
       playerController.dismiss(animated: true,completion: nil)
       let alertview = UIAlertController(title:"finished",message:"video finished",preferredStyle: .alert)
       alertview.addAction(UIAlertAction(title:"Ok",style: .default, handler: nil))
       self.present(alertview,animated:true,completion: nil)
    }

    func playerViewController(_ playerViewController: AVPlayerViewController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void) {
       let currentviewController =  navigationController?.visibleViewController

       if currentviewController != playerViewController
       {
           currentviewController?.present(playerViewController,animated: true,completion:nil)
       }
    }

}
