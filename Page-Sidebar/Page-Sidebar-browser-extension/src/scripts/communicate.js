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

/* global navigation */
if(window.top !== window && window.parent === window.top){
	chrome.runtime.sendMessage({name: "sidepanelopen"}, (b) => {
		if(b){
			const origin = chrome.runtime.getURL("");
			let iframeId = null;

			const sendNavigateMessage = () => {
				if(iframeId){
					top.postMessage({method: "navigate", href: location.href, iframeId}, origin);
				}
			};

			addEventListener("hashchange", sendNavigateMessage);
			addEventListener("load", sendNavigateMessage);
			addEventListener("popstate", sendNavigateMessage);
			addEventListener("message", (e) => {
				// console.log("Received message:", e.data.method);
				if(e.data?.method === "setIframeId"){
					iframeId = e.data.iframeId;
					const href = location.href;
					if(iframeId){
						top.postMessage({method: "navigate", href, iframeId}, origin);
					}
				}else if(e.data?.method === "navigate-verified" && e.data?.extensionID == chrome.runtime.id){
					// chrome.runtime.id gives the extension ID, but in Firefox it is a random internal ID,
					// so it will not work for origin comparison in Firefox.
					// We need to check the origin of the message to verify that it comes from the extension.

					// support currently only Chromium web browsers
					if(typeof navigation !== "undefined"){
						navigation.addEventListener("navigate", (e) => {
							const href = e.destination.url;
							if(iframeId){
								top.postMessage({method: "complete", href, iframeId}, origin);
							}
						});
					}
					// Trigger the "complete" message on initial load
					const href = location.href;
					if(iframeId){
						top.postMessage({method: "complete", href, iframeId}, origin);
					}
				}else if(e.data?.method === "changeZoomScale"){
					document.body.style.zoom = e.data.zoom;
				}else if(e.data?.method === "goBackWebpage"){
					window.history.back();
				}else if(e.data?.method === "goNextWebpage"){
					window.history.forward();
				}else if(e.data?.method == "goReloadWebpage"){
					location.reload();
				}else if(e.data?.method == "goMuteOnWebpage"){
					toggleMuteOn();
				}else if(e.data?.method == "goMuteOffWebpage"){
					toggleMuteOff();
				}else if(e.data?.method == "goCopyCurrentWebpage"){
					const href = location.href;
					top.postMessage({method: "copyCurrentURL", href, iframeId}, origin);
				}else if(e.data?.method == "goNewTabCurrentWebpage"){
					const href = location.href;
					top.postMessage({method: "newtabCurrentURL", href, iframeId}, origin);
				}else if(e.data?.method == "goHorizDisableWebpage"){
					disablehorizontalscroll();
				}else if(e.data?.method == "goOpenAllInNewTab"){
					openallinnewtab();
				}else if(e.data?.method == "goOpenAllInCurrentPanel"){
					openallcurrentpanel();
				}
			});

			// Initial send navigate message on script load
			sendNavigateMessage();
		}
	});
}

function toggleMuteOn(){
	// Find all video elements on the page and mute them
	const videos = document.querySelectorAll("video");
	videos.forEach((video) => {
		video.muted = true;
	});

	// Use a MutationObserver to ensure dynamically added videos are muted
	const observer = new MutationObserver(() => {
		const newVideos = document.querySelectorAll("video:not([data-muted])");
		newVideos.forEach((video) => {
			video.muted = true;
			video.setAttribute("data-muted", "true"); // Mark as processed
		});
	});

	observer.observe(document.body, {childList: true, subtree: true});

	// Store the observer so it can be disconnected when muting is turned off
	window._videoMuteObserver = observer;
}

function toggleMuteOff(){
	// Unmute all video elements on the page
	const videos = document.querySelectorAll("video");
	videos.forEach((video) => {
		video.muted = false;
	});

	// Disconnect the MutationObserver if it's active
	if(window._videoMuteObserver){
		window._videoMuteObserver.disconnect();
		delete window._videoMuteObserver;
	}
}

function disablehorizontalscroll(){
	// Disable horizontal scrolling on the page
	document.body.style.overflowX = "hidden";
	document.documentElement.style.overflowX = "hidden";
}

let openAllInNewTabInitialized = false;

function openallinnewtab(){
	if(openAllInNewTabInitialized)return;
	openAllInNewTabInitialized = true;

	// Intercept all anchor (<a>) clicks and open them in a new tab
	document.addEventListener("click", function(event){
		let target = event.target.closest("a"); // Find closest anchor tag

		if(target && target.href){
			event.preventDefault(); // Stop default behavior
			window.open(target.href, "_blank"); // Open link in a new tab
		}
	}, true);

	// Override window.open to always open in a new tab
	const originalOpen = window.open;
	window.open = function(url, target, features){
		return originalOpen.call(window, url, "_blank", features);
	};
}

function openallcurrentpanel(){
	// Intercept all anchor (<a>) clicks and open them in a new tab
	document.addEventListener("click", function(event){
		let target = event.target.closest("a"); // Find closest anchor tag

		if(target && target.href){
			event.preventDefault(); // Stop default behavior
			window.open(target.href, "_self"); // Open link in a new tab
		}
	}, true);

	// Override window.open to always open in a new tab
	const originalOpen = window.open;
	window.open = function(url, target, features){
		return originalOpen.call(window, url, "_self", features);
	};
}