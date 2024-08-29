//================================================
/*

Ambient Aurea
Instantly craft stunning photo galleries with ambient lighting effects in a single click.
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
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YxE1nyEgbOwphiK8C0JX9f";
var darkmode = false;

function defaultgetsettings(){
	read_options();
}

var default_opacity = 80;

// Option to save current value
function save_options(){
	chrome.storage.sync.set({"icon": $("btnpreview").src, "interval": $("interval").value, "lightcolor": $("lightcolor").value, "contextmenus": $("contextmenus").checked, "ambilight": $("ambilight").checked, "ambilightrangeblurradius": $("ambilightrangeblurradius").value, "ambilightrangespreadradius": $("ambilightrangespreadradius").value, "ambilightfixcolor": $("ambilightfixcolor").checked, "ambilightvarcolor": $("ambilightvarcolor").checked, "ambilightcolorhex": $("ambilightcolorhex").value, "ambilight4color": $("ambilight4color").checked, "ambilight1colorhex": $("ambilight1colorhex").value, "ambilight2colorhex": $("ambilight2colorhex").value, "ambilight3colorhex": $("ambilight3colorhex").value, "ambilight4colorhex": $("ambilight4colorhex").value, "fadein": $("fadein").checked, "fadeout": $("fadeout").checked, "sharebar": $("sharebar").checked, "count": $("count").checked, "slideshow": $("slideshow").checked, "slideshowrefresh": $("slideshowrefresh").value, "optionskipremember": $("optionskipremember").checked, "atmosvivid": $("atmosvivid").checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(["fadein", "fadeout", "contextmenus", "ambilight", "sharebar", "count", "atmosvivid", "ambilightvarcolor", "ambilightfixcolor", "ambilight4color"], function(items){
	// find no localstore zoomengine
	if(items["fadein"] == null && items["fadeout"] == null){ firstdefaultvalues["fadein"] = true; firstdefaultvalues["fadeout"] = true; }
	if(items["contextmenus"] == null){ firstdefaultvalues["contextmenus"] = true; }
	if(items["ambilight"] == null){ firstdefaultvalues["ambilight"] = true; }
	if(items["sharebar"] == null){ firstdefaultvalues["sharebar"] = true; }
	if(items["count"] == null){ firstdefaultvalues["count"] = true; }
	if(items["atmosvivid"] == null){ firstdefaultvalues["atmosvivid"] = true; }
	if(items["ambilightvarcolor"] == null && items["ambilightfixcolor"] == null && items["ambilight4color"] == null){ firstdefaultvalues["ambilightvarcolor"] = true; firstdefaultvalues["ambilightfixcolor"] = false; firstdefaultvalues["ambilight4color"] = false; }
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

	chrome.storage.sync.get(["icon", "firstDate", "interval", "lightcolor", "contextmenus", "ambilight", "ambilightrangeblurradius", "ambilightrangespreadradius", "ambilightfixcolor", "ambilightvarcolor", "ambilightcolorhex", "ambilight4color", "ambilight1colorhex", "ambilight2colorhex", "ambilight3colorhex", "ambilight4colorhex", "fadein", "fadeout", "sharebar", "count", "slideshow", "slideshowrefresh", "countremember", "reviewedlastonversion", "optionskipremember", "atmosvivid", "firstsawrate", "introduce"], function(items){
		if(items["icon"]){ $("btnpreview").src = items["icon"]; }
		if(items["interval"]){ default_opacity = items["interval"]; $("interval").value = items["interval"]; $("slider").value = items["interval"]; }else{ $("interval").value = 80; $("slider").value = 80; }
		if(items["lightcolor"]){ $("lightcolor").value = items["lightcolor"]; }else{ $("lightcolor").value = "#000000"; }
		if(items["contextmenus"] == true)$("contextmenus").checked = true;
		if(items["ambilight"] == true)$("ambilight").checked = true;
		if(items["ambilightrangeblurradius"]){ $("ambilightrangeblurradius").value = items["ambilightrangeblurradius"]; $("arangeblur").value = items["ambilightrangeblurradius"]; }else{ $("ambilightrangeblurradius").value = 25; $("arangeblur").value = 25; }
		if(items["ambilightrangespreadradius"]){ $("ambilightrangespreadradius").value = items["ambilightrangespreadradius"]; $("arangespread").value = items["ambilightrangespreadradius"]; }else{ $("ambilightrangespreadradius").value = 15; $("arangespread").value = 15; }
		if(items["ambilightfixcolor"] == true)$("ambilightfixcolor").checked = true;
		if(items["ambilightvarcolor"] == true)$("ambilightvarcolor").checked = true;
		if(items["ambilightcolorhex"])$("ambilightcolorhex").value = items["ambilightcolorhex"];
		else $("ambilightcolorhex").value = "#47C2FF";
		if(items["ambilight4color"] == true)$("ambilight4color").checked = true;
		if(items["ambilight1colorhex"])$("ambilight1colorhex").value = items["ambilight1colorhex"];
		else $("ambilight1colorhex").value = "#FF0000";
		if(items["ambilight2colorhex"])$("ambilight2colorhex").value = items["ambilight2colorhex"];
		else $("ambilight2colorhex").value = "#FFEE00";
		if(items["ambilight3colorhex"])$("ambilight3colorhex").value = items["ambilight3colorhex"];
		else $("ambilight3colorhex").value = "#00FF00";
		if(items["ambilight4colorhex"])$("ambilight4colorhex").value = items["ambilight4colorhex"];
		else $("ambilight4colorhex").value = "#0000FF";
		if(items["fadein"] == true)$("fadein").checked = true;
		if(items["fadeout"] == true)$("fadeout").checked = true;
		if(items["sharebar"] == true)$("sharebar").checked = true;
		if(items["count"] == true)$("count").checked = true;
		if(items["slideshow"] == true)$("slideshow").checked = true;
		if(items["slideshowrefresh"])$("slideshowrefresh").value = items["slideshowrefresh"];
		else $("slideshowrefresh").value = 5;
		if(items["optionskipremember"] == true){ $("optionskipremember").checked = true; $("firstcheckboxskipremember").checked = true; }
		if(items["atmosvivid"] == true)$("atmosvivid").checked = true;

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

		// enable paint job
		test();

		// default example2 is not display
		$("example2").style.opacity = 0; $("example2").style.display = "none";
	});// chrome storage end
} // end read

// animation browser engine
window.requestAnimFrame = function(){
	return(
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(/* function */ callback){
			window.setTimeout(callback, 1000 / 60);
		}
	);
}();

// ambilight draw code
function drawImage(){
	// clean canvas
	var clearcanvas = $("stefanvdvivideffect");
	var clearcontext = clearcanvas.getContext("2d");
	clearcontext.clearRect(0, 0, clearcanvas.width, clearcanvas.height);

	var showtime = $("beeld");
	var getblur = $("ambilightrangeblurradius").value + "px";
	var getspread = $("ambilightrangespreadradius").value + "px";

	if($("ambilight").checked == true){
		if($("ambilightvarcolor").checked == true){
			if($("atmosvivid").checked == true){
				showtime.style.boxShadow = "";
				var calcvividscale = 1 + ($("ambilightrangespreadradius").value / 100);
				var calcblur = $("ambilightrangeblurradius").value;
				if($("stefanvdvivideffect")){
					var stefanvdvivideffect = $("stefanvdvivideffect");
					stefanvdvivideffect.style.webkitTransform = "scale(" + calcvividscale + ")";
					stefanvdvivideffect.style.webkitFilter = "blur(" + calcblur + "px)";
					stefanvdvivideffect.style.opacity = .88;
					var vividctx = stefanvdvivideffect.getContext("2d");
					var imageObj = new Image();
					imageObj.onload = function(){
						vividctx.drawImage(imageObj, 0, 0, 640, 280);
					};
					imageObj.src = showtime.src;
				}
			}else{
				var sourceWidth = showtime.width;
				var sourceHeight = showtime.height;

				var totlcheckcanvas = $("totlCanvas1");
				if(!totlcheckcanvas){
					var totlnewcanvas = document.createElement("canvas");
					totlnewcanvas.setAttribute("id", "totlCanvas1");
					totlnewcanvas.width = "4";
					totlnewcanvas.height = "1";
					totlnewcanvas.style.display = "none";
					document.body.appendChild(totlnewcanvas);
				}

				var canvas = $("totlCanvas1");
				var context = canvas.getContext("2d");
				var colorlamp1X = (sourceWidth * 50) / 100; // up midden
				var colorlamp1Y = (sourceHeight * 95) / 100;
				var colorlamp2X = (sourceWidth * 95) / 100; // right midden
				var colorlamp2Y = (sourceHeight * 50) / 100;
				var colorlamp3X = (sourceWidth * 50) / 100; // down midden
				var colorlamp3Y = (sourceHeight * 5) / 100;
				var colorlamp4X = (sourceWidth * 5) / 100; // left midden
				var colorlamp4Y = (sourceHeight * 50) / 100;

				context.drawImage(showtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
				context.drawImage(showtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
				context.drawImage(showtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
				context.drawImage(showtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);

				var p1 = context.getImageData(0, 0, 1, 1).data;
				var p2 = context.getImageData(1, 0, 1, 1).data;
				var p3 = context.getImageData(2, 0, 1, 1).data;
				var p4 = context.getImageData(3, 0, 1, 1).data;
				var hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
				var hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
				var hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
				var hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);

				showtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
			}
		}else if($("ambilightfixcolor").checked){
			var fixhex = $("ambilightcolorhex").value || "#ccc";
			showtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex;
		}else if($("ambilight4color").checked){
			var fix1hex = $("ambilight1colorhex").value || "#FF0000";
			var fix2hex = $("ambilight2colorhex").value || "#FFEE00";
			var fix3hex = $("ambilight3colorhex").value || "#00FF00";
			var fix4hex = $("ambilight4colorhex").value || "#0000FF";
			showtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fix1hex + ", 0px 20px " + getblur + " " + getspread + " " + fix2hex + ", 20px 0px " + getblur + " " + getspread + " " + fix3hex + ", -20px 0px " + getblur + " " + getspread + " " + fix4hex;
		}
	}else{
		showtime.style.boxShadow = "";
	}
}

function rgbToHex(r, g, b){
	if(r > 255 || g > 255 || b > 255)
		throw"Invalid color component";
	return((r << 16) | (g << 8) | b).toString(16);
}

// Fade engine
//  Variable for the fade in and out effect
var opacity = 0;

var ReducingFinished = true;
var OpacityLevelIncrement = 10; //  Percentage value: 1-100
var DIVElementById;
//  Function determines whether we show or hide the item referenced by ElementID
function fader(ActionToTake){
	DIVElementById = $("example2");
	if(ActionToTake == "hide"){ opacity = default_opacity; reduceOpacity(); }else if(ActionToTake == "show"){ increaseOpacity(); }
}

// Makes div increase
function increaseOpacity(){
	DIVElementById.style.display = "";
	// If opacity level is less than default_opacity, we can still increase the opacity
	if((opacity < default_opacity) && (ReducingFinished == true)){
		if((opacity > (default_opacity - 10)) && (ReducingFinished == true)){
			ReducingFinished = true;
			opacity += (default_opacity - opacity);
			DIVElementById.style.opacity = opacity / 100;
			window.requestAnimFrame(increaseOpacity);
		}else{
			ReducingFinished = true;
			opacity += OpacityLevelIncrement;
			DIVElementById.style.opacity = opacity / 100;
			window.requestAnimFrame(increaseOpacity);
		}
	}else{
		ReducingFinished = false;
	}
}

//  Makes div reduce
function reduceOpacity(){
	// If opacity level is greater than 0, we can still reduce the opacity
	if((opacity > 0) && (ReducingFinished == false)){
		ReducingFinished = false;
		opacity -= OpacityLevelIncrement;
		DIVElementById.style.opacity = opacity / 100;
		window.requestAnimFrame(reduceOpacity);
	}else{
		ReducingFinished = true;

		//  When finished, make sure the DIVElementById is set to remove element
		if(DIVElementById.style.opacity == "0"){ DIVElementById.style.display = "none"; }
	}
}

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

// fade effects control -> not when loaded page
function lightscontrol(){
	var jump = $("interval").value;
	default_opacity = jump;
	if($("onoffrange").value == 0){
		if($("fadeout").checked == true){ ReducingFinished = false; fader("hide"); }else{ $("example2").style.opacity = 0; $("example2").style.display = "none"; }
	}else{
		if($("fadein").checked == true){ ReducingFinished = true; fader("show"); }else{ $("example2").style.opacity = jump / 100; $("example2").style.display = "block"; }
	}
}

function showValue(newValue){ $("interval").value = newValue; $("slider").value = newValue; $("example2").style.opacity = (newValue / 100); }
function showambilightblurValue(newValue){ $("ambilightrangeblurradius").value = newValue; $("arangeblur").value = newValue; }
function showambilightspreadValue(newValue){ $("ambilightrangespreadradius").value = newValue; $("arangespread").value = newValue; }

function test(){
	drawImage();

	if($("ambilight").checked == true){ $("arangespread").disabled = false; $("ambilightrangespreadradius").disabled = false; $("arangeblur").disabled = false; $("ambilightrangeblurradius").disabled = false; $("ambilightfixcolor").disabled = false; $("ambilightvarcolor").disabled = false; $("ambilightcolorhex").disabled = false; $("ambilight4color").disabled = false; $("ambilight1colorhex").disabled = false; $("ambilight2colorhex").disabled = false; $("ambilight3colorhex").disabled = false; $("ambilight4colorhex").disabled = false; $("atmosvivid").disabled = false; }else{ $("arangespread").disabled = true; $("ambilightrangespreadradius").disabled = true; $("arangeblur").disabled = true; $("ambilightrangeblurradius").disabled = true; $("ambilightfixcolor").disabled = true; $("ambilightvarcolor").disabled = true; $("ambilightcolorhex").disabled = true; $("ambilight4color").disabled = true; $("ambilight1colorhex").disabled = true; $("ambilight2colorhex").disabled = true; $("ambilight3colorhex").disabled = true; $("ambilight4colorhex").disabled = true; $("atmosvivid").disabled = true; }

	$("example2").style.backgroundColor = $("lightcolor").value;
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
				if(x == "activeTab"){ textperm = chrome.i18n.getMessage("permissionactivetab"); }else if(x == "contextMenus"){ textperm = chrome.i18n.getMessage("permissioncontextmenu"); }else if(x == "storage"){ textperm = chrome.i18n.getMessage("permissionstorage"); }else if(x == "tabs"){ textperm = chrome.i18n.getMessage("permissiontabs"); }else if(x == "pageCapture"){ textperm = chrome.i18n.getMessage("permissionpagecapture"); }else if(x == "clipboardWrite"){ textperm = chrome.i18n.getMessage("permissionclipwrite"); }else if(x == "clipboardRead"){ textperm = chrome.i18n.getMessage("permissionclipread"); }else if(x == "bookmarks"){ textperm = chrome.i18n.getMessage("permissionbookmarks"); }else if(x == "scripting"){ textperm = chrome.i18n.getMessage("permissionscripting"); }else if(x == "webNavigation"){ textperm = chrome.i18n.getMessage("permissionwebnavigation"); }
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
		$("shareboxtwitter").addEventListener("click", function(){ window.open("https://x.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", "Share to X", "width=600,height=460,menubar=no,location=no,status=no"); });
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

	// Slider
	$("slider").addEventListener("change", function(){ showValue(this.value); save_options(); });
	$("slider").addEventListener("input", function(){ showValue(this.value); save_options(); });

	// Detect lightcolor change
	$("lightcolor").addEventListener("change", function(){ $("example2").style.background = this.value; save_options(); });

	// Interval
	$("interval").addEventListener("change", function(){ showValue(this.value); save_options(); });

	// Light switch
	$("onoffrange").addEventListener("change", function(){ lightscontrol(); });

	// Arangeblur
	$("arangeblur").addEventListener("change", function(){ showambilightblurValue(this.value); save_options(); });
	$("arangeblur").addEventListener("input", function(){ showambilightblurValue(this.value); test(); });
	$("ambilightrangeblurradius").addEventListener("change", function(){ showambilightblurValue(this.value); save_options(); });

	// Arangespread
	$("arangespread").addEventListener("change", function(){ showambilightspreadValue(this.value); save_options(); });
	$("arangespread").addEventListener("input", function(){ showambilightspreadValue(this.value); test(); });
	$("ambilightrangespreadradius").addEventListener("change", function(){ showambilightspreadValue(this.value); save_options(); });

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