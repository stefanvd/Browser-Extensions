//================================================
/*

Proper Menubar
Add the black menubar below the address bar. To get easy and fast access to all your Google products.
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

// Option to save current value
function save_options(){
	// proper menu Excluded domains
	var propermenuDomainsBox = $("propermenuDomainsBox");
	var propermenuDomains = {};
	for (var i = 0; i < propermenuDomainsBox.length; i++){propermenuDomains[propermenuDomainsBox.options[i].value] = true;}

  	chrome.storage.sync.set({"googleplus": $('googleplus').value, "opacity": $('opacity').value,"country":$('country').value, "backgroundhex":$('backgroundhex').value, "backgroundimagesource":$('backgroundimagesource').value,"backgroundcolor":$('backgroundcolor').checked,"backgroundimage":$('backgroundimage').checked,"dropshadow":$('dropshadow').checked,"link1a":$('link1a').checked,"link2a":$('link2a').checked,"link3a":$('link3a').checked,"link4a":$('link4a').checked,"link5a":$('link5a').checked,"link6a":$('link6a').checked,"link7a":$('link7a').checked,"link8a":$('link8a').checked,"link9a":$('link9a').checked,"link10a":$('link10a').checked,"link11a":$('link11a').checked,"link12a":$('link12a').checked,"link13a":$('link13a').checked,"link14a":$('link14a').checked,"link15a":$('link15a').checked,"link16a":$('link16a').checked,"link17a":$('link17a').checked,"link18a":$('link18a').checked,"link19a":$('link19a').checked,"link20a":$('link20a').checked,"link21a":$('link21a').checked,"link22a":$('link22a').checked,"link23a":$('link23a').checked,"link24a":$('link24a').checked,"link25a":$('link25a').checked,"link26a":$('link26a').checked,"link27a":$('link27a').checked,"link28a":$('link28a').checked,"allsites":$('allsites').checked,"fontcolor":$('fontcolor').value,"googlesites":$('googlesites').checked,"propermenuonly":$('propermenuonly').checked,"search":$('search').checked,"existingtab":$('existingtab').checked,"propermenuDomains": JSON.stringify(propermenuDomains),"optionskipremember":$('optionskipremember').checked,"display":$('display').value});

//refresh toolbar
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, { action: "toolbarrefresh" });
        }
    });
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['backgroundcolor','backgroundimage','googlesites','dropshadow','link1a','link2a','link3a','link4a','link5a','link6a','link7a','link8a','link9a','link10a','link11a','link12a','link13a','link14a','link15a','link16a','link17a','link18a','link19a','link20a','link21a','link22a','link23a','link24a','link25a','link26a','link27a','link28a','display'], function(items){
    // find no localstore zoomengine
	  if(items['backgroundcolor'] == null && items['backgroundimage'] == null){firstdefaultvalues['backgroundcolor'] = true;firstdefaultvalues['backgroundimage'] = false}
	  if(items['googlesites'] == null){firstdefaultvalues['googlesites'] = true}
	  if(items['dropshadow'] == null){firstdefaultvalues['dropshadow'] = true}
	  if(items['link1a'] == null){firstdefaultvalues['link1a'] = true}
	  if(items['link2a'] == null){firstdefaultvalues['link2a'] = true}
	  if(items['link3a'] == null){firstdefaultvalues['link3a'] = true}
	  if(items['link4a'] == null){firstdefaultvalues['link4a'] = true}
	  if(items['link5a'] == null){firstdefaultvalues['link5a'] = true}
	  if(items['link6a'] == null){firstdefaultvalues['link6a'] = true}
	  if(items['link7a'] == null){firstdefaultvalues['link7a'] = true}
	  if(items['link8a'] == null){firstdefaultvalues['link8a'] = true}
	  if(items['link9a'] == null){firstdefaultvalues['link9a'] = true}
	  if(items['link10a'] == null){firstdefaultvalues['link10a'] = true}
	  if(items['link11a'] == null){firstdefaultvalues['link11a'] = true}
	  if(items['link12a'] == null){firstdefaultvalues['link12a'] = true}
	  if(items['link13a'] == null){firstdefaultvalues['link13a'] = true}
	  if(items['link14a'] == null){firstdefaultvalues['link14a'] = true}
	  if(items['link15a'] == null){firstdefaultvalues['link15a'] = true}
	  if(items['link16a'] == null){firstdefaultvalues['link16a'] = true}
	  if(items['link17a'] == null){firstdefaultvalues['link17a'] = true}
	  if(items['link18a'] == null){firstdefaultvalues['link18a'] = true}
	  if(items['link19a'] == null){firstdefaultvalues['link19a'] = true}
	  if(items['link20a'] == null){firstdefaultvalues['link20a'] = true}
	  if(items['link21a'] == null){firstdefaultvalues['link21a'] = true}
	  if(items['link22a'] == null){firstdefaultvalues['link22a'] = true}
	  if(items['link23a'] == null){firstdefaultvalues['link23a'] = true}
	  if(items['link24a'] == null){firstdefaultvalues['link24a'] = true}
	  if(items['link25a'] == null){firstdefaultvalues['link25a'] = true}
	  if(items['link26a'] == null){firstdefaultvalues['link26a'] = true}
	  if(items['link27a'] == null){firstdefaultvalues['link27a'] = true}
	  if(items['link28a'] == null){firstdefaultvalues['link28a'] = true}
	  if(items['display'] == null){firstdefaultvalues['display'] = 13}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
chrome.storage.sync.get(['googleplus','opacity','country','backgroundhex','backgroundimagesource','backgroundcolor','backgroundimage','googlesites','dropshadow','link1a','link2a','link3a','link4a','link5a','link6a','link7a','link8a','link9a','link10a','link11a','link12a','link13a','link14a','link15a','link16a','link17a','link18a','link19a','link20a','link21a','link22a','link23a','link24a','link25a','link26a','link27a','link28a','allsites','fontcolor','propermenuonly','search','existingtab','propermenuDomains','countremember','optionskipremember','display'], function(items){
		if(items['googleplus']){$('googleplus').value = items['googleplus'];}
		else {$('googleplus').value = 'You';}
		if(items['opacity']){$('opacity').value = items['opacity'];}
		else {$('opacity').value = '100';}
		if(items['country']){$('country').value = items['country'];}
		else {$('country').value = 'com';}
		if(items['backgroundhex']){$('backgroundhex').value = items['backgroundhex'];}
		else {$('backgroundhex').value = '#2D2D2D';}
		if(items['backgroundimagesource']){$('backgroundimagesource').value = items['backgroundimagesource'];}
		else {$('backgroundimagesource').value = '';}
		if(items['backgroundcolor'] == true)$('backgroundcolor').checked = true;
		if(items['backgroundimage'] == true)$('backgroundimage').checked = true;
		if(items['googlesites'] == true)$('googlesites').checked = true;
		if(items['dropshadow'] == true)$('dropshadow').checked = true;
		if(items['link1a'] == true)$('link1a').checked = true;
		if(items['link2a'] == true)$('link2a').checked = true;
		if(items['link3a'] == true)$('link3a').checked = true;
		if(items['link4a'] == true)$('link4a').checked = true;
		if(items['link5a'] == true)$('link5a').checked = true;
		if(items['link6a'] == true)$('link6a').checked = true;
		if(items['link7a'] == true)$('link7a').checked = true;
		if(items['link8a'] == true)$('link8a').checked = true;
		if(items['link9a'] == true)$('link9a').checked = true;
		if(items['link10a'] == true)$('link10a').checked = true;
		if(items['link11a'] == true)$('link11a').checked = true;
		if(items['link12a'] == true)$('link12a').checked = true;
		if(items['link13a'] == true)$('link13a').checked = true;
		if(items['link14a'] == true)$('link14a').checked = true;
		if(items['link15a'] == true)$('link15a').checked = true;
		if(items['link16a'] == true)$('link16a').checked = true;
		if(items['link17a'] == true)$('link17a').checked = true;
		if(items['link18a'] == true)$('link18a').checked = true;
		if(items['link19a'] == true)$('link19a').checked = true;
		if(items['link20a'] == true)$('link20a').checked = true;
		if(items['link21a'] == true)$('link21a').checked = true;
		if(items['link22a'] == true)$('link22a').checked = true;
		if(items['link23a'] == true)$('link23a').checked = true;
		if(items['link24a'] == true)$('link24a').checked = true;
		if(items['link25a'] == true)$('link25a').checked = true;
		if(items['link26a'] == true)$('link26a').checked = true;
		if(items['link27a'] == true)$('link27a').checked = true;
		if(items['link28a'] == true)$('link28a').checked = true;
		if(items['allsites'] == true)$('allsites').checked = true;
		if(items['fontcolor']){$('fontcolor').value = items['fontcolor'];}
		else {$('fontcolor').value = '#cccccc';}
		if(items['propermenuonly'] == true)$('propermenuonly').checked = true;
		if(items['search'] == true)$('search').checked = true;
		if(items['existingtab'] == true)$('existingtab').checked = true;
		if(items['optionskipremember'] == true){$('optionskipremember').checked = true;$('firstcheckboxskipremember').checked = true;}
		if(items['display']){$('display').value = items['display'];}

// show remember page
var countremember = items['countremember'];
if(!countremember){countremember = 0;}
countremember = parseInt(countremember) + 1;
if($('optionskipremember').checked != true){
	if(countremember >= 5) {$('remembershare').style.display = "";countremember = 0;}
	else {$('remembershare').style.display = "none";}
} else {$('remembershare').style.display = "none";}
chrome.storage.sync.set({"countremember": countremember});	

	// load tab div
	var tabListItems = document.getElementById('navbar').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == 'LI' ) {
		var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
		var id = getHash( tabLink.getAttribute('data-tab') );
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
	var manifestData = chrome.runtime.getManifest();
	$("version_number").innerText = manifestData.version;
	
// propermenu - Excluded domains - sort these alphabetically
var propermenuDomains = items["propermenuDomains"];
if(typeof propermenuDomains == "undefined")
propermenuDomains = JSON.stringify({'https://www.google.com': true, 'https://www.youtube.com': true});

if(typeof propermenuDomains == "string") {
	propermenuDomains = JSON.parse(propermenuDomains);
	var abuf = [];
	for(var domain in propermenuDomains)
		abuf.push(domain);
        abuf.sort();
	for(var i = 0; i < abuf.length; i++)
		appendToListBox("propermenuDomainsBox", abuf[i]);
    }

	// retest the function
	test();

	});// chrome storage end
} // end read

// Add a filter string to the list box.
function appendToListBox(boxId, text) { var elt = document.createElement("option"); elt.text = text; elt.value = text; document.getElementById(boxId).add(elt, null); }

// tabel script
    var tabLinks = new Array();
    var contentDivs = new Array();
 
    function showTab() {
      var selectedId = getHash( this.getAttribute('data-tab') );
 
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

function test(){
}

function slidepreview1(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice1.png');save_options();}
function slidepreview2(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice2.png');save_options();}
function slidepreview3(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice3.png');save_options();}
function slidepreview4(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice4.png');save_options();}
function slidepreview5(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice5.png');save_options();}
function slidepreview6(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice6.png');save_options();}

// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

function detectExtension(extensionId, callback) { 
  var img; 
  img = new Image(); 
  img.src = "chrome-extension://" + extensionId + "/icons/icon16.png"; 
  img.onload = function() { 
    callback(true); 
  }; 
  img.onerror = function() { 
    callback(false); 
  };
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
// random generator
var items = Array();
detectExtension(idaa,function(a){if(a != true){items.push(1)}});
detectExtension(iddt,function(a){if(a != true){items.push(2)}});
detectExtension(idtotl,function(a){if(a != true){items.push(3)}});
detectExtension(idft,function(a){if(a != true){items.push(4)}});
detectExtension(idpp,function(a){if(a != true){items.push(5)}});
detectExtension(idfs,function(a){if(a != true){items.push(6)}});
detectExtension(idz,function(a){if(a != true){items.push(7)}runinstalltest()});

function runinstalltest(){
var numberpick = items[Math.floor(Math.random()*items.length)];
// pick this extension
if(numberpick == 1){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Ambient Aurea");
  $("btnpromoaction").addEventListener('click', function() {window.open(ambientaureaproduct)});  
} else if(numberpick == 2){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Date Today");
  $("btnpromoaction").addEventListener('click', function() {window.open(datetodayproduct)});
} else if(numberpick == 3){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Turn Off the Lights");
  $("btnpromoaction").addEventListener('click', function() {window.open(turnoffthelightsproduct)});
} else if(numberpick == 4){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Finance Toolbar");
  $("btnpromoaction").addEventListener('click', function() {window.open(financetoolbarproduct)});
} else if(numberpick == 5){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Proper Menubar");
  $("btnpromoaction").addEventListener('click', function() {window.open(propermenubarproduct)});
} else if(numberpick == 6){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Full Screen");
  $("btnpromoaction").addEventListener('click', function() {window.open(fullscreenproduct)});
} else {
  $("promotext").innerText = chrome.i18n.getMessage("donatetext");
  $("spnpromoaction").innerText = chrome.i18n.getMessage("donatecalltoaction");
  $("btnpromoaction").addEventListener('click', function() {window.open(donatewebsite)});
}
}

// Remove remember
$("skipremember").addEventListener('click', function() {$('remembershare').style.display = "none";});
$("firstcheckboxskipremember").addEventListener('click', function() {if(firstcheckboxskipremember.checked == true){$('optionskipremember').checked = true;}save_options();});
var sharetext = "I highly recommended Proper Menubar. Download and try it yourself! www.stefanvd.net";
var stefanvdurl = propermenubarproduct;var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
$("rememberboxrate").addEventListener("click", function() {window.open(writereview);});
$("rememberboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("rememberboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("rememberboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});

$("shareboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});
	
// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}
var select = document.querySelectorAll('select');
for (var i = 0; i < select.length; i++) {select[i].addEventListener('change', test);select[i].addEventListener('change', save_options);}

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

$("slice1").addEventListener('click', function() {slidepreview1();});
$("slice2").addEventListener('click', function() {slidepreview2();});
$("slice3").addEventListener('click', function() {slidepreview3();});
$("slice4").addEventListener('click', function() {slidepreview4();});
$("slice5").addEventListener('click', function() {slidepreview5();});
$("slice6").addEventListener('click', function() {slidepreview6();});

// proper menu Add website
$("propermenuaddbutton").addEventListener('click', function() {propermenuaddWhitelistDomain();});

// proper menu Remove website
$("propermenuremovebutton").addEventListener('click', function() {propermenuremoveSelectedExcludedDomain();});

// Download Upgrade
$("aadownload").addEventListener('click', function() {window.open(ambientaureaproduct);});
$("ftdownload").addEventListener('click', function() {window.open(financetoolbarproduct);});
$("dtdownload").addEventListener('click', function() {window.open(datetodayproduct)});
$("totldownload").addEventListener('click', function() {window.open(turnoffthelightsproduct)});
$("fsdownload").addEventListener('click', function() {window.open(fullscreenproduct)});
$("zdownload").addEventListener('click', function() {window.open(zoomproduct)});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4ZIWFeG31L_jRs5fRHtzYAc";$('welcomeguide').src = "";});
$("tabdesign").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

// Reset settings
$("resetpropermenubar").addEventListener('click', function() {chrome.storage.sync.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview, "_blank");$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});

// retina check
if(window.devicePixelRatio >= 2) {
$("loadinglamp").src = "icons/icon16@2x.png";$("loadinglamp").style.width = "16px"; $("loadinglamp").style.height = "16px";
$("welcomelamp").src = "icons/icon16@2x.png";$("welcomelamp").style.width = "16px"; $("welcomelamp").style.height = "16px";
$("rememberlamp").src = "icons/icon16@2x.png";$("rememberlamp").style.width = "16px"; $("rememberlamp").style.height = "16px";
}

});