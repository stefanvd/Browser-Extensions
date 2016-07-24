//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
Copyright (C) 2015 Stefan vd
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

// show welcome page
if ((safari.extension.settings["firstRun"]!="false") && (safari.extension.settings["firstRun"]!=false)) {
  safari.application.activeBrowserWindow.openTab().url = linkwelcomepage;
  safari.extension.settings["firstRun"] = false;
  safari.extension.settings["version"]  = "2.1";
}

function calcThis(){
    var sgetallzoom = localStorage.getItem("allzoom");
    if(!sgetallzoom)sgetallzoom = 'false';
    var sgetallzoomvalue = localStorage.getItem("allzoomvalue");
    if(!sgetallzoomvalue)sgetallzoomvalue = '1';
}

function votezoom(abc){
    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("todo", abc);
}

function saveallZoom(ratio) {
        localStorage.setItem("allzoomvalue", ratio);
}

function setZoom(urlwebsite,value) {
    localStorage.setItem(urlwebsite, value);
}

function performCommand(event) {
    if (event.command === "Zoom") {safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("zoom", "there");}
}

function validateCommand(event) {
    if (event.command === "Zoom") {
        // Disable the button if there is no URL loaded in the tab.
        event.target.disabled = !event.target.browserWindow.activeTab.url;
    }
}

safari.application.addEventListener("message", function(e) {
	if(e.name === "getSettings") {
		e.target.page.dispatchMessage("setSettings", {allzoom: safari.extension.settings.getItem('allzoom'), optionskipremember: safari.extension.settings.getItem('optionskipremember'), contextmenus: safari.extension.settings.getItem('contextmenus'), badge: safari.extension.settings.getItem('badge'), defaultzoom: safari.extension.settings.getItem('defaultzoom'), steps: safari.extension.settings.getItem('steps'), lightcolor: safari.extension.settings.getItem('lightcolor'), zoomchrome: safari.extension.settings.getItem('zoomchrome'), zoomweb: safari.extension.settings.getItem('zoomweb'), websitezoom: safari.extension.settings.getItem('websitezoom')});
	}
	else if (e.name === "update_setting") {
		var allzoom = e.message.allzoom;
		var allzoomvalue = e.message.allzoomvalue;
		var optionskipremember = e.message.optionskipremember;
		var contextmenus = e.message.contextmenus;
		var badge = e.message.badge;
		var defaultzoom = e.message.defaultzoom;
		var steps = e.message.steps;
		var lightcolor = e.message.lightcolor;
		var zoomchrome = e.message.zoomchrome;
		var zoomweb = e.message.zoomweb;
		var websitezoom = e.message.websitezoom;
		// save it
		safari.extension.settings.allzoom = allzoom;
        safari.extension.settings.allzoomvalue = allzoomvalue;
        safari.extension.settings.optionskipremember = optionskipremember;
        safari.extension.settings.contextmenus = contextmenus;
        safari.extension.settings.badge = badge;
        safari.extension.settings.defaultzoom = defaultzoom;
        safari.extension.settings.steps = steps;
        safari.extension.settings.lightcolor = lightcolor;
        safari.extension.settings.zoomchrome = zoomchrome;
        safari.extension.settings.zoomweb = zoomweb;
        safari.extension.settings.websitezoom = websitezoom;
        safari.extension.settings.allzoomvalue = allzoomvalue;

        // all tabs
        for (var i = 0; i < safari.application.browserWindows.length; i++)
        {
            var browserWindow = safari.application.browserWindows[i];
            for (var j = 0; j < browserWindow.tabs.length; j++)
            {
                var tab = browserWindow.tabs[j];
                //tab.page.dispatchMessage("setSettings", {allzoom: safari.extension.settings.getItem('allzoom'), optionskipremember: safari.extension.settings.getItem('optionskipremember'), contextmenus: safari.extension.settings.getItem('contextmenus'), badge: safari.extension.settings.getItem('badge'), defaultzoom: safari.extension.settings.getItem('defaultzoom'), steps: safari.extension.settings.getItem('steps'), lightcolor: safari.extension.settings.getItem('lightcolor'), zoomchrome: safari.extension.settings.getItem('zoomchrome'), zoomweb: safari.extension.settings.getItem('zoomweb'), websitezoom: safari.extension.settings.getItem('websitezoom')});
            }
        }
	}
    else if (e.name === "getRatio") {
        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("todo", localStorage.getItem(e.message));
    }
}, false );

function settingsChanged(event) {safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + ("options.html");}

function waitForMessage(e) {
	if (e.target !== safari.application.activeBrowserWindow.activeTab)
	return;		
}

// clear the popup value
safari.application.addEventListener('popover', function(event) {
    event.target.contentWindow.location.reload();
}, true);

// if event handlers are in the global HTML page,
// register with application:
safari.application.addEventListener("command", performCommand, false);
safari.application.addEventListener("validate", validateCommand, false);
safari.extension.settings.addEventListener("change", settingsChanged, false);
safari.application.addEventListener("message", waitForMessage, false);

// Read current value settings
window.addEventListener('load', function() {
//
});