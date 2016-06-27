//================================================
/*

Ambient Aurea
Bring your image to an ambient lighting effect with just one click on the button.
Copyright (C) 2015 Stefan vd
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

chrome.extension.onMessage.addListener(function request(request,sender,sendResponse){
if (request.name == "opacitysaveme") {chrome.storage.local.set({"interval": request.value});}
else if (request.name == "imgurl") {chrome.storage.local.set({"getimgurl": request.value});}
else if (request.name == "selector") {chrome.storage.local.set({"getimgurl": request.value});chrome.tabs.executeScript(sender.tab.id, {file: "js/aa.js"});}
// contextmenu
else if (request.name == "contextmenuon") {checkcontextmenus();}
else if (request.name == "contextmenuoff") {removecontexmenus()}
});

// browser button
chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.executeScript(tab.id, {file: "js/aaselector.js"});});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "aaimage") {chrome.tabs.executeScript(tab.id, {file: "js/aa.js"});}
else if (info.menuItemId == "totlguideemenu") {window.open("http://www.stefanvd.net/project/aachromeguide.htm", "_blank");}
else if (info.menuItemId == "totldevelopmenu") {window.open("http://www.stefanvd.net/donate.htm", "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open("https://chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa/reviews", "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open("http://www.stefanvd.net/project/aachrome.htm", "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Ambient Aurea Chrome extension&body=Hé, This is amazing. I just tried today this Ambient Aurea Chrome extension https://chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {window.open("http://twitter.com/home?status=Try%20self%20this%20amazing%20Ambient%20Aurea%20Chrome%20extension%20chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa @ambientaurea", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u=chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa", "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url=chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa", "_blank");}
}

// pageaction
var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenupostongoogleplus = chrome.i18n.getMessage("sharemenupostongoogleplus");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");

var contexts = ["page_action", "browser_action"];
chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts":contexts});

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts":contexts});
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "parentId": parent, "onclick": onClickHandler});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "parentId": parent, "onclick": onClickHandler});
var child2 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "parentId": parent, "onclick": onClickHandler});
var child2 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "parentId": parent, "onclick": onClickHandler});

chrome.contextMenus.onClicked.addListener(onClickHandler);

checkcontextmenus();

// context menu for page and video
var menupage;
function checkcontextmenus(){
// image
var contexts = ["image"];
for (var i = 0; i < contexts.length; i++){
  var context = contexts[i];
  var imagetitle = chrome.i18n.getMessage("imagetitle");
  menupage = chrome.contextMenus.create({"title": imagetitle, "type":"normal", "id": "aaimage", "contexts":[context]});
}
}

function removecontexmenus(){
chrome.contextMenus.remove(menupage);
}

try{ chrome.runtime.setUninstallUrl("http://www.stefanvd.net/"); }
catch(e){}

// Fired when an update is available
chrome.runtime.onUpdateAvailable.addListener(function() {chrome.runtime.reload();});

chrome.storage.local.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: "http://www.stefanvd.net/project/aachromeguide.htm", selected:false})
  chrome.tabs.create({url: "http://www.stefanvd.net/project/aachrome.htm", selected:true})
  chrome.storage.local.set({"firstRun": "false"});
  chrome.storage.local.set({"version": "2.0"});
}
});