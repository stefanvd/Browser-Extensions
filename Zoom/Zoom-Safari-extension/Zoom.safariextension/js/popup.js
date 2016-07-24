//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
Copyright (C) 2015 Stefan vd
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

(function() {
if (window.top === window) {
function $(id) { return document.getElementById(id); }
var currentRatio = 1; var ratio = 1; var job = null;
var allzoom; var allzoomvalue;

const myGlobal = safari.extension.globalPage.contentWindow;
 
function zoom(ratio){
currentRatio = ratio / 100;
var tab = "";
zoomtab(tab,ratio/100);
}

function zoomtab(tab,ratio){
document.getElementById("number").value=Math.round(ratio*100);
document.getElementById("range").value=Math.round(ratio*100);
job = safari.application.activeBrowserWindow.activeTab.url;
var webjob = job.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
var tempset = ratio;myGlobal.setZoom(webjob,tempset);
var tempvote = ratio;myGlobal.votezoom(tempvote); //run this
// save for all zoom feature
var tempsave = ratio;myGlobal.saveallZoom(tempsave);
}

function zoomview(direction){zoom(nextratio(currentRatio*100,direction));}

function nextratio(ratio,direction){
ratio = parseInt(ratio);
switch(ratio){
	case 50: return (direction==-1)?100:60;
    case 60: return (direction==-1)?50:70;
    case 70: return (direction==-1)?60:80;
    case 80: return (direction==-1)?70:90;
    case 90: return (direction==-1)?80:100;
	case 100: return (direction==-1)?90:110;
    case 110: return (direction==-1)?100:120;
    case 120: return (direction==-1)?110:130;
    case 130: return (direction==-1)?120:140;
    case 140: return (direction==-1)?130:150;
	case 150: return (direction==-1)?140:160;
	case 160: return (direction==-1)?150:170;
    case 170: return (direction==-1)?160:180;
    case 180: return (direction==-1)?170:190;
    case 190: return (direction==-1)?180:200;
    case 200: return (direction==-1)?190:400;
	case 400: return (direction==-1)?200:100;
	default: return 100; //more than 400% or less 50% go back to 100%
			}
}

var tempcurrentpopupzoom = "";
function handle(delta) {
	tempcurrentpopupzoom = document.getElementById("number").value;
    if(delta < 0){ tempcurrentpopupzoom -= Number(1);
		if(tempcurrentpopupzoom != 0 && tempcurrentpopupzoom >= 1){ document.getElementById("number").value = tempcurrentpopupzoom; zoom(tempcurrentpopupzoom); }
	}
	else{
		if(tempcurrentpopupzoom != 0 && tempcurrentpopupzoom < 400){ tempcurrentpopupzoom = Number(tempcurrentpopupzoom) + Number(1);document.getElementById("number").value = tempcurrentpopupzoom; zoom(tempcurrentpopupzoom); }
	}
	tempcurrentpopupzoom = ""; // reset
}

function wheel(event){
    var delta = 0;
    if (!event){ event = window.event; }
    if (event.wheelDelta) { delta = event.wheelDelta/120; }
    if (delta){ handle(delta); } // do the UP and DOWN job
    // prevent the mouse default actions using scroll
    if (event.preventDefault){ event.preventDefault(); }
	event.returnValue = false;
}

document.addEventListener('DOMContentLoaded', function () {
// settings
var allzoomvalue = null;
var allzoom = null;
var settings;
                 

// listen for an incoming setSettings message
myGlobal.calcThis(myGlobal.sgetallzoom);
allzoomvalue = myGlobal.sgetallzoomvalue;if(!allzoomvalue)allzoomvalue = '1'; // default allzoom
allzoom = myGlobal.sgetallzoom;if(!allzoom)allzoom = 'false'; // default allzoom

if(window.localStorage.getItem("allzoom") == 'true'){
    document.getElementById("number").value = Math.round(allzoomvalue*100);
    document.getElementById("range").value = Math.round(allzoomvalue*100);
}
else{               
    // default settings
    try{
        job = safari.application.activeBrowserWindow.activeTab.url;
        var webjob = job.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
        if(localStorage.getItem(webjob)){ratio = localStorage.getItem(webjob);}
        currentRatio = ratio;
    }
    catch(e){}
    document.getElementById("number").value = Math.round(ratio*100);
    document.getElementById("range").value = Math.round(ratio*100);
}

function displayinput(newValue) {document.getElementById("number").value=newValue;}
function showValue(newValue){document.getElementById("range").innerHTML=newValue;document.getElementById("number").value=newValue;zoom(newValue);}
$("range").addEventListener('change', function() {showValue(this.value);});
$("number").addEventListener('change', function() {showValue(this.value);});
$("hund").addEventListener('click', function() {zoom(100);displayinput(100);});
$("minus").addEventListener('click', function() {zoomview(-1);});
$("plus").addEventListener('click', function() {zoomview(+1);});

// mouse scroll
document.addEventListener("mousewheel", wheel, false);

});

}
}())