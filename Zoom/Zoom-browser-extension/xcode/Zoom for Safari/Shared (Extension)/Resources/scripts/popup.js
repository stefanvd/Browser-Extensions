//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
Copyright (C) 2024 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,job
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
var currentRatio = 1; var ratio = 1;
var currentTabId;
var darkmode; var steps; var zoomchrome; var zoomweb; var zoomfont; var smallpopup; var largepopup; var modernpopup; var prezoombutton; var websitelevel;

function zoom(ratio){
	currentRatio = ratio / 100;
	document.getElementById("number").value = Math.round(currentRatio * 100);
	document.getElementById("range").value = Math.round(currentRatio * 100);
	chrome.runtime.sendMessage({name: "changezoom", value: currentRatio, screen: screen.width + "x" + screen.height, tabId: currentTabId});
}

function zoomview(direction){ zoom(nextratio(currentRatio * 100, direction)); }

function nextratio(ratio, direction){
	ratio = Math.round(ratio);
	var prevratio = parseInt(ratio) - parseInt(steps);
	var nextratio = parseInt(ratio) + parseInt(steps);

	if(direction == -1){
		if(ratio <= 10){
			prevratio = 100;
			nextratio = 100;
		}
	}else{
		if(ratio >= 400){
			prevratio = 100;
			nextratio = 100;
		}
	}

	if(nextratio > 400 || nextratio < 0){
		nextratio = 100;
	}

	return(direction == -1) ? prevratio : nextratio;
}

var tempcurrentpopupzoom = "";
function handle(delta){
	tempcurrentpopupzoom = document.getElementById("number").value;
	if(delta < 0){
		tempcurrentpopupzoom -= Number(1);
		if(tempcurrentpopupzoom != 0 && tempcurrentpopupzoom >= 1){ document.getElementById("number").value = tempcurrentpopupzoom; zoom(tempcurrentpopupzoom); }
	}else{
		if(tempcurrentpopupzoom != 0 && tempcurrentpopupzoom < 400){ tempcurrentpopupzoom = Number(tempcurrentpopupzoom) + Number(1); document.getElementById("number").value = tempcurrentpopupzoom; zoom(tempcurrentpopupzoom); }
	}
	tempcurrentpopupzoom = ""; // reset
}

function wheel(event){
	var delta = 0;
	delta = event.deltaY;
	if(delta){ handle(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

async function getCurrentTab(){
	let queryOptions = {active: true, currentWindow: true};
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

document.addEventListener("DOMContentLoaded", function(){
	// set tooltip
	$("hund").title = chrome.i18n.getMessage("titleshortzoomreset");
	$("minus").title = chrome.i18n.getMessage("titleshortzoomout");
	$("plus").title = chrome.i18n.getMessage("titleshortzoomin");

	// disable context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	// default settings
	function displayinput(newValue){ document.getElementById("number").value = parseInt(newValue); document.getElementById("range").value = parseInt(newValue); currentRatio = newValue / 100; }
	function showValue(newValue){ document.getElementById("range").value = parseInt(newValue); document.getElementById("number").value = parseInt(newValue); zoom(newValue); }
	function resetZoom(){
		chrome.runtime.sendMessage({name: "resetzoom", screen: screen.width + "x" + screen.height, tabId: currentTabId}, function(value){
			if(chrome.runtime.lastError)return;
			displayinput(value * 100);
		});
	}
	$("range").addEventListener("change", function(){ showValue(this.value); });
	$("range").addEventListener("input", function(){ showValue(this.value); });
	$("number").addEventListener("change", function(){ showValue(this.value); });
	$("hund").addEventListener("click", resetZoom);
	$("range").addEventListener("dblclick", resetZoom);
	$("minus").addEventListener("click", function(){ zoomview(-1); });
	$("plus").addEventListener("click", function(){ zoomview(+1); });

	$("circle").addEventListener("click", function(){
		chrome.storage.sync.set({"zoommagcircle": true, "zoommagsquare": false}, function(){
			chrome.tabs.query({active: true, currentWindow: true},
				function(tabs){
					if(tabs[0]){
						chrome.tabs.sendMessage(tabs[0].id, {text: "enablemagnifyingglass"});
					}
				});
			window.close();
		});
	});
	$("square").addEventListener("click", function(){
		chrome.storage.sync.set({"zoommagcircle": false, "zoommagsquare": true}, function(){
			chrome.tabs.query({active: true, currentWindow: true},
				function(tabs){
					if(tabs[0]){
						chrome.tabs.sendMessage(tabs[0].id, {text: "enablemagnifyingglass"});
					}
				});
			window.close();
		});
	});
	$("options").addEventListener("click", function(){ chrome.runtime.openOptionsPage(); });

	// mouse scroll
	$("range").addEventListener("wheel", wheel, {passive: false}); // for modern

	chrome.storage.sync.get(["darkmode", "steps", "zoomchrome", "zoomweb", "zoomfont", "smallpopup", "largepopup", "modernpopup", "prezoombutton", "websitelevel"], function(response){
		darkmode = response.darkmode; if(darkmode == null)darkmode = 2; // default Operating System
		steps = response.steps; if(steps == null)steps = 10;
		zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false;
		zoomweb = response.zoomweb; if(zoomweb == null)zoomweb = true;
		zoomfont = response.zoomfont; if(zoomfont == null)zoomfont = false;
		smallpopup = response.smallpopup; if(smallpopup == null)smallpopup = false;
		largepopup = response.largepopup; if(largepopup == null)largepopup = false;
		modernpopup = response.modernpopup; if(modernpopup == null)modernpopup = true;
		prezoombutton = response.prezoombutton; if(prezoombutton == null)prezoombutton = false;
		websitelevel = response.websitelevel;

		if(prezoombutton == true){
			var predefinedbuttons = document.getElementById("predefinedbuttons");
			predefinedbuttons.className = "";

			if(typeof websitelevel == "undefined" || websitelevel == null){
				websitelevel = JSON.stringify({"85": true, "115": true, "123": true});
			}

			if(typeof websitelevel === "string"){
				websitelevel = JSON.parse(websitelevel);
			}

			var buf = [];
			for(var psdomain in websitelevel){
				buf.push(parseInt(websitelevel[psdomain]));
			}

			buf.sort(function(a, b){
				return a - b; // Sort the array in ascending order
			});

			for(var ti = 0; ti < buf.length; ti++){
				var newButton = document.createElement("div");
				newButton.className = "btnpreset";
				newButton.textContent = buf[ti];
				newButton.addEventListener("click", function(){
					showValue(parseInt(this.textContent));
				});
				predefinedbuttons.appendChild(newButton);
			}
		}

		if(smallpopup){
			document.getElementById("type").className = "small";
			document.documentElement.className = "small";
		}else if(largepopup){
			document.getElementById("type").className = "large";
			document.documentElement.className = "large";
		}else if(modernpopup){
			document.getElementById("type").className = "modern";
			document.documentElement.className = "modern";
		}else{
			// default popup design
			document.getElementById("type").className = "modern";
			document.documentElement.className = "modern";
		}

		// dark mode
		var thattheme = "light";
		switch(darkmode){
		case 1:
			thattheme = "dark";
			break;
		case 0:
			thattheme = "light";
			break;
		case 2:
			if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
				thattheme = "dark";
			}else{
				thattheme = "light";
			}
			break;
		}
		document.body.className = thattheme + " general";


		getCurrentTab().then((thattab) => {
			if(thattab && typeof thattab.url !== "undefined"){
				currentTabId = thattab.id;
				if(zoomchrome == true){
					chrome.tabs.getZoom(thattab.id, function(zoomFactor){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log('ERROR: ', chrome.runtime.lastError);
						}
						ratio = zoomFactor;
						if(ratio == null){ ratio = 1; }
						currentRatio = ratio;
						document.getElementById("number").value = Math.round(ratio * 100);
						document.getElementById("range").value = Math.round(ratio * 100);
					});
				}else if(zoomweb == true){
					chrome.tabs.sendMessage(thattab.id, {text: "getwebzoom"}, function(info){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log('ERROR: ', chrome.runtime.lastError);
						}
						if(info == null || info == ""){ info = 1; }
						ratio = info;
						currentRatio = ratio;
						document.getElementById("number").value = Math.round(ratio * 100);
						document.getElementById("range").value = Math.round(ratio * 100);
					});
				}else if(zoomfont == true){
					chrome.tabs.sendMessage(thattab.id, {text: "getfontsize"}, function(info){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log('ERROR: ', chrome.runtime.lastError);
						}
						if(info == null || info == ""){ info = 1; }
						ratio = info;
						currentRatio = ratio;
						document.getElementById("number").value = Math.round(ratio * 100);
						document.getElementById("range").value = Math.round(ratio * 100);
					});
				}
			}
		});
	});
});
