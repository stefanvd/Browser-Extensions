//================================================
/*

Proper Menubar
Add back the black menubar below the omnibox.
Copyright (C) 2014 Stefan vd
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

var addbar = null;
chrome.extension.sendMessage({comando:'proprequest'}, function(response){
addbar = response.addbar;if(!addbar)addbar = 'true';
if(addbar == 'true'){
  turnoff.style.display = "";
  turnon.style.display = "none";
} else{
  turnoff.style.display = "none";
  turnon.style.display = "";
}
});

function toggleoff(){
chrome.tabs.getSelected(null, function(tab) {
  // Send a request to the content script.
  chrome.extension.sendMessage({'name' : 'savevalueaddbar', 'value' : 'false'});
  chrome.tabs.sendMessage(tab.id, {action: "addremove"});
  chrome.tabs.sendMessage(tab.id, {action: "navON"});
  turnoff.style.display = "none";
  turnon.style.display = "";
});
}
function toggleon(){
chrome.tabs.getSelected(null, function(tab) {
  // Send a request to the content script.
  chrome.extension.sendMessage({'name' : 'savevalueaddbar', 'value' : 'true'});
  chrome.tabs.sendMessage(tab.id, {action: "addremove"});
  chrome.tabs.sendMessage(tab.id, {action: "navOFF"});
  turnoff.style.display = "";
  turnon.style.display = "none";
});
}
document.addEventListener('DOMContentLoaded', function () {
var i18nturnoff = chrome.i18n.getMessage("turnoff");
var i18nturnon = chrome.i18n.getMessage("turnon");
$("turnoff").innerText = i18nturnoff;
$("turnon").innerText = i18nturnon;

var i18npopupdonate = chrome.i18n.getMessage("popupdonate");
$("donate").innerText = i18npopupdonate;


// Toggle on
$("turnoff").addEventListener('click', function() {toggleoff();});

// Toggle off
$("turnon").addEventListener('click', function() {toggleon();});
});