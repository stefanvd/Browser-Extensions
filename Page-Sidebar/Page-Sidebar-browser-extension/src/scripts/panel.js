//================================================
/*

Page Sidebar
Effortlessly open any website in your web browser's sidebar – streamline your workflow instantly!
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

var selectedsearch, searchgoogle, searchbing, searchduckduckgo, searchbaidu, searchyandex, typepanelzone, typepanelcustom, typepanellasttime, websitestartname, websitelasttime, navtop, navbottom, navhidden, opentab, opencopy, opennonebookmarks, openbrowserbookmarks, openquickbookmarks, googlesidepanel, zoom, defaultzoom, step, multipletabs, multivalues, navbuttons, gobutton, typehomezone, typehomecustom, websitehomepagename, preventclose, dragnewtab, mutetab, searchyahoo, search360, searchsogou, searchchatgpt, searchgemini, searchwikipedia, disablehorizontalscroll, openallnewtab, refreshtime, autorefresh, showrefreshpanel, zoomvisible;

// var faviconserver = "https://s2.googleusercontent.com/s2/favicons?&domain=";
var faviconserver = "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=";
var emptypage = "about:blank";

function savepage(){
	chrome.storage.sync.set({"multivalues": multivalues});
}

document.addEventListener("DOMContentLoaded", init);

var i18ntitelcopytext = chrome.i18n.getMessage("titlecopytextdone");
var i18ndescopytext = chrome.i18n.getMessage("descopytextdone");
var i18nmesrefreshed = chrome.i18n.getMessage("mesrefreshed");
var i18nrefreshing = chrome.i18n.getMessage("mesrefreshing");

var i18nbtnon = chrome.i18n.getMessage("btnon");
var i18nbtnoff = chrome.i18n.getMessage("btnoff");

window.addEventListener("message", (e) => {
	// console.log("FIRST WEBSITE URL=", e.data.href, "data", e.data?.method);
	if(e.data?.method === "navigate"){
		// console.log("NAVIGATE URL=", e.data.href);
		if(e.source){
			e.source.postMessage({
				method: "navigate-verified",
				extensionID: chrome.runtime.id
			}, "*");
		}
	}else if(e.data?.method === "complete"){
		// console.log("VISITED WEBSITE URL=", e.data.href, e.data.iframeId);
		// save the URL for close the panel
		if(typepanellasttime == true){
			chrome.storage.sync.set({"websitelasttime": e.data.href});
		}
		// set zoom level
		if(zoom == true && zoomLevel != 100){
			updateZoomLevel();
		}

		// set mute
		if(mutetab == true){
			e.source.postMessage({method: "goMuteOnWebpage"}, "*");
		}

		// set to disable horizontal scroll
		if(disablehorizontalscroll == true){
			e.source.postMessage({method: "goHorizDisableWebpage"}, "*");
		}

		// set to open all links in new web browser tab
		if(openallnewtab == true){
			e.source.postMessage({method: "goOpenAllInNewTab"}, "*");
		}else{
			e.source.postMessage({method: "goOpenAllInCurrentPanel"}, "*");
		}

		// Save website favicon image for current active tab
		frameupdatetabicon(e.data.href, e.data.iframeId);
		// Save website URL in tab
		frameupdatesaveurl(e.data.href, e.data.iframeId);
	}else if(e.data?.method === "copyCurrentURL"){
		createcopymessage(e.data.href);
	}else if(e.data?.method === "newtabCurrentURL"){
		createnewtabmessage(e.data.href);
	}
});

// Elements
var zoomInButton;
var zoomOutButton;
var zoomLevelDisplay;
var zoomLevel = 100;
var collapseHandle;
var zoomPanel;

var refreshHandle;
var refreshPanel;
// Function to update zoom level display
function updateZoomLevel(){
	zoomLevelDisplay.textContent = zoomLevel + "%";

	var newvalue = parseFloat(zoomLevel / 100);
	var iframes = document.getElementById("webcontent").getElementsByTagName("iframe");

	// Loop through all iframes and send the message to each
	for(var i = 0; i < iframes.length; i++){
		iframes[i].contentWindow.postMessage({method: "changeZoomScale", zoom: newvalue}, "*");
	}
}

var i18nclosetab = chrome.i18n.getMessage("closetab");
// Function to show a custom confirmation dialog
function showConfirmationDialog(){
	if(exbrowser == "opera"){
		// Opera does not support confirm in this panel
		return new Promise((resolve) => {
			// Create modal container
			const modal = document.createElement("div");
			modal.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.5);
				display: table;
				z-index: 3000;
				font-family: Arial, sans-serif;
			`;

			// Create modal content
			const modalContent = document.createElement("div");
			modalContent.style.cssText = `
				display: table-cell;
				vertical-align: middle;
				padding: 20px;
			`;

			// Create dialog box
			const dialogBox = document.createElement("div");
			dialogBox.style.cssText = `
				background: var(--ext-primary-background, #fff);
				color: var(--ext-primary-font-color, #000);
				max-width: 400px;
				margin: auto;
				padding: 20px;
				border-radius: 8px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			`;

			// Add message
			const message = document.createElement("p");
			message.textContent = i18nclosetab;
			message.style.cssText = `
				margin: 0 0 20px 0;
				font-size: 14px;
			`;

			// Create button container
			const buttonContainer = document.createElement("div");
			buttonContainer.style.cssText = `
				display: flex;
				justify-content: flex-end;
				gap: 10px;
			`;

			// Create buttons
			const okButton = document.createElement("button");
			okButton.textContent = chrome.i18n.getMessage("titleok");
			okButton.style.cssText = `
				padding: 8px 16px;
				border: none;
				border-radius: 4px;
				background: #4285f4;
				color: white;
				cursor: pointer;
			`;
			okButton.addEventListener("click", () => {
				document.body.removeChild(modal);
				resolve(1);
			});

			const cancelButton = document.createElement("button");
			cancelButton.textContent = chrome.i18n.getMessage("titlecancel");
			cancelButton.style.cssText = `
				padding: 8px 16px;
				border: none;
				border-radius: 4px;
				background: var(--ext-secundar-background, #f1f1f1);
				color: var(--ext-primary-font-color, #000);
				cursor: pointer;
			`;
			cancelButton.addEventListener("click", () => {
				document.body.removeChild(modal);
				resolve(0);
			});

			// Assemble the modal
			buttonContainer.appendChild(cancelButton);
			buttonContainer.appendChild(okButton);
			dialogBox.appendChild(message);
			dialogBox.appendChild(buttonContainer);
			modalContent.appendChild(dialogBox);
			modal.appendChild(modalContent);
			document.body.appendChild(modal);

			// Focus the OK button
			okButton.focus();
		});
	}else{
		// all other web browsers
		// Display the confirmation dialog with custom message
		var result = confirm(i18nclosetab);

		// Check the result and return 1 for 'Yes' and 0 for 'No'
		if(result){
			return 1; // 'Yes' clicked
		}else{
			return 0; // 'No' clicked
		}
	}
}

let actiontimer;
let countdownInterval;

function starttimer(timeInSeconds){
	let remainingTime = timeInSeconds;
	const btn = document.getElementById("currenttime");

	// Display initial message with start time
	btn.innerText = chrome.i18n.getMessage("mesnextrefresh", remainingTime.toString());

	// Clear any previous intervals
	clearInterval(actiontimer);
	clearInterval(countdownInterval);

	// Countdown timer display
	countdownInterval = setInterval(() => {
		remainingTime--;
		if(remainingTime > 0){
			btn.innerText = chrome.i18n.getMessage("mesnextrefresh", remainingTime.toString());
		}else{
			btn.innerText = i18nrefreshing;
		}
	}, 1000);

	// Main refresh action and restart logic
	actiontimer = setInterval(() => {
		// Do the refresh
		// refresh all tabs
		const iframes = document.getElementById("webcontent").getElementsByTagName("iframe");
		for(let i = 0; i < iframes.length; i++){
			iframes[i].contentWindow.postMessage({method: "goReloadWebpage"}, "*");
		}

		// Log or show refresh done
		btn.innerText = i18nmesrefreshed;

		// Restart the timer
		clearInterval(actiontimer);
		clearInterval(countdownInterval);
		setTimeout(() => starttimer(timeInSeconds), 1000); // Wait 1s before restarting
	}, timeInSeconds * 1000);
}


var tabContainer;
var isMenuClick = false;
function init(){
	// allow Firefox permission to run this extension
	// show all the active permissions in a list
	chrome.runtime.sendMessage({name: "getallhost"});
	//----

	// check the drag drop tab strip
	dragtabstrip();

	// Begin multiple tabs
	tabContainer = document.querySelector(".tab-bar");

	tabContainer.addEventListener("click", function(event){
		// change tab
		const targetTab = event.target.closest(".tab");
		if(targetTab && !targetTab.classList.contains("add-tab")){
			setActiveTab(targetTab);
			const index = [...targetTab.parentNode.children].indexOf(targetTab);
			document.getElementById("tabstrip").dataset.active = index;
			setActiveTabContent(index);
			toggleDragDropZone(index);
		}
	});

	tabContainer.addEventListener("click", async function(event){
		if(event.target.classList.contains("tab-close")){
			if(multivalues.length > 1){
				var continueremove = false;
				if(preventclose == true){
					// Example usage with await
					var userResponse = await showConfirmationDialog();
					if(userResponse == 1){
						// yes
						continueremove = true;
						// remove tab
					}else{
						// no
						continueremove = false;
						// do nothing
					}
				}else{
					continueremove = true;
				}

				if(continueremove == true){
					const index = [...event.target.parentNode.parentNode.children].indexOf(event.target.parentNode);
					multivalues = removeObjectAtIndex(index, multivalues);

					// save the website in array only when this option is enable
					if(typepanellasttime == true){
						savepage();
					}

					// Remove the iframe
					var iframeToRemove = document.getElementById("webcontent").getElementsByTagName("iframe")[index];

					var setthattabactive = multivalues.length - 1;

					if(index == 0){
						setthattabactive = 0;
					}else{
						if(index < multivalues.length + 1){
							// example index 1 and length (5 - 1) => YES
							// example index 0 and length (1 - 1) => NO
							setthattabactive = index - 1;
						}else{
							setthattabactive = 0;
						}
					}

					if(iframeToRemove){
						iframeToRemove.parentNode.removeChild(iframeToRemove);
					}

					// remove all tabs
					removeTabs();
					// create all tabs, and set active
					createAllTabsInBar(false);
					// set the current active tab
					document.getElementById("tabstrip").dataset.active = setthattabactive;
					const tabs = document.querySelectorAll(".tab");
					tabs.forEach((t) => t.classList.remove("active"));
					const prevTab = tabs[setthattabactive];
					prevTab.classList.add("active");
					setActiveTabContent(setthattabactive);
					toggleDragDropZone(setthattabactive);
				}
			}
		}
	});

	document.querySelector(".add-tab").addEventListener("click", createNewTab);
	// End multiple tabs ---

	// complete page
	const dragDropZone = document.getElementById("drag-drop-zone");
	const web = document.getElementById("web");
	web.addEventListener("dragenter", (e) => {
		e.preventDefault();
		dragDropZone.className = "show";
		dragDropZone.classList.add("blurlayer");
		// console.log("dragenter");
	});

	dragDropZone.addEventListener("dragover", (e) => {
		e.preventDefault();
		// console.log("dragover");
	});

	dragDropZone.addEventListener("dragleave", (e) => {
		e.preventDefault();
		removeblurlayerfull();
		// console.log("dragleave");
	});

	dragDropZone.addEventListener("drop", handleDrop);

	// navigation bar
	const dragDropNavbar = document.getElementById("drag-drop-navbar");
	const navbar = document.getElementById("navbar");
	navbar.addEventListener("dragenter", (e) => {
		e.preventDefault();
		dragDropNavbar.className = "show";
		// console.log("dragenter");
	});

	dragDropNavbar.addEventListener("dragover", (e) => {
		e.preventDefault();
		// console.log("dragover");
	});

	dragDropNavbar.addEventListener("dragleave", (e) => {
		e.preventDefault();
		dragDropNavbar.className = "hidden";
		// console.log("dragleave");
	});

	dragDropNavbar.addEventListener("drop", handleDrop);

	// Add event listeners to detect mouse enter and leave events
	document.addEventListener("mouseover", handleMouseEnter);
	document.addEventListener("mouseout", handleMouseLeave);

	document.querySelector(".close").addEventListener("click", () => {
		document.getElementById("stefanvdpromo").className = "hidden";
	});

	zoomInButton = document.getElementById("zoom-in-button");
	zoomOutButton = document.getElementById("zoom-out-button");
	zoomLevelDisplay = document.getElementById("zoom-level");
	zoomInButton.addEventListener("click", () => {
		zoomLevel = parseInt(zoomLevel) + parseInt(step);
		updateZoomLevel();
	});

	zoomOutButton.addEventListener("click", () => {
		zoomLevel = parseInt(zoomLevel) - parseInt(step);
		updateZoomLevel();
	});

	collapseHandle = document.getElementById("collapse-handle");
	zoomPanel = document.getElementById("zoombar");

	collapseHandle.addEventListener("click", function(){
		zoomPanel.classList.toggle("collapsed");
		// save zoom visibility
		if(zoomPanel.classList.contains("collapsed")){
			chrome.storage.sync.set({"zoomvisible": false});
		}else{
			chrome.storage.sync.set({"zoomvisible": true});
		}
	});

	refreshHandle = document.getElementById("refresh-handle");
	refreshPanel = document.getElementById("refreshbar");

	refreshHandle.addEventListener("click", function(){
		refreshPanel.classList.toggle("collapsed");
	});

	chrome.storage.sync.get(["firstDate", "optionskipremember", "navtop", "navbottom", "navhidden", "typepanelzone", "typepanelcustom", "typepanellasttime", "websitestartname", "websitelasttime", "searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex", "opentab", "opencopy", "opennonebookmarks", "openbrowserbookmarks", "openquickbookmarks", "websitename1", "websiteurl1", "websitename2", "websiteurl2", "websitename3", "websiteurl3", "websitename4", "websiteurl4", "websitename5", "websiteurl5", "websitename6", "websiteurl6", "websitename7", "websiteurl7", "websitename8", "websiteurl8", "websitename9", "websiteurl9", "websitename10", "websiteurl10", "googlesidepanel", "zoom", "defaultzoom", "step", "multipletabs", "multivalues", "navbuttons", "gobutton", "typehomezone", "typehomecustom", "websitehomepagename", "preventclose", "dragnewtab", "mutetab", "searchyahoo", "search360", "searchsogou", "searchchatgpt", "searchgemini", "searchwikipedia", "disablehorizontalscroll", "openallnewtab", "refreshtime", "autorefresh", "showrefreshpanel", "zoomvisible"], function(items){
		searchgoogle = items["searchgoogle"]; if(searchgoogle == null){ searchgoogle = true; }
		googlesidepanel = items["googlesidepanel"]; if(googlesidepanel == null){ googlesidepanel = true; }
		searchbing = items["searchbing"]; if(searchbing == null){ searchbing = false; }
		searchduckduckgo = items["searchduckduckgo"]; if(searchduckduckgo == null){ searchduckduckgo = false; }
		searchbaidu = items["searchbaidu"]; if(searchbaidu == null){ searchbaidu = false; }
		searchyandex = items["searchyandex"]; if(searchyandex == null){ searchyandex = false; }
		zoom = items["zoom"]; if(zoom == null){ zoom = false; }
		defaultzoom = items["defaultzoom"]; if(defaultzoom == null){ defaultzoom = 100; }
		step = items["step"]; if(step == null){ step = 5; }
		multipletabs = items["multipletabs"]; if(multipletabs == null){ multipletabs = false; }
		multivalues = items["multivalues"]; if(multivalues == null){ multivalues = [{"note":emptypage}]; }
		navbuttons = items["navbuttons"]; if(navbuttons == null){ navbuttons = false; }
		typehomezone = items["typehomezone"]; if(typehomezone == null){ typehomezone = false; }
		typehomecustom = items["typehomecustom"]; if(typehomecustom == null){ typehomecustom = false; }
		websitehomepagename = items["websitehomepagename"]; if(websitehomepagename == null)websitehomepagename = "https://www.google.com";
		preventclose = items["preventclose"]; if(preventclose == null){ preventclose = false; }
		dragnewtab = items["dragnewtab"]; if(dragnewtab == null){ dragnewtab = false; }
		mutetab = items["mutetab"]; if(mutetab == null){ mutetab = false; }
		searchyahoo = items["searchyahoo"]; if(searchyahoo == null){ searchyahoo = false; }
		search360 = items["search360"]; if(search360 == null){ search360 = false; }
		searchsogou = items["searchsogou"]; if(searchsogou == null){ searchsogou = false; }
		searchchatgpt = items["searchchatgpt"]; if(searchchatgpt == null){ searchchatgpt = false; }
		searchgemini = items["searchgemini"]; if(searchgemini == null){ searchgemini = false; }
		searchwikipedia = items["searchwikipedia"]; if(searchwikipedia == null){ searchwikipedia = false; }
		disablehorizontalscroll = items["disablehorizontalscroll"]; if(disablehorizontalscroll == null){ disablehorizontalscroll = false; }
		openallnewtab = items["openallnewtab"]; if(openallnewtab == null){ openallnewtab = false; }
		refreshtime = items["refreshtime"]; if(refreshtime == null){ refreshtime = 10; }
		autorefresh = items["autorefresh"]; if(autorefresh == null){ autorefresh = false; }
		showrefreshpanel = items["showrefreshpanel"]; if(showrefreshpanel == null){ showrefreshpanel = false; }
		zoomvisible = items["zoomvisible"]; if(zoomvisible == null){ zoomvisible = true; }

		// show the tab strip bar or not
		applyStyles(multipletabs);

		// show the button
		if(autorefresh == true){
			document.getElementById("btnstartaction").innerText = i18nbtnon;
		}else{
			document.getElementById("btnstartaction").innerText = i18nbtnoff;
			document.getElementById("currenttime").innerText = "";
		}

		// set the timer
		if(showrefreshpanel == true && autorefresh == true){
			starttimer(refreshtime);
		}

		// show timer panel
		if(showrefreshpanel == true){
			document.getElementById("refreshbar").className = "refresh-panel";
			document.getElementById("btnstartaction").addEventListener("click", function(){
				if(document.getElementById("btnstartaction").innerText == i18nbtnon){
					// stop the timer
					clearInterval(actiontimer);
					clearInterval(countdownInterval);
					document.getElementById("btnstartaction").innerText = i18nbtnoff;
					document.getElementById("currenttime").innerText = "";
				}else{
					// start the timer
					starttimer(refreshtime);
					document.getElementById("btnstartaction").innerText = i18nbtnon;
				}
			}, false);
		}

		//---
		if(zoom == true){
			if(zoomvisible == true){
				document.getElementById("zoombar").className = "zoom-panel";
			}else{
				document.getElementById("zoombar").className = "zoom-panel collapsed";
			}
		}
		zoomLevel = parseInt(defaultzoom);
		zoomLevelDisplay.textContent = defaultzoom + "%";
		//---

		if(searchgoogle){
			selectedsearch = "searchgoogle";
		}else if(searchbing){
			selectedsearch = "searchbing";
		}else if(searchduckduckgo){
			selectedsearch = "searchduckduckgo";
		}else if(searchbaidu){
			selectedsearch = "searchbaidu";
		}else if(searchyandex){
			selectedsearch = "searchyandex";
		}else if(searchyahoo){
			selectedsearch = "searchyahoo";
		}else if(search360){
			selectedsearch = "search360";
		}else if(searchsogou){
			selectedsearch = "searchsogou";
		}else if(searchchatgpt){
			selectedsearch = "searchchatgpt";
		}else if(searchgemini){
			selectedsearch = "searchgemini";
		}else if(searchwikipedia){
			selectedsearch = "searchwikipedia";
		}else{
			selectedsearch = "searchgoogle"; // default
		}
		opentab = items["opentab"]; if(opentab == null){ opentab = false; }
		if(opentab == true){
			document.getElementById("btntab").className = "icon";
		}else{
			document.getElementById("btntab").className = "hidden";
		}
		opencopy = items["opencopy"]; if(opencopy == null){ opencopy = false; }
		if(opencopy == true){
			document.getElementById("btncopy").className = "icon";
		}else{
			document.getElementById("btncopy").className = "hidden";
		}

		gobutton = items["gobutton"]; if(gobutton == null){ gobutton = true; }
		if(gobutton == true){
			document.getElementById("btngo").className = "icon";
		}else{
			document.getElementById("btngo").className = "hidden";
		}

		navbuttons = items["navbuttons"]; if(navbuttons == null){ navbuttons = false; }
		if(navbuttons == true){
			document.getElementById("btnprev").className = "icon";
			document.getElementById("btnnext").className = "icon";
			document.getElementById("btnreload").className = "icon";
		}else{
			document.getElementById("btnprev").className = "hidden";
			document.getElementById("btnnext").className = "hidden";
			document.getElementById("btnreload").className = "hidden";
		}

		opennonebookmarks = items["opennonebookmarks"]; if(opennonebookmarks == null){ opennonebookmarks = false; }
		openbrowserbookmarks = items["openbrowserbookmarks"]; if(openbrowserbookmarks == null){ openbrowserbookmarks = false; }
		openquickbookmarks = items["openquickbookmarks"]; if(openquickbookmarks == null){ openquickbookmarks = false; }
		if(openbrowserbookmarks == true){
			document.getElementById("btnbookmarks").className = "icon";
		}else if(openquickbookmarks == true){
			document.getElementById("btnbookmarks").className = "icon";
		}else{
			document.getElementById("btnbookmarks").className = "hidden";
		}

		// Add menu items
		if(openbrowserbookmarks == true){
			createbrowserbookmark();
		}else if(openquickbookmarks == true){
			createmenuitems(items);
		}else if(opennonebookmarks == true){
			// do nothing
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
			document.getElementById("stefanvdpromo").className = "hidden";
		}else{
			if(items["optionskipremember"] != true){
				document.getElementById("stefanvdpromo").className = ""; // show now always the banner
			}else{
				document.getElementById("stefanvdpromo").className = "hidden";
			}
		}

		typepanelzone = items.typepanelzone; if(typepanelzone == null)typepanelzone = true;
		typepanelcustom = items.typepanelcustom; if(typepanelcustom == null)typepanelcustom = false;
		typepanellasttime = items.typepanellasttime; if(typepanellasttime == null)typepanellasttime = false;
		websitestartname = items.websitestartname; if(websitestartname == null)websitestartname = "https://www.google.com";
		websitelasttime = items.websitelasttime; if(websitelasttime == null)websitelasttime = "https://www.google.com";

		if(multipletabs != true){
			// only for single tab
			if(typepanelcustom == true){
				openweb(websitestartname, true);
			}else if(typepanellasttime == true){
				openweb(websitelasttime, true);
			}
		}

		navtop = items.navtop; if(navtop == null)navtop = true;
		navbottom = items.navbottom; if(navbottom == null)navbottom = false;
		navhidden = items.navhidden; if(navhidden == null)navhidden = false;
		if(navtop == true){
			var elementt = document.getElementById("psidebar");
			elementt.classList.add("top");
		}else if(navbottom == true){
			var elementb = document.getElementById("psidebar");
			elementb.classList.add("bottom");
		}else if(navhidden == true){
			var elementc = document.getElementById("psidebar");
			elementc.classList.add("clean");
		}

		// navigation bar
		document.getElementById("btnhome").addEventListener("click", actionHome, false);
		document.getElementById("btnprev").addEventListener("click", actionPrevTab, false);
		document.getElementById("btnnext").addEventListener("click", actionNextTab, false);
		document.getElementById("btnreload").addEventListener("click", actionReloadTab, false);
		document.getElementById("btngo").addEventListener("click", actionGo, false);
		document.getElementById("searchbar").addEventListener("keypress", handleKeyPress, false);
		document.getElementById("btncopy").addEventListener("click", actionCopyTab, false);
		document.getElementById("btntab").addEventListener("click", actionOpenTab, false);
		document.getElementById("btnbookmarks").addEventListener("click", function(){
			if(document.getElementById("menubookmarks").className == ""){
				document.getElementById("menubookmarks").className = "hidden";
			}else{
				isMenuClick = true;
				document.getElementById("menubookmarks").className = "";
			}
		});
		document.addEventListener("click", ()=>{
			if(!isMenuClick){
				// Hide the menu here
				document.getElementById("menubookmarks").className = "hidden";
			}
			// Reset isMenuClick
			isMenuClick = false;
		});
	});
}

function applyStyles(multipletabs){
	if(multipletabs){
		// multiple tabs
		document.getElementById("tabstrip").className = "tab-bar";

		// show the content
		createTabContent();
	}else{
		// single tab
		document.getElementById("tabstrip").className = "hidden";

		// create one tab
		createiframe(emptypage);
	}
}

function createTabContent(){
	if(multivalues == null){ multivalues = [{"note":emptypage}]; }

	// there is already website from before, so drag drop zone must not be visible
	document.getElementById("drag-drop-info").className = "hidden";
	document.getElementById("drag-drop-zone").className = "hidden";

	// remove all tabs
	removeTabs();
	// create all tabs, and set active
	createAllTabsInBar(true);
	// set the current active tab
	document.getElementById("tabstrip").dataset.active = 0;
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((t) => t.classList.remove("active"));
	const firstTab = tabs[0];
	firstTab.classList.add("active");
	setActiveTabContent(0);
	toggleDragDropZone(0);
}

function toggleDragDropZone(iframeID){
	if(document.getElementById("webcontent").getElementsByTagName("iframe")[iframeID].src == emptypage){
		document.getElementById("drag-drop-info").className = "show";
		document.getElementById("drag-drop-zone").className = "show";
	}else{
		// There is website URL inside, show the tab content
		document.getElementById("drag-drop-info").className = "hidden";
		document.getElementById("drag-drop-zone").className = "hidden";
	}
}

function getFaviconUrl(url){
	if(url === emptypage){
		// Empty page
		// console.log("Favicon logic for emptypage URL=", url);
		return"/images/icon16@2x.png";
	}else if(url.startsWith("file://") || url.startsWith("blob:")){
		// File or Blob URL
		// console.log("Favicon logic for file/blob URL=", url);
		return"/images/icon16@2x.png";
	}else if(url.startsWith("http://") || url.startsWith("https://")){
		// HTTP or HTTPS URL
		// console.log("Favicon logic for web URL=", url);
		return faviconserver + getProtocol(url) + getDomain(url);
	}else{
		// Default case
		// console.log("Favicon logic for other URL=", url);
		return"/images/icon16@2x.png";
	}
}

function frameupdatetabicon(url, iframeId){
	if(multipletabs == true){
		var iframes = document.getElementById("webcontent").getElementsByTagName("iframe");
		var index = -1;

		// Find the index of the iframe using iframeId
		for(var i = 0; i < iframes.length; i++){
			if(iframes[i].id == iframeId){
				index = i;
				break;
			}
		}

		// Get the active tab element
		var thatTab = document.querySelector("#tabstrip .tab:nth-child(" + (index + 1) + ")");

		// Update the image source in the active tab
		if(thatTab){
			var imgElement = thatTab.querySelector("img");
			if(imgElement){
				// Use the universal getFaviconUrl function
				imgElement.src = getFaviconUrl(url);
			}
		}
	}
}

function updatetabicon(url){
	if(multipletabs == true){
		// Get the active tab element
		var activeTab = document.querySelector("#tabstrip .tab.active");
		// console.log("stefan url=", url);

		// Update the image source in the active tab
		if(activeTab){
			var imgElement = activeTab.querySelector("img");
			if(imgElement){
				// Use the universal getFaviconUrl function
				imgElement.src = getFaviconUrl(url);
			}
		}
	}
}

function frameupdatesaveurl(url, iframeId){
	// Only save if multiple tabs are enabled
	if(multipletabs){
		var iframes = document.getElementById("webcontent").getElementsByTagName("iframe");
		var index = -1;

		// Find the index of the iframe using iframeId
		for(var i = 0; i < iframes.length; i++){
			if(iframes[i].id === iframeId){
				index = i;
				break;
			}
		}

		// If the iframe is found, save the URL to the corresponding tab
		if(index !== -1){
			multivalues[index]["note"] = url;

			// Save the changes if necessary
			if(typepanellasttime == true){
				savepage();
			}
		}
	}
}

function updatesaveurl(url){
	// only save for multiple tabs is enabled
	if(multipletabs){
		// Current active tab
		var tabs = document.querySelectorAll("#tabstrip .tab");
		var index = -1;
		// Loop through the elements and find the one with the class "active"
		tabs.forEach((tab, i) => {
			if(tab.classList.contains("active")){
				index = i;
			}
		});
		multivalues[index]["note"] = url;
		if(typepanellasttime == true){
			savepage();
		}
	}
}

// Begin tabs functions
function removeObjectAtIndex(index, array){
	if(index > -1 && index < array.length){
		array.splice(index, 1);
	}
	return array;
}

function removeTabs(){
	var tabs = document.getElementById("tabstrip").querySelectorAll(".tab");
	tabs.forEach(function(tab){
		tab.parentNode.removeChild(tab);
	});
}

function setActiveTab(tab){
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((t) => t.classList.remove("active"));
	tab.classList.add("active");
}

function setActiveTabContent(numb){
	var webcontent = document.getElementById("webcontent");
	var iframes = webcontent.getElementsByTagName("iframe");

	for(var i = 0; i < iframes.length; i++){
		if(i === numb){
			iframes[i].className = "active";
			if(mutetab == true){
				iframes[i].contentWindow.postMessage({method: "goMuteOffWebpage"}, "*");
			}

			if(disablehorizontalscroll == true){
				iframes[i].contentWindow.postMessage({method: "goHorizDisableWebpage"}, "*");
			}

			if(openallnewtab == true){
				iframes[i].contentWindow.postMessage({method: "goOpenAllInNewTab"}, "*");
			}else{
				iframes[i].contentWindow.postMessage({method: "goOpenAllInCurrentPanel"}, "*");
			}
		}else{
			iframes[i].className = "hidden";
			if(mutetab == true){
				iframes[i].contentWindow.postMessage({method: "goMuteOnWebpage"}, "*");
			}
		}
	}
}

function removeWebs(){
	var webcontent = document.getElementById("webcontent");
	var iframes = webcontent.getElementsByTagName("iframe");

	// Loop through the iframes in reverse order and remove each one
	for(var i = iframes.length - 1; i >= 0; i--){
		iframes[i].parentNode.removeChild(iframes[i]);
	}
}

// create tabs with drag and drop in the tab strip
function createAllTabsInBar(createnoweb){
	var totaltabs = multivalues.length;
	// Loop to create the specified number of tabs
	for(var i = 0; i < totaltabs; i++){
		if(createnoweb == true){
			// create the web content
			var page = multivalues[i]["note"];
			createiframe(page);
		}
		// create the tab block
		const newTab = document.createElement("div");
		newTab.classList.add("tab");
		newTab.setAttribute("draggable", "true");
		newTab.addEventListener("dragstart", dragStartHandler);
		newTab.addEventListener("dragend", dragEndHandler);
		const titleDiv = document.createElement("div");
		titleDiv.classList.add("title");
		newTab.appendChild(titleDiv);
		var favicon = document.createElement("img");
		var currenttabfavicon = document.getElementById("webcontent").getElementsByTagName("iframe")[i].src;
		favicon.src = getFaviconUrl(currenttabfavicon);
		favicon.alt = "Favicon";
		favicon.height = 16;
		favicon.width = 16;
		titleDiv.appendChild(favicon); // Append favicon inside the link
		const closeButton = document.createElement("div");
		closeButton.classList.add("tab-close");
		closeButton.textContent = "x";
		newTab.appendChild(closeButton);
		tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
	}
}

// Drag start handler
function dragStartHandler(e){
	const tabStrip = document.getElementById("tabstrip");
	const tabs = Array.from(tabStrip.querySelectorAll(".tab")); // Update tab list
	const index = tabs.indexOf(this); // Get the current index
	this.classList.add("dragging");
	e.dataTransfer.setData("draggingIndex", index); // Store the index of the tab being dragged
}

// Drag end handler
function dragEndHandler(){
	this.classList.remove("dragging");
}

// Function to move the iframe in the same order as the tabs
function moveIframe(oldIndex, newIndex){
	const webContentContainer = document.getElementById("webcontent");
	const iframes = Array.from(webContentContainer.querySelectorAll("iframe")); // Cache NodeList as a static array

	if(oldIndex === newIndex || !iframes[oldIndex])return; // No change or invalid index

	const iframeToMove = iframes[oldIndex]; // Get the iframe to move

	// Move iframe to the new position
	if(newIndex < oldIndex){
		webContentContainer.insertBefore(iframeToMove, iframes[newIndex]);
	}else{
		// Handle insertion after the new index
		if(newIndex + 1 < iframes.length){
			webContentContainer.insertBefore(iframeToMove, iframes[newIndex + 1]);
		}else{
			webContentContainer.appendChild(iframeToMove); // Append at the end if it's last
		}
	}

	// Update iframe order and save changes
	updateIframeOrder();

	// Check which tab is now active
	var activeindex = getActiveTabIndex();
	// Set this tab and iframe as visible
	setActiveTabContent(activeindex);
}

function getDragAfterElement(container, x){
	const draggableElements = [...container.querySelectorAll(".tab:not(.dragging)")];

	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect();
		const offset = x - box.left - box.width / 2;
		if(offset < 0 && offset > closest.offset){
			return{offset: offset, element: child};
		}else{
			return closest;
		}
	}, {offset: Number.NEGATIVE_INFINITY}).element;
}

function updateIframeOrder(){
	// Only update if multiple tabs are enabled
	if(multipletabs){
		var iframes = document.getElementById("webcontent").getElementsByTagName("iframe");

		// Iterate over all iframes and update the multivalues array
		for(var i = 0; i < iframes.length; i++){
			var iframeSrc = iframes[i].src;

			// Update the corresponding multivalues entry
			if(multivalues[i]){
				multivalues[i]["note"] = iframeSrc;

				// Get the tab element
				var thatTab = document.querySelector("#tabstrip .tab:nth-child(" + (i + 1) + ")");

				// Update the image source in the active tab
				if(thatTab){
					var imgElement = thatTab.querySelector("img");
					if(imgElement){
						// Use the universal getFaviconUrl function
						imgElement.src = getFaviconUrl(iframeSrc);
					}
				}
			}
		}
	}
}
// end create tab strip

function createNewTab(){
	const newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.setAttribute("draggable", "true");
	newTab.addEventListener("dragstart", dragStartHandler);
	newTab.addEventListener("dragend", dragEndHandler);
	const titleDiv = document.createElement("div");
	titleDiv.classList.add("title");
	newTab.appendChild(titleDiv);
	var favicon = document.createElement("img");
	favicon.src = "/images/icon16@2x.png";
	favicon.alt = "Favicon";
	favicon.height = 16;
	favicon.width = 16;
	titleDiv.appendChild(favicon); // Append favicon inside the link
	const closeButton = document.createElement("div");
	closeButton.classList.add("tab-close");
	closeButton.textContent = "x";
	newTab.appendChild(closeButton);
	tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
	setActiveTab(newTab);

	// choose type new tab page
	if(typepanelcustom == true){
		// Adding a new object to the array
		multivalues.push({"note": websitestartname});

		createiframe(websitestartname);
		document.getElementById("drag-drop-info").className = "hidden";
		document.getElementById("drag-drop-zone").className = "hidden";
	}else if(typepanelzone == true){
		// Adding a new object to the array
		multivalues.push({"note": emptypage});

		createiframe(emptypage);
		document.getElementById("drag-drop-info").className = "show";
		document.getElementById("drag-drop-zone").className = "show";
	}

	setActiveTabContent(multivalues.length - 1);

	// save the website in array only when this option is enable
	if(typepanellasttime == true){
		savepage();
	}
}

function dragtabstrip(){
	// Add the event listeners for drag-and-drop functionality
	const tabStrip = document.getElementById("tabstrip");
	const addTabButton = tabStrip.querySelector(".add-tab");

	// Allow drag over on the tab strip
	tabStrip.addEventListener("dragover", (e) => {
		e.preventDefault();

		const draggingTab = tabStrip.querySelector(".dragging");
		const afterElement = getDragAfterElement(tabStrip, e.clientX);

		// Prevent placing the dragged tab on the right side of the "add-tab" button
		if(afterElement === addTabButton || afterElement == null){
			tabStrip.insertBefore(draggingTab, addTabButton);
		}else{
			tabStrip.insertBefore(draggingTab, afterElement);
		}
	});

	// Handle drag drop to move iframe
	tabStrip.addEventListener("drop", (e) => {
		e.preventDefault();

		const draggingIndex = parseInt(e.dataTransfer.getData("draggingIndex"));
		const draggingTab = tabStrip.querySelector(".dragging");
		const tabs = Array.from(tabStrip.querySelectorAll(".tab")); // Update tab list after rearranging
		const newTabIndex = tabs.indexOf(draggingTab);

		moveIframe(draggingIndex, newTabIndex);
	});
}

function createiframe(url){
	var webcontent = document.getElementById("webcontent");
	var iframe = document.createElement("iframe");
	const iframeId = "iframe_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
	iframe.setAttribute("id", iframeId);
	iframe.onload = () => {
		iframe.contentWindow.postMessage({
			method: "setIframeId",
			iframeId
		}, "*");
	};
	iframe.src = url;
	iframe.allow = "camera; clipboard-read; clipboard-write; fullscreen; microphone; geolocation";
	iframe.className = "hidden";
	webcontent.appendChild(iframe);
}
// End tabs functions

function createmenuitems(items){
	const menu = document.getElementById("list");
	for(let i = 1; i <= 10; i++){
		const name = items["websitename" + `${i}`];
		const url = items["websiteurl" + `${i}`];
		if(name && url){
			const listItem = document.createElement("li");
			const anchor = document.createElement("a");
			anchor.href = url;

			const favicon = document.createElement("img");
			favicon.src = getFaviconUrl(url);
			favicon.alt = "Favicon";
			favicon.height = 16;
			favicon.width = 16;
			favicon.style.verticalAlign = "middle";

			const textDiv = document.createElement("div");
			textDiv.textContent = name;
			textDiv.style.display = "inline-block";
			textDiv.style.marginLeft = "6px";
			textDiv.style.verticalAlign = "middle";

			anchor.appendChild(favicon);
			anchor.appendChild(textDiv);

			anchor.addEventListener("click", function(event){
				event.preventDefault();
				openweb(url, true);
				document.getElementById("menubookmarks").className = "hidden";
				isMenuClick = false;
			});

			listItem.appendChild(anchor);
			menu.appendChild(listItem);
		}
	}
}

function createbrowserbookmark(){
	// Fetch bookmarks and render them
	chrome.bookmarks.getTree(function(bookmarkTreeNodes){
		renderBookmarks(bookmarkTreeNodes[0].children, document.getElementById("list"));
	});
}

function renderBookmarks(bookmarks, parentElement){
	bookmarks.forEach(function(bookmark){
		if(bookmark.children){
			// Create a sublist for folders
			var sublist = document.createElement("ul");
			sublist.className = "hideitem";
			renderBookmarks(bookmark.children, sublist);
			var listItemsub = document.createElement("li");
			var folderLink = document.createElement("a");
			folderLink.href = "#";
			var folderIcon = document.createElement("img");
			folderIcon.src = "/images/folder@2x.png";
			folderIcon.alt = "Folder Icon";
			folderIcon.height = 16;
			folderIcon.width = 16;
			folderLink.appendChild(folderIcon); // Append folder icon inside the link

			// Create span for bookmark title
			var titleSpan = document.createElement("div");
			titleSpan.textContent = bookmark.title;

			folderLink.appendChild(titleSpan);
			listItemsub.appendChild(folderLink);
			listItemsub.appendChild(sublist);
			parentElement.appendChild(listItemsub);

			// Add event listeners for mouseenter and mouseleave
			listItemsub.addEventListener("mouseenter", function(){
				sublist.className = "showitem";
			});

			listItemsub.addEventListener("mouseleave", function(){
				sublist.className = "hideitem";
			});

			// Add class for CSS styling
			listItemsub.classList.add("bookmark-item");
		}else{
			// Create list item for bookmarks
			var listItem = document.createElement("li");
			var link = document.createElement("a");
			link.href = bookmark.url;
			link.addEventListener("click", function(event){
				// Prevent the default action of following the link
				event.preventDefault();
				openweb(bookmark.url, true);
				// close panel
				document.getElementById("menubookmarks").className = "hidden";
				isMenuClick = false;
			});
			var favicon = document.createElement("img");
			favicon.src = faviconserver + getProtocol(bookmark.url) + getDomain(bookmark.url);
			favicon.alt = "Favicon";
			favicon.height = 16;
			favicon.width = 16;
			link.appendChild(favicon); // Append favicon inside the link

			// Create span for bookmark title
			var titleSpanRoot = document.createElement("div");
			titleSpanRoot.textContent = bookmark.title;

			link.appendChild(titleSpanRoot);
			listItem.appendChild(link);
			parentElement.appendChild(listItem);

			// Add class for CSS styling
			listItem.classList.add("bookmark-item");
		}
	});
}

// Function to extract domain from URL
function getDomain(url){
	var domain;
	// Find & remove protocol (http, https, ftp) and get domain
	if(url.indexOf("://") > -1){
		domain = url.split("/")[2];
	}else{
		domain = url.split("/")[0];
	}
	// Find & remove port number
	domain = domain.split(":")[0];
	return domain;
}

function getProtocol(url){
	var protocol;
	// Check if URL contains protocol
	if(url.indexOf("://") > -1){
		protocol = url.split("://")[0] + "://";
	}else{
		protocol = "";
	}
	return protocol;
}

function actionCopyTab(){
	var index;
	if(multipletabs == true){
		index = getActiveTabIndex();
	}else{
		index = 0;
	}

	var webcontent = document.getElementById("webcontent");
	var iframes = webcontent.getElementsByTagName("iframe");
	iframes[index].contentWindow.postMessage({method: "goCopyCurrentWebpage"}, "*");
}

function createcopymessage(thaturl){
	// Create a temporary textarea element to hold the text
	const textarea = document.createElement("textarea");

	// Assign the text you want to copy to the textarea
	const textToCopy = thaturl;
	textarea.value = textToCopy;

	// Set the textarea to be invisible
	textarea.style.position = "fixed";
	textarea.style.opacity = 0;

	// Append the textarea to the DOM
	document.body.appendChild(textarea);

	// Select the text within the textarea
	textarea.select();

	try{
		// Execute the copy command
		const successful = document.execCommand("copy");
		if(successful){
			// console.log("Text copied to clipboard: " + textToCopy);
			if(showingcopybadge == false){
				showcopytextbadge();
			}
		}else{
			// console.error("Unable to copy text to clipboard");
		}
	}catch(err){
		// console.error("Error copying text to clipboard:", err);
	}

	// Remove the temporary textarea
	document.body.removeChild(textarea);
}

var showingcopybadge = false;
function showcopytextbadge(){
	var div = document.createElement("div");
	div.setAttribute("id", "stefanvdremoteadd");
	div.className = "stefanvdremote";
	document.body.appendChild(div);

	var h3 = document.createElement("h3");
	h3.innerText = i18ntitelcopytext;
	div.appendChild(h3);

	var p = document.createElement("p");
	p.innerText = i18ndescopytext;
	div.appendChild(p);
	showingcopybadge = true;

	window.setTimeout(function(){
		var element = document.getElementById("stefanvdremoteadd");
		element.parentNode.removeChild(element);
		showingcopybadge = false;
	}, 4000);
}

function getActiveTabIndex(){
	const tabs = document.querySelectorAll("#tabstrip .tab");
	let index = -1;
	tabs.forEach((tab, i) => {
		if(tab.classList.contains("active")){
			index = i;
		}
	});
	return index;
}

function postMessageToIframe(method){
	var index;
	if(multipletabs == true){
		index = getActiveTabIndex();
	}else{
		index = 0;
	}
	if(index !== -1){
		const iframe = document.getElementById("webcontent").getElementsByTagName("iframe")[index];
		iframe.contentWindow.postMessage({method: method}, "*");
	}
}

function actionReloadTab(){
	postMessageToIframe("goReloadWebpage");
}

function actionNextTab(){
	postMessageToIframe("goNextWebpage");
}

function actionPrevTab(){
	postMessageToIframe("goBackWebpage");
}

function actionOpenTab(){
	var index;
	if(multipletabs == true){
		index = getActiveTabIndex();
	}else{
		index = 0;
	}

	var webcontent = document.getElementById("webcontent");
	var iframes = webcontent.getElementsByTagName("iframe");
	iframes[index].contentWindow.postMessage({method: "goNewTabCurrentWebpage"}, "*");
}

function createnewtabmessage(iframeURL){
	window.open(iframeURL, "_blank");
}

let previousFileURL = null; // Store the previous file URL

function handleDrop(e){
	e.preventDefault();
	// console.log("link drop here", e);

	// Check if files were dropped
	const files = e.dataTransfer.files;
	if(files.length > 0){
		// Handle file drop
		const file = files[0]; // Get the first file (assuming single file drop)
		// console.log("Dropped file: ", file);

		// Create a local file URL for the new dropped file
		const fileURL = URL.createObjectURL(file);
		// console.log("Local file URL: ", fileURL);

		// Open or handle the file here
		if(multipletabs == true && dragnewtab == true){
			// create a new tab
			createNewTab();
		}
		// open the existing tab
		openweb(fileURL, true);

		// Delay revoking the previous file URL until the iframe has fully loaded the new file
		if(previousFileURL){
			// Revoke the previous file URL after a short delay to prevent early revocation
			setTimeout(() => {
				URL.revokeObjectURL(previousFileURL);
				// console.log("Revoked previous file URL: ", previousFileURL);
			}, 1000); // Adjust the delay if needed
		}

		// Store the new file URL for future revoking
		previousFileURL = fileURL;

		return;
	}

	// If no file was dropped, check for URLs
	const currenturl = e.dataTransfer.getData("text/uri-list");
	if(currenturl){
		try{
			const o = new URL(currenturl);
			if(o.hostname){
				// Revoke the previous file URL if any (cleanup when switching to web URLs)
				if(previousFileURL){
					URL.revokeObjectURL(previousFileURL);
					previousFileURL = null; // Reset for future local file drops
				}

				if(multipletabs == true && dragnewtab == true){
					// create a new tab
					createNewTab();
				}
				return openweb(currenturl, true); // Handle web URLs

			}
		}catch(error){
			console.error("Error processing dropped URL", error);
		}
	}

	// Fallback to plain text handling
	const selectedText = e.dataTransfer.getData("text/plain").trim();
	if(selectedText){
		performSearch(selectedsearch, selectedText);
	}
}

function actionHome(){
	if(typehomecustom == true){
		openweb(websitehomepagename, true);
	}else{
		if(multipletabs == true){
			// Current active tab
			var tabs = document.querySelectorAll("#tabstrip .tab");
			var index = -1;
			// Loop through the elements and find the one with the class "active"
			tabs.forEach((tab, i) => {
				if(tab.classList.contains("active")){
					index = i;
				}
			});

			if(typehomecustom == true){
				openweb(websitehomepagename, true);
			}else if(typehomezone == true){
				// clear it
				if(index >= 0){
					document.getElementById("webcontent").getElementsByTagName("iframe")[index].src = emptypage;
					document.getElementById("webcontent").getElementsByTagName("iframe")[index].className = "hidden";
				}
				// show drag drop
				document.getElementById("drag-drop-info").className = "show";
				document.getElementById("drag-drop-zone").className = "show";

				// update icon
				updatetabicon(emptypage);
				// save empty URL for drag drop
				updatesaveurl(emptypage);
			}
		}else{
			if(typehomecustom == true){
				openweb(websitehomepagename, true);
				updatesaveurl(websitehomepagename);
			}else if(typehomezone == true){
				// clear it
				if(index >= 0){
					document.getElementById("webcontent").getElementsByTagName("iframe")[index].src = emptypage;
					document.getElementById("webcontent").getElementsByTagName("iframe")[index].className = "hidden";
				}
				// show drag drop
				document.getElementById("drag-drop-info").className = "show";
				document.getElementById("drag-drop-zone").className = "show";

				// update icon
				updatetabicon(emptypage);
				// save empty URL for drag drop
				updatesaveurl(emptypage);
			}
		}
	}
}

function actionGo(){
	var searchInput = document.getElementById("searchbar").value.trim();
	if(searchInput != ""){
		// Check if the input is a valid URL
		// capture groups:
		// 1: protocol (https://)
		// 2: domain (mail.google.com)
		// 3: path (/chat/u/0/)
		// 4: query string (?view=list)
		// 5: fragment (#chat/home)
		var urlRegex = /^(https?:\/\/)?((?:[\da-z.-]+)+\.(?:[a-z.]{2,})+)?((?:\/[-a-z\d%_.~+]*)*)(\?[;&a-z\d%_.~+=-]*)?(#.*)?$/i;
		if(urlRegex.test(searchInput)){
			// If it is a URL, navigate to the page
			if(searchInput.startsWith("http://www.") || searchInput.startsWith("https://www.")){
				openweb(searchInput, true);
			}else if(searchInput.startsWith("http://") || searchInput.startsWith("https://")){
				openweb(searchInput, true);
			}else{
				openweb("https://" + searchInput, true);
			}
		}else{
			if(searchInput.startsWith("file:///")){
				openweb(searchInput, true);
			}else{
				// If it is not a URL, perform a text search
				performSearch(selectedsearch, searchInput);
			}
		}
	}
}

function handleKeyPress(event){
	if(event.key === "Enter"){
		actionGo();
	}
}

const openweb = async(currenturl) => {
	var index = -1;
	if(multipletabs){
		// Current active tab
		var tabs = document.querySelectorAll("#tabstrip .tab");
		// Loop through the elements and find the one with the class "active"
		tabs.forEach((tab, i) => {
			if(tab.classList.contains("active")){
				index = i;
			}
		});
	}else{
		index = 0;
	}

	// see background for the chrome.declarativeNetRequest
	// that filter the x-frame-options and content-security-policy

	const dragDropNavbar = document.getElementById("drag-drop-navbar");
	const dragDropZone = document.getElementById("drag-drop-zone");
	const dragDropInfo = document.getElementById("drag-drop-info");

	const iframe = document.getElementById("webcontent").getElementsByTagName("iframe")[index];
	if(iframe){
		// set active panel
		iframe.className = "active";
		// open that web page
		iframe.src = currenturl;
		// Update save tab URL
		updatesaveurl(currenturl);
		// Update icon
		updatetabicon(currenturl);
		// Hide drag-and-drop UI elements if the URL is not empty
		if(iframe.src != "" || iframe.src != null || iframe.src != emptypage){
			dragDropNavbar.className = "hidden";
			dragDropZone.className = "hidden";
			dragDropInfo.className = "hidden";
		}
	}
};

// Function to handle mouse entering the document
function handleMouseEnter(){
	// console.log("Mouse entered the frame.");
}

// Function to handle mouse leaving the document
function handleMouseLeave(){
	// console.log("Mouse left the frame.");
	removeblurlayernav();
	removeblurlayerfull();
}

function removeblurlayerfull(){
	const dragDropZone = document.getElementById("drag-drop-zone");
	if(dragDropZone.classList.contains("blurlayer")){
		dragDropZone.classList.remove("blurlayer");
	}
}

function removeblurlayernav(){
	const dragDropZone = document.getElementById("drag-drop-navbar");
	if(dragDropZone.classList.contains("show")){
		dragDropZone.className = "hidden";
	}
}

function performSearch(searchEngine, query){
	switch(searchEngine){
	case"searchgoogle":
		if(googlesidepanel == true){
			// Google side-by-side search
			// https://www.chromium.org/developers/design-documents/side-by-side-search-for-default-search-engines/
			openweb("https://www.google.com/search?q=" + encodeURIComponent(query) + "&sidesearch=1", true);
		}else{
			openweb("https://www.google.com/search?q=" + encodeURIComponent(query), true);
		}
		break;
	case"searchbing":
		openweb("https://www.bing.com/search?q=" + encodeURIComponent(query), true);
		break;
	case"searchduckduckgo":
		openweb("https://duckduckgo.com/?q=" + encodeURIComponent(query), true);
		break;
	case"searchbaidu":
		openweb("https://www.baidu.com/s?wd=" + encodeURIComponent(query), true);
		break;
	case"searchyandex":
		openweb("https://yandex.com/search/?text=" + encodeURIComponent(query), true);
		break;
	case"searchyahoo":
		openweb("https://search.yahoo.com/search?p=" + encodeURIComponent(query), true);
		break;
	case"search360":
		openweb("https://www.so.com/s?q=" + encodeURIComponent(query), true);
		break;
	case"searchsogou":
		openweb("https://www.sogou.com/web?query=" + encodeURIComponent(query), true);
		break;
	case"searchchatgpt":
		openweb("https://chatgpt.com/?q=" + encodeURIComponent(query), true);
		break;
	case"searchgemini":
		openweb("https://gemini.google.com/?q=" + encodeURIComponent(query), true);
		break;
	case"searchwikipedia":
		openweb("https://wikipedia.org/wiki/" + encodeURIComponent(query), true);
		break;
	default:
		openweb("https://www.google.com/search?q=" + encodeURIComponent(query), true);
		break;
	}
}

function clearBookmarksItems(){
	var list = document.getElementById("list");
	while(list.firstChild){
		list.removeChild(list.firstChild);
	}
}

chrome.runtime.onMessage.addListener(function(request){
	if(request.text == "receiveallhost"){
		var perm = request.value;
		if(perm == true){
			// do nothing, permission is allowed
		}else{
			document.getElementById("hostbox").className = "hostpermission";
			document.querySelector("#btnallowallhost").addEventListener("click", () => {

				browser.permissions.request({
					origins: ["*://*/*"]
				}, function(){

					browser.permissions.contains({
						origins: ["*://*/*"]
					}, (result) => {
						if(result){
							document.getElementById("hostbox").className = "hidden";
						}
					});

				});

			});
		}
	}else if(request.msg == "setpage"){
		// console.log("received = " + request.value);
		openweb(request.value, true);
	}else if(request.msg == "setsearch"){
		// console.log("received = " + request.value);
		chrome.storage.sync.get(["searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex", "searchyahoo", "search360", "searchsogou", "searchchatgpt", "searchgemini", "searchwikipedia"], function(items){
			searchgoogle = items["searchgoogle"]; if(searchgoogle == null){ searchgoogle = true; }
			searchbing = items["searchbing"]; if(searchbing == null){ searchbing = false; }
			searchduckduckgo = items["searchduckduckgo"]; if(searchduckduckgo == null){ searchduckduckgo = false; }
			searchbaidu = items["searchbaidu"]; if(searchbaidu == null){ searchbaidu = false; }
			searchyandex = items["searchyandex"]; if(searchyandex == null){ searchyandex = false; }
			searchyahoo = items["searchyahoo"]; if(searchyahoo == null){ searchyahoo = false; }
			search360 = items["search360"]; if(search360 == null){ search360 = false; }
			searchsogou = items["searchsogou"]; if(searchsogou == null){ searchsogou = false; }
			searchchatgpt = items["searchchatgpt"]; if(searchchatgpt == null){ searchchatgpt = false; }
			searchgemini = items["searchgemini"]; if(searchgemini == null){ searchgemini = false; }
			searchwikipedia = items["searchwikipedia"]; if(searchwikipedia == null){ searchwikipedia = false; }
			if(searchgoogle){
				selectedsearch = "searchgoogle";
			}else if(searchbing){
				selectedsearch = "searchbing";
			}else if(searchduckduckgo){
				selectedsearch = "searchduckduckgo";
			}else if(searchbaidu){
				selectedsearch = "searchbaidu";
			}else if(searchyandex){
				selectedsearch = "searchyandex";
			}else if(searchyahoo){
				selectedsearch = "searchyahoo";
			}else if(search360){
				selectedsearch = "search360";
			}else if(searchsogou){
				selectedsearch = "searchsogou";
			}else if(searchchatgpt){
				selectedsearch = "searchchatgpt";
			}else if(searchgemini){
				selectedsearch = "searchgemini";
			}else if(searchwikipedia){
				selectedsearch = "searchwikipedia";
			}
			performSearch(selectedsearch, request.value);
		});
	}else if(request.msg == "setnavtop"){
		var getpa = document.getElementById("psidebar");
		getpa.className = "container top";
	}else if(request.msg == "setnavbottom"){
		var getpb = document.getElementById("psidebar");
		getpb.className = "container bottom";
	}else if(request.msg == "setnavhidden"){
		var getpc = document.getElementById("psidebar");
		getpc.className = "container clean";
		var menubookmarks = document.getElementById("menubookmarks");
		menubookmarks.className = "hidden";
	}else if(request.msg == "setrefreshsearch"){
		chrome.storage.sync.get(["searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex", "searchyahoo", "search360", "searchsogou", "searchchatgpt", "searchgemini", "searchwikipedia"], function(items){
			searchgoogle = items["searchgoogle"]; if(searchgoogle == null){ searchgoogle = true; }
			searchbing = items["searchbing"]; if(searchbing == null){ searchbing = false; }
			searchduckduckgo = items["searchduckduckgo"]; if(searchduckduckgo == null){ searchduckduckgo = false; }
			searchbaidu = items["searchbaidu"]; if(searchbaidu == null){ searchbaidu = false; }
			searchyandex = items["searchyandex"]; if(searchyandex == null){ searchyandex = false; }
			searchyahoo = items["searchyahoo"]; if(searchyahoo == null){ searchyahoo = false; }
			search360 = items["search360"]; if(search360 == null){ search360 = false; }
			searchsogou = items["searchsogou"]; if(searchsogou == null){ searchsogou = false; }
			searchchatgpt = items["searchchatgpt"]; if(searchchatgpt == null){ searchchatgpt = false; }
			searchgemini = items["searchgemini"]; if(searchgemini == null){ searchgemini = false; }
			searchwikipedia = items["searchwikipedia"]; if(searchwikipedia == null){ searchwikipedia = false; }
			if(searchgoogle){
				selectedsearch = "searchgoogle";
			}else if(searchbing){
				selectedsearch = "searchbing";
			}else if(searchduckduckgo){
				selectedsearch = "searchduckduckgo";
			}else if(searchbaidu){
				selectedsearch = "searchbaidu";
			}else if(searchyandex){
				selectedsearch = "searchyandex";
			}else if(searchyahoo){
				selectedsearch = "searchyahoo";
			}else if(search360){
				selectedsearch = "search360";
			}else if(searchsogou){
				selectedsearch = "searchsogou";
			}else if(searchchatgpt){
				selectedsearch = "searchchatgpt";
			}else if(searchgemini){
				selectedsearch = "searchgemini";
			}else if(searchwikipedia){
				selectedsearch = "searchwikipedia";
			}
		});
	}else if(request.msg == "setopentab"){
		chrome.storage.sync.get(["opentab"], function(items){
			opentab = items["opentab"]; if(opentab == null){ opentab = false; }
			if(opentab == true){
				document.getElementById("btntab").className = "icon";
			}else{
				document.getElementById("btntab").className = "hidden";
			}
		});
	}else if(request.msg == "setopencopy"){
		chrome.storage.sync.get(["opencopy"], function(items){
			opencopy = items["opencopy"]; if(opencopy == null){ opencopy = false; }
			if(opencopy == true){
				document.getElementById("btncopy").className = "icon";
			}else{
				document.getElementById("btncopy").className = "hidden";
			}
		});
	}else if(request.msg == "setgobutton"){
		chrome.storage.sync.get(["gobutton"], function(items){
			gobutton = items["gobutton"]; if(gobutton == null){ gobutton = true; }
			if(gobutton == true){
				document.getElementById("btngo").className = "icon";
			}else{
				document.getElementById("btngo").className = "hidden";
			}
		});
	}else if(request.msg == "setnavbuttons"){
		chrome.storage.sync.get(["navbuttons"], function(items){
			navbuttons = items["navbuttons"]; if(navbuttons == null){ navbuttons = false; }
			if(navbuttons == true){
				document.getElementById("btnprev").className = "icon";
				document.getElementById("btnnext").className = "icon";
				document.getElementById("btnreload").className = "icon";
			}else{
				document.getElementById("btnprev").className = "hidden";
				document.getElementById("btnnext").className = "hidden";
				document.getElementById("btnreload").className = "hidden";
			}
		});
	}else if(request.msg == "setbookmarkswebsites"){
		chrome.storage.sync.get(["websitename1", "websiteurl1", "websitename2", "websiteurl2", "websitename3", "websiteurl3", "websitename4", "websiteurl4", "websitename5", "websiteurl5", "websitename6", "websiteurl6", "websitename7", "websiteurl7", "websitename8", "websiteurl8", "websitename9", "websiteurl9", "websitename10", "websiteurl10"], function(items){
			document.getElementById("menubookmarks").className = "hidden";
			clearBookmarksItems();
			createmenuitems(items);
		});
	}else if(request.msg == "setopennonebookmarks"){
		chrome.storage.sync.get(["openquickbookmarks", "openbrowserbookmarks", "opennonebookmarks"], function(items){
			openquickbookmarks = items["openquickbookmarks"]; if(openquickbookmarks == null){ openquickbookmarks = false; }
			openbrowserbookmarks = items["openbrowserbookmarks"]; if(openbrowserbookmarks == null){ openbrowserbookmarks = false; }
			opennonebookmarks = items["opennonebookmarks"]; if(opennonebookmarks == null){ opennonebookmarks = false; }
			document.getElementById("menubookmarks").className = "hidden";
			document.getElementById("btnbookmarks").className = "hidden";
			clearBookmarksItems();
		});
	}else if(request.msg == "setopenquickbookmarks"){
		chrome.storage.sync.get(["openquickbookmarks", "openbrowserbookmarks", "opennonebookmarks", "websitename1", "websiteurl1", "websitename2", "websiteurl2", "websitename3", "websiteurl3", "websitename4", "websiteurl4", "websitename5", "websiteurl5", "websitename6", "websiteurl6", "websitename7", "websiteurl7", "websitename8", "websiteurl8", "websitename9", "websiteurl9", "websitename10", "websiteurl10"], function(items){
			openquickbookmarks = items["openquickbookmarks"]; if(openquickbookmarks == null){ openquickbookmarks = false; }
			openbrowserbookmarks = items["openbrowserbookmarks"]; if(openbrowserbookmarks == null){ openbrowserbookmarks = false; }
			opennonebookmarks = items["opennonebookmarks"]; if(opennonebookmarks == null){ opennonebookmarks = false; }
			clearBookmarksItems(items);
			createmenuitems(items);
			document.getElementById("btnbookmarks").className = "icon";
		});
	}else if(request.msg == "setopenbrowserbookmarks"){
		chrome.storage.sync.get(["openquickbookmarks", "openbrowserbookmarks", "opennonebookmarks"], function(items){
			openquickbookmarks = items["openquickbookmarks"]; if(openquickbookmarks == null){ openquickbookmarks = false; }
			openbrowserbookmarks = items["openbrowserbookmarks"]; if(openbrowserbookmarks == null){ openbrowserbookmarks = false; }
			opennonebookmarks = items["opennonebookmarks"]; if(opennonebookmarks == null){ opennonebookmarks = false; }
			document.getElementById("btnbookmarks").className = "icon";
			clearBookmarksItems();
			createbrowserbookmark();
		});
	}else if(request.msg == "setgooglesidepanel"){
		chrome.storage.sync.get(["googlesidepanel"], function(items){
			googlesidepanel = items["googlesidepanel"]; if(googlesidepanel == null){ googlesidepanel = true; }
		});
	}else if(request.msg == "setzoom"){
		chrome.storage.sync.get(["zoom", "defaultzoom"], function(items){
			zoom = items["zoom"]; if(zoom == null){ zoom = false; }
			defaultzoom = items["defaultzoom"]; if(defaultzoom == null){ defaultzoom = 100; }
			if(zoom == true){
				document.getElementById("zoombar").className = "zoom-panel";
				zoomLevelDisplay.textContent = defaultzoom + "%";
				zoomLevel = parseInt(defaultzoom);
			}else{
				document.getElementById("zoombar").className = "hidden";
				zoomLevelDisplay.textContent = 100 + "%";
				zoomLevel = 100;
			}
			updateZoomLevel();
		});
	}else if(request.msg == "setstep"){
		chrome.storage.sync.get(["step"], function(items){
			step = items["step"]; if(step == null){ step = 5; }
		});
	}else if(request.msg == "setdefaultzoom"){
		chrome.storage.sync.get(["defaultzoom"], function(items){
			defaultzoom = items["defaultzoom"]; if(defaultzoom == null){ defaultzoom = 100; }
			zoomLevelDisplay.textContent = defaultzoom + "%";
			zoomLevel = parseInt(defaultzoom);
			updateZoomLevel();
		});
	}else if(request.msg == "settypepanelzone"){
		chrome.storage.sync.get(["typepanelzone"], function(items){
			typepanelzone = items.typepanelzone; if(typepanelzone == null)typepanelzone = true;
			typepanelcustom = false;
		});
	}else if(request.msg == "settypepanelcustom"){
		chrome.storage.sync.get(["typepanelcustom"], function(items){
			typepanelcustom = items.typepanelcustom; if(typepanelcustom == null)typepanelcustom = false;
			typepanelzone = false;
		});
	}else if(request.msg == "setwebsitestartname"){
		chrome.storage.sync.get(["websitestartname"], function(items){
			websitestartname = items.websitestartname; if(websitestartname == null)websitestartname = "https://www.google.com";
		});
	}else if(request.msg == "settypepanellasttime"){
		chrome.storage.sync.get(["typepanellasttime"], function(items){
			typepanellasttime = items.typepanellasttime; if(typepanellasttime == null)typepanellasttime = false;
		});
	}else if(request.msg == "setmultipletabs"){
		chrome.storage.sync.get(["multipletabs", "multivalues"], function(items){
			multipletabs = items["multipletabs"]; if(multipletabs == null){ multipletabs = false; }
			multivalues = items["multivalues"]; if(multivalues == null){ multivalues = [{"note":emptypage}]; }

			document.getElementById("drag-drop-info").className = "show";
			document.getElementById("drag-drop-zone").className = "show";

			// clear searchbox
			document.getElementById("searchbar").value = "";
			// remove all tabs
			removeTabs();
			// remove all web contents
			removeWebs();
			// show the tab bar or not
			applyStyles(multipletabs);
		});
	}else if(request.msg == "settypehomezone"){
		chrome.storage.sync.get(["typehomezone"], function(items){
			typehomezone = items.typehomezone; if(typehomezone == null)typehomezone = true;
			typehomecustom = false;
		});
	}else if(request.msg == "settypehomecustom"){
		chrome.storage.sync.get(["typehomecustom"], function(items){
			typehomecustom = items.typehomecustom; if(typehomecustom == null)typehomecustom = true;
			typehomezone = false;
		});
	}else if(request.msg == "setwebsitehomepagename"){
		chrome.storage.sync.get(["websitehomepagename"], function(items){
			websitehomepagename = items.websitehomepagename; if(websitehomepagename == null)websitehomepagename = "https://www.google.com";
		});
	}else if(request.msg == "setpreventclose"){
		if(request.value == true){
			preventclose = true;
		}else{
			preventclose = false;
		}
	}else if(request.msg == "setdragnewtab"){
		if(request.value == true){
			dragnewtab = true;
		}else{
			dragnewtab = false;
		}
	}else if(request.msg == "setmutetab"){
		if(request.value == true){
			mutetab = true;
		}else{
			mutetab = false;
		}
	}else if(request.msg == "setdisablehorizontalscroll"){
		if(request.value == true){
			disablehorizontalscroll = true;
		}else{
			disablehorizontalscroll = false;
		}
	}else if(request.msg == "setopenallnewtab"){
		if(request.value == true){
			openallnewtab = true;
		}else{
			openallnewtab = false;
		}

		// refresh all tabs
		const iframes = document.getElementById("webcontent").getElementsByTagName("iframe");
		for(let i = 0; i < iframes.length; i++){
			iframes[i].contentWindow.postMessage({method: "goReloadWebpage"}, "*");
		}
	}else if(request.msg == "setautorefresh"){
		if(request.value == true){
			autorefresh = true;
			// stop the timer
			clearInterval(actiontimer);
			clearInterval(countdownInterval);
			document.getElementById("btnstartaction").innerText = i18nbtnoff;
			document.getElementById("currenttime").innerText = "";
			actiontimer = null;
			// start again
			starttimer(refreshtime);
			document.getElementById("btnstartaction").innerText = i18nbtnon;
		}else{
			autorefresh = false;
			// stop the timer
			clearInterval(actiontimer);
			clearInterval(countdownInterval);
			document.getElementById("btnstartaction").innerText = i18nbtnoff;
			document.getElementById("currenttime").innerText = "";
			actiontimer = null;
		}
	}else if(request.msg == "setrefreshtime"){
		refreshtime = request.value;
		// stop the timer
		clearInterval(actiontimer);
		clearInterval(countdownInterval);
		document.getElementById("btnstartaction").innerText = i18nbtnoff;
		document.getElementById("currenttime").innerText = "";
		actiontimer = null;
		// start again
		starttimer(refreshtime);
		document.getElementById("btnstartaction").innerText = i18nbtnon;
	}else if(request.msg == "setshowrefreshpanel"){
		if(request.value == true){
			document.getElementById("refreshbar").className = "refresh-panel";
			showrefreshpanel = true;
			if(autorefresh == true){
				starttimer(refreshtime);
				document.getElementById("btnstartaction").innerText = i18nbtnon;
			}
		}else{
			document.getElementById("refreshbar").className = "hidden";
			showrefreshpanel = false;
			// stop the timer
			clearInterval(actiontimer);
			clearInterval(countdownInterval);
			document.getElementById("btnstartaction").innerText = i18nbtnoff;
			document.getElementById("currenttime").innerText = "";
			actiontimer = null;
		}
	}else if(request.msg == "panelrefresh"){
		location.reload();
	}
});