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
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&list=PLfXHh3TKRb4ZRrIhSRo6cWEJVeS3_M5Yb&rel=0";
var darkmode = false;

function defaultgetsettings(){
	read_options();
}

// Option to save current value
function save_options(){
	chrome.runtime.sendMessage({name: "getallpermissions"});

	var websitezoomBox = $("websitezoomBox");
	var websitezoomnumberBox = $("websitezoomnumberBox");
	var websitezoom = {};
	var iw, wl = websitezoomBox.length;
	for(iw = 0; iw < wl; iw++){
		var getwznumber = websitezoomnumberBox.options[iw].text;
		websitezoom[websitezoomBox.options[iw].value] = getwznumber;
	}
	var websitepresetBox = $("websitepresetBox");
	var websitepresetnumberBox = $("websitepresetnumberBox");
	var websitepreset = {};
	var pw, pl = websitepresetBox.length;

	for(pw = 0; pw < pl; pw++){
		var getwpnumber = websitepresetnumberBox.options[pw].text;
		var key = websitepresetBox.options[pw].value;
		// Check if the key already exists in the object
		if(websitepreset[key]){
			// If the key exists, add the new getwpnumber to the existing array
			websitepreset[key].push(getwpnumber);
		}else{
			// If the key doesn't exist, create a new array with the current getwpnumber
			websitepreset[key] = [getwpnumber];
		}
	}

	var screenzoomBox = $("screenzoomBox");
	var screenzoomnumberBox = $("screenzoomnumberBox");
	var screenzoom = {};
	var screenzoomi;
	var screenzooml = screenzoomBox.length;
	for(screenzoomi = 0; screenzoomi < screenzooml; screenzoomi++){
		var getsnumber = screenzoomnumberBox.options[screenzoomi].text;
		screenzoom[screenzoomBox.options[screenzoomi].value] = getsnumber;
	}

	var selectElement = document.getElementById("websitelevelnumberBox");
	var websitelevel = [];
	for(var i = 0; i < selectElement.length; i++){
		websitelevel.push(selectElement[i].value);
	}

	chrome.storage.sync.set({"icon": $("btnpreview").src, "allzoom": $("allzoom").checked, "optionskipremember": $("optionskipremember").checked, "contextmenus": $("contextmenus").checked, "badge": $("badge").checked, "steps": $("steps").value, "lightcolor": $("lightcolor").value, "zoomchrome": $("zoomchrome").checked, "zoomweb": $("zoomweb").checked, "websitezoom": JSON.stringify(websitezoom), "zoomdoubleclick": $("zoomdoubleclick").checked, "zoomoutdoubleclick": $("zoomoutdoubleclick").checked, "zoomnewsingleclick": $("zoomnewsingleclick").checked, "zoomsingleclick": $("zoomsingleclick").checked, "zoommousescroll": $("zoommousescroll").checked, "zoommousebuttonleft": $("zoommousebuttonleft").checked, "zoommousebuttonright": $("zoommousebuttonright").checked, "zoommousescrollup": $("zoommousescrollup").checked, "zoommousescrolldown": $("zoommousescrolldown").checked, "smallpopup": $("smallpopup").checked, "largepopup": $("largepopup").checked, "modernpopup": $("modernpopup").checked, "zoombydomain": $("zoombydomain").checked, "zoombypage": $("zoombypage").checked, "allzoomvalue": $("allzoomvalue").value / 100, "defaultallscreen": $("defaultallscreen").checked, "defaultsinglescreen": $("defaultsinglescreen").checked, "screenzoom": JSON.stringify(screenzoom), "zoomfont": $("zoomfont").checked, "zoommagcircle": $("zoommagcircle").checked, "zoommagsquare": $("zoommagsquare").checked, "zoommagszoomlevel": $("zoommagszoomlevel").value, "zoommagszoomsize": $("zoommagszoomsize").value, "contexta": $("contexta").checked, "contextb": $("contextb").checked, "contextc": $("contextc").checked, "websitepreset": JSON.stringify(websitepreset), "prezoombutton": $("prezoombutton").checked, "websitelevel": websitelevel, "ignoreset": $("ignoreset").checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(["icon", "zoomchrome", "zoomweb", "zoommousebuttonleft", "zoommousebuttonright", "zoommousescrollup", "zoommousescrolldown", "zoombydomain", "zoombypage", "defaultallscreen", "defaultsinglescreen", "zoomfont", "zoomdoubleclick", "zoomoutdoubleclick", "zoomnewsingleclick", "zoomsingleclick", "zoommagcircle", "zoommagsquare", "contexta", "contextb", "contextc", "smallpopup", "largepopup", "modernpopup"], function(items){
	// find no localstore
	if(items["icon"] == null){
		if(exbrowser == "safari"){
			firstdefaultvalues["icon"] = "/images/iconstick38safari.png";
		}else{
			firstdefaultvalues["icon"] = "/images/iconstick38.png";
		}
	}
	if(items["zoomchrome"] == null && items["zoomweb"] == null && items["zoomfont"] == null){ firstdefaultvalues["zoomweb"] = true; firstdefaultvalues["zoomchrome"] = false; firstdefaultvalues["zoomfont"] = false; }
	if(items["zoommousebuttonleft"] == null && items["zoommousebuttonright"] == null){ firstdefaultvalues["zoommousebuttonleft"] = true; firstdefaultvalues["zoommousebuttonright"] = false; }
	if(items["zoommousescrollup"] == null && items["zoommousescrolldown"] == null){ firstdefaultvalues["zoommousescrollup"] = true; firstdefaultvalues["zoommousescrolldown"] = false; }
	if(items["zoombydomain"] == null && items["zoombypage"] == null){ firstdefaultvalues["zoombydomain"] = true; firstdefaultvalues["zoombypage"] = false; }
	if(items["defaultallscreen"] == null && items["defaultsinglescreen"] == null){ firstdefaultvalues["defaultallscreen"] = true; firstdefaultvalues["defaultsinglescreen"] = false; }
	if(items["zoomdoubleclick"] == null && items["zoomoutdoubleclick"] == null && items["zoomnewsingleclick"] == null && items["zoomsingleclick"] == null){ firstdefaultvalues["zoomdoubleclick"] = false; firstdefaultvalues["zoomoutdoubleclick"] = false; firstdefaultvalues["zoomnewsingleclick"] = false; firstdefaultvalues["zoomsingleclick"] = true; }
	if(items["zoommagcircle"] == null && items["zoommagsquare"] == null){ firstdefaultvalues["zoommagcircle"] = true; firstdefaultvalues["zoommagsquare"] = false; }
	if(items["contexta"] == null && items["contextb"] == null && items["contextc"] == null){ firstdefaultvalues["contexta"] = true; firstdefaultvalues["contextb"] = false; firstdefaultvalues["contextc"] = false; }
	if(items["smallpopup"] == null && items["largepopup"] == null && items["modernpopup"] == null){ firstdefaultvalues["smallpopup"] = false; firstdefaultvalues["largepopup"] = false; firstdefaultvalues["modernpopup"] = true; }
	// find no localstore lightimage
	// Save the init value
	chrome.storage.sync.set(firstdefaultvalues, function(){
		// console.log('Settings saved');
	});
});

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

	chrome.storage.sync.get(["firstDate", "icon", "optionskipremember", "countremember", "allzoom", "websitezoom", "allzoomvalue", "contextmenus", "badge", "steps", "lightcolor", "zoomweb", "zoomchrome", "zoomdoubleclick", "zoomoutdoubleclick", "zoomnewsingleclick", "zoomsingleclick", "zoommousescroll", "zoommousebuttonleft", "zoommousebuttonright", "zoommousescrollup", "zoommousescrolldown", "smallpopup", "largepopup", "modernpopup", "zoombydomain", "zoombypage", "defaultallscreen", "defaultsinglescreen", "screenzoom", "firstsawrate", "zoomfont", "zoommagcircle", "zoommagsquare", "zoommagszoomlevel", "zoommagszoomsize", "contexta", "contextb", "contextc", "websitepreset", "prezoombutton", "websitelevel", "ignoreset"], function(items){
		if(items["icon"]){ $("btnpreview").src = items["icon"]; }
		if(items["allzoomvalue"]){ $("allzoomvalue").value = Math.round(items["allzoomvalue"] * 100); $("slider").value = Math.round(items["allzoomvalue"] * 100); }else{ $("allzoomvalue").value = 100; $("slider").value = 100; }
		if(items["steps"]){ $("steps").value = items["steps"]; }else $("steps").value = 10;
		if(items["lightcolor"]){ $("lightcolor").value = items["lightcolor"]; }else $("lightcolor").value = "#3cb4fe";
		if(items["allzoom"] == true)$("allzoom").checked = true;
		if(items["optionskipremember"] == true)$("optionskipremember").checked = true;
		if(items["contextmenus"] == true)$("contextmenus").checked = true;
		if(items["badge"] == true)$("badge").checked = true;
		if(items["zoomchrome"] == true){ $("zoomchrome").checked = true; $("zoomweb").checked = false; }
		if(items["zoomweb"] == true){ $("zoomweb").checked = true; $("zoomchrome").checked = false; }
		if(items["zoomdoubleclick"] == true)$("zoomdoubleclick").checked = true;
		if(items["zoomoutdoubleclick"] == true)$("zoomoutdoubleclick").checked = true;
		if(items["zoommousescroll"] == true)$("zoommousescroll").checked = true;
		if(items["zoommousebuttonleft"] == true)$("zoommousebuttonleft").checked = true;
		if(items["zoommousebuttonright"] == true)$("zoommousebuttonright").checked = true;
		if(items["zoommousescrollup"] == true)$("zoommousescrollup").checked = true;
		if(items["zoommousescrolldown"] == true)$("zoommousescrolldown").checked = true;
		if(items["zoombydomain"] == true)$("zoombydomain").checked = true;
		if(items["zoombypage"] == true)$("zoombypage").checked = true;
		if(items["defaultallscreen"] == true)$("defaultallscreen").checked = true;
		if(items["defaultsinglescreen"] == true)$("defaultsinglescreen").checked = true;
		if(items["zoomfont"] == true)$("zoomfont").checked = true;
		if(items["zoomsingleclick"] == true)$("zoomsingleclick").checked = true;
		if(items["zoomnewsingleclick"] == true)$("zoomnewsingleclick").checked = true;
		if(items["zoommagcircle"] == true)$("zoommagcircle").checked = true;
		if(items["zoommagsquare"] == true)$("zoommagsquare").checked = true;
		if(items["zoommagszoomlevel"]){ $("zoommagszoomlevel").value = items["zoommagszoomlevel"]; }else $("zoommagszoomlevel").value = 3;
		if(items["zoommagszoomsize"]){ $("zoommagszoomsize").value = items["zoommagszoomsize"]; }else $("zoommagszoomsize").value = 200;
		if(items["contexta"] == true)$("contexta").checked = true;
		if(items["contextb"] == true)$("contextb").checked = true;
		if(items["contextc"] == true)$("contextc").checked = true;
		if(items["smallpopup"] == true)$("smallpopup").checked = true;
		if(items["largepopup"] == true)$("largepopup").checked = true;
		if(items["modernpopup"] == true)$("modernpopup").checked = true;
		if(items["prezoombutton"] == true)$("prezoombutton").checked = true;
		if(items["ignoreset"] == true)$("ignoreset").checked = true;

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
			$("donateproject").className = "hidden";
		}

		// zoom website
		var websitezoom = items["websitezoom"];
		if(typeof websitezoom == "undefined" || websitezoom == null){
			websitezoom = JSON.stringify({"https://www.example.com": ["90"], "https://www.nytimes.com": ["85"]});
		}

		if(typeof websitezoom == "string"){
			websitezoom = JSON.parse(websitezoom);
			var atbbuf = [];
			for(var domain in websitezoom)
				atbbuf.push(domain);
			atbbuf.sort();

			var isite;
			var lsite = atbbuf.length;
			for(isite = 0; isite < lsite; isite++){
				appendToListBox("websitezoomBox", atbbuf[isite], "websitezoomnumberBox", websitezoom["" + atbbuf[isite] + ""]);
			}
		}

		// context menu website preset
		var websitepreset = items["websitepreset"];
		if(typeof websitepreset == "undefined" || websitepreset == null){
			websitepreset = JSON.stringify({"https://www.google.com": ["112", "100", "88"]});
		}

		if(typeof websitepreset === "string"){
			websitepreset = JSON.parse(websitepreset);
			var sortedDomains = Object.keys(websitepreset).sort();

			for(var jsite = 0; jsite < sortedDomains.length; jsite++){
				var pdomain = sortedDomains[jsite];
				var values = websitepreset[pdomain];

				// Append each option to the list box
				var p;
				var pl = values.length;
				for(p = 0; p < pl; p++){
					appendToListBox("websitepresetBox", pdomain, "websitepresetnumberBox", values[p]);
				}
			}
		}

		// screen
		var screenzoom = items["screenzoom"];
		if(typeof screenzoom == "undefined" || screenzoom == null){
			screenzoom = JSON.stringify({"1440x900": ["90"], "3000x2000": ["90"], "2560x1600": ["110"]});
		}

		if(typeof screenzoom == "string"){
			screenzoom = JSON.parse(screenzoom);
			var satbbuf = [];
			for(var sdomain in screenzoom)
				satbbuf.push(sdomain);
			satbbuf.sort();

			var webi;
			var webl = satbbuf.length;
			for(webi = 0; webi < webl; webi++){
				appendToListBox("screenzoomBox", satbbuf[webi], "screenzoomnumberBox", screenzoom["" + satbbuf[webi] + ""]);
			}
		}

		// predefined zoom buttons
		var websitelevel = items["websitelevel"];
		if(typeof websitelevel == "undefined" || websitelevel == null){
			websitelevel = ["85", "115", "123"];
		}
		for(let i = 0; i < websitelevel.length; i++){
			appendToListBox("websitelevelnumberBox", parseInt(websitelevel[i]));
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

function appendToListBox(boxId, text, boxZd, zoomnumber){
	var elt = document.createElement("option");
	elt.text = text;
	elt.value = text;
	$(boxId).add(elt, null);

	if(boxZd != null){
		var phelt = document.createElement("option");
		phelt.text = zoomnumber;
		phelt.value = text;
		$(boxZd).add(phelt, null);
	}
}

// websitezoom
function websitezoomchangeurl(){
	var selwzv = $("websitezoomBox").selectedIndex;
	$("websitezoomnumberBox").selectedIndex = selwzv;
}

function websitezoomchangenumberl(){
	var selwzv = $("websitezoomnumberBox").selectedIndex;
	$("websitezoomBox").selectedIndex = selwzv;
}

function websitezoomadd(){
	var domain = $("websitezoomname").value;
	var number = $("websitezoomnumber").value;
	if(domain == ""){ return; }
	if(number == ""){ return; }

	// Check if the domain already exists in the list
	var listBox = document.getElementById("websitezoomBox");
	var options = listBox.options;
	for(var i = 0; i < options.length; i++){
		if(options[i].value.toLowerCase() === domain.toLowerCase()){
			var i18ndomainexist = chrome.i18n.getMessage("domainexist");
			alert(i18ndomainexist);
			return;
		}
	}

	appendToListBox("websitezoomBox", domain, "websitezoomnumberBox", number);
	ariacheck();
	save_options();
}

function websitezoomremoveSelectedExcludedDomain(){
	var websitezoomBox = $("websitezoomBox");
	var websitezoomnumberBox = $("websitezoomnumberBox");
	for(var i = websitezoomBox.length - 1; i >= 0; i--){
		if(websitezoomBox.options[i].selected){
			websitezoomBox.remove(i);
			websitezoomnumberBox.remove(i);
		}
	}
	ariacheck();
	save_options();
}

// websitepreset
function websitepresetchangeurl(){
	var selwzv = $("websitepresetBox").selectedIndex;
	$("websitepresetnumberBox").selectedIndex = selwzv;
}

function websitepresetchangenumberl(){
	var selwzv = $("websitepresetnumberBox").selectedIndex;
	$("websitepresetBox").selectedIndex = selwzv;
}

function websitepresetadd(){
	var domain = $("websitepresetname").value;
	var number = $("websitepresetnumber").value;
	if(domain == ""){ return; }
	if(number == ""){ return; }

	// Check if the domain already exists in the list
	var listBox = document.getElementById("websitepresetBox");
	var numberBox = document.getElementById("websitepresetnumberBox");
	var noptions = numberBox.options;
	var options = listBox.options;
	for(var i = 0; i < options.length; i++){
		if((options[i].value.toLowerCase() === domain.toLowerCase()) && (parseInt(noptions[i].innerText) === parseInt(number))){
			var i18ndomainexist = chrome.i18n.getMessage("domainexist");
			alert(i18ndomainexist);
			return;
		}
	}

	appendToListBox("websitepresetBox", domain, "websitepresetnumberBox", number);
	ariacheck();
	save_options();
}

function websitepresetremoveSelectedExcludedDomain(){
	var websitepresetBox = $("websitepresetBox");
	var websitepresetnumberBox = $("websitepresetnumberBox");
	for(var i = websitepresetBox.length - 1; i >= 0; i--){
		if(websitepresetBox.options[i].selected){
			websitepresetBox.remove(i);
			websitepresetnumberBox.remove(i);
		}
	}
	ariacheck();
	save_options();
}

// screen
function screenzoomchangeurl(){
	var selwzv = $("screenzoomBox").selectedIndex;
	$("screenzoomnumberBox").selectedIndex = selwzv;
}

function screenzoomchangenumberl(){
	var selwzv = $("screenzoomnumberBox").selectedIndex;
	$("screenzoomBox").selectedIndex = selwzv;
}

function screenzoomadd(){
	var domain = $("screenzoomname").value;
	var number = $("screenzoomnumber").value;
	if(domain == ""){ return; }
	if(number == ""){ return; }
	appendToListBox("screenzoomBox", domain, "screenzoomnumberBox", number);
	ariacheck();
	save_options();
}

function screenzoomremoveSelectedExcludedDomain(){
	var screenzoomBox = $("screenzoomBox");
	var screenzoomnumberBox = $("screenzoomnumberBox");
	for(var i = screenzoomBox.length - 1; i >= 0; i--){
		if(screenzoomBox.options[i].selected){
			screenzoomBox.remove(i);
			screenzoomnumberBox.remove(i);
		}
	}
	ariacheck();
	save_options();
}

function levelzoomadd(){
	var number = $("websitelevelnumber").value;
	if(number == ""){ return; }
	appendToListBox("websitelevelnumberBox", number);
	ariacheck();
	save_options();
}

function levelzoomremoveSelectedExcludedDomain(){
	var websitelevelnumberBox = document.getElementById("websitelevelnumberBox");
	for(var i = websitelevelnumberBox.length - 1; i >= 0; i--){
		if(websitelevelnumberBox.options[i].selected)
			websitelevelnumberBox.remove(i);
	}
	save_options();
}

function test(){
	if($("zoomchrome").checked){
		$("ignoreset").disabled = false;
	}else{
		$("ignoreset").disabled = true;
	}

	if($("allzoom").checked){
		$("websitezoomBox").disabled = true;
		$("websitezoomnumberBox").disabled = true;
		$("websitezoomname").disabled = true;
		$("websitezoomnumber").disabled = true;
		$("websitezoomaddbutton").disabled = true;
		$("websitezoomremovebutton").disabled = true;
		$("zoombydomain").disabled = true;
		$("zoombypage").disabled = true;
	}else{
		$("websitezoomBox").disabled = false;
		$("websitezoomnumberBox").disabled = false;
		$("websitezoomname").disabled = false;
		$("websitezoomnumber").disabled = false;
		$("websitezoomaddbutton").disabled = false;
		$("websitezoomremovebutton").disabled = false;
		$("zoombydomain").disabled = false;
		$("zoombypage").disabled = false;
	}
	if($("defaultallscreen").checked){
		$("screenzoomBox").disabled = true;
		$("screenzoomnumberBox").disabled = true;
		$("screenzoomname").disabled = true;
		$("screenzoomnumber").disabled = true;
		$("screenzoomaddbutton").disabled = true;
		$("screenzoomremovebutton").disabled = true;
		$("detectscreensize").disabled = true;
	}else{
		$("screenzoomBox").disabled = false;
		$("screenzoomnumberBox").disabled = false;
		$("screenzoomname").disabled = false;
		$("screenzoomnumber").disabled = false;
		$("screenzoomaddbutton").disabled = false;
		$("screenzoomremovebutton").disabled = false;
		$("detectscreensize").disabled = false;
	}

	if($("contextmenus").checked){
		$("contexta").disabled = false;
		$("contextb").disabled = false;
		$("contextc").disabled = false;

		if($("contextc").checked){
			$("websitepresetname").disabled = false;
			$("websitepresetnumber").disabled = false;
			$("websitepresetBox").disabled = false;
			$("websitepresetnumberBox").disabled = false;
			$("websitepresetaddbutton").disabled = false;
			$("websitepresetremovebutton").disabled = false;
		}else{
			$("websitepresetname").disabled = true;
			$("websitepresetnumber").disabled = true;
			$("websitepresetBox").disabled = true;
			$("websitepresetnumberBox").disabled = true;
			$("websitepresetaddbutton").disabled = true;
			$("websitepresetremovebutton").disabled = true;
		}
	}else{
		$("contexta").disabled = true;
		$("contextb").disabled = true;
		$("contextc").disabled = true;

		$("websitepresetname").disabled = true;
		$("websitepresetnumber").disabled = true;
		$("websitepresetBox").disabled = true;
		$("websitepresetnumberBox").disabled = true;
		$("websitepresetaddbutton").disabled = true;
		$("websitepresetremovebutton").disabled = true;
	}

	if($("prezoombutton").checked){
		$("websitelevelnumber").disabled = false;
		$("websitelevelnumberBox").disabled = false;
		$("websiteleveladdbutton").disabled = false;
		$("websitelevelremovebutton").disabled = false;
		$("moveupbutton").disabled = false;
		$("movedownbutton").disabled = false;
	}else{
		$("websitelevelnumber").disabled = true;
		$("websitelevelnumberBox").disabled = true;
		$("websiteleveladdbutton").disabled = true;
		$("websitelevelremovebutton").disabled = true;
		$("moveupbutton").disabled = true;
		$("movedownbutton").disabled = true;
	}
}

function ariacheck(){
	var inputs = document.querySelectorAll("input[role='checkbox'], input[role='radio']"), i, l = inputs.length;
	for(i = 0; i < l; i++){
		inputs[i].checked == true ? inputs[i].setAttribute("aria-checked", true) : inputs[i].setAttribute("aria-checked", false);
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
				if(x == "activeTab"){ textperm = chrome.i18n.getMessage("permissionactivetab"); }else if(x == "contextMenus"){ textperm = chrome.i18n.getMessage("permissioncontextmenu"); }else if(x == "storage"){ textperm = chrome.i18n.getMessage("permissionstorage"); }else if(x == "tabs"){ textperm = chrome.i18n.getMessage("permissiontabs"); }else if(x == "webNavigation"){ textperm = chrome.i18n.getMessage("permissionwebnavigation"); }else if(x == "scripting"){ textperm = chrome.i18n.getMessage("permissionscripting"); }else if(x == "system.display"){ textperm = chrome.i18n.getMessage("permissionsystemdisplay"); }
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
	if($("shareboxtwitter")){
		$("shareboxtwitter").addEventListener("click", function(){ window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", "Share to Twitter", "width=600,height=460,menubar=no,location=no,status=no"); });
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
	var t, ln = inputs.length;
	for(t = 0; t < ln; t++){ inputs[t].addEventListener("change", test); inputs[t].addEventListener("change", ariacheck); inputs[t].addEventListener("change", save_options); }

	// show all the active permissions in a list
	chrome.runtime.sendMessage({name: "getallpermissions"});

	$("slider").addEventListener("change", function(){ $("allzoomvalue").value = this.value; ariacheck(); save_options(); });
	$("slider").addEventListener("input", function(){ $("allzoomvalue").value = this.value; ariacheck(); save_options(); });
	$("allzoomvalue").addEventListener("change", function(){ $("slider").value = this.value; ariacheck(); save_options(); });

	// Close yellow bar
	$("managed-prefs-text-close").addEventListener("click", function(){ $("managed-prefs-banner").style.display = "none"; });
	$("p0").addEventListener("click", function(){
		var custombrowser = "";
		if(exbrowser == "safari"){ custombrowser = "/images/iconstick38safari.png"; }else{ custombrowser = "/images/iconstick38.png"; }
		setpreviewicon(custombrowser);
	});
	$("p1").addEventListener("click", function(){
		var custombrowser = "";
		custombrowser = "/images/style1@2x.png";
		setpreviewicon(custombrowser);
	});
	$("p2").addEventListener("click", function(){
		var custombrowser = "";
		custombrowser = "/images/style2@2x.png";
		setpreviewicon(custombrowser);
	});
	$("p3").addEventListener("click", function(){
		var custombrowser = "";
		custombrowser = "/images/style3@2x.png";
		setpreviewicon(custombrowser);
	});
	$("p4").addEventListener("click", function(){
		var custombrowser = "";
		custombrowser = "/images/style4@2x.png";
		setpreviewicon(custombrowser);
	});
	$("p5").addEventListener("click", function(){
		var custombrowser = "";
		custombrowser = "/images/style5@2x.png";
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

	// Save KB download
	$("tabbasic").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); OFFworkaroundbugfromsafari(); $("welcomeguide").src = ""; $("managed-prefs-banner").style.display = ""; memguide(); guidekb = true; mobilecheck(); });
	$("tabadvan").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = ""; $("managed-prefs-banner").style.display = ""; memguide(); guidekb = true; mobilecheck(); });
	$("tabguide").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = linkguide; $("managed-prefs-banner").style.display = "none"; guidekb = false; mobilecheck(); });
	$("tabhelp").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = ""; $("managed-prefs-banner").style.display = ""; memguide(); guidekb = true; mobilecheck(); });

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

	// websitezoom Change
	$("websitezoomBox").addEventListener("click", function(){ websitezoomchangeurl(); });
	$("websitezoomnumberBox").addEventListener("click", function(){ websitezoomchangenumberl(); });
	// Add
	document.getElementById("formwebsitezoom").addEventListener("submit", function(e){ e.preventDefault(); websitezoomadd(); });
	// Remove
	$("websitezoomremovebutton").addEventListener("click", function(){ websitezoomremoveSelectedExcludedDomain(); });

	// websitepreset Change
	$("websitepresetBox").addEventListener("click", function(){ websitepresetchangeurl(); });
	$("websitepresetnumberBox").addEventListener("click", function(){ websitepresetchangenumberl(); });
	// Add
	document.getElementById("formwebsitepreset").addEventListener("submit", function(e){ e.preventDefault(); websitepresetadd(); });
	// Remove
	$("websitepresetremovebutton").addEventListener("click", function(){ websitepresetremoveSelectedExcludedDomain(); });

	// Screen size
	$("detectscreensize").addEventListener("click", function(){ $("screenzoomname").value = screen.width + "x" + screen.height; });
	// Change
	$("screenzoomBox").addEventListener("click", function(){ screenzoomchangeurl(); });
	$("screenzoomnumberBox").addEventListener("click", function(){ screenzoomchangenumberl(); });
	// Add
	document.getElementById("formscreenzoom").addEventListener("submit", function(e){ e.preventDefault(); screenzoomadd(); });
	// Remove
	$("screenzoomremovebutton").addEventListener("click", function(){ screenzoomremoveSelectedExcludedDomain(); });

	// Preset level
	// Add
	document.getElementById("formwebsitelevel").addEventListener("submit", function(e){ e.preventDefault(); levelzoomadd(); });
	// Remove
	$("websitelevelremovebutton").addEventListener("click", function(){ levelzoomremoveSelectedExcludedDomain(); });
	// Move up
	$("moveupbutton").addEventListener("click", function(){ moveup(); });
	// Move down
	$("movedownbutton").addEventListener("click", function(){ movedown(); });

	// Reset settings
	$("resetbrowserextension").addEventListener("click", function(){ chrome.storage.sync.clear(); chrome.runtime.sendMessage({name: "bckreload"}); location.reload(); });

	// Review box
	$("war").addEventListener("click", function(){ window.open(writereview); $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });
	$("nt").addEventListener("click", function(){ $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });

	function moveup(){
		var excludedstockBox = document.getElementById("websitelevelnumberBox");
		var i = excludedstockBox.selectedIndex;
		if(i > 0){
			// Swap the options
			var optionToMoveUp = excludedstockBox.options[i];
			var optionToMoveDown = excludedstockBox.options[i - 1];
			excludedstockBox.insertBefore(optionToMoveUp, optionToMoveDown);
			excludedstockBox.selectedIndex = i - 1;
			save_options();
		}
	}

	function movedown(){
		var excludedstockBox = document.getElementById("websitelevelnumberBox");
		var i = excludedstockBox.selectedIndex;
		if(i >= 0 && i < excludedstockBox.length - 1){
			// Swap the options
			var optionToMoveDown = excludedstockBox.options[i];
			var optionToMoveUp = excludedstockBox.options[i + 1];
			excludedstockBox.insertBefore(optionToMoveUp, optionToMoveDown);
			excludedstockBox.selectedIndex = i + 1;
			save_options();
		}
	}

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
			var content = partsection.textContent;

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