//================================================
/*

Font Size Decrease
Decrease font size on any web page with one click.
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
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	}
	return true;
});

// Function to reset the font size for all elements
function codereset(){
	// Traverse all elements on the page
	function resetFontSizeRecursively(element){
		// Check if the element has the original font size stored
		if(element.hasAttribute("data-default-fontsize")){
			// Restore the original font size
			element.style.setProperty("font-size", element.getAttribute("data-default-fontsize"), "important");
			element.removeAttribute("data-default-fontsize");
		}

		// Traverse child elements recursively
		Array.from(element.children).forEach((child) => {
			resetFontSizeRecursively(child);
		});
	}

	// Start resetting font sizes from the body
	resetFontSizeRecursively(document.body);
}

// Function to decrease the font size for all elements
function codesetsize(){
	chrome.storage.sync.get(["fontMin"], function(items){
		let minimumFontSize = items["fontMin"];
		if(minimumFontSize == null) minimumFontSize = 4; // Set a default minimum font size

		// Function to set the font size for an individual element
		function setFontSize(el){
			let computedStyleEl = window.getComputedStyle(el, null);
			let elementFontSize = computedStyleEl.getPropertyValue("font-size");

			// Store the original font size if not already stored
			if(!el.hasAttribute("data-default-fontsize")){
				el.setAttribute("data-default-fontsize", elementFontSize);
			}

			// Parse the current font size, decrease it, and ensure it's within the min limit
			let currentFontSizeEl = parseFloat(elementFontSize.replace("px", ""));
			let newFontSizeEl = Math.max(currentFontSizeEl - 1, minimumFontSize); // Ensure it's not less than the min size

			// Apply the new font size to the element using !important
			el.style.setProperty("font-size", newFontSizeEl + "px", "important");
		}

		// Recursively apply font size to all elements with text
		function applyFontSizeRecursively(element){
			// Check if element has text content or contains child elements with text
			if(element.childElementCount === 0 && element.textContent.trim() !== ""){
				setFontSize(element); // Only apply if the element contains text
			}else if(element.childElementCount > 0){
				// If the element has children, apply the size change to all children
				Array.from(element.children).forEach((child) => {
					applyFontSizeRecursively(child);
				});
			}
			// Always apply to the current element itself
			setFontSize(element);
		}

		// Start applying font size from the body
		applyFontSizeRecursively(document.body);
	});
}

// Set click to zero at the beginning
let clickbutton = 0;
// Declare a timer variable
let timer;

// Helper function to check if the URL starts with http or https
function isHttpOrHttpsUrl(url){
	return url.startsWith("http://") || url.startsWith("https://");
}

var doubleclick;
var openactionclick = function(tab){
	// Check if the tab's URL is either http or https
	if(isHttpOrHttpsUrl(tab.url)){
		clickbutton += 1;
		if(clickbutton === 2){
			// Double-click: reset the font size
			clearTimeout(timer);

			chrome.storage.sync.get(["doubleclick"], function(items){
				doubleclick = items["doubleclick"]; if(doubleclick == null)doubleclick = true;
				if(doubleclick == true){
					chrome.scripting.executeScript({
						target: {tabId: tab.id},
						func: codereset
					});
				}
			});
		}

		timer = setTimeout(function(){
			if(clickbutton === 1){
				// Single-click: decrease the font size
				chrome.scripting.executeScript({
					target: {tabId: tab.id},
					func: codesetsize
				});
			}
			clickbutton = 0;
			clearTimeout(timer); // Clear all timers
		}, 250);
	}else{
		// console.log("This action is only allowed on http and https URLs.");
	}
};

// Add listener to the action button click event
chrome.action.onClicked.addListener(openactionclick);

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
		var slinkproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextd") + " " + linkproduct); chrome.tabs.create({url: "https://x.com/intent/Post?text=" + slinkproductcodeurl, active:true});
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
		buttonaction();
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
var sharemenusendapost = chrome.i18n.getMessage("sharemenusendapost");
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
			browsercontext(sharemenusendapost, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenusendapost, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}

		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
		browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.commands.onCommand.addListener(function(command){
	if(command == "toggle-feature-fontreset"){
		codereset();
	}
});

function buttonaction(){
	getCurrentTab().then((thattab) => {
		chrome.scripting.executeScript({
			target: {tabId: thattab.id},
			func: codesetsize
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
});

chrome.runtime.setUninstallURL(linkuninstall);

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

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "1.0.0.9", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});