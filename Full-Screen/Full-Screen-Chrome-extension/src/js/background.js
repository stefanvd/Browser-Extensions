//================================================
/*

Full Screen
Go full screen with one click on the button.
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

chrome.runtime.onMessage.addListener(function request(request, sender){
	if(request.name == "youtubefullscreen"){
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.executeScript(tabs[i].id, {file: "js/video.js"});
			}
		}
		);
	}else if(request.name == "sendautoplay"){
		var oReq = new XMLHttpRequest();
		oReq.onreadystatechange = function(){ if(oReq.readyState == 4){ chrome.tabs.sendMessage(sender.tab.id, {name: "injectvideostatus", message: oReq.responseText}); } };
		oReq.open("GET", "/js/injected.js", true); oReq.send();
	}else if(request.name == "contextmenuon"){ checkcontextmenus(); }else if(request.name == "contextmenuoff"){ removecontexmenus(); }else if(request.name == "getallpermissions"){
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
	}else if(request.name == "sendcurrentmaximize"){
		chrome.windows.getCurrent(function(window){
			if(window.state == "maximized"){
				chrome.windows.update(window.id, {state: oldwindowstatus});
			}else{
				oldwindowstatus = window.state;
				chrome.windows.update(window.id, {state: "maximized"});
			}
		});
	}else if(request.name == "sendallmaximize"){
		chrome.windows.getAll({}, function(windows){
			windows.forEach(function(window){
				if(window.state == "maximized"){
					chrome.windows.update(window.id, {state: "normal"});
				}else{
					chrome.windows.update(window.id, {state: "maximized"});
				}
			});
		});
	}else if(request.name == "sendcurrentfullscreen"){
		chrome.windows.getCurrent(function(window){
			if(window.state == "fullscreen"){
				chrome.windows.update(window.id, {state: oldwindowstatus});
			}else{
				oldwindowstatus = window.state;
				chrome.windows.update(window.id, {state: "fullscreen"});
			}
		});
	}else if(request.name == "sendallfullscreen"){
		chrome.windows.getAll({}, function(windows){
			windows.forEach(function(window){
				if(window.state == "fullscreen"){
					chrome.windows.update(window.id, {state: oldwindowstatus});
				}else{
					chrome.windows.update(window.id, {state: "fullscreen"});
					oldwindowstatus = window.state;
				}
			});
		});
	}else if(request.name == "sendcurrentpopup"){
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			// close current tab
			var websiteurl = tabs[0].url;
			if(tabs[0]){
				chrome.tabs.remove(tabs[0].id);
			}
			// open popup window
			chrome.tabs.create({
				url: websiteurl,
				active: false
			}, function(tab){
				// After the tab has been created, open a window to inject the tab
				chrome.windows.create({
					tabId: tab.id,
					type: "popup",
					focused: true,
					state:"maximized"
				});
			});
		}
		);
	}else if(request.name == "updateContextMenu"){
		renewcontextmenu();
	}else if(request.name == "sendalltabspopup"){
		chrome.tabs.query({currentWindow: true}, function(tabs){


			var screenWidth = screen.availWidth;
			var screenHeight = screen.availHeight;

			var i = 0;
			var l = tabs.length;
			for(i; i < l; i++){
				// support up to 2x2 matrix
				// example: 2 popup windows
				if(l == 2){
					var lefta = (screenWidth / 2);
					var wa = (screenWidth / 2);
					var ha = (screenHeight);
					var websiteurla = tabs[i].url;
					if(tabs[i]){
						chrome.tabs.remove(tabs[i].id);
					}
					chrome.windows.create({url: websiteurla, type: "popup", width: wa, height: ha, left: i * lefta, top: 0});
				}else if(l == 3){
					var leftb = (screenWidth / 2);
					var topb = (screenHeight / 2);
					var wb = (screenWidth / 2);
					var hb = (screenHeight / 2);
					var websiteurlb = tabs[i].url;
					if(tabs[i]){
						chrome.tabs.remove(tabs[i].id);
					}
					if(i == 2){
						chrome.windows.create({url: websiteurlb, type: "popup", width: wb, height: screenHeight, left: 0, top: 0});
					}else{
						chrome.windows.create({url: websiteurlb, type: "popup", width: wb, height: hb, left: leftb, top: i * topb});
					}
				}else if(l == 4){
					var leftc = (screenWidth / 2);
					var topc = (screenHeight / 2);
					var wc = (screenWidth / 2);
					var hc = (screenHeight / 2);
					var websiteurlc = tabs[i].url;
					if(tabs[i]){
						chrome.tabs.remove(tabs[i].id);
					}
					if(i == 0){
						chrome.windows.create({url: websiteurlc, type: "popup", width: wc, height: hc, left: 0, top: 0});
					}else if(i == 1){
						chrome.windows.create({url: websiteurlc, type: "popup", width: wc, height: hc, left: 0, top: top});
					}else if(i == 2){
						chrome.windows.create({url: websiteurlc, type: "popup", width: wc, height: hc, left: leftc, top: 0});
					}else if(i == 3){
						chrome.windows.create({url: websiteurlc, type: "popup", width: wc, height: hc, left: leftc, top: topc});
					}
				}else{
					// regular open tab in background popup window
					var websiteurl = tabs[i].url;
					if(tabs[i]){
						chrome.tabs.remove(tabs[i].id);
					}
					// open popup window
					chrome.tabs.create({
						url: websiteurl,
						active: false
					}, function(tab){
						// After the tab has been created, open a window to inject the tab
						chrome.windows.create({
							tabId: tab.id,
							type: "popup",
							focused: true,
							state:"maximized"
						});
					});
				}
			}


		}
		);
	}
});

function renewcontextmenu(){
	chrome.windows.getCurrent(null, function(window){
		if(window.type == "popup"){
			var backpopuptitle = chrome.i18n.getMessage("backpopuptitle");
			chrome.contextMenus.update("fspage", {"title": backpopuptitle});
		}else{
			var pagetitle = chrome.i18n.getMessage("pagetitle");
			chrome.contextMenus.update("fspage", {"title": pagetitle});
		}
	});
}

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(){
	renewcontextmenu();
});

// focus window changed (from popup to window)
chrome.windows.onFocusChanged.addListener(function(){
	renewcontextmenu();
});

var oldwindowstatus;
var fullscreenweb = null, fullscreenwindow = null, fullscreenpopup = null, fullscreenvideo = null, allwindows = null;

// Set click to false at beginning
var alreadyClicked = false;
// Declare a timer variable
var timer;
chrome.action.onClicked.addListener(function(tabs){

	// Check for previous click
	if(alreadyClicked){
		// console.log("Doubleclick");
		// Yes, Previous Click Detected
		// Clear timer already set in earlier Click
		clearTimeout(timer);
		// Show the popup window
		// Clear all Clicks
		alreadyClicked = false;
		chrome.action.setPopup({tabId: tabs.id, popup:""});
		return;
	}


	// Set Click to  true
	alreadyClicked = true;
	chrome.action.setPopup({tabId: tabs.id, popup:"palette.html"});

	// Add a timer to detect next click to a sample of 250
	timer = setTimeout(function(){
		// console.log("Singelclick");
		var popups = chrome.extension.getViews({type: "popup"});
		if(popups.length != 0){ // popup exist

		}else{ // not exist

			chrome.windows.getCurrent(function(window){
				chrome.storage.sync.get(["fullscreenweb", "fullscreenwindow", "fullscreenpopup", "fullscreenvideo", "allwindows"], function(items){
					fullscreenweb = items["fullscreenweb"]; if(fullscreenweb == null)fullscreenweb = true;
					fullscreenwindow = items["fullscreenwindow"];
					fullscreenpopup = items["fullscreenpopup"];
					fullscreenvideo = items["fullscreenvideo"];
					allwindows = items["allwindows"];

					if(fullscreenweb == true){
						if(allwindows == true){
							chrome.windows.getAll({}, function(windows){
								windows.forEach(function(window){
									if(window.state == "fullscreen"){
										chrome.windows.update(window.id, {state: oldwindowstatus});
									}else{
										oldwindowstatus = window.state;
										chrome.windows.update(window.id, {state: "fullscreen"});
									}
								});
							});
						}else{
							// Firefox extension do not use the Full Screen API, permission issue. So use the Chrome window method
							// Bug Chrome: do not restore previous state
							if(window.state == "fullscreen"){
								chrome.windows.update(window.id, {state: oldwindowstatus});
							}else{
								oldwindowstatus = window.state;
								chrome.windows.update(window.id, {state: "fullscreen"});
							}

							// Chromium web browsers
							// Old way
							// if(tab.url.match(/^http/i)||tab.url.match(/^file/i)){
							//    chrome.tabs.executeScript(tab.id, { file: "js/fullscreen.js" });
							// }
						}
					}else if(fullscreenwindow == true){
						setfullscreenwindow();
					}else if(fullscreenpopup == true){
						setfullscreenpopup();
					}else if(fullscreenvideo == true){
						setfullscreenvideo(tabs);
					}
				});
			});

		}

		// Clear all timers
		clearTimeout(timer);
		// Ignore clicks
		alreadyClicked = false;
		chrome.action.setPopup({tabId: tabs.id, popup:""});
	}, 250);

});

function setfullscreenpopup(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		// close current tab
		var websiteurl = tabs[0].url;
		if(tabs[0]){
			chrome.tabs.remove(tabs[0].id);
		}
		// open popup window
		chrome.tabs.create({
			url: websiteurl,
			active: false
		}, function(tab){
			// After the tab has been created, open a window to inject the tab
			chrome.windows.create({
				tabId: tab.id,
				type: "popup",
				focused: true,
				state:"maximized"
			});
		});
	});
}

function setfullscreenvideo(tabs){
	if(allwindows == true){
		chrome.tabs.query({}, function(tabs){
			var i;
			var l = tabs.length;
			for(i = 0; i < l; i++){
				chrome.tabs.executeScript(tabs[i].id, {file: "js/video.js"}, function(){
					if(chrome.runtime.lastError){
						// console.error(chrome.runtime.lastError.message);
					}
				});
			}
		}
		);
	}else{
		chrome.tabs.executeScript(tabs.id, {file: "js/video.js"}, function(){
			if(chrome.runtime.lastError){
				// console.error(chrome.runtime.lastError.message);
			}
		});
	}
}

function setfullscreenwindow(){
	if(allwindows == true){
		chrome.windows.getAll({}, function(windows){
			windows.forEach(function(window){
				if(window.state == "maximized"){
					chrome.windows.update(window.id, {state: "normal"});
				}else{
					chrome.windows.update(window.id, {state: "maximized"});
				}
			});
		});
	}else{
		if(window.state == "maximized"){
			chrome.windows.update(window.id, {state: "normal"});
		}else{
			chrome.windows.update(window.id, {state: "maximized"});
		}
	}
}

// contextMenus
function onClickHandler(info, tab){
	if(info.menuItemId == "fsvideo" || info.menuItemId == "fsimage"){
		chrome.tabs.sendMessage(tab.id, {name: "gofullscreen"});
	}else if(info.menuItemId == "fspage"){
		chrome.windows.getCurrent(null, function(window){
			// Firefox extension do not use the Full Screen API, permission issue. So use the Chrome window method
			// Bug Chrome: do not restore previous state
			if(window.type == "popup"){
				chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
					// close current pop window
					var websiteurl = tabs[0].url;
					if(tabs[0]){
						chrome.tabs.remove(tabs[0].id);
						// and create tab
						chrome.tabs.create({url: websiteurl, active:true});
					}
				});
				// add back the regular page title
				var pagetitle = chrome.i18n.getMessage("pagetitle");
				chrome.contextMenus.update("fspage", {"title": pagetitle});
			}else{
				if(window.state == "fullscreen"){
					chrome.windows.update(window.id, {state: oldwindowstatus});
				}else{
					oldwindowstatus = window.state;
					chrome.windows.update(window.id, {state: "fullscreen"});
				}
			}

			// Chromium web browsers
			// Old way
			// if(tab.url.match(/^http/i)||tab.url.match(/^file/i)){
			//    chrome.tabs.executeScript(tab.id, { file: "js/fullscreen.js" });
			// }
		});
	}else if(info.menuItemId == "totlguideemenu"){
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
		var contextsvideo = ["video"];
		for(var i = 0; i < contextsvideo.length; i++){
			var contextvideo = contextsvideo[i];
			var videotitle = chrome.i18n.getMessage("videotitle");
			menuvideo = chrome.contextMenus.create({"title": videotitle, "type":"normal", "id": "fsvideo", "contexts":[contextvideo]});
			contextarrayvideo.push(menuvideo);
		}

		// image
		var contextsimage = ["image"];
		for(var j = 0; j < contextsimage.length; j++){
			var contextimage = contexts[j];
			var imagetitle = chrome.i18n.getMessage("imagetitle");
			menuimage = chrome.contextMenus.create({"title": imagetitle, "type":"normal", "id": "fsimage", "contexts":[contextimage]});
			contextarrayimage.push(menuimage);
		}

		// page
		var contextspage = ["page"];
		for(var k = 0; k < contextspage.length; k++){
			var context = contexts[k];
			var pagetitle = chrome.i18n.getMessage("pagetitle");
			menupage = chrome.contextMenus.create({"title": pagetitle, "type":"normal", "id": "fspage", "contexts":[context]});
			contextarraypage.push(menupage);
		}

	}
}

function removecontexmenus(){
    // todo
	if(contextarrayvideo.length > 0){
		for(var i = 0; i < contextarrayvideo.length; i++){
			if(contextarrayvideo[i] === undefined || contextarrayvideo[i] === null){}else{
				chrome.contextMenus.remove(contextarrayvideo[i]);
			}
		}
	}
	if(contextarrayimage.length > 0){
		for(var i = 0; i < contextarrayimage.length; i++){
			if(contextarrayimage[i] === undefined || contextarrayimage[i] === null){}else{
				chrome.contextMenus.remove(contextarrayimage[i]);
			}
		}
	}
	if(contextarraypage.length > 0){
		for(var i = 0; i < contextarraypage.length; i++){
			if(contextarraypage[i] === undefined || contextarraypage[i] === null){}else{
				chrome.contextMenus.remove(contextarraypage[i]);
			}
		}
	}
	contextarrayvideo = [];
	contextarrayimage = [];
	contextarraypage = [];
	contextmenuadded = false;
}

function onchangestorage(a, b, c, d){
	if(a[b]){
		if(a[b].newValue == true){ c(); }else{ d(); }
	}
}

chrome.storage.onChanged.addListener(function(changes){
	onchangestorage(changes, "contextmenus", checkcontextmenus, removecontexmenus);
	if(changes["videoinwindow"]){
		// change for videoinwindow and videooutwindow
		chrome.tabs.query({}, function(tabs){
			var i;
			var l = tabs.length;
			for(i = 0; i < l; i++){
				chrome.tabs.sendMessage(tabs[i].id, {name: "gorefreshvideoinwindow"});
			}
		});
	}
	if(changes["autofullscreen"]){
		chrome.tabs.query({}, function(tabs){
			var i;
			var l = tabs.length;
			for(i = 0; i < l; i++){
				chrome.tabs.sendMessage(tabs[i].id, {name: "gorefreshautofullscreen"});
			}
		});
	}
});

chrome.runtime.setUninstallURL(linkuninstall);

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "0.1", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});

/* todo
+ fspage context menu
+ check css and image in options.html
+ translation i18n check


*/