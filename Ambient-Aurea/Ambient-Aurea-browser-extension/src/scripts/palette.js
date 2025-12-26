//================================================
/*

Ambient Aurea
Instantly craft stunning photo galleries with ambient lighting effects in a single click.
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

var darkmode;
var interval;
document.addEventListener("DOMContentLoaded", function(){
	chrome.storage.sync.get(["darkmode", "interval"], function(items){
		darkmode = items["darkmode"]; if(darkmode == null)darkmode = false; // default false
		interval = items["interval"]; if(interval == null)interval = 80; // default 80%

		// to nothing - regular thing
		if($("number")){ $("number").value = interval; }
		if($("range")){ $("range").value = interval; }
	});
	// disable right click menu
	// document.addEventListener('contextmenu', event => event.preventDefault());


	$("goaa").addEventListener("click", function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			if(tabs[0]){
				chrome.scripting.executeScript({
					target: {tabId: tabs[0].id},
					files: ["scripts/aaselector.js"]
				});
			}
		});
	});

	// mouse scroll
	$("range").addEventListener("wheel", wheel); // for modern
	$("range").addEventListener("change", opacitychange, false);
	$("range").addEventListener("input", opacitychange, false);
	$("range").addEventListener("dblclick", function(){ $("range").value = 80; opacitychange(); });

	// default settings
	$("square").addEventListener("click", function(){
		chrome.tabs.query({active: true, currentWindow: true},
			function(tabs){
				if(tabs[0]){
					chrome.tabs.sendMessage(tabs[0].id, {text: "godownloadimages"});
				}
			});
		window.close();
	});
	$("options").addEventListener("click", function(){ chrome.runtime.openOptionsPage(); });
});

var tempcurrentpopup = "";
function handle(delta){
	tempcurrentpopup = document.getElementById("range").value;
	if(delta < 0){
		if(tempcurrentpopup != 0){ tempcurrentpopup -= Number(1); document.getElementById("range").value = tempcurrentpopup; }
	}else{
		if(tempcurrentpopup <= 100){ tempcurrentpopup = Number(tempcurrentpopup) + Number(1); document.getElementById("range").value = tempcurrentpopup; }
	}
	opacitychange();
}

function wheel(event){
	var delta = 0;
	delta = event.deltaY;
	if(delta){ handle(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

function opacitychange(){
	var thatvalue = $("range").value;
	$("number").value = thatvalue;
	chrome.storage.sync.set({"interval": thatvalue});
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs){
		if(tabs[0]){
			chrome.scripting.executeScript({
				target: {tabId: tabs[0].id},
				func: function(thatvalue){
					var ambientAurea = document.getElementById("stefanvdambientaurea");
					if(ambientAurea && ambientAurea.shadowRoot){
						var divs = ambientAurea.shadowRoot.querySelectorAll(".stefanvdaalightareoff");
						divs.forEach(function(div){
							div.style.opacity = thatvalue / 100;
						});
					}
				},
				args: [thatvalue]
			});
		}
	});
}