//================================================
/*

Font Size Decrease
With one click on the button the font size on the current page will be increase.
Copyright (C) 2022 Stefan vd
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
// eslint-disable-next-line no-undef
importScripts("constants.js");

function codereset(){
	var q = document.getElementsByTagName("*");
	var i;
	var l = q.length;
	for(i = 0; i < l; i++){
		if(q[i].hasAttribute("data-default-fontsize")){
			q[i].style.setProperty("font-size", q[i].getAttribute("data-default-fontsize"), "important");
			q[i].removeAttribute("data-default-fontsize");
		}
	}
}

function codesetsize(){
	var maximum = 75;

	// set the orignal font size as backup
	var q = document.getElementsByTagName("*");
	var i;
	var l = q.length;
	var fntsz;
	for(i = 0; i < l; i++){
		if(q[i].currentStyle){
			fntsz = q[i].currentStyle["font-size"];
		}else if(window.getComputedStyle){
			let st = document.defaultView.getComputedStyle(q[i], null);
			fntsz = st.getPropertyValue("font-size");
		}

		if(q[i].hasAttribute("data-default-fontsize")){
			// already got the default font size
		}else{
			q[i].setAttribute("data-default-fontsize", fntsz);
		}

		// change the font size
		if(q[i].currentStyle){
			fntsz = q[i].currentStyle["font-size"];
		}else if(window.getComputedStyle){
			let st = document.defaultView.getComputedStyle(q[i], null);
			fntsz = st.getPropertyValue("font-size");
		}

		fntsz = fntsz.replace("px", "");
		var finalfontsize = parseFloat(fntsz) + 1;
		if(finalfontsize <= maximum){
			finalfontsize = finalfontsize + "px";
			q[i].style.setProperty("font-size", finalfontsize, "important");
		}

	}
}

// Set click to zero at beginning
let clickbutton = 0;
// Declare a timer variable
let timer;
var openactionclick = function(tab){
	clickbutton += 1;
	if(clickbutton == 2){
		// console.log("Doubleclick");
		clearTimeout(timer);
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: codereset
		});
	}

	timer = setTimeout(function(){
		// console.log("Singelclick");
		if(clickbutton == 1){
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				func: codesetsize
			});
		}
		clickbutton = 0;
		// Clear all timers
		clearTimeout(timer);
	}, 250);
};
chrome.action.onClicked.addListener(openactionclick);

chrome.runtime.setUninstallURL(linkuninstall);

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