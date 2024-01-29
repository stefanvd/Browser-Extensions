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

This program is distributed in the hope that it will be useful,job
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
var currentRatio = 1; var ratio = 1; var job = null;
var darkmode; var allzoom; var allzoomvalue; var webjob; var websitezoom; var badge; var steps; var lightcolor; var zoomchrome; var zoomweb; var zoombydomain; var zoombypage; var defaultsinglescreen; var zoomfont; var counter; var smallpopup; var largepopup; var modernpopup; var prezoombutton; var websitelevel;

function zoom(ratio){
	currentRatio = ratio / 100;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ zoomtab(tabs[0].id, currentRatio); });
}

// Setup isScrolling variable
var isScrolling;
function codebodyzoom(b){
	document.body.style.zoom = b;
}

function codebodyzoomleft(b){
	document.body.style.transformOrigin = "left top"; document.body.style.transform = "scale(" + b + ")";
}

function zoomtab(a, b){
	document.getElementById("number").value = Math.round(b * 100);
	document.getElementById("range").value = Math.round(b * 100);
	if(zoomchrome == true){
		if(allzoom == true){
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						// only on http, https and ftp website (and not the chrome:extension url)
						if(/^(f|ht)tps?:\/\//i.test(tab.url)){
							chrome.tabs.setZoom(tab.id, b, function(){
								if(chrome.runtime.lastError){
									// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
								}
							});
							if(badge == true){
								chrome.action.setBadgeBackgroundColor({color:lightcolor});
								chrome.action.setBadgeText({text:"" + document.getElementById("number").value + "", tabId: tab.id});
							}else{ chrome.action.setBadgeText({text:""}); }
						}
					});
				});
		}else{
			try{
				chrome.tabs.setZoom(a, b, function(){
					if(chrome.runtime.lastError){
						// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
					}
				});
				if(badge == true){
					chrome.action.setBadgeBackgroundColor({color:lightcolor});
					chrome.action.setBadgeText({text:"" + document.getElementById("number").value + "", tabId: a});
				}else{ chrome.action.setBadgeText({text:""}); }
			}catch(e){
				// console.log(e);
			}
		}
	}else if(zoomweb == true){
		if(allzoom == true){
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						try{
							// only on http, https and ftp website (and not the chrome:extension url)
							if(/^(f|ht)tps?:\/\//i.test(tab.url)){
								var supportsZoom = "zoom" in document.body.style;
								if(supportsZoom){
									chrome.scripting.executeScript({
										target: {tabId: tab.id},
										func: codebodyzoom,
										args: [b]
									}, function(){
										if(chrome.runtime.lastError){
											// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
										}
									});
								}else{
									chrome.scripting.executeScript({
										target: {tabId: tab.id},
										func: codebodyzoomleft,
										args: [b]
									}, function(){
										if(chrome.runtime.lastError){
											// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
										}
									});
								}
							}
						}catch(e){
							// console.log(e);
						}
						if(badge == true){
							chrome.action.setBadgeBackgroundColor({color:lightcolor});
							chrome.action.setBadgeText({text:"" + document.getElementById("number").value + ""});
						}else{ chrome.action.setBadgeText({text:""}); }
					});
				});
		}else{
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						var pop = tab.url;
						if(typeof pop !== "undefined"){
							if(zoombydomain == true){ var webpop = pop.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/)[0]; }else{ webpop = pop; }
							if(webpop == webjob){ // in current tab and not in popup window
								try{
									var supportsZoom = "zoom" in document.body.style;
									if(supportsZoom){
										chrome.scripting.executeScript({
											target: {tabId: tab.id},
											func: codebodyzoom,
											args: [b]
										}, function(){
											if(chrome.runtime.lastError){
												// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
											}
										});
									}else{
										chrome.scripting.executeScript({
											target: {tabId: tab.id},
											func: codebodyzoomleft,
											args: [b]
										}, function(){
											if(chrome.runtime.lastError){
												// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
											}
										});
									}
								}catch(e){
									// console.log(e);
								}
								if(badge == true){
									chrome.action.setBadgeBackgroundColor({color:lightcolor});
									chrome.action.setBadgeText({text:"" + document.getElementById("number").value + "", tabId: tab.id});
								}else{ chrome.action.setBadgeText({text:""}); }
							}
						}
					});
				});
		}
	}else if(zoomfont == true){
		if(allzoom == true){
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						// only on http, https and ftp website (and not the chrome:extension url)
						if(/^(f|ht)tps?:\/\//i.test(tab.url)){
							chrome.tabs.sendMessage(tab.id, {text: "setfontsize"});
							chrome.tabs.sendMessage(tab.id, {text: "changefontsize", value: document.getElementById("number").value});
						}
						if(badge == true){
							chrome.action.setBadgeBackgroundColor({color:lightcolor});
							chrome.action.setBadgeText({text:"" + document.getElementById("number").value + ""});
						}else{ chrome.action.setBadgeText({text:""}); }
					});
				});
		}else{
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						var pop = tab.url;
						if(typeof pop !== "undefined"){
							if(zoombydomain == true){ pop = pop.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/)[0]; }else{ var webpop = pop; }
							if(webpop == webjob){ // in current tab and not in popup window
								chrome.tabs.sendMessage(tab.id, {text: "setfontsize"});
								chrome.tabs.sendMessage(tab.id, {text: "changefontsize", value: document.getElementById("number").value});
								if(badge == true){
									chrome.action.setBadgeBackgroundColor({color:lightcolor});
									chrome.action.setBadgeText({text:"" + document.getElementById("number").value + "", tabId: tab.id});
								}else{ chrome.action.setBadgeText({text:""}); }
							}
						}
					});
				});
		}
	}

	// saving feature
	if(allzoom == true){
		// Clear our timeout throughout the scroll
		// console.log("update the zoom " +document.getElementById("number").value)
		window.clearTimeout(isScrolling);
		counter = 0; // should be out of your function scope
		isScrolling = setTimeout(function(){
			counter += 1;
			if(counter == 1){
				// Run the callback
				// console.log( 'Scrolling has stopped.' );
				// save for all zoom feature
				chrome.storage.sync.set({"allzoomvalue": b});
			}
		}, 250);
	}else{
		// website own zoom value
		// (and skip the saving in browser built-in zoom table => use own table)
		if(zoomchrome == true){
			var atbbuf = [];
			var domain;
			for(domain in websitezoom){ atbbuf.push(domain); atbbuf.sort(); }
			var i;
			var l = atbbuf.length;
			for(i = 0; i < l; i++){
				if(atbbuf[i] == webjob){ // update
					if(b == 1){
						// remove from list
						delete websitezoom["" + atbbuf[i] + ""];
						atbbuf = websitezoom;
						// save for zoom feature
						chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
						break; // go out of the loop because it found the current web page to save the new zoom value
					}else{
						// update ratio from 1 to 400 (and not the 100%)
						websitezoom["" + atbbuf[i] + ""] = document.getElementById("number").value;

						// Clear our timeout throughout the scroll
						// console.log("update the zoom " +document.getElementById("number").value)
						window.clearTimeout(isScrolling);
						counter = 0; // should be out of your function scope
						isScrolling = setTimeout(function(){
							counter += 1;
							if(counter == 1){
								// Run the callback
								// console.log( 'Scrolling has stopped.' );
								// save for zoom feature
								chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
							}
						}, 250);

						break; // go out of the loop because it found the current web page to save the new zoom value
					}
				}
			}
			// The box is empty -> so the list is really empty, then add this website in the list
			// Or -> but website is not inside
			// console.log("dodo: "+atbbuf.includes(webjob));
			try{
				if(atbbuf.length == 0 || (atbbuf.includes(webjob) != true)){
					// add to list
					websitezoom["" + webjob + ""] = document.getElementById("number").value;
					// save for zoom feature
					chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
				}
			}catch(e){
				// console.log(e);
			}
		}else if(zoomweb == true){
			var atbbufzw = [];
			var domainzw;
			for(domainzw in websitezoom){ atbbufzw.push(domainzw); atbbufzw.sort(); }
			var izw;
			var lzw = atbbufzw.length;
			for(izw = 0; izw < lzw; izw++){
				if(atbbufzw[izw] == webjob){ // update
					if(b == 1){
						// remove from list
						delete websitezoom["" + atbbufzw[izw] + ""];
						atbbufzw = websitezoom;

						// save for zoom feature
						chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
						break; // go out of the loop because it found the current web page to save the new zoom value
					}else{
						// update ratio from 1 to 400 (and not the 100%)
						websitezoom["" + atbbufzw[izw] + ""] = document.getElementById("number").value;

						// Clear our timeout throughout the scroll
						// console.log("update the zoom " +document.getElementById("number").value)
						window.clearTimeout(isScrolling);
						counter = 0; // should be out of your function scope
						isScrolling = setTimeout(function(){
							counter += 1;
							if(counter == 1){
								// Run the callback
								// console.log( 'Scrolling has stopped.' );
								// save for zoom feature
								chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
							}
						}, 250);

						break; // go out of the loop because it found the current web page to save the new zoom value
					}
				}
			}
			// The box is empty -> so the list is really empty, then add this website in the list
			// Or -> but website is not inside
			// console.log("dodo: "+atbbufzw.includes(webjob));
			try{
				if(atbbufzw.length == 0 || (atbbufzw.includes(webjob) != true)){
					// add to list
					websitezoom["" + webjob + ""] = document.getElementById("number").value;
					// save for zoom feature
					chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
				}
			}catch(e){
				// console.log(e);
			}
		}else if(zoomfont == true){
			var atbbuff = [];
			var domainf;
			for(domainf in websitezoom){ atbbuff.push(domainf); atbbuff.sort(); }
			var ifn;
			var lfn = atbbuff.length;
			for(ifn = 0; ifn < lfn; ifn++){
				if(atbbuff[ifn] == webjob){ // update
					if(b == 1){
						// remove from list
						delete websitezoom["" + atbbuff[ifn] + ""];
						atbbuff = websitezoom;
						// save for zoom feature
						chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
						break; // go out of the loop because it found the current web page to save the new zoom value
					}else{
						// update ratio from 1 to 400 (and not the 100%)
						websitezoom["" + atbbuff[ifn] + ""] = document.getElementById("number").value;

						// Clear our timeout throughout the scroll
						// console.log("update the zoom " +document.getElementById("number").value)
						window.clearTimeout(isScrolling);
						counter = 0; // should be out of your function scope
						isScrolling = setTimeout(function(){
							counter += 1;
							if(counter == 1){
								// Run the callback
								// console.log( 'Scrolling has stopped.' );
								// save for zoom feature
								chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
							}
						}, 250);

						break; // go out of the loop because it found the current web page to save the new zoom value
					}
				}
			}
			// The box is empty -> so the list is really empty, then add this website in the list
			// Or -> but website is not inside
			// console.log("dodo: "+atbbuff.includes(webjob));
			try{
				if(atbbuff.length == 0 || (atbbuff.includes(webjob) != true)){
					// add to list
					websitezoom["" + webjob + ""] = document.getElementById("number").value;
					// save for zoom feature
					chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
				}
			}catch(e){
				// console.log(e);
			}
		}
	}
}

function zoomview(direction){ zoom(nextratio(currentRatio * 100, direction)); }

// function nextratio(ratio, direction){
// 	ratio = Math.round(ratio);
// 	var prevratio = parseInt(ratio) - parseInt(steps);
// 	var nextratio = parseInt(ratio) + parseInt(steps);
// 	if(direction == -1){
// 		if(ratio == 10){ prevratio = 100; nextratio = 100; }
// 	}else{
// 		if(ratio == 400){ prevratio = 100; nextratio = 100; }
// 	}
// 	return(direction == -1) ? prevratio : nextratio;
// }


function nextratio(ratio, direction){
	ratio = Math.round(ratio);
	var prevratio = parseInt(ratio) - parseInt(steps);
	var nextratio = parseInt(ratio) + parseInt(steps);

	if(direction == -1){
		if(ratio <= 10){
			prevratio = 100;
			nextratio = 100;
		}
	}else{
		if(ratio >= 400){
			prevratio = 100;
			nextratio = 100;
		}
	}

	if(nextratio > 400 || nextratio < 0){
		nextratio = 100;
	}

	return(direction == -1) ? prevratio : nextratio;
}

var tempcurrentpopupzoom = "";
function handle(delta){
	tempcurrentpopupzoom = document.getElementById("number").value;
	if(delta < 0){
		tempcurrentpopupzoom -= Number(1);
		if(tempcurrentpopupzoom != 0 && tempcurrentpopupzoom >= 1){ document.getElementById("number").value = tempcurrentpopupzoom; zoom(tempcurrentpopupzoom); }
	}else{
		if(tempcurrentpopupzoom != 0 && tempcurrentpopupzoom < 400){ tempcurrentpopupzoom = Number(tempcurrentpopupzoom) + Number(1); document.getElementById("number").value = tempcurrentpopupzoom; zoom(tempcurrentpopupzoom); }
	}
	tempcurrentpopupzoom = ""; // reset
}

function wheel(event){
	var delta = 0;
	delta = event.deltaY;
	if(delta){ handle(delta); } // do the UP and DOWN job
	// prevent the mouse default actions using scroll
	if(event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

async function getCurrentTab(){
	let queryOptions = {active: true, currentWindow: true};
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

document.addEventListener("DOMContentLoaded", function(){
	// set tooltip
	$("hund").title = chrome.i18n.getMessage("titleshortzoomreset");
	$("minus").title = chrome.i18n.getMessage("titleshortzoomout");
	$("plus").title = chrome.i18n.getMessage("titleshortzoomin");

	// disable context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	// default settings
	function displayinput(newValue){ document.getElementById("number").value = parseInt(newValue); }
	function showValue(newValue){ document.getElementById("range").value = parseInt(newValue); document.getElementById("number").value = parseInt(newValue); zoom(newValue); }
	$("range").addEventListener("change", function(){ showValue(this.value); });
	$("range").addEventListener("input", function(){ showValue(this.value); });
	$("number").addEventListener("change", function(){ showValue(this.value); });
	$("hund").addEventListener("click", function(){ zoom(allzoomvalue * 100); displayinput(allzoomvalue * 100); });
	$("minus").addEventListener("click", function(){ zoomview(-1); });
	$("plus").addEventListener("click", function(){ zoomview(+1); });

	$("circle").addEventListener("click", function(){
		chrome.storage.sync.set({"zoommagcircle": true, "zoommagsquare": false}, function(){
			chrome.tabs.query({active: true, currentWindow: true},
				function(tabs){
					if(tabs[0]){
						chrome.tabs.sendMessage(tabs[0].id, {text: "enablemagnifyingglass"});
					}
				});
			window.close();
		});
	});
	$("square").addEventListener("click", function(){
		chrome.storage.sync.set({"zoommagcircle": false, "zoommagsquare": true}, function(){
			chrome.tabs.query({active: true, currentWindow: true},
				function(tabs){
					if(tabs[0]){
						chrome.tabs.sendMessage(tabs[0].id, {text: "enablemagnifyingglass"});
					}
				});
			window.close();
		});
	});
	$("options").addEventListener("click", function(){ chrome.runtime.openOptionsPage(); });

	// mouse scroll
	window.addEventListener("wheel", wheel, {passive: false}); // for modern

	chrome.storage.sync.get(["darkmode", "allzoom", "allzoomvalue", "websitezoom", "badge", "steps", "lightcolor", "zoomchrome", "zoomweb", "largepopup", "zoombydomain", "zoombypage", "defaultallscreen", "defaultsinglescreen", "screenzoom", "zoomfont", "smallpopup", "largepopup", "modernpopup", "prezoombutton", "websitelevel"], function(response){
		darkmode = response.darkmode; if(darkmode == null)darkmode = 2; // default Operating System
		allzoom = response.allzoom; if(allzoom == null)allzoom = false; // default allzoom false
		allzoomvalue = response.allzoomvalue; if(allzoomvalue == null)allzoomvalue = 1; // default allzoomvalue value
		badge = response.badge; if(badge == null)badge = false;
		lightcolor = response.lightcolor; if(lightcolor == null)lightcolor = "#3cb4fe";
		steps = response.steps; if(steps == null)steps = 10;
		zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false;
		zoomweb = response.zoomweb; if(zoomweb == null)zoomweb = true;
		zoomfont = response.zoomfont; if(zoomfont == null)zoomfont = false;
		websitezoom = response.websitezoom;
		largepopup = response.largepopup;
		zoombydomain = response.zoombydomain; if(zoombydomain == null)zoombydomain = true;
		zoombypage = response.zoombypage; if(zoombypage == null)zoombypage = false;
		smallpopup = response.smallpopup; if(smallpopup == null)smallpopup = false;
		largepopup = response.largepopup; if(largepopup == null)largepopup = false;
		modernpopup = response.modernpopup; if(modernpopup == null)modernpopup = true;
		prezoombutton = response.prezoombutton; if(prezoombutton == null)prezoombutton = false;
		websitelevel = response.websitelevel;

		if(prezoombutton == true){
			var predefinedbuttons = document.getElementById("predefinedbuttons");
			predefinedbuttons.className = "";

			if(typeof websitelevel == "undefined" || websitelevel == null){
				websitelevel = JSON.stringify({"85": true, "115": true, "123": true});
			}

			if(typeof websitelevel == "string"){
				websitelevel = JSON.parse(websitelevel);
				var buf = [];
				for(var psdomain in websitelevel){
					buf.push(parseInt(psdomain)); // Convert keys to integers and push them to the array
				}

				buf.sort(function(a, b){
					return a - b; // Sort the array in ascending order
				});

				for(var ti = 0; ti < buf.length; ti++){
					var newButton = document.createElement("div");
					newButton.className = "btnpreset";
					newButton.textContent = buf[ti];
					newButton.addEventListener("click", function(){
						showValue(parseInt(this.textContent));
					});
					predefinedbuttons.appendChild(newButton);
				}
			}
		}

		if(smallpopup){
			document.getElementById("type").className = "small";
			document.documentElement.className = "small";
		}else if(largepopup){
			document.getElementById("type").className = "large";
			document.documentElement.className = "large";
		}else if(modernpopup){
			document.getElementById("type").className = "modern";
			document.documentElement.className = "modern";
		}

		if(exbrowser == "safari"){
			document.body.className = "transparent";
		}else{
			// dark mode
			var thattheme;
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
		}
		document.body.className = thattheme + " general";


		defaultsinglescreen = response.defaultsinglescreen;
		if(defaultsinglescreen == true){
			var screenzoom = response["screenzoom"];
			screenzoom = JSON.parse(screenzoom);
			var satbbuf = [];
			var domain;
			for(domain in screenzoom)
				satbbuf.push(domain);
			satbbuf.sort();
			var i;
			var l = satbbuf.length;
			for(i = 0; i < l; i++){
				if(satbbuf[i] == screen.width + "x" + screen.height){
					allzoomvalue = screenzoom[satbbuf[i]] / 100;
				}
			}
		}

		// if empty use this
		if(typeof websitezoom == "undefined" || websitezoom == null){
			websitezoom = JSON.stringify({"https://www.example.com": ["90"], "https://www.nytimes.com": ["85"]});
		}
		websitezoom = JSON.parse(websitezoom);

		getCurrentTab().then((thattab) => {
			job = thattab.url;
			if(typeof job !== "undefined"){
				if(zoombydomain == true){
					webjob = job.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/)[0];
				}else{ webjob = job; }
				if(zoomchrome == true){
					chrome.tabs.getZoom(thattab.id, function(zoomFactor){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log('ERROR: ', chrome.runtime.lastError);
						}
						ratio = zoomFactor;
						if(ratio == null){ ratio = 1; }
						currentRatio = ratio;
						document.getElementById("number").value = Math.round(ratio * 100);
						document.getElementById("range").value = Math.round(ratio * 100);
					});
				}else if(zoomweb == true){
					chrome.tabs.sendMessage(thattab.id, {text: "getwebzoom"}, function(info){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log('ERROR: ', chrome.runtime.lastError);
						}
						if(info == null || info == ""){ info = 1; }
						ratio = info;
						currentRatio = ratio;
						document.getElementById("number").value = Math.round(ratio * 100);
						document.getElementById("range").value = Math.round(ratio * 100);
					});
				}else if(zoomfont == true){
					chrome.tabs.sendMessage(thattab.id, {text: "getfontsize"}, function(info){
						if(chrome.runtime.lastError){
							// if current tab do not have the content.js and can not send the message to local chrome:// page.
							// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
							// console.log('ERROR: ', chrome.runtime.lastError);
						}
						if(info == null || info == ""){ info = 1; }
						ratio = info;
						currentRatio = ratio;
						document.getElementById("number").value = Math.round(ratio * 100);
						document.getElementById("range").value = Math.round(ratio * 100);
					});
				}
			}
		});
	});
});