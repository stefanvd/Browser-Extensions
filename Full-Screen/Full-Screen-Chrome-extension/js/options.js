//================================================
/*

Full Screen
Go full screen with one click on the button.
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
default_opacity = 80;

// Option to save current value to window.localStorage
function save_options(){
	if($('pageaction').checked)window.localStorage['pageaction'] = 'true';
	else window.localStorage['pageaction'] = 'false';
	if($('contextmenus').checked)window.localStorage['contextmenus'] = 'true';
	else window.localStorage['contextmenus'] = 'false';
	if($('autofullscreen').checked)window.localStorage['autofullscreen'] = 'true';
	else window.localStorage['autofullscreen'] = 'false';
}

// Option to read current value from window.localStorage
if(!window.localStorage['contextmenus']) // find no localstore fadein
	window.localStorage['contextmenus'] = 'true'; // then default true

function read_options(){
	if(window.localStorage['pageaction'] == 'true')$('pageaction').checked = true;
	if(window.localStorage['contextmenus'] == 'true')$('contextmenus').checked = true;
	if(window.localStorage['autofullscreen'] == 'true')$('autofullscreen').checked = true;
	
	// load tab div
	var tabListItems = document.getElementById('navbar').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == 'LI' ) {
		var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
		var id = getHash( tabLink.getAttribute('onclick') );
		tabLinks[id] = tabLink;
		contentDivs[id] = document.getElementById( id );
        }
    }
    
    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;
 
    for ( var id in tabLinks ) {
    	tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function() { this.blur() };
		if ( i == 0 ) tabLinks[id].className = 'navbar-item-selected';
		i++;
    }
    
    // Hide all content divs except the first
    var i = 0;
 
    for ( var id in contentDivs ) {
    	if ( i != 0 ) contentDivs[id].className = 'page hidden';
        i++;
    }

    // display version number
    function displayVersionNumber() {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", chrome.extension.getURL('manifest.json'), false);
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              var theManifest = JSON.parse(this.responseText);
              document.getElementById("version_number").innerText = theManifest.version;
            }
          };
          xhr.send();
        } catch (ex) {} // silently fail
    }
    displayVersionNumber();

}

// tabel script
    var tabLinks = new Array();
    var contentDivs = new Array();
 
    function showTab() {
      var selectedId = getHash( this.getAttribute('onclick') );
 
      // Highlight the selected tab, and dim all others.
      // Also show the selected content div, and hide all others.
      for ( var id in contentDivs ) {
        if ( id == selectedId ) {
          tabLinks[id].className = 'navbar-item-selected';
          contentDivs[id].className = 'page';
        } else {
          tabLinks[id].className = 'navbar-item';
          contentDivs[id].className = 'page hidden';
        }
      }
 
      // Stop the browser following the link
      return false;
    }
 
    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }
 
    function getHash( url ) {
      var hashPos = url.lastIndexOf ( '#' );
      return url.substring( hashPos + 1 );
    }
	
// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

/* Option page body action */
// Read current value settings
window.addEventListener('load', function() {
read_options();
yearnow();
// remove loading screen
$('loading').style.display = "none";
});

document.addEventListener('DOMContentLoaded', function () {
// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', save_options);}

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

});