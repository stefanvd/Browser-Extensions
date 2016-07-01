//================================================
/*

Finance Toolbar
This show you the real time stock market information.
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
else if (info.menuItemId == "totlsharemenu") {window.open(ambientaureawebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Ambient Aurea extension&body=Hé, This is amazing. I just tried today this Ambient Aurea Browser extension"+ambientaureaproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var sambientaureaproductcodeurl = encodeURIComponent("The Best and Amazing Ambien Aurea Browser extension "+ambientaureaproduct+" @ambientaurea");window.open("https://twitter.com/home?status="+sambientaureaproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+zoomproduct, "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url="+zoomproduct, "_blank");}
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
        if (changes['marqueebehaviour']) { if (changes['marqueebehaviour'].newValue) { refreshtoolbar() } }
        if (changes['direction']) { if (changes['direction'].newValue) { refreshtoolbar() } }
        if (changes['scrollamount']) { if (changes['scrollamount'].newValue) { refreshtoolbar() } }
        if (changes['japan']) { if (changes['japan'].newValue) { refreshtoolbar() } }
        if (changes['xminutes']) { if (changes['xminutes'].newValue) { refreshtoolbar() } }
        if (changes['favoritestock']) { if (changes['favoritestock'].newValue) { refreshtoolbar() } }
        if (changes['favo1']) { if (changes['favo1'].newValue) { refreshtoolbar() } }
        if (changes['favo2']) { if (changes['favo2'].newValue) { refreshtoolbar() } }
        if (changes['favo3']) { if (changes['favo3'].newValue) { refreshtoolbar() } }
        if (changes['favo4']) { if (changes['favo4'].newValue) { refreshtoolbar() } }
        if (changes['getinfovaluestock']) { if (changes['getinfovaluestock'].newValue) { refreshtoolbar() } }
        if (changes['getinfovaluepercent']) { if (changes['getinfovaluepercent'].newValue) { refreshtoolbar() } }
        if (changes['getinfovaluemc']) { if (changes['getinfovaluemc'].newValue) { refreshtoolbar() } }
        if (changes['getfontfamily']) { if (changes['getfontfamily'].newValue) { refreshtoolbar() } }
        if (changes['getfontsize']) { if (changes['getfontsize'].newValue) { refreshtoolbar() } }
        if (changes['lightcolor']) { if (changes['lightcolor'].newValue) { refreshtoolbar() } }
        if (changes['redcolor']) { if (changes['redcolor'].newValue) { refreshtoolbar() } }
        if (changes['greencolor']) { if (changes['greencolor'].newValue) { refreshtoolbar() } }
        if (changes['textcolor']) { if (changes['textcolor'].newValue) { refreshtoolbar() } }
    }
})

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