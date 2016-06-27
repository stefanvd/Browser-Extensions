//================================================
/*

Ambient Aurea
Bring your image to an ambient lighting effect with just one click on the button.
Copyright (C) 2015 Stefan vd
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

function $(id) { return document.getElementById(id); }

// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('ambientaurea-chrome-install-button')) {
		$('ambientaurea-chrome-install-button').style.display = 'none';
		$('ambientaurea-chrome-thanks-button').style.display = '';
	}
}

// settings
var contextmenus = null;

chrome.storage.local.get(['contextmenus'], function(response){
contextmenus = response.contextmenus;if(!contextmenus)contextmenus = 'true'; // default contextmenus true

// context menu
if(contextmenus == 'true'){chrome.extension.sendMessage({name: 'contextmenuon'});}
else {chrome.extension.sendMessage({name: 'contextmenuoff'});}

var last_target = null;
document.addEventListener('mousedown', function(event){
var goimage = event.target.src;
chrome.extension.sendMessage({name: 'imgurl', value: goimage});
}, true);

});