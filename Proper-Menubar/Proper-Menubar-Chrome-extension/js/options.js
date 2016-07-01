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

// Option to save current value to window.localStorage
function save_options(){
	window.localStorage['googleplus'] = $('googleplus').value;
	window.localStorage['opacity'] = $('opacity').value;
	window.localStorage['country'] = $('country').value;
	window.localStorage['backgroundhex'] = $('backgroundhex').value;
	window.localStorage['backgroundimagesource'] = $('backgroundimagesource').value;
	if($('backgroundcolor').checked)window.localStorage['backgroundcolor'] = 'true';
	else window.localStorage['backgroundcolor'] = 'false';	
	if($('backgroundimage').checked)window.localStorage['backgroundimage'] = 'true';
	else window.localStorage['backgroundimage'] = 'false';	
	if($('link1a').checked)window.localStorage['link1a'] = 'true';
	else window.localStorage['link1a'] = 'false';
	if($('link2a').checked)window.localStorage['link2a'] = 'true';
	else window.localStorage['link2a'] = 'false';	
	if($('link3a').checked)window.localStorage['link3a'] = 'true';
	else window.localStorage['link3a'] = 'false';	
	if($('link4a').checked)window.localStorage['link4a'] = 'true';
	else window.localStorage['link4a'] = 'false';	
	if($('link5a').checked)window.localStorage['link5a'] = 'true';
	else window.localStorage['link5a'] = 'false';	
	if($('link6a').checked)window.localStorage['link6a'] = 'true';
	else window.localStorage['link6a'] = 'false';	
	if($('link7a').checked)window.localStorage['link7a'] = 'true';
	else window.localStorage['link7a'] = 'false';	
	if($('link8a').checked)window.localStorage['link8a'] = 'true';
	else window.localStorage['link8a'] = 'false';	
	if($('link9a').checked)window.localStorage['link9a'] = 'true';
	else window.localStorage['link9a'] = 'false';	
	if($('link10a').checked)window.localStorage['link10a'] = 'true';
	else window.localStorage['link10a'] = 'false';	
	if($('link11a').checked)window.localStorage['link11a'] = 'true';
	else window.localStorage['link11a'] = 'false';	
	if($('link12a').checked)window.localStorage['link12a'] = 'true';
	else window.localStorage['link12a'] = 'false';	
	if($('link13a').checked)window.localStorage['link13a'] = 'true';
	else window.localStorage['link13a'] = 'false';	
	if($('link14a').checked)window.localStorage['link14a'] = 'true';
	else window.localStorage['link14a'] = 'false';	
	if($('link15a').checked)window.localStorage['link15a'] = 'true';
	else window.localStorage['link15a'] = 'false';	
	if($('link16a').checked)window.localStorage['link16a'] = 'true';
	else window.localStorage['link16a'] = 'false';	
	if($('link17a').checked)window.localStorage['link17a'] = 'true';
	else window.localStorage['link17a'] = 'false';	
	if($('link18a').checked)window.localStorage['link18a'] = 'true';
	else window.localStorage['link18a'] = 'false';	
	if($('link19a').checked)window.localStorage['link19a'] = 'true';
	else window.localStorage['link19a'] = 'false';	
	if($('link20a').checked)window.localStorage['link20a'] = 'true';
	else window.localStorage['link20a'] = 'false';		
	if($('link21a').checked)window.localStorage['link21a'] = 'true';
	else window.localStorage['link21a'] = 'false';
	if($('link22a').checked)window.localStorage['link22a'] = 'true';
	else window.localStorage['link22a'] = 'false';
	if($('link23a').checked)window.localStorage['link23a'] = 'true';
	else window.localStorage['link23a'] = 'false';
	if($('link24a').checked)window.localStorage['link24a'] = 'true';
	else window.localStorage['link24a'] = 'false';
	if($('link25a').checked)window.localStorage['link25a'] = 'true';
	else window.localStorage['link25a'] = 'false';
	if($('allsites').checked)window.localStorage['allsites'] = 'true';
	else window.localStorage['allsites'] = 'false';
	window.localStorage['fontcolor'] = $('fontcolor').value;
	if($('googlesites').checked)window.localStorage['googlesites'] = 'true';
	else window.localStorage['googlesites'] = 'false';
	if($('propermenuonly').checked)window.localStorage['propermenuonly'] = 'true';
	else window.localStorage['propermenuonly'] = 'false';
	if($('search').checked)window.localStorage['search'] = 'true';
	else window.localStorage['search'] = 'false';
	if($('existingtab').checked)window.localStorage['existingtab'] = 'true';
	else window.localStorage['existingtab'] = 'false';
	
	// proper menu Excluded domains
var propermenuDomainsBox = $("propermenuDomainsBox");
var propermenuDomains = {};
for (var i = 0; i < propermenuDomainsBox.length; i++)
	propermenuDomains[propermenuDomainsBox.options[i].value] = true;
    localStorage["propermenuDomains"] = JSON.stringify(propermenuDomains);
	
}

if(!window.localStorage['backgroundcolor']) // find no localstore
{	window.localStorage['backgroundcolor'] = 'true'; // then default true
	window.localStorage['backgroundimage'] = 'false'; // then default true
}

if(!window.localStorage['link1a']){ window.localStorage['link1a'] = 'true'; } // then default true
if(!window.localStorage['link2a']){ window.localStorage['link2a'] = 'true'; } // then default true
if(!window.localStorage['link3a']){ window.localStorage['link3a'] = 'true'; } // then default true
if(!window.localStorage['link4a']){ window.localStorage['link4a'] = 'true'; } // then default true
if(!window.localStorage['link5a']){ window.localStorage['link5a'] = 'true'; } // then default true
if(!window.localStorage['link6a']){ window.localStorage['link6a'] = 'true'; } // then default true
if(!window.localStorage['link7a']){ window.localStorage['link7a'] = 'true'; } // then default true
if(!window.localStorage['link8a']){ window.localStorage['link8a'] = 'true'; } // then default true
if(!window.localStorage['link9a']){ window.localStorage['link9a'] = 'true'; } // then default true
if(!window.localStorage['link10a']){ window.localStorage['link10a'] = 'true'; } // then default true
if(!window.localStorage['link11a']){ window.localStorage['link11a'] = 'true'; } // then default true
if(!window.localStorage['link12a']){ window.localStorage['link12a'] = 'true'; } // then default true
if(!window.localStorage['link13a']){ window.localStorage['link13a'] = 'true'; } // then default true
if(!window.localStorage['link14a']){ window.localStorage['link14a'] = 'true'; } // then default true
if(!window.localStorage['link15a']){ window.localStorage['link15a'] = 'true'; } // then default true
if(!window.localStorage['link16a']){ window.localStorage['link16a'] = 'true'; } // then default true
if(!window.localStorage['link17a']){ window.localStorage['link17a'] = 'true'; } // then default true
if(!window.localStorage['link18a']){ window.localStorage['link18a'] = 'true'; } // then default true
if(!window.localStorage['link19a']){ window.localStorage['link19a'] = 'true'; } // then default true
if(!window.localStorage['link20a']){ window.localStorage['link20a'] = 'true'; } // then default true
if(!window.localStorage['link21a']){ window.localStorage['link21a'] = 'true'; } // then default true
if(!window.localStorage['link22a']){ window.localStorage['link22a'] = 'true'; } // then default true
if(!window.localStorage['link23a']){ window.localStorage['link23a'] = 'true'; } // then default true
if(!window.localStorage['link24a']){ window.localStorage['link24a'] = 'true'; } // then default true
if(!window.localStorage['link25a']){ window.localStorage['link25a'] = 'true'; } // then default true

if(!window.localStorage['googlesites']){ window.localStorage['googlesites'] = 'true'; } // then default true

function read_options(){
	if(window.localStorage['googleplus']){$('googleplus').value = window.localStorage['googleplus'];}
	else {$('googleplus').value = 'You';}
	if(window.localStorage['opacity']){$('opacity').value = window.localStorage['opacity'];}
	else {$('opacity').value = '100';}
	if(window.localStorage['country']){$('country').value = window.localStorage['country'];}
	else {$('country').value = 'com';}
	if(window.localStorage['backgroundhex']){$('backgroundhex').value = window.localStorage['backgroundhex'];}
	else {$('backgroundhex').value = '#2D2D2D';}
	if(window.localStorage['backgroundimagesource']){$('backgroundimagesource').value = window.localStorage['backgroundimagesource'];}
	else {$('backgroundimagesource').value = '';}
	if(window.localStorage['backgroundcolor'] == 'true')$('backgroundcolor').checked = true;
	if(window.localStorage['backgroundimage'] == 'true')$('backgroundimage').checked = true;
	if(window.localStorage['link1a'] == 'true')$('link1a').checked = true;
	if(window.localStorage['link2a'] == 'true')$('link2a').checked = true;
	if(window.localStorage['link3a'] == 'true')$('link3a').checked = true;
	if(window.localStorage['link4a'] == 'true')$('link4a').checked = true;
	if(window.localStorage['link5a'] == 'true')$('link5a').checked = true;
	if(window.localStorage['link6a'] == 'true')$('link6a').checked = true;
	if(window.localStorage['link7a'] == 'true')$('link7a').checked = true;
	if(window.localStorage['link8a'] == 'true')$('link8a').checked = true;
	if(window.localStorage['link9a'] == 'true')$('link9a').checked = true;
	if(window.localStorage['link10a'] == 'true')$('link10a').checked = true;
	if(window.localStorage['link11a'] == 'true')$('link11a').checked = true;
	if(window.localStorage['link12a'] == 'true')$('link12a').checked = true;
	if(window.localStorage['link13a'] == 'true')$('link13a').checked = true;
	if(window.localStorage['link14a'] == 'true')$('link14a').checked = true;
	if(window.localStorage['link15a'] == 'true')$('link15a').checked = true;
	if(window.localStorage['link16a'] == 'true')$('link16a').checked = true;
	if(window.localStorage['link17a'] == 'true')$('link17a').checked = true;
	if(window.localStorage['link18a'] == 'true')$('link18a').checked = true;
	if(window.localStorage['link19a'] == 'true')$('link19a').checked = true;
	if(window.localStorage['link20a'] == 'true')$('link20a').checked = true;
	if(window.localStorage['link21a'] == 'true')$('link21a').checked = true;
	if(window.localStorage['link22a'] == 'true')$('link22a').checked = true;
	if(window.localStorage['link23a'] == 'true')$('link23a').checked = true;
	if(window.localStorage['link24a'] == 'true')$('link24a').checked = true;
	if(window.localStorage['link25a'] == 'true')$('link25a').checked = true;
	if(window.localStorage['allsites'] == 'true')$('allsites').checked = true;
	if(window.localStorage['fontcolor']){$('fontcolor').value = window.localStorage['fontcolor'];}
	else {$('fontcolor').value = '#cccccc';}
	if(window.localStorage['googlesites'] == 'true')$('googlesites').checked = true;
	if(window.localStorage['propermenuonly'] == 'true')$('propermenuonly').checked = true;
	if(window.localStorage['search'] == 'true')$('search').checked = true;
	if(window.localStorage['existingtab'] == 'true')$('existingtab').checked = true;
	
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
	
// propermenu - Excluded domains - sort these alphabetically
var propermenuDomains = window.localStorage["propermenuDomains"];
if(typeof propermenuDomains == "undefined")
propermenuDomains = JSON.stringify({'http://www.google.com': true, 'http://www.youtube.com': true});

if(typeof propermenuDomains == "string") {
	propermenuDomains = JSON.parse(propermenuDomains);
	var abuf = [];
	for(var domain in propermenuDomains)
		abuf.push(domain);
        abuf.sort();
	for(var i = 0; i < abuf.length; i++)
		appendToListBox("propermenuDomainsBox", abuf[i]);
    }	
}

// Add a filter string to the list box.
function appendToListBox(boxId, text) { var elt = document.createElement("option"); elt.text = text; elt.value = text; document.getElementById(boxId).add(elt, null); }

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

// whitelist proper menu domain
function propermenuaddWhitelistDomain() {
    var domain = $("propermenuwebsiteurl").value;
    appendToListBox("propermenuDomainsBox", domain);
    save_options();
}

function propermenuremoveSelectedExcludedDomain() {
    var propermenuDomainsBox = $("propermenuDomainsBox");
    for (var i = propermenuDomainsBox.length-1; i >= 0; i--) {
        if (propermenuDomainsBox.options[i].selected)
            propermenuDomainsBox.remove(i);
    }
    save_options();
}

// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

function slidepreview1(){$("backgroundimagesource").value = "chrome-extension://"+ chrome.i18n.getMessage("@@extension_id") + "/images/slice1.png";save_options();}
function slidepreview2(){$("backgroundimagesource").value = "chrome-extension://"+ chrome.i18n.getMessage("@@extension_id") + "/images/slice2.png";save_options();}
function slidepreview3(){$("backgroundimagesource").value = "chrome-extension://"+ chrome.i18n.getMessage("@@extension_id") + "/images/slice3.png";save_options();}
function slidepreview4(){$("backgroundimagesource").value = "chrome-extension://"+ chrome.i18n.getMessage("@@extension_id") + "/images/slice4.png";save_options();}
function slidepreview5(){$("backgroundimagesource").value = "chrome-extension://"+ chrome.i18n.getMessage("@@extension_id") + "/images/slice5.png";save_options();}
function slidepreview6(){$("backgroundimagesource").value = "chrome-extension://"+ chrome.i18n.getMessage("@@extension_id") + "/images/slice6.png";save_options();}

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

$("slice1").addEventListener('click', function() {slidepreview1();});
$("slice2").addEventListener('click', function() {slidepreview2();});
$("slice3").addEventListener('click', function() {slidepreview3();});
$("slice4").addEventListener('click', function() {slidepreview4();});
$("slice5").addEventListener('click', function() {slidepreview5();});
$("slice6").addEventListener('click', function() {slidepreview6();});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('welcomeguide').src = "";});
$("tabdesign").addEventListener('click', function() {$('welcomeguide').src = "";});
$("tabguide").addEventListener('click', function() {$('welcomeguide').src = "http://www.stefanvd.net/project/propermenubarchromeguide.htm";$("managed-prefs-banner").style.display = "none";});

// Share button
$("productsharebutton").addEventListener('click', function() {
$('sharebuttonspopup').src = "http://www.stefanvd.net/project/propermenubarchromeshare.htm";$("sharepopup").style.display = "";
});

$("productsharebuttonclose").addEventListener('click', function() {
$('sharebuttonspopup').src = "";$("sharepopup").style.display = "none";
});

// proper menu Add website
$("propermenuaddbutton").addEventListener('click', function() {propermenuaddWhitelistDomain();});

// proper menu Remove website
$("propermenuremovebutton").addEventListener('click', function() {propermenuremoveSelectedExcludedDomain();});

// retina check
if(window.devicePixelRatio >= 2) {
$("productwelcomeimageload").src = "images/propermenubarwelcome@2x.png";$("productwelcomeimageload").style.width = "190px"; $("productwelcomeimageload").style.height = "40px";
$("productwelcomeimage").src = "images/propermenubarwelcome@2x.png";$("productwelcomeimage").style.width = "190px"; $("productwelcomeimage").style.height = "40px";
}

});