//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2017 Stefan vd
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

window.addEventListener("message", (event) => {
	if(event.origin == "https://www.stefanvd.net"){
    if (event.source == window &&
        event.data &&
        event.data.direction == "from-page-script") {
        //alert("Content script received message: \"" + event.data.message + "\"");
        var myid = chrome.runtime.id;
        var myversion = chrome.runtime.getManifest().version;
        window.postMessage({
            direction: "from-fullscreen-script",
            message: myid,
            version: myversion
        }, "https://www.stefanvd.net");
    }
    }
});

// Option to save current value
function save_options(){
  chrome.storage.sync.set({"contextmenus":$('contextmenus').checked,"autofullscreen":$('autofullscreen').checked,"optionskipremember": $('optionskipremember').checked,"fullscreenweb":$('fullscreenweb').checked,"fullscreenwindow":$('fullscreenwindow').checked,"fullscreenvideo":$('fullscreenvideo').checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['contextmenus','fullscreenweb','fullscreenwindow','fullscreenvideo'], function(items){
    // find no localstore zoomengine
	  if(items['contextmenus'] == null){firstdefaultvalues['contextmenus'] = true}
    if(items['fullscreenweb'] == null && items['fullscreenwindow'] == null && items['fullscreenvideo'] == null){firstdefaultvalues['fullscreenweb'] = true;firstdefaultvalues['fullscreenwindow'] = false;firstdefaultvalues['fullscreenvideo'] = false}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
//---
// rate
$("materialModalRate").addEventListener('click', function(e){
  closeMaterialRateAlert(e, false);
});
$("materialModalRateContent").addEventListener('click', function(e){
  e.stopPropagation();
});
$("materialModalRateButtonOK").addEventListener('click', function(e){
  closeMaterialRateAlert(e, true);
  window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});
});
$("materialModalRateButtonCANCEL").addEventListener('click', function(e){
  closeMaterialRateAlert(e, false);
});

// introduce
$("materialModalIntroduce").addEventListener('click', function(e){
  closeMaterialIntroduceAlert(e, false);
});
$("materialModalIntroduceContent").addEventListener('click', function(e){
  e.stopPropagation();
});
$("materialModalIntroduceButtonOK").addEventListener('click', function(e){
  closeMaterialIntroduceAlert(e, true);
});
$("materialModalIntroduceButtonCANCEL").addEventListener('click', function(e){
  closeMaterialIntroduceAlert(e, false);
});

// dialog
function materialAlert(callback){
  document.getElementById('materialModalButtonCANCEL').style.display = 'none';
  document.getElementById('materialModal').className = 'show';
  document.getElementById('materialModal').setAttribute('aria-disabled', "false");   
}
function closeMaterialAlert(e, result){
  e.stopPropagation();
  document.getElementById('materialModal').className = 'hide';
  document.getElementById('materialModal').setAttribute('aria-disabled', "true");   
}

// rate
function materialRateAlert(callback){
  document.getElementById('materialModalRate').className = 'show';
  document.getElementById('materialModalRate').setAttribute('aria-disabled', "false");   
}
function closeMaterialRateAlert(e, result){
  e.stopPropagation();
  document.getElementById('materialModalRate').className = 'hide';
  document.getElementById('materialModalRate').setAttribute('aria-disabled', "true");   
}

// introduce
function materialIntroduceAlert(callback){
  document.getElementById('materialModalIntroduceButtonCANCEL').style.display = 'none';
  document.getElementById('materialModalIntroduce').className = 'show';
  document.getElementById('materialModalIntroduce').setAttribute('aria-disabled', "false");   
}
function closeMaterialIntroduceAlert(e, result){
  e.stopPropagation();
  document.getElementById('materialModalIntroduce').className = 'hide';
  document.getElementById('materialModalIntroduce').setAttribute('aria-disabled', "true");  
}
//---

chrome.storage.sync.get(['firstDate','contextmenus','autofullscreen','countremember','optionskipremember','fullscreenweb','fullscreenwindow','fullscreenvideo','firstsawrate','introduce'], function(items){
  if(items['contextmenus'] == true)$('contextmenus').checked = true;
  if(items['autofullscreen'] == true)$('autofullscreen').checked = true;
  if(items['optionskipremember'] == true)$('optionskipremember').checked = true;
  if(items['fullscreenweb'] == true)$('fullscreenweb').checked = true;
  if(items['fullscreenwindow'] == true)$('fullscreenwindow').checked = true;
  if(items['fullscreenvideo'] == true)$('fullscreenvideo').checked = true;

// show introduce
if(items['introduce'] != true){
  window.setTimeout(function () {
      materialIntroduceAlert(function (result) { console.log(result) });
  }, 2500);
  chrome.storage.sync.set({"introduce": true});
}

// show remember page
var firstmonth = false;
var currentDate = new Date().getTime();
if(items['firstDate']){
  var datestart = items['firstDate'];
  var dateend = datestart + (30 * 24 * 60 * 60 * 1000);
  if(currentDate>=dateend){firstmonth = false;}
  else{firstmonth = true;}
}else{
  chrome.storage.sync.set({"firstDate": currentDate});
  firstmonth = true;
}

if(firstmonth){
// show nothing
$("sectionreviewbox").style.display = "none";
}else{
  if($('optionskipremember').checked != true){
      $("sectionreviewbox").style.display = "block"; // show now always the banner
          if(items['firstsawrate'] != true){
              window.setTimeout(function () {
                  materialRateAlert(function(result){console.log(result)})
              }, 2500);
              chrome.storage.sync.set({"firstsawrate": true});
          }
      else{}
  }else{
      $("sectionreviewbox").style.display = "none";
  }
}

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

function test(){}

// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

function checkdarkmode(){
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false

        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            document.body.className = 'light';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
        }
    });
}

/* Option page body action */
// Read current value settings
window.addEventListener('load', function(){
  // remove loading screen
  $('loading').style.display = "none";
});

if(window.location.href != exoptionspage){
  document.addEventListener('DOMContentLoaded', domcontentloaded);
}else{
  domcontentloaded();
}


function domcontentloaded(){
checkdarkmode();

if(window.location.href != exoptionspage){

    var condition = navigator.onLine ? "online" : "offline";
    if(condition == "online"){
        fetch(developerwebsite).then(function (response) {
            if(response.status === 200){
                // website is online
                // redirect to there
                window.location.href = exoptionspage;
            }
            else{
                throw new Error(response.statusText);
            }

        }).catch(e=>{
        //is not there
        // use offline page
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4Zw-Ou8sg7V5NuS482WDvTg";
        read_options();
        yearnow();
        });
    }else{
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4Zw-Ou8sg7V5NuS482WDvTg";
        read_options();
        yearnow();
    }

} else {
    // Add the YouTube player
    $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4Zw-Ou8sg7V5NuS482WDvTg";
    read_options();
    yearnow();
}

var sharetext = chrome.i18n.getMessage("sharetextd");
var stefanvdurl = fullscreenproduct;
var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
$("shareboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});

var isMenuClick = false;
var menu = document.getElementById('dotmenu');
document.addEventListener('click',()=>{
    if(!isMenuClick){
       //Hide the menu here
       $('dropmenu').className = "hide";
    }
    //Reset isMenuClick 
    isMenuClick = false;
})
menu.addEventListener('click',()=>{
    isMenuClick = true;
})

$("dotmenu").addEventListener('click', function() {
    if($('dropmenu').className == "show"){
        $('dropmenu').className = "hide";
    }else{
        $('dropmenu').className = "show";
    }
});

$("darkpanel").addEventListener('click', function() {
    $('menuToggle').click();
});

$("titleex").addEventListener('click', function() {
    window.open(developerwebsite);
});

$("btnsupport").addEventListener('click', function() {
    window.open(linksupport);$('dropmenu').className = "hide";
});

$("btnactivedarkmode").addEventListener('click', function() {
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false
        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            $('dropmenu').className = "hide";
            document.body.className = 'light';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
            chrome.storage.sync.set({"darkmode":false});
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            $('dropmenu').className = "hide";
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
            chrome.storage.sync.set({"darkmode":true});
        }
    });
});

// promotion
$("promotext").innerText = chrome.i18n.getMessage("donatetext");
$("spnpromoaction").innerText = chrome.i18n.getMessage("donatecalltoaction");
$("btnpromoaction").addEventListener('click', function() {window.open(donatewebsite)});

// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}
var select = document.querySelectorAll('select');
for (var i = 0; i < select.length; i++) {select[i].addEventListener('change', test);select[i].addEventListener('change', save_options);}

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport);});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog);});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate);});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4Zw-Ou8sg7V5NuS482WDvTg";$('welcomeguide').src = "";});
$("tabdesign").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport)});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog)});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate)});

// Reset settings
$("resetfullscreen").addEventListener('click', function() {chrome.storage.sync.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});

};