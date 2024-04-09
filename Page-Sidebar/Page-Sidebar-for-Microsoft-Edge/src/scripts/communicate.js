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

/* global navigation */
if(window.top !== window && window.parent === window.top){
	chrome.runtime.sendMessage({name: "sidepanelopen"}, (b) => {
		if(b){
			const origin = chrome.runtime.getURL("");
			addEventListener("hashchange", () => top.postMessage({method: "navigate", href: location.href}, origin));
			addEventListener("message", (e) => {
				if(e.data?.method === "navigate-verified" && e.origin.includes(chrome.runtime.id)){
					navigation.addEventListener("navigate", (e) => {
						const href = e.destination.url;
						top.postMessage({
							method: "complete",
							href
						}, origin);
					});
				}
			});
			top.postMessage({method: "navigate", href: location.href}, origin);
		}
	});
}