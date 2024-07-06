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

// Importing the constants
// Execute if importScripts is support such as Google Chrome and not Firefox
if(typeof importScripts !== "undefined"){
	// eslint-disable-next-line no-undef
	importScripts("constants.js");
}

var currentURL; var allzoom; var allzoomvalue; var zoombydomain; var zoombypage; var defaultallscreen; var defaultsinglescreen; var goturlinside = false; var currentscreen; var chromedisplay; var screenzoom; var zoomsingleclick; var zoomnewsingleclick; var zoomdoubleclick; var zoomoutdoubleclick; var contexta; var contextb; var contextc; var websitepreset;
var currentRatio = 1; var ratio = 1; var job = null;
var webjob; var websitezoom = {}; var badge; var steps; var lightcolor; var zoomchrome; var zoomweb; var zoomfont; var ignoreset; var webpop;

chrome.runtime.onMessage.addListener(function request(request, sender){
	switch(request.name){
	case"bckreload":
		installation();
		break;
	case"redirectionoptions":
		chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
			chrome.tabs.remove(tabs[0].id);
			chrome.runtime.openOptionsPage();
		});
		break;
	case"getallRatio":
		currentURL = request.website;
		chromedisplay = request.screen;
		chrome.storage.sync.get(["allzoom", "allzoomvalue", "websitezoom", "badge", "lightcolor", "zoomchrome", "zoomweb", "zoombydomain", "zoombypage", "defaultallscreen", "defaultsinglescreen", "screenzoom", "zoomfont", "ignoreset"], function(response){
			allzoom = response.allzoom; if(allzoom == null)allzoom = false; // default allzoom false
			allzoomvalue = response.allzoomvalue; if(allzoomvalue == null)allzoomvalue = 1; // default allzoomvalue value
			badge = response.badge; if(badge == null)badge = false;
			lightcolor = response.lightcolor; if(lightcolor == null)lightcolor = "#3cb4fe";
			zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false;
			zoomweb = response.zoomweb; if(zoomweb == null)zoomweb = true;
			zoomfont = response.zoomfont; if(zoomfont == null)zoomfont = false;
			zoombydomain = response.zoombydomain; if(zoombydomain == null)zoombydomain = true;
			zoombypage = response.zoombypage; if(zoombypage == null)zoombypage = false;
			if(zoombydomain == true){
				currentURL = currentURL.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/)[0];
			}
			defaultallscreen = response.defaultallscreen; if(defaultallscreen == null)defaultallscreen = true;
			defaultsinglescreen = response.defaultsinglescreen; if(defaultsinglescreen == null)defaultsinglescreen = false;
			websitezoom = response["websitezoom"];
			// if empty use this
			if(typeof websitezoom == "undefined" || websitezoom == null){
				websitezoom = JSON.stringify({"https://www.example.com": ["90"], "https://www.nytimes.com": ["85"]});
			}
			websitezoom = JSON.parse(websitezoom);
			ignoreset = response.ignoreset; if(ignoreset == null)ignoreset = false;

			//---
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
					if(satbbuf[i] == chromedisplay){
						allzoomvalue = screenzoom[satbbuf[i]] / 100;
					}
				}

			}

			//---
			if(allzoom == true){
				chrome.tabs.query({active: true, currentWindow: true},
					function(tabs){
						// NOTE
						// do not open the Chrome dev background script, else it detect this as first active tab and window
						if(tabs[0]){
							chrome.tabs.getZoom(tabs[0].id, function(zoomFactor){
								if(zoomFactor != allzoomvalue){
									if(zoomchrome == true){
										chrome.tabs.setZoom(tabs[0].id, allzoomvalue); // needed for the default zoom value such as 110%
									}else if(zoomweb == true){
										// Check for transform support so that we can fallback otherwise
										chrome.tabs.query({}, function(opentabs){
											opentabs.forEach(function(opentab){
												// inject only if different than 1
												if(allzoomvalue != 1){
													chrome.tabs.sendMessage(opentab.id, {text:"setbodycsszoom", value:allzoomvalue});
												}
											});
										});
									}else if(zoomfont == true){
										chrome.tabs.sendMessage(tabs[0].id, {text: "changefontsize", value: Math.round(allzoomvalue * 100)});
									}
								}else{
									// Needed if the zoom value is the same, update the badge value
									setBadgeValue(allzoomvalue, tabs[0].id);
								}
							});
						}
					});
			}else{
				var atbbuf = [];
				var domainsv;
				for(domainsv in websitezoom){ atbbuf.push(domainsv); atbbuf.sort(); }
				var isv;
				var lsv = atbbuf.length;
				for(isv = 0; isv < lsv; isv++){
					if(atbbuf[isv] == currentURL){
						var tempatbbuf = atbbuf[isv];
						var editzoom = websitezoom[atbbuf[isv]] / 100;
						chrome.tabs.query({},
							function(tabs){
								tabs.forEach(function(tab){
									var tor = tab.url;
									if(typeof tor !== "undefined"){
										var filtermatch = tor.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/);
										if(zoombydomain == true){ if(filtermatch){ webtor = filtermatch[0]; } }else{ var webtor = tor; }
										if(webtor == tempatbbuf){
											if(zoomchrome == true){
												chrome.tabs.getZoom(sender.tab.id, function(zoomFactor){
													if(zoomFactor != editzoom){
														// this to keep to zoom level by tab and not the whole domain (= automatic)
														if(zoombypage == true){
															chrome.tabs.setZoomSettings(sender.tab.id, {mode: "automatic", scope: "per-tab"},
																function(){
																	if(chrome.runtime.lastError){
																		// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
																	}
																});
														}else{
															chrome.tabs.setZoomSettings(sender.tab.id, {mode: "automatic"/* , scope: 'per-tab'*/},
																function(){
																	if(chrome.runtime.lastError){
																		// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
																	}
																});
														}
														chrome.tabs.setZoom(sender.tab.id, editzoom); // needed for the default zoom value such as 110%
													}
												});
											}else if(zoomweb == true){
												// inject only if different than 1
												if(editzoom != 1){
													chrome.tabs.sendMessage(tab.id, {text:"setbodycsszoom", value:editzoom});
												}
											}else if(zoomfont == true){
												chrome.tabs.sendMessage(tab.id, {text: "changefontsize", value: Math.round(editzoom * 100)});
											}
											setBadgeValue(editzoom, tab.id);
										}
									}
								});
							});
						goturlinside = true;
					}
				}

				// URL is not in the table, so use the default zoom value (that by screen size)
				// reset got inside
				if(goturlinside != true){
					// use default zoom from the Options page -- normal is 100%
					chrome.tabs.query({active: true, currentWindow: true},
						function(){
							chrome.tabs.getZoom(sender.tab.id, function(zoomFactor){
								if(zoomFactor != allzoomvalue){
									if(zoomchrome == true){
										// this to keep to zoom level by tab and not the whole domain (= automatic)
										if(zoombypage == true){
											chrome.tabs.setZoomSettings(sender.tab.id, {mode: "automatic", scope: "per-tab"},
												function(){
													if(chrome.runtime.lastError){
														// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
													}
												});
										}else{
											chrome.tabs.setZoomSettings(sender.tab.id, {mode: "automatic"/* , scope: 'per-tab'*/},
												function(){
													if(chrome.runtime.lastError){
														// console.log('[ZoomDemoExtension] doSetMode() error: ' + chrome.runtime.lastError.message);
													}
												});
										}
										// If set not to ignore, then it set it back to the default zoom value that is set by the Zoom browser extension
										if(ignoreset != true){
											chrome.tabs.setZoom(sender.tab.id, allzoomvalue); // needed for the default zoom value such as 110%
											setBadgeValue(allzoomvalue, sender.tab.id);
										}
									}else if(zoomweb == true){
										// inject only if different than 1
										if(allzoomvalue != 1){
											chrome.tabs.sendMessage(sender.tab.id, {text:"setbodycsszoom", value:allzoomvalue});
										}
										setBadgeValue(allzoomvalue, sender.tab.id);
									}else if(zoomfont == true){
										chrome.tabs.sendMessage(sender.tab.id, {text: "changefontsize", value: Math.round(allzoomvalue * 100)});
										setBadgeValue(allzoomvalue, sender.tab.id);
									}
								}else{
									setBadgeValue(allzoomvalue, sender.tab.id);
								}
							});
						});
				}
				goturlinside = false;
			}
		});
		break;
	case"contextmenuon":
		checkcontextmenus();
		break;
	case"contextmenuoff":
		removecontexmenus();
		break;
	case"contentzoomin":
		zoomview(+1);
		break;
	case"contentzoomout":
		zoomview(-1);
		break;
	case"getscreenshot":
		chrome.tabs.captureVisibleTab(null, {"format": "png"}, function(dataURI){
			if(typeof dataURI !== "undefined"){
				chrome.tabs.sendMessage(sender.tab.id, {text: "showmagnifyglass", value: dataURI});
			}
		});
		break;
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	}
});

function setBadgeValue(thatvalue, thattabid){
	// console.log("Set badge = " + thatvalue * 100);
	if(badge == true){
		chrome.action.setBadgeBackgroundColor({color:lightcolor});
		chrome.action.setBadgeText({text:"" + Math.round(thatvalue * 100) + "", tabId: thattabid});
	}else{ chrome.action.setBadgeText({text:""}); }
}

chrome.webNavigation.onCommitted.addListener(({tabId, frameId, url}) => {
	// Filter out non main window events.
	if(frameId !== 0)return;
	setTabView(tabId, url);
});

function setTabView(tabId, url){
	if(tabId >= 0){
		if(url.match(/^http/i) || url.match(/^file/i)){
			chrome.scripting.executeScript({
				target: {tabId: tabId},
				files: ["scripts/zoom.js"],
				injectImmediately: true
			}, function(){
				if(chrome.runtime.lastError){
					// if current tab do not have the content.js and can not send the message to local chrome:// page.
					// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
					// console.log("ERROR: ", chrome.runtime.lastError);
				}
				// viewController.setactionzoom(tabId, viewSettings)
			});
		}
	}
}

// Begin zoom engine ---
function zoom(ratio){
	currentRatio = ratio / 100;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ zoomtab(tabs[0].id, currentRatio); });
}

function zoomtab(a, b){
	// console.log(Math.round(b * 100));
	if(zoomchrome == true){
		if(allzoom == true){
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						chrome.tabs.setZoom(tab.id, b);
					});
				});
		}else{
			try{
				chrome.tabs.setZoom(a, b);
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
							chrome.tabs.sendMessage(tab.id, {text:"setbodycsszoom", value:b});
						}catch(e){
							// console.log(e);
						}
						setBadgeValue(b, tab.id);
					});
				});
		}else{
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						var pop = tab.url;
						if(typeof pop !== "undefined"){
							var filtermatch = pop.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/);
							if(zoombydomain == true){ if(filtermatch){ webpop = filtermatch[0]; } }else{ webpop = pop; }
							if(webpop == webjob){
								try{
									chrome.tabs.sendMessage(tab.id, {text:"setbodycsszoom", value:b});
								}catch(e){
									// console.log(e);
								}
								setBadgeValue(b, tab.id);
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
						chrome.tabs.sendMessage(tab.id, {text: "changefontsize", value: Math.round(b * 100)});
						setBadgeValue(b, tab.id);
					});
				});
		}else{
			chrome.tabs.query({},
				function(tabs){
					tabs.forEach(function(tab){
						var pop = tab.url;
						if(typeof pop !== "undefined"){
							var filtermatch = pop.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/);
							if(zoombydomain == true){ if(filtermatch){ webpop = filtermatch[0]; } }else{ webpop = pop; }
							if(webpop == webjob){
								chrome.tabs.sendMessage(tab.id, {text: "changefontsize", value: Math.round(b * 100)});
								setBadgeValue(b, tab.id);
							}
						}
					});
				});
		}
	}

	// saving feature
	if(allzoom == true){
		// save for all zoom feature
		chrome.storage.sync.set({"allzoomvalue": b});
	}else{
		var atbbuf = [];
		var domain;
		for(domain in websitezoom){ atbbuf.push(domain); atbbuf.sort(); }
		var i;
		var l = atbbuf.length;
		// website is in the list,
		for(i = 0; i < l; i++){
			if(atbbuf[i] == webjob){ // update
				if(b == 1){
					// remove from list
					delete websitezoom["" + atbbuf[i] + ""];
					atbbuf = websitezoom;
				}else{
					// update ratio
					websitezoom["" + atbbuf[i] + ""] = parseInt(b * 100);
				}
				// save for zoom feature
				chrome.storage.sync.set({"websitezoom":JSON.stringify(websitezoom)});
			}else{
				// add to list
				websitezoom["" + webjob + ""] = parseInt(b * 100);
				// save for zoom feature
				chrome.storage.sync.set({"websitezoom":JSON.stringify(websitezoom)});
			}
		}

		// website is not in the list, then add this new website with his new zoom value
		try{
			if((atbbuf.includes(webjob) != true)){
				// add to list
				websitezoom["" + webjob + ""] = b;
				// save for zoom feature
				chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
			}
		}catch(e){
			// console.log(e);
		}
	}
}
function zoomview(direction){ zoom(nextratio(currentRatio * 100, direction)); }

function nextratio(ratio, direction){
	ratio = Math.round(ratio);
	var prevratio = parseInt(ratio) - parseInt(steps);
	var nextratio = parseInt(ratio) + parseInt(steps);
	if(direction == -1){
		if(ratio == 10){ prevratio = 100; nextratio = 100; }
	}else{
		if(ratio == 400){ prevratio = 100; nextratio = 100; }
	}
	return(direction == -1) ? prevratio : nextratio;
}
// End zoom engine ---

// Set click to zero at beginning
let clickbutton = 0;
// Declare a timer variable
let timer;
var openactiondoubleclick = function(tab){
	// console.log("CLICK zoomdoubleclick= " + zoomdoubleclick + " zoomoutdoubleclick= " + zoomoutdoubleclick + " zoomnewsingleclick= " + zoomnewsingleclick + " zoomsingleclick=" + zoomsingleclick);
	if(zoomdoubleclick == true || zoomoutdoubleclick == true || zoomnewsingleclick == true){
		clickbutton += 1;
		if(clickbutton == 2){
			// console.log("Doubleclick");
			clearTimeout(timer);
			if(zoomdoubleclick == true){
				// zoom in
				zoomview(+1);
			}else if(zoomoutdoubleclick == true){
				// zoom out
				zoomview(-1);
			}else if(zoomnewsingleclick == true){
				setTimeout(function(){
					clickbutton = 0;
					chrome.action.setPopup({tabId: tab.id, popup:""});
				}, 250);
				chrome.action.setPopup({tabId: tab.id, popup:"popup.html"});
				chrome.action.openPopup();
			}
		}

		timer = setTimeout(function(){
			// console.log("Singelclick", clickbutton);
			if(clickbutton == 1){
				if(zoomdoubleclick == true){
					// zoom out
					zoomview(-1);
				}else if(zoomoutdoubleclick == true){
					// zoom out
					zoomview(+1);
				}else if(zoomnewsingleclick == true){
					chrome.tabs.sendMessage(tab.id, {text:"enablemagnifyingglass"});
				}
			}
			clickbutton = 0;
			// Clear all timers
			clearTimeout(timer);
			chrome.action.setPopup({tabId: tab.id, popup:""});
		}, 250);
	}
};
chrome.action.onClicked.addListener(openactiondoubleclick);

function setactionpanel(){
	if(zoomsingleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: "popup.html"});
			});
		});
	}else if(zoomnewsingleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: ""});
			});
		});
	}else if(zoomdoubleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: ""});
			});
		});
	}else if(zoomoutdoubleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: ""});
			});
		});
	}
}

async function getCurrentTab(){
	let queryOptions = {active: true, currentWindow: true};
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

// Get current tab zoom value
function getZoomValue(thattab){
	return new Promise((resolve) => {
		chrome.tabs.getZoom(thattab, (zoomFactor) => {
			if(chrome.runtime.lastError){
				// console.error("ERROR: ", chrome.runtime.lastError);
			}

			const ratio = zoomFactor || 1;
			const currentRatio = ratio * 100;
			resolve(Math.ceil(currentRatio));
		});
	});
}

function sendMessageToTab(thattab, message){
	return new Promise((resolve) => {
		chrome.tabs.sendMessage(thattab, message, (info) => {
			if(chrome.runtime.lastError){
				// console.error("ERROR: ", chrome.runtime.lastError);
			}

			const ratio = info || 1;
			const currentRatio = ratio * 100;
			resolve(Math.ceil(currentRatio));
		});
	});
}

async function getCurrentZoomValue(thattab){
	if(zoomchrome){
		return await getZoomValue(thattab);
	}else if(zoomweb){
		return await sendMessageToTab(thattab, {text: "getwebzoom"});
	}else if(zoomfont){
		return await sendMessageToTab(thattab, {text: "getfontsize"});
	}
}
//---

function backgroundrefreshzoom(){
	chrome.storage.sync.get(["allzoom", "allzoomvalue", "websitezoom", "badge", "steps", "lightcolor", "zoomchrome", "zoomweb", "zoombydomain", "zoombypage", "zoomfont", "ignoreset"], function(response){
		allzoom = response.allzoom; if(allzoom == null)allzoom = false; // default allzoom false
		allzoomvalue = response.allzoomvalue; if(allzoomvalue == null)allzoomvalue = 1; // default allzoomvalue value
		badge = response.badge; if(badge == null)badge = false;
		lightcolor = response.lightcolor; if(lightcolor == null)lightcolor = "#3cb4fe";
		steps = response.steps; if(steps == null)steps = 10;
		zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false;
		zoomweb = response.zoomweb; if(zoomweb == null)zoomweb = true;
		zoomfont = response.zoomfont; if(zoomfont == null)zoomfont = false;
		websitezoom = response.websitezoom;
		zoombydomain = response.zoombydomain; if(zoombydomain == null)zoombydomain = true;
		zoombypage = response.zoombypage; if(zoombypage == null)zoombypage = false;
		// if empty use this
		if(typeof websitezoom == "undefined" || websitezoom == null){
			websitezoom = JSON.stringify({"https://www.example.com": ["90"], "https://www.nytimes.com": ["85"]});
		}
		websitezoom = JSON.parse(websitezoom);
		ignoreset = response.ignoreset; if(ignoreset == null)ignoreset = false;

		getCurrentTab().then((thattab) => {
			if(thattab){
				job = thattab.url;
				if(typeof job !== "undefined"){
					var filtermatch = job.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/);
					if(zoombydomain == true){ if(filtermatch){ webjob = filtermatch[0]; } }else{ webjob = job; }
					if(zoomchrome == true){
						chrome.tabs.getZoom(thattab.id, function(zoomFactor){
							if(chrome.runtime.lastError){
								// if current tab do not have the content.js and can not send the message to local chrome:// page.
								// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
								// console.log("ERROR: ", chrome.runtime.lastError);
							}
							ratio = zoomFactor;
							if(ratio == null){ ratio = 1; }
							currentRatio = ratio;
							setBadgeValue(currentRatio, thattab.id);
						});
					}else if(zoomweb == true){
						chrome.tabs.sendMessage(thattab.id, {text: "getwebzoom"}, function(info){
							if(chrome.runtime.lastError){
								// if current tab do not have the content.js and can not send the message to local chrome:// page.
								// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
								// console.log("ERROR: ", chrome.runtime.lastError);
							}
							if(info == null || info == ""){ info = 1; }
							ratio = info;
							currentRatio = ratio;
							setBadgeValue(currentRatio, thattab.id);
						});
					}else if(zoomfont == true){
						chrome.tabs.sendMessage(thattab.id, {text: "getfontsize"}, function(info){
							if(chrome.runtime.lastError){
								// if current tab do not have the content.js and can not send the message to local chrome:// page.
								// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
								// console.log("ERROR: ", chrome.runtime.lastError);
							}
							if(info == null || info == ""){ info = 1; }
							ratio = info;
							currentRatio = ratio;
							setBadgeValue(currentRatio, thattab.id);
						});
					}
				}
			}
		});
	});
}

chrome.storage.sync.get(["icon"], function(items){
	if(items["icon"] == undefined){
		if(exbrowser == "safari"){
			items["icon"] = "/images/iconstick38safari.png";
		}else{
			items["icon"] = "/images/iconstick38.png";
		}
	}
	chrome.action.setIcon({
		path : {
			"19": items["icon"],
			"38": items["icon"]
		}
	});
});

// update on refresh tab
chrome.tabs.onUpdated.addListener(function(){
	// backgroundrefreshzoom();// Chrome bug, because screen size do not show the correct badge label
	getCurrentTab().then((thattab) => {
		if(thattab){
			chrome.storage.sync.get(["icon"], function(items){
				if(items["icon"] == undefined){
					if(exbrowser == "safari"){
						items["icon"] = "/images/iconstick38safari.png";
					}else{
						items["icon"] = "/images/iconstick38.png";
					}
				}
				chrome.action.setIcon({tabId : thattab.id, path : {"19": items["icon"], "38": items["icon"]}});
			});
		}
	});
});

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(tab){
	backgroundrefreshzoom();
	refreshcontexmenus();
	checkaddpopup(tab);
});

var websitelevel;
chrome.commands.onCommand.addListener(function(command){
	if(command == "toggle-feature-zoomin"){
		zoomview(+1);
	}else if(command == "toggle-feature-zoomout"){
		zoomview(-1);
	}else if(command == "toggle-feature-zoomreset"){
		zoom(allzoomvalue * 100);
	}else if(command == "toggle-feature-magnify"){
		chrome.tabs.query({active: true, currentWindow: true},
			function(tabs){
				if(tabs[0]){
					chrome.tabs.sendMessage(tabs[0].id, {text: "enablemagnifyingglass"});
				}
			});
	}else if(command == "toggle-feature-predefined1"){
		chrome.storage.sync.get(["websitelevel"], function(items){
			websitelevel = items["websitelevel"];
			if(typeof websitelevel == "undefined" || websitelevel == null){
				websitelevel = ["85", "115", "123"];
			}
			// Get the first item and pass it to zoom function
			var firstItem = websitelevel[0];
			zoom(firstItem);
		});
	}else if(command == "toggle-feature-predefined2"){
		chrome.storage.sync.get(["websitelevel"], function(items){
			websitelevel = items["websitelevel"];
			if(typeof websitelevel == "undefined" || websitelevel == null){
				websitelevel = ["85", "115", "123"];
			}
			// Get the second item and pass it to zoom function
			var secondItem = websitelevel[1];
			zoom(secondItem);
		});
	}else if(command == "toggle-feature-predefined3"){
		chrome.storage.sync.get(["websitelevel"], function(items){
			websitelevel = items["websitelevel"];
			if(typeof websitelevel == "undefined" || websitelevel == null){
				websitelevel = ["85", "115", "123"];
			}
			// Get the third item and pass it to zoom function
			var thirdItem = websitelevel[2];
			zoom(thirdItem);
		});
	}

});

// contextMenus
function onClickHandler(info){
	var str = info.menuItemId; var respage = str.substring(0, 8); var czl = str.substring(8); var reszoomin = str.substring(0, 8); var reszoomout = str.substring(0, 9); var reszoomreset = str.substring(0, 11);
	if(respage == "zoompage"){
		chrome.storage.sync.get(["allzoom", "allzoomvalue", "badge", "zoomchrome", "zoomweb", "websitezoom", "zoombydomain", "zoombypage", "zoomfont", "ignoreset"], function(response){
			allzoom = response.allzoom;
			allzoomvalue = response.allzoomvalue; if(allzoomvalue == null)allzoomvalue = 1; // default allzoomvalue value
			badge = response.badge; if(badge == null)badge = false;
			zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false;
			zoomweb = response.zoomweb; if(zoomweb == null)zoomweb = true;
			zoomfont = response.zoomfont; if(zoomfont == null)zoomfont = false;
			websitezoom = response.websitezoom; websitezoom = JSON.parse(websitezoom);
			zoombydomain = response.zoombydomain; if(zoombydomain == null)zoombydomain = true;
			zoombypage = response.zoombypage; if(zoombypage == null)zoombypage = false;
			ignoreset = response.ignoreset; if(ignoreset == null)ignoreset = false;
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				if(zoomchrome == true){
					chrome.tabs.setZoom(tabs[0].id, czl / 100);
				}else if(zoomweb == true){
					chrome.tabs.sendMessage(tabs[0].id, {text:"setbodycsszoom", value:czl / 100});
				}else if(zoomfont == true){
					chrome.tabs.sendMessage(tabs[0].id, {text: "changefontsize", value: Math.round(czl)});
				}
				setBadgeValue(czl, tabs[0].id);
				job = tabs[0].url;
				if(typeof job !== "undefined"){
					var filtermatch = job.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/);
					if(zoombydomain == true){ if(filtermatch){ webjob = filtermatch[0]; } }else{ var webjob = job; }
					if(allzoom == true){
						// save for all zoom feature
						chrome.storage.sync.set({"allzoomvalue": czl / 100});
					}else{
						var atbbuf = [];
						var domain;
						for(domain in websitezoom){ atbbuf.push(domain); atbbuf.sort(); }
						var i;
						var l = atbbuf.length;
						for(i = 0; i < l; i++){
							if(atbbuf[i] == webjob){ // update
								if(parseInt(czl / 100) == 1){
									// remove from list
									delete websitezoom["" + atbbuf[i] + ""];
									break; // go out of the loop because it found the current web page to save the new zoom value
								}else{
									// update ratio
									websitezoom["" + atbbuf[i] + ""] = parseInt(czl);
									break; // go out of the loop because it found the current web page to save the new zoom value
								}
							}else{
								// add to list
								websitezoom["" + webjob + ""] = parseInt(czl);
							}
						}
						// save for zoom feature
						chrome.storage.sync.set({"websitezoom": JSON.stringify(websitezoom)});
					}
				}
			});
		});
	}else if(reszoomin == "ctzoomin"){
		zoomview(+1);
	}else if(reszoomout == "ctzoomout"){
		zoomview(-1);
	}else if(reszoomreset == "ctzoomreset"){
		zoom(allzoomvalue * 100);
	}else if(info.menuItemId == "totlguideemenu"){
		chrome.tabs.create({url: linkguide, active:true});
	}else if(info.menuItemId == "totldevelopmenu"){
		chrome.tabs.create({url: linkdonate, active:true});
	}else if(info.menuItemId == "totlratemenu"){
		chrome.tabs.create({url: writereview, active:true});
	}else if(info.menuItemId == "totlshareemail"){
		var sturnoffthelightemail = "mailto:your@email.com?subject=" + chrome.i18n.getMessage("sharetexta") + "&body=" + chrome.i18n.getMessage("sharetextb") + " " + linkproduct; chrome.tabs.create({url: sturnoffthelightemail, active:true});
	}else if(info.menuItemId == "totlsharex"){
		var slinkproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextd") + " " + linkproduct); chrome.tabs.create({url: "https://twitter.com/intent/tweet?text=" + slinkproductcodeurl, active:true});
	}else if(info.menuItemId == "totlsharefacebook"){
		chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u=" + linkproduct, active:true});
	}else if(info.menuItemId == "totlsubscribe"){
		chrome.tabs.create({url: linkyoutube, active:true});
	}else if(info.menuItemId == "totlshareqq"){
		chrome.tabs.create({url: "https://connect.qq.com/widget/shareqq/index.html?url=" + encodeURIComponent(linkproduct) + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
	}else if(info.menuItemId == "totlshareweibo"){
		chrome.tabs.create({url: "https://service.weibo.com/share/share.php?url=" + linkproduct + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
	}else if(info.menuItemId == "totlsharevkontakte"){
		chrome.tabs.create({url: "https://vk.com/share.php?url=" + linkproduct, active:true});
	}else if(info.menuItemId == "totlsharewhatsapp"){
		chrome.tabs.create({url: "https://api.whatsapp.com/send?text=" + chrome.i18n.getMessage("sharetextd") + "%0a" + linkproduct, active:true});
	}else if(info.menuItemId == "totlapplyresetzoom"){
		// Apply reset zoom to all tabs and in all window
		chrome.tabs.query({}, function(tabs){
			var i;
			var l = tabs.length;
			for(i = 0; i < l; i++){
				if(chrome.runtime.lastError){
					// if current tab do not have the content.js and can not send the message to local chrome:// page.
					// The line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}'
					// console.log("ERROR: ", chrome.runtime.lastError);
				}
				chrome.tabs.sendMessage(tabs[i].id, {text: "refreshscreen"});
			}
		});
	}
}

// check to remove all contextmenus
if(chrome.contextMenus){
	chrome.contextMenus.removeAll(function(){
	// console.log("contextMenus.removeAll callback");
	});
}

var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenupostonx = chrome.i18n.getMessage("sharemenupostonx");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
// var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");
var sharemenupostonweibo = chrome.i18n.getMessage("sharemenupostonweibo");
var sharemenupostonvkontakte = chrome.i18n.getMessage("sharemenupostonvkontakte");
var sharemenupostonwhatsapp = chrome.i18n.getMessage("sharemenupostonwhatsapp");
var sharemenupostonqq = chrome.i18n.getMessage("sharemenupostonqq");
var sharemenuapplyzoomresettitle = chrome.i18n.getMessage("desapplyzoomreset");

function browsercontext(a, b, c, d){
	var item = {"title": a, "type": "normal", "id": b, "contexts": contexts};
	var newitem;
	if(d != ""){
		item = Object.assign({}, item, {parentId: d});
	}
	if(c != ""){
		newitem = Object.assign({}, item, {icons: c});
	}
	try{
		// try show web browsers that do support "icons"
		// Firefox, Opera, Microsoft Edge
		return chrome.contextMenus.create(newitem);
	}catch(e){
		// catch web browsers that do NOT show the icon
		// Google Chrome
		return chrome.contextMenus.create(item);
	}
}

var actionmenuadded = false;
if(chrome.contextMenus){
	if(actionmenuadded == false){
		actionmenuadded = true;

		var contexts = ["action"];
		browsercontext(sharemenuapplyzoomresettitle, "totlapplyresetzoom", "");

		browsercontext(sharemenuwelcomeguidetitle, "totlguideemenu", {"16": "images/IconGuide.png", "32": "images/IconGuide@2x.png"});
		browsercontext(sharemenudonatetitle, "totldevelopmenu", {"16": "images/IconDonate.png", "32": "images/IconDonate@2x.png"});
		// browsercontext(sharemenuratetitle, "totlratemenu", {"16": "images/IconStar.png", "32": "images/IconStar@2x.png"});

		// Create a parent item and two children.
		var parent = null;
		parent = browsercontext(sharemenusharetitle, "totlsharemenu", {"16": "images/IconShare.png", "32": "images/IconShare@2x.png"});
		browsercontext(sharemenutellafriend, "totlshareemail", {"16": "images/IconEmail.png", "32": "images/IconEmail@2x.png"}, parent);
		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});

		var uiLanguage = chrome.i18n.getUILanguage();
		if(uiLanguage.includes("zh")){
			// Chinese users
			browsercontext(sharemenupostonweibo, "totlshareweibo", {"16": "images/IconWeibo.png", "32": "images/IconWeibo@2x.png"}, parent);
			browsercontext(sharemenupostonqq, "totlshareqq", {"16": "images/IconQQ.png", "32": "images/IconQQ@2x.png"}, parent);
		}else if(uiLanguage.includes("ru")){
			// Russian users
			browsercontext(sharemenupostonvkontakte, "totlsharevkontakte", {"16": "images/IconVkontakte.png", "32": "images/IconVkontakte@2x.png"}, parent);
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconTwitter.png", "32": "images/IconTwitter@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconTwitter.png", "32": "images/IconTwitter@2x.png"}, parent);
		}

		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
		browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.storage.sync.get(["contextmenus", "steps"], function(items){
	if(items["steps"]){ steps = items.steps; if(steps == null)steps = 10; }
	if(items["contextmenus"] == true){ checkcontextmenus(); }
});

// context menu for page and video
var menupage = null;
var contextmenuadded = false;
var contextarraypage = [];
var contextdefault = "100";
var book = [];

var contextzoomin = null;
var contextzoomout = null;
var contextzoomreset = null;

function getcurrentscreensize(){
	if(typeof browser !== "undefined"){
		// Firefox
		browser.windows.getCurrent({populate: true}, function(currentWindow){
			let activeTab = currentWindow.tabs.find((tab) => tab.active);
			let width = activeTab.width;
			let height = activeTab.height;
			return(`${width}x${height}`);
		});
	}else if(typeof chrome !== "undefined"){
		// Chrome
		chrome.system.display.getInfo(function(display_properties){
			return(display_properties[0].bounds.width + "x" + display_properties[0].bounds.height);
		});
	}
}

function checkcontextmenus(){
	// clear it
	removecontexmenus();
	//---
	chrome.storage.sync.get(["allzoomvalue", "screenzoom", "defaultallscreen", "defaultsinglescreen", "contexta", "contextb", "contextc", "websitepreset"], function(items){
		if(items["allzoomvalue"]){ allzoomvalue = items.allzoomvalue; if(allzoomvalue == null)allzoomvalue = 1; }
		if(items["screenzoom"]){ screenzoom = items.screenzoom; }
		if(items["defaultallscreen"]){ defaultallscreen = items.defaultallscreen; if(defaultallscreen == null)defaultallscreen = true; }
		if(items["defaultsinglescreen"]){ defaultsinglescreen = items.defaultsinglescreen; if(defaultsinglescreen == null)defaultsinglescreen = false; }
		if(items["contexta"]){ contexta = items.contexta; if(contexta == null)contexta = true; }
		if(items["contextb"]){ contextb = items.contextb; if(contextb == null)contextb = false; }
		if(items["contextc"]){ contextc = items.contextc; if(contextc == null)contextc = false; }
		websitepreset = items["websitepreset"];
		// if empty use this
		if(typeof websitepreset == "undefined" || websitepreset == null){
			websitepreset = JSON.stringify({"https://www.google.com": ["112", "100", "88"]});
		}

		contextdefault = allzoomvalue * 100;// get the default zoom value for that screen

		currentscreen = getcurrentscreensize();

		if(defaultsinglescreen == true){
			screenzoom = JSON.parse(screenzoom);
			var satbbuf = [];
			var domain;
			for(domain in screenzoom)
				satbbuf.push(domain);
			satbbuf.sort();
			var i;
			var l = satbbuf.length;
			for(i = 0; i < l; i++){
				if(satbbuf[i] == currentscreen){
					contextdefault = screenzoom[satbbuf[i]];
				}
			}
		}
		//---

		if(contextmenuadded == false){
			contextmenuadded = true;
			var contexts = ["page", "selection", "link", "editable", "image", "audio", "video"];
			if(contexta == true){
				book = Array();

				var k;
				for(k = 100; k <= 200; k = k + +steps){
					// skip the first value -> 100
					if(k != 100){
						book.push(k);
					}
				}

				var j;
				for(j = 100; j >= 10; j = j - steps){
					book.push(j);
				}

				// if the default zoom value is inside, then do nothing
				// else add this value in the context menu
				var mySet = new Set(book);
				var hascont = mySet.has(parseInt(contextdefault, 10)); // true
				if(!hascont){
					book.push(contextdefault);
				}

				book.sort(function(a, b){ return b - a; });

				var izoom;
				var lzoom = book.length;
				for(izoom = 0; izoom < lzoom; izoom++){
					if(contextdefault && contextdefault == book[izoom]){
						menupage = chrome.contextMenus.create({"type":"radio", "checked" : true, "id": "zoompage" + book[izoom] + "", "title": "Zoom: " + book[izoom] + "%", "contexts":contexts});
					}else{
						menupage = chrome.contextMenus.create({"type":"radio", "id": "zoompage" + book[izoom] + "", "title": "Zoom: " + book[izoom] + "%", "contexts":contexts});
					}
				}
				contextarraypage.push(menupage);
			}else if(contextb == true){
				var titlezoomin = chrome.i18n.getMessage("titlezoomin");
				var titlezoomout = chrome.i18n.getMessage("titlezoomout");
				var titlezoomreset = chrome.i18n.getMessage("titlezoomreset");
				contextzoomin = chrome.contextMenus.create({"title": titlezoomin, "type":"normal", "id": "ctzoomin", "contexts":contexts});
				contextzoomout = chrome.contextMenus.create({"title": titlezoomout, "type":"normal", "id": "ctzoomout", "contexts":contexts});
				contextzoomreset = chrome.contextMenus.create({"title": titlezoomreset, "type":"normal", "id": "ctzoomreset", "contexts":contexts});
			}else if(contextc == true){
				book = Array();

				getCurrentTab().then((thattab) => {
					if(thattab){
						var sendtab = thattab.id;
						getCurrentZoomValue(sendtab).then((thatzoomvalue) => {
							if(typeof websitepreset === "string"){
								websitepreset = JSON.parse(websitepreset);
								var sortedDomains = Object.keys(websitepreset).sort();

								for(var jsite = 0; jsite < sortedDomains.length; jsite++){
									var pdomain = sortedDomains[jsite];
									var values = websitepreset[pdomain];

									// Check if the array contains '100'
									if(!values.includes("100")){
										// If '100' is not present, add it to the array
										values.unshift("100");
									}

									// Append each option to the list box
									var p;
									var pl = values.length;
									for(p = 0; p < pl; p++){
										job = thattab.url;

										// Check if job is a valid URL
										try{
											var parsedUrl = new URL(job);
											// Check if the protocol is either http or https
											if(parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:"){
												// console.error("Invalid URL protocol:", parsedUrl.protocol);
												continue; // Skip to the next iteration
											}
										}catch(error){
											// Handle the case where job is not a valid URL
											// console.error("Invalid URL:", job);
											continue; // Skip to the next iteration
										}

										var protocolAndDomain = parsedUrl.protocol + "//" + parsedUrl.hostname;
										if(protocolAndDomain.toLowerCase() === pdomain.toLowerCase()){
											book.push(values[p]);
											if(thatzoomvalue == parseInt(values[p])){
												menupage = chrome.contextMenus.create({"type":"radio", "id": "zoompage" + values[p] + "", "title": "Zoom: " + values[p] + "%", "contexts":contexts, "checked": true});
											}else{
												menupage = chrome.contextMenus.create({"type":"radio", "id": "zoompage" + values[p] + "", "title": "Zoom: " + values[p] + "%", "contexts":contexts, "checked": false});
											}
										}
									}
								}
							}
						});

					}
				});
				contextarraypage.push(menupage);
			}
		}

	});

}

function removecontexmenus(){
	// context style b
	if(contextzoomin != null){
		chrome.contextMenus.remove("ctzoomin");
	}
	if(contextzoomout != null){
		chrome.contextMenus.remove("ctzoomout");
	}
	if(contextzoomreset != null){
		chrome.contextMenus.remove("ctzoomreset");
	}
	contextzoomin = null;
	contextzoomout = null;
	contextzoomreset = null;
	// context style a
	var i;
	var l = book.length;
	for(i = 0; i < l; i++){
		menupage = chrome.contextMenus.remove("zoompage" + book[i] + "");
	}
	book = [];
	contextarraypage = [];
	contextmenuadded = false;
}

function refreshcontexmenus(){
	// context style b
	if(contextzoomin != null){
		chrome.contextMenus.remove("ctzoomin");
	}
	if(contextzoomout != null){
		chrome.contextMenus.remove("ctzoomout");
	}
	if(contextzoomreset != null){
		chrome.contextMenus.remove("ctzoomreset");
	}
	contextzoomin = null;
	contextzoomout = null;
	contextzoomreset = null;
	// context style a
	var i;
	var l = book.length;
	for(i = 0; i < l; i++){
		menupage = chrome.contextMenus.remove("zoompage" + book[i] + "");
	}
	book = [];
	contextarraypage = [];
	contextmenuadded = false;
	chrome.storage.sync.get(["contextmenus"], function(items){
		if(items["contextmenus"] == true){ checkcontextmenus(); }
	});
}

function handleZoomed(zoomChangeInfo){
	// console.log("Tab: " + zoomChangeInfo.tabId + " zoomed");
	// console.log("Old zoom: " + zoomChangeInfo.oldZoomFactor);
	// console.log("New zoom: " + zoomChangeInfo.newZoomFactor);
	chrome.storage.sync.get(["badge", "zoomchrome"], function(response){
		badge = response.badge; if(badge == null)badge = false; // default badge false
		zoomchrome = response.zoomchrome; if(zoomchrome == null)zoomchrome = false; // default zoomchrome false
		if(zoomchrome == true){
			// zoom changed
			// set the badge for the browser built-in zoom
			// console.log("ZOOM change= " + zoomChangeInfo.newZoomFactor * 100);
			setBadgeValue(zoomChangeInfo.newZoomFactor, zoomChangeInfo.tabId);
		}
	});
}
chrome.tabs.onZoomChange.addListener(handleZoomed);

chrome.storage.sync.get(["zoomdoubleclick", "zoomoutdoubleclick", "zoomnewsingleclick", "zoomsingleclick"], function(response){
	zoomdoubleclick = response.zoomdoubleclick; if(zoomdoubleclick == null)zoomdoubleclick = false; // default zoomdoubleclick false
	zoomoutdoubleclick = response.zoomoutdoubleclick; if(zoomoutdoubleclick == null)zoomoutdoubleclick = false; // default zoomoutdoubleclick false
	zoomnewsingleclick = response.zoomnewsingleclick; if(zoomnewsingleclick == null)zoomnewsingleclick = false; // default zoomnewsingleclick false
	zoomsingleclick = response.zoomsingleclick; if(zoomsingleclick == null)zoomsingleclick = true; // default zoomsingleclick true

	checkaddpopupalltabs();
});

function checkaddpopup(tab){
	if(zoomsingleclick == true){
		chrome.action.setPopup({tabId: tab.id, popup: "popup.html"});
	}
}

function checkaddpopupalltabs(){
	// first init load, set popup page
	if(zoomsingleclick == true){
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				chrome.action.setPopup({tabId: tab.id, popup: "popup.html"});
			});
		});
	}
}

chrome.storage.onChanged.addListener(function(changes){
	if(changes["icon"]){
		if(changes["icon"].newValue){
			chrome.tabs.query({}, function(tabs){
				var i, l = tabs.length;
				for(i = 0; i < l; i++){
					chrome.action.setIcon({tabId : tabs[i].id,
						path : {
							"19": changes["icon"].newValue,
							"38": changes["icon"].newValue
						}
					});
				}
			}
			);
		}
	}
	if(changes["steps"]){ if(changes["steps"].newValue){ steps = changes["steps"].newValue; refreshcontexmenus(); } }
	if(changes["allzoomvalue"]){ if(changes["allzoomvalue"].newValue){ allzoomvalue = changes["allzoomvalue"].newValue; refreshcontexmenus(); } }
	if(changes["contexta"]){ if(changes["contexta"].newValue == true){ contexta = true; contextb = false; refreshcontexmenus(); } }
	if(changes["contextb"]){ if(changes["contextb"].newValue == true){ contexta = false; contextb = true; refreshcontexmenus(); } }
	if(changes["contextmenus"]){ if(changes["contextmenus"].newValue == true){ checkcontextmenus(); }else{ removecontexmenus(); } }
	if(changes["defaultallscreen"]){
		if(changes["defaultallscreen"].newValue == true){
			defaultallscreen = changes["defaultallscreen"].newValue;
			defaultsinglescreen = false;
			refreshcontexmenus();
		}
	}
	if(changes["defaultsinglescreen"]){
		if(changes["defaultsinglescreen"].newValue == true){
			defaultsinglescreen = changes["defaultsinglescreen"].newValue;
			defaultallscreen = false;
			refreshcontexmenus();
		}
	}
	if(changes["badge"]){
		if(changes["badge"].newValue == true){ chrome.action.setBadgeText({text:"100"}); chrome.action.setBadgeBackgroundColor({color:lightcolor}); }else{ chrome.action.setBadgeText({text:""}); }
	}
	if(changes["lightcolor"]){
		if(changes["lightcolor"].newValue){ chrome.action.setBadgeBackgroundColor({color:changes["lightcolor"].newValue}); }
	}
	if(changes["zoomdoubleclick"]){
		if(changes["zoomdoubleclick"].newValue == true){
			zoomsingleclick = false; zoomnewsingleclick = false; zoomdoubleclick = true; zoomoutdoubleclick = false;
			setactionpanel();
		}
	}
	if(changes["zoomnewsingleclick"]){
		if(changes["zoomnewsingleclick"].newValue == true){
			zoomsingleclick = false; zoomnewsingleclick = true; zoomdoubleclick = false; zoomoutdoubleclick = false;
			setactionpanel();
		}
	}
	if(changes["zoomsingleclick"]){
		if(changes["zoomsingleclick"].newValue == true){
			zoomsingleclick = true; zoomnewsingleclick = false; zoomdoubleclick = false; zoomoutdoubleclick = false;
			setactionpanel();
		}
	}
	if(changes["zoomoutdoubleclick"]){
		if(changes["zoomoutdoubleclick"].newValue == true){
			zoomsingleclick = false; zoomnewsingleclick = false; zoomdoubleclick = false; zoomoutdoubleclick = true;
			setactionpanel();
		}
	}
});

chrome.runtime.setUninstallURL(linkuninstall);

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "2.1", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});