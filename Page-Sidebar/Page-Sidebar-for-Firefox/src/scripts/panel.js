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

var selectedsearch, searchgoogle, searchbing, searchduckduckgo, searchbaidu, searchyandex, typepanelzone, typepanelcustom, websitezoomname, navtop, navbottom, navhidden;
document.addEventListener("DOMContentLoaded", init);

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg){
	// If the received message has the expected format...
	if(msg.text == "receiveallhost"){
		var perm = msg.value;
		if(perm == true){
			// do nothing, permission is allowed
		}else{
			document.getElementById("hostbox").className = "hostpermission";
			document.querySelector("#btnallowallhost").addEventListener("click", () => {
				browser.permissions.request({
					origins: ["*://*/*"]
				});
			});
		}
	}
});

function init(){
	// allow Firefox permission to run this extension
	// show all the active permissions in a list
	chrome.runtime.sendMessage({name: "getallhost"});
	//----

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

	chrome.storage.sync.get(["firstDate", "optionskipremember", "navtop", "navbottom", "navhidden", "typepanelzone", "typepanelcustom", "websitezoomname", "searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex"], function(items){
		searchgoogle = items["searchgoogle"]; if(searchgoogle == null){ searchgoogle = true; }
		searchbing = items["searchbing"]; if(searchbing == null){ searchbing = false; }
		searchduckduckgo = items["searchduckduckgo"]; if(searchduckduckgo == null){ searchduckduckgo = false; }
		searchbaidu = items["searchbaidu"]; if(searchbaidu == null){ searchbaidu = false; }
		searchyandex = items["searchyandex"]; if(searchyandex == null){ searchyandex = false; }
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
		}else{
			selectedsearch = "searchgoogle"; // default
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
		websitezoomname = items.websitezoomname; if(websitezoomname == null)websitezoomname = "https://www.google.com";

		if(typepanelcustom == true){
			open(websitezoomname, true);
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
		document.getElementById("btngo").addEventListener("click", actionGo, false);
		document.getElementById("searchbar").addEventListener("keypress", handleKeyPress, false);
	});
}

function handleDrop(e){
	e.preventDefault();
	// console.log("drop");
	const currenturl = e.dataTransfer.getData("text/uri-list");
	if(currenturl){
		try{
			const o = new URL(currenturl);
			if(o.hostname){
				return open(currenturl, true);
			}
		}catch(e){
			console.log(e);
		}
	}

	const selectedText = e.dataTransfer.getData("text/plain").trim();
	if(selectedText){
		performSearch(selectedsearch, selectedText);
	}
}

function actionHome(){
	if(typepanelcustom == true){
		open(websitezoomname, true);
	}else{
		document.getElementById("preview").src = "";
		document.getElementById("preview").className = "hidden";
		document.getElementById("drag-drop-info").className = "show";
		document.getElementById("drag-drop-zone").className = "show";
	}
}

function actionGo(){
	var searchInput = document.getElementById("searchbar").value.trim();
	// Check if the input is a valid URL
	var urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
	if(urlRegex.test(searchInput)){
		// If it's a URL, navigate to the page
		if(searchInput.startsWith("http://www.") || searchInput.startsWith("https://www.")){
			open(searchInput, true);
		}else if(searchInput.startsWith("http://") || searchInput.startsWith("https://")){
			open(searchInput, true);
		}else{
			open("http://" + searchInput, true);
		}
	}else{
		// If it is not a URL, perform a search
		performSearch(selectedsearch, searchInput);
	}
}

function handleKeyPress(event){
	if(event.key === "Enter"){
		actionGo();
	}
}

const open = async(currenturl) => {
	const iframe = document.getElementById("preview");
	if(iframe){
		iframe.className = "";
	}

	await chrome.declarativeNetRequest.updateSessionRules({
		removeRuleIds: [1],
		addRules: [{
			id: 1,
			priority: 1,
			action: {
				type: "modifyHeaders",
				responseHeaders: [
					{header: "x-frame-options", operation: "remove"},
					{header: "content-security-policy", operation: "remove"},
				],
			},
			condition: {
				urlFilter: "*",
				resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "websocket"],
			},
		},
		],
	});

	const dragDropNavbar = document.getElementById("drag-drop-navbar");
	const dragDropZone = document.getElementById("drag-drop-zone");
	const dragDropInfo = document.getElementById("drag-drop-info");

	if(iframe){
		iframe.src = currenturl;
		if(iframe.src != "" || iframe.src != null){
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
		open("https://www.google.com/search?q=" + encodeURIComponent(query), true);
		break;
	case"searchbing":
		open("https://www.bing.com/search?q=" + encodeURIComponent(query), true);
		break;
	case"searchduckduckgo":
		open("https://duckduckgo.com/?q=" + encodeURIComponent(query), true);
		break;
	case"searchbaidu":
		open("https://www.baidu.com/s?wd=" + encodeURIComponent(query), true);
		break;
	case"searchyandex":
		open("https://yandex.com/search/?text=" + encodeURIComponent(query), true);
		break;
	default:
		open("https://www.google.com/search?q=" + encodeURIComponent(query), true);
		break;
	}
}

chrome.runtime.onMessage.addListener(function(request){
	if(request.msg == "setpage"){
		// console.log("received = " + request.value);
		open(request.value, true);
	}else if(request.msg == "setsearch"){
		// console.log("received = " + request.value);
		chrome.storage.sync.get(["searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex"], function(items){
			searchgoogle = items["searchgoogle"]; if(searchgoogle == null){ searchgoogle = true; }
			searchbing = items["searchbing"]; if(searchbing == null){ searchbing = false; }
			searchduckduckgo = items["searchduckduckgo"]; if(searchduckduckgo == null){ searchduckduckgo = false; }
			searchbaidu = items["searchbaidu"]; if(searchbaidu == null){ searchbaidu = false; }
			searchyandex = items["searchyandex"]; if(searchyandex == null){ searchyandex = false; }
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
	}else if(request.msg == "setrefreshsearch"){
		chrome.storage.sync.get(["searchgoogle", "searchbing", "searchduckduckgo", "searchbaidu", "searchyandex"], function(items){
			searchgoogle = items["searchgoogle"]; if(searchgoogle == null){ searchgoogle = true; }
			searchbing = items["searchbing"]; if(searchbing == null){ searchbing = false; }
			searchduckduckgo = items["searchduckduckgo"]; if(searchduckduckgo == null){ searchduckduckgo = false; }
			searchbaidu = items["searchbaidu"]; if(searchbaidu == null){ searchbaidu = false; }
			searchyandex = items["searchyandex"]; if(searchyandex == null){ searchyandex = false; }
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
			}
		});
	}
});