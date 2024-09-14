//================================================
/*

Snow
Experience a snowstorm effect with falling snow on your page. Transform it into a winter wonderland with snowflakes.
Copyright (C) 2024 Stefan vd
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

var addbar, snowAmount, snowColor, colorOption, snowShape, snowSize, snowSpeed, windDirectionControl, snowOnBottom;

// Importing the constants
// Execute if importScripts is support such as Google Chrome and not Firefox
if(typeof importScripts !== "undefined"){
	// eslint-disable-next-line no-undef
	importScripts("constants.js");
}

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
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	case"stefansnow":
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"}, function(){
					if(chrome.runtime.lastError){
						// console.log("Menu Error: " + chrome.runtime.lastError.message);
						// content script is not added here
						// need to refresh the web page
					}
				});
			}
			sendResponse(true);
		});
		break;
	case"stefanremovebar":
		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				// Send a request to the content script.
				chrome.storage.sync.set({"addbar": false});
				chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"}, function(){
					if(chrome.runtime.lastError){
						// console.log("Menu Error: " + chrome.runtime.lastError.message);
						// content script is not added here
						// need to refresh the web page
					}
				});
			}
			sendResponse(true);
		}
		);
		break;
	case"liveaddbar":
		addbar = request.value;
		refreshcontent();
		break;
	case"livesnowAmount":
		snowAmount = request.value;
		refreshcontent();
		break;
	case"livesnowColor":
		snowColor = request.value;
		refreshcontent();
		break;
	case"livecolorOption":
		colorOption = request.value;
		refreshcontent();
		break;
	case"livesnowShape":
		snowShape = request.value;
		refreshcontent();
		break;
	case"livesnowSize":
		snowSize = request.value;
		refreshcontent();
		break;
	case"livesnowSpeed":
		snowSpeed = request.value;
		refreshcontent();
		break;
	case"livewindDirectionControl":
		windDirectionControl = request.value;
		refreshcontent();
		break;
	case"livesnowOnBottom":
		snowOnBottom = request.value;
		refreshcontent();
		break;
	}
	return true;
});

function init(){
	chrome.storage.sync.get(["addbar", "snowAmount", "snowColor", "colorOption", "snowShape", "snowSize", "snowSpeed", "windDirectionControl", "snowOnBottom"], function(items){
		addbar = items["addbar"]; if(addbar == null)addbar = true;
		snowAmount = items["snowAmount"]; if(snowAmount == null)snowAmount = 500;
		snowColor = items["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
		colorOption = items["colorOption"]; if(colorOption == null)colorOption = "solid";
		snowShape = items["snowShape"]; if(snowShape == null)snowShape = "dot";
		snowSize = items["snowSize"]; if(snowSize == null)snowSize = 3;
		snowSpeed = items["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
		windDirectionControl = items["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = false;
		snowOnBottom = items["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;
	});
}

function refreshcontent(){
	const snowSettings = {
		addbar: addbar,
		snowAmount: snowAmount,
		snowColor: snowColor,
		colorOption: colorOption,
		snowShape: snowShape,
		snowSize: snowSize,
		snowSpeed: snowSpeed,
		windDirectionControl: windDirectionControl,
		snowOnBottom: snowOnBottom
	};
	// Send the snow settings directly to the content script
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, {action: "refreshcontent", snowSettings}, function(response){
			if(chrome.runtime.lastError){
				console.log("Error: " + chrome.runtime.lastError.message);
			}else{
				console.log(response.status); // Response from content script
			}
		});
	});
}

chrome.runtime.onConnect.addListener((port) => {
	if(port.name === "mySnow"){
		port.onDisconnect.addListener(() => {
			// console.log("Snow popup closed");
			chrome.storage.sync.set({"addbar": addbar, "snowAmount": snowAmount, "snowColor": snowColor, "colorOption": colorOption, "snowShape": snowShape, "snowSize": snowSize, "snowSpeed": snowSpeed, "windDirectionControl": windDirectionControl, "snowOnBottom": snowOnBottom});
		});
	}
});

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(tabs){
	var currentTabId = tabs.tabIds[0];
	chrome.tabs.get(currentTabId, function(tab){
		chrome.tabs.sendMessage(tab.id, {action: "addremove"}, function(){
			if(chrome.runtime.lastError){
				// console.log("Menu Error: " + chrome.runtime.lastError.message);
				// content script is not added here
				// need to refresh the web page
			}
		});
	});
});


chrome.storage.sync.get(["icon"], function(items){
	if(items["icon"] == undefined){ items["icon"] = "/images/icon38.png"; }
	chrome.action.setIcon({
		path : {
			"19": items["icon"],
			"38": items["icon"]
		}
	});
});

chrome.tabs.onUpdated.addListener(function(){
	getCurrentTab().then((thattab) => {
		chrome.storage.sync.get(["icon"], function(items){
			if(items["icon"] == undefined){
				items["icon"] = "/images/icon38.png";
			}
			chrome.action.setIcon({tabId : thattab.id, path : {"19": items["icon"], "38": items["icon"]}});
		});
	});
});

async function getCurrentTab(){
	let queryOptions = {active: true, currentWindow: true};
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

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
	}else if(info.menuItemId == "extpage"){
		togglebar();
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
// var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
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
			browsercontext(sharemenusendatweet, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenusendatweet, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}

		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
		browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.commands.onCommand.addListener(function(command){
	if(command == "toggle-feature-snow"){
		togglebar();
	}
});

function togglebar(){
	chrome.storage.sync.get(["addbar"], function(items){

		if(items["addbar"]){
			addbar = items["addbar"];
		}

		chrome.tabs.query({active: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				if(addbar == true){
					chrome.storage.sync.set({"addbar": false});
					chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"}, function(){
						if(chrome.runtime.lastError){
							// console.log("Menu Error: " + chrome.runtime.lastError.message);
							// content script is not added here
							// need to refresh the web page
						}
					});
				}else{
					chrome.storage.sync.set({"addbar": true});
					chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"}, function(){
						if(chrome.runtime.lastError){
							// console.log("Menu Error: " + chrome.runtime.lastError.message);
							// content script is not added here
							// need to refresh the web page
						}
					});
				}
			}
		});

	});
}

var contextmenus;
chrome.storage.sync.get(["contextmenus"], function(items){
	contextmenus = items.contextmenus; if(contextmenus == null)contextmenus = false;
	if(contextmenus){ checkcontextmenus(); }
});

// context menu for page
var menupage = null;
var contextmenuadded = false;
var contextarraypage = [];

var pagetitle = chrome.i18n.getMessage("pagetitle");
function checkcontextmenus(){
	if(chrome.contextMenus){
		if(contextmenuadded == false){
			contextmenuadded = true;

			// page
			var contextspage = ["page"];
			menupage = chrome.contextMenus.create({"title": pagetitle, "type":"normal", "id": "extpage", "contexts":contextspage});
			contextarraypage.push(menupage);
		}
	}
}

function cleanrightclickmenu(menu){
	if(menu.length > 0){
		menu.forEach(function(item){
			if(item != null){ chrome.contextMenus.remove(item); }
		});
	}
	menu.length = 0;
}

function removecontexmenus(){
	if(chrome.contextMenus){
		cleanrightclickmenu(contextarraypage);
		contextmenuadded = false;
	}
}

function onchangestorage(a, b, c, d){
	if(a[b]){
		if(a[b].newValue == true){ c(); }else{ d(); }
	}
}

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
	if(changes["snowAmount"]){ if(changes["snowAmount"].newValue){ refreshsnow(); } }
	if(changes["snowColor"]){ if(changes["snowColor"].newValue){ refreshsnow(); } }
	if(changes["colorOption"]){ if(changes["colorOption"].newValue){ refreshsnow(); } }
	if(changes["snowShape"]){ if(changes["snowShape"].newValue){ refreshsnow(); } }
	if(changes["snowSize"]){ if(changes["snowSize"].newValue){ refreshsnow(); } }
	if(changes["snowSpeed"]){ if(changes["snowSpeed"].newValue){ refreshsnow(); } }
	if(changes["windDirectionControl"]){ if(changes["windDirectionControl"].newValue){ refreshsnow(); } }
	if(changes["snowOnBottom"]){ if(changes["snowOnBottom"].newValue){ refreshsnow(); } }
});

function refreshsnow(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, {action: "refreshsnow"}, function(){
			if(chrome.runtime.lastError){
				// console.log("Menu Error: " + chrome.runtime.lastError.message);
				// content script is not added here
				// need to refresh the web page
			}
		});
	});
}

chrome.runtime.setUninstallURL(linkuninstall);

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "1.1", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
	init();
});