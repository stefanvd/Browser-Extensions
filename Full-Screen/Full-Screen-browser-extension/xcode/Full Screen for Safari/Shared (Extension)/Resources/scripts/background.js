//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2025 Stefan vd
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
// Execute if importScripts is support such as Google Chrome and not Firefox
if(typeof importScripts !== "undefined"){
	// eslint-disable-next-line no-undef
	importScripts("constants.js");
}

chrome.runtime.onMessage.addListener(function request(request, sender){
	switch(request.name){
	case"bckreload":
		installation();
		break;
	case"redirectionoptions":
		chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
			chrome.tabs.remove(tabs[0].id);
			chrome.runtime.openOptionsPage();
		});
		break;
	case"youtubefullscreen":
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.scripting.executeScript({
					target: {tabId: tabs[i].id},
					files: ["scripts/video.js"]
				});
			}
		}
		);
		break;
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	case"sendcurrentmaximize":
		chrome.windows.getCurrent(function(window){
			if(window.state == "maximized"){
				chrome.windows.update(window.id, {state: oldwindowstatus});
			}else{
				oldwindowstatus = window.state;
				chrome.windows.update(window.id, {state: "maximized"});
			}
		});
		break;
	case"sendallmaximize":
		chrome.windows.getAll({}, function(windows){
			windows.forEach(function(window){
				if(window.state == "maximized"){
					chrome.windows.update(window.id, {state: "normal"});
				}else{
					chrome.windows.update(window.id, {state: "maximized"});
				}
			});
		});
		break;
	case"sendcurrentfullscreen":
		chrome.windows.getCurrent(function(window){
			if(window.state == "fullscreen"){
				chrome.windows.update(window.id, {state: oldwindowstatus});
			}else{
				oldwindowstatus = window.state;
				chrome.windows.update(window.id, {state: "fullscreen"});
			}
		});
		break;
	case"sendallfullscreen":
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
		break;
	case"sendcurrentpopup":
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			// close current tab
			var websiteurl = tabs[0].url;
			if(tabs[0]){
				chrome.tabs.remove(tabs[0].id);
			}
			// open popup window
			createpopup(websiteurl);
		});
		break;
	case"updateContextMenu":
		renewcontextmenu();
		break;
	case"sendalltabspopup":
		chrome.tabs.query({currentWindow: true}, function(tabs){
			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const macTopOffset = isMac ? 48 : 0;

			getcurrentscreensize.then((result) => {
				const screenWidth = result[0];
				const screenHeight = result[1];

				for(let i = 0; i < tabs.length; i++){
					const url = tabs[i].url;
					chrome.tabs.remove(tabs[i].id);

					// ---- 2 WINDOWS ----
					if(tabs.length === 2){
						const w = Math.floor(screenWidth / 2);
						const h = screenHeight;
						const left = i * w;

						chrome.windows.create({
							url,
							type: "popup",
							width: w,
							height: h,
							left,
							top: macTopOffset
						});

						// ---- 3 WINDOWS ----
					}else if(tabs.length === 3){
						const w = Math.floor(screenWidth / 2);
						const h = Math.floor(screenHeight / 2);

						if(i === 2){
							chrome.windows.create({
								url,
								type: "popup",
								width: w,
								height: screenHeight,
								left: 0,
								top: macTopOffset
							});
						}else{
							chrome.windows.create({
								url,
								type: "popup",
								width: w,
								height: h,
								left: w,
								top: i * h + macTopOffset
							});
						}

						// ---- 4 WINDOWS ----
					}else if(tabs.length === 4){
						const w = Math.floor(screenWidth / 2);
						const h = Math.floor(screenHeight / 2);

						const left = (i % 2) * w;
						const top = (i < 2 ? 0 : h);

						chrome.windows.create({
							url,
							type: "popup",
							width: w,
							height: h,
							left,
							top: top + macTopOffset
						});

						// ---- DEFAULT ----
					}else{
						createpopup(url);
					}
				}
			});
		});
		break;
	}
});

function renewcontextmenu(){
	if(contextmenuadded == true){
		chrome.windows.getCurrent(null, function(window){
			if(window){
				if(window.type == "popup"){
					chrome.contextMenus.update("fspage", {"title": chrome.i18n.getMessage("backpopuptitle")});
				}else{
					chrome.contextMenus.update("fspage", {"title": chrome.i18n.getMessage("pagetitle")});
				}
			}
		});
	}
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
var fullscreenweb = null, fullscreenwindow = null, fullscreenpopup = null, fullscreenvideo = null, allwindows = null, autostartup = null, autostartupall = null, autostartupcurrent = null, videoinwindow = null;

async function getPopupOpenLength(){
	var total = (await chrome.runtime.getContexts({contextTypes: ["POPUP"]})).length;
	return total;
}

function actionbutton(tab){
	chrome.windows.getCurrent(function(window){
		chrome.storage.sync.get(["fullscreenweb", "fullscreenwindow", "fullscreenpopup", "fullscreenvideo", "allwindows", "videoinwindow"], function(items){
			fullscreenweb = items["fullscreenweb"]; if(fullscreenweb == null)fullscreenweb = true;
			fullscreenwindow = items["fullscreenwindow"];
			fullscreenpopup = items["fullscreenpopup"];
			fullscreenvideo = items["fullscreenvideo"];
			allwindows = items["allwindows"];
			videoinwindow = items["videoinwindow"];

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
					// chrome.scripting.executeScript({
					// 	target: {tabId: tab.id},
					//	files: ["scripts/fullscreen.js"]
					// });
					// }
				}
			}else if(fullscreenwindow == true){
				setfullscreenwindow();
			}else if(fullscreenpopup == true){
				setfullscreenpopup();
			}else if(fullscreenvideo == true){
				if(videoinwindow == true){
					chrome.tabs.sendMessage(tab.id, {name: "govideoinwindow"});
				}else{
					setfullscreenvideo(tab);
				}
			}
		});
	});
}

// Set click to zero at beginning
let clickbutton = 0;
// Declare a timer variable
let timer;

if(exbrowser != "safari"){
	chrome.action.onClicked.addListener(async(tab) => {
		clickbutton += 1;
		timer = setTimeout(function(){
			getPopupOpenLength().then((thatpanellength) => {
				if(thatpanellength != 0){
					// console.log("Doubleclick");
					// console.log("yes popup open")
					clickbutton = 0;
					clearTimeout(timer);
				}else{
					// console.log("no popup open")
					if(clickbutton == 1){
						actionbutton(tab);
					}
					clickbutton = 0;
					// Clear all timers
					clearTimeout(timer);
				}
			});
			chrome.action.setPopup({tabId: tab.id, popup:""});
		}, 250);
		chrome.action.setPopup({tabId: tab.id, popup:"palette.html"});
	});
}else{
	// safari does not support "chrome.runtime.getContexts"
	// count click actions
	chrome.action.onClicked.addListener(function(tab){
		clickbutton += 1;
		if(clickbutton == 2){
			// console.log("Doubleclick");
			clearTimeout(timer);
			chrome.action.setPopup({tabId: tab.id, popup:"palette.html"});
			chrome.action.openPopup();
			// reset flag shortly after popup opens or fails
			setTimeout(() => { chrome.action.setPopup({tabId: tab.id, popup:""}); }, 500);
		}

		timer = setTimeout(function(){
			// console.log("Singelclick");
			if(clickbutton == 1){
				actionbutton(tab);
			}
			clickbutton = 0;
			// Clear all timers
			clearTimeout(timer);
		}, 250);
	});
}

let getcurrentscreensize = new Promise((resolve) => {
	if(exbrowser != "firefox" && exbrowser != "safari"){
		chrome.system.display.getInfo(function(display_properties){
			// console.log("screen", [display_properties[0].bounds.width, display_properties[0].bounds.height]);
			resolve([display_properties[0].workArea.width, display_properties[0].workArea.height]);
		});
	}else{
		const width = window.screen.availWidth;
		const height = window.screen.availHeight;
		resolve([width, height]);
	}
});

var fullpopup, custompopup, custompopuppixelwidth, custompopuppixelheight, screenWidth, screenHeight;
function createpopup(websiteurl){
	getcurrentscreensize.then(
		(result) => {
			chrome.storage.sync.get(["fullpopup", "custompopup", "custompopuppixelwidth", "custompopuppixelheight"], function(items){
				fullpopup = items["fullpopup"]; if(fullpopup == null)fullpopup = true;
				custompopup = items["custompopup"]; if(custompopup == null)custompopup = true;
				custompopuppixelwidth = items["custompopuppixelwidth"]; if(custompopuppixelwidth == null)custompopuppixelwidth = 600;
				custompopuppixelheight = items["custompopuppixelheight"]; if(custompopuppixelheight == null)custompopuppixelheight = 400;

				if(fullpopup == true){
					screenWidth = result[0];
					screenHeight = result[1];
				}else{
					screenWidth = parseInt(custompopuppixelwidth);
					screenHeight = parseInt(custompopuppixelheight);
				}
				chrome.windows.create({
					url: websiteurl,
					type: "popup",
					focused: true,
					// state: "maximized" // no support for that in "popup" (Google Chrome and Firefox)
					width: screenWidth,
					height: screenHeight
				});

			});
		}
	);
}

function setfullscreenpopup(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		// close current tab
		var websiteurl = tabs[0].url;
		if(tabs[0]){
			chrome.tabs.remove(tabs[0].id);
		}
		// open popup window
		createpopup(websiteurl);
	});
}

function setfullscreenvideo(tabs){
	if(allwindows == true){
		chrome.tabs.query({}, function(tabs){
			var i;
			var l = tabs.length;
			for(i = 0; i < l; i++){
				chrome.scripting.executeScript({
					target: {tabId: tabs[i].id},
					files: ["scripts/video.js"]
				}, function(){
					if(chrome.runtime.lastError){
						// console.error(chrome.runtime.lastError.message);
					}
				});
			}
		}
		);
	}else{
		chrome.scripting.executeScript({
			target: {tabId: tabs.id},
			files: ["scripts/video.js"]
		}, function(){
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
		chrome.windows.getCurrent(function(window){
			if(window.state == "maximized"){
				chrome.windows.update(window.id, {state: "normal"});
			}else{
				chrome.windows.update(window.id, {state: "maximized"});
			}
		});
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
			// chrome.scripting.executeScript({
			// 	target: {tabId: tab.id},
			//	files: ["scripts/fullscreen.js"]
			// });
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
	}else if(info.menuItemId == "totlsharex"){
		var slinkproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextd") + " " + linkproduct); chrome.tabs.create({url: "https://x.com/intent/tweet?text=" + slinkproductcodeurl, active:true});
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
	}else if(info.menuItemId == "totloptions"){
		chrome.runtime.openOptionsPage();
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
var sharemenupostonx = chrome.i18n.getMessage("sharemenupostonx");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
// var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
// var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");
var sharemenupostonweibo = chrome.i18n.getMessage("sharemenupostonweibo");
var sharemenupostonvkontakte = chrome.i18n.getMessage("sharemenupostonvkontakte");
var sharemenupostonwhatsapp = chrome.i18n.getMessage("sharemenupostonwhatsapp");
var sharemenupostonqq = chrome.i18n.getMessage("sharemenupostonqq");
var sharemenuoptions = chrome.i18n.getMessage("titelpopupoptions");

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
		// browsercontext(sharemenuratetitle, "totlratemenu", {"16": "images/IconStar.png", "32": "images/IconStar@2x.png"});

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
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}

		// browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		if(exbrowser == "safari" || exbrowser == "firefox"){
			chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
			browsercontext(sharemenuoptions, "totloptions", {"16": "images/options.png", "32": "images/options@2x.png"});
		}

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

var contextmenus;
chrome.storage.sync.get(["contextmenus"], function(items){
	contextmenus = items.contextmenus; if(contextmenus == null)contextmenus = true;
	if(contextmenus){ checkcontextmenus(); }
});

// context menu for page and video
var menuitems = null;
var contextmenuadded = false;
var contextarrayvideo = [];
var contextarrayimage = [];
var contextarraypage = [];
var contextsvideo = null;
var contextsimage = null;
var contextspage = null;

function addwebpagecontext(a, b, c, d){
	var k;
	var addvideolength = b.length;
	for(k = 0; k < addvideolength; k++){
		var contextvideo = b[k];
		menuitems = chrome.contextMenus.create({"title": a, "type":"normal", "id": d, "contexts":[contextvideo]});
		c.push(menuitems);
	}
}

function checkcontextmenus(){
	if(chrome.contextMenus){
		if(contextmenuadded == false){
			contextmenuadded = true;
			// video
			var videotitle = chrome.i18n.getMessage("videotitle");
			var contextsvideo = ["video"];
			addwebpagecontext(videotitle, contextsvideo, contextarrayvideo, "fsvideo");
			// image
			var imagetitle = chrome.i18n.getMessage("imagetitle");
			var contextsimage = ["image"];
			addwebpagecontext(imagetitle, contextsimage, contextarrayimage, "fsimage");
			// page
			var pagetitle = chrome.i18n.getMessage("pagetitle");
			var contextspage = ["page"];
			addwebpagecontext(pagetitle, contextspage, contextarraypage, "fspage");
		}
	}
}

function removecontexmenus(){
	if(contextsvideo != null){
		chrome.contextMenus.remove("fsvideo");
	}
	if(contextsimage != null){
		chrome.contextMenus.remove("fsimage");
	}
	if(contextspage != null){
		chrome.contextMenus.remove("fspage");
	}
	contextsvideo = null;
	contextsimage = null;
	contextspage = null;
	contextmenuadded = false;
}

function onchangestorage(a, b, c, d){
	if(a[b]){
		if(a[b].newValue == true){ c(); }else{ d(); }
	}
}

chrome.storage.sync.get(["icon"], function(items){
	if(items["icon"] == undefined){
		if(exbrowser == "safari"){
			items["icon"] = "/images/icon38.png";
		}else{
			items["icon"] = "/images/icon38.png";
		}
	}
	chrome.action.setIcon({
		path : {
			"19": items["icon"],
			"38": items["icon"]
		}
	});
});

chrome.storage.onChanged.addListener(function(changes){
	onchangestorage(changes, "contextmenus", checkcontextmenus, removecontexmenus);
	if(changes["icon"]){
		if(changes["icon"].newValue){
			chrome.tabs.query({}, function(tabs){
				var i, l = tabs.length;
				for(i = 0; i < l; i++){
					chrome.action.setIcon({tabId : tabs[i].id,
						path : {
							"19": changes["icon"].newValue,
							"38": changes["icon"].newValue
						}
					});
				}
			}
			);
		}
	}
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
	if(changes["autofullscreen"] || changes["autofullscreenonly"] || changes["autofullscreenchecklistwhite"] || changes["autofullscreenchecklistblack"]){
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

chrome.runtime.onStartup.addListener(function(){
	chrome.storage.sync.get(["autostartup", "autostartupall", "autostartupcurrent"], function(items){
		autostartup = items["autostartup"]; if(autostartup == null)autostartup = false;
		autostartupall = items["autostartupall"]; if(autostartupall == null)autostartupall = true;
		autostartupcurrent = items["autostartupcurrent"]; if(autostartupcurrent == null)autostartupcurrent = false;

		if(autostartup == true){
			if(autostartupall == true){
				chrome.windows.getAll().then((windowInfoArray) => {
					var currentWindow;
					for(currentWindow of windowInfoArray){
						chrome.windows.update(currentWindow.id, {state: "fullscreen"});
					}
				});
			}else{
				chrome.windows.getCurrent().then((currentWindow) => {
					chrome.windows.update(currentWindow.id, {state: "fullscreen"});
				});
			}
		}
	});
});