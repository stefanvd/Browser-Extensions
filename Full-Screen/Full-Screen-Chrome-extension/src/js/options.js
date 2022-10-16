//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2020 Stefan vd
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
var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4Zw-Ou8sg7V5NuS482WDvTg";
var darkmode = false;

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
  chrome.runtime.sendMessage({name: "getallpermissions"});

  chrome.storage.sync.set({"contextmenus":$('contextmenus').checked,"autofullscreen":$('autofullscreen').checked,"optionskipremember":$('optionskipremember').checked,"fullscreenweb":$('fullscreenweb').checked,"fullscreenwindow":$('fullscreenwindow').checked,"fullscreenpopup":$('fullscreenpopup').checked,"fullscreenvideo":$('fullscreenvideo').checked,"allwindows":$('allwindows').checked,"videoinwindow":$('videoinwindow').checked,"videooutwindow":$('videooutwindow').checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['contextmenus','fullscreenweb','fullscreenwindow','fullscreenpopup','fullscreenvideo','videoinwindow','videooutwindow'], function(items){
    // find no localstore zoomengine
	  if(items['contextmenus'] == null){firstdefaultvalues['contextmenus'] = true}
    if(items['fullscreenweb'] == null && items['fullscreenwindow'] == null && items['fullscreenvideo'] == null){firstdefaultvalues['fullscreenweb'] = true;firstdefaultvalues['fullscreenwindow'] = false;firstdefaultvalues['fullscreenpopup'] = false;firstdefaultvalues['fullscreenvideo'] = false}
    if(items['videoinwindow'] == null && items['videooutwindow'] == null){firstdefaultvalues['videoinwindow'] = true;firstdefaultvalues['videooutwindow'] = false}
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

chrome.storage.sync.get(['firstDate','contextmenus','autofullscreen','countremember','optionskipremember','fullscreenweb','fullscreenwindow','fullscreenpopup','fullscreenvideo','allwindows','videoinwindow','videooutwindow','firstsawrate','introduce'], function(items){
  if(items['contextmenus'] == true)$('contextmenus').checked = true;
  if(items['autofullscreen'] == true)$('autofullscreen').checked = true;
  if(items['optionskipremember'] == true)$('optionskipremember').checked = true;
  if(items['fullscreenweb'] == true)$('fullscreenweb').checked = true;
  if(items['fullscreenwindow'] == true)$('fullscreenwindow').checked = true;
  if(items['fullscreenvideo'] == true)$('fullscreenvideo').checked = true;
  if(items['allwindows'] == true)$('allwindows').checked = true;
  if(items['videoinwindow'] == true)$('videoinwindow').checked = true;
  if(items['videooutwindow'] == true)$('videooutwindow').checked = true;
  if(items['fullscreenpopup'] == true)$('fullscreenpopup').checked = true;
  
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

function ariacheck(){
  var inputs = document.querySelectorAll('input');
  var i;
  var l = inputs.length;
  for(i = 0; i < l; i++){
      if(inputs[i].getAttribute("role") == "radio" || inputs[i].getAttribute("role") == "checkbox"){
          if(inputs[i].checked == true){
              inputs[i].setAttribute("aria-checked", true);
          }else{
              inputs[i].setAttribute("aria-checked", false);
          }
      }
  }
}

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

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  // If the received message has the expected format...
  if(msg.text === 'receiveallpermissions'){
  // empty ul first
  if($("permullist")){
      var lis = document.querySelectorAll('#permullist li');
      var i;
      var li;
      for(i = 0; li = lis[i]; i++) {
          li.parentNode.removeChild(li);
      }
  }
  var perm = msg.value;
  perm.forEach(function(x){
      if($("permissionlist")){
          if($("permullist")){}else{
              var newpermtitle = document.createElement('h4');
              newpermtitle.textContent = chrome.i18n.getMessage("permissionrequired");
              $("permissionlist").appendChild(newpermtitle);

              var newpermul = document.createElement('ul');
              newpermul.setAttribute('id','permullist');
              $("permissionlist").appendChild(newpermul);
          }

          var newperm = document.createElement('li');
          $("permullist").appendChild(newperm);

          var newpermspan = document.createElement('span');
          newpermspan.textContent = x + ": ";
          newperm.appendChild(newpermspan);
          
          var textperm = "";
          var newpermspandes = document.createElement('span');
          if(x == "activeTab"){textperm = chrome.i18n.getMessage("permissionactivetab");}
          else if(x == "contextMenus"){textperm = chrome.i18n.getMessage("permissioncontextmenu");}
          else if(x == "storage"){textperm = chrome.i18n.getMessage("permissionstorage");}
          else if(x == "tabs"){textperm = chrome.i18n.getMessage("permissiontabs");}
          newpermspandes.textContent = textperm;
          newpermspandes.className = "item";
          newperm.appendChild(newpermspandes);
      }
  });
  }
});

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

if((window.location.href != exoptionspage) && devmode == false){

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
        $("dont-turn-off-the-lights").src = youtubeembed;
        read_options();
        yearnow();
        });
    }else{
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = youtubeembed;
        read_options();
        yearnow();
    }

} else {
    // Add the YouTube player
    $("dont-turn-off-the-lights").src = youtubeembed;
    read_options();
    yearnow();
}

var sharetext = chrome.i18n.getMessage("sharetextd");
var stefanvdurl = fullscreenproduct;
var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);

if($("shareboxyoutube")){
  $("shareboxyoutube").addEventListener("click", function(){window.open(linkyoutube,"_blank");});
}
if($("shareboxfacebook")){
  $("shareboxfacebook").addEventListener("click", function(){window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
}
if($("shareboxtwitter")){
  $("shareboxtwitter").addEventListener("click", function(){window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});
}

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
var i;
var l = inputs.length;
for(i = 0; i < l; i++){inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', ariacheck);inputs[i].addEventListener('change', save_options);}

var select = document.querySelectorAll('select');
var i;
var l = select.length;
for(i = 0; i < l; i++){select[i].addEventListener('change', test);select[i].addEventListener('change', ariacheck);select[i].addEventListener('change', save_options);}

// show all the active permissions in a list
chrome.runtime.sendMessage({name: "getallpermissions"});

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

var guidekb = true;
function memguide(){
    if(guidekb == true){
        // already visible
    }else{
        $("managed-prefs-banner").style.display = "";
    }
}

function mobilecheck(){
    if(window.innerWidth < 480){$('menuToggle').click();}
}

// Save KB download
$("tabbasic").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();OFFworkaroundbugfromsafari();$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";memguide();guidekb = true;mobilecheck();});
$("tabdesign").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";memguide();guidekb = true;mobilecheck();});
$("tabadvan").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";memguide();guidekb = true;mobilecheck();});
$("tabguide").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";guidekb = false;mobilecheck();});
$("tabhelp").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";memguide();guidekb = true;mobilecheck();});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport)});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog)});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate)});

// scroll to top
function Scrolltotop(){$("mainview").scrollTop = 0;}

// remove all videos
function ONworkaroundbugpreview(){$("dont-turn-off-the-lights").src = "";}

// add a video
function OFFworkaroundbugfromsafari(){
    $("dont-turn-off-the-lights").src = youtubeembed;
}

// Reset settings
$("resetfullscreen").addEventListener('click', function() {chrome.storage.sync.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});

// search
var pageinsearch = false;
function OnSearch(input){
  if(input.value == ""){
    pageinsearch = false;
    input.blur();

    var sections = document.getElementsByTagName("section");
    var x;
    var l = sections.length;
    for(x = 0; x < l; x++){
      var section = sections[x];
      section.classList.remove("searchfoundnothing");
    }

    // set view back to the current selected tab
    // and hide back all videos
    var y = document.getElementsByClassName('navbar-item-selected');
    y[0].click();
  }
  else{
    if(pageinsearch == false){
        pageinsearch = true;
        // load all the videos
        OFFworkaroundbugfromsafari();
    }

    // receive the total tab pages
    var tabListItems = $('navbar').childNodes;
    var i;
    var l = tabListItems.length;
    for(i = 0; i < l; i++){
        if(tabListItems[i].nodeName == 'LI'){
        var tabLink = getFirstChildWithTagName(tabListItems[i],'A');
        var id = getHash(tabLink.getAttribute('data-tab'));
        contentDivs[id] = $(id);
        }
    }

    // show all tab pages
    var i = 0;
    var id;
    for(id in contentDivs){
        if(id != "tab3"){
        contentDivs[id].className = 'page';
        }
        i++;
    }
    //---
    var searchword = input.value;

    var sections = document.getElementsByTagName("section");
    var x;
    var l = sections.length;
    for(x = 0; x < l; x++){
        var section = sections[x];
        var content = section.innerHTML;

        if(content.search(new RegExp(searchword, "i")) < 1){
            section.classList.add("searchfoundnothing");
        }else{
            section.classList.remove("searchfoundnothing");
        }
    }

    // hide the h2 if there is no sections visible
    var pages = document.getElementsByClassName("page");
    var z;
    var l = pages.length;
    for(z = 0; z < l; z++){
      var sections = pages[z].getElementsByTagName("section");
      var countnothingcheck = 0;
      var x;
      var q = sections.length;
      for(x = 0; x < q; x++){
        var section = sections[x];

        if(section.classList.contains('searchfoundnothing')){
          countnothingcheck += 1;
        }

      }
      if(countnothingcheck == sections.length){
        // total sections with nothing inside is the same as all the section -> hide the page
        pages[z].classList.add("searchfoundnothing");
      }
      else{
        pages[z].classList.remove("searchfoundnothing");
      }
   }


  }
}

if(document.getElementById("appsearch")){
    document.getElementById("appsearch").addEventListener("search", function(){OnSearch(this);}, false);
    document.getElementById("appsearch").addEventListener("input", function(){OnSearch(this);}, false);
    document.getElementById("btnsearchicon").addEventListener("input", function(){OnSearch(this);}, false);
    document.getElementById("appsearch").placeholder = chrome.i18n.getMessage("searchplaceholder");
}

}