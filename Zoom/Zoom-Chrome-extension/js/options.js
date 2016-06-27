//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
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
  var websitezoomBox = $("websitezoomBox");
  var websitezoomnumberBox = $("websitezoomnumberBox");
  var websitezoom = {};
  for (var i = 0; i < websitezoomBox.length; i++){
    var getnumber = websitezoomnumberBox.options[i].text;
	  websitezoom[websitezoomBox.options[i].value] = getnumber;
  }
  chrome.storage.sync.set({ "allzoom": $('allzoom').checked, "optionskipremember": $('optionskipremember').checked, "contextmenu": $('contextmenu').checked, "badge": $('badge').checked, "defaultzoom": $('defaultzoom').value, "steps": $('steps').value, "lightcolor": $('lightcolor').value, "zoomchrome": $('zoomchrome').checked, "zoomweb": $('zoomweb').checked, "websitezoom": JSON.stringify(websitezoom)});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['zoomchrome', 'zoomweb'], function(items){
    // find no localstore zoomengine
	  if(items['zoomchrome'] == null && items['zoomweb'] == null){firstdefaultvalues['zoomweb'] = true;firstdefaultvalues['zoomchrome'] = false;}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
chrome.storage.sync.get(['allzoom','optionskipremember','countremember','websitezoom','defaultzoom','contextmenu','badge','steps','lightcolor','zoomweb','zoomchrome'], function(items){
		if(items['defaultzoom']){$('defaultzoom').value = items['defaultzoom'];$('slider').value = items['defaultzoom'];}	
		else $('defaultzoom').value = 100;
    if(items['steps']){$('steps').value = items['steps'];}	
		else $('steps').value = 10;
    if(items['lightcolor']){$('lightcolor').value = items['lightcolor'];}	
		else $('lightcolor').value = "#3cb4fe";
    if(items['allzoom'] == true)$('allzoom').checked = true;
		if(items['optionskipremember'] == true)$('optionskipremember').checked = true;
    if(items['contextmenu'] == true)$('contextmenu').checked = true;
    if(items['badge'] == true)$('badge').checked = true;
    if(items['zoomchrome'] == true){$('zoomchrome').checked = true;$('zoomweb').checked = false;}
    if(items['zoomweb'] == true){$('zoomweb').checked = true;$('zoomchrome').checked = false;}

// if empty use this
var websitezoom = items['websitezoom'];
if(typeof websitezoom == "undefined" || websitezoom == null){
websitezoom = JSON.stringify({'https://www.stefanvd.net': ["90"], 'https://www.google.com': ["90"], 'http://www.nytimes.com': ["75"]});
}

if(typeof websitezoom == "string") {
	websitezoom = JSON.parse(websitezoom);
	var atbbuf = [];
	for(var domain in websitezoom)
		atbbuf.push(domain);
        atbbuf.sort();
        
	for(var i = 0; i < atbbuf.length; i++){
		appendToListBox("websitezoomBox", atbbuf[i],websitezoom[''+atbbuf[i]+'']);
    }
}
	
// show reminder page
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
	
    test(); // do the test
	});// chrome storage end
} // end read

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

function appendToListBox(boxId, text, phonenumber) {
    var elt = document.createElement("option");
    elt.text = text;
    elt.value = text;
    $(boxId).add(elt, null);
    
    var phelt = document.createElement("option");
    phelt.text = phonenumber;
    phelt.value = text;
    $("websitezoomnumberBox").add(phelt, null);
}

function websitezoomchangeurl(){
  var selwzv = $("websitezoomBox").selectedIndex;
  $("websitezoomnumberBox").selectedIndex = selwzv;
}

function websitezoomchangenumberl(){
  var selwzv = $("websitezoomnumberBox").selectedIndex;
  $("websitezoomBox").selectedIndex = selwzv;
}

function websitezoomadd() {
    var domain = $("websitezoomname").value;
    var number = $("websitezoomnumber").value;
    if(domain == ""){return;}
    if(number == ""){return;}
    appendToListBox("websitezoomBox", domain, number);
    save_options();
}

function websitezoomremoveSelectedExcludedDomain() {
    var websitezoomBox = $("websitezoomBox");
    var websitezoomphoneBox = $("websitezoomnumberBox");
    for (var i = websitezoomBox.length-1; i >= 0; i--) {
        if (websitezoomBox.options[i].selected){
            websitezoomBox.remove(i);
            websitezoomphoneBox.remove(i);
        }
    }
    save_options();
}

function test(){
  if($('allzoom').checked){
    $("websitezoomBox").disabled = true;
    $("websitezoomnumberBox").disabled = true;
    $("websitezoomname").disabled = true;
    $("websitezoomnumber").disabled = true;
    $("websitezoomaddbutton").disabled = true;
    $("websitezoomremovebutton").disabled = true;
  } else{
    $("websitezoomBox").disabled = false;
    $("websitezoomnumberBox").disabled = false;  
    $("websitezoomname").disabled = false;
    $("websitezoomnumber").disabled = false;
    $("websitezoomaddbutton").disabled = false;
    $("websitezoomremovebutton").disabled = false;
  }
}
	
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
var sharetext = "I highly recommended Zoom. Download and try it yourself! www.stefanvd.net";
var stefanvdurl = zoomproduct;var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
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

$("slider").addEventListener('change', function() {$("defaultzoom").value=this.value;save_options();});
$("defaultzoom").addEventListener('change', function() {$("slider").value=this.value;save_options();});

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

// Download Upgrade
$("fndownload").addEventListener('click', function() {window.open(financetoolbarproduct);});
$("ppdownload").addEventListener('click', function() {window.open(propermenubarproduct);});
$("aadownload").addEventListener('click', function() {window.open(ambientaureaproduct)});
$("totldownload").addEventListener('click', function() {window.open(turnoffthelightsproduct)});
$("fsdownload").addEventListener('click', function() {window.open(fullscreenproduct)});
$("dtdownload").addEventListener('click', function() {window.open(datetodayproduct)});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4ZRrIhSRo6cWEJVeS3_M5Yb";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport)});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog)});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate)});

// Change
$("websitezoomBox").addEventListener('click', function() {websitezoomchangeurl()});
$("websitezoomnumberBox").addEventListener('click', function() {websitezoomchangenumberl()});
// Add
$("websitezoomaddbutton").addEventListener('click', function() {websitezoomadd()});
// Remove
$("websitezoomremovebutton").addEventListener('click', function() {websitezoomremoveSelectedExcludedDomain()});

// Reset settings
$("resetzoom").addEventListener('click', function() {chrome.storage.sync.clear();location.reload()});

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