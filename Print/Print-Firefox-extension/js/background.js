//================================================
/*

Print
Print the current page you see.
Copyright (C) 2018 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

// Set click to false at beginning
var alreadyClicked = false;
// Declare a timer variable
var timer;
var popupcreated = false;

chrome.browserAction.onClicked.addListener(function(tabs) {
  // Check for previous click
  if (alreadyClicked) {
      // console.log("Doubleclick");
      // Yes, Previous Click Detected
      // Clear timer already set in earlier Click
      window.clearTimeout(timer);
      // Show the popup window
      // Clear all Clicks
      alreadyClicked = false;
      chrome.browserAction.setPopup({
          tabId: tabs.id,
          popup: ""
      });
      return;
  }


  //Set Click to  true
  alreadyClicked = true;
  chrome.browserAction.setPopup({
      tabId: tabs.id,
      popup: "popup.html"
  });

  // Add a timer to detect next click to a sample of 250
  timer = window.setTimeout(function() {
      // console.log("Singelclick");
      var popups = chrome.extension.getViews({
          type: "popup"
      });
      if (popups.length != 0) { // popup exist

      } else { // not exist
          chrome.tabs.executeScript(tabs.id, {
              file: "js/print.js"
          }, function() {
              if (chrome.runtime.lastError) {
                  var errorMsg = chrome.runtime.lastError.message
                  if (errorMsg == "Cannot access a chrome:// URL") {
                      // Error handling here
                      chrome.browserAction.setPopup({
                          tabId: tabs.id,
                          popup: 'error.html'
                      });
                  }
              }
          })
      }

      // Clear all timers
      window.clearTimeout(timer);
      // Ignore clicks
      alreadyClicked = false;
      chrome.browserAction.setPopup({
          tabId: tabs.id,
          popup: ""
      });
  }, 250);
});

var icon;
chrome.storage.sync.get(['icon'], function(items){
  if(items["icon"] == undefined){items["icon"] = "icons/default@2x.png";}
  chrome.browserAction.setIcon({
    path : {
      "19": items["icon"],
      "38": items["icon"]
    }
  });
});// chrome storage end

chrome.tabs.onActivated.addListener(function (tabId, change, tab){
chrome.storage.sync.get(['icon'], function(items){
  if(items["icon"] == undefined){items["icon"] = "icons/default@2x.png";}
  chrome.browserAction.setIcon({
    path : {
      "19": items["icon"],
      "38": items["icon"]
    }
  });
});// chrome storage end
});

chrome.tabs.onHighlighted.addListener(function(o) { tabId = o.tabIds[0];
  chrome.tabs.get(tabId, function(tab) {
      if(tab.url){
          if((tab.url.match(/^http/i)||tab.url.match(/^file/i)||tab.url==browsernewtab)) {
            chrome.browserAction.setPopup({tabId : tabId, popup:''});
                    if(tabId != null){
                        if((new URL(tab.url)).origin==browserstore||(new URL(tab.url))==exoptionspage){
                            chrome.browserAction.setPopup({tabId : tabId, popup:'error.html'});
                        }
                    }
          }
      }else{
              if(tabId != null){
              // remove this because "activetab"
              //chrome.browserAction.setPopup({tabId : tabId, popup:'error.html'});
              }
      }

  });
});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "totldevelopmenu") {chrome.tabs.create({url: donatewebsite, active:true})}
else if (info.menuItemId == "totlratemenu") {chrome.tabs.create({url: writereview, active:true})}
else if (info.menuItemId == "totlsharemenu") {chrome.tabs.create({url: printwebsite, active:true})}
else if (info.menuItemId == "totlshareemail") {chrome.tabs.create({url: "mailto:youremail?subject=Print extension&body=Hé, This is amazing. I just tried today this Print Browser extension"+printproduct+"", active:true})}
else if (info.menuItemId == "totlsharetwitter") {var sprintproductcodeurl = encodeURIComponent("The Best and Amazing Print Browser extension "+printproduct+"");chrome.tabs.create({url: "https://twitter.com/home?status="+sprintproductcodeurl+"", active:true})}
else if (info.menuItemId == "totlsharefacebook") {chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u="+printproduct, active:true})}
else if (info.menuItemId == "totlsharegoogleplus") {chrome.tabs.create({url: "https://plus.google.com/share?url="+printproduct, active:true})}
else if (info.menuItemId == "totlprintpagea"){chrome.tabs.executeScript(tab.id, {file: "js/print.js"});}
else if (info.menuItemId == "totlprintpageb"){chrome.tabs.executeScript(tab.id, {file: "js/print.js"});}
else if (info.menuItemId == "totlsubscribe") {chrome.tabs.create({url: linkyoutube, active:true})}
}

// check to remove all contextmenus
chrome.contextMenus.removeAll(function() {
//console.log("contextMenus.removeAll callback");
});

var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenupostongoogleplus = chrome.i18n.getMessage("sharemenupostongoogleplus");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");

var contexts = ["browser_action"];
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts": contexts, "icons": {"16": "images/IconDonate.png","32": "images/IconDonate@2x.png"}});
    chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts": contexts, "icons": {"16": "images/IconStar.png","32": "images/IconStar@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts": contexts});
    chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts": contexts});
}

// Create a parent item and two children.
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts": contexts, "icons": {"16": "images/IconShare.png","32": "images/IconShare@2x.png"}});
    var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconEmail.png","32": "images/IconEmail@2x.png"}});
    chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});
    var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconTwitter.png","32": "images/IconTwitter@2x.png"}});
    var child3 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconFacebook.png","32": "images/IconFacebook@2x.png"}});
    var child4 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconGoogle.png","32": "images/IconGoogle@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts": contexts});
    var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "contexts": contexts, "parentId": parent});
    chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});
    var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "contexts": contexts, "parentId": parent});
    var child3 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "contexts": contexts, "parentId": parent});
    var child4 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "contexts": contexts, "parentId": parent});
}

chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    chrome.contextMenus.create({"title": sharemenusubscribetitle, "type":"normal", "id": "totlsubscribe", "contexts":contexts, "icons": {"16": "images/IconYouTube.png","32": "images/IconYouTube@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    chrome.contextMenus.create({"title": sharemenusubscribetitle, "type":"normal", "id": "totlsubscribe", "contexts":contexts});
}
chrome.contextMenus.onClicked.addListener(onClickHandler);

// context menu for page and video
var menupagea = null;
var menupageb = null;
var contextmenuadded = false;
var contextarraypage = [];
var contextarrayimage = [];
function checkcontextmenus(){
    if(contextmenuadded == false){
    contextmenuadded = true;

    // page
    var contextsa = ["page"];
    var printpagetitle = chrome.i18n.getMessage("printpagetitle");
    menupagea = chrome.contextMenus.create({"title": printpagetitle, "type":"normal", "id": "totlprintpagea", "contexts":contextsa});
    contextarraypage.push(menupagea);

    // image
    /*var contextsb = ["image"];
    var printimagetitle = chrome.i18n.getMessage("printimagetitle");
    menupageb = chrome.contextMenus.create({"title": printimagetitle, "type":"normal", "id": "totlprintpageb", "contexts":contextsb});
    contextarrayimage.push(menupageb);*/

    }
}

function removecontexmenus(){
    if (contextarraypage.length > 0) {
        for (var i=0;i<contextarraypage.length;i++) {
            if (contextarraypage[i] === undefined || contextarraypage[i] === null){}else{
            chrome.contextMenus.remove(contextarraypage[i]);
            }
        }
    }
    if (contextarrayimage.length > 0) {
      for (var i=0;i<contextarrayimage.length;i++) {
          if (contextarrayimage[i] === undefined || contextarrayimage[i] === null){}else{
          chrome.contextMenus.remove(contextarrayimage[i]);
          }
      }
    }
    contextarraypage = [];
    contextarrayimage = [];
    contextmenuadded = false;
}

chrome.storage.onChanged.addListener(function(changes) {
    if(changes['contextmenus']){if(changes['contextmenus'].newValue == true){checkcontextmenus()}else{removecontexmenus()}}
    if(changes['icon']){if(changes['icon'].newValue){
        chrome.browserAction.setIcon({
        path : {
            "19": changes['icon'].newValue,
            "38": changes['icon'].newValue
        }
        });  
    }
    }
})

chrome.runtime.setUninstallURL(linkuninstall);

// convert from old storage to new
if(localStorage["firstRun"] == "false"){ chrome.storage.sync.set({"firstRun": false}); }

chrome.storage.sync.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage});
  var crrinstall = new Date().getTime();
  chrome.storage.sync.set({"firstRun": false, "version": "0.1", "firstDate": crrinstall});  
}
});