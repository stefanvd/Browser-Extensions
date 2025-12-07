//================================================
/*

Rotate that Video Player
Improve your video experience by effortlessly rotating your video clips by 90, 180, or 270 degrees.
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
var currentrotate = 0; var currenttop = 0; var currentleft = 0; var currentscale = 100; var job = null; var darkmode; var showrotate; var showtop; var showleft; var showscale; var showflip; var currentscalex = 100; var currentscaley = 100; var showreset;

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

function scalex(ratio){
	currentscalex = ratio;
	updateTabValues();
}

function scaley(ratio){
	currentscaley = ratio;
	updateTabValues();
}


function updateTabValues(){
	// console.log("currenttop", currenttop, "currentleft", currentleft, "currentscale", currentscale, "currentrotate", currentrotate);
	chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT, active: true}, function(tabs){
		var tab = tabs[0];
		document.getElementById("topnumber").value = Math.round(currenttop);
		document.getElementById("toprange").value = Math.round(currenttop);
		document.getElementById("leftnumber").value = Math.round(currentleft);
		document.getElementById("leftrange").value = Math.round(currentleft);
		document.getElementById("scalenumber").value = Math.round(currentscale);
		document.getElementById("scalerange").value = Math.round(currentscale);
		document.getElementById("number").value = Math.round(currentrotate);
		document.getElementById("range").value = Math.round(currentrotate);
		document.getElementById("scalenumber").value = Math.round(currentscale);
		document.getElementById("scalerange").value = Math.round(currentscale);
		document.getElementById("scalexnumber").value = Math.round(currentscalex);
		document.getElementById("scalexrange").value = Math.round(currentscalex);
		document.getElementById("scaleynumber").value = Math.round(currentscaley);
		document.getElementById("scaleyrange").value = Math.round(currentscaley);

		if(tab && tab.url && (tab.url.startsWith("http://") || tab.url.startsWith("https://"))){
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				// eslint-disable-next-line no-undef
				func: startRotate,
				args: [currentrotate, currenttop, currentleft, currentscale, currentscalex, currentscaley]
			});
		}

		job = tab.url;
		var url = new URL(job);
		var domain = url.hostname;
		var message = {
			name: "setSetting",
			topvalue: currenttop,
			rotatevalue: currentrotate,
			leftvalue: currentleft,
			scalevalue: currentscale,
			urlwebsite: domain,
			scalexvalue: currentscalex,
			scaleyvalue: currentscaley
		};
		chrome.runtime.sendMessage(message);
	});
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

var tempcurrentpopupscalex = "";
function handlescalex(delta){
	tempcurrentpopupscalex = document.getElementById("scalexnumber").value;
	if(delta < 0){
		tempcurrentpopupscalex -= Number(1);
		if(tempcurrentpopupscalex != 0 && tempcurrentpopupscalex >= 1){ document.getElementById("scalexnumber").value = tempcurrentpopupscalex; scalex(tempcurrentpopupscalex); }
	}else{
		if(tempcurrentpopupscalex != 0 && tempcurrentpopupscalex < 600){ tempcurrentpopupscalex = Number(tempcurrentpopupscalex) + Number(1); document.getElementById("scalexnumber").value = tempcurrentpopupscalex; scalex(tempcurrentpopupscalex); }
	}
	tempcurrentpopupscalex = ""; // reset
}

function wheelscalex(event){
	var delta = 0;
	if(!event){ event = window.event; }
	if(event.wheelDelta){ delta = event.wheelDelta / 120; }
	if(delta){ handlescalex(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

var tempcurrentpopupscaley = "";
function handlescaley(delta){
	tempcurrentpopupscaley = document.getElementById("scaleynumber").value;
	if(delta < 0){
		tempcurrentpopupscaley -= Number(1);
		if(tempcurrentpopupscaley != 0 && tempcurrentpopupscaley >= 1){ document.getElementById("scaleynumber").value = tempcurrentpopupscaley; scaley(tempcurrentpopupscaley); }
	}else{
		if(tempcurrentpopupscaley != 0 && tempcurrentpopupscaley < 600){ tempcurrentpopupscaley = Number(tempcurrentpopupscaley) + Number(1); document.getElementById("scaleynumber").value = tempcurrentpopupscaley; scaley(tempcurrentpopupscaley); }
	}
	tempcurrentpopupscaley = ""; // reset
}

function wheelscaley(event){
	var delta = 0;
	if(!event){ event = window.event; }
	if(event.wheelDelta){ delta = event.wheelDelta / 120; }
	if(delta){ handlescaley(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}


function checkForHTML5Video(){
	var videoTags = document.getElementsByTagName("video");
	if(videoTags.length > 0){
		return true;
	}else{
		return false;
	}
}

function showResult(a){
	if(a == true){
		document.getElementById("novideofound").className = "show";
	}else{
		document.getElementById("novideofound").className = "hidden";
	}
}

document.addEventListener("DOMContentLoaded", function(){
	// disable context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	document.getElementById("options").addEventListener("click", function(){
		chrome.runtime.openOptionsPage();
	});

	document.getElementById("reset").addEventListener("click", function(){
		showValue(0);
		rotate(0);
		displayinput(0);
		topshowValue(0);
		leftshowValue(0);
		scaleshowValue(100);
		scalexshowValue(100);
		scaleyshowValue(100);
	});

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id},
			func: checkForHTML5Video
		}, function(results){
			if(chrome.runtime.lastError){
				showResult(true);
			}else{
				var videoFound = results[0].result;
				if(videoFound){
					showResult(false);
				}else{
					showResult(true);
				}
			}
		});
	});

	document.getElementById("btntryvideo").addEventListener("click", function(){
		// stefan vd intro
		window.open("https://www.youtube.com/watch?v=fsxi4Ehxb4g", "_blank");
	});

	document.getElementById("btnhelp").addEventListener("click", function(){
		// stefan vd support
		window.open(linksupport, "_blank");
	});

	chrome.storage.sync.get(["darkmode", "showrotate", "showtop", "showleft", "showscale", "showflip", "showreset"], function(response){
		darkmode = response.darkmode; if(darkmode == null)darkmode = 2; // default Operating System
		showrotate = response.showrotate; if(showrotate == null)showrotate = true;
		showtop = response.showtop; if(showtop == null)showtop = true;
		showleft = response.showleft; if(showleft == null)showleft = true;
		showscale = response.showscale; if(showscale == null)showscale = true;
		showflip = response.showflip; if(showflip == null)showflip = false;
		showreset = response.showreset; if(showreset == null)showreset = true;
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

		if(showflip == true){
			$("flipcontainer").className = "";
		}else{
			$("flipcontainer").className = "hidden";
		}

		if(showreset == true){
			$("resetgroup").className = "link";
		}else{
			$("resetgroup").className = "hidden";
		}
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
				currentscalex = result[domain]["scalex"] || 100;
				currentscaley = result[domain]["scaley"] || 100;
			}else{
				currentrotate = 0;
				currenttop = 0;
				currentleft = 0;
				currentscale = 100;
				currentscalex = 100;
				currentscaley = 100;
			}

			document.getElementById("number").value = Math.round(currentrotate);
			document.getElementById("range").value = Math.round(currentrotate);

			document.getElementById("topnumber").value = Math.round(currenttop);
			document.getElementById("toprange").value = Math.round(currenttop);

			document.getElementById("leftnumber").value = Math.round(currentleft);
			document.getElementById("leftrange").value = Math.round(currentleft);

			document.getElementById("scalenumber").value = Math.round(currentscale);
			document.getElementById("scalerange").value = Math.round(currentscale);

			document.getElementById("scalexnumber").value = Math.round(currentscalex);
			document.getElementById("scalexrange").value = Math.round(currentscalex);

			document.getElementById("scaleynumber").value = Math.round(currentscaley);
			document.getElementById("scaleyrange").value = Math.round(currentscaley);
		});
	});

	function displayinput(newValue){ document.getElementById("number").value = newValue; }
	function showValue(newValue){ document.getElementById("range").value = newValue; document.getElementById("number").value = newValue; rotate(newValue); }

	// add wheel event to all sliders
	document.querySelectorAll(".slider").forEach((sl) => {
		sl.addEventListener("wheel", function(e){
			e.preventDefault();

			const input = this.querySelector("input[type=range]");
			if(!input)return;

			const step = Number(input.step) || 1;

			if(e.deltaY < 0){
				input.value = Number(input.value) + step;
			}else{
				input.value = Number(input.value) - step;
			}

			input.dispatchEvent(new Event("input")); // triggers your existing handlers
		}, {passive: false});
	});

	$("range").addEventListener("wheel", wheelrotate, {passive: false});
	$("range").addEventListener("dblclick", function(){ showValue(0); });
	$("range").addEventListener("input", function(){ showValue(this.value); });
	$("range").addEventListener("change", function(){ showValue(this.value); });
	$("number").addEventListener("change", function(){ showValue(this.value); });
	$("hund").addEventListener("click", function(){ rotate(0); displayinput(0); });
	$("minus").addEventListener("click", function(){ rotateview(-1); });
	$("plus").addEventListener("click", function(){ rotateview(+1); });

	function topshowValue(newValue){ document.getElementById("toprange").value = newValue; document.getElementById("topnumber").value = newValue; topmove(newValue); }
	$("toprange").addEventListener("wheel", wheeltop, {passive: false});
	$("toprange").addEventListener("dblclick", function(){ topshowValue(0); });
	$("toprange").addEventListener("input", function(){ topshowValue(this.value); });
	$("toprange").addEventListener("change", function(){ topshowValue(this.value); });
	$("topnumber").addEventListener("change", function(){ topshowValue(this.value); });

	function leftshowValue(newValue){ document.getElementById("leftrange").value = newValue; document.getElementById("leftnumber").value = newValue; leftmove(newValue); }
	$("leftrange").addEventListener("wheel", wheelleft, {passive: false});
	$("leftrange").addEventListener("dblclick", function(){ leftshowValue(0); });
	$("leftrange").addEventListener("input", function(){ leftshowValue(this.value); });
	$("leftrange").addEventListener("change", function(){ leftshowValue(this.value); });
	$("leftnumber").addEventListener("change", function(){ leftshowValue(this.value); });

	function scaleshowValue(newValue){ document.getElementById("scalerange").value = newValue; document.getElementById("scalenumber").value = newValue; scale(newValue); }
	$("scalerange").addEventListener("wheel", wheelscale, {passive: false});
	$("scalerange").addEventListener("dblclick", function(){ scaleshowValue(100); });
	$("scalerange").addEventListener("input", function(){ scaleshowValue(this.value); });
	$("scalerange").addEventListener("change", function(){ scaleshowValue(this.value); });
	$("scalenumber").addEventListener("change", function(){ scaleshowValue(this.value); });

	function scalexshowValue(newValue){ document.getElementById("scalexrange").value = newValue; document.getElementById("scalexnumber").value = newValue; scalex(newValue); }
	$("scalexrange").addEventListener("wheel", wheelscalex, {passive: false});
	$("scalexrange").addEventListener("dblclick", function(){ scalexshowValue(100); });
	$("scalexrange").addEventListener("input", function(){ scalexshowValue(this.value); });
	$("scalexrange").addEventListener("change", function(){ scalexshowValue(this.value); });
	$("scalexnumber").addEventListener("change", function(){ scalexshowValue(this.value); });

	function scaleyshowValue(newValue){ document.getElementById("scaleyrange").value = newValue; document.getElementById("scaleynumber").value = newValue; scaley(newValue); }
	$("scaleyrange").addEventListener("wheel", wheelscaley, {passive: false});
	$("scaleyrange").addEventListener("dblclick", function(){ scaleyshowValue(100); });
	$("scaleyrange").addEventListener("input", function(){ scaleyshowValue(this.value); });
	$("scaleyrange").addEventListener("change", function(){ scaleyshowValue(this.value); });
	$("scaleynumber").addEventListener("change", function(){ scaleyshowValue(this.value); });
});