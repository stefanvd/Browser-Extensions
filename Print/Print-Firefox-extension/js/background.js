//================================================
/*

Print
Print the current page you see.
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

chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.executeScript(tab.id, {file: "js/print.js"});});

var icon;
chrome.storage.local.get(['icon'], function(items){
  if(items["icon"] == undefined){items["icon"] = "icons/default@2x.png";}
  chrome.browserAction.setIcon({
    path : {
      "19": items["icon"],
      "38": items["icon"]
    }
  });
});// chrome storage end

chrome.storage.onChanged.addListener(function(changes, namespace) {
   for (key in changes) {
          var storageChange = changes[key];
          if(changes['icon']){if(changes['icon'].newValue){
            chrome.browserAction.setIcon({
              path : {
                "19": changes['icon'].newValue,
                "38": changes['icon'].newValue
              }
            });  
          }
          }
    }
})

chrome.tabs.onActivated.addListener(function (tabId, change, tab){
chrome.storage.local.get(['icon'], function(items){
  if(items["icon"] == undefined){items["icon"] = "icons/default@2x.png";}
  chrome.browserAction.setIcon({
    path : {
      "19": items["icon"],
      "38": items["icon"]
    }
  });
});// chrome storage end
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab){
chrome.storage.local.get(['icon'], function(items){
  if(items["icon"] == undefined){items["icon"] = "icons/default@2x.png";}
  chrome.browserAction.setIcon({
    path : {
      "19": items["icon"],
      "38": items["icon"]
    }
  });
});// chrome storage end
});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "totldevelopmenu") {window.open(donatewebsite, "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open(writereview, "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open(printwebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Print extension&body=Hé, This is amazing. I just tried today this Print Browser extension"+printproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var sprintproductcodeurl = encodeURIComponent("The Best and Amazing Print Browser extension "+printproduct+"");window.open("https://twitter.com/home?status="+sprintproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+printproduct, "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url="+printproduct, "_blank");}
}

// check to remove all contextmenus
chrome.contextMenus.removeAll(function() {
//console.log("contextMenus.removeAll callback");
});

// pageaction
var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenupostongoogleplus = chrome.i18n.getMessage("sharemenupostongoogleplus");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");

var contexts = ["page_action", "browser_action"];
chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts":contexts});

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts":contexts});
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "parentId": parent});

chrome.contextMenus.onClicked.addListener(onClickHandler);

try{ chrome.runtime.setUninstallUrl(linkuninstall); }
catch(e){}

chrome.storage.local.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage})
  chrome.storage.local.set({"firstRun": "false"});
  chrome.storage.local.set({"version": "0.1"});
}
});