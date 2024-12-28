//================================================
/*

Page Sidebar
Effortlessly open any website in your web browser's sidebar – streamline your workflow instantly!
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
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&list=PLfXHh3TKRb4Z-C2w3SLAY_InRNET-DgI1&rel=0";
var darkmode = false;

var firstdefaultvalues = {};
function defaultgetsettings(){
	// Option default value to read if there is no current value from chrome.storage AND init default value
	chrome.storage.sync.get(["icon", "contextmenus", "searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex", "searchyahoo", "search360", "searchsogou", "searchchatgpt", "searchgemini", "searchwikipedia", "navtop", "navbottom", "navhidden", "typepanelzone", "typepanelcustom", "typepanellasttime", "websitestartname", "websitename1", "websiteurl1", "websitename2", "websiteurl2", "websitename3", "websiteurl3", "opennonebookmarks", "openbrowserbookmarks", "openquickbookmarks", "googlesidepanel", "defaultzoom", "step", "multipletabs", "gobutton", "typehomezone", "typehomecustom", "websitehomepagename"], function(items){
		// find no localstore
		if(items["icon"] == null){
			if(exbrowser == "safari"){
				firstdefaultvalues["icon"] = "/images/icon38.png";
			}else{
				firstdefaultvalues["icon"] = "/images/icon38.png";
			}
		}
		if(items["contextmenus"] == null){ firstdefaultvalues["contextmenus"] = true; }
		if(items["searchgoogle"] == null && items["searchbing"] == null && items["searchduckduckgo"] == null && items["searchbaidu"] == null && items["searchyandex"] == null && items["searchyahoo"] == null && items["search360"] == null && items["searchsogou"] == null && items["searchchatgpt"] == null && items["searchgemini"] == null && items["searchwikipedia"] == null){ firstdefaultvalues["searchgoogle"] = true; firstdefaultvalues["searchbing"] = false; firstdefaultvalues["searchduckduckgo"] = false; firstdefaultvalues["searchbaidu"] = false; firstdefaultvalues["searchyandex"] = false; firstdefaultvalues["searchyahoo"] = false; firstdefaultvalues["search360"] = false; firstdefaultvalues["searchsogou"] = false; firstdefaultvalues["searchchatgpt"] = false; firstdefaultvalues["searchgemini"] = false; firstdefaultvalues["searchwikipedia"] = false; }
		if(items["navtop"] == null && items["navbottom"] == null && items["navhidden"] == null){ firstdefaultvalues["navtop"] = true; firstdefaultvalues["navbottom"] = false; firstdefaultvalues["navhidden"] = false; }
		if(items["websitestartname"] == null){ firstdefaultvalues["websitestartname"] = "https://www.google.com"; }
		if(items["typepanelzone"] == null && items["typepanelcustom"] == null && items["typepanellasttime"] == null){
			firstdefaultvalues["typepanelzone"] = true;
			firstdefaultvalues["typepanelcustom"] = false;
			firstdefaultvalues["typepanellasttime"] = false;
		}
		if(items["websitename1"] == null){ firstdefaultvalues["websitename1"] = "Google"; }
		if(items["websiteurl1"] == null){ firstdefaultvalues["websiteurl1"] = "https://www.google.com"; }
		if(items["websitename2"] == null){ firstdefaultvalues["websitename2"] = "YouTube"; }
		if(items["websiteurl2"] == null){ firstdefaultvalues["websiteurl2"] = "https://www.youtube.com"; }
		if(items["websitename3"] == null){ firstdefaultvalues["websitename3"] = "Developer"; }
		if(items["websiteurl3"] == null){ firstdefaultvalues["websiteurl3"] = "https://www.stefanvd.net"; }
		if(items["opennonebookmarks"] == null && items["openbrowserbookmarks"] == null && items["openquickbookmarks"] == null){
			firstdefaultvalues["opennonebookmarks"] = true;
			firstdefaultvalues["openbrowserbookmarks"] = false;
			firstdefaultvalues["openquickbookmarks"] = false;
		}
		if(items["googlesidepanel"] == null){ firstdefaultvalues["googlesidepanel"] = true; }
		if(items["defaultzoom"] == null){ firstdefaultvalues["defaultzoom"] = 100; }
		if(items["step"] == null){ firstdefaultvalues["step"] = 5; }
		if(items["gobutton"] == null){ firstdefaultvalues["gobutton"] = true; }
		if(items["typehomezone"] == null && items["typehomecustom"] == null){
			firstdefaultvalues["typehomezone"] = true;
			firstdefaultvalues["typehomecustom"] = false;
		}
		if(items["websitehomepagename"] == null){ firstdefaultvalues["websitehomepagename"] = "https://www.google.com"; }

		// Save the init value
		chrome.storage.sync.set(firstdefaultvalues, function(){
			// console.log("Settings saved");
			read_options();
		});
	});
}

// Option to save current value
function save_options(){
	chrome.storage.sync.set({"icon": $("btnpreview").src, "optionskipremember":$("optionskipremember").checked, "contextmenus":$("contextmenus").checked, "searchgoogle": $("searchgoogle").checked, "searchbing": $("searchbing").checked, "searchduckduckgo": $("searchduckduckgo").checked, "searchbaidu": $("searchbaidu").checked, "searchyandex": $("searchyandex").checked, "navtop": $("navtop").checked, "navbottom": $("navbottom").checked, "navhidden": $("navhidden").checked, "typepanelzone": $("typepanelzone").checked, "typepanelcustom": $("typepanelcustom").checked, "typepanellasttime": $("typepanellasttime").checked, "websitestartname": $("websitestartname").value, "opentab": $("opentab").checked, "opencopy": $("opencopy").checked, "opennonebookmarks": $("opennonebookmarks").checked, "openbrowserbookmarks": $("openbrowserbookmarks").checked, "openquickbookmarks": $("openquickbookmarks").checked, "websitename1": $("websitename1").value, "websiteurl1": $("websiteurl1").value, "websitename2": $("websitename2").value, "websiteurl2": $("websiteurl2").value, "websitename3": $("websitename3").value, "websiteurl3": $("websiteurl3").value, "websitename4": $("websitename4").value, "websiteurl4": $("websiteurl4").value, "websitename5": $("websitename5").value, "websiteurl5": $("websiteurl5").value, "websitename6": $("websitename6").value, "websiteurl6": $("websiteurl6").value, "websitename7": $("websitename7").value, "websiteurl7": $("websiteurl7").value, "websitename8": $("websitename8").value, "websiteurl8": $("websiteurl8").value, "websitename9": $("websitename9").value, "websiteurl9": $("websiteurl9").value, "websitename10": $("websitename10").value, "websiteurl10": $("websiteurl10").value, "googlesidepanel": $("googlesidepanel").checked, "zoom":$("zoom").checked, "defaultzoom": $("defaultzoom").value, "step": $("step").value, "multipletabs": $("multipletabs").checked, "navbuttons": $("navbuttons").checked, "gobutton": $("gobutton").checked, "typehomezone": $("typehomezone").checked, "typehomecustom": $("typehomecustom").checked, "websitehomepagename": $("websitehomepagename").value, "preventclose": $("preventclose").checked, "dragnewtab": $("dragnewtab").checked, "mutetab": $("mutetab").checked, "searchyahoo": $("searchyahoo").checked, "search360": $("search360").checked, "searchsogou": $("searchsogou").checked, "searchchatgpt": $("searchchatgpt").checked, "searchgemini": $("searchgemini").checked, "searchwikipedia": $("searchwikipedia").checked});
}

function read_options(){
	// youtube
	$("materialModalYouTubeButtonOK").addEventListener("click", function(e){
		closeMaterialYouTubeAlert(e);
		chrome.storage.sync.set({"firstsawyoutube": true});
	});

	$("materialModalYouTubeButtonCANCEL").addEventListener("click", function(e){
		closeMaterialYouTubeCancel(e);
	});

	// rate
	$("materialModalRate").addEventListener("click", function(e){
		closeMaterialRateAlert(e);
	});
	$("materialModalRateContent").addEventListener("click", function(e){
		e.stopPropagation();
	});
	$("materialModalRateButtonWriteOK").addEventListener("click", function(e){
		closeMaterialRateAlert(e);
		window.open(writereview); $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});
	});
	$("materialModalRateButtonWriteCANCEL").addEventListener("click", function(e){
		closeMaterialRateAlert(e);
		chrome.storage.sync.set({"firstsawrate": false});
	});
	$("materialModalButtonSupportOK").addEventListener("click", function(e){
		closeMaterialRateAlert(e);
		window.open(linksupport);
		chrome.storage.sync.set({"firstsawrate": false});
	});
	$("materialModalButtonSupportCANCEL").addEventListener("click", function(e){
		closeMaterialRateAlert(e);
		chrome.storage.sync.set({"firstsawrate": false});
	});
	$("materialModalRateButtonCANCEL").addEventListener("click", function(e){
		closeMaterialRateAlert(e);
		chrome.storage.sync.set({"firstsawrate": false});
	});

	if(document.querySelector("input[name=\"rating\"]")){
		document.querySelectorAll("input[name=\"rating\"]").forEach((elem) => {
			elem.addEventListener("change", function(event){
				var item = event.target.value;
				if(item == 5 || item == 4){
					// good stars
					$("ratepage0").classList.add("hidden");
					$("ratepage1high").classList.remove("hidden");
				}else if(item == 3 || item == 2 || item == 1){
					// low stars
					$("ratepage0").classList.add("hidden");
					$("ratepage1low").classList.remove("hidden");
				}
			});
		});
	}
	//---

	function showhidemodal(name, visible, status){
		document.getElementById(name).className = visible;
		document.getElementById(name).setAttribute("aria-disabled", status);
		setmetathemepopup(status);
	}

	// rate
	function materialRateAlert(){
		showhidemodal("materialModalRate", "show", "false");
	}
	function closeMaterialRateAlert(e){
		e.stopPropagation();
		showhidemodal("materialModalRate", "hide", "true");
	}
	//---

	// youtube
	function materialYouTubeAlert(){
		showhidemodal("materialModalYouTube", "show", "false");
	}
	function closeMaterialYouTubeCancel(e){
		e.stopPropagation();
		showhidemodal("materialModalYouTube", "hide", "true");
	}
	function closeMaterialYouTubeAlert(e){
		e.stopPropagation();
		window.open(linkyoutube, "_blank");
		showhidemodal("materialModalYouTube", "hide", "true");
	}

	chrome.storage.sync.get(["icon", "firstDate", "contextmenus", "optionskipremember", "firstsawrate", "searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex", "navtop", "navbottom", "navhidden", "typepanelzone", "typepanelcustom", "typepanellasttime", "websitestartname", "opentab", "opencopy", "opennonebookmarks", "openbrowserbookmarks", "openquickbookmarks", "websitename1", "websiteurl1", "websitename2", "websiteurl2", "websitename3", "websiteurl3", "websitename4", "websiteurl4", "websitename5", "websiteurl5", "websitename6", "websiteurl6", "websitename7", "websiteurl7", "websitename8", "websiteurl8", "websitename9", "websiteurl9", "websitename10", "websiteurl10", "googlesidepanel", "zoom", "defaultzoom", "step", "multipletabs", "navbuttons", "gobutton", "typehomezone", "typehomecustom", "websitehomepagename", "preventclose", "dragnewtab", "mutetab", "searchyahoo", "search360", "searchsogou", "searchchatgpt", "searchgemini", "searchwikipedia"], function(items){
		if(items["icon"]){ $("btnpreview").src = items["icon"]; }
		if(items["contextmenus"] == true)$("contextmenus").checked = true;
		if(items["optionskipremember"] == true){ $("optionskipremember").checked = true; }
		if(items["searchgoogle"] == true){ $("searchgoogle").checked = true; }
		if(items["searchbing"] == true){ $("searchbing").checked = true; }
		if(items["searchduckduckgo"] == true){ $("searchduckduckgo").checked = true; }
		if(items["searchbaidu"] == true){ $("searchbaidu").checked = true; }
		if(items["searchyandex"] == true){ $("searchyandex").checked = true; }
		if(items["navtop"] == true){ $("navtop").checked = true; }
		if(items["navbottom"] == true){ $("navbottom").checked = true; }
		if(items["navhidden"] == true){ $("navhidden").checked = true; }
		if(items["typepanelzone"] == true){ $("typepanelzone").checked = true; }
		if(items["typepanelcustom"] == true){ $("typepanelcustom").checked = true; }
		if(items["typepanellasttime"] == true){ $("typepanellasttime").checked = true; }
		if(items["websitestartname"]){ $("websitestartname").value = items["websitestartname"]; }else $("websitestartname").value = "https://www.google.com";
		if(items["opentab"] == true){ $("opentab").checked = true; }
		if(items["opencopy"] == true){ $("opencopy").checked = true; }
		if(items["opennonebookmarks"]){ $("opennonebookmarks").checked = true; }
		if(items["openbrowserbookmarks"]){ $("openbrowserbookmarks").checked = true; }
		if(items["openquickbookmarks"]){ $("openquickbookmarks").checked = true; }
		if(items["websitename1"]){ $("websitename1").value = items["websitename1"]; }
		if(items["websiteurl1"]){ $("websiteurl1").value = items["websiteurl1"]; }
		if(items["websitename2"]){ $("websitename2").value = items["websitename2"]; }
		if(items["websiteurl2"]){ $("websiteurl2").value = items["websiteurl2"]; }
		if(items["websitename3"]){ $("websitename3").value = items["websitename3"]; }
		if(items["websiteurl3"]){ $("websiteurl3").value = items["websiteurl3"]; }
		if(items["websitename4"]){ $("websitename4").value = items["websitename4"]; }
		if(items["websiteurl4"]){ $("websiteurl4").value = items["websiteurl4"]; }
		if(items["websitename5"]){ $("websitename5").value = items["websitename5"]; }
		if(items["websiteurl5"]){ $("websiteurl5").value = items["websiteurl5"]; }
		if(items["websitename6"]){ $("websitename6").value = items["websitename6"]; }
		if(items["websiteurl6"]){ $("websiteurl6").value = items["websiteurl6"]; }
		if(items["websitename7"]){ $("websitename7").value = items["websitename7"]; }
		if(items["websiteurl7"]){ $("websiteurl7").value = items["websiteurl7"]; }
		if(items["websitename8"]){ $("websitename8").value = items["websitename8"]; }
		if(items["websiteurl8"]){ $("websiteurl8").value = items["websiteurl8"]; }
		if(items["websitename9"]){ $("websitename9").value = items["websitename9"]; }
		if(items["websiteurl9"]){ $("websiteurl9").value = items["websiteurl9"]; }
		if(items["websitename10"]){ $("websitename10").value = items["websitename10"]; }
		if(items["websiteurl10"]){ $("websiteurl10").value = items["websiteurl10"]; }
		if(items["googlesidepanel"] == true){ $("googlesidepanel").checked = true; }
		if(items["zoom"] == true){ $("zoom").checked = true; }
		if(items["defaultzoom"]){ $("defaultzoom").value = items["defaultzoom"]; }
		if(items["step"]){ $("step").value = items["step"]; }
		if(items["multipletabs"] == true){ $("multipletabs").checked = true; }
		if(items["navbuttons"] == true){ $("navbuttons").checked = true; }
		if(items["gobutton"] == true){ $("gobutton").checked = true; }
		if(items["typehomezone"] == true){ $("typehomezone").checked = true; }
		if(items["typehomecustom"] == true){ $("typehomecustom").checked = true; }
		if(items["websitehomepagename"]){ $("websitehomepagename").value = items["websitehomepagename"]; }else $("websitehomepagename").value = "https://www.google.com";
		if(items["preventclose"] == true){ $("preventclose").checked = true; }
		if(items["dragnewtab"] == true){ $("dragnewtab").checked = true; }
		if(items["mutetab"] == true){ $("mutetab").checked = true; }
		if(items["searchyahoo"] == true){ $("searchyahoo").checked = true; }
		if(items["search360"] == true){ $("search360").checked = true; }
		if(items["searchsogou"] == true){ $("searchsogou").checked = true; }
		if(items["searchchatgpt"] == true){ $("searchchatgpt").checked = true; }
		if(items["searchgemini"] == true){ $("searchgemini").checked = true; }
		if(items["searchwikipedia"] == true){ $("searchwikipedia").checked = true; }

		// show remember page
		var firstmonth = false;
		var currentDate = new Date().getTime();
		if(items["firstDate"]){
			var datestart = items["firstDate"];
			var dateend = datestart + (30 * 24 * 60 * 60 * 1000);
			if(currentDate >= dateend){ firstmonth = false; }else{ firstmonth = true; }
		}else{
			chrome.storage.sync.set({"firstDate": currentDate});
			firstmonth = true;
		}

		if(firstmonth){
			// show nothing
			$("sectionreviewbox").style.display = "none";
		}else{
			if($("optionskipremember").checked != true){
				$("sectionreviewbox").style.display = "block"; // show now always the banner
				if(items["firstsawrate"] != true){
					window.setTimeout(function(){
						materialRateAlert();
					}, 2500);
					chrome.storage.sync.set({"firstsawrate": true});
				}
			}else{
				$("sectionreviewbox").style.display = "none";
			}
		}

		var firstday = false;
		var startnum = items["firstsawnumber"];
		if($("optionskipremember").checked != true){
			var dateinstall = items["firstDate"];
			var datenextday = dateinstall + (1 * 24 * 60 * 60 * 1000);
			if(currentDate >= datenextday){ firstday = false; }else{ firstday = true; }

			if(firstday){
				// show nothing
			}else{
				// if the rate box is not visible, and never clicked, then show the YouTube channel box
				if(items["firstsawrate"] != true && items["firstsawyoutube"] != true){
					if(typeof startnum == "undefined" || startnum == null){ startnum = 1; }
					if(startnum == 4){
						window.setTimeout(function(){
							materialYouTubeAlert();
						}, 2500);
						startnum = 0;
					}
					startnum += 1;
					chrome.storage.sync.set({"firstsawnumber": startnum});
				}
			}
		}

		// donation bar
		if(devdonate == true){
			$("managed-prefs-banner").className = "hidden";
		}

		// load tab div
		var tabListItems = $("navbar").childNodes;
		var i, l = tabListItems.length;
		for(i = 0; i < l; i++){
			if(tabListItems[i].nodeName == "LI"){
				var tabLink = getFirstChildWithTagName(tabListItems[i], "A");
				var id = getHash(tabLink.getAttribute("data-tab"));
				tabLinks[id] = tabLink;
				contentDivs[id] = document.getElementById(id);
			}
		}

		// Assign onclick events to the tab links, and
		// highlight the first tab
		var tabi = 0;
		var tabid;
		for(tabid in tabLinks){
			tabLinks[tabid].onclick = showTab;
			tabLinks[tabid].onfocus = function(){ this.blur(); };
			if(tabi == 0) tabLinks[tabid].className = "navbar-item-selected";
			tabi++;
		}

		// Hide all content divs except the first
		var contenti = 0;
		var contentid;
		for(contentid in contentDivs){
			if(contenti != 0) contentDivs[contentid].className = "page hidden";
			contenti++;
		}

		// display version number
		var manifestData = chrome.runtime.getManifest();
		$("version_number").innerText = manifestData.version;

		test(); // do the test

	});// chrome storage end
} // end read

// tabel script
var tabLinks = new Array();
var contentDivs = new Array();

function showTab(){
	var selectedId = getHash(this.getAttribute("data-tab"));

	// Highlight the selected tab, and dim all others.
	// Also show the selected content div, and hide all others.
	for(var id in contentDivs){
		if(id == selectedId){
			tabLinks[id].className = "navbar-item-selected";
			contentDivs[id].className = "page";
		}else{
			tabLinks[id].className = "navbar-item";
			contentDivs[id].className = "page hidden";
		}
	}

	// Stop the browser following the link
	return false;
}

function getFirstChildWithTagName(element, tagName){
	for(var i = 0; i < element.childNodes.length; i++){
		if(element.childNodes[i].nodeName == tagName)return element.childNodes[i];
	}
}

function getHash(url){
	var hashPos = url.lastIndexOf("#");
	return url.substring(hashPos + 1);
}

function test(){
	if($("zoom").checked == true){
		$("defaultzoom").disabled = false;
		$("step").disabled = false;
	}else{
		$("defaultzoom").disabled = true;
		$("step").disabled = true;
	}
	if($("multipletabs").checked == true){
		$("preventclose").disabled = false;
		$("dragnewtab").disabled = false;
		$("mutetab").disabled = false;
	}else{
		$("preventclose").disabled = true;
		$("dragnewtab").disabled = true;
		$("mutetab").disabled = true;
	}

	if($("typehomecustom").checked == true){
		$("websitehomepagename").disabled = false;
	}else{
		$("websitehomepagename").disabled = true;
	}

	if($("typepanelcustom").checked == true){
		$("websitestartname").disabled = false;
	}else{
		$("websitestartname").disabled = true;
	}

	if($("openbrowserbookmarks").checked == true){
		chrome.runtime.sendMessage({name: "stefanbookmarkadd"});
	}

	if($("openquickbookmarks").checked == true){
		$("websitename1").disabled = false;
		$("websiteurl1").disabled = false;

		$("websitename2").disabled = false;
		$("websiteurl2").disabled = false;

		$("websitename3").disabled = false;
		$("websiteurl3").disabled = false;

		$("websitename4").disabled = false;
		$("websiteurl4").disabled = false;

		$("websitename5").disabled = false;
		$("websiteurl5").disabled = false;

		$("websitename6").disabled = false;
		$("websiteurl6").disabled = false;

		$("websitename7").disabled = false;
		$("websiteurl7").disabled = false;

		$("websitename8").disabled = false;
		$("websiteurl8").disabled = false;

		$("websitename9").disabled = false;
		$("websiteurl9").disabled = false;

		$("websitename10").disabled = false;
		$("websiteurl10").disabled = false;
	}else{
		$("websitename1").disabled = true;
		$("websiteurl1").disabled = true;

		$("websitename2").disabled = true;
		$("websiteurl2").disabled = true;

		$("websitename3").disabled = true;
		$("websiteurl3").disabled = true;

		$("websitename4").disabled = true;
		$("websiteurl4").disabled = true;

		$("websitename5").disabled = true;
		$("websiteurl5").disabled = true;

		$("websitename6").disabled = true;
		$("websiteurl6").disabled = true;

		$("websitename7").disabled = true;
		$("websiteurl7").disabled = true;

		$("websitename8").disabled = true;
		$("websiteurl8").disabled = true;

		$("websitename9").disabled = true;
		$("websiteurl9").disabled = true;

		$("websitename10").disabled = true;
		$("websiteurl10").disabled = true;
	}
}

function ariacheck(){
	var inputs = document.querySelectorAll("input");
	var i;
	var l = inputs.length;
	for(i = 0; i < l; i++){
		if(inputs[i].getAttribute("role") == "radio" || inputs[i].getAttribute("role") == "checkbox"){
			if(inputs[i].checked == true){
				inputs[i].setAttribute("aria-checked", true);
			}else{
				inputs[i].setAttribute("aria-checked", false);
			}
		}
	}
}

// Current year
function yearnow(){
	var today = new Date(); var y0 = today.getFullYear(); $("yearnow").innerText = y0;
}

function setappearancemode(a, b, c){
	$("dropmenu").className = a;
	document.body.className = b;
	$("headlamp").style.webkitFilter = c;
	$("headlamp").style.filter = c;
	$("loadinglamp").style.webkitFilter = c;
	$("loadinglamp").style.filter = c;
}

function godarkmode(){
	$("dropmenu").className = "hide";
	setappearancemode("hide", "dark", "invert(1) brightness(2)");
}

function golightmode(){
	$("dropmenu").className = "hide";
	setappearancemode("hide", "light", "invert(0)");
}

function seticonstyle(a, b, c){
	$("icondarkauto").style.opacity = a;
	$("icondarkoff").style.opacity = b;
	$("icondarkon").style.opacity = c;
}

function checkdarkmode(){
	chrome.storage.sync.get(["darkmode"], function(items){
		darkmode = items["darkmode"]; if(darkmode == null)darkmode = 2; // default Operating System

		// dark mode
		if(darkmode == 1){
			godarkmode();
			seticonstyle(0, 0, 1);
		}else if(darkmode == 0){
			golightmode();
			seticonstyle(0, 1, 0);
		}else if(darkmode == 2){
			if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
				godarkmode();
			}else{
				golightmode();
			}
			seticonstyle(1, 0, 0);
		}
	});
}

function eventsubmitFunc(selector, callback){
	document.getElementById(selector).addEventListener("submit", function(e){
		e.preventDefault();
		callback();
	});
}

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg){
	// If the received message has the expected format...
	if(msg.text === "receiveallpermissions"){
		// empty ul first
		if($("permullist")){
			var ul = document.getElementById("permullist");
			if(ul){
				while(ul.firstChild){
					ul.removeChild(ul.firstChild);
				}
			}
		}
		var perm = msg.value;
		perm.forEach(function(x){
			if($("permissionlist")){
				if($("permullist") == null){
					var newpermtitle = document.createElement("h4");
					newpermtitle.textContent = chrome.i18n.getMessage("permissionrequired");
					$("permissionlist").appendChild(newpermtitle);

					var newpermul = document.createElement("ul");
					newpermul.setAttribute("id", "permullist");
					$("permissionlist").appendChild(newpermul);
				}

				var newperm = document.createElement("li");
				$("permullist").appendChild(newperm);

				var newpermspan = document.createElement("span");
				newpermspan.textContent = x + ": ";
				newperm.appendChild(newpermspan);

				var textperm = "";
				var newpermspandes = document.createElement("span");
				if(x == "activeTab"){ textperm = chrome.i18n.getMessage("permissionactivetab"); }else if(x == "contextMenus"){ textperm = chrome.i18n.getMessage("permissioncontextmenu"); }else if(x == "storage"){ textperm = chrome.i18n.getMessage("permissionstorage"); }else if(x == "tabs"){ textperm = chrome.i18n.getMessage("permissiontabs"); }else if(x == "scripting"){ textperm = chrome.i18n.getMessage("permissionscripting"); }else if(x == "bookmarks"){ textperm = chrome.i18n.getMessage("permissionbookmarks"); }else if(x == "sidePanel"){ textperm = chrome.i18n.getMessage("permissionsidepanel"); }else if(x == "declarativeNetRequestWithHostAccess"){ textperm = chrome.i18n.getMessage("permissionhostaccess"); }
				newpermspandes.textContent = textperm;
				newpermspandes.className = "item";
				newperm.appendChild(newpermspandes);
			}
		});
	}
});

function setmetatheme(a){
	const metas = document.getElementsByTagName("meta");
	var darktheme;
	var lighttheme;

	if(a == true){
		// top status bar color => if side bar is open
		darktheme = "#1c1c1c";
		lighttheme = "#f5f5f5";
	}else{
		darktheme = "#232323";
		lighttheme = "#ffffff";
	}

	let i, l = metas.length;
	for(i = 0; i < l; i++){
		if(metas[i].getAttribute("name") == "theme-color"){
			if(metas[i].getAttribute("media")){
				if(metas[i].getAttribute("media") == "(prefers-color-scheme: light)"){
					metas[i].setAttribute("content", lighttheme);
				}else if(metas[i].getAttribute("media") == "(prefers-color-scheme: dark)"){
					metas[i].setAttribute("content", darktheme);
				}
			}
		}
	}
}

function setmetathemepopup(a){
	const metas = document.getElementsByTagName("meta");
	var darktheme;
	var lighttheme;

	if(a == true){
		// top status bar color => if popup is open
		darktheme = "#111111";
		lighttheme = "#7f7f7f";
	}else{
		darktheme = "#232323";
		lighttheme = "#ffffff";
	}

	let i, l = metas.length;
	for(i = 0; i < l; i++){
		if(metas[i].getAttribute("name") == "theme-color"){
			if(metas[i].getAttribute("media")){
				if(metas[i].getAttribute("media") == "(prefers-color-scheme: light)"){
					metas[i].setAttribute("content", lighttheme);
				}else if(metas[i].getAttribute("media") == "(prefers-color-scheme: dark)"){
					metas[i].setAttribute("content", darktheme);
				}
			}
		}
	}
}

/* Option page body action */
// Read current value settings
window.addEventListener("load", function(){
	// remove loading screen
	$("loading").style.display = "none";
});

document.addEventListener("DOMContentLoaded", domcontentloaded);

function domcontentloaded(){
	checkdarkmode();
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(){
		checkdarkmode();
	});

	// Add the YouTube player
	$("dont-turn-off-the-lights").src = youtubeembed;
	defaultgetsettings();
	yearnow();

	// Remove remember
	var sharetext = chrome.i18n.getMessage("sharetextd");
	var stefanvdurl = linkproduct;
	var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);

	if($("shareboxyoutube")){
		$("shareboxyoutube").addEventListener("click", function(){ window.open(linkyoutube, "_blank"); });
	}
	if($("shareboxfacebook")){
		$("shareboxfacebook").addEventListener("click", function(){ window.open("https://www.facebook.com/sharer.php?u=" + stefanvdurl + "&t=" + sharetext + "", "Share to Facebook", "width=600,height=460,menubar=no,location=no,status=no"); });
	}
	if($("shareboxx")){
		$("shareboxx").addEventListener("click", function(){ window.open("https://x.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", "Share to X", "width=600,height=460,menubar=no,location=no,status=no"); });
	}

	var isMenuClick = false;
	var menu = document.getElementById("dotmenu");
	document.addEventListener("click", ()=>{
		if(!isMenuClick){
			// Hide the menu here
			$("dropmenu").className = "hide";
		}
		// Reset isMenuClick
		isMenuClick = false;
	});
	menu.addEventListener("click", ()=>{
		isMenuClick = true;
	});

	$("dotmenu").addEventListener("click", function(){
		if($("dropmenu").className == "show"){
			$("dropmenu").className = "hide";
		}else{
			$("dropmenu").className = "show";
		}
	});

	$("darkpanel").addEventListener("click", function(){
		$("menuToggle").click();
	});

	$("titleex").addEventListener("click", function(){
		window.open(linkdeveloperwebsite);
	});

	$("btnsupport").addEventListener("click", function(){
		window.open(linksupport); $("dropmenu").className = "hide";
	});

	$("btnactivedarkmodeauto").addEventListener("click", function(){
		if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
			godarkmode();
		}else{
			golightmode();
		}
		seticonstyle(1, 0, 0);
		chrome.storage.sync.set({"darkmode":2});
	});

	$("btnactivedarkmodeoff").addEventListener("click", function(){
		golightmode();
		seticonstyle(0, 1, 0);
		chrome.storage.sync.set({"darkmode":0});
	});

	$("btnactivedarkmodeon").addEventListener("click", function(){
		godarkmode();
		seticonstyle(0, 0, 1);
		chrome.storage.sync.set({"darkmode":1});
	});

	// promotion
	$("promotext").innerText = chrome.i18n.getMessage("donatetext");
	$("spnpromoaction").innerText = chrome.i18n.getMessage("donatecalltoaction");
	$("btnpromoaction").addEventListener("click", function(){ window.open(linkdonate); });

	// Detect click / change to save the page and test it.
	var inputs = document.querySelectorAll("input");
	var i;
	var l = inputs.length;
	for(i = 0; i < l; i++){ inputs[i].addEventListener("change", test); inputs[i].addEventListener("change", ariacheck); inputs[i].addEventListener("change", save_options); }

	var select = document.querySelectorAll("select");
	var j;
	var m = select.length;
	for(j = 0; j < m; j++){ select[j].addEventListener("change", test); select[j].addEventListener("change", ariacheck); select[j].addEventListener("change", save_options); }

	// bookmark
	var bookmarkname = document.getElementsByClassName("bookmarkname");
	var f, x = bookmarkname.length;
	for(r = 0, x; f < x; f++){
		bookmarkname[f].addEventListener("change", save_options);
	}
	var bookmarkurl = document.getElementsByClassName("bookmarkurl");
	var g, w = bookmarkurl.length;
	for(r = 0, w; g < w; g++){
		bookmarkurl[g].addEventListener("change", save_options);
	}

	// show all the active permissions in a list
	chrome.runtime.sendMessage({name: "getallpermissions"});

	// Close yellow bar
	$("managed-prefs-text-close").addEventListener("click", function(){ $("managed-prefs-banner").style.display = "none"; });
	$("p0").addEventListener("click", function(){
		var custombrowser = "";
		if(exbrowser == "safari"){ custombrowser = "/images/icon38.png"; }else{ custombrowser = "/images/icon38.png"; }
		setpreviewicon(custombrowser);
	});
	$("p1").addEventListener("click", function(){
		var custombrowser = "";
		custombrowser = "/images/icon38white.png";
		setpreviewicon(custombrowser);
	});

	function setpreviewicon(a){
		document.images["btnpreview"].setAttribute("data-icon", a); document.images["btnpreview"].src = a; save_options();
	}

	// save browser icon styles
	var buttoncolor = document.getElementsByClassName("buttoncolor");
	var r, v = buttoncolor.length;
	for(r = 0, v; r < v; r++){
		buttoncolor[r].addEventListener("click", save_options);
	}

	var guidekb = true;
	function memguide(){
		if(guidekb == true){
			// already visible
		}else{
			$("managed-prefs-banner").style.display = "";
		}
	}

	function mobilecheck(){
		if(window.innerWidth < 480){ $("menuToggle").click(); }
	}

	$("reveal-menu").addEventListener("click", function(){
		if(this.checked == true){
			setmetatheme(true);
		}else{
			setmetatheme(false);
		}
	});

	$("removepermissionbookmark").addEventListener("click", function(){
		chrome.permissions.remove({
			permissions: ["bookmarks"]
		}, function(removed){
			if(removed){
				// The permissions have been removed.
				var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
				window.alert(txtpermission);

				// set to default off
				$("opennonebookmarks").checked = true;
				$("openbrowserbookmarks").checked = false;
				$("openquickbookmarks").checked = false;
				save_options();
			}else{
				// The permissions have not been removed (e.g., you tried to remove
				// required permissions).
				var txtpermissionnot = chrome.i18n.getMessage("wpermissionnotremoved");
				window.alert(txtpermissionnot);
			}
		});
	});

	// Save KB download
	$("tabbasic").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); OFFworkaroundbugfromsafari(); $("welcomeguide").src = ""; memguide(); guidekb = true; mobilecheck(); });
	$("tabdesign").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = ""; memguide(); guidekb = true; mobilecheck(); });
	$("tabadvan").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = ""; memguide(); guidekb = true; mobilecheck(); });
	$("tabguide").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = linkguide; $("managed-prefs-banner").style.display = "none"; guidekb = false; mobilecheck(); });
	$("tabhelp").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = ""; memguide(); guidekb = true; mobilecheck(); });

	$("buttonreportissue").addEventListener("click", function(){ window.open(linksupport); });
	$("buttonchangelog").addEventListener("click", function(){ window.open(linkchangelog); });
	$("buttontranslateme").addEventListener("click", function(){ window.open(linktranslate); });

	// scroll to top
	function Scrolltotop(){ $("mainview").scrollTop = 0; }

	// remove all videos
	function ONworkaroundbugpreview(){ $("dont-turn-off-the-lights").src = ""; }

	// add a video
	function OFFworkaroundbugfromsafari(){
		$("dont-turn-off-the-lights").src = youtubeembed;
	}

	// Add website
	eventsubmitFunc("formwebsite1", save_options);
	eventsubmitFunc("formwebsite2", save_options);
	eventsubmitFunc("formwebsite3", save_options);
	eventsubmitFunc("formwebsite4", save_options);
	eventsubmitFunc("formwebsite5", save_options);
	eventsubmitFunc("formwebsite6", save_options);
	eventsubmitFunc("formwebsite7", save_options);
	eventsubmitFunc("formwebsite8", save_options);
	eventsubmitFunc("formwebsite9", save_options);
	eventsubmitFunc("formwebsite10", save_options);

	// Reset settings
	$("resetbrowserextension").addEventListener("click", function(){ chrome.storage.sync.clear(); chrome.runtime.sendMessage({name: "bckreload"}); location.reload(); });

	// Review box
	$("war").addEventListener("click", function(){ window.open(writereview, "_blank"); $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });
	$("nt").addEventListener("click", function(){ $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });

	// search
	function emptysearch(input){
		pageinsearch = false;
		input.blur();

		var sections = document.getElementsByTagName("section");
		var x;
		var l = sections.length;
		for(x = 0; x < l; x++){
			var section = sections[x];
			section.classList.remove("searchfoundnothing");
		}

		// set view back to the current selected tab
		// and hide back all videos
		var y = document.getElementsByClassName("navbar-item-selected");
		y[0].click();
	}

	function textsearch(input){
		if(pageinsearch == false){
			pageinsearch = true;
			// load all the videos
			OFFworkaroundbugfromsafari();
		}

		// receive the total tab pages
		var tabListItems = $("navbar").childNodes;
		var tabListi;
		var tabListl = tabListItems.length;
		for(tabListi = 0; tabListi < tabListl; tabListi++){
			if(tabListItems[tabListi].nodeName == "LI"){
				var tabLink = getFirstChildWithTagName(tabListItems[tabListi], "A");
				var id = getHash(tabLink.getAttribute("data-tab"));
				contentDivs[id] = document.getElementById(id);
			}
		}

		// show all tab pages
		var showaltabid;
		for(showaltabid in contentDivs){
			if(showaltabid != "tab3"){
				if((contentDivs[showaltabid])){
					contentDivs[showaltabid].className = "page";
				}
			}
		}
		//---
		var searchword = input.value;

		var allsections = document.getElementsByTagName("section");
		var sectionsx;
		var sectionsl = allsections.length;
		for(sectionsx = 0; sectionsx < sectionsl; sectionsx++){
			var partsection = allsections[sectionsx];
			var content = partsection.innerHTML;

			if(content.search(new RegExp(searchword, "i")) < 1){
				partsection.classList.add("searchfoundnothing");
			}else{
				partsection.classList.remove("searchfoundnothing");
			}
		}

		// hide the h2 if there is no sections visible
		var pages = document.getElementsByClassName("page");
		var z;
		var tabpagelength = pages.length;
		for(z = 0; z < tabpagelength; z++){
			var tabsections = pages[z].getElementsByTagName("section");
			var countnothingcheck = 0;
			var w;
			var q = tabsections.length;
			for(w = 0; w < q; w++){
				var currenttabsection = tabsections[w];
				if(currenttabsection.classList.contains("searchfoundnothing")){
					countnothingcheck += 1;
				}
			}
			if(countnothingcheck == tabsections.length){
				// total sections with nothing inside is the same as all the section -> hide the page
				pages[z].classList.add("searchfoundnothing");
			}else{
				pages[z].classList.remove("searchfoundnothing");
			}
		}
	}
	var pageinsearch = false;
	function OnSearch(input){
		if(input.value == ""){
			emptysearch(input);
		}else{
			textsearch(input);
		}
	}

	if(document.getElementById("appsearch")){
		document.getElementById("appsearch").addEventListener("search", function(){ OnSearch(this); }, false);
		document.getElementById("appsearch").addEventListener("input", function(){ OnSearch(this); }, false);
		document.getElementById("btnsearchicon").addEventListener("input", function(){ OnSearch(this); }, false);
		document.getElementById("appsearch").placeholder = chrome.i18n.getMessage("searchplaceholder");
	}

}