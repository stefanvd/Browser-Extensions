//================================================
/*

Full Screen
Go full screen with one click on the button.
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

var darkmode; var firstDate; var optionskipremember; var firstsawrate; var fullscreenweb; var fullscreenwindow; var fullscreenpopup; var fullscreenvideo; var videoinwindow; var videooutwindow;

function save_options(){
	chrome.storage.sync.set({"fullscreenweb":$("fullscreenweb").checked, "fullscreenwindow":$("fullscreenwindow").checked, "fullscreenpopup":$("fullscreenpopup").checked, "fullscreenvideo":$("fullscreenvideo").checked, "videoinwindow":$("videoinwindow").checked, "videooutwindow":$("videooutwindow").checked});
}

document.addEventListener("DOMContentLoaded", function(){
	// disable context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	chrome.storage.sync.get(["darkmode", "firstDate", "optionskipremember", "firstsawrate", "fullscreenweb", "fullscreenwindow", "fullscreenpopup", "fullscreenvideo", "videoinwindow", "videooutwindow"], function(items){
		darkmode = items["darkmode"]; if(darkmode == null)darkmode = false; // default false
		fullscreenweb = items["fullscreenweb"]; if(fullscreenweb == null)fullscreenweb = false; // default true
		fullscreenwindow = items["fullscreenwindow"]; if(fullscreenwindow == null)fullscreenwindow = false; // default false
		fullscreenpopup = items["fullscreenpopup"]; if(fullscreenpopup == null)fullscreenpopup = false; // default false
		fullscreenvideo = items["fullscreenvideo"]; if(fullscreenvideo == null)fullscreenvideo = false; // default false
		videoinwindow = items["videoinwindow"]; if(videoinwindow == null)videoinwindow = true; // default true
		videooutwindow = items["videooutwindow"]; if(videooutwindow == null)videooutwindow = false; // default false

		if(fullscreenweb == true)$("fullscreenweb").checked = true;
		if(fullscreenwindow == true)$("fullscreenwindow").checked = true;
		if(fullscreenvideo == true)$("fullscreenvideo").checked = true;
		if(fullscreenpopup == true)$("fullscreenpopup").checked = true;
		if(videoinwindow == true)$("videoinwindow").checked = true;
		if(videooutwindow == true)$("videooutwindow").checked = true;

		// dark mode
		if(darkmode == true){
			document.body.className = "dark";
		}else{
			document.body.className = "light";
		}

		if(optionskipremember){ optionskipremember = items["optionskipremember"]; }
		if(firstDate){ firstDate = items["firstDate"]; }
		if(firstsawrate){ firstsawrate = items["firstsawrate"]; }

		// final
		test();

		// show remember page
		var firstmonth = false;
		var currentDate = new Date().getTime();
		if(firstDate){
			var datestart = firstDate;
			var dateend = datestart + (30 * 24 * 60 * 60 * 1000);
			if(currentDate >= dateend){ firstmonth = false; }else{ firstmonth = true; }
		}else{
			chrome.storage.sync.set({"firstDate": currentDate});
			firstmonth = true;
		}

		if(firstmonth){
			// show nothing
		}else{
			if(optionskipremember != true){
				if(firstsawrate != true){
					materialRateAlert();
					chrome.storage.sync.set({"firstsawrate": true});
				}
			}
		}
	});

	// Detect click / change to save the page and test it.
	var inputs = document.querySelectorAll("input");
	var i;
	var l = inputs.length;
	for(i = 0; i < l; i++){ inputs[i].addEventListener("change", test); inputs[i].addEventListener("change", save_options); }

	$("tab1").addEventListener("click", function(){
		$("basicspanel").className = "";
		$("morepanel").className = "hidden";

		$("tab1").className = "tabbutton tabhighlight";
		$("tab2").className = "tabbutton";
	}, false);

	$("tab2").addEventListener("click", function(){
		$("basicspanel").className = "hidden";
		$("morepanel").className = "";

		$("tab1").className = "tabbutton";
		$("tab2").className = "tabbutton tabhighlight";
	}, false);

	$("btncurrentmaximize").addEventListener("click", function(){
		chrome.runtime.sendMessage({name: "sendcurrentmaximize"});
	});
	$("btnallmaximize").addEventListener("click", function(){
		chrome.runtime.sendMessage({name: "sendallmaximize"});
	});
	$("btncurrentfullscreen").addEventListener("click", function(){
		chrome.runtime.sendMessage({name: "sendcurrentfullscreen"});
	});
	$("btnallfullscreen").addEventListener("click", function(){
		chrome.runtime.sendMessage({name: "sendallfullscreen"});
	});
	$("btncurrentpopup").addEventListener("click", function(){
		chrome.runtime.sendMessage({name: "sendcurrentpopup"});
	});
	$("btnalltabspopup").addEventListener("click", function(){
		chrome.runtime.sendMessage({name: "sendalltabspopup"});
	});

	$("btnoptions").addEventListener("click", function(){ chrome.tabs.create({url: chrome.runtime.getURL("options.html"), active:true}); });
	$("btndonate").addEventListener("click", function(){ chrome.tabs.create({url: linkdonate, active:true}); });

	// rate
	function materialRateAlert(){
		document.getElementById("materialModalRate").className = "show";
		document.getElementById("materialModalRate").setAttribute("aria-disabled", "false");
	}
	function closeMaterialRateAlert(e){
		e.stopPropagation();
		document.getElementById("materialModalRate").className = "hide";
		document.getElementById("materialModalRate").setAttribute("aria-disabled", "true");
	}

	$("materialModalRateButtonOK").addEventListener("click", function(e){
		closeMaterialRateAlert(e, true);
		window.open(writereview); chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});
	});
	$("materialModalRateButtonCANCEL").addEventListener("click", function(e){
		closeMaterialRateAlert(e, false);
		chrome.storage.sync.set({"firstsawrate": false});
	});
});

chrome.storage.onChanged.addListener(function(changes){
	if(changes["atmosvivid"]){
		if(changes["atmosvivid"].newValue == true){
			chrome.tabs.query({}, function(tabs){
				tabs.forEach(function(tab){
					chrome.tabs.sendMessage(tab.id, {action: "goenableatmos"});
				});
			});
		}else{
			chrome.tabs.query({}, function(tabs){
				tabs.forEach(function(tab){
					chrome.tabs.sendMessage(tab.id, {action: "goenableatmos"});
				});
			});
		}
	}
});

function test(){
	if($("fullscreenvideo").checked){
		$("videoinwindow").disabled = false;
		$("videooutwindow").disabled = false;
	}else{
		$("videoinwindow").disabled = true;
		$("videooutwindow").disabled = true;
	}
}