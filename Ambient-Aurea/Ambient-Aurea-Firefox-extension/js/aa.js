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
// settings
var default_opacity = null, interval = null, fadein = null, fadeout = null, lightcolor = null, ambilight = null, ambilightrangeblurradius = null, ambilightrangespreadradius = null, ambilightfixcolor = null, ambilight4color = null, ambilightvarcolor = null, ambilightcolorhex = null, ambilight1colorhex = null, ambilight2colorhex = null, ambilight3colorhex = null, ambilight4colorhex = null, sharebar = null, count = null, slideshow = null, slideshowrefresh = null, atmosvivid = null;

chrome.storage.sync.get(['getimgurl','interval', 'fadein', 'fadeout', 'lightcolor', 'ambilight', 'ambilightrangeblurradius', 'ambilightrangespreadradius', 'ambilightfixcolor', 'ambilightvarcolor', 'ambilightcolorhex', 'ambilight4color', 'ambilight1colorhex', 'ambilight2colorhex', 'ambilight3colorhex', 'ambilight4colorhex', 'sharebar', 'atmosvivid'], function(response){
getimgurl = response['getimgurl'];
var last_target = getimgurl;

interval = response['interval'];if(interval == null)interval = 80; default_opacity = interval; // default interval 80%
fadein = response['fadein'];if(fadein == null)fadein = true;
fadeout = response['fadeout'];if(fadeout == null)fadeout = true;
lightcolor = response['lightcolor'];if(lightcolor == null)lightcolor = '#000000';
ambilight = response['ambilight'];if(ambilight == null)ambilight = true;
ambilightrangeblurradius = response['ambilightrangeblurradius'];if(ambilightrangeblurradius == null)ambilightrangeblurradius = 25;
ambilightrangespreadradius = response['ambilightrangespreadradius'];if(ambilightrangespreadradius == null)ambilightrangespreadradius = 15;
ambilightfixcolor = response['ambilightfixcolor'];if(ambilightfixcolor == null)ambilightfixcolor = false;
ambilight4color = response['ambilight4color'];if(ambilight4color == null)ambilight4color = false;
ambilightvarcolor = response['ambilightvarcolor'];if(ambilightvarcolor == null)ambilightvarcolor = true;
ambilightcolorhex = response['ambilightcolorhex'];if(ambilightcolorhex == null)ambilightcolorhex = '#CCCCCC';
ambilight1colorhex = response['ambilight1colorhex'];if(ambilight1colorhex == null)ambilight1colorhex = '#FF0000';
ambilight2colorhex = response['ambilight2colorhex'];if(ambilight2colorhexv == null)ambilight2colorhex = '#FFEE00';
ambilight3colorhex = response['ambilight3colorhex'];if(ambilight3colorhex == null)ambilight3colorhex = '#00FF00';
ambilight4colorhex = response['!ambilight4colorhex'];if(ambilight4colorhex == null)ambilight4colorhex = '#0000FF';
sharebar = response['sharebar'];if(sharebar == null)sharebar = true;
atmosvivid = response['atmosvivid'];if(atmosvivid == null)atmosvivid = true;

// detect if not higher then z-index 1000, then make it push down
// search for the z-index, if found something give it 'auto'
var q = document.getElementsByTagName('*');
for(var i = 0; i < q.length; i++ ) {
if (q[i].currentStyle){var y = q[i].currentStyle["z-Index"];}
else if (window.getComputedStyle){var y = document.defaultView.getComputedStyle(q[i],null).getPropertyValue("z-Index");}
if (y >= 250000){q[i].style.zIndex = 'auto';}
}

//---- cleanup service
function cleanup() {
var stefanvdaapaneltopl = $('stefanvdaapaneltopl');
if(stefanvdaapaneltopl) {document.body.removeChild(stefanvdaapaneltopl);}
var stefanvdaapaneltopr = $('stefanvdaapaneltopr');
if(stefanvdaapaneltopr) {document.body.removeChild(stefanvdaapaneltopr);}
var stefanvdaapaneltop = $('stefanvdaapaneltop');
if(stefanvdaapaneltop) {document.body.removeChild(stefanvdaapaneltop);}
var stefanvdaashare = $('stefanvdaashare');
if(stefanvdaashare) {document.body.removeChild(stefanvdaashare);}
var stefanvdaasharepanel = $('stefanvdaasharepanel');
if(stefanvdaasharepanel) {document.body.removeChild(stefanvdaasharepanel);}
var stefanvdaagallery = $('stefanvdaagallery');
if(stefanvdaagallery) {document.body.removeChild(stefanvdaagallery);}
var stefanvdaagallerybuttonleft = $('stefanvdaagallerybuttonleft');
if(stefanvdaagallerybuttonleft) {document.body.removeChild(stefanvdaagallerybuttonleft);}
var stefanvdaagallerybuttonright = $('stefanvdaagallerybuttonright');
if(stefanvdaagallerybuttonright) {document.body.removeChild(stefanvdaagallerybuttonright);}
var stefanvdaagallerycounter = $('stefanvdaagallerycounter');
if(stefanvdaagallerycounter) {document.body.removeChild(stefanvdaagallerycounter);}
var stefanvdaaslideshow = $('stefanvdaaslideshow');
if(stefanvdaaslideshow) {document.body.removeChild(stefanvdaaslideshow);window.clearTimeout(countss);}
var aaCanvas1 = $('aaCanvas1');
if(aaCanvas1) {document.body.removeChild(aaCanvas1);}

j = 0;
}

// calc screen size
var screenwidth = document.documentElement.clientWidth;var screenheight = document.documentElement.clientHeight;

var blackon = $('stefanvdaalightareoff1');
if(blackon) {
// fade out effect
if(fadeout == true){fader('hide');cleanup();}
else{document.body.removeChild(blackon);cleanup();}
} else{

var getdomimage = last_target;

var newdiv = document.createElement('div'); 
newdiv.setAttribute('id','stefanvdaalightareoff1');
newdiv.setAttribute('class','stefanvdaalightareoff');
newdiv.style.width = '100%';
newdiv.style.height = '100%'; 
newdiv.style.left = 0; 
newdiv.style.top = 0; 
newdiv.style.position = 'fixed';
newdiv.style.background = lightcolor;
newdiv.style.opacity = 1;
newdiv.style.zIndex = 999;
document.body.appendChild(newdiv);

// fade out effect
if(fadeout == true){newdiv.addEventListener("click", function() {fader('hide');cleanup();})}
else{newdiv.addEventListener("click", function() {document.body.removeChild(newdiv);cleanup();})}

// fade in effect
if(fadein == true){fader('show');}
else{newdiv.style.opacity = default_opacity/100} // no fade effect	

var newsharediv = document.createElement('div');
newsharediv.setAttribute('id','stefanvdaashare');
newsharediv.style.left = '10px'; 
newsharediv.style.top = '10px'; 
newsharediv.style.position = 'fixed';
newsharediv.style.zIndex = 1000;
document.body.appendChild(newsharediv);

var newaagallery = document.createElement('div');
newaagallery.setAttribute('id','stefanvdaagallery');
document.body.appendChild(newaagallery);

var newaaimage = document.createElement('img');
newaaimage.setAttribute('id','stefanvdaagalleryimage1');
newaaimage.onload = function(e) {
var width = newaaimage.clientWidth;
var height = newaaimage.clientHeight;
if(width > screenwidth){ // autozoom
var c1 = width - screenwidth;
var c3 = screenwidth - c1;
newaaimage.width = c3-50;
}
else if(height > screenheight){
var c2 = height - screenheight;
var c4 = screenheight - c2;
newaaimage.height = c4-50;
}
else if((height >= screenheight) && (width >= screenwidth)){newaaimage.height = screenheight/1.5;}
else if((height == screenheight-1)){newaaimage.height = screenheight/1.5;}
else{}
// position center
var sourceImageWidth = $("stefanvdaagalleryimage1").clientWidth;
var sourceImageHeight = $("stefanvdaagalleryimage1").clientHeight;
newaagallery.style.left = (screenwidth/2) - (sourceImageWidth/2) + "px";
newaagallery.style.top = (screenheight/2) - (sourceImageHeight/2) + "px";
refreshambilight();
};
newaaimage.src = getdomimage;
newaagallery.appendChild(newaaimage);

function refreshambilight(){
	var totlshowtime = $("stefanvdaagalleryimage1");
	var getblur = ambilightrangeblurradius + "px";
	var getspread = ambilightrangespreadradius + "px";


if(ambilightvarcolor == true){
if(atmosvivid == true){
			var calcvividscale = 1+(ambilightrangespreadradius/100);
			var calcblur = ambilightrangeblurradius;
			if($("stefanvdaavivideffect")){} else{
			var stefanvdaavivideffect = document.createElement("canvas");
			stefanvdaavivideffect.setAttribute('id','stefanvdaavivideffect');
			$("stefanvdaagallery").appendChild(stefanvdaavivideffect);
			}
			
			if($("stefanvdaavivideffect")){
				var stefanvdaavivideffect = $('stefanvdaavivideffect');
				stefanvdaavivideffect.style.webkitTransform = "scale("+calcvividscale+")";
				stefanvdaavivideffect.style.webkitFilter = "blur("+calcblur+"px)";
				stefanvdaavivideffect.setAttribute('width',totlshowtime.clientWidth);
				stefanvdaavivideffect.setAttribute('height',totlshowtime.clientHeight);
				stefanvdaavivideffect.style.opacity = .88;
					var vividctx = stefanvdaavivideffect.getContext('2d');
					var imageObj = new Image();
					vividctx.drawImage(totlshowtime, 0, 0,totlshowtime.clientWidth,totlshowtime.clientHeight);
			}
}else{
    var sourceWidth = totlshowtime.width;
    var sourceHeight = totlshowtime.height;
	
	var totlcheckcanvas = $("aaCanvas1");
	if(totlcheckcanvas){} else{
 	var totlnewcanvas = document.createElement("canvas");
	totlnewcanvas.setAttribute('id','aaCanvas1');
	totlnewcanvas.width = "4";
	totlnewcanvas.height = "1";
	totlnewcanvas.style.display = "none";
	document.body.appendChild(totlnewcanvas);
	}
	
	var canvas = $("aaCanvas1");
	var context = canvas.getContext('2d');

	var colorlamp1X = (sourceWidth * 50) /100; // up midden
	var colorlamp1Y = (sourceHeight * 95) /100;
	var colorlamp2X = (sourceWidth * 95) /100; // right midden
	var colorlamp2Y = (sourceHeight * 50) /100;
	var colorlamp3X = (sourceWidth * 50) /100; // down midden
	var colorlamp3Y = (sourceHeight * 5) /100;
	var colorlamp4X = (sourceWidth * 5) /100; // left midden
	var colorlamp4Y = (sourceHeight * 50) /100;

	context.drawImage(totlshowtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);
	
try{
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

	totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
}catch(e) {
	totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 0px 20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + ", -20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + "";
}
}
}
else if (ambilightfixcolor == true){
	totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 0px 20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + ", -20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + "";
} else if(ambilight4color == true){
	var hex1 = ambilight1colorhex;
	var hex2 = ambilight2colorhex;
	var hex3 = ambilight3colorhex;
	var hex4 = ambilight4colorhex;
	totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
}
}

// ambilight time
if(ambilight == true){ // yes show time
refreshambilight();
}

// sharebar
if(sharebar == true){
var currenturl = window.location.href;var currentencodeurl = encodeURIComponent(currenturl);
var stefanvdurl = "https://chrome.google.com/webstore/detail/pkaglmndhfgdaiaccjglghcbnfinfffa";var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);

var newdivshare = document.createElement('div');
newdivshare.setAttribute('id','stefanvdaasharepanel');
document.body.appendChild(newdivshare);

var sharegp = document.createElement('img');
sharegp.setAttribute('id','stefanvdgoogleplusshare');
if(window.devicePixelRatio >= 2){sharegp.src = chrome.extension.getURL('/images/sharegoogleplus@2x.png');}else{sharegp.src = chrome.extension.getURL('/images/sharegoogleplus.png');}
sharegp.addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + currentencodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
newdivshare.appendChild(sharegp);

var sharefb = document.createElement('img');
sharefb.setAttribute('id','stefanvdfacebookshare');
if(window.devicePixelRatio >= 2){sharefb.src = chrome.extension.getURL('/images/sharefacebook@2x.png');}else{sharefb.src = chrome.extension.getURL('/images/sharefacebook.png');}
sharefb.addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ currenturl + "&t=Try this out, I am focus the image with Ambient Aurea browser extension!", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
newdivshare.appendChild(sharefb);

var sharetw = document.createElement('img');
sharetw.setAttribute('id','stefanvdtwittershare');
if(window.devicePixelRatio >= 2){sharetw.src = chrome.extension.getURL('/images/sharetwitter@2x.png');}else{sharetw.src = chrome.extension.getURL('/images/sharetwitter.png');}
sharetw.addEventListener("click", function() {window.open("https://twitter.com/share?url=" + currentencodeurl + "&text=Try this out, I am focus the image with Ambient Aurea browser extension! @ambientaurea", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});
newdivshare.appendChild(sharetw);
}

}


});

///////////
// animation browser engine
(function() {
var foundRequestAnimationFrame = window.requestAnimationFrame 		||
                               	 window.webkitRequestAnimationFrame ||
								 window.msRequestAnimationFrame 	||
                               	 window.mozRequestAnimationFrame    ||
							 	 window.oRequestAnimationFrame  	||
                                 function(callback) { window.setTimeout(callback,1000/60); };
window.requestAnimFrame = foundRequestAnimationFrame;
}());

// Fade engine
//  Variable for the fade in and out effect
var opacity = 0;

var ReducingFinished = true;
var OpacityLevelIncrement = 10;   //  Percentage value: 1-100

//  Function determines whether we show or hide the item referenced by ElementID
function fader(ActionToTake)
{
  DIVElementById = $('stefanvdaalightareoff1');
  if (ActionToTake == 'hide')
  { opacity = default_opacity; reduceOpacity(); }
  else if (ActionToTake == 'show')
  { increaseOpacity(); }
}

//  Makes div increase
function increaseOpacity()
{
try {
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
//control opacity for all <div>
var div = document.querySelectorAll('div.stefanvdaalightareoff');
for(var i = 0; i < div.length; i++ ){div[i].style.opacity = opacity/100;}
} catch(e){}
}

//  Makes div reduce
function reduceOpacity() 
{
try {
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
    {document.body.removeChild(DIVElementById);}
  }
//control opacity for all <div>
var div = document.querySelectorAll('div.stefanvdaalightareoff');
for(var i = 0; i < div.length; i++ ){div[i].style.opacity = opacity/100;}
} catch(e){}
}