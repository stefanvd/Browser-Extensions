//================================================
/*

Print
Print the current page you see.
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

async function getPopupOpenLength(){
	var total = (await chrome.runtime.getContexts({contextTypes: ["POPUP"]})).length;
	return total;
}

// Set click to zero at beginning
let clickbutton = 0;
// Declare a timer variable
let timer;

if(exbrowser != "safari"){
	chrome.action.onClicked.addListener(async(tab) => {
		if(tab.url.match(/^http/i) || tab.url.match(/^file/i)){
			if((new URL(tab.url)).origin == browserstore || tab.url == browsernewtab){
				chrome.action.setPopup({tabId: tab.id, popup:"error.html"});
			}else{
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
								chrome.scripting.executeScript({
									target: {tabId: tab.id},
									files: ["scripts/print.js"]
								});
							}
							clickbutton = 0;
							// Clear all timers
							clearTimeout(timer);
						}
					});
					chrome.action.setPopup({tabId: tab.id, popup:""});
				}, 250);
				chrome.action.setPopup({tabId: tab.id, popup:"popup.html"});
			}
		}else{
			chrome.action.setPopup({tabId: tab.id, popup:"error.html"});
		}
	});
}else{
	// safari does not support "chrome.runtime.getContexts"
	// count click actions
	chrome.action.onClicked.addListener(function(tab){
		clickbutton += 1;
		if(clickbutton == 2){
			// console.log("Doubleclick");
			clearTimeout(timer);
			chrome.action.setPopup({tabId: tab.id, popup:"popup.html"});
			chrome.action.openPopup();
			// reset flag shortly after popup opens or fails
			setTimeout(() => { chrome.action.setPopup({tabId: tab.id, popup:""}); }, 500);
		}

		timer = setTimeout(function(){
			// console.log("Singelclick");
			if(clickbutton == 1){
				chrome.scripting.executeScript({
					target: {tabId: tab.id},
					files: ["scripts/print.js"]
				});
			}
			clickbutton = 0;
			// Clear all timers
			clearTimeout(timer);
		}, 250);
	});
}

chrome.storage.sync.get(["icon"], function(items){
	if(items["icon"] == undefined){ items["icon"] = "/images/default@2x.png"; }
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
				items["icon"] = "/images/default@2x.png";
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
function onClickHandler(info, tab){
	var str = info.menuItemId;
	switch(true){
	case(str.includes("extpage")):
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			files: ["scripts/print.js"]
		});
		break;
	case(str.includes("extdevelopmenu")): chrome.tabs.create({url: linkdonate, active:true});
		break;
	case(str.includes("extratemen")): chrome.tabs.create({url: writereview, active:true});
		break;
	case(str.includes("extshareemail")): var sturnoffthelightemail = "mailto:your@email.com?subject=" + chrome.i18n.getMessage("sharetexta") + "&body=" + chrome.i18n.getMessage("sharetextb") + " " + linkproduct; chrome.tabs.create({url: sturnoffthelightemail, active:true});
		break;
	case(str.includes("extsharex")): var slinkproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextd") + " " + linkproduct); chrome.tabs.create({url: "https://x.com/intent/tweet?text=" + slinkproductcodeurl, active:true});
		break;
	case(str.includes("extsharefacebook")): chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u=" + linkproduct, active:true});
		break;
	case(str.includes("extsharewechat")): chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u=" + linkproduct, active:true});
		break;
	case(str.includes("extshareqq")): chrome.tabs.create({url: "https://connect.qq.com/widget/shareqq/index.html?url=" + encodeURIComponent(linkproduct) + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
		break;
	case(str.includes("extshareweibo")): chrome.tabs.create({url: "https://service.weibo.com/share/share.php?url=" + linkproduct + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
		break;
	case(str.includes("extsharevkontakte")): chrome.tabs.create({url: "https://vk.com/share.php?url=" + linkproduct, active:true});
		break;
	case(str.includes("extsharewhatsapp")): chrome.tabs.create({url: "https://api.whatsapp.com/send?text=" + chrome.i18n.getMessage("sharetextd") + "%0a" + linkproduct, active:true});
		break;
	case(str.includes("extsubscribe")): chrome.tabs.create({url: linkyoutube, active:true});
		break;
	case(str.includes("totloptions")): chrome.runtime.openOptionsPage();
		break;
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
		browsercontext(sharemenuwelcomeguidetitle, "extguideemenu", {"16": "images/IconGuide.png", "32": "images/IconGuide@2x.png"});
		browsercontext(sharemenudonatetitle, "extdevelopmenu", {"16": "images/IconDonate.png", "32": "images/IconDonate@2x.png"});
		// browsercontext(sharemenuratetitle, "extratemenu", {"16": "images/IconStar.png", "32": "images/IconStar@2x.png"});

		// Create a parent item and two children.
		var parent = null;
		parent = browsercontext(sharemenusharetitle, "extsharemenu", {"16": "images/IconShare.png", "32": "images/IconShare@2x.png"});
		browsercontext(sharemenutellafriend, "extshareemail", {"16": "images/IconEmail.png", "32": "images/IconEmail@2x.png"}, parent);
		chrome.contextMenus.create({"title": "", "type":"separator", "id": "extsepartorshare", "contexts": contexts, "parentId": parent});

		var uiLanguage = chrome.i18n.getUILanguage();
		if(uiLanguage.includes("zh")){
			// Chinese users
			browsercontext(sharemenupostonweibo, "extshareweibo", {"16": "images/IconWeibo.png", "32": "images/IconWeibo@2x.png"}, parent);
			browsercontext(sharemenupostonqq, "extshareqq", {"16": "images/IconQQ.png", "32": "images/IconQQ@2x.png"}, parent);
		}else if(uiLanguage.includes("ru")){
			// Russian users
			browsercontext(sharemenupostonvkontakte, "extsharevkontakte", {"16": "images/IconVkontakte.png", "32": "images/IconVkontakte@2x.png"}, parent);
			browsercontext(sharemenupostonfacebook, "extsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "extsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenusendatweet, "extsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "extsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "extsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenusendatweet, "extsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
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
	contextmenus = items.contextmenus; if(contextmenus == null)contextmenus = false;
	if(contextmenus){ checkcontextmenus(); }
});

// context menu for page
var menuitems = null;
var contextmenuadded = false;
var contextarraypage = [];

function addwebpagecontext(a, b, c, d){
	var k;
	var addvideolength = b.length;
	for(k = 0; k < addvideolength; k++){
		var contextpage = b[k];
		menuitems = chrome.contextMenus.create({"title": a, "type":"normal", "id": d + k, "contexts":[contextpage]});
		c.push(menuitems);
	}
}

function checkcontextmenus(){
	if(chrome.contextMenus){
		if(contextmenuadded == false){
			contextmenuadded = true;
			// page
			var pagetitle = chrome.i18n.getMessage("printpagetitle");
			var contexts = ["page"];
			addwebpagecontext(pagetitle, contexts, contextarraypage, "extpage");
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