//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
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
	var em = $("marqueebehaviour");
	var ed = $("direction");
	var eg = $("getfontfamily");
	// Excluded domains
	var excludedstockBox = document.getElementById("excludedstockBox");
	var excludedstock = {};
	for (var i = 0; i < excludedstockBox.length; i++){excludedstock[excludedstockBox.options[i].value] = true;}

  chrome.storage.sync.set({ "marqueebehaviour": em.options[em.selectedIndex].value, "direction": ed.options[ed.selectedIndex].value, "scrollamount": $('scrollamount').value, "japan": $('japan').checked, "xminutes": $('xminutes').value, "favoritestock": $('favoritestock').checked, "favo1": $('favo1').value, "favo2": $('favo2').value, "favo3": $('favo3').value, "favo4": $('favo4').value, "getinfovaluepercent": $('getinfovaluepercent').checked, "getinfovaluestock": $('getinfovaluestock').checked, "getinfovaluemc": $('getinfovaluemc').checked, "getfontfamily": eg.options[eg.selectedIndex].value, "getfontsize": $('getfontsize').value, "excludedstock": JSON.stringify(excludedstock),"optionskipremember": $('optionskipremember').checked, "lightcolor": $('lightcolor').value, "redcolor": $('redcolor').value, "greencolor": $('greencolor').value,"textcolor": $('textcolor').value, "dropshadow": $("dropshadow").checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['getinfovaluepercent','getinfovaluestock','getinfovaluepercent','dropshadow'], function(items){
    // find no localstore zoomengine
	  if(items['getinfovaluepercent'] == null && items['getinfovaluestock'] == null && items['getinfovaluemc'] == null){firstdefaultvalues['getinfovaluepercent'] = true;firstdefaultvalues['getinfovaluestock'] = false;firstdefaultvalues['getinfovaluemc'] = false;}
	  if(items['dropshadow'] == null){firstdefaultvalues['dropshadow'] = true}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
chrome.storage.sync.get(['marqueebehaviour','direction','scrollamount','japan','xminutes','favoritestock','favo1','favo2','favo3','favo4','getinfovaluestock','getinfovaluepercent','getinfovaluemc','getfontfamily','getfontsize','excludedstock','countremember','optionskipremember','lightcolor','redcolor','greencolor','textcolor','dropshadow'], function(items){
		if(items['marqueebehaviour']){$('marqueebehaviour').value = items['marqueebehaviour'];}
		else {$('marqueebehaviour').value = "scroll";}
		if(items['direction']){$('direction').value = items['direction'];}
		else {$('direction').value = "left";}
		if(items['scrollamount']){$('scrollamount').value = items['scrollamount'];}
		else {$('scrollamount').value = '35';}
		if(items['japan'] == true)$('japan').checked = true;
		if(items['xminutes']){$('xminutes').value = items['xminutes'];}
		else {$('xminutes').value = '15';}
		if(items['favoritestock'] == true)$('favoritestock').checked = true;
		if(items['favo1']){$('favo1').value = items['favo1'];}
		else {$('favo1').value = 'EURUSD=X';}
		if(items['favo2']){$('favo2').value = items['favo2'];}
		else {$('favo2').value = 'USDJPY=X';}
		if(items['favo3']){$('favo3').value = items['favo3'];}
		else {$('favo3').value = 'GBPUSD=X';}
		if(items['favo4']){$('favo4').value = items['favo4'];}
		else {$('favo4').value = 'USDCAD=X';}
		if(items['getinfovaluestock'] == true)$('getinfovaluestock').checked = true;
		if(items['getinfovaluepercent'] == true)$('getinfovaluepercent').checked = true;
		if(items['getinfovaluemc'] == true)$('getinfovaluemc').checked = true;
		if(items['getfontfamily']){$('getfontfamily').value = items['getfontfamily'];}
		else {$('getfontfamily').value = 'jd_lcd_roundedregular';}
		if(items['getfontsize']){$('getfontsize').value = items['getfontsize'];}
		else {$('getfontsize').value = '27';}
		if(items['lightcolor']){$('lightcolor').value = items['lightcolor'];$('examplebar').style.background = items['lightcolor'];}
		else {$('lightcolor').value = '#000000';$('examplebar').style.background = '#000000';}
		if(items['optionskipremember'] == true){$('optionskipremember').checked = true;$('firstcheckboxskipremember').checked = true;}
		if(items['redcolor']){$('redcolor').value = items['redcolor'];}
		else {$('redcolor').value = '#f00000';}
		if(items['greencolor']){$('greencolor').value = items['greencolor'];}
		else {$('greencolor').value = '#008000';}
		if(items['textcolor']){$('textcolor').value = items['textcolor'];}
		else {$('textcolor').value = '#ffffff';}
		if(items['dropshadow'] == true)$('dropshadow').checked = true;

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
	
// Excluded stock
var excludedstock = items['excludedstock'];
if(typeof excludedstock == "undefined")
excludedstock = JSON.stringify({'GOOG': true,'MSFT': true,'YHOO': true,'AAPL': true,'^DJX': true,'^SPX': true,'Gold': true,'Oil': true,'QQQX': true,'EURUSD=X': true,'^BFX': true}); // default stocks

if(typeof excludedstock == "string") {
	excludedstock = JSON.parse(excludedstock);
	var buf = [];
	for(var domain in excludedstock)
		buf.push(domain);
	for(var i = 0; i < buf.length; i++)
		appendToListBox("excludedstockBox", buf[i]);
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

// Stocks list
function addWhitelistDomain() {
    var domain = document.getElementById("websiteurl").value;
	if (domain.indexOf(',') > -1) {
		var match = domain.split(',')
		for (var a in match)
		{
			var variable = match[a]
			appendToListBox("excludedstockBox", variable);
		}	
	} else {
		appendToListBox("excludedstockBox", domain);
	}
    save_options();
}

function removeSelectedExcludedDomain() {
    var excludedstockBox = document.getElementById("excludedstockBox");
    for (var i = excludedstockBox.length-1; i >= 0; i--) {
        if (excludedstockBox.options[i].selected)
            excludedstockBox.remove(i);
    }
    save_options();
}

function movestockdown() {
	var excludedstockBox = document.getElementById("excludedstockBox");
	var i = excludedstockBox.selectedIndex;
	var txt = excludedstockBox.options[i + 1].text
	var val = excludedstockBox.options[i + 1].value
	excludedstockBox.options[i + 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i + 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i + 1;
    save_options();
}

function movestockup() {
	var excludedstockBox = document.getElementById("excludedstockBox");
	var i = excludedstockBox.selectedIndex;
	var txt = excludedstockBox.options[i - 1].text
	var val = excludedstockBox.options[i - 1].value
	excludedstockBox.options[i - 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i - 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i - 1;	
    save_options();
}

function test(){
if(favoritestock.checked == true){
document.getElementById("favorite").style.display = "";
document.getElementById("stefanvdfinancemarquee").style.marginLeft = "332px";
document.getElementById("arrowleft").style.marginLeft = "315px";
var textf1 = document.getElementById('favo1').value;$('samplefavo1').innerText = textf1;document.getElementById('samplefavo1img').src = "http://ichart.finance.yahoo.com/h?s=" + textf1+ "";
var textf2 = document.getElementById('favo2').value;$('samplefavo2').innerText = textf2;document.getElementById('samplefavo2img').src = "http://ichart.finance.yahoo.com/h?s=" + textf2+ "";
var textf3 = document.getElementById('favo3').value;$('samplefavo3').innerText = textf3;document.getElementById('samplefavo3img').src = "http://ichart.finance.yahoo.com/h?s=" + textf3+ "";
var textf4 = document.getElementById('favo4').value;$('samplefavo4').innerText = textf4;document.getElementById('samplefavo4img').src = "http://ichart.finance.yahoo.com/h?s=" + textf4+ "";
} else {
document.getElementById("favorite").style.display = "none";
document.getElementById("stefanvdfinancemarquee").style.marginLeft = "100px";
document.getElementById("arrowleft").style.marginLeft = "83px";
}
document.getElementById("stefanvdfinancemarquee").style.marginRight = "25px";

$('examplebar').style.background = $('lightcolor').value;

var etempl = $("direction");var currentdirection = etempl.options[etempl.selectedIndex].value;
var posbegin = "+100%";
var posend = "-100%";
if(currentdirection == "left"){
posbegin = "+100%";
posend = "-100%";
}else{
posbegin = "-100%";
posend = "+100%";
}
var timecredit = $("scrollamount").value;

var em = $("marqueebehaviour");var currentbehaviour = em.options[em.selectedIndex].value;
var beginbeh = "normal";
if(currentbehaviour == "scroll"){beginbeh = "normal"}
else{beginbeh = "alternate"}

var fncss = '#examplebar #stefanvdfinancemarquee .moveeffect{animation:marquee '+timecredit+'s linear infinite '+beginbeh+'} #stefanvdfinancemarquee div a{color: '+$('textcolor').value+'!important} #stefanvdfinancemarquee .green a{color:'+$('greencolor').value+'!important} #stefanvdfinancemarquee .red a{color:'+$('redcolor').value+'!important}@keyframes marquee{0%{transform:translateX('+posbegin+')}100%{transform:translateX('+posend+')}}';
if($("fnstyle")){
$("fnstyle").innerText = fncss;
}else{
var style = document.createElement('style');
style.type = 'text/css';
style.setAttribute('id','fnstyle');
style.innerText = fncss;
document.body.appendChild(style);
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
var sharetext = "I highly recommended Finance Toolbar. Download and try it yourself! www.stefanvd.net";
var stefanvdurl = financetoolbarproduct;var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
$("rememberboxrate").addEventListener("click", function() {window.open(writereview);});
$("rememberboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("rememberboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("rememberboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + " @ambientaurea", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});

$("shareboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + " @ambientaurea", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});
	
// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}
var select = document.querySelectorAll('select');
for (var i = 0; i < select.length; i++) {select[i].addEventListener('change', test);select[i].addEventListener('change', save_options);}

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

// left
var goleft = document.getElementById("arrowleft")
goleft.addEventListener("mousedown", function() {
});

goleft.addEventListener("mouseup", function() {
});

// right
var goright = document.getElementById("arrowright")
goright.addEventListener("mousedown", function() {
});

goright.addEventListener("mouseup", function() {
});

// Add stock
$("addbutton").addEventListener('click', function() {addWhitelistDomain();});

// Remove stock
$("removebutton").addEventListener('click', function() {removeSelectedExcludedDomain();});

// Move up
$("moveupbutton").addEventListener('click', function() {movestockup();});

// Move down
$("movedownbutton").addEventListener('click', function() {movestockdown();});

// Download Upgrade
$("aadownload").addEventListener('click', function() {window.open(ambientaureaproduct);});
$("ppdownload").addEventListener('click', function() {window.open(propermenubarproduct);});
$("dtdownload").addEventListener('click', function() {window.open(datetodayproduct)});
$("totldownload").addEventListener('click', function() {window.open(turnoffthelightsproduct)});
$("fsdownload").addEventListener('click', function() {window.open(fullscreenproduct)});
$("zdownload").addEventListener('click', function() {window.open(zoomproduct)});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YpNSpneMPXqqghriKws079";$('welcomeguide').src = "";});
$("tabdesign").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

// Reset settings
$("resetfinancetoolbar").addEventListener('click', function() {chrome.storage.sync.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview, "_blank");$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});

// Finance Toolbar app box
$("apgetapp").addEventListener('click', function() {window.open(financetoolbarapp, "_blank");$("sectionfinancetoolbarappbox").style.display = "none";chrome.storage.sync.set({"applastonversion": chrome.runtime.getManifest().version});});
$("apnt").addEventListener('click', function() {$("sectionfinancetoolbarappbox").style.display = "none";chrome.storage.sync.set({"applastonversion": chrome.runtime.getManifest().version});});

// retina check
if(window.devicePixelRatio >= 2) {
$("loadinglamp").src = "icons/icon16@2x.png";$("loadinglamp").style.width = "16px"; $("loadinglamp").style.height = "16px";
$("welcomelamp").src = "icons/icon16@2x.png";$("welcomelamp").style.width = "16px"; $("welcomelamp").style.height = "16px";
$("rememberlamp").src = "icons/icon16@2x.png";$("rememberlamp").style.width = "16px"; $("rememberlamp").style.height = "16px";
$("financetoolbaricon").src = "images/finance-toolbar_32x32@2x.png";
}

});