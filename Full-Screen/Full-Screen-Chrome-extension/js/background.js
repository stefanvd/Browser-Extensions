//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2012 Stefan vd
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

chrome.extension.onRequest.addListener(function request(request,sender,sendResponse){
if(request.comando == 'fullscreenrequest')sendResponse({contextmenus:localStorage['contextmenus'], pageaction:localStorage['pageaction'], autofullscreen:localStorage['autofullscreen']});
// contextmenu
else if (request.name == "contextmenuon") {checkcontextmenus();}
else if (request.name == "contextmenuoff") {chrome.contextMenus.removeAll();}
});

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.windows.getCurrent(null, function(window) {
    chrome.windows.update(window.id, {state: "fullscreen"});
  });
});

function init() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if ((tab.url.match(/^http/i)) && (localStorage["pageaction"] != "true") && (localStorage["pageaction"] != true)) {
			chrome.pageAction.show(tabId);
		}
	});
}

if ((localStorage["firstRun"]!="false") && (localStorage["firstRun"]!=false)){
  chrome.tabs.create({url: "http://www.stefanvd.net/project/fullscreenchrome.htm", selected:true})
  localStorage["firstRun"] = false;
  localStorage["version"]  = "0.1";
}

checkcontextmenus();

function checkcontextmenus() {
// Clean contextmenus
chrome.contextMenus.removeAll();

// contextMenus
function genericOnClick(info, tab) {chrome.tabs.sendRequest(tab.id, 'hide');}

// video
var contexts = ["video"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = chrome.i18n.getMessage("videotitle");
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],"onclick": genericOnClick});
}

// video
var contexts = ["image"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = chrome.i18n.getMessage("imagetitle");
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],"onclick": genericOnClick});
}
}

// Read current value settings
window.addEventListener('load', function() {
init();
});