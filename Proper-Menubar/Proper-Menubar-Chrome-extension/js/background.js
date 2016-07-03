//================================================
/*

Proper Menubar
Add the black menubar below the addresbar. To get easy and fast access to all your Google products.
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

chrome.runtime.onMessage.addListener(function request(request,sender,sendMessage){
if (request.name == "navOFF") {
chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.executeScript(tabs[i].id, {file: "js/navremove.js"});
            }
        }
    );
}
else if (request.name == "navON") {
chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.executeScript(tabs[i].id, {file: "js/navadd.js"});
            }
        }
    );
}
});

// update when refresh on the tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if ((tab.url.match(/^http/i))) {
			chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {action: "addremove"});
			});
		}
});

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(){
    	chrome.windows.getCurrent(function (w) {
        	chrome.tabs.getSelected(w.id,
        	function (response) {
            	tabId = response.id;
            	chrome.tabs.sendMessage(tabId, {action: "addremove"});
        	});
		});
});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "totlguideemenu") {window.open(linkguide, "_blank");}
else if (info.menuItemId == "totldevelopmenu") {window.open(donatewebsite, "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open(writereview, "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open(propermenubarwebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Ambient Aurea extension&body=Hé, This is amazing. I just tried today this Ambient Aurea Browser extension"+propermenubarproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var spropermenubarproductcodeurl = encodeURIComponent("The Best and Amazing Ambien Aurea Browser extension "+propermenubarproduct+" @ambientaurea");window.open("https://twitter.com/home?status="+spropermenubarproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+propermenubarproduct, "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url="+propermenubarproduct, "_blank");}
}

chrome.runtime.onInstalled.addListener(function() {
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

var contexts = ["page_action", "browser_action"];
chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts":contexts});

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts":contexts});
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "parentId": parent});
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

function refreshtoolbar() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, { action: "toolbarrefresh" });
        }
    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
      if(changes['backgroundcolor']){if (changes['backgroundcolor'].newValue) { refreshtoolbar() }}
      if(changes['backgroundhex']){if (changes['backgroundhex'].newValue) { refreshtoolbar() }}
      if(changes['backgroundimage']){if (changes['backgroundimage'].newValue) { refreshtoolbar() }}
      if(changes['backgroundimagesource']){if (changes['backgroundimagesource'].newValue) { refreshtoolbar() }}
      if(changes['opacity']){if (changes['opacity'].newValue) { refreshtoolbar() }}
      if(changes['googleplus']){if (changes['googleplus'].newValue) { refreshtoolbar() }}
      if(changes['fontcolor']){if (changes['fontcolor'].newValue) { refreshtoolbar() }}
      if(changes['search']){if (changes['search'].newValue) { refreshtoolbar() }}
      if(changes['existingtab']){if (changes['existingtab'].newValue) { refreshtoolbar() }}
      if(changes['googlesites']){if (changes['googlesites'].newValue) { refreshtoolbar() }}
      if(changes['propermenuonly']){if (changes['propermenuonly'].newValue) { refreshtoolbar() }}
	  if(changes['dropshadow']){if (changes['dropshadow'].newValue) { refreshtoolbar() }}
	  if(changes['link1a']){if (changes['link1a'].newValue) { refreshtoolbar() }}
	  if(changes['link2a']){if (changes['link2a'].newValue) { refreshtoolbar() }}
	  if(changes['link3a']){if (changes['link3a'].newValue) { refreshtoolbar() }}
	  if(changes['link4a']){if (changes['link4a'].newValue) { refreshtoolbar() }}
	  if(changes['link5a']){if (changes['link5a'].newValue) { refreshtoolbar() }}
	  if(changes['link6a']){if (changes['link6a'].newValue) { refreshtoolbar() }}
	  if(changes['link7a']){if (changes['link7a'].newValue) { refreshtoolbar() }}
	  if(changes['link8a']){if (changes['link8a'].newValue) { refreshtoolbar() }}
	  if(changes['link9a']){if (changes['link9a'].newValue) { refreshtoolbar() }}
	  if(changes['link10a']){if (changes['link10a'].newValue) { refreshtoolbar() }}
	  if(changes['link11a']){if (changes['link11a'].newValue) { refreshtoolbar() }}
	  if(changes['link12a']){if (changes['link12a'].newValue) { refreshtoolbar() }}
	  if(changes['link13a']){if (changes['link13a'].newValue) { refreshtoolbar() }}
	  if(changes['link14a']){if (changes['link14a'].newValue) { refreshtoolbar() }}
	  if(changes['link15a']){if (changes['link15a'].newValue) { refreshtoolbar() }}
	  if(changes['link16a']){if (changes['link16a'].newValue) { refreshtoolbar() }}
	  if(changes['link17a']){if (changes['link17a'].newValue) { refreshtoolbar() }}
	  if(changes['link18a']){if (changes['link18a'].newValue) { refreshtoolbar() }}
	  if(changes['link19a']){if (changes['link19a'].newValue) { refreshtoolbar() }}
	  if(changes['link20a']){if (changes['link20a'].newValue) { refreshtoolbar() }}
	  if(changes['link21a']){if (changes['link21a'].newValue) { refreshtoolbar() }}
	  if(changes['link22a']){if (changes['link22a'].newValue) { refreshtoolbar() }}
	  if(changes['link23a']){if (changes['link23a'].newValue) { refreshtoolbar() }}
	  if(changes['link24a']){if (changes['link24a'].newValue) { refreshtoolbar() }}
	  if(changes['link25a']){if (changes['link25a'].newValue) { refreshtoolbar() }}
	  if(changes['link26a']){if (changes['link26a'].newValue) { refreshtoolbar() }}
      if(changes['display']){if (changes['display'].newValue) { refreshtoolbar() }}
    }
})

chrome.commands.onCommand.addListener(function(command) {
    if(command == "toggle-feature-propermenubar"){
        var addbar = null;
        chrome.storage.sync.get(['addbar'], function(items){
        if(items['addbar']){addbar = items['addbar'];}if(!addbar)addbar = false;
            chrome.tabs.getSelected(null, function(tab) {
            if(addbar == true){
            chrome.storage.sync.set({ "addbar": false});
            chrome.tabs.sendMessage(tab.id, {action: "addremove"});
            }else{
            chrome.storage.sync.set({ "addbar": true});
            chrome.tabs.sendMessage(tab.id, {action: "addremove"});
            }
            });
        });
    }
});

try{ chrome.runtime.setUninstallUrl(linkuninstall); }
catch(e){}

// Fired when an update is available
chrome.runtime.onUpdateAvailable.addListener(function() {chrome.runtime.reload();});

// Fired when an update is available
chrome.runtime.onUpdateAvailable.addListener(function() {chrome.runtime.reload();});

chrome.storage.sync.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage, selected:true})
  chrome.storage.sync.set({"firstRun": "false"});
  chrome.storage.sync.set({"version": "2.0"});
}
});