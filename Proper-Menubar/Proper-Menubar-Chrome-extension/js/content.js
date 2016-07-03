//================================================
/*

Proper Menubar
Add the black menubar below the addresbar. To get easy and fast access to all your Google products.
Copyright (C) 2016 Stefan vd
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

chrome.runtime.onMessage.addListener(function(request, sender, sendMessage) {
if (request.action == "addremove"){
var addbar = null;
chrome.storage.sync.get(['addbar'], function(items){
addbar = items['addbar'];
if(addbar == true){ chrome.runtime.sendMessage({name : 'navON'}); }
else { chrome.runtime.sendMessage({name : 'navOFF'}); }
});
} else if (request.action == "toolbarrefresh") {
    window.location.reload();
}
});