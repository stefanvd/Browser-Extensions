//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
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
	importScripts("constants.js", "zoom-match.js");
}

var allzoomvalue; var defaultallscreen; var defaultsinglescreen; var currentscreen; var screenzoom; var zoomsingleclick; var zoomnewsingleclick; var zoomdoubleclick; var zoomoutdoubleclick; var contexta; var contextb; var contextc; var websitepreset;
var badge; var steps; var lightcolor; var zoomchrome; var zoomweb; var zoomfont;

function parseWebsiteZoom(value){
	if(value == null)return{"https://www.example.com": ["90"], "https://www.nytimes.com": ["85"]};
	if(typeof value == "string"){
		try{
			return JSON.parse(value);
		}catch(e){
			return{};
		}
	}
	return value;
}

function readZoomSettings(callback){
	chrome.storage.sync.get(["allzoom", "allzoomoverrides", "allzoomvalue", "websitezoom", "badge", "steps", "lightcolor", "zoomchrome", "zoomweb", "zoombydomain", "zoombypage", "zoombyregex", "zoomfont", "ignoreset", "defaultsinglescreen", "screenzoom"], function(items){
		callback({
			allzoom: items.allzoom ?? false,
			allzoomoverrides: items.allzoomoverrides ?? false,
			allzoomvalue: items.allzoomvalue ?? 1,
			websitezoom: parseWebsiteZoom(items.websitezoom),
			badge: items.badge ?? false,
			steps: items.steps ?? 10,
			lightcolor: items.lightcolor ?? "#3cb4fe",
			zoomchrome: items.zoomchrome ?? false,
			zoomweb: items.zoomweb ?? true,
			zoomfont: items.zoomfont ?? false,
			zoombydomain: items.zoombydomain ?? true,
			zoombypage: items.zoombypage ?? false,
			zoombyregex: items.zoombyregex ?? false,
			ignoreset: items.ignoreset ?? false,
			defaultsinglescreen: items.defaultsinglescreen ?? false,
			screenzoom: items.screenzoom == null ? {} : parseWebsiteZoom(items.screenzoom)
		});
	});
}

function useSettings(items){
	allzoomvalue = items.allzoomvalue;
	badge = items.badge;
	steps = items.steps;
	lightcolor = items.lightcolor;
	zoomchrome = items.zoomchrome;
	zoomweb = items.zoomweb;
	zoomfont = items.zoomfont;
}

function getEffectiveZoom(url, items, screen){
	var override = null;
	if(!items.allzoom || items.allzoomoverrides){
		override = globalThis.ZoomMatch.findOverride(items.websitezoom, url, items.zoombydomain, items.zoombyregex);
	}
	var inheritedValue = items.allzoomvalue;
	if(items.defaultsinglescreen && screen && items.screenzoom[screen] != null)inheritedValue = Number(items.screenzoom[screen]) / 100;
	return{override: override, value: override ? override.value : inheritedValue};
}

function applyZoomToTab(tab, value, items){
	if(!tab || tab.id == null || !Number.isFinite(value))return;
	if(items.zoomchrome && chrome.tabs.setZoom){
		if((items.zoombypage || items.zoombyregex) && chrome.tabs.setZoomSettings){
			chrome.tabs.setZoomSettings(tab.id, {mode: "automatic", scope: "per-tab"}, function(){ void chrome.runtime.lastError; });
		}
		chrome.tabs.setZoom(tab.id, value, function(){ void chrome.runtime.lastError; });
	}else if(items.zoomweb){
		chrome.tabs.sendMessage(tab.id, {text: "setbodycsszoom", value: value}, function(){ void chrome.runtime.lastError; });
	}else if(items.zoomfont){
		chrome.tabs.sendMessage(tab.id, {text: "changefontsize", value: Math.round(value * 100)}, function(){ void chrome.runtime.lastError; });
	}
	badge = items.badge;
	lightcolor = items.lightcolor;
	setBadgeValue(value, tab.id);
}

function applyEffectiveZoomToAllTabs(items){
	chrome.tabs.query({}, function(tabs){
		tabs.forEach(function(tab){
			chrome.tabs.sendMessage(tab.id, {text: "refreshzoom"}, function(){
				if(chrome.runtime.lastError){
					var effective = getEffectiveZoom(tab.url, items);
					if(!(items.ignoreset && !items.allzoom && !effective.override))applyZoomToTab(tab, effective.value, items);
				}
			});
		});
	});
}

function changeEffectiveZoom(value, reset, screen, callback, tabId){
	readZoomSettings(function(items){
		useSettings(items);
		var changeTabZoom = function(tab){
			if(!tab || !tab.url)return;
			var update = function(currentScreen){
				var effective = getEffectiveZoom(tab.url, items, currentScreen);
				var changes = {};
				if(effective.override){
					if(reset)delete items.websitezoom[effective.override.key];
					else items.websitezoom[effective.override.key] = Math.round(value * 100);
					changes.websitezoom = JSON.stringify(items.websitezoom);
				}else if(items.allzoom){
					if(!reset){
						if(items.defaultsinglescreen && currentScreen && items.screenzoom[currentScreen] != null){
							items.screenzoom[currentScreen] = Math.round(value * 100);
							changes.screenzoom = JSON.stringify(items.screenzoom);
						}else{
							items.allzoomvalue = value;
							changes.allzoomvalue = value;
						}
					}
				}else if(!reset){
					var key = globalThis.ZoomMatch.createKey(tab.url, items.zoombydomain, items.zoombyregex);
					items.websitezoom[key] = Math.round(value * 100);
					changes.websitezoom = JSON.stringify(items.websitezoom);
				}

				var finish = function(){
					if(callback)callback(getEffectiveZoom(tab.url, items, currentScreen).value);
				};
				if(Object.keys(changes).length)chrome.storage.sync.set(changes, finish);
				else{
					applyEffectiveZoomToAllTabs(items);
					finish();
				}
			};
			if(screen)update(screen);
			else{
				chrome.tabs.sendMessage(tab.id, {text: "getscreen"}, function(currentScreen){
					if(chrome.runtime.lastError)currentScreen = null;
					update(currentScreen);
				});
			}
		};
		if(tabId != null)chrome.tabs.get(tabId, function(tab){ void chrome.runtime.lastError; changeTabZoom(tab); });
		else chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ changeTabZoom(tabs[0]); });
	});
}

var popupZoomTimer;
chrome.runtime.onMessage.addListener(function request(request, sender, sendResponse){
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
	case"getallRatio":
		readZoomSettings(function(items){
			useSettings(items);
			var effective = getEffectiveZoom(request.website, items, request.screen);
			if(!(items.ignoreset && !items.allzoom && !effective.override))applyZoomToTab(sender.tab, effective.value, items);
		});
		break;
	case"changezoom":
		clearTimeout(popupZoomTimer);
		popupZoomTimer = setTimeout(function(){ changeEffectiveZoom(Number(request.value), false, request.screen, null, request.tabId); }, 150);
		break;
	case"resetzoom":
		clearTimeout(popupZoomTimer);
		changeEffectiveZoom(1, true, request.screen, sendResponse, request.tabId);
		return true;
	case"contextmenuon":
		checkcontextmenus();
		break;
	case"contextmenuoff":
		removecontexmenus();
		break;
	case"contentzoomin":
		zoomview(+1);
		break;
	case"contentzoomout":
		zoomview(-1);
		break;
	case"getscreenshot":
		chrome.tabs.captureVisibleTab(null, {"format": "png"}, function(dataURI){
			if(typeof dataURI !== "undefined"){
				chrome.tabs.sendMessage(sender.tab.id, {text: "showmagnifyglass", value: dataURI});
			}
		});
		break;
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	}
});

function setBadgeValue(thatvalue, thattabid){
	if(badge == true){
		chrome.action.setBadgeBackgroundColor({color:lightcolor});
		chrome.action.setBadgeText({text:"" + Math.round(thatvalue * 100) + "", tabId: thattabid});
	}else{ chrome.action.setBadgeText({text:""}); }
}

// Not for Safari web browser, it use the content script way in the manifest.json file
// because Safari 15.4 and 16.0 do not support script "injectImmediately" and not stable "webNavigation.onCommitted" on iOS
// Inject before displaying the website
if(exbrowser != "safari"){
	chrome.webNavigation.onCommitted.addListener(({tabId, frameId, url}) => {
		// Filter out non main window events.
		if(frameId !== 0)return;
		setTabView(tabId, url);
	});
}else{
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting
	// https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility
	// Safari no support "executeScript.injectImmediately"
	// See manifest.json "content_scripts"
}

function setTabView(tabId, url){
	if(tabId >= 0){
		if(url.match(/^http/i) || url.match(/^file/i)){
			chrome.scripting.executeScript({
				target: {tabId: tabId},
				files: ["scripts/zoom.js"],
				injectImmediately: true
			}, function(){
				if(chrome.runtime.lastError){
					// if current tab do not have the content.js and can not send the message to local chrome:// page.
					// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
					// console.log("ERROR: ", chrome.runtime.lastError);
				}
				// viewController.setactionzoom(tabId, viewSettings)
			});
		}
	}
}

// Begin zoom engine ---
function zoom(ratio){
	changeEffectiveZoom(ratio / 100, false);
}
function zoomview(direction){ handleZoomCommand(direction); }

function nextratio(ratio, direction){
	ratio = Math.round(ratio);
	var prevratio = parseInt(ratio) - parseInt(steps);
	var nextratio = parseInt(ratio) + parseInt(steps);
	if(direction == -1){
		if(ratio == 10){ prevratio = 100; nextratio = 100; }
	}else{
		if(ratio == 400){ prevratio = 100; nextratio = 100; }
	}
	return(direction == -1) ? prevratio : nextratio;
}
// End zoom engine ---

// Set click to zero at beginning
let clickbutton = 0;
// Declare a timer variable
let timer;
var openactiondoubleclick = function(tab){
	chrome.storage.sync.get(["zoomdoubleclick", "zoomoutdoubleclick", "zoomnewsingleclick"], function(chromeset){
		zoomdoubleclick = chromeset.zoomdoubleclick; if(zoomdoubleclick == null)zoomdoubleclick = false; // default zoomdoubleclick false
		zoomoutdoubleclick = chromeset.zoomoutdoubleclick; if(zoomoutdoubleclick == null)zoomoutdoubleclick = false; // default zoomoutdoubleclick false
		zoomnewsingleclick = chromeset.zoomnewsingleclick; if(zoomnewsingleclick == null)zoomnewsingleclick = false; // default zoomnewsingleclick false
		zoomsingleclick = chromeset.zoomsingleclick; if(zoomsingleclick == null)zoomsingleclick = true; // default zoomsingleclick true

		// console.log("CLICK zoomdoubleclick= " + zoomdoubleclick + " zoomoutdoubleclick= " + zoomoutdoubleclick + " zoomnewsingleclick= " + zoomnewsingleclick + " zoomsingleclick=" + zoomsingleclick);
		if(zoomdoubleclick == true || zoomoutdoubleclick == true || zoomnewsingleclick == true){
			clickbutton += 1;
			if(clickbutton == 2){
				// console.log("Doubleclick");
				clearTimeout(timer);
				if(zoomdoubleclick == true){
					// zoom in
					zoomview(+1);
				}else if(zoomoutdoubleclick == true){
					// zoom out
					zoomview(-1);
				}else if(zoomnewsingleclick == true){
					setTimeout(function(){
						clickbutton = 0;
						chrome.action.setPopup({tabId: tab.id, popup:""});
					}, 250);
					chrome.action.setPopup({tabId: tab.id, popup:"popup.html"});
					chrome.action.openPopup();
				}
			}

			timer = setTimeout(function(){
				// console.log("Singelclick", clickbutton);
				if(clickbutton == 1){
					if(zoomdoubleclick == true){
						// zoom out
						zoomview(-1);
					}else if(zoomoutdoubleclick == true){
						// zoom out
						zoomview(+1);
					}else if(zoomnewsingleclick == true){
						chrome.tabs.sendMessage(tab.id, {text:"enablemagnifyingglass"});
					}
				}
				clickbutton = 0;
				// Clear all timers
				clearTimeout(timer);
				chrome.action.setPopup({tabId: tab.id, popup:""});
			}, 250);
		}else{
			// default use the zoomsingleclick
			chrome.action.setPopup({tabId: tab.id, popup:"popup.html"});
			chrome.action.openPopup();
		}
	});
};
chrome.action.onClicked.addListener(openactiondoubleclick);

function setactionpanel(){
	if(zoomsingleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: "popup.html"});
			});
		});
	}else if(zoomnewsingleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: ""});
			});
		});
	}else if(zoomdoubleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: ""});
			});
		});
	}else if(zoomoutdoubleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: ""});
			});
		});
	}
}

async function getCurrentTab(){
	let queryOptions = {active: true, currentWindow: true};
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

// Get current tab zoom value
function getZoomValue(thattab){
	return new Promise((resolve) => {
		if(chrome.tabs.getZoom){
			// only available for desktop web browsers
			// and not for Firefox Android mobile web browser
			chrome.tabs.getZoom(thattab, (zoomFactor) => {
				if(chrome.runtime.lastError){
					// console.error("ERROR: ", chrome.runtime.lastError);
				}

				const ratio = zoomFactor || 1;
				const currentRatio = ratio * 100;
				resolve(Math.round(currentRatio));
			});
		}
	});
}

function sendMessageToTab(thattab, message){
	return new Promise((resolve) => {
		chrome.tabs.sendMessage(thattab, message, (info) => {
			if(chrome.runtime.lastError){
				// console.error("ERROR: ", chrome.runtime.lastError);
			}

			const ratio = info || 1;
			const currentRatio = ratio * 100;
			resolve(Math.round(currentRatio));
		});
	});
}

async function getCurrentZoomValue(thattab){
	if(zoomchrome){
		return await getZoomValue(thattab);
	}else if(zoomweb){
		return await sendMessageToTab(thattab, {text: "getwebzoom"});
	}else if(zoomfont){
		return await sendMessageToTab(thattab, {text: "getfontsize"});
	}
}
//---

function backgroundrefreshzoom(){
	chrome.storage.sync.get(["badge", "lightcolor", "zoomchrome", "zoomweb", "zoomfont"], function(response){
		badge = response.badge; if(badge == null)badge = false;
		lightcolor = response.lightcolor; if(lightcolor == null)lightcolor = "#3cb4fe";
		zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false;
		zoomweb = response.zoomweb; if(zoomweb == null)zoomweb = true;
		zoomfont = response.zoomfont; if(zoomfont == null)zoomfont = false;

		getCurrentTab().then((thattab) => {
			if(thattab){
				if(zoomchrome == true){
					if(chrome.tabs.getZoom){
						// only available for desktop web browsers
						// and not for Firefox Android mobile web browser
						chrome.tabs.getZoom(thattab.id, function(zoomFactor){
							if(chrome.runtime.lastError){
								// if current tab do not have the content.js and can not send the message to local chrome:// page.
								// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
								// console.log("ERROR: ", chrome.runtime.lastError);
							}
							var currentZoom = zoomFactor;
							if(currentZoom == null){ currentZoom = 1; }
							setBadgeValue(currentZoom, thattab.id);
						});
					}
				}else if(zoomweb == true){
					chrome.tabs.sendMessage(thattab.id, {text: "getwebzoom"}, function(info){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log("ERROR: ", chrome.runtime.lastError);
						}
						if(info == null || info == ""){ info = 1; }
						setBadgeValue(info, thattab.id);
					});
				}else if(zoomfont == true){
					chrome.tabs.sendMessage(thattab.id, {text: "getfontsize"}, function(info){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log("ERROR: ", chrome.runtime.lastError);
						}
						if(info == null || info == ""){ info = 1; }
						setBadgeValue(info, thattab.id);
					});
				}
			}
		});
	});
}

chrome.storage.sync.get(["icon"], function(items){
	if(items["icon"] == undefined){
		if(exbrowser == "safari"){
			items["icon"] = "/images/iconstick38safari.png";
		}else{
			items["icon"] = "/images/iconstick38.png";
		}
	}
	chrome.action.setIcon({
		path : {
			"19": items["icon"],
			"38": items["icon"]
		}
	});
});

// update on refresh tab
chrome.tabs.onUpdated.addListener(function(){
	// backgroundrefreshzoom();// Chrome bug, because screen size do not show the correct badge label
	getCurrentTab().then((thattab) => {
		if(thattab){
			chrome.storage.sync.get(["icon"], function(items){
				if(items["icon"] == undefined){
					if(exbrowser == "safari"){
						items["icon"] = "/images/iconstick38safari.png";
					}else{
						items["icon"] = "/images/iconstick38.png";
					}
				}
				chrome.action.setIcon({tabId : thattab.id, path : {"19": items["icon"], "38": items["icon"]}});
			});
		}
	});
});

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(tab){
	backgroundrefreshzoom();
	refreshcontexmenus();
	checkaddpopup(tab);
});

// Also set popup for newly created tabs
chrome.tabs.onCreated.addListener(function(tab){
	checkaddpopup(tab);
});

var websitelevel;
// keyboard shortcuts only for desktop web browser
// and not for Firefox Android mobile web browser
if(chrome.commands && chrome.commands.onCommand){
	chrome.commands.onCommand.addListener(function(command){
		if(command == "toggle-feature-zoomin"){
			handleZoomCommand(+1);
		}else if(command == "toggle-feature-zoomout"){
			handleZoomCommand(-1);
		}else if(command == "toggle-feature-zoomreset"){
			changeEffectiveZoom(1, true);
		}else if(command == "toggle-feature-magnify"){
			chrome.tabs.query({active: true, currentWindow: true},
				function(tabs){
					if(tabs[0]){
						chrome.tabs.sendMessage(tabs[0].id, {text: "enablemagnifyingglass"});
					}
				});
		}else if(command == "toggle-feature-predefined1"){
			chrome.storage.sync.get(["websitelevel"], function(items){
				websitelevel = items["websitelevel"];
				if(typeof websitelevel == "undefined" || websitelevel == null){
					websitelevel = ["85", "115", "123"];
				}
				// Get the first item and pass it to zoom function
				var firstItem = websitelevel[0];
				zoom(firstItem);
			});
		}else if(command == "toggle-feature-predefined2"){
			chrome.storage.sync.get(["websitelevel"], function(items){
				websitelevel = items["websitelevel"];
				if(typeof websitelevel == "undefined" || websitelevel == null){
					websitelevel = ["85", "115", "123"];
				}
				// Get the second item and pass it to zoom function
				var secondItem = websitelevel[1];
				zoom(secondItem);
			});
		}else if(command == "toggle-feature-predefined3"){
			chrome.storage.sync.get(["websitelevel"], function(items){
				websitelevel = items["websitelevel"];
				if(typeof websitelevel == "undefined" || websitelevel == null){
					websitelevel = ["85", "115", "123"];
				}
				// Get the third item and pass it to zoom function
				var thirdItem = websitelevel[2];
				zoom(thirdItem);
			});
		}
	});
}

async function handleZoomCommand(direction){
	const items = await new Promise((resolve) => {
		readZoomSettings(resolve);
	});
	useSettings(items);

	const thattab = await getCurrentTab();
	if(thattab && thattab.url){
		// This check is important because content scripts can't run on all pages.
		try{
			const zoomValue = await getCurrentZoomValue(thattab.id);
			var nextZoom = nextratio(zoomValue, direction);
			changeEffectiveZoom(nextZoom / 100, false);
		}catch(e){
			// Silently fail if the content script is not available.
			// console.error(e);
		}
	}
}

// contextMenus
async function onClickHandler(info){
	var str = info.menuItemId; var respage = str.substring(0, 8); var czl = str.substring(8); var reszoomin = str.substring(0, 8); var reszoomout = str.substring(0, 9); var reszoomreset = str.substring(0, 11);
	if(respage == "zoompage"){
		changeEffectiveZoom(Number(czl) / 100, false);
		return;
	}else if(reszoomreset == "ctzoomreset"){
		changeEffectiveZoom(1, true);
		return;
	}
	if(reszoomin == "ctzoomin"){
		handleZoomCommand(+1);
	}else if(reszoomout == "ctzoomout"){
		handleZoomCommand(-1);
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
	}else if(info.menuItemId == "totlapplyresetzoom"){
		// Apply reset zoom to all tabs and in all window
		chrome.tabs.query({}, function(tabs){
			var i;
			var l = tabs.length;
			for(i = 0; i < l; i++){
				if(chrome.runtime.lastError){
					// if current tab do not have the content.js and can not send the message to local chrome:// page.
					// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
					// console.log("ERROR: ", chrome.runtime.lastError);
				}
				chrome.tabs.sendMessage(tabs[i].id, {text: "refreshscreen"});
			}
		});
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
var sharemenuapplyzoomresettitle = chrome.i18n.getMessage("desapplyzoomreset");
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
		browsercontext(sharemenuapplyzoomresettitle, "totlapplyresetzoom", "");

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
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconTwitter.png", "32": "images/IconTwitter@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconTwitter.png", "32": "images/IconTwitter@2x.png"}, parent);
		}

		// browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		if(exbrowser == "safari" || exbrowser == "firefox"){
			chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
			browsercontext(sharemenuoptions, "totloptions", {"16": "images/options.png", "32": "images/options@2x.png"});
		}

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

chrome.storage.sync.get(["contextmenus", "steps"], function(items){
	if(items["steps"]){ steps = items.steps; if(steps == null)steps = 10; }
	if(items["contextmenus"] == true){ checkcontextmenus(); }
});

// context menu for page and video
var menupage = null;
var contextmenuadded = false;
var contextarraypage = [];
var contextdefault = "100";
var book = [];

var contextzoomin = null;
var contextzoomout = null;
var contextzoomreset = null;

function getcurrentscreensize(){
	if(typeof browser !== "undefined"){
		// Firefox
		browser.windows.getCurrent({populate: true}, function(currentWindow){
			let activeTab = currentWindow.tabs.find((tab) => tab.active);
			let width = activeTab.width;
			let height = activeTab.height;
			return(`${width}x${height}`);
		});
	}else if(typeof chrome !== "undefined"){
		// Chrome
		chrome.system.display.getInfo(function(display_properties){
			return(display_properties[0].bounds.width + "x" + display_properties[0].bounds.height);
		});
	}
}

function checkcontextmenus(){
	// clear it
	removecontexmenus();
	//---
	chrome.storage.sync.get(["allzoomvalue", "screenzoom", "defaultallscreen", "defaultsinglescreen", "contexta", "contextb", "contextc", "websitepreset"], function(items){
		if(items["allzoomvalue"]){ allzoomvalue = items.allzoomvalue; if(allzoomvalue == null)allzoomvalue = 1; }
		if(items["screenzoom"]){ screenzoom = items.screenzoom; }
		if(items["defaultallscreen"]){ defaultallscreen = items.defaultallscreen; if(defaultallscreen == null)defaultallscreen = true; }
		if(items["defaultsinglescreen"]){ defaultsinglescreen = items.defaultsinglescreen; if(defaultsinglescreen == null)defaultsinglescreen = false; }
		if(items["contexta"]){ contexta = items.contexta; if(contexta == null)contexta = true; }
		if(items["contextb"]){ contextb = items.contextb; if(contextb == null)contextb = false; }
		if(items["contextc"]){ contextc = items.contextc; if(contextc == null)contextc = false; }
		websitepreset = items["websitepreset"];
		// if empty use this
		if(typeof websitepreset == "undefined" || websitepreset == null){
			websitepreset = JSON.stringify({"https://www.google.com": ["112", "100", "88"]});
		}

		contextdefault = allzoomvalue * 100;// get the default zoom value for that screen

		currentscreen = getcurrentscreensize();

		if(defaultsinglescreen == true){
			screenzoom = JSON.parse(screenzoom);
			var satbbuf = [];
			var domain;
			for(domain in screenzoom)
				satbbuf.push(domain);
			satbbuf.sort();
			var i;
			var l = satbbuf.length;
			for(i = 0; i < l; i++){
				if(satbbuf[i] == currentscreen){
					contextdefault = screenzoom[satbbuf[i]];
				}
			}
		}
		//---

		if(contextmenuadded == false){
			contextmenuadded = true;
			var contexts = ["page", "selection", "link", "editable", "image", "audio", "video"];
			if(contexta == true){
				book = Array();

				var k;
				for(k = 100; k <= 200; k = k + +steps){
					// skip the first value -> 100
					if(k != 100){
						book.push(k);
					}
				}

				var j;
				for(j = 100; j >= 10; j = j - steps){
					book.push(j);
				}

				// if the default zoom value is inside, then do nothing
				// else add this value in the context menu
				var mySet = new Set(book);
				var hascont = mySet.has(parseInt(contextdefault, 10)); // true
				if(!hascont){
					book.push(contextdefault);
				}

				book.sort(function(a, b){ return b - a; });

				var izoom;
				var lzoom = book.length;
				for(izoom = 0; izoom < lzoom; izoom++){
					if(contextdefault && contextdefault == book[izoom]){
						menupage = chrome.contextMenus.create({"type":"radio", "checked" : true, "id": "zoompage" + book[izoom] + "", "title": "Zoom: " + book[izoom] + "%", "contexts":contexts});
					}else{
						menupage = chrome.contextMenus.create({"type":"radio", "id": "zoompage" + book[izoom] + "", "title": "Zoom: " + book[izoom] + "%", "contexts":contexts});
					}
				}
				contextarraypage.push(menupage);
			}else if(contextb == true){
				var titlezoomin = chrome.i18n.getMessage("titlezoomin");
				var titlezoomout = chrome.i18n.getMessage("titlezoomout");
				var titlezoomreset = chrome.i18n.getMessage("titlezoomreset");
				contextzoomin = chrome.contextMenus.create({"title": titlezoomin, "type":"normal", "id": "ctzoomin", "contexts":contexts});
				contextzoomout = chrome.contextMenus.create({"title": titlezoomout, "type":"normal", "id": "ctzoomout", "contexts":contexts});
				contextzoomreset = chrome.contextMenus.create({"title": titlezoomreset, "type":"normal", "id": "ctzoomreset", "contexts":contexts});
			}else if(contextc == true){
				book = Array();

				getCurrentTab().then((thattab) => {
					if(thattab){
						var sendtab = thattab.id;
						getCurrentZoomValue(sendtab).then((thatzoomvalue) => {
							if(typeof websitepreset === "string"){
								websitepreset = JSON.parse(websitepreset);
								var sortedDomains = Object.keys(websitepreset).sort();

								for(var jsite = 0; jsite < sortedDomains.length; jsite++){
									var pdomain = sortedDomains[jsite];
									var values = websitepreset[pdomain];

									// Check if the array contains '100'
									if(!values.includes("100")){
										// If '100' is not present, add it to the array
										values.unshift("100");
									}

									// Append each option to the list box
									var p;
									var pl = values.length;
									for(p = 0; p < pl; p++){
										var job = thattab.url;

										// Check if job is a valid URL
										try{
											var parsedUrl = new URL(job);
											// Check if the protocol is either http or https
											if(parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:"){
												// console.error("Invalid URL protocol:", parsedUrl.protocol);
												continue; // Skip to the next iteration
											}
										}catch(error){
											// Handle the case where job is not a valid URL
											// console.error("Invalid URL:", job);
											continue; // Skip to the next iteration
										}

										var protocolAndDomain = parsedUrl.protocol + "//" + parsedUrl.hostname;
										if(protocolAndDomain.toLowerCase() === pdomain.toLowerCase()){
											book.push(values[p]);
											if(thatzoomvalue == parseInt(values[p])){
												menupage = chrome.contextMenus.create({"type":"radio", "id": "zoompage" + values[p] + "", "title": "Zoom: " + values[p] + "%", "contexts":contexts, "checked": true});
											}else{
												menupage = chrome.contextMenus.create({"type":"radio", "id": "zoompage" + values[p] + "", "title": "Zoom: " + values[p] + "%", "contexts":contexts, "checked": false});
											}
										}
									}
								}
							}
						});

					}
				});
				contextarraypage.push(menupage);
			}
		}

	});

}

function removecontexmenus(){
	// context style b
	if(contextzoomin != null){
		chrome.contextMenus.remove("ctzoomin");
	}
	if(contextzoomout != null){
		chrome.contextMenus.remove("ctzoomout");
	}
	if(contextzoomreset != null){
		chrome.contextMenus.remove("ctzoomreset");
	}
	contextzoomin = null;
	contextzoomout = null;
	contextzoomreset = null;
	// context style a
	var i;
	var l = book.length;
	for(i = 0; i < l; i++){
		menupage = chrome.contextMenus.remove("zoompage" + book[i] + "");
	}
	book = [];
	contextarraypage = [];
	contextmenuadded = false;
}

function refreshcontexmenus(){
	// context style b
	if(contextzoomin != null){
		chrome.contextMenus.remove("ctzoomin");
	}
	if(contextzoomout != null){
		chrome.contextMenus.remove("ctzoomout");
	}
	if(contextzoomreset != null){
		chrome.contextMenus.remove("ctzoomreset");
	}
	contextzoomin = null;
	contextzoomout = null;
	contextzoomreset = null;
	// context style a
	var i;
	var l = book.length;
	for(i = 0; i < l; i++){
		menupage = chrome.contextMenus.remove("zoompage" + book[i] + "");
	}
	book = [];
	contextarraypage = [];
	contextmenuadded = false;
	chrome.storage.sync.get(["contextmenus"], function(items){
		if(items["contextmenus"] == true){ checkcontextmenus(); }
	});
}

function handleZoomed(zoomChangeInfo){
	// console.log("Tab: " + zoomChangeInfo.tabId + " zoomed");
	// console.log("Old zoom: " + zoomChangeInfo.oldZoomFactor);
	// console.log("New zoom: " + zoomChangeInfo.newZoomFactor);
	chrome.storage.sync.get(["badge", "zoomchrome"], function(response){
		badge = response.badge; if(badge == null)badge = false; // default badge false
		zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false; // default zoomchrome false
		if(zoomchrome == true){
			// zoom changed
			// set the badge for the browser built-in zoom
			// console.log("ZOOM change= " + zoomChangeInfo.newZoomFactor * 100);
			setBadgeValue(zoomChangeInfo.newZoomFactor, zoomChangeInfo.tabId);
		}
	});
}

// Safari does not support this event
if(chrome.tabs.onZoomChange){
	chrome.tabs.onZoomChange.addListener(handleZoomed);
}

chrome.storage.sync.get(["zoomdoubleclick", "zoomoutdoubleclick", "zoomnewsingleclick", "zoomsingleclick"], function(response){
	zoomdoubleclick = response.zoomdoubleclick; if(zoomdoubleclick == null)zoomdoubleclick = false; // default zoomdoubleclick false
	zoomoutdoubleclick = response.zoomoutdoubleclick; if(zoomoutdoubleclick == null)zoomoutdoubleclick = false; // default zoomoutdoubleclick false
	zoomnewsingleclick = response.zoomnewsingleclick; if(zoomnewsingleclick == null)zoomnewsingleclick = false; // default zoomnewsingleclick false
	zoomsingleclick = response.zoomsingleclick; if(zoomsingleclick == null)zoomsingleclick = true; // default zoomsingleclick true

	setactionpanel();
});

function checkaddpopup(tab){
	if(zoomsingleclick == true){
		chrome.action.setPopup({tabId: tab.id, popup: "popup.html"});
	}
}

// Firefox Android
// helper to set global popup (no tabId) and per-tab popup (when possible)
function applyPopups(){
	try{
		chrome.action.setPopup({popup: "popup.html"});
	}catch(e){
		/* ignore */
	}

	try{
		chrome.tabs.query({}, function(tabs){
			if(!tabs || !tabs.length)return;
			tabs.forEach(function(tab){
				try{
					chrome.action.setPopup({tabId: tab.id, popup: "popup.html"});
				}catch(e){
					/* ignore per-tab failures */
				}
			});
		});
	}catch(e){
		/* ignore */
	}
}

// Set popup for all existing tabs on startup
async function initializePopupsForAllTabs(){
	chrome.storage.sync.get(["zoomsingleclick"], function(response){
		zoomsingleclick = response.zoomsingleclick; if(zoomsingleclick == null)zoomsingleclick = true;

		if(zoomsingleclick == true){
			// immediate attempt
			applyPopups();
		}
	});
}
// Call on runtime
initializePopupsForAllTabs();

chrome.storage.onChanged.addListener(function(changes){
	if(changes["allzoom"] || changes["allzoomoverrides"] || changes["allzoomvalue"] || changes["websitezoom"] || changes["screenzoom"] || changes["zoombydomain"] || changes["zoombypage"] || changes["zoombyregex"]){
		readZoomSettings(function(items){
			useSettings(items);
			applyEffectiveZoomToAllTabs(items);
		});
	}
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
	if(changes["steps"]){ if(changes["steps"].newValue){ steps = changes["steps"].newValue; refreshcontexmenus(); } }
	if(changes["allzoomvalue"]){ if(changes["allzoomvalue"].newValue){ allzoomvalue = changes["allzoomvalue"].newValue; refreshcontexmenus(); } }
	if(changes["contexta"]){ if(changes["contexta"].newValue == true){ contexta = true; contextb = false; refreshcontexmenus(); } }
	if(changes["contextb"]){ if(changes["contextb"].newValue == true){ contexta = false; contextb = true; refreshcontexmenus(); } }
	if(changes["contextmenus"]){ if(changes["contextmenus"].newValue == true){ checkcontextmenus(); }else{ removecontexmenus(); } }
	if(changes["defaultallscreen"]){
		if(changes["defaultallscreen"].newValue == true){
			defaultallscreen = changes["defaultallscreen"].newValue;
			defaultsinglescreen = false;
			refreshcontexmenus();
		}
	}
	if(changes["defaultsinglescreen"]){
		if(changes["defaultsinglescreen"].newValue == true){
			defaultsinglescreen = changes["defaultsinglescreen"].newValue;
			defaultallscreen = false;
			refreshcontexmenus();
		}
	}
	if(changes["badge"]){
		if(changes["badge"].newValue == true){ chrome.action.setBadgeText({text:"100"}); chrome.action.setBadgeBackgroundColor({color:lightcolor}); }else{ chrome.action.setBadgeText({text:""}); }
	}
	if(changes["lightcolor"]){
		if(changes["lightcolor"].newValue){ chrome.action.setBadgeBackgroundColor({color:changes["lightcolor"].newValue}); }
	}
	if(changes["zoomdoubleclick"]){
		if(changes["zoomdoubleclick"].newValue == true){
			zoomsingleclick = false; zoomnewsingleclick = false; zoomdoubleclick = true; zoomoutdoubleclick = false;
			setactionpanel();
		}
	}
	if(changes["zoomnewsingleclick"]){
		if(changes["zoomnewsingleclick"].newValue == true){
			zoomsingleclick = false; zoomnewsingleclick = true; zoomdoubleclick = false; zoomoutdoubleclick = false;
			setactionpanel();
		}
	}
	if(changes["zoomsingleclick"]){
		if(changes["zoomsingleclick"].newValue == true){
			zoomsingleclick = true; zoomnewsingleclick = false; zoomdoubleclick = false; zoomoutdoubleclick = false;
			setactionpanel();
		}
	}
	if(changes["zoomoutdoubleclick"]){
		if(changes["zoomoutdoubleclick"].newValue == true){
			zoomsingleclick = false; zoomnewsingleclick = false; zoomdoubleclick = false; zoomoutdoubleclick = true;
			setactionpanel();
		}
	}
});

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "2.1", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
	if(chrome.runtime.setUninstallURL){
		chrome.runtime.setUninstallURL(linkuninstall);
	}
});
