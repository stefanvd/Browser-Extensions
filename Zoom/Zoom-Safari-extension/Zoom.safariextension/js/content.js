//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
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

(function() {
if (window.top === window) {
function $(id) { return document.getElementById(id); }
// settings
var autofullscreen = null;
var settings;
 
// listen for an incoming setSettings message
safari.self.addEventListener("message", function(e) {
if(e.name === "setSettings") {
    settings = e.message;
    allzoom = settings["allzoom"];if(!allzoom)allzoom = 'false'; // default allzoom false
    allzoomvalue = settings["allzoomvalue"]; if(!allzoomvalue)allzoomvalue = 1; // default allzoom is 1
                             
    if(allzoom == 'true'){
        try{document.body.style.zoom = allzoomvalue;}
        catch(e){}
    }
    else{
        safari.self.tab.dispatchMessage('getRatio', location.host);
    }
                             
    } else if(e.name === "todo") {
        try{document.body.style.zoom = e.message;}
        catch(e){}
    }
}, false);

// ask global.html for settings
safari.self.tab.dispatchMessage("getSettings");
}
}())