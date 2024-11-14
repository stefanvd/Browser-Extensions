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
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4Zw-Ou8sg7V5NuS482WDvTg";
var darkmode = false;

function defaultgetsettings(){
	read_options();
}

function eventsubmitFunc(selector, callback){
	document.getElementById(selector).addEventListener("submit", function(e){
		e.preventDefault();
		callback();
	});
}

function getalldomains(a){
	var thatDomainsBox = $(a);
	var theDomains = {};
	var domi;
	var doml = thatDomainsBox.length;
	for(domi = 0; domi < doml; domi++){ theDomains[thatDomainsBox.options[domi].value] = true; }

	return JSON.stringify(theDomains);
}

// Option to save current value
function save_options(){
	chrome.runtime.sendMessage({name: "getallpermissions"});

	chrome.storage.sync.set({"icon": $("btnpreview").src, "contextmenus":$("contextmenus").checked, "autofullscreen":$("autofullscreen").checked, "optionskipremember":$("optionskipremember").checked, "fullscreenweb":$("fullscreenweb").checked, "fullscreenwindow":$("fullscreenwindow").checked, "fullscreenpopup":$("fullscreenpopup").checked, "fullscreenvideo":$("fullscreenvideo").checked, "allwindows":$("allwindows").checked, "videoinwindow":$("videoinwindow").checked, "videooutwindow":$("videooutwindow").checked, "autostartup":$("autostartup").checked, "startupallwindow":$("startupallwindow").checked, "startupcurrentwindow":$("startupcurrentwindow").checked, "autofullscreenDomains":getalldomains("autofullscreenDomainsBox"), "autofullscreenchecklistwhite":$("autofullscreenchecklistwhite").checked, "autofullscreenchecklistblack":$("autofullscreenchecklistblack").checked, "autofullscreenonly":$("autofullscreenonly").checked, "fullpopup":$("fullpopup").checked, "custompopup":$("custompopup").checked, "custompopuppixelwidth":$("custompopuppixelwidth").value, "custompopuppixelheight":$("custompopuppixelheight").value});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(["icon", "contextmenus", "fullscreenweb", "fullscreenwindow", "fullscreenpopup", "fullscreenvideo", "videoinwindow", "videooutwindow", "startupallwindow", "startupcurrentwindow", "autofullscreenDomains", "autofullscreenchecklistwhite", "autofullscreenchecklistblack", "fullpopup", "custompopup", "custompopuppixelwidth", "custompopuppixelheight"], function(items){
	// find no localstore zoomengine
	if(items["icon"] == null){
		if(exbrowser == "safari"){
			firstdefaultvalues["icon"] = "/images/icon38.png";
		}else{
			firstdefaultvalues["icon"] = "/images/icon38.png";
		}
	}
	if(items["contextmenus"] == null){ firstdefaultvalues["contextmenus"] = true; }
	if(items["fullscreenweb"] == null && items["fullscreenwindow"] == null && items["fullscreenvideo"] == null){ firstdefaultvalues["fullscreenweb"] = true; firstdefaultvalues["fullscreenwindow"] = false; firstdefaultvalues["fullscreenpopup"] = false; firstdefaultvalues["fullscreenvideo"] = false; }
	if(items["videoinwindow"] == null && items["videooutwindow"] == null){ firstdefaultvalues["videoinwindow"] = true; firstdefaultvalues["videooutwindow"] = false; }
	if(items["startupallwindow"] == null && items["startupcurrentwindow"] == null){ firstdefaultvalues["startupallwindow"] = true; firstdefaultvalues["startupcurrentwindow"] = false; }
	if(items["autofullscreenDomains"] == null){
		firstdefaultvalues["autofullscreenDomains"] = JSON.stringify({"https://www.youtube.com": true, "https://vimeo.com": true});
	}
	// find no localstore autofullscreen whitelist
	if(items["autofullscreenchecklistwhite"] == null && items["autofullscreenchecklistblack"] == null){ firstdefaultvalues["autofullscreenchecklistwhite"] = true; firstdefaultvalues["autofullscreenchecklistblack"] = false; }
	if(items["fullpopup"] == null && items["custompopup"] == null){ firstdefaultvalues["fullpopup"] = true; firstdefaultvalues["custompopup"] = false; }
	if(items["custompopuppixelwidth"] == null){ firstdefaultvalues["custompopuppixelwidth"] = 600; }
	if(items["custompopuppixelheight"] == null){ firstdefaultvalues["custompopuppixelheight"] = 400; }
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

	chrome.storage.sync.get(["icon", "firstDate", "contextmenus", "autofullscreen", "countremember", "optionskipremember", "fullscreenweb", "fullscreenwindow", "fullscreenpopup", "fullscreenvideo", "allwindows", "videoinwindow", "videooutwindow", "firstsawrate", "autostartup", "startupallwindow", "startupcurrentwindow", "autofullscreenDomains", "autofullscreenchecklistwhite", "autofullscreenchecklistblack", "autofullscreenonly", "fullpopup", "custompopup", "custompopuppixelwidth", "custompopuppixelheight"], function(items){
		if(items["icon"]){ $("btnpreview").src = items["icon"]; }
		if(items["contextmenus"] == true)$("contextmenus").checked = true;
		if(items["autofullscreen"] == true)$("autofullscreen").checked = true;
		if(items["optionskipremember"] == true)$("optionskipremember").checked = true;
		if(items["fullscreenweb"] == true)$("fullscreenweb").checked = true;
		if(items["fullscreenwindow"] == true)$("fullscreenwindow").checked = true;
		if(items["fullscreenvideo"] == true)$("fullscreenvideo").checked = true;
		if(items["allwindows"] == true)$("allwindows").checked = true;
		if(items["videoinwindow"] == true)$("videoinwindow").checked = true;
		if(items["videooutwindow"] == true)$("videooutwindow").checked = true;
		if(items["fullscreenpopup"] == true)$("fullscreenpopup").checked = true;
		if(items["autostartup"] == true)$("autostartup").checked = true;
		if(items["startupallwindow"] == true)$("startupallwindow").checked = true;
		if(items["startupcurrentwindow"] == true)$("startupcurrentwindow").checked = true;
		if(items["autofullscreenchecklistwhite"] == true)$("autofullscreenchecklistwhite").checked = true;
		if(items["autofullscreenchecklistblack"] == true)$("autofullscreenchecklistblack").checked = true;
		if(items["autofullscreenonly"] == true)$("autofullscreenonly").checked = true;
		if(items["fullpopup"] == true)$("fullpopup").checked = true;
		if(items["custompopup"] == true)$("custompopup").checked = true;
		if(items["custompopuppixelwidth"])$("custompopuppixelwidth").value = items["custompopuppixelwidth"];
		if(items["custompopuppixelheight"])$("custompopuppixelheight").value = items["custompopuppixelheight"];

		// autofullscreen - Excluded domains - sort these alphabetically
		var autofullscreenDomains = items["autofullscreenDomains"];
		setlistbox("autofullscreenDomainsBox", autofullscreenDomains);

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

function setlistbox(a, b){
	if(typeof b == "string"){
		b = JSON.parse(b);
		let srbuf = [], domain;
		for(domain in b)
			srbuf.push(domain);
		srbuf.sort();
		let i, l = srbuf.length;
		for(i = 0; i < l; i++)
			appendToListBox(a, srbuf[i]);
	}
}

// Add a filter string to the list box.
function appendToListBox(boxId, text){ var elt = document.createElement("option"); elt.role = "option"; elt.text = text; elt.value = text; $(boxId).add(elt, null); }

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

// whitelist autofullscreen domain
function autofullscreenaddWhitelistDomain(){
	var domain = $("autofullscreenwebsiteurl").value;
	appendToListBox("autofullscreenDomainsBox", domain);
	save_options();
}

function removedselectedwebsite(boxelement){
	var thisDomainsBox = $(boxelement);
	var i = thisDomainsBox.length - 1;
	for(i; i >= 0; i--){
		if(thisDomainsBox.options[i].selected)
			thisDomainsBox.remove(i);
	}
	save_options();
}

function autofullscreenElements(disabled){
	$("autofullscreenDomainsBox").disabled = disabled;
	$("autofullscreenwebsiteurl").disabled = disabled;
	$("autofullscreenaddbutton").disabled = disabled;
	$("autofullscreenremovebutton").disabled = disabled;
	$("autofullscreenchecklistwhite").disabled = disabled;
	$("autofullscreenchecklistblack").disabled = disabled;
}

function test(){
	if($("autofullscreen").checked == true){
		$("autofullscreenonly").disabled = false;
		if($("autofullscreenonly").checked == true){
			autofullscreenElements(false);
		}else{
			autofullscreenElements(true);
		}
	}else{
		$("autofullscreenonly").disabled = true;
		autofullscreenElements(true);
	}

	if($("autostartup").checked){
		$("startupallwindow").disabled = false;
		$("startupcurrentwindow").disabled = false;
	}else{
		$("startupallwindow").disabled = true;
		$("startupcurrentwindow").disabled = true;
	}

	if($("fullscreenvideo").checked){
		$("videoinwindow").disabled = false;
		$("videooutwindow").disabled = false;
	}else{
		$("videoinwindow").disabled = true;
		$("videooutwindow").disabled = true;
	}

	if($("fullpopup").checked){
		$("custompopuppixelwidth").disabled = true;
		$("custompopuppixelheight").disabled = true;
	}else{
		$("custompopuppixelwidth").disabled = false;
		$("custompopuppixelheight").disabled = false;
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
				if(x == "activeTab"){ textperm = chrome.i18n.getMessage("permissionactivetab"); }else if(x == "contextMenus"){ textperm = chrome.i18n.getMessage("permissioncontextmenu"); }else if(x == "storage"){ textperm = chrome.i18n.getMessage("permissionstorage"); }else if(x == "tabs"){ textperm = chrome.i18n.getMessage("permissiontabs"); }else if(x == "scripting"){ textperm = chrome.i18n.getMessage("permissionscripting"); }
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

	// Save KB download
	$("tabbasic").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); OFFworkaroundbugfromsafari(); $("welcomeguide").src = ""; $("managed-prefs-banner").style.display = ""; memguide(); guidekb = true; mobilecheck(); });
	$("tabdesign").addEventListener("click", function(){ Scrolltotop(); ONworkaroundbugpreview(); $("welcomeguide").src = ""; $("managed-prefs-banner").style.display = ""; memguide(); guidekb = true; mobilecheck(); });
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

	// autofullscreen Add website
	eventsubmitFunc("formautofullscreen", autofullscreenaddWhitelistDomain);

	// autofullscreen Remove website
	$("autofullscreenremovebutton").addEventListener("click", function(){ removedselectedwebsite("autofullscreenDomainsBox"); });

	// Reset settings
	$("resetbrowserextension").addEventListener("click", function(){ chrome.storage.sync.clear(); chrome.runtime.sendMessage({name: "bckreload"}); location.reload(); });

	// Review box
	$("war").addEventListener("click", function(){ window.open(writereview); $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });
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