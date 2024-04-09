//================================================
/*

Rotate that Video Player
Improve your video experience by effortlessly rotating your video clips by 90, 180, or 270 degrees.
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

function $(id){ return document.getElementById(id); }
var currentrotate = 0; var currenttop = 0; var currentleft = 0; var currentscale = 100; var job = null; var darkmode; var showrotate; var showtop; var showleft; var showscale;

// popup is active, communcation is enabled
chrome.runtime.connect({name: "popup"});

function topmove(ratio){
	currenttop = ratio;
	updateTabValues();
}

function leftmove(ratio){
	currentleft = ratio;
	updateTabValues();
}

function scale(ratio){
	currentscale = ratio;
	updateTabValues();
}

function rotate(ratio){
	currentrotate = ratio;
	updateTabValues();
}

function updateTabValues(){
	// console.log("currenttop", currenttop, "currentleft", currentleft, "currentscale", currentscale, "currentrotate", currentrotate);
	chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT, active: true}, function(tabs){
		var tab = tabs[0];
		var tabId = tab.id;
		document.getElementById("topnumber").value = Math.round(currenttop);
		document.getElementById("toprange").value = Math.round(currenttop);
		document.getElementById("leftnumber").value = Math.round(currentleft);
		document.getElementById("leftrange").value = Math.round(currentleft);
		document.getElementById("scalenumber").value = Math.round(currentscale);
		document.getElementById("scalerange").value = Math.round(currentscale);
		document.getElementById("number").value = Math.round(currentrotate);
		document.getElementById("range").value = Math.round(currentrotate);

		chrome.scripting.executeScript({
			target: {tabId: tabId},
			function: insertscript,
			args: [currentrotate, currenttop, currentleft, currentscale]
		});

		job = tab.url;
		var url = new URL(job);
		var domain = url.hostname;
		var message = {
			name: "setSetting",
			topvalue: currenttop,
			rotatevalue: currentrotate,
			leftvalue: currentleft,
			scalevalue: currentscale,
			urlwebsite: domain
		};
		chrome.runtime.sendMessage(message);
	});
}

function insertscript(rotate, top, left, scale){
	// Check if the class is already added to the document body head
	var styleElement = document.getElementById("stefanvdrotate-style");
	if(!styleElement){
		// If not added, create a new style element and add it to the head
		styleElement = document.createElement("style");
		styleElement.id = "stefanvdrotate-style";
		document.head.appendChild(styleElement);
	}

	// Generate CSS rule based on the current values
	const transformValue = `rotate(${rotate}deg) scale(${scale / 100}) translate(${top}px, ${left}px)`;
	var cssRule = ".stefanvdrotate { transform: " + transformValue + "; }";

	// Update the style element with the new CSS rule
	styleElement.innerHTML = cssRule;

	// Apply the class to the appropriate elements based on the URL
	if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		if(document.getElementById("movie_player")){
			document.getElementById("movie_player").style.zIndex = 1001;
			document.getElementById("movie_player").style.position = "relative";
		}
		if(document.getElementById("player-api")){
			document.getElementById("player-api").style.cssText = "overflow:visible !important";
		}
		if(document.getElementById("player")){
			document.getElementById("player").classList.add("stefanvdrotate");
			document.getElementById("player").style.zIndex = 1001;
		}
	}else{
		if(document.getElementsByTagName("video")[0]){
			document.getElementsByTagName("video")[0].classList.add("stefanvdrotate");
		}
	}

	// console.log("rotate", rotate, "top", top, "left", left, "scale=", scale);
	if(rotate == 0 && top == 0 && left == 0 && scale == 100){
		var item = document.getElementById("stefanvdrotate-style");
		if(item){
			item.parentNode.removeChild(item);
		}
		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
			if(document.getElementById("player").classList.contains("stefanvdrotate")){
				document.getElementById("player").classList.remove("stefanvdrotate");
			}
		}else{
			if(document.getElementsByTagName("video")[0].classList.contains("stefanvdrotate")){
				document.getElementsByTagName("video")[0].classList.remove("stefanvdrotate");
			}
		}
	}
}

function rotateview(direction){ rotate(nextratio(currentrotate, direction)); }

function nextratio(ratio, direction){
	switch(ratio){
	case 0: return(direction == -1) ? 270 : 90;
	case 90: return(direction == -1) ? 0 : 180;
	case 180: return(direction == -1) ? 90 : 270;
	case 270: return(direction == -1) ? 180 : 360;
	case 360: return(direction == -1) ? 270 : 0;
	default: return 180; // more than 400% or less 50% go back to 100%
	}
}

var tempcurrentpopuprotate = "";
function handlerotate(delta){
	tempcurrentpopuprotate = document.getElementById("number").value;
	if(delta < 0){
		tempcurrentpopuprotate -= Number(1);
		if(tempcurrentpopuprotate != 0 && tempcurrentpopuprotate >= 1){ document.getElementById("number").value = tempcurrentpopuprotate; rotate(tempcurrentpopuprotate); }
	}else{
		if(tempcurrentpopuprotate != 0 && tempcurrentpopuprotate < 360){ tempcurrentpopuprotate = Number(tempcurrentpopuprotate) + Number(1); document.getElementById("number").value = tempcurrentpopuprotate; rotate(tempcurrentpopuprotate); }
	}
	tempcurrentpopuprotate = ""; // reset
}

function wheelrotate(event){
	var delta = 0;
	if(!event){ event = window.event; }
	if(event.wheelDelta){ delta = event.wheelDelta / 120; }
	if(delta){ handlerotate(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

var tempcurrentpopuptop = "";
function handletop(delta){
	tempcurrentpopuptop = document.getElementById("topnumber").value;
	if(delta < 0){
		tempcurrentpopuptop -= Number(1);
		if(tempcurrentpopuptop != 0 && tempcurrentpopuptop >= 1){ document.getElementById("topnumber").value = tempcurrentpopuptop; topmove(tempcurrentpopuptop); }
	}else{
		if(tempcurrentpopuptop != 0 && tempcurrentpopuptop < 600){ tempcurrentpopuptop = Number(tempcurrentpopuptop) + Number(1); document.getElementById("topnumber").value = tempcurrentpopuptop; topmove(tempcurrentpopuptop); }
	}
	tempcurrentpopuptop = ""; // reset
}

function wheeltop(event){
	var delta = 0;
	if(!event){ event = window.event; }
	if(event.wheelDelta){ delta = event.wheelDelta / 120; }
	if(delta){ handletop(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

var tempcurrentpopupleft = "";
function handleleft(delta){
	tempcurrentpopupleft = document.getElementById("leftnumber").value;
	if(delta < 0){
		tempcurrentpopupleft -= Number(1);
		if(tempcurrentpopupleft != 0 && tempcurrentpopupleft >= 1){ document.getElementById("leftnumber").value = tempcurrentpopupleft; leftmove(tempcurrentpopupleft); }
	}else{
		if(tempcurrentpopupleft != 0 && tempcurrentpopupleft < 600){ tempcurrentpopupleft = Number(tempcurrentpopupleft) + Number(1); document.getElementById("leftnumber").value = tempcurrentpopupleft; leftmove(tempcurrentpopupleft); }
	}
	tempcurrentpopupleft = ""; // reset
}

function wheelleft(event){
	var delta = 0;
	if(!event){ event = window.event; }
	if(event.wheelDelta){ delta = event.wheelDelta / 120; }
	if(delta){ handleleft(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

var tempcurrentpopupscale = "";
function handlescale(delta){
	tempcurrentpopupscale = document.getElementById("scalenumber").value;
	if(delta < 0){
		tempcurrentpopupscale -= Number(1);
		if(tempcurrentpopupscale != 0 && tempcurrentpopupscale >= 1){ document.getElementById("scalenumber").value = tempcurrentpopupscale; scale(tempcurrentpopupscale); }
	}else{
		if(tempcurrentpopupscale != 0 && tempcurrentpopupscale < 600){ tempcurrentpopupscale = Number(tempcurrentpopupscale) + Number(1); document.getElementById("scalenumber").value = tempcurrentpopupscale; scale(tempcurrentpopupscale); }
	}
	tempcurrentpopupscale = ""; // reset
}

function wheelscale(event){
	var delta = 0;
	if(!event){ event = window.event; }
	if(event.wheelDelta){ delta = event.wheelDelta / 120; }
	if(delta){ handlescale(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

document.addEventListener("DOMContentLoaded", function(){
	// disable context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	chrome.storage.sync.get(["darkmode", "showrotate", "showtop", "showleft", "showscale"], function(response){
		darkmode = response.darkmode; if(darkmode == null)darkmode = 2; // default Operating System
		showrotate = response.showrotate; if(showrotate == null)showrotate = true;
		showtop = response.showtop; if(showtop == null)showtop = true;
		showleft = response.showleft; if(showleft == null)showleft = true;
		showscale = response.showscale; if(showscale == null)showscale = true;
		// default popup design
		document.getElementById("type").className = "modern";
		document.documentElement.className = "modern";

		if(showrotate == false){
			$("rotatepanel").className = "hidden";
		}
		if(showtop == false){
			$("toppanel").className = "hidden";
		}
		if(showleft == false){
			$("leftpanel").className = "hidden";
		}
		if(showscale == false){
			$("scalepanel").className = "hidden";
		}

		if(exbrowser == "safari"){
			document.body.className = "transparent";
		}else{
			// dark mode
			var thattheme;
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
		}
		document.body.className = thattheme + " general";
	});

	// default settings
	chrome.tabs.query({active:true}, function(tabs){
		var job = tabs[0].url;
		const url = new URL(job);
		const domain = url.hostname;

		chrome.storage.sync.get([domain], function(result){
			if(result[domain]){
				currentrotate = result[domain]["rotate"] || 0;
				currenttop = result[domain]["topposition"] || 0;
				currentleft = result[domain]["leftposition"] || 0;
				currentscale = result[domain]["scale"] || 100;
			}else{
				currentrotate = 0;
				currenttop = 0;
				currentleft = 0;
				currentscale = 100;
			}

			document.getElementById("number").value = Math.round(currentrotate);
			document.getElementById("range").value = Math.round(currentrotate);

			document.getElementById("topnumber").value = Math.round(currenttop);
			document.getElementById("toprange").value = Math.round(currenttop);

			document.getElementById("leftnumber").value = Math.round(currentleft);
			document.getElementById("leftrange").value = Math.round(currentleft);

			document.getElementById("scalenumber").value = Math.round(currentscale);
			document.getElementById("scalerange").value = Math.round(currentscale);
		});
	});

	function displayinput(newValue){ document.getElementById("number").value = newValue; }
	function showValue(newValue){ document.getElementById("range").value = newValue; document.getElementById("number").value = newValue; rotate(newValue); }
	$("range").addEventListener("mousewheel", wheelrotate, {passive: false});
	$("range").addEventListener("dblclick", function(){ showValue(0); });
	$("range").addEventListener("input", function(){ showValue(this.value); });
	$("range").addEventListener("change", function(){ showValue(this.value); });
	$("number").addEventListener("change", function(){ showValue(this.value); });
	$("hund").addEventListener("click", function(){ rotate(0); displayinput(0); });
	$("minus").addEventListener("click", function(){ rotateview(-1); });
	$("plus").addEventListener("click", function(){ rotateview(+1); });

	function topshowValue(newValue){ document.getElementById("toprange").value = newValue; document.getElementById("topnumber").value = newValue; topmove(newValue); }
	$("toprange").addEventListener("mousewheel", wheeltop, {passive: false});
	$("toprange").addEventListener("dblclick", function(){ topshowValue(0); });
	$("toprange").addEventListener("input", function(){ topshowValue(this.value); });
	$("toprange").addEventListener("change", function(){ topshowValue(this.value); });
	$("topnumber").addEventListener("change", function(){ topshowValue(this.value); });

	function leftshowValue(newValue){ document.getElementById("leftrange").value = newValue; document.getElementById("leftnumber").value = newValue; leftmove(newValue); }
	$("leftrange").addEventListener("mousewheel", wheelleft, {passive: false});
	$("leftrange").addEventListener("dblclick", function(){ leftshowValue(0); });
	$("leftrange").addEventListener("input", function(){ leftshowValue(this.value); });
	$("leftrange").addEventListener("change", function(){ leftshowValue(this.value); });
	$("leftnumber").addEventListener("change", function(){ leftshowValue(this.value); });

	function scaleshowValue(newValue){ document.getElementById("scalerange").value = newValue; document.getElementById("scalenumber").value = newValue; scale(newValue); }
	$("scalerange").addEventListener("mousewheel", wheelscale, {passive: false});
	$("scalerange").addEventListener("dblclick", function(){ scaleshowValue(100); });
	$("scalerange").addEventListener("input", function(){ scaleshowValue(this.value); });
	$("scalerange").addEventListener("change", function(){ scaleshowValue(this.value); });
	$("scalenumber").addEventListener("change", function(){ scaleshowValue(this.value); });
});