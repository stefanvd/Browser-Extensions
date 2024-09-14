//================================================
/*

Snow
Experience a snowstorm effect with falling snow on your page. Transform it into a winter wonderland with snowflakes.
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

function toggleoff(){
	chrome.tabs.query({active: true}, function(tabs){
		for(var i = 0; i < tabs.length; i++){
			// Send a request to the content script.
			chrome.storage.sync.set({"addbar": false});
			chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"}, function(){
				if(chrome.runtime.lastError){
					// console.log("Menu Error: " + chrome.runtime.lastError.message);
					// content script is not added here
					// need to refresh the web page
				}
			});
			$("turnoff").style.display = "none";
			$("turnon").style.display = "block";
			chrome.runtime.sendMessage({name: "liveaddbar", value: false});
		}
	}
	);
}
function toggleon(){
	chrome.tabs.query({active: true}, function(tabs){
		for(var i = 0; i < tabs.length; i++){
			// Send a request to the content script.
			chrome.storage.sync.set({"addbar": true});
			chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"}, function(){
				if(chrome.runtime.lastError){
					// console.log("Menu Error: " + chrome.runtime.lastError.message);
					// content script is not added here
					// need to refresh the web page
				}
			});
			$("turnoff").style.display = "block";
			$("turnon").style.display = "none";
			chrome.runtime.sendMessage({name: "liveaddbar", value: true});
		}
	}
	);
}

var addbar, snowAmount, snowColor, colorOption, snowShape, snowSize, snowSpeed, windDirectionControl, snowOnBottom;
document.addEventListener("DOMContentLoaded", function(){
	// open connnection to background that the popup is open
	chrome.runtime.connect({name: "mySnow"});

	// disable context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	chrome.storage.sync.get(["addbar", "snowAmount", "snowColor", "colorOption", "snowShape", "snowSize", "snowSpeed", "windDirectionControl", "snowOnBottom"], function(items){
		addbar = items["addbar"]; if(addbar == null)addbar = true;
		snowAmount = items["snowAmount"]; if(snowAmount == null)snowAmount = 500;
		snowColor = items["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
		colorOption = items["colorOption"]; if(colorOption == null)colorOption = "solid";
		snowShape = items["snowShape"]; if(snowShape == null)snowShape = "dot";
		snowSize = items["snowSize"]; if(snowSize == null)snowSize = 3;
		snowSpeed = items["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
		windDirectionControl = items["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = false;
		snowOnBottom = items["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;

		if(addbar == true){
			$("turnoff").style.display = "block";
			$("turnon").style.display = "none";
		}else{
			$("turnoff").style.display = "none";
			$("turnon").style.display = "block";
		}

		$("snowAmount").value = snowAmount;
		$("number").innerText = snowAmount;
		$("snowColor").value = snowColor;
		$("colorOption").value = colorOption;
		$("snowShape").value = snowShape;
		$("snowSize").value = snowSize;
		$("snowSpeed").value = snowSpeed;
		$("windDirectionControl").checked = windDirectionControl;
		$("snowOnBottom").checked = snowOnBottom;
	});

	// Toggle on
	$("turnoff").addEventListener("click", function(){ toggleoff(); });
	// Toggle off
	$("turnon").addEventListener("click", function(){ toggleon(); });

	// change the value
	$("snowAmount").addEventListener("input", function(){
		$("number").innerText = parseInt($("snowAmount").value);
		chrome.runtime.sendMessage({name: "livesnowAmount", value: parseInt($("snowAmount").value)});
	}, false);

	$("snowColor").addEventListener("input", function(){
		chrome.runtime.sendMessage({name: "livesnowColor", value: $("snowColor").value});
	}, false);

	$("colorOption").addEventListener("change", function(){
		if($("colorOption").value == "solid"){
			$("colordot").className = "show";
		}else{
			$("colordot").className = "hidden";
		}
		chrome.runtime.sendMessage({name: "livecolorOption", value: $("colorOption").value});
	}, false);

	$("snowShape").addEventListener("change", function(){
		chrome.storage.sync.set({"snowShape": $("snowShape").value});
		chrome.runtime.sendMessage({name: "livesnowShape", value: $("snowShape").value});
	}, false);

	$("snowSize").addEventListener("input", function(){
		chrome.runtime.sendMessage({name: "livesnowSize", value: parseInt($("snowSize").value)});
	}, false);

	$("snowSpeed").addEventListener("input", function(){
		chrome.runtime.sendMessage({name: "livesnowSpeed", value: parseInt($("snowSpeed").value)});
	}, false);

	$("windDirectionControl").addEventListener("change", function(){
		chrome.runtime.sendMessage({name: "livewindDirectionControl", value: $("windDirectionControl").checked});
	}, false);

	$("snowOnBottom").addEventListener("change", function(){
		chrome.runtime.sendMessage({name: "livesnowOnBottom", value: $("snowOnBottom").checked});
	}, false);

	$("opendonate").addEventListener("click", function(){ window.open(linkdonate); });
	$("openoptions").addEventListener("click", function(){ window.open(chrome.runtime.getURL("options.html")); });
	$("opensupport").addEventListener("click", function(){ window.open(linksupport); });
});

var darkmode;
chrome.storage.sync.get(["darkmode"], function(items){
	darkmode = items["darkmode"]; if(darkmode == null)darkmode = 2; // default Operating System

	// dark mode
	if(darkmode == 1){
		document.body.className = "dark";
	}else if(darkmode == 0){
		document.body.className = "light";
	}else if(darkmode == 2){
		if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
			document.body.className = "dark";
		}else{
			document.body.className = "light";
		}
	}
});