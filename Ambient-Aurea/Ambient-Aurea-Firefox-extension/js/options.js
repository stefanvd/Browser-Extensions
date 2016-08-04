//================================================
/*

Ambient Aurea
Bring your image to an ambient lighting effect with just one click on the button.
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
var default_opacity = 80;
var default_arangeblur = 25;
var default_arangespread = 15;

// Option to save current value
function save_options(){
  chrome.storage.local.set({ "interval": $('interval').value, "lightcolor": $('lightcolor').value, "contextmenus": $('contextmenus').checked, "ambilight": $('ambilight').checked, "ambilightrangeblurradius": $('ambilightrangeblurradius').value, "ambilightrangespreadradius": $('ambilightrangespreadradius').value, "ambilightfixcolor": $('ambilightfixcolor').checked, "ambilightvarcolor": $('ambilightvarcolor').checked, "ambilightcolorhex": $('ambilightcolorhex').value, "ambilight4color": $('ambilight4color').checked, "ambilight1colorhex": $('ambilight1colorhex').value, "ambilight2colorhex": $('ambilight2colorhex').value, "ambilight3colorhex": $('ambilight3colorhex').value, "ambilight4colorhex": $('ambilight4colorhex').value, "fadein": $('fadein').checked, "fadeout": $('fadeout').checked, "sharebar": $('sharebar').checked, "count": $('count').checked, "slideshow": $('slideshow').checked, "slideshowrefresh": $('slideshowrefresh').value, "optionskipremember": $('optionskipremember').checked, "atmosvivid": $('atmosvivid').checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.local.get(['fadein','fadeout','contextmenus','ambilight','sharebar','count','atmosvivid','ambilightvarcolor','ambilightfixcolor','ambilight4color'], function(items){
    // find no localstore zoomengine
	  if(items['fadein'] == null && items['fadeout'] == null){firstdefaultvalues['fadein'] = true;firstdefaultvalues['fadeout'] = true;}
	  if(items['contextmenus'] == null){firstdefaultvalues['contextmenus'] = true;}
	  if(items['ambilight'] == null){firstdefaultvalues['ambilight'] = true;}
	  if(items['sharebar'] == null){firstdefaultvalues['sharebar'] = true;}
	  if(items['count'] == null){firstdefaultvalues['count'] = true;}
	  if(items['atmosvivid'] == null){firstdefaultvalues['atmosvivid'] = true;}
	  if(items['ambilightvarcolor'] == null && items['ambilightfixcolor'] == null && items['ambilight4color'] == null){firstdefaultvalues['ambilightvarcolor'] = true;firstdefaultvalues['ambilightfixcolor'] = false;firstdefaultvalues['ambilight4color'] = false;}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.local.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
chrome.storage.local.get(['interval', 'lightcolor', 'contextmenus', 'ambilight', 'ambilightrangeblurradius', 'ambilightrangespreadradius', 'ambilightfixcolor', 'ambilightvarcolor', 'ambilightcolorhex', 'ambilight4color', 'ambilight1colorhex', 'ambilight2colorhex', 'ambilight3colorhex', 'ambilight4colorhex', 'fadein', 'fadeout', 'sharebar', 'count', 'slideshow', 'slideshowrefresh', 'countremember' , 'applastonversion', 'reviewedlastonversion', 'optionskipremember', 'atmosvivid'], function(items){
		if(items['interval']){default_opacity=items['interval'];$('interval').value = items['interval'];$('slider').value = items['interval'];}
		else {$('interval').value = 80;$('slider').value = 80;}
		if(items['lightcolor']){$('lightcolor').value = items['lightcolor'];}
		else {$('lightcolor').value = '#000000';}
		if(items['contextmenus'] == true)$('contextmenus').checked = true;
		if(items['ambilight'] == true)$('ambilight').checked = true;
		if(items['ambilightrangeblurradius']){default_arangeblur=items['ambilightrangeblurradius'];$('ambilightrangeblurradius').value = items['ambilightrangeblurradius'];$('arangeblur').value = items['ambilightrangeblurradius'];}
		else{$('ambilightrangeblurradius').value = 25;}
		if(items['ambilightrangespreadradius']){default_arangespread=items['ambilightrangespreadradius'];$('ambilightrangespreadradius').value = items['ambilightrangespreadradius'];$('arangespread').value = items['ambilightrangespreadradius'];}
		else{$('ambilightrangespreadradius').value = 15;}
		if(items['ambilightfixcolor'] == true)$('ambilightfixcolor').checked = true;
		if(items['ambilightvarcolor'] == true)$('ambilightvarcolor').checked = true;
		if(items['ambilightcolorhex'])$('ambilightcolorhex').value = items['ambilightcolorhex'];
		else $('ambilightcolorhex').value = '#47C2FF';
		if(items['ambilight4color'] == true)$('ambilight4color').checked = true;
		if(items['ambilight1colorhex'])$('ambilight1colorhex').value = items['ambilight1colorhex'];
		else $('ambilight1colorhex').value = '#FF0000';
		if(items['ambilight2colorhex'])$('ambilight2colorhex').value = items['ambilight2colorhex'];
		else $('ambilight2colorhex').value = '#FFEE00';
		if(items['ambilight3colorhex'])$('ambilight3colorhex').value = items['ambilight3colorhex'];
		else $('ambilight3colorhex').value = '#00FF00';
		if(items['ambilight4colorhex'])$('ambilight4colorhex').value = items['ambilight4colorhex'];
		else $('ambilight4colorhex').value = '#0000FF';
		if(items['fadein'] == true)$('fadein').checked = true;
		if(items['fadeout'] == true)$('fadeout').checked = true;
		if(items['sharebar'] == true)$('sharebar').checked = true;
		if(items['count'] == true)$('count').checked = true;
		if(items['slideshow'] == true)$('slideshow').checked = true;
		if(items['slideshowrefresh'])$('slideshowrefresh').value = items['slideshowrefresh'];
		else $('slideshowrefresh').value = 20;
		if(items['optionskipremember'] == true){$('optionskipremember').checked = true;$('firstcheckboxskipremember').checked = true;}
		if(items['atmosvivid'] == true)$('atmosvivid').checked = true;
		if(items['reviewedlastonversion'] == chrome.runtime.getManifest().version){$("sectionreviewbox").style.display = "none";}
		if(items['applastonversion'] == chrome.runtime.getManifest().version){$("sectionauroraplayerappbox").style.display = "none";}
		
// show remember page
var countremember = items['countremember'];
if(!countremember){countremember = 0;}
countremember = parseInt(countremember) + 1;
if($('optionskipremember').checked != true){
	if(countremember >= 5) {$('remembershare').style.display = "";countremember = 0;}
	else {$('remembershare').style.display = "none";}
} else {$('remembershare').style.display = "none";}
chrome.storage.local.set({"countremember": countremember});		
		
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

	// enable paint job
	test();
	
// default example2 is not display
example2.style.opacity = 0;example2.style.display = 'none';
	});// chrome storage end
} // end read

// animation browser engine
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

// ambilight draw code
function drawImage(){
	// clean canvas
	var clearcanvas = $("stefanvdvivideffect");
	var clearcontext = clearcanvas.getContext("2d");
	clearcontext.clearRect(0,0,clearcanvas.width,clearcanvas.height);

	if(ambilight.checked == true){
    var showtime = $("beeld");
	var getblur = $('ambilightrangeblurradius').value + "px";
	var getspread = $('ambilightrangespreadradius').value + "px";
	var k = 1;
	
	if(ambilightvarcolor.checked == true){
		if(atmosvivid.checked == true){
		showtime.style.webkitBoxShadow = "";
			var calcvividscale = 1+($('ambilightrangespreadradius').value/100);
			var calcblur = $('ambilightrangeblurradius').value;
				if($("stefanvdvivideffect")){
				var stefanvdvivideffect = $('stefanvdvivideffect');
				stefanvdvivideffect.style.webkitTransform = "scale("+calcvividscale+")";
				stefanvdvivideffect.style.webkitFilter = "blur("+calcblur+"px)";
				stefanvdvivideffect.style.opacity = .88;
					var vividctx = stefanvdvivideffect.getContext('2d');
					var imageObj = new Image();
					imageObj.onload = function() {
						vividctx.drawImage(imageObj, 0, 0,640,280);
					};
					imageObj.src = showtime.src;
				}
		}
		else{
    var sourceWidth = showtime.width;
    var sourceHeight = showtime.height;
    
var totlcheckcanvas = $("totlCanvas1");
if(totlcheckcanvas){}else{
 	var totlnewcanvas = document.createElement("canvas");
	totlnewcanvas.setAttribute('id','totlCanvas1');
	totlnewcanvas.width = "4";
	totlnewcanvas.height = "1";
	totlnewcanvas.style.display = "none";
	document.body.appendChild(totlnewcanvas);
	}

var canvas = $("totlCanvas1");
var context = canvas.getContext("2d");
var colorlamp1X = (sourceWidth * 50) /100; // up midden
var colorlamp1Y = (sourceHeight * 95) /100;
var colorlamp2X = (sourceWidth * 95) /100; // right midden
var colorlamp2Y = (sourceHeight * 50) /100;
var colorlamp3X = (sourceWidth * 50) /100; // down midden
var colorlamp3Y = (sourceHeight * 5) /100;
var colorlamp4X = (sourceWidth * 5) /100; // left midden
var colorlamp4Y = (sourceHeight * 50) /100;
	
	context.drawImage(showtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
	context.drawImage(showtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
	context.drawImage(showtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
	context.drawImage(showtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);
	
    var imageData = context.getImageData(0, 0, 1, 1);
    var data = imageData.data;

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

    var p1 = context.getImageData(0 , 0, 1, 1).data; 
    var p2 = context.getImageData(1 , 0, 1, 1).data; 
    var p3 = context.getImageData(2 , 0, 1, 1).data; 
    var p4 = context.getImageData(3 , 0, 1, 1).data; 
    var hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
    var hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
    var hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
    var hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);

	showtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
		}
	} else if(ambilightfixcolor.checked == true){
	var fixhex = $("ambilightcolorhex").value;
	if(fixhex)fixhex = fixhex;else fixhex = '#ccc';
	showtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex + "";
	} else if(ambilight4color.checked == true){
	var fix1hex = $("ambilight1colorhex").value;
	var fix2hex = $("ambilight2colorhex").value;
	var fix3hex = $("ambilight3colorhex").value;
	var fix4hex = $("ambilight4colorhex").value;
	if(fix1hex)fix1hex = fix1hex;else fix1hex = '#FF0000';
	if(fix2hex)fix2hex = fix2hex;else fix2hex = '#FFEE00';
	if(fix3hex)fix3hex = fix3hex;else fix3hex = '#00FF00';
	if(fix4hex)fix4hex = fix4hex;else fix4hex = '#0000FF';
	showtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fix1hex + ", 0px 20px " + getblur + " " + getspread + " " + fix2hex + ", 20px 0px " + getblur + " " + getspread + " " + fix3hex + ", -20px 0px " + getblur + " " + getspread + " " + fix4hex + "";
	}
	
}else{showtime.style.webkitBoxShadow = "";}
}

// Fade engine
//  Variable for the fade in and out effect
var opacity = 0;

var ReducingFinished = true;
var OpacityLevelIncrement = 10;   //  Percentage value: 1-100

//  Function determines whether we show or hide the item referenced by ElementID
function fader(ActionToTake)
{
  DIVElementById = $('example2');
  if (ActionToTake == 'hide')
  { opacity = default_opacity; reduceOpacity(); }
  else if (ActionToTake == 'show')
  { increaseOpacity(); }
}

//  Makes div increase
function increaseOpacity()
{
DIVElementById.style.display = '';
  //  If opacity level is less than default_opacity, we can still increase the opacity
  if ((opacity < default_opacity) && (ReducingFinished == true))
  {
	if ((opacity > (default_opacity-10)) && (ReducingFinished == true)){
    ReducingFinished = true;
    opacity  += (default_opacity - opacity);
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(increaseOpacity);
	}
	else {
    ReducingFinished = true;
    opacity  += OpacityLevelIncrement;
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(increaseOpacity);
	}
  }
  else
  {
    ReducingFinished = false;
  }
}

//  Makes div reduce
function reduceOpacity() 
{
  //  If opacity level is greater than 0, we can still reduce the opacity
  if ((opacity > 0) && (ReducingFinished == false))
  {
    ReducingFinished = false;
    opacity  -= OpacityLevelIncrement;
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(reduceOpacity);
  }
  else
  {
    ReducingFinished = true;

    //  When finished, make sure the DIVElementById is set to remove element
    if (DIVElementById.style.opacity = '0')
    {DIVElementById.style.display = 'none';}
  }
}

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

// fade effects control -> not when loaded page
function lightscontrol() {
var jump = $('interval').value;
default_opacity = jump;
if(onoffrange.value == 0)
{
if(fadeout.checked == true){ReducingFinished = false;fader('hide');}else{example2.style.opacity = 0;example2.style.display = 'none';}
}
else{
if(fadein.checked == true){ReducingFinished = true;fader('show');}else{example2.style.opacity = jump/100;example2.style.display = '';}
}
}

function test() {
drawImage();

if(ambilight.checked == true)
{$('arangespread').disabled = false;$('ambilightrangespreadradius').disabled = false;$('arangeblur').disabled = false;$('ambilightrangeblurradius').disabled = false;$('ambilightfixcolor').disabled = false;$('ambilightvarcolor').disabled = false;$('ambilightcolorhex').disabled = false;$('ambilight4color').disabled = false;$('ambilight1colorhex').disabled = false;$('ambilight2colorhex').disabled = false;$('ambilight3colorhex').disabled = false;$('ambilight4colorhex').disabled = false;$('atmosvivid').disabled = false;}
else {$('arangespread').disabled = true;$('ambilightrangespreadradius').disabled = true;$('arangeblur').disabled = true;$('ambilightrangeblurradius').disabled = true;$('ambilightfixcolor').disabled = true;$('ambilightvarcolor').disabled = true;$('ambilightcolorhex').disabled = true;$('ambilight4color').disabled = true;$('ambilight1colorhex').disabled = true;$('ambilight2colorhex').disabled = true;$('ambilight3colorhex').disabled = true;$('ambilight4colorhex').disabled = true;$('atmosvivid').disabled = true;}

example2.style.backgroundColor =  $('lightcolor').value;
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
var sharetext = "I highly recommended Ambient Aurea. Download and try it yourself! www.stefanvd.net";
var stefanvdurl = ambientaureaproduct;var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
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

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

// Slider
$("slider").addEventListener('change', function() {showValue(this.value);save_options();});

// Detect lightcolor change
$("lightcolor").addEventListener('change', function() {$('example2').style.background = this.value;save_options();});

// Interval
$("interval").addEventListener('change', function() {showValue(this.value);save_options();});

// Light switch
$("onoffrange").addEventListener('change', function() {lightscontrol();});

// Arangeblur
$("arangeblur").addEventListener('change', function() {showambilightblurValue(this.value);save_options();});
$("ambilightrangeblurradius").addEventListener('change', function() {showambilightblurValue(this.value);save_options();});

// Arangespread
$("arangespread").addEventListener('change', function() {showambilightspreadValue(this.value);save_options();});
$("ambilightrangespreadradius").addEventListener('change', function() {showambilightspreadValue(this.value);save_options();});

// Download Upgrade
$("fndownload").addEventListener('click', function() {window.open(financetoolbarproduct);});
$("ppdownload").addEventListener('click', function() {window.open(propermenubarproduct);});
$("dtdownload").addEventListener('click', function() {window.open(datetodayproduct)});
$("totldownload").addEventListener('click', function() {window.open(turnoffthelightsproduct)});
$("fsdownload").addEventListener('click', function() {window.open(fullscreenproduct)});
$("zdownload").addEventListener('click', function() {window.open(zoomproduct)});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YxE1nyEgbOwphiK8C0JX9f";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabvisual").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport)});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog)});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate)});

// Reset settings
$("resetambientaurea").addEventListener('click', function() {chrome.storage.local.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview, "_blank");$("sectionreviewbox").style.display = "none";chrome.storage.local.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.local.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});

// Aurora Player app box
$("apgetapp").addEventListener('click', function() {window.open(ambientaureaapp, "_blank");$("sectionauroraplayerappbox").style.display = "none";chrome.storage.local.set({"applastonversion": chrome.runtime.getManifest().version});});
$("apnt").addEventListener('click', function() {$("sectionauroraplayerappbox").style.display = "none";chrome.storage.local.set({"applastonversion": chrome.runtime.getManifest().version});});

// retina check
if(window.devicePixelRatio >= 2) {
$("loadinglamp").src = "icons/icon16@2x.png";$("loadinglamp").style.width = "16px"; $("loadinglamp").style.height = "16px";
$("welcomelamp").src = "icons/icon16@2x.png";$("welcomelamp").style.width = "16px"; $("welcomelamp").style.height = "16px";
$("rememberlamp").src = "icons/icon16@2x.png";$("rememberlamp").style.width = "16px"; $("rememberlamp").style.height = "16px";
$("ambientaureaicon").src = "images/ambient-aurea_32x32@2x.png";
}

});