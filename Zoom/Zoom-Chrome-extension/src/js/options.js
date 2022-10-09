//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
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
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4ZRrIhSRo6cWEJVeS3_M5Yb";
var darkmode = false;

window.addEventListener("message", (event) => {
	if(event.origin == "https://www.stefanvd.net"){
		if(event.source == window &&
        event.data &&
        event.data.direction == "from-page-script"){
			// alert("Content script received message: \"" + event.data.message + "\"");
			var myid = chrome.runtime.id;
			var myversion = chrome.runtime.getManifest().version;
			window.postMessage({
				direction: "from-zoom-script",
				message: myid,
				version: myversion
			}, "https://www.stefanvd.net");
		}
	}
});

// Option to save current value
function save_options(){
	chrome.runtime.sendMessage({name: "getallpermissions"});

	var websitezoomBox = $("websitezoomBox");
	var websitezoomnumberBox = $("websitezoomnumberBox");
	var websitezoom = {};
	var i;
	var l = websitezoomBox.length;
	for(i = 0; i < l; i++){
		var getnumber = websitezoomnumberBox.options[i].text;
		websitezoom[websitezoomBox.options[i].value] = getnumber;
	}
	var screenzoomBox = $("screenzoomBox");
	var screenzoomnumberBox = $("screenzoomnumberBox");
	var screenzoom = {};
	var i;
	var l = screenzoomBox.length;
	for(i = 0; i < l; i++){
		var getsnumber = screenzoomnumberBox.options[i].text;
		screenzoom[screenzoomBox.options[i].value] = getsnumber;
	}
	chrome.storage.sync.set({ "allzoom": $("allzoom").checked, "optionskipremember": $("optionskipremember").checked, "contextmenus": $("contextmenus").checked, "badge": $("badge").checked, "steps": $("steps").value, "lightcolor": $("lightcolor").value, "zoomchrome": $("zoomchrome").checked, "zoomweb": $("zoomweb").checked, "websitezoom": JSON.stringify(websitezoom), "zoomdoubleclick": $("zoomdoubleclick").checked, "zoomnewsingleclick": $("zoomnewsingleclick").checked, "zoomsingleclick": $("zoomsingleclick").checked, "zoommousescroll": $("zoommousescroll").checked, "zoommousebuttonleft": $("zoommousebuttonleft").checked, "zoommousebuttonright": $("zoommousebuttonright").checked, "zoommousescrollup": $("zoommousescrollup").checked, "zoommousescrolldown": $("zoommousescrolldown").checked, "largepopup": $("largepopup").checked, "zoombydomain": $("zoombydomain").checked, "zoombypage": $("zoombypage").checked, "allzoomvalue": $("allzoomvalue").value / 100, "defaultallscreen": $("defaultallscreen").checked, "defaultsinglescreen": $("defaultsinglescreen").checked, "screenzoom": JSON.stringify(screenzoom), "zoomfont": $("zoomfont").checked, "zoommagcircle": $("zoommagcircle").checked, "zoommagsquare": $("zoommagsquare").checked, "zoommagszoomlevel": $("zoommagszoomlevel").value, "zoommagszoomsize": $("zoommagszoomsize").value, "contexta": $("contexta").checked, "contextb": $("contextb").checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(["zoomchrome", "zoomweb", "zoommousebuttonleft", "zoommousebuttonright", "zoommousescrollup", "zoommousescrolldown", "zoombydomain", "zoombypage", "defaultallscreen", "defaultsinglescreen", "zoomfont", "zoomdoubleclick", "zoomnewsingleclick", "zoomsingleclick", "zoommagcircle", "zoommagsquare", "contexta", "contextb"], function(items){
	// find no localstore zoomengine
	if(items["zoomchrome"] == null && items["zoomweb"] == null){ firstdefaultvalues["zoomweb"] = true; firstdefaultvalues["zoomchrome"] = false; firstdefaultvalues["zoomfont"] = false; }
	if(items["zoommousebuttonleft"] == null && items["zoommousebuttonright"] == null){ firstdefaultvalues["zoommousebuttonleft"] = true; firstdefaultvalues["zoommousebuttonright"] = false; }
	if(items["zoommousescrollup"] == null && items["zoommousescrolldown"] == null){ firstdefaultvalues["zoommousescrollup"] = true; firstdefaultvalues["zoommousescrolldown"] = false; }
	if(items["zoombydomain"] == null && items["zoombypage"] == null){ firstdefaultvalues["zoombydomain"] = true; firstdefaultvalues["zoombypage"] = false; }
	if(items["defaultallscreen"] == null && items["defaultsinglescreen"] == null){ firstdefaultvalues["defaultallscreen"] = true; firstdefaultvalues["defaultsinglescreen"] = false; }
	if(items["zoomdoubleclick"] == null && items["zoomnewsingleclick"] == null && items["zoomsingleclick"] == null){ firstdefaultvalues["zoomdoubleclick"] = false; firstdefaultvalues["zoomnewsingleclick"] = false; firstdefaultvalues["zoomsingleclick"] = true; }
	if(items["zoommagcircle"] == null && items["zoommagsquare"] == null){ firstdefaultvalues["zoommagcircle"] = true; firstdefaultvalues["zoommagsquare"] = false; }
	if(items["contexta"] == null && items["contextb"] == null){ firstdefaultvalues["contexta"] = true; firstdefaultvalues["contextb"] = false; }
	// find no localstore lightimage
	// Save the init value
	chrome.storage.sync.set(firstdefaultvalues, function(){
		// console.log('Settings saved');
	});
});

function read_options(){
//---
// rate
	$("materialModalRate").addEventListener("click", function(e){
		closeMaterialRateAlert(e, false);
	});
	$("materialModalRateContent").addEventListener("click", function(e){
		e.stopPropagation();
	});
	$("materialModalRateButtonOK").addEventListener("click", function(e){
		closeMaterialRateAlert(e, true);
		window.open(writereview); $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});
	});
	$("materialModalRateButtonCANCEL").addEventListener("click", function(e){
		closeMaterialRateAlert(e, false);
	});

	// introduce
	$("materialModalIntroduce").addEventListener("click", function(e){
		closeMaterialIntroduceAlert(e, false);
	});
	$("materialModalIntroduceContent").addEventListener("click", function(e){
		e.stopPropagation();
	});
	$("materialModalIntroduceButtonOK").addEventListener("click", function(e){
		closeMaterialIntroduceAlert(e, true);
	});
	$("materialModalIntroduceButtonCANCEL").addEventListener("click", function(e){
		closeMaterialIntroduceAlert(e, false);
	});

	// rate
	function materialRateAlert(callback){
		document.getElementById("materialModalRate").className = "show";
		document.getElementById("materialModalRate").setAttribute("aria-disabled", "false");
	}
	function closeMaterialRateAlert(e, result){
		e.stopPropagation();
		document.getElementById("materialModalRate").className = "hide";
		document.getElementById("materialModalRate").setAttribute("aria-disabled", "true");
	}

	// introduce
	function materialIntroduceAlert(callback){
		document.getElementById("materialModalIntroduceButtonCANCEL").style.display = "none";
		document.getElementById("materialModalIntroduce").className = "show";
		document.getElementById("materialModalIntroduce").setAttribute("aria-disabled", "false");
	}
	function closeMaterialIntroduceAlert(e, result){
		e.stopPropagation();
		document.getElementById("materialModalIntroduce").className = "hide";
		document.getElementById("materialModalIntroduce").setAttribute("aria-disabled", "true");
	}
	//---

	chrome.storage.sync.get(["firstDate", "optionskipremember", "countremember", "allzoom", "websitezoom", "allzoomvalue", "contextmenus", "badge", "steps", "lightcolor", "zoomweb", "zoomchrome", "zoomdoubleclick", "zoomnewsingleclick", "zoomsingleclick", "zoommousescroll", "zoommousebuttonleft", "zoommousebuttonright", "zoommousescrollup", "zoommousescrolldown", "largepopup", "zoombydomain", "zoombypage", "defaultallscreen", "defaultsinglescreen", "screenzoom", "firstsawrate", "introduce", "zoomfont", "zoommagcircle", "zoommagsquare", "zoommagszoomlevel", "zoommagszoomsize", "contexta", "contextb"], function(items){
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
		if(items["zoommousescroll"] == true)$("zoommousescroll").checked = true;
		if(items["zoommousebuttonleft"] == true)$("zoommousebuttonleft").checked = true;
		if(items["zoommousebuttonright"] == true)$("zoommousebuttonright").checked = true;
		if(items["zoommousescrollup"] == true)$("zoommousescrollup").checked = true;
		if(items["zoommousescrolldown"] == true)$("zoommousescrolldown").checked = true;
		if(items["largepopup"] == true)$("largepopup").checked = true;
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

		// show introduce
		if(items["introduce"] != true){
			window.setTimeout(function (){
				materialIntroduceAlert(function (result){ console.log(result); });
			}, 2500);
			chrome.storage.sync.set({"introduce": true});
		}

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
					window.setTimeout(function (){
						materialRateAlert(function(result){ console.log(result); });
					}, 2500);
					chrome.storage.sync.set({"firstsawrate": true});
				}else{}
			}else{
				$("sectionreviewbox").style.display = "none";
			}
		}

		// if empty use this
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

			var i;
			var l = atbbuf.length;
			for(i = 0; i < l; i++){
				appendToListBox("websitezoomBox", atbbuf[i], websitezoom["" + atbbuf[i] + ""]);
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

			var i;
			var l = satbbuf.length;
			for(i = 0; i < l; i++){
				screenappendToListBox("screenzoomBox", satbbuf[i], screenzoom["" + satbbuf[i] + ""]);
			}
		}

		// load tab div
		var tabListItems = document.getElementById("navbar").childNodes;
		var i;
		var l = tabListItems.length;
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
		var i = 0;

		for(var id in tabLinks){
    	tabLinks[id].onclick = showTab;
			tabLinks[id].onfocus = function(){ this.blur(); };
			if(i == 0) tabLinks[id].className = "navbar-item-selected";
			i++;
		}

		// Hide all content divs except the first
		var i = 0;

		for(var id in contentDivs){
    	if(i != 0) contentDivs[id].className = "page hidden";
			i++;
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
	var i;
	var l = element.childNodes.length;
	for(i = 0; i < l; i++){
		if(element.childNodes[i].nodeName == tagName)return element.childNodes[i];
	}
}

function getHash(url){
	var hashPos = url.lastIndexOf("#");
	return url.substring(hashPos + 1);
}

function appendToListBox(boxId, text, phonenumber){
	var elt = document.createElement("option");
	elt.text = text;
	elt.value = text;
	$(boxId).add(elt, null);

	var phelt = document.createElement("option");
	phelt.text = phonenumber;
	phelt.value = text;
	$("websitezoomnumberBox").add(phelt, null);
}

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
	appendToListBox("websitezoomBox", domain, number);
	ariacheck();
	save_options();
}

function websitezoomremoveSelectedExcludedDomain(){
	var websitezoomBox = $("websitezoomBox");
	var websitezoomphoneBox = $("websitezoomnumberBox");
	for(var i = websitezoomBox.length - 1; i >= 0; i--){
		if(websitezoomBox.options[i].selected){
			websitezoomBox.remove(i);
			websitezoomphoneBox.remove(i);
		}
	}
	ariacheck();
	save_options();
}

// screen
function screenappendToListBox(boxId, text, phonenumber){
	var elt = document.createElement("option");
	elt.text = text;
	elt.value = text;
	$(boxId).add(elt, null);

	var phelt = document.createElement("option");
	phelt.text = phonenumber;
	phelt.value = text;
	$("screenzoomnumberBox").add(phelt, null);
}

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
	screenappendToListBox("screenzoomBox", domain, number);
	ariacheck();
	save_options();
}

function screenzoomremoveSelectedExcludedDomain(){
	var screenzoomBox = $("screenzoomBox");
	var screenzoomphoneBox = $("screenzoomnumberBox");
	for(var i = screenzoomBox.length - 1; i >= 0; i--){
		if(screenzoomBox.options[i].selected){
			screenzoomBox.remove(i);
			screenzoomphoneBox.remove(i);
		}
	}
	ariacheck();
	save_options();
}

function test(){
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
	}else{
		$("contexta").disabled = true;
		$("contextb").disabled = true;
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

function checkdarkmode(){
	chrome.storage.sync.get(["darkmode"], function(items){
		darkmode = items["darkmode"]; if(darkmode == null)darkmode = false; // default darkmode false

		// dark mode
		if(darkmode == true){
			$("currentdarkmode").innerText = chrome.i18n.getMessage("titledarkmodeon");
			document.body.className = "dark";
			$("headlamp").src = "icons/icon16@2x.png";
			$("headlamp").srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
			$("headlamp").style.webkitFilter = "invert(1)";
			$("headlamp").style.filter = "invert(1)";
		}else{
			$("currentdarkmode").innerText = chrome.i18n.getMessage("titledarkmodeoff");
			document.body.className = "light";
			$("headlamp").src = "icons/icon16@2x.png";
			$("headlamp").srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
			$("headlamp").style.webkitFilter = "invert(0)";
			$("headlamp").style.filter = "invert(0)";
		}
	});
}

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	// If the received message has the expected format...
	if(msg.text === "receiveallpermissions"){
		// empty ul first
		if($("permullist")){
			var lis = document.querySelectorAll("#permullist li");
			var i;
			var li;
			for(i = 0; li = lis[i]; i++){
				li.parentNode.removeChild(li);
			}
		}
		var perm = msg.value;
		perm.forEach(function(x){
			if($("permissionlist")){
				if($("permullist")){}else{
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
				if(x == "activeTab"){ textperm = chrome.i18n.getMessage("permissionactivetab"); }else if(x == "contextMenus"){ textperm = chrome.i18n.getMessage("permissioncontextmenu"); }else if(x == "storage"){ textperm = chrome.i18n.getMessage("permissionstorage"); }else if(x == "tabs"){ textperm = chrome.i18n.getMessage("permissiontabs"); }else if(x == "webNavigation"){ textperm = chrome.i18n.getMessage("permissionwebnavigation"); }
				newpermspandes.textContent = textperm;
				newpermspandes.className = "item";
				newperm.appendChild(newpermspandes);
			}
		});
	}
});

/* Option page body action */
// Read current value settings
window.addEventListener("load", function(){
	// remove loading screen
	$("loading").style.display = "none";
});

if(window.location.href != exoptionspage){
	document.addEventListener("DOMContentLoaded", domcontentloaded);
}else{
	domcontentloaded();
}

function domcontentloaded(){
	checkdarkmode();

	if((window.location.href != exoptionspage) && devmode == false){

		var condition = navigator.onLine ? "online" : "offline";
		if(condition == "online"){
			fetch(developerwebsite).then(function(response){
				if(response.status === 200){
					// website is online
					// redirect to there
					window.location.href = exoptionspage;
				}else{
					throw new Error(response.statusText);
				}

			}).catch(e=>{
				// is not there
				// use offline page
				// Add the YouTube player
				$("dont-turn-off-the-lights").src = youtubeembed;
				read_options();
				yearnow();
			});
		}else{
			// Add the YouTube player
			$("dont-turn-off-the-lights").src = youtubeembed;
			read_options();
			yearnow();
		}

	}else{
		// Add the YouTube player
		$("dont-turn-off-the-lights").src = youtubeembed;
		read_options();
		yearnow();
	}

	var sharetext = chrome.i18n.getMessage("sharetextd");
	var stefanvdurl = zoomproduct;
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
		window.open(developerwebsite);
	});

	$("btnsupport").addEventListener("click", function(){
		window.open(linksupport); $("dropmenu").className = "hide";
	});

	$("btnactivedarkmode").addEventListener("click", function(){
		chrome.storage.sync.get(["darkmode"], function(items){
			darkmode = items["darkmode"]; if(darkmode == null)darkmode = false; // default darkmode false
			// dark mode
			if(darkmode == true){
				$("currentdarkmode").innerText = chrome.i18n.getMessage("titledarkmodeoff");
				$("dropmenu").className = "hide";
				document.body.className = "light";
				$("headlamp").src = "icons/icon16@2x.png";
				$("headlamp").srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
				$("headlamp").style.webkitFilter = "invert(0)";
				$("headlamp").style.filter = "invert(0)";
				chrome.storage.sync.set({"darkmode":false});
			}else{
				$("currentdarkmode").innerText = chrome.i18n.getMessage("titledarkmodeon");
				$("dropmenu").className = "hide";
				document.body.className = "dark";
				$("headlamp").src = "icons/icon16@2x.png";
				$("headlamp").srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
				$("headlamp").style.webkitFilter = "invert(1)";
				$("headlamp").style.filter = "invert(1)";
				chrome.storage.sync.set({"darkmode":true});
			}
		});
	});

	// promotion
	$("promotext").innerText = chrome.i18n.getMessage("donatetext");
	$("spnpromoaction").innerText = chrome.i18n.getMessage("donatecalltoaction");
	$("btnpromoaction").addEventListener("click", function(){ window.open(donatewebsite); });

	// Detect click / change to save the page and test it.
	var inputs = document.querySelectorAll("input");
	var i;
	var l = inputs.length;
	for(i = 0; i < l; i++){ inputs[i].addEventListener("change", test); inputs[i].addEventListener("change", ariacheck); inputs[i].addEventListener("change", save_options); }

	// show all the active permissions in a list
	chrome.runtime.sendMessage({name: "getallpermissions"});

	$("slider").addEventListener("change", function(){ $("allzoomvalue").value = this.value; ariacheck(); save_options(); });
	$("slider").addEventListener("input", function(){ $("allzoomvalue").value = this.value; ariacheck(); save_options(); });
	$("allzoomvalue").addEventListener("change", function(){ $("slider").value = this.value; ariacheck(); save_options(); });

	// Close yellow bar
	$("managed-prefs-text-close").addEventListener("click", function(){ $("managed-prefs-banner").style.display = "none"; });

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

	// Change
	$("websitezoomBox").addEventListener("click", function(){ websitezoomchangeurl(); });
	$("websitezoomnumberBox").addEventListener("click", function(){ websitezoomchangenumberl(); });
	// Add
	document.getElementById("formwebsitezoom").addEventListener("submit", function(e){ e.preventDefault(); websitezoomadd(); });

	// Remove
	$("websitezoomremovebutton").addEventListener("click", function(){ websitezoomremoveSelectedExcludedDomain(); });

	// Screen size
	$("detectscreensize").addEventListener("click", function(){ $("screenzoomname").value = screen.width + "x" + screen.height; });
	// Change
	$("screenzoomBox").addEventListener("click", function(){ screenzoomchangeurl(); });
	$("screenzoomnumberBox").addEventListener("click", function(){ screenzoomchangenumberl(); });
	// Add
	document.getElementById("formscreenzoom").addEventListener("submit", function(e){ e.preventDefault(); screenzoomadd(); });

	// Remove
	$("screenzoomremovebutton").addEventListener("click", function(){ screenzoomremoveSelectedExcludedDomain(); });

	// Reset settings
	$("resetzoom").addEventListener("click", function(){ chrome.storage.sync.clear(); window.location.reload(); });

	// Review box
	$("war").addEventListener("click", function(){ window.open(writereview); $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });
	$("nt").addEventListener("click", function(){ $("sectionreviewbox").style.display = "none"; chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version}); });

	// search
	var pageinsearch = false;
	function OnSearch(input){
		if(input.value == ""){
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
		}else{
			if(pageinsearch == false){
				pageinsearch = true;
				// load all the videos
				OFFworkaroundbugfromsafari();
			}

			// receive the total tab pages
			var tabListItems = $("navbar").childNodes;
			var i;
			var l = tabListItems.length;
			for(i = 0; i < l; i++){
				if(tabListItems[i].nodeName == "LI"){
					var tabLink = getFirstChildWithTagName(tabListItems[i], "A");
					var id = getHash(tabLink.getAttribute("data-tab"));
					contentDivs[id] = $(id);
				}
			}

			// show all tab pages
			var i = 0;
			var id;
			for(id in contentDivs){
				if(id != "tab3"){
					contentDivs[id].className = "page";
				}
				i++;
			}
			//---
			var searchword = input.value;

			var sections = document.getElementsByTagName("section");
			var x;
			var l = sections.length;
			for(x = 0; x < l; x++){
				var section = sections[x];
				var content = section.innerHTML;

				if(content.search(new RegExp(searchword, "i")) < 1){
					section.classList.add("searchfoundnothing");
				}else{
					section.classList.remove("searchfoundnothing");
				}
			}

			// hide the h2 if there is no sections visible
			var pages = document.getElementsByClassName("page");
			var z;
			var l = pages.length;
			for(z = 0; z < l; z++){
				var sections = pages[z].getElementsByTagName("section");
				var countnothingcheck = 0;
				var x;
				var q = sections.length;
				for(x = 0; x < q; x++){
					var section = sections[x];

					if(section.classList.contains("searchfoundnothing")){
						countnothingcheck += 1;
					}

				}
				if(countnothingcheck == sections.length){
					// total sections with nothing inside is the same as all the section -> hide the page
					pages[z].classList.add("searchfoundnothing");
				}else{
					pages[z].classList.remove("searchfoundnothing");
				}
			}


		}
	}

	if(document.getElementById("appsearch")){
		document.getElementById("appsearch").addEventListener("search", function(){ OnSearch(this); }, false);
		document.getElementById("appsearch").addEventListener("input", function(){ OnSearch(this); }, false);
		document.getElementById("btnsearchicon").addEventListener("input", function(){ OnSearch(this); }, false);
		document.getElementById("appsearch").placeholder = chrome.i18n.getMessage("searchplaceholder");
	}

}