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

function $(id){ return document.getElementById(id); }

// disable context menu
document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

document.addEventListener("DOMContentLoaded", function(){
	$("btnsavepage").addEventListener("click", function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs){
			var activeTab = arrayOfTabs[0];
			var activeTabId = activeTab.id;
			window.close();
			chrome.scripting.executeScript({
				target: {tabId: activeTabId},
				files: ["scripts/saveas.js"]
			});
		});
	});
	$("btnprintpage").addEventListener("click", function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs){
			var activeTab = arrayOfTabs[0];
			var activeTabId = activeTab.id;
			window.close();
			chrome.scripting.executeScript({
				target: {tabId: activeTabId},
				files: ["scripts/print.js"]
			});
		});
	});
	$("btnprintpageblack").addEventListener("click", function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs){
			var activeTab = arrayOfTabs[0];
			var activeTabId = activeTab.id;
			window.close();
			chrome.scripting.executeScript({
				target: {tabId: activeTabId},
				files: ["scripts/printblack.js"]
			});
		});
	});
	$("btnoptions").addEventListener("click", function(){ chrome.runtime.openOptionsPage(); });
});

var darkmode;
chrome.storage.sync.get(["darkmode"], function(response){
	darkmode = response.darkmode; if(darkmode == null)darkmode = false; // default darkmode false
	// dark mode
	if(darkmode == true){
		document.body.className = "dark";
	}else{
		document.body.className = "light";
	}
});