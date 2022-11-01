//================================================
/*

Proper Menubar
Add the best menu bar to get easy and fast access to all your useful browser options and internet products!
Copyright (C) 2022 Stefan vd
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

// Importing the constants
// eslint-disable-next-line no-undef
importScripts("constants.js");

var saveAs = function(blob, name){
	var object_url = window.URL.createObjectURL(blob);
	var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	save_link.href = object_url;
	save_link.download = name;
	var event = new MouseEvent("click");
	save_link.dispatchEvent(event);
};

chrome.runtime.onMessage.addListener(function request(request, sender, sendResponse){
	if(request.name == "stefanproper"){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
			}
		});
	}else if(request.name == "stefancleannewtab"){
		chrome.tabs.create({url: browsernewtab});
	}else if(request.name == "stefancleannewwindow"){
		chrome.windows.create({url: browsernewtab});
	}else if(request.name == "stefancleannewwindowincognito"){
		chrome.windows.create({"url": browsernewtab, "incognito": true});
	}else if(request.name == "stefancleanclosetab"){
		chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function(tabs){
			var tab = tabs[0];
			chrome.tabs.remove(tab.id);
		});
	}else if(request.name == "stefancleanclosewindow"){
		chrome.windows.getCurrent(function(win){ chrome.windows.remove(win.id); });
	}else if(request.name == "stefanexit"){
		chrome.tabs.query({}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.remove(tabs[i].id);
			}
		});
	}else if(request.name == "stefanchromeabout"){
		chrome.tabs.create({url: browserabout});
	}else if(request.name == "stefanbookmarkmanager"){
		chrome.tabs.create({url: browserbookmarks});
	}else if(request.name == "stefanhometab"){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			var tab = tabs[0];
			chrome.tabs.update(tab.id, {url: browsernewtab});
		});
	}else if(request.name == "stefanhistory"){
		chrome.tabs.create({url: browserhistory});
	}else if(request.name == "stefansavemhtml"){
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["pageCapture"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
					var tab = tabs[0];
					chrome.pageCapture.saveAsMHTML({"tabId": tab.id}, function(data){
						saveAs(data, tab.title + ".mhtml");
					});
				});
			}else{
				var txtpermission = chrome.i18n.getMessage("permissionoption");
				window.alert(txtpermission);
			}
		});
	}else if(request.name == "stefancuttext"){
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["clipboardWrite"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				// do that
			}else{
				var txtpermission = chrome.i18n.getMessage("permissionoption");
				window.alert(txtpermission);
			}
		});
	}else if(request.name == "stefancopytext"){
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["clipboardWrite"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				// do that
			}else{
				var txtpermission = chrome.i18n.getMessage("permissionoption");
				window.alert(txtpermission);
			}
		});
	}else if(request.name == "stefanpastetext"){
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["clipboardRead"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				// do that
			}else{
				var txtpermission = chrome.i18n.getMessage("permissionoption");
				window.alert(txtpermission);
			}
		});
	}else if(request.name == "stefansettings"){
		chrome.tabs.create({url: browsersettings});
	}else if(request.name == "stefanzoomin"){
		chrome.tabs.query({active: true}, function(tabs){
			var tabId = tabs[0].id;
			chrome.tabs.getZoom(tabId, function(zoomFactor){
				zoomFactor += .05;
				chrome.tabs.setZoom(tabId, zoomFactor);
			});
		});
	}else if(request.name == "stefanzoomout"){
		chrome.tabs.query({active: true}, function(tabs){
			var tabId = tabs[0].id;
			chrome.tabs.getZoom(tabId, function(zoomFactor){
				var a = zoomFactor;
				var b = .05;
				zoomFactor = Math.abs(a - b);
				chrome.tabs.setZoom(tabId, zoomFactor);
			});
		});
	}else if(request.name == "stefanzoomactual"){
		chrome.tabs.query({active: true}, function(tabs){
			var tabId = tabs[0].id;
			chrome.tabs.setZoom(tabId, 1);
		});
	}else if(request.name == "stefanbookmarkadd"){
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["bookmarks"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
					var tab = tabs[0];
					chrome.bookmarks.create({title: tab.title, url: tab.url});
				});
			}else{
				var txtpermission = chrome.i18n.getMessage("permissionoption");
				window.alert(txtpermission);
			}
		});
	}else if(request.name == "stefanbookmarkaddall"){
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["bookmarks"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				chrome.tabs.query({currentWindow:true}, function(tabs){
					for(var i = 0; i < tabs.length; i++){
						chrome.bookmarks.create({title: tabs[i].title, url: tabs[i].url});
					}
				});
			}else{
				var txtpermission = chrome.i18n.getMessage("permissionoption");
				window.alert(txtpermission);
			}
		});
	}else if(request.name == "stefanswitchtabright"){
		chrome.windows.getLastFocused({populate: true},
			function(window){
				var foundSelected = false;
				for(var i = 0; i < window.tabs.length; i++){
					// Finding the selected tab.
					if(window.tabs[i].active){
						foundSelected = true;
					}else if(foundSelected){
						// Selecting the next tab.
						chrome.tabs.update(window.tabs[i].id, {active: true});
						return;
					}
				}
			});
	}else if(request.name == "stefanswitchtableft"){
		chrome.windows.getLastFocused({populate: true},
			function(window){
				var foundSelected = false;
				for(var i = window.tabs.length - 1; i >= 0; i--){
					// Finding the selected tab
					if(window.tabs[i].active){
						foundSelected = true;
					}else if(foundSelected){
						// Selecting the next tab
						chrome.tabs.update(window.tabs[i].id, {active: true});
						return;
					}
				}
			});
	}else if(request.name == "stefanduplicatetab"){
		chrome.tabs.query({active: true}, function(tabs){
			var tabId = tabs[0].id;
			chrome.tabs.duplicate(tabId);
		});
	}else if(request.name == "stefanpintab"){
		chrome.tabs.query({active: true}, function(tabs){
			var tabId = tabs[0].id;
			var pinned = tabs[0].pinned;
			if(pinned){
				chrome.tabs.update(tabId, {pinned: false});
			}else{
				chrome.tabs.update(tabId, {pinned: true});
			}
			sendResponse({pinit: pinned});
		});
		return true;
	}else if(request.name == "stefanmutetab"){
		chrome.tabs.query({active: true}, function(tabs){
			var tabId = tabs[0].id;
			var muted = tabs[0].mutedInfo.muted;
			if(muted){
				chrome.tabs.update(tabId, {muted: false});
			}else{
				chrome.tabs.update(tabId, {muted: true});
			}
			sendResponse({soundoff: muted});
		});
		return true;
	}else if(request.name == "stefanmuteothertab"){
		chrome.tabs.query({currentWindow:true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				if(!tabs[i].active){
					chrome.tabs.update(tabs[i].id, {muted: true});
				}
			}
		});
	}else if(request.name == "stefanmutealltabs"){
		chrome.tabs.query({currentWindow:true}, function(tabs){
			var muted = tabs[0].mutedInfo.muted;// check current tab, for all open tabs
			for(var i = 0; i < tabs.length; i++){
				if(muted){
					chrome.tabs.update(tabs[i].id, {muted: false});
				}else{
					chrome.tabs.update(tabs[i].id, {muted: true});
				}
			}
			sendResponse({soundoff: muted});
		});
		return true;
	}else if(request.name == "stefanminimise"){
		chrome.windows.getCurrent(null, function(window){
			chrome.windows.update(window.id, {state: "minimized"});
		});
	}else if(request.name == "stefanmaximize"){
		chrome.windows.getCurrent(null, function(window){
			chrome.windows.update(window.id, {state: "maximized"});
		});
	}else if(request.name == "stefandownloads"){
		chrome.windows.create({url: browserdownloads});
	}else if(request.name == "stefanextensions"){
		chrome.windows.create({url: browserextensions});
	}else if(request.name == "stefanpolicy"){
		chrome.windows.create({url: browserpolicy});
	}else if(request.name == "stefaninspect"){
		chrome.windows.create({url: browserinspect});
	}else if(request.name == "stefanflags"){
		chrome.windows.create({url: browserflags});
	}else if(request.name == "stefanremovebar"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				// Send a request to the content script.
				chrome.storage.sync.set({"addbar": false});
				chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
			}
		}
		);
	}else if(request.name == "stefanprint"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "goprint"});
			}
		}
		);
	}else if(request.name == "stefanselectall"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "goselectall"});
			}
		}
		);
	}else if(request.name == "stefanstoppage"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "gostop"});
			}
		}
		);
	}else if(request.name == "stefanreloadpage"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "goreload"});
			}
		}
		);
	}else if(request.name == "stefanfullscreenpage"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "gofullscreen"});
			}
		}
		);
	}else if(request.name == "stefanhistoryback"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "goback"});
			}
		}
		);
	}else if(request.name == "stefanhistoryforward"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "goforward"});
			}
		}
		);
	}else if(request.name == "stefanthaturl"){
		if(request.tabaction == "_blank"){
			chrome.tabs.create({url: request.url});
		}else if(request.tabaction == "_self"){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				var tab = tabs[0];
				chrome.tabs.update(tab.id, {url: request.url});
			});
		}
	}else if(request.name == "stefanviewsource"){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			var tab = tabs[0];
			chrome.tabs.create({url: "view-source:" + tab.url});
		});
	}else if(request.name == "getallpermissions"){
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
	}else if(request.name == "contextmenuon"){
		checkcontextmenus();
	}else if(request.name == "contextmenuoff"){
		removecontexmenus();
	}
});

// update when refresh on the tab
/* chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if((tab.url.match(/^http/i))){
            chrome.tabs.query({active: true}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
                    }
                }
            );
		}
});*/

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		for(var i = 0; i < tabs.length; i++){
			chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
		}
	}
	);
});

// contextMenus
function onClickHandler(info){
	if(info.menuItemId == "totlguideemenu"){
		chrome.tabs.create({url: linkguide, active:true});
	}else if(info.menuItemId == "totldevelopmenu"){
		chrome.tabs.create({url: linkdonate, active:true});
	}else if(info.menuItemId == "totlratemenu"){
		chrome.tabs.create({url: writereview, active:true});
	}else if(info.menuItemId == "totlshareemail"){
		var sturnoffthelightemail = "mailto:your@email.com?subject=" + chrome.i18n.getMessage("sharetexta") + "&body=" + chrome.i18n.getMessage("sharetextb") + " " + linkproduct; chrome.tabs.create({url: sturnoffthelightemail, active:true});
	}else if(info.menuItemId == "totlsharetwitter"){
		var slinkproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextd") + " " + linkproduct); chrome.tabs.create({url: "https://twitter.com/intent/tweet?text=" + slinkproductcodeurl, active:true});
	}else if(info.menuItemId == "totlsharefacebook"){
		chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u=" + linkproduct, active:true});
	}else if(info.menuItemId == "totlsubscribe"){
		chrome.tabs.create({url: linkyoutube, active:true});
	}else if(info.menuItemId == "totlshareqq"){
		chrome.tabs.create({url: "https://connect.qq.com/widget/shareqq/index.html?url=" + encodeURIComponent(linkproduct) + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
	}else if(info.menuItemId == "totlshareweibo"){
		chrome.tabs.create({url: "https://service.weibo.com/share/share.php?url=" + linkproduct + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
	}else if(info.menuItemId == "totlsharevkontakte"){
		chrome.tabs.create({url: "https://vk.com/share.php?url=" + linkproduct, active:true});
	}else if(info.menuItemId == "totlsharewhatsapp"){
		chrome.tabs.create({url: "https://api.whatsapp.com/send?text=" + chrome.i18n.getMessage("sharetextd") + "%0a" + linkproduct, active:true});
	}
}

// check to remove all contextmenus
if(chrome.contextMenus){
	chrome.contextMenus.removeAll(function(){
	// console.log("contextMenus.removeAll callback");
	});
}

var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");
var sharemenupostonweibo = chrome.i18n.getMessage("sharemenupostonweibo");
var sharemenupostonvkontakte = chrome.i18n.getMessage("sharemenupostonvkontakte");
var sharemenupostonwhatsapp = chrome.i18n.getMessage("sharemenupostonwhatsapp");
var sharemenupostonqq = chrome.i18n.getMessage("sharemenupostonqq");

function browsercontext(a, b, c, d){
	var item = {"title": a, "type": "normal", "id": b, "contexts": contexts};
	var newitem;
	if(d != ""){
		item = Object.assign({}, item, {parentId: d});
	}
	if(c != ""){
		newitem = Object.assign({}, item, {icons: c});
	}
	try{
		// try show web browsers that do support "icons"
		// Firefox, Opera, Microsoft Edge
		return chrome.contextMenus.create(newitem);
	}catch(e){
		// catch web browsers that do NOT show the icon
		// Google Chrome
		return chrome.contextMenus.create(item);
	}
}

var actionmenuadded = false;
if(chrome.contextMenus){
	if(actionmenuadded == false){
		actionmenuadded = true;

		var contexts = ["action"];

		browsercontext(sharemenuwelcomeguidetitle, "totlguideemenu", {"16": "images/IconGuide.png", "32": "images/IconGuide@2x.png"});
		browsercontext(sharemenudonatetitle, "totldevelopmenu", {"16": "images/IconDonate.png", "32": "images/IconDonate@2x.png"});
		browsercontext(sharemenuratetitle, "totlratemenu", {"16": "images/IconStar.png", "32": "images/IconStar@2x.png"});

		// Create a parent item and two children.
		var parent = null;
		parent = browsercontext(sharemenusharetitle, "totlsharemenu", {"16": "images/IconShare.png", "32": "images/IconShare@2x.png"});
		browsercontext(sharemenutellafriend, "totlshareemail", {"16": "images/IconEmail.png", "32": "images/IconEmail@2x.png"}, parent);
		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});

		var uiLanguage = chrome.i18n.getUILanguage();
		if(uiLanguage.includes("zh")){
			// Chinese users
			browsercontext(sharemenupostonweibo, "totlshareweibo", {"16": "images/IconWeibo.png", "32": "images/IconWeibo@2x.png"}, parent);
			browsercontext(sharemenupostonqq, "totlshareqq", {"16": "images/IconQQ.png", "32": "images/IconQQ@2x.png"}, parent);
		}else if(uiLanguage.includes("ru")){
			// Russian users
			browsercontext(sharemenupostonvkontakte, "totlsharevkontakte", {"16": "images/IconVkontakte.png", "32": "images/IconVkontakte@2x.png"}, parent);
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenusendatweet, "totlsharetwitter", {"16": "images/IconTwitter.png", "32": "images/IconTwitter@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenusendatweet, "totlsharetwitter", {"16": "images/IconTwitter.png", "32": "images/IconTwitter@2x.png"}, parent);
		}

		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
		browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.storage.sync.get(["contextmenus"], function(items){
	if(items["contextmenus"]){ checkcontextmenus(); }
});

// context menu for page
var menupage = null;
var contextmenuadded = false;
var contextarraypage = [];
var contextspage = null;

var pagetitle = chrome.i18n.getMessage("pagetitle");
function checkcontextmenus(){
	if(chrome.contextMenus){
		if(contextmenuadded == false){
			contextmenuadded = true;

			// page
			var contextspage = ["page"];
			menupage = chrome.contextMenus.create({"title": pagetitle, "type":"normal", "id": "pmpage", "contexts":contextspage});
			contextarraypage.push(menupage);
		}
	}
}

function removecontexmenus(){
	if(contextspage != null){
		chrome.contextMenus.remove("pmpage");
	}
	contextspage = null;
	contextmenuadded = false;
}

chrome.commands.onCommand.addListener(function(command){
	if(command == "toggle-feature-propermenubar"){
		var addbar = null;
		chrome.storage.sync.get(["addbar"], function(items){
			if(items["addbar"]){ addbar = items["addbar"]; }if(addbar == null)addbar = true;
			chrome.tabs.query({active: true}, function(tabs){
				for(var i = 0; i < tabs.length; i++){
					if(addbar == true){
						chrome.storage.sync.set({"addbar": false});
						chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
					}else{
						chrome.storage.sync.set({"addbar": true});
						chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
					}
				}
			}
			);
		});
	}
});

function refreshtoolbar(){
	chrome.tabs.query({}, function(tabs){
		for(var i = 0; i < tabs.length; ++i){
			chrome.tabs.sendMessage(tabs[i].id, {action: "toolbarrefresh"});
		}
	});
}

function onchangestorage(a, b, c, d){
	if(a[b]){
		if(a[b].newValue == true){ c(); }else{ d(); }
	}
}

chrome.storage.onChanged.addListener(function(changes){
	onchangestorage(changes, "contextmenus", checkcontextmenus, removecontexmenus);
	if(changes["googleproducts"]){ if(changes["googleproducts"].newValue){ refreshtoolbar(); } }
	if(changes["menuproducts"]){ if(changes["menuproducts"].newValue){ refreshtoolbar(); } }
	if(changes["googlebarDomains"]){ if(changes["googlebarDomains"].newValue){ refreshtoolbar(); } }
	if(changes["getpositiontop"]){ if(changes["getpositiontop"].newValue){ refreshtoolbar(); } }
	if(changes["getpositionbottom"]){ if(changes["getpositionbottom"].newValue){ refreshtoolbar(); } }
	if(changes["country"]){ if(changes["country"].newValue){ refreshtoolbar(); } }
	if(changes["display"]){ if(changes["display"].newValue){ refreshtoolbar(); } }
	if(changes["fontcolor"]){ if(changes["fontcolor"].newValue){ refreshtoolbar(); } }
	if(changes["hovertextcolor"]){ if(changes["hovertextcolor"].newValue){ refreshtoolbar(); } }
	if(changes["hoverbackground"]){ if(changes["hoverbackground"].newValue){ refreshtoolbar(); } }
	if(changes["dropshadow"]){ if(changes["dropshadow"].newValue){ refreshtoolbar(); } }
	if(changes["backgroundcolor"]){ if(changes["backgroundcolor"].newValue){ refreshtoolbar(); } }
	if(changes["opacity"]){ if(changes["opacity"].newValue){ refreshtoolbar(); } }
	if(changes["backgroundimage"]){ if(changes["backgroundimage"].newValue){ refreshtoolbar(); } }
	if(changes["googlesites"]){ if(changes["googlesites"].newValue){ refreshtoolbar(); } }
	if(changes["allsites"]){ if(changes["allsites"].newValue){ refreshtoolbar(); } }
	if(changes["toolbaronly"]){ if(changes["toolbaronly"].newValue){ refreshtoolbar(); } }
	if(changes["toolbarwhite"]){ if(changes["toolbarwhite"].newValue){ refreshtoolbar(); } }
	if(changes["toolbarblack"]){ if(changes["toolbarblack"].newValue){ refreshtoolbar(); } }
	if(changes["search"]){ if(changes["search"].newValue){ refreshtoolbar(); } }
	if(changes["existingtab"]){ if(changes["existingtab"].newValue){ refreshtoolbar(); } }
	if(changes["backgroundimagesource"]){ if(changes["backgroundimagesource"].newValue){ refreshtoolbar(); } }
});

chrome.runtime.setUninstallURL(linkuninstall);

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "2.0", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});

/*
TODO
+ emails features
+ shortcut key combination in the bar alt+ctrl
+ shortcut key focus menu item one by one
   https://stackoverflow.com/questions/50257057/how-to-navigate-through-li-elements-using-arrow-keys-jquery

+ popup panel design
*/