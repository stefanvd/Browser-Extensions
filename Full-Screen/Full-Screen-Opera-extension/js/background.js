//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2016 Stefan vd
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

chrome.runtime.onMessage.addListener(function request(request,sender,sendResponse){
if (request.name == "youtubefullscreen") {
    chrome.tabs.query({active: true}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.executeScript(tabs[i].id, {file: "js/video.js"});
            }
        }
    );
}
// contextmenu
else if (request.name == "contextmenuon") {checkcontextmenus();}
else if (request.name == "contextmenuoff") {removecontexmenus()}
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.getCurrent(null, function(window) {
    chrome.storage.sync.get(['fullscreenweb','fullscreenwindow','fullscreenvideo'], function(items){
      if(items['fullscreenweb'] == true){chrome.tabs.executeScript(tab.id, {file: "js/fullscreen.js"});}
      else if(items['fullscreenwindow'] == true){chrome.windows.update(window.id, {state: "fullscreen"});}
      else if(items['fullscreenvideo'] == true){chrome.tabs.executeScript(tab.id, {file: "js/video.js"});}
      else{chrome.tabs.executeScript(tab.id, {file: "js/fullscreen.js"});}
    });
  });
});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "fsvideo" || info.menuItemId == "fsimage" || info.menuItemId == "fspage") {chrome.tabs.sendMessage(tab.id, { action: "gofullscreen" });}
else if (info.menuItemId == "totlguideemenu") {window.open(linkguide, "_blank");}
else if (info.menuItemId == "totldevelopmenu") {window.open(donatewebsite, "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open(writereview, "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open(fullscreenwebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Full Screen extension&body=Hé, This is amazing. I just tried today this Full Screen Browser extension"+fullscreenproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var sfullscreenproductcodeurl = encodeURIComponent("The Best and Amazing Full Screen Browser extension "+fullscreenproduct+"");window.open("https://twitter.com/home?status="+sfullscreenproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+fullscreenproduct, "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url="+fullscreenproduct, "_blank");}
}

// check to remove all contextmenus
chrome.contextMenus.removeAll(function() {
//console.log("contextMenus.removeAll callback");
});

// pageaction
var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenupostongoogleplus = chrome.i18n.getMessage("sharemenupostongoogleplus");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");

var contexts = ["browser_action"];
chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts":contexts});

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts":contexts});
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "parentId": parent});

chrome.storage.sync.get(['contextmenus'], function(items){
    if(items['contextmenus']){checkcontextmenus();}
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

// context menu for page and video
var menuvideo = null; var menuimage = null; var menupage = null;
var contextmenuadded = false;
var contextarrayvideo = [];
var contextarrayimage = [];
var contextarraypage = [];

function checkcontextmenus(){
    if(contextmenuadded == false){
    contextmenuadded = true;

    // video
    var contexts = ["video"];
    for (var i = 0; i < contexts.length; i++){
    var context = contexts[i];
    var videotitle = chrome.i18n.getMessage("videotitle");
    menuvideo = chrome.contextMenus.create({"title": videotitle, "type":"normal", "id": "fsvideo", "contexts":[context]});
    contextarrayvideo.push(menuvideo);
    }

    // image
    var contexts = ["image"];
    for (var i = 0; i < contexts.length; i++){
    var context = contexts[i];
    var imagetitle = chrome.i18n.getMessage("imagetitle");
    menuimage = chrome.contextMenus.create({"title": imagetitle, "type":"normal", "id": "fsimage", "contexts":[context]});
    contextarrayimage.push(menuimage);
    }

    // page
    var contexts = ["page"];
    for (var i = 0; i < contexts.length; i++){
    var context = contexts[i];
    var pagetitle = chrome.i18n.getMessage("pagetitle");
    menupage = chrome.contextMenus.create({"title": pagetitle, "type":"normal", "id": "fspage", "contexts":[context]});
    contextarraypage.push(menupage);
    }

    }
}

function removecontexmenus(){
    if (contextarrayvideo.length > 0) {
        for (var i=0;i<contextarrayvideo.length;i++) {
            if (contextarrayvideo[i] === undefined || contextarrayvideo[i] === null){}else{
            chrome.contextMenus.remove(contextarrayvideo[i]);
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
    if (contextarraypage.length > 0) {
        for (var i=0;i<contextarraypage.length;i++) {
            if (contextarraypage[i] === undefined || contextarraypage[i] === null){}else{
            chrome.contextMenus.remove(contextarraypage[i]);
            }
        }
    }
    contextarrayvideo = [];
    contextarrayimage = [];
    contextarraypage = [];
    contextmenuadded = false;
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
   for (key in changes) {
          var storageChange = changes[key];
          if(changes['contextmenus']){if(changes['contextmenus'].newValue == true){checkcontextmenus()}else{removecontexmenus()}}
    }
})

try{ chrome.runtime.setUninstallUrl(linkuninstall); }
catch(e){}

chrome.storage.sync.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage})
  chrome.storage.sync.set({"firstRun": "false"});
  chrome.storage.sync.set({"version": "0.1"});
}
});