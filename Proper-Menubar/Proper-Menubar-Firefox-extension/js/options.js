//================================================
/*

Proper Menubar
Add the best menu bar to get easy and fast access to all your useful browser options and internet products!
Copyright (C) 2019 Stefan vd
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

var youtubeembed = "https://www.youtube.com/embed/?listType=playlist&list=PLfXHh3TKRb4ZIWFeG31L_jRs5fRHtzYAc";

window.addEventListener("message", (event) => {
	if(event.origin == "https://www.stefanvd.net"){
    if (event.source == window &&
        event.data &&
        event.data.direction == "from-page-script") {
        //alert("Content script received message: \"" + event.data.message + "\"");
        var myid = chrome.runtime.id;
        var myversion = chrome.runtime.getManifest().version;
        window.postMessage({
            direction: "from-propermenubar-script",
            message: myid,
            version: myversion
        }, "https://www.stefanvd.net");
    }
    }
});

// Option to save current value
function save_options(){
	// toolbar Excluded domains
	var toolbarDomainsBox = $("toolbarDomainsBox");
	var toolbarDomains = {};
    for (var i = 0; i < toolbarDomainsBox.length; i++){toolbarDomains[toolbarDomainsBox.options[i].value] = true;}

    var googlebarDomainsBox = $("googlebarDomainsBox");
	var googlebarDomains = {};
    for (var i = 0; i < googlebarDomainsBox.length; i++){googlebarDomains[googlebarDomainsBox.options[i].value] = true;}

  	chrome.storage.sync.set({"opacity": $('opacity').value,"country":$('country').value, "backgroundhex":$('backgroundhex').value, "backgroundimagesource":$('backgroundimagesource').value,"backgroundcolor":$('backgroundcolor').checked,"backgroundimage":$('backgroundimage').checked,"dropshadow":$('dropshadow').checked,"allsites":$('allsites').checked,"fontcolor":$('fontcolor').value,"googlesites":$('googlesites').checked,"search":$('search').checked,"existingtab":$('existingtab').checked,"toolbarDomains": JSON.stringify(toolbarDomains),"optionskipremember":$('optionskipremember').checked,"display":$('display').value,"hovertextcolor":$('hovertextcolor').value,"hoverbackground":$('hoverbackground').value,"getpositiontop": $("getpositiontop").checked,'getpositionbottom': $("getpositionbottom").checked,"toolbarwhite": $("toolbarwhite").checked, "toolbarblack": $("toolbarblack").checked,"toolbaronly":$('toolbaronly').checked,"googleproducts":$("googleproducts").checked,"menuproducts":$("menuproducts").checked,"googlebarDomains": JSON.stringify(googlebarDomains)});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['backgroundcolor','backgroundimage','googlesites','allsites','dropshadow','display','search','hovertextcolor','hoverbackground','getpositiontop','getpositionbottom','toolbarwhite','toolbarblack','googleproducts','menuproducts'], function(items){
    // find no localstore zoomengine
	  if(items['backgroundcolor'] == null && items['backgroundimage'] == null){firstdefaultvalues['backgroundcolor'] = true;firstdefaultvalues['backgroundimage'] = false}
	  if(items['allsites'] == null){firstdefaultvalues['allsites'] = true}
	  if(items['dropshadow'] == null){firstdefaultvalues['dropshadow'] = true}
      if(items['display'] == null){firstdefaultvalues['display'] = 13}
      if(items['search'] == null){firstdefaultvalues['search'] = true}
	  if(items['hovertextcolor'] == null){firstdefaultvalues['hovertextcolor'] = "#ffffff"}
	  if(items['hoverbackground'] == null){firstdefaultvalues['hoverbackground'] = "#444444"}
      if(items['getpositiontop'] == null && items['getpositionbottom'] == null){firstdefaultvalues['getpositiontop'] = true;firstdefaultvalues['getpositionbottom'] = false;}
      if(items['toolbarwhite'] == null && items['toolbarblack'] == null){firstdefaultvalues['toolbarwhite'] = true;firstdefaultvalues['toolbarblack'] = false;}
      if(items['googleproducts'] == null && items['menuproducts'] == null){firstdefaultvalues['googleproducts'] = false;firstdefaultvalues['menuproducts'] = true;}

    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){

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

chrome.storage.sync.get(['firstDate','opacity','country','backgroundhex','backgroundimagesource','backgroundcolor','backgroundimage','googlesites','dropshadow','allsites','fontcolor','search','existingtab','propermenuDomains','countremember','optionskipremember','display','hovertextcolor','hoverbackground','firstsawrate','introduce','getpositiontop','getpositionbottom','toolbarwhite','toolbarblack','toolbaronly','googleproducts','menuproducts','googlebarDomains','toolbarDomains'], function(items){
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
		if(items['allsites'] == true)$('allsites').checked = true;
		if(items['fontcolor']){$('fontcolor').value = items['fontcolor'];}
		else {$('fontcolor').value = '#cccccc';}
		if(items['toolbaronly'] == true)$('toolbaronly').checked = true;
		if(items['search'] == true)$('search').checked = true;
		if(items['existingtab'] == true)$('existingtab').checked = true;
		if(items['optionskipremember'] == true){$('optionskipremember').checked = true;$('firstcheckboxskipremember').checked = true;}
		if(items['display']){$('display').value = items['display'];}
		if(items['hovertextcolor']){$('hovertextcolor').value = items['hovertextcolor'];}
		else {$('hovertextcolor').value = '#ffffff';}
		if(items['hoverbackground']){$('hoverbackground').value = items['hoverbackground'];}
        else {$('hoverbackground').value = '#444444';}
        if(items['getpositiontop'] == true)$('getpositiontop').checked = true;
        if(items['getpositionbottom'] == true)$('getpositionbottom').checked = true;
        if(items['toolbarwhite'] == true)$('toolbarwhite').checked = true;
        if(items['toolbarblack'] == true)$('toolbarblack').checked = true;
        if(items['googleproducts'] == true)$('googleproducts').checked = true;
        if(items['menuproducts'] == true)$('menuproducts').checked = true;

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

// toolbar - Excluded domains - sort these alphabetically
var toolbarDomains = items["toolbarDomains"];
if(typeof toolbarDomains == "undefined")
toolbarDomains = JSON.stringify({'https://www.google.com': true, 'https://www.youtube.com': true});

if(typeof toolbarDomains == "string") {
	toolbarDomains = JSON.parse(toolbarDomains);
	var abuf = [];
	for(var domain in toolbarDomains)
		abuf.push(domain);
        abuf.sort();
	for(var i = 0; i < abuf.length; i++)
		appendToListBox("toolbarDomainsBox", abuf[i]);
    }
    
// google bar - Excluded domains - sort these alphabetically
var googlebarDomains = items["googlebarDomains"];
if(typeof googlebarDomains == "undefined")
googlebarDomains = JSON.stringify({'link1a': true, 'link2a': true, 'link3a': true, 'link4a': true, 'link5a': true, 'link6a': true, 'link7a': true, 'link8a': true, 'link9a': true, 'link10a': true, 'link11a': true, 'link12a': true, 'link13a': true, 'link14a': true, 'link15a': true, 'link16a': true, 'link17a': true, 'link18a': true, 'link19a': true, 'link20a': true, 'link21a': true, 'link22a': true, 'link23a': true, 'link24a': true, 'link25a': true, 'link26a': true, 'link27a': true, 'link28a': true});

if(typeof googlebarDomains == "string") {
	googlebarDomains = JSON.parse(googlebarDomains);
	var gbuf = [];
	for(var domain in googlebarDomains)
		gbuf.push(domain);
	for(var i = 0; i < gbuf.length; i++)
        tagappendToListBox("googlebarDomainsBox", gbuf[i]);
	}

	// retest the function
	test();

	});// chrome storage end
} // end read

// Add a filter string to the list box.
function appendToListBox(boxId, text) { var elt = document.createElement("option"); elt.text = text; elt.value = text; document.getElementById(boxId).add(elt, null); }

function tagappendToListBox(boxId, text) { var elt = document.createElement("option"); var productname = chrome.i18n.getMessage(text); elt.text = productname; elt.value = text; document.getElementById(boxId).add(elt, null); document.getElementById("tag"+text).className = "hidden"; }

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
function toolbaraddWhitelistDomain() {
    var domain = $("toolbarwebsiteurl").value;
    appendToListBox("toolbarDomainsBox", domain);
    save_options();
}

function toolbarremoveSelectedExcludedDomain() {
    var toolbarDomainsBox = $("toolbarDomainsBox");
    for (var i = toolbarDomainsBox.length-1; i >= 0; i--) {
        if (toolbarDomainsBox.options[i].selected)
		toolbarDomainsBox.remove(i);
    }
    save_options();
}

function googlebarremoveSelectedExcludedDomain() {
    var googlebarDomainsBox = $("googlebarDomainsBox");
    for (var i = googlebarDomainsBox.length-1; i >= 0; i--) {
        if (googlebarDomainsBox.options[i].selected){
            $("tag"+googlebarDomainsBox.options[i].value).className = "tags";
            googlebarDomainsBox.remove(i);
        }
    }
    save_options();
}

function moveproductdown() {
	var excludedstockBox = document.getElementById("googlebarDomainsBox");
    var i = excludedstockBox.selectedIndex;
    try{
	var txt = excludedstockBox.options[i + 1].text
	var val = excludedstockBox.options[i + 1].value
	excludedstockBox.options[i + 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i + 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i + 1;
    save_options();
    }catch(e){}
}

function moveproductup() {
	var excludedstockBox = document.getElementById("googlebarDomainsBox");
    var i = excludedstockBox.selectedIndex;
    try{
	var txt = excludedstockBox.options[i - 1].text
	var val = excludedstockBox.options[i - 1].value
	excludedstockBox.options[i - 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i - 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i - 1;	
    save_options();
    }catch(e){}
}

function test(){
    if(document.getElementById("toolbaronly").checked == true){
        document.getElementById("toolbarwebsiteurl").disabled = false;
        document.getElementById("toolbaraddbutton").disabled = false;
        document.getElementById("toolbarremovebutton").disabled = false;
        document.getElementById("toolbarDomainsBox").disabled = false;
        document.getElementById("toolbarwhite").disabled = false;
        document.getElementById("toolbarblack").disabled = false;
    }else{
        document.getElementById("toolbarwebsiteurl").disabled = true;
        document.getElementById("toolbaraddbutton").disabled = true;
        document.getElementById("toolbarremovebutton").disabled = true;
        document.getElementById("toolbarDomainsBox").disabled = true;
        document.getElementById("toolbarwhite").disabled = true;
        document.getElementById("toolbarblack").disabled = true;
    }

    if(document.getElementById("googleproducts").checked == true){
        document.getElementById("googlebarremovebutton").disabled = false;
        document.getElementById("googlebarDomainsBox").disabled = false;
        document.getElementById("googlebarupbutton").disabled = false;
        document.getElementById("googlebardownbutton").disabled = false;
    }else{
        document.getElementById("googlebarremovebutton").disabled = true;
        document.getElementById("googlebarDomainsBox").disabled = true;
        document.getElementById("googlebarupbutton").disabled = true;
        document.getElementById("googlebardownbutton").disabled = true;
    }
}

function slidepreview1(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice1.png');save_options();}
function slidepreview2(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice2.png');save_options();}
function slidepreview3(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice3.png');save_options();}
function slidepreview4(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice4.png');save_options();}
function slidepreview5(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice5.png');save_options();}
function slidepreview6(){$("backgroundimagesource").value = chrome.extension.getURL('/images/slice6.png');save_options();}

// Current year
function yearnow(){
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

function checkdarkmode(){
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false

        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon16@2x.png";
            $('headlamp').srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            document.body.className = 'light';
            $('headlamp').src = "icons/icon16@2x.png";
            $('headlamp').srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
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
        fetch(developerwebsite).then(function(response) {
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

// Remove remember
var sharetext = "I highly recommended Proper Menubar. Download and try it yourself! www.stefanvd.net";
var stefanvdurl = propermenubarproduct;
var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);

$("shareboxyoutube").addEventListener("click", function() {window.open(linkyoutube,"_blank");});
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
            $('headlamp').src = "icons/icon16@2x.png";
            $('headlamp').srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
            chrome.storage.sync.set({"darkmode":false});
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            $('dropmenu').className = "hide";
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon16@2x.png";
            $('headlamp').srcset = "icons/icon16.png 1x, icons/icon16@2x.png 2x";
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

// Move up
$("googlebarupbutton").addEventListener('click', function() {moveproductup();});

// Move down
$("googlebardownbutton").addEventListener('click', function() {moveproductdown();});

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

$("slice1").addEventListener('click', function() {slidepreview1();});
$("slice2").addEventListener('click', function() {slidepreview2();});
$("slice3").addEventListener('click', function() {slidepreview3();});
$("slice4").addEventListener('click', function() {slidepreview4();});
$("slice5").addEventListener('click', function() {slidepreview5();});
$("slice6").addEventListener('click', function() {slidepreview6();});

// toolbar Add website
$('formtoolbar').addEventListener("submit", function(e){e.preventDefault();toolbaraddWhitelistDomain();});

// toolbar Remove website
$("toolbarremovebutton").addEventListener('click', function() {toolbarremoveSelectedExcludedDomain();});

// googlebar Add product
var inputs, index;
inputs = $("tagbox").getElementsByClassName('tags');
for (index = 0; index < inputs.length; ++index) {
    inputs[index].addEventListener("click", function(event){
        var prod = this.id; prod = prod.substr(3);
        tagappendToListBox("googlebarDomainsBox", prod);
        save_options();
    },false);
}

// googlebar Remove website
$("googlebarremovebutton").addEventListener('click', function() {googlebarremoveSelectedExcludedDomain();});

$("removepermissioncopy").addEventListener('click', function() {
chrome.permissions.remove({
    permissions: ['clipboardWrite']
  }, function(removed) {
    if (removed) {
        // The permissions have been removed.
        var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
        window.alert(txtpermission);
      } else {
        // The permissions have not been removed (e.g., you tried to remove
        // required permissions).
        var txtpermission = chrome.i18n.getMessage("wpermissionnotremoved");
        window.alert(txtpermission);
      }
  });
});

$("removepermissionpaste").addEventListener('click', function() {
chrome.permissions.remove({
    permissions: ['clipboardRead']
  }, function(removed) {
    if (removed) {
        // The permissions have been removed.
        var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
        window.alert(txtpermission);
      } else {
        // The permissions have not been removed (e.g., you tried to remove
        // required permissions).
        var txtpermission = chrome.i18n.getMessage("wpermissionnotremoved");
        window.alert(txtpermission);
      }
  });
});

$("removepermissionmhtml").addEventListener('click', function() {
chrome.permissions.remove({
    permissions: ['pageCapture']
  }, function(removed) {
    if (removed) {
      // The permissions have been removed.
      var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
      window.alert(txtpermission);
    } else {
      // The permissions have not been removed (e.g., you tried to remove
      // required permissions).
      var txtpermission = chrome.i18n.getMessage("wpermissionnotremoved");
      window.alert(txtpermission);
    }
  });
});

$("removepermissionbookmark").addEventListener('click', function() {
chrome.permissions.remove({
    permissions: ['bookmarks']
  }, function(removed) {
    if (removed) {
        // The permissions have been removed.
        var txtpermission = chrome.i18n.getMessage("wpermissionremoved");
        window.alert(txtpermission);
      } else {
        // The permissions have not been removed (e.g., you tried to remove
        // required permissions).
        var txtpermission = chrome.i18n.getMessage("wpermissionnotremoved");
        window.alert(txtpermission);
      }
  });
});

// Save KB download
$("tabbasic").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();OFFworkaroundbugfromsafari();$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});
$("tabdesign").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});
$("tabadvan").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});
$("tabguide").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";guidekb = false;mobilecheck();});
$("tabhelp").addEventListener('click', function() {Scrolltotop();ONworkaroundbugpreview();$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport);});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog);});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate);});

// scroll to top
function Scrolltotop(){$("mainview").scrollTop = 0;}

// remove all videos
function ONworkaroundbugpreview(){$("dont-turn-off-the-lights").src = "";}

// add a video
function OFFworkaroundbugfromsafari(){
    $("dont-turn-off-the-lights").src = youtubeembed;
}

// Reset settings
$("resetpropermenubar").addEventListener('click', function() {chrome.storage.sync.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview, "_blank");$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});

// search
var pageinsearch = false;
function OnSearch(input) {
  if(input.value == "") {
    pageinsearch = false;
    input.blur();

    let sections = document.getElementsByTagName("section");
    for (let x = 0; x < sections.length; x++) {
      let section = sections[x];
      section.classList.remove("searchfoundnothing");
    }

    // set view back to the current selected tab
    // and hide back all videos
    var y = document.getElementsByClassName('navbar-item-selected');
    y[0].click();
  }
  else {
    if(pageinsearch == false){
        pageinsearch = true;
        // load all the videos
        OFFworkaroundbugfromsafari();
    }

    // receive the total tab pages
    var tabListItems = $('navbar').childNodes;
    for ( var i = 0; i < tabListItems.length; i++ ) {
        if ( tabListItems[i].nodeName == 'LI' ) {
        var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
        var id = getHash( tabLink.getAttribute('data-tab') );
        contentDivs[id] = $( id );
        }
    }

    // show all tab pages
    var i = 0;
    for ( var id in contentDivs ) {
        if(id != "tab3"){
        contentDivs[id].className = 'page';
        }
        i++;
    }
    //---
    var searchword = input.value;

    let sections = document.getElementsByTagName("section");
    for (let x = 0; x < sections.length; x++) {
        let section = sections[x];
        let content = section.innerHTML;

        if(content.search(new RegExp(searchword, "i")) < 1){
            section.classList.add("searchfoundnothing");
        }else{
            section.classList.remove("searchfoundnothing");
        }
    }

    // hide the h2 if there is no sections visible
    let pages = document.getElementsByClassName("page");
    for (let z = 0; z < pages.length; z++) {
      let sections = pages[z].getElementsByTagName("section");
      var countnothingcheck = 0;
      for (let x = 0; x < sections.length; x++) {
        let section = sections[x];

        if (section.classList.contains('searchfoundnothing')) {
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