//================================================
/*

Page Sidebar
Effortlessly open any website in your web browser's sidebar – streamline your workflow instantly!
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

// Function to check if the current browser is Firefox
function isFirefox(){
	return typeof browser !== "undefined" && typeof browser.sidebarAction !== "undefined";
}

// Function to check if the current browser is support chrome.sidePanel
function isChromePanel(){
	return typeof chrome !== "undefined" && typeof chrome.sidePanel !== "undefined";
}

if(isChromePanel()){
	chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error) => console.error(error));
}

// Execute Firefox-specific code
if(isFirefox()){
	browser.action.onClicked.addListener(function(){
		browser.sidebarAction.toggle();
	});
}

// --- General code
chrome.runtime.onMessage.addListener(function request(request, sender, response){
	// eye protection & autodim & shortcut
	switch(request.name){
	case"bckreload":
		installation();
		break;
	case"sidepanelopen":
		response(!sender.documentId);
		break;
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	case"stefanbookmarkadd":
		// Permissions must be requested from inside a user gesture
		chrome.permissions.request({
			permissions: ["bookmarks"]
		}, function(granted){
			// The callback argument will be true if the user granted the permissions.
			if(granted){
				// todo send message back
			}
		});
		break;
	case"getallhost":
		// --- Begin Firefox
		chrome.permissions.contains({
			origins: ["*://*/*"]
		}, (result) => {
			if(result){
				// The extension has the permissions
				chrome.runtime.sendMessage({text: "receiveallhost", value: result});
			}else{
				// The extension doesn't have the permissions
				chrome.runtime.sendMessage({text: "receiveallhost", value: result});
			}
		});
		break;
		// --- End Firefox
	}
});

chrome.commands.onCommand.addListener(function(command){
	if(command == "toggle-feature-openweb"){
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true
		}, function(tabs){
			var tab = tabs[0];
			if(tab){
				var currentpage = tab.url;
				// console.log("currentpage= " + currentpage);
				chrome.sidePanel.open({windowId: tab.windowId}, function(){
					// wait when panel is open, then send the message
					setTimeout(function(){
						chrome.runtime.sendMessage({msg: "setpage", value: currentpage});
					}, 500);
				});
			}
		});
	}
});

// contextMenus
function onClickHandler(info, tab){
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
	}else if(info.menuItemId == "sppage"){
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true
		}, function(tabs){
			var tab = tabs[0];
			if(tab){
				var currentpage = tab.url;
				// console.log("currentpage= " + currentpage);
				chrome.sidePanel.open({windowId: tab.windowId}, function(){
					// wait when panel is open, then send the message
					setTimeout(function(){
						chrome.runtime.sendMessage({msg: "setpage", value: currentpage});
					}, 500);
				});
			}
		});
	}else if(info.menuItemId == "snpage"){
		var selectedlink = info.linkUrl;
		// console.log("selectedlink= " + selectedlink);
		chrome.sidePanel.open({windowId: tab.windowId}, function(){
			// wait when panel is open, then send the message
			setTimeout(function(){
				chrome.runtime.sendMessage({msg: "setpage", value: selectedlink});
			}, 500);
		});
	}else if(info.menuItemId == "slpage"){
		var searchquery = info.selectionText;
		// console.log("searchquery= " + searchquery);
		chrome.sidePanel.open({windowId: tab.windowId}, function(){
			// wait when panel is open, then send the message
			setTimeout(function(){
				chrome.runtime.sendMessage({msg: "setsearch", value: searchquery});
			}, 500);
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
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}

		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
		browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

var contextmenus;
chrome.storage.sync.get(["contextmenus"], function(items){
	contextmenus = items.contextmenus; if(contextmenus == null)contextmenus = true;
	if(contextmenus){ checkcontextmenus(); }
});

// context menu for page and link and selection
var menuitems = null;
var contextmenuadded = false;
var contextarraypage = [];
var contextarraylink = [];
var contextarrayselection = [];

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
			// page
			var pagetitle = chrome.i18n.getMessage("pagetitle");
			var contextspage = ["page"];
			addwebpagecontext(pagetitle, contextspage, contextarraypage, "sppage");
			// link
			var linktitle = chrome.i18n.getMessage("linktitle");
			var contextslink = ["link"];
			addwebpagecontext(linktitle, contextslink, contextarraylink, "snpage");
			// selection
			var pagesearchtitle = chrome.i18n.getMessage("pagesearchtitle");
			var contextsselection = ["selection"];
			addwebpagecontext(pagesearchtitle, contextsselection, contextarrayselection, "slpage");
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
		cleanrightclickmenu(contextarraylink);
		cleanrightclickmenu(contextarrayselection);
		contextmenuadded = false;
	}
}

function onchangestorage(a, b, c, d){
	if(a[b]){
		if(a[b].newValue == true){ c(); }else{ d(); }
	}
}

async function getCurrentTab(){
	let queryOptions = {active: true, currentWindow: true};
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

chrome.storage.sync.get(["icon"], function(items){
	if(items["icon"] == undefined){
		if(exbrowser == "safari"){
			items["icon"] = "/images/icon38.png";
		}else{
			items["icon"] = "/images/icon38.png";
		}
	}
	if(chrome.action && typeof chrome.action.setIcon === "function"){
		chrome.action.setIcon({
			path : {
				"19": items["icon"],
				"38": items["icon"]
			}
		});
	}
});

// update on refresh tab
chrome.tabs.onUpdated.addListener(function(){
	getCurrentTab().then((thattab) => {
		chrome.storage.sync.get(["icon"], function(items){
			if(items["icon"] == undefined){
				if(exbrowser == "safari"){
					items["icon"] = "/images/icon38.png";
				}else{
					items["icon"] = "/images/icon38.png";
				}
			}
			if(chrome.action && typeof chrome.action.setIcon === "function"){
				chrome.action.setIcon({tabId : thattab.id, path : {"19": items["icon"], "38": items["icon"]}});
			}
		});
	});
});

chrome.storage.onChanged.addListener(function(changes){
	onchangestorage(changes, "contextmenus", checkcontextmenus, removecontexmenus);
	if(changes["icon"]){
		if(changes["icon"].newValue){
			chrome.tabs.query({}, function(tabs){
				var i, l = tabs.length;
				for(i = 0; i < l; i++){
					if(chrome.action && typeof chrome.action.setIcon === "function"){
						chrome.action.setIcon({tabId : tabs[i].id,
							path : {
								"19": changes["icon"].newValue,
								"38": changes["icon"].newValue
							}
						});
					}
				}
			}
			);
		}
	}
	if(changes["navtop"]){
		if(changes["navtop"].newValue == true){
			chrome.runtime.sendMessage({msg: "setnavtop"});
		}
	}
	if(changes["navbuttons"]){
		if(changes["navbuttons"].newValue == true || changes["navbuttons"].newValue == false){
			chrome.runtime.sendMessage({msg: "setnavbuttons"});
		}
	}
	if(changes["navbottom"]){
		if(changes["navbottom"].newValue == true){
			chrome.runtime.sendMessage({msg: "setnavbottom"});
		}
	}
	if(changes["navhidden"]){
		if(changes["navhidden"].newValue == true){
			chrome.runtime.sendMessage({msg: "setnavhidden"});
		}
	}
	if(changes["searchgoogle"]){
		if(changes["searchgoogle"].newValue == true){
			chrome.runtime.sendMessage({msg: "setrefreshsearch"});
		}
	}
	if(changes["searchbing"]){
		if(changes["searchbing"].newValue == true){
			chrome.runtime.sendMessage({msg: "setrefreshsearch"});
		}
	}
	if(changes["searchduckduckgo"]){
		if(changes["searchduckduckgo"].newValue == true){
			chrome.runtime.sendMessage({msg: "setrefreshsearch"});
		}
	}
	if(changes["searchbaidu"]){
		if(changes["searchbaidu"].newValue == true){
			chrome.runtime.sendMessage({msg: "setrefreshsearch"});
		}
	}
	if(changes["searchyandex"]){
		if(changes["searchyandex"].newValue == true){
			chrome.runtime.sendMessage({msg: "setrefreshsearch"});
		}
	}
	if(changes["opentab"]){
		if(changes["opentab"].newValue == true || changes["opentab"].newValue == false){
			chrome.runtime.sendMessage({msg: "setopentab"});
		}
	}
	if(changes["opencopy"]){
		if(changes["opencopy"].newValue == true || changes["opencopy"].newValue == false){
			chrome.runtime.sendMessage({msg: "setopencopy"});
		}
	}
	if(changes["gobutton"]){
		if(changes["gobutton"].newValue == true || changes["gobutton"].newValue == false){
			chrome.runtime.sendMessage({msg: "setgobutton"});
		}
	}
	if(changes["opennonebookmarks"]){
		if(changes["opennonebookmarks"].newValue == true){
			chrome.runtime.sendMessage({msg: "setopennonebookmarks"});
		}
	}
	if(changes["openbrowserbookmarks"]){
		if(changes["openbrowserbookmarks"].newValue == true){
			chrome.runtime.sendMessage({msg: "setopenbrowserbookmarks"});
		}
	}
	if(changes["openquickbookmarks"]){
		if(changes["openquickbookmarks"].newValue == true){
			chrome.runtime.sendMessage({msg: "setopenquickbookmarks"});
		}
	}
	if(changes["websitename1"] || changes["websiteurl1"] || changes["websitename2"] || changes["websiteurl2"] || changes["websitename3"] || changes["websiteurl3"] || changes["websitename4"] || changes["websiteurl4"] || changes["websitename5"] || changes["websiteurl5"] || changes["websitename6"] || changes["websiteurl6"] || changes["websitename7"] || changes["websiteurl7"] || changes["websitename8"] || changes["websiteurl8"] || changes["websitename9"] || changes["websiteurl9"] || changes["websitename10"] || changes["websiteurl10"]){
		chrome.runtime.sendMessage({msg: "setbookmarkswebsites"});
	}
	if(changes["googlesidepanel"]){
		if(changes["googlesidepanel"].newValue == true || changes["googlesidepanel"].newValue == false){
			chrome.runtime.sendMessage({msg: "setgooglesidepanel"});
		}
	}
	if(changes["zoom"]){
		if(changes["zoom"].newValue == true || changes["zoom"].newValue == false){
			chrome.runtime.sendMessage({msg: "setzoom"});
		}
	}
	if(changes["step"]){
		chrome.runtime.sendMessage({msg: "setstep"});
	}
	if(changes["defaultzoom"]){
		chrome.runtime.sendMessage({msg: "setdefaultzoom"});
	}
	if(changes["typepanelzone"]){
		if(changes["typepanelzone"].newValue == true){
			chrome.runtime.sendMessage({msg: "settypepanelzone"});
		}
	}
	if(changes["typepanelcustom"]){
		if(changes["typepanelcustom"].newValue == true){
			chrome.runtime.sendMessage({msg: "settypepanelcustom"});
		}
	}
	if(changes["websitezoomname"]){
		chrome.runtime.sendMessage({msg: "setwebsitezoomname"});
	}
	if(changes["typepanellasttime"]){
		if(changes["typepanellasttime"].newValue == true){
			chrome.runtime.sendMessage({msg: "settypepanellasttime"});
		}
	}
	if(changes["multipletabs"]){
		chrome.runtime.sendMessage({msg: "setmultipletabs"});
	}
	if(changes["typehomezone"]){
		if(changes["typehomezone"].newValue == true){
			chrome.runtime.sendMessage({msg: "settypehomezone"});
		}
	}
	if(changes["typehomecustom"]){
		if(changes["typehomecustom"].newValue == true){
			chrome.runtime.sendMessage({msg: "settypehomecustom"});
		}
	}
	if(changes["websitehomepagename"]){
		chrome.runtime.sendMessage({msg: "setwebsitehomepagename"});
	}
});

chrome.runtime.setUninstallURL(linkuninstall);

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "1.0", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});