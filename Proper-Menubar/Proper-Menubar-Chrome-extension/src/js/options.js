//================================================
/*

Proper Menubar
Add the best menu bar to get easy and fast access to all your useful browser options and internet products!
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

function $(id){ return document.getElementById(id); }
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&list=PLfXHh3TKRb4ZIWFeG31L_jRs5fRHtzYAc";
var darkmode = false;

function defaultgetsettings(){
	read_options();
}

// Option to save current value
function save_options(){
	// toolbar Excluded domains
	var toolbarDomainsBox = $("toolbarDomainsBox");
	var toolbarDomains = {};
	for(var i = 0; i < toolbarDomainsBox.length; i++){ toolbarDomains[toolbarDomainsBox.options[i].value] = true; }

	var googlebarDomainsBox = $("googlebarDomainsBox");
	var googlebarDomains = {};
	for(var j = 0; j < googlebarDomainsBox.length; j++){ googlebarDomains[googlebarDomainsBox.options[j].value] = true; }

	chrome.storage.sync.set({"opacity": $("opacity").value, "country":$("country").value, "backgroundhex":$("backgroundhex").value, "backgroundimagesource":$("backgroundimagesource").value, "backgroundcolor":$("backgroundcolor").checked, "backgroundimage":$("backgroundimage").checked, "dropshadow":$("dropshadow").checked, "allsites":$("allsites").checked, "fontcolor":$("fontcolor").value, "googlesites":$("googlesites").checked, "search":$("search").checked, "existingtab":$("existingtab").checked, "toolbarDomains": JSON.stringify(toolbarDomains), "optionskipremember":$("optionskipremember").checked, "display":$("display").value, "hovertextcolor":$("hovertextcolor").value, "hoverbackground":$("hoverbackground").value, "getpositiontop": $("getpositiontop").checked, "getpositionbottom": $("getpositionbottom").checked, "toolbarwhite": $("toolbarwhite").checked, "toolbarblack": $("toolbarblack").checked, "toolbaronly":$("toolbaronly").checked, "googleproducts":$("googleproducts").checked, "menuproducts":$("menuproducts").checked, "googlebarDomains": JSON.stringify(googlebarDomains)});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(["backgroundcolor", "backgroundimage", "googlesites", "allsites", "dropshadow", "display", "search", "hovertextcolor", "hoverbackground", "getpositiontop", "getpositionbottom", "toolbarwhite", "toolbarblack", "googleproducts", "menuproducts"], function(items){
	// find no localstore zoomengine
	if(items["backgroundcolor"] == null && items["backgroundimage"] == null){ firstdefaultvalues["backgroundcolor"] = true; firstdefaultvalues["backgroundimage"] = false; }
	if(items["allsites"] == null){ firstdefaultvalues["allsites"] = true; }
	if(items["dropshadow"] == null){ firstdefaultvalues["dropshadow"] = true; }
	if(items["display"] == null){ firstdefaultvalues["display"] = 13; }
	if(items["search"] == null){ firstdefaultvalues["search"] = true; }
	if(items["hovertextcolor"] == null){ firstdefaultvalues["hovertextcolor"] = "#ffffff"; }
	if(items["hoverbackground"] == null){ firstdefaultvalues["hoverbackground"] = "#444444"; }
	if(items["getpositiontop"] == null && items["getpositionbottom"] == null){ firstdefaultvalues["getpositiontop"] = true; firstdefaultvalues["getpositionbottom"] = false; }
	if(items["toolbarwhite"] == null && items["toolbarblack"] == null){ firstdefaultvalues["toolbarwhite"] = true; firstdefaultvalues["toolbarblack"] = false; }
	if(items["googleproducts"] == null && items["menuproducts"] == null){ firstdefaultvalues["googleproducts"] = false; firstdefaultvalues["menuproducts"] = true; }

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

	chrome.storage.sync.get(["firstDate", "opacity", "country", "backgroundhex", "backgroundimagesource", "backgroundcolor", "backgroundimage", "googlesites", "dropshadow", "allsites", "fontcolor", "search", "existingtab", "propermenuDomains", "countremember", "optionskipremember", "display", "hovertextcolor", "hoverbackground", "firstsawrate", "introduce", "getpositiontop", "getpositionbottom", "toolbarwhite", "toolbarblack", "toolbaronly", "googleproducts", "menuproducts", "googlebarDomains", "toolbarDomains"], function(items){
		if(items["opacity"]){ $("opacity").value = items["opacity"]; }else{ $("opacity").value = "100"; }
		if(items["country"]){ $("country").value = items["country"]; }else{ $("country").value = "com"; }
		if(items["backgroundhex"]){ $("backgroundhex").value = items["backgroundhex"]; }else{ $("backgroundhex").value = "#2D2D2D"; }
		if(items["backgroundimagesource"]){ $("backgroundimagesource").value = items["backgroundimagesource"]; }else{ $("backgroundimagesource").value = ""; }
		if(items["backgroundcolor"] == true)$("backgroundcolor").checked = true;
		if(items["backgroundimage"] == true)$("backgroundimage").checked = true;
		if(items["googlesites"] == true)$("googlesites").checked = true;
		if(items["dropshadow"] == true)$("dropshadow").checked = true;
		if(items["allsites"] == true)$("allsites").checked = true;
		if(items["fontcolor"]){ $("fontcolor").value = items["fontcolor"]; }else{ $("fontcolor").value = "#cccccc"; }
		if(items["toolbaronly"] == true)$("toolbaronly").checked = true;
		if(items["search"] == true)$("search").checked = true;
		if(items["existingtab"] == true)$("existingtab").checked = true;
		if(items["optionskipremember"] == true){ $("optionskipremember").checked = true; $("firstcheckboxskipremember").checked = true; }
		if(items["display"]){ $("display").value = items["display"]; }
		if(items["hovertextcolor"]){ $("hovertextcolor").value = items["hovertextcolor"]; }else{ $("hovertextcolor").value = "#ffffff"; }
		if(items["hoverbackground"]){ $("hoverbackground").value = items["hoverbackground"]; }else{ $("hoverbackground").value = "#444444"; }
		if(items["getpositiontop"] == true)$("getpositiontop").checked = true;
		if(items["getpositionbottom"] == true)$("getpositionbottom").checked = true;
		if(items["toolbarwhite"] == true)$("toolbarwhite").checked = true;
		if(items["toolbarblack"] == true)$("toolbarblack").checked = true;
		if(items["googleproducts"] == true)$("googleproducts").checked = true;
		if(items["menuproducts"] == true)$("menuproducts").checked = true;

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

		// toolbar - Excluded domains - sort these alphabetically
		var toolbarDomains = items["toolbarDomains"];
		if(typeof toolbarDomains == "undefined")
			toolbarDomains = JSON.stringify({"https://www.google.com": true, "https://www.youtube.com": true});

		if(typeof toolbarDomains == "string"){
			toolbarDomains = JSON.parse(toolbarDomains);
			var abuf = [];
			for(var domain in toolbarDomains)
				abuf.push(domain);
			abuf.sort();

			var bari;
			var barl = abuf.length;
			for(bari = 0; bari < barl; bari++)
				appendToListBox("toolbarDomainsBox", abuf[bari]);
		}

		// google bar - Excluded domains - sort these alphabetically
		var googlebarDomains = items["googlebarDomains"];
		if(typeof googlebarDomains == "undefined")
			googlebarDomains = JSON.stringify({"link1a": true, "link2a": true, "link3a": true, "link4a": true, "link5a": true, "link6a": true, "link7a": true, "link8a": true, "link9a": true, "link10a": true, "link11a": true, "link12a": true, "link13a": true, "link14a": true, "link15a": true, "link16a": true, "link17a": true, "link18a": true, "link19a": true, "link20a": true, "link21a": true, "link22a": true, "link23a": true, "link24a": true, "link25a": true, "link26a": true, "link27a": true, "link28a": true});

		if(typeof googlebarDomains == "string"){
			googlebarDomains = JSON.parse(googlebarDomains);
			var gbuf = [];
			for(var sdomain in googlebarDomains)
				gbuf.push(sdomain);
			gbuf.sort();

			var webi;
			var webl = gbuf.length;
			for(webi = 0; webi < webl; webi++)
				tagappendToListBox("googlebarDomainsBox", gbuf[webi]);
		}

		test(); // do the test

	});// chrome storage end
} // end read

// Add a filter string to the list box.
function appendToListBox(boxId, text){ var elt = document.createElement("option"); elt.text = text; elt.value = text; document.getElementById(boxId).add(elt, null); }

function tagappendToListBox(boxId, text){ var elt = document.createElement("option"); var productname = chrome.i18n.getMessage(text); elt.text = productname; elt.value = text; document.getElementById(boxId).add(elt, null); document.getElementById("tag" + text).className = "hidden"; }

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

// whitelist proper menu domain
function toolbaraddWhitelistDomain(){
	var domain = $("toolbarwebsiteurl").value;
	appendToListBox("toolbarDomainsBox", domain);
	ariacheck();
	save_options();
}

function toolbarremoveSelectedExcludedDomain(){
	var toolbarDomainsBox = $("toolbarDomainsBox");
	for(var i = toolbarDomainsBox.length - 1; i >= 0; i--){
		if(toolbarDomainsBox.options[i].selected)
			toolbarDomainsBox.remove(i);
	}
	ariacheck();
	save_options();
}

function googlebarremoveSelectedExcludedDomain(){
	var googlebarDomainsBox = $("googlebarDomainsBox");
	for(var i = googlebarDomainsBox.length - 1; i >= 0; i--){
		if(googlebarDomainsBox.options[i].selected){
			$("tag" + googlebarDomainsBox.options[i].value).className = "tags";
			googlebarDomainsBox.remove(i);
		}
	}
	ariacheck();
	save_options();
}

function moveproductdown(){
	var excludedstockBox = document.getElementById("googlebarDomainsBox");
	var i = excludedstockBox.selectedIndex;
	try{
		var txt = excludedstockBox.options[i + 1].text;
		var val = excludedstockBox.options[i + 1].value;
		excludedstockBox.options[i + 1].text = excludedstockBox.options[i].text;
		excludedstockBox.options[i + 1].value = excludedstockBox.options[i].value;
		excludedstockBox.options[i].text = txt;
		excludedstockBox.options[i].value = val;
		excludedstockBox.selectedIndex = i + 1;
		ariacheck();
		save_options();
	}catch(e){
		// console.log(e);
	}
}

function moveproductup(){
	var excludedstockBox = document.getElementById("googlebarDomainsBox");
	var i = excludedstockBox.selectedIndex;
	try{
		var txt = excludedstockBox.options[i - 1].text;
		var val = excludedstockBox.options[i - 1].value;
		excludedstockBox.options[i - 1].text = excludedstockBox.options[i].text;
		excludedstockBox.options[i - 1].value = excludedstockBox.options[i].value;
		excludedstockBox.options[i].text = txt;
		excludedstockBox.options[i].value = val;
		excludedstockBox.selectedIndex = i - 1;
		ariacheck();
		save_options();
	}catch(e){
		// console.log(e);
	}
}

function test(){
	if(document.getElementById("toolbaronly").checked == true){
		document.getElementById("toolbarwebsiteurl").disabled = false;
		document.getElementById("toolbaraddbutton").disabled = false;
		document.getElementById("toolbarremovebutton").disabled = false;
		document.getElementById("toolbarDomainsBox").disabled = false;
		document.getElementById("toolbarwhite").disabled = false;
		document.getElementById("toolbarblack").disabled = false;
	}else{
		document.getElementById("toolbarwebsiteurl").disabled = true;
		document.getElementById("toolbaraddbutton").disabled = true;
		document.getElementById("toolbarremovebutton").disabled = true;
		document.getElementById("toolbarDomainsBox").disabled = true;
		document.getElementById("toolbarwhite").disabled = true;
		document.getElementById("toolbarblack").disabled = true;
	}

	if(document.getElementById("googleproducts").checked == true){
		document.getElementById("googlebarremovebutton").disabled = false;
		document.getElementById("googlebarDomainsBox").disabled = false;
		document.getElementById("googlebarupbutton").disabled = false;
		document.getElementById("googlebardownbutton").disabled = false;
	}else{
		document.getElementById("googlebarremovebutton").disabled = true;
		document.getElementById("googlebarDomainsBox").disabled = true;
		document.getElementById("googlebarupbutton").disabled = true;
		document.getElementById("googlebardownbutton").disabled = true;
	}
}

function slidepreview1(){ $("backgroundimagesource").value = chrome.extension.getURL("/images/slice1.png"); ariacheck(); save_options(); }
function slidepreview2(){ $("backgroundimagesource").value = chrome.extension.getURL("/images/slice2.png"); ariacheck(); save_options(); }
function slidepreview3(){ $("backgroundimagesource").value = chrome.extension.getURL("/images/slice3.png"); ariacheck(); save_options(); }
function slidepreview4(){ $("backgroundimagesource").value = chrome.extension.getURL("/images/slice4.png"); ariacheck(); save_options(); }
function slidepreview5(){ $("backgroundimagesource").value = chrome.extension.getURL("/images/slice5.png"); ariacheck(); save_options(); }
function slidepreview6(){ $("backgroundimagesource").value = chrome.extension.getURL("/images/slice6.png"); ariacheck(); save_options(); }

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
				if(x == "activeTab"){ textperm = chrome.i18n.getMessage("permissionactivetab"); }else if(x == "contextMenus"){ textperm = chrome.i18n.getMessage("permissioncontextmenu"); }else if(x == "storage"){ textperm = chrome.i18n.getMessage("permissionstorage"); }else if(x == "tabs"){ textperm = chrome.i18n.getMessage("permissiontabs"); }else if(x == "pageCapture"){ textperm = chrome.i18n.getMessage("permissionpagecapture"); }else if(x == "clipboardWrite"){ textperm = chrome.i18n.getMessage("permissionclipwrite"); }else if(x == "clipboardRead"){ textperm = chrome.i18n.getMessage("permissionclipread"); }else if(x == "bookmarks"){ textperm = chrome.i18n.getMessage("permissionbookmarks"); }else if(x == "scripting"){ textperm = chrome.i18n.getMessage("permissionscripting"); }
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

	// Move up
	$("googlebarupbutton").addEventListener("click", function(){ moveproductup(); });

	// Move down
	$("googlebardownbutton").addEventListener("click", function(){ moveproductdown(); });

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

	$("slice1").addEventListener("click", function(){ slidepreview1(); });
	$("slice2").addEventListener("click", function(){ slidepreview2(); });
	$("slice3").addEventListener("click", function(){ slidepreview3(); });
	$("slice4").addEventListener("click", function(){ slidepreview4(); });
	$("slice5").addEventListener("click", function(){ slidepreview5(); });
	$("slice6").addEventListener("click", function(){ slidepreview6(); });

	// toolbar Add website
	$("formtoolbar").addEventListener("submit", function(e){ e.preventDefault(); toolbaraddWhitelistDomain(); });

	// toolbar Remove website
	$("toolbarremovebutton").addEventListener("click", function(){ toolbarremoveSelectedExcludedDomain(); });

	// Google bar Add product
	var barinputs, barindex;
	barinputs = $("tagbox").getElementsByClassName("tags");
	for(barindex = 0; barindex < barinputs.length; ++barindex){
		barinputs[barindex].addEventListener("click", function(){
			var prod = this.id; prod = prod.substr(3);
			tagappendToListBox("googlebarDomainsBox", prod);
			ariacheck();
			save_options();
		}, false);
	}

	// Bar remove website
	$("googlebarremovebutton").addEventListener("click", function(){ googlebarremoveSelectedExcludedDomain(); });

	$("removepermissioncopy").addEventListener("click", function(){
		chrome.permissions.remove({
			permissions: ["clipboardWrite"]
		}, function(removed){
			if(removed){
				// The permissions have been removed.
				var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
				window.alert(txtpermission);
			}else{
				// The permissions have not been removed (e.g., you tried to remove
				// required permissions).
				var txtpermissionnot = chrome.i18n.getMessage("wpermissionnotremoved");
				window.alert(txtpermissionnot);
			}
		});
	});

	$("removepermissionpaste").addEventListener("click", function(){
		chrome.permissions.remove({
			permissions: ["clipboardRead"]
		}, function(removed){
			if(removed){
				// The permissions have been removed.
				var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
				window.alert(txtpermission);
			}else{
				// The permissions have not been removed (e.g., you tried to remove
				// required permissions).
				var txtpermissionnot = chrome.i18n.getMessage("wpermissionnotremoved");
				window.alert(txtpermissionnot);
			}
		});
	});

	$("removepermissionmhtml").addEventListener("click", function(){
		chrome.permissions.remove({
			permissions: ["pageCapture"]
		}, function(removed){
			if(removed){
				// The permissions have been removed.
				var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
				window.alert(txtpermission);
			}else{
				// The permissions have not been removed (e.g., you tried to remove
				// required permissions).
				var txtpermissionnot = chrome.i18n.getMessage("wpermissionnotremoved");
				window.alert(txtpermissionnot);
			}
		});
	});

	$("removepermissionbookmark").addEventListener("click", function(){
		chrome.permissions.remove({
			permissions: ["bookmarks"]
		}, function(removed){
			if(removed){
				// The permissions have been removed.
				var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
				window.alert(txtpermission);
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

	// Reset settings
	$("resetpropermenubar").addEventListener("click", function(){ chrome.storage.sync.clear(); location.reload(); });

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