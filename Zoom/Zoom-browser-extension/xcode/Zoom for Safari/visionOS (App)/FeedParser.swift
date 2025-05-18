//
//  FeedParser.swift
//  Turn Off the Lights for Safari (iOS)
//
//  Created by Stefan Van Damme on 16/06/2021.
//

import Foundation

class FeedParser: NSObject, XMLParserDelegate {
    fileprivate var rssItems = [(title: String, description: String, pubDate: String, link: String)]()
  
    fileprivate var currentElement = ""
  
    fileprivate var currentTitle = "" {
        didSet {
          currentTitle = currentTitle.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        }
    }
  
    fileprivate var currentDescription = "" {
        didSet {
          currentDescription = currentDescription.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        }
    }
  
    fileprivate var currentPubDate = "" {
        didSet {
          currentPubDate = currentPubDate.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        }
    }
    
    fileprivate var currentLink = "" {
        didSet {
        currentLink = currentLink.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        }
    }
  
    fileprivate var parserCompletionHandler: (([(title: String, description: String, pubDate: String, link: String)]) -> Void)?
  
    func parseFeed(feedURL: String, completionHandler: (([(title: String, description: String, pubDate: String, link: String)]) -> Void)?) -> Void {
        parserCompletionHandler = completionHandler
        
        guard let feedURL = URL(string:feedURL) else {
          print("feed URL is invalid")
          return
        }
    
        URLSession.shared.dataTask(with: feedURL, completionHandler: { data, response, error in
            if let error = error {
            print(error)
            return
            }

            guard let data = data else {
            print("No data fetched")
            return
            }

            let parser = XMLParser(data: data)
            parser.delegate = self
            parser.parse()
        }).resume()
    }
  
    // MARK: - XMLParser Delegate
    func parserDidStartDocument(_ parser: XMLParser) {
        rssItems.removeAll()
    }
  
    func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?, qualifiedName qName: String?, attributes attributeDict: [String : String] = [:]) {
        currentElement = elementName
        if currentElement == "item" {
          currentTitle = ""
          currentDescription = ""
          currentPubDate = ""
          currentLink = ""
        }
    }
  
    func parser(_ parser: XMLParser, foundCharacters string: String) {
        /// Note: current string may only contain part of info.
        switch currentElement {
            case "title":
                currentTitle += string
            case "content:encoded":
                currentDescription += string
            case "pubDate":
                currentPubDate += string
            case "link":
                currentLink += string
            default:
                break
        }
    }
  
    func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
        if elementName == "item" {
            let rssItem = (title: currentTitle, description: currentDescription, pubDate: currentPubDate, link: currentLink)
            rssItems.append(rssItem)
        }
    }
  
    func parserDidEndDocument(_ parser: XMLParser) {
        parserCompletionHandler?(rssItems)
    }

    func parser(_ parser: XMLParser, parseErrorOccurred parseError: Error) {
        print(parseError.localizedDescription)
    }
}
