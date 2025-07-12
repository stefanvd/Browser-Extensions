//================================================
/*

Note Sidebar
Simple note sidebar which can be used to write a note, record thoughts, to-do list, meeting notes, etc.
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

// Function to check if the current browser is Firefox
function isFirefox(){
	return typeof browser !== "undefined" && typeof browser.sidebarAction !== "undefined";
}

// Function to check if the current browser is support chrome.sidePanel
function isChromePanel(){
	return typeof chrome !== "undefined" && typeof chrome.sidePanel !== "undefined";
}

// Execute Firefox-specific code
if(isFirefox()){
	browser.action.onClicked.addListener(function(){
		browser.sidebarAction.toggle();
	});
}

// Execute Chrome-specific code
const firefoxextension = navigator.userAgent.toLowerCase().includes("firefox");
if(!firefoxextension){
	// Importing the constants
	// eslint-disable-next-line no-undef
	importScripts("constants.js");
}
if(isChromePanel()){
	chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error) => console.error(error));
}

// --- General code

chrome.runtime.onMessage.addListener(function request(request, sender){
	// eye protection & autodim & shortcut
	switch(request.name){
	case"bckreload":
		currentnotetext = chrome.i18n.getMessage("firsttext");
		currentmultinotetext = [{"note":i18nfirsttext}];
		installation();
		break;
	case"newnotetext":
		currentnotetext = request.value;
		// console.log("currentnotetext=", currentnotetext);
		break;
	case"newmultinotetext":
		currentmultinotetext = request.value;
		// console.log("currentmultinotetext=", currentmultinotetext);
		break;
	case"hardsave":
		getNotesStorageArea(function(storage){
			storage.set({"txtvalue": currentnotetext, "multivalue": currentmultinotetext});
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

var i18nfirsttext = chrome.i18n.getMessage("firsttext");
var currentnotetext;
var currentmultinotetext;

function init(){
	getNotesStorageArea(function(storage){
		storage.get(["txtvalue", "multivalue"], function(items){
			var txtvalue = items["txtvalue"]; if(txtvalue == null){ txtvalue = i18nfirsttext; }
			var multivalue = items["multivalue"]; if(multivalue == null){ multivalue = [{"note":i18nfirsttext}]; }
			currentnotetext = txtvalue;
			currentmultinotetext = multivalue;
		});
	});
}

chrome.runtime.onConnect.addListener((port) => {
	if(port.name === "myNoteSidebar"){
		port.onDisconnect.addListener(() => {
			// console.log("Notesidebar Sidepanel closed");
			getNotesStorageArea(function(storage){
				storage.set({"txtvalue": currentnotetext, "multivalue": currentmultinotetext});
			});
		});
	}
});

chrome.commands.onCommand.addListener((command) => {
	if(command === "copytext_action"){
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			if(tabs.length === 0)return;
			chrome.scripting.executeScript({target: {tabId: tabs[0].id},
				function: () => window.getSelection().toString()
			}, (injectionResults) => {
				if(chrome.runtime.lastError){
					console.error(chrome.runtime.lastError.message);
					return;
				}
				const selectedtext = injectionResults[0].result;
				// console.log("hello copy= " + selectedtext);
				addTextToLastContentNote(selectedtext);
			});
		});
	}
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
	}else if(info.menuItemId == "snpage"){
		var selectedtext = info.selectionText;
		addTextToLastContentNote(selectedtext);
	}
}

function addTextToLastContentNote(thatselectedtext){
	getNotesStorageArea(function(storage){
		storage.get(["txtvalue", "richtext", "plaintext", "multiple", "multivalue"], function(items){
			var txtvalue = items["txtvalue"]; if(txtvalue == null){ txtvalue = i18nfirsttext; }
			var richtext = items["richtext"]; if(richtext == null){ richtext = false; }
			var plaintext = items["plaintext"]; if(plaintext == null){ plaintext = true; }
			var multiple = items["multiple"]; if(multiple == null){ multiple = false; }
			var multivalue = items["multivalue"]; if(multivalue == null){ multivalue = [{"note":i18nfirsttext}]; }

			// add text on next line
			if(multiple == true){
				// multiple note
				var noteValue = multivalue[0].note;
				if(richtext == true){
					noteValue = noteValue + "<br>" + thatselectedtext;
				}else{
					noteValue = noteValue + "\n" + thatselectedtext;
				}
				multivalue[0].note = noteValue;
				currentmultinotetext = multivalue;
				storage.set({"multivalue": currentmultinotetext});

				chrome.runtime.sendMessage({msg: "setnotemulti", value: currentmultinotetext}, function(){
					var lastError = chrome.runtime.lastError;
					if(lastError){
						// error panel not open
						// console.log(lastError.message);
						// 'Could not establish connection. Receiving end does not exist.'
						return;
					}
				});
			}else{
				// single note
				if(richtext == true){
					currentnotetext = txtvalue + "<br>" + thatselectedtext;
				}else{
					currentnotetext = txtvalue + "\n" + thatselectedtext;
				}
				storage.set({"txtvalue": currentnotetext});

				chrome.runtime.sendMessage({msg: "setnotetext", value: currentnotetext}, function(){
					var lastError = chrome.runtime.lastError;
					if(lastError){
						// error panel not open
						// console.log(lastError.message);
						// 'Could not establish connection. Receiving end does not exist.'
						return;
					}
				});
			}
		});
	});
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
			contextspage = ["selection"];
			menupage = chrome.contextMenus.create({"title": pagetitle, "type": "normal", "id": "snpage", "contexts": contextspage});
			contextarraypage.push(menupage);
		}
	}
}

function removecontexmenus(){
	if(contextspage != null){
		chrome.contextMenus.remove("snpage");
	}
	contextspage = null;
	contextmenuadded = false;
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
	// Migrate notes when notesStorageType changes
	if(changes["notesStorageType"]){
		var newType = changes["notesStorageType"].newValue;
		var oldType = changes["notesStorageType"].oldValue;
		if(newType && oldType && newType !== oldType){
			var oldStorage = oldType === "local" ? chrome.storage.local : chrome.storage.sync;
			var newStorage = newType === "local" ? chrome.storage.local : chrome.storage.sync;
			oldStorage.get(["txtvalue", "multivalue"], function(items){
				// Write to new storage
				newStorage.set({
					"txtvalue": items["txtvalue"] ?? "",
					"multivalue": items["multivalue"] ?? [{"note":i18nfirsttext}]
				}, function(){
					// Remove from old storage
					oldStorage.remove(["txtvalue", "multivalue"]);
				});
			});
		}
	}
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
	if(changes["counter"]){
		chrome.runtime.sendMessage({msg: "setcounter", value: changes["counter"].newValue});
	}
	if(changes["copy"]){
		chrome.runtime.sendMessage({msg: "setcopy", value: changes["copy"].newValue});
	}
	if(changes["speech"]){
		chrome.runtime.sendMessage({msg: "setspeech", value: changes["speech"].newValue});
	}
	if(changes["voices"]){
		chrome.runtime.sendMessage({msg: "setvoices", value: changes["voices"].newValue});
	}
	if(changes["fontsize"]){
		chrome.runtime.sendMessage({msg: "setfontsize", value: changes["fontsize"].newValue});
	}
	if(changes["lineheight"]){
		chrome.runtime.sendMessage({msg: "setlineheight", value: changes["lineheight"].newValue});
	}
	if(changes["colorlight"]){
		chrome.runtime.sendMessage({msg: "setcolorlight", value: changes["colorlight"].newValue});
	}
	if(changes["colordark"]){
		chrome.runtime.sendMessage({msg: "setcolordark", value: changes["colordark"].newValue});
	}
	if(changes["backgroundlight"]){
		chrome.runtime.sendMessage({msg: "setbackgroundlight", value: changes["backgroundlight"].newValue});
	}
	if(changes["backgrounddark"]){
		chrome.runtime.sendMessage({msg: "setbackgrounddark", value: changes["backgrounddark"].newValue});
	}
	if(changes["backgroundcolor"]){
		chrome.runtime.sendMessage({msg: "setbackgroundcolor", value: changes["backgroundcolor"].newValue});
	}
	if(changes["backgroundimage"]){
		chrome.runtime.sendMessage({msg: "setbackgroundimage", value: changes["backgroundimage"].newValue});
	}
	if(changes["backgroundsource"]){
		chrome.runtime.sendMessage({msg: "setbackgroundsource", value: changes["backgroundsource"].newValue});
	}
	if(changes["backgroundsize"]){
		chrome.runtime.sendMessage({msg: "setbackgroundsize", value: changes["backgroundsize"].newValue});
	}
	if(changes["print"]){
		chrome.runtime.sendMessage({msg: "setprint", value: changes["print"].newValue});
	}
	if(changes["plaintext"]){
		chrome.runtime.sendMessage({msg: "settype", value: changes["plaintext"].newValue});
	}
	if(changes["multiple"]){
		// convert to single text or multiple text
		const multiple = changes["multiple"].newValue;
		getNotesStorageArea(function(storage){
			storage.get(["txtvalue", "multivalue"], function(items){
				var txtvalue = items["txtvalue"]; if(txtvalue == null){ txtvalue = i18nfirsttext; }
				var multivalue = items["multivalue"]; if(multivalue == null){ multivalue = [{"note":i18nfirsttext}]; }

				// Only convert if there was a previous setting value
				if(changes["multiple"].oldValue !== undefined){
					if(multiple){
						// Reset and convert txtvalue to multivalue
						multivalue = txtvalue ? [{"note": txtvalue}] : [];
						txtvalue = ""; // Reset txtvalue
					}else{
						// Reset and convert multivalue to txtvalue
						txtvalue = multivalue.map((item) => item.note).join("\n");
						multivalue = []; // Reset multivalue
					}
				}

				// Save the updated values back to storage
				storage.set({"txtvalue": txtvalue, "multivalue": multivalue}, function(){
					// update background
					currentnotetext = txtvalue;
					currentmultinotetext = multivalue;

					chrome.runtime.sendMessage({msg: "setmultiple", value: changes["multiple"].newValue, singletext: txtvalue, tabtext: multivalue});
				});
			});
		});
	}
	if(changes["preventclose"]){
		chrome.runtime.sendMessage({msg: "setpreventclose", value: changes["preventclose"].newValue});
	}
	if(changes["texttabname"]){
		chrome.runtime.sendMessage({msg: "settexttabname", value: changes["texttabname"].newValue});
	}
	if(changes["save"]){
		chrome.runtime.sendMessage({msg: "setsave", value: changes["save"].newValue});
	}
	if(changes["download"]){
		chrome.runtime.sendMessage({msg: "setdownload", value: changes["download"].newValue});
	}
	if(changes["bartabdesign"]){
		if(changes["bartabdesign"].newValue == true){
			chrome.runtime.sendMessage({msg: "setbartabdesign"});
		}
	}
	if(changes["barselectdesign"]){
		if(changes["barselectdesign"].newValue == true){
			chrome.runtime.sendMessage({msg: "setbarselectdesign"});
		}
	}
	if(changes["find"]){
		chrome.runtime.sendMessage({msg: "setfind", value: changes["find"].newValue});
	}
	if(changes["richtexttoolbar"]){
		chrome.runtime.sendMessage({msg: "setrichtexttoolbar", value: changes["richtexttoolbar"].newValue});
	}
	if(changes["richtextshortcut"]){
		chrome.runtime.sendMessage({msg: "setrichtextshortcut", value: changes["richtextshortcut"].newValue});
	}
});

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
	init();
	if(chrome.runtime.setUninstallURL){
		chrome.runtime.setUninstallURL(linkuninstall);
	}
});

chrome.runtime.onUpdateAvailable.addListener(function(){
	// save the current note before update
	getNotesStorageArea(function(storage){
		storage.set({"txtvalue": currentnotetext, "multivalue": currentmultinotetext});
	});
});

// Helper to get the correct storage area for notes
function getNotesStorageArea(callback){
	chrome.storage.sync.get(["notesStorageType"], function(items){
		if(items.notesStorageType === "local"){
			callback(chrome.storage.local);
		}else{
			callback(chrome.storage.sync);
		}
	});
}