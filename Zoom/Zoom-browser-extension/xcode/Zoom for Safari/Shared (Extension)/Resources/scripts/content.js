//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
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

function $(id){ return document.getElementById(id); }

// Install on www.stefanvd.net
if(window.location.href.match(/^http(s)?:\/\/(www\.)?stefanvd.net/i)){
	if($("zoom-" + exbrowser + "-install-button")){
		$("zoom-" + exbrowser + "-install-button").style.display = "none";
		$("zoom-" + exbrowser + "-thanks-button").style.display = "block";
	}
}

let redirectionHosts = [linkredirectionoptions];
if(redirectionHosts.includes(window.location.href)){
	if($("allowpermission")){
		$("allowpermission").className = "";
		chrome.runtime.sendMessage({name: "redirectionoptions"});
	}
	if($("disallowpermission")){
		$("disallowpermission").className = "hidden";
	}
}