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
var currentRatio = 1; var ratio = 1; var job = null;
var allzoom; var allzoomvalue; var webjob; var websitezoom = {}; var defaultzoom; var badge; var steps; var lightcolor; var zoomchrome; var zoomweb;

function zoom(ratio){
currentRatio = ratio / 100;
chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {zoomtab(tabs[0].id,currentRatio);});
}

function zoomtab(a,b){
    document.getElementById("number").value=Math.round(b*100);
    document.getElementById("range").value=Math.round(b*100);

    if (zoomchrome == true) {
        chrome.tabs.setZoom(a, b);
    }else{
        try{
            chrome.tabs.executeScript(null,{code:"document.body.style.zoom=" + b});
        }
        catch(e){}
    }

    if(badge == true){
       chrome.browserAction.setBadgeBackgroundColor({color:lightcolor}); 
       chrome.browserAction.setBadgeText ( { text: ""+parseInt(b*100)+"" } ); }
    else { chrome.browserAction.setBadgeText({ text: "" }); }

    if(allzoom == true){
        // save for all zoom feature
        chrome.storage.local.set({"allzoomvalue": b});
    }else{
            var atbbuf = [];
            for(var domain in websitezoom){atbbuf.push(domain);atbbuf.sort();}
            for(var i = 0; i < atbbuf.length; i++){
                if (atbbuf[i] == webjob) { //update
                    if (b == 1) {
                        // remove from list
                        delete websitezoom['' + atbbuf[i] + ''];
                        atbbuf = websitezoom;
                    } else {
                        // update ratio
                        websitezoom['' + atbbuf[i] + ''] = parseInt(b * 100);
                    }
                } else {
                    // add to list
                    websitezoom['' + webjob + ''] = parseInt(b * 100);
                }
                
                // save for zoom feature
                chrome.storage.local.set({ "websitezoom": JSON.stringify(websitezoom) });
            }
    }
}

function zoomview(direction){zoom(nextratio(currentRatio*100,direction));}

function nextratio(ratio,direction){
ratio = Math.round(ratio);
var prevratio = parseInt(ratio)-parseInt(steps);
var nextratio = parseInt(ratio)+parseInt(steps);
if(direction==-1){
    if(ratio == 50){prevratio = 100;nextratio = 100;}
}else{
    if(ratio == 400){prevratio = 100;nextratio = 100;}
}
return (direction==-1)?prevratio:nextratio;
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
// default settings
function displayinput(newValue) {document.getElementById("number").value=newValue;}
function showValue(newValue){document.getElementById("range").innerHTML=newValue;document.getElementById("number").value=newValue;zoom(newValue);}
$("range").addEventListener('change', function() {showValue(this.value);});
$("number").addEventListener('change', function() {showValue(this.value);});
$("hund").addEventListener('click', function() {zoom(defaultzoom);displayinput(defaultzoom);});
$("minus").addEventListener('click', function() {zoomview(-1);});
$("plus").addEventListener('click', function() {zoomview(+1);});

// mouse scroll
document.addEventListener("mousewheel", wheel, false);

chrome.storage.local.get(['allzoom','allzoomvalue','websitezoom','defaultzoom','badge','steps','lightcolor','zoomchrome','zoomweb'], function(response){
allzoom = response.allzoom;if(!allzoom)allzoom = false; // default allzoom false
allzoomvalue = response.allzoomvalue;if(!allzoomvalue)allzoomvalue = 1; // default allzoomvalue value
badge = response.badge;if(!badge)badge = false;
lightcolor = response.lightcolor;if(!lightcolor)lightcolor = "#3cb4fe";
steps = response.steps;if(!steps)steps = 10;
zoomchrome = response.zoomchrome;if(!zoomchrome)zoomchrome = false;
zoomweb = response.zoomweb;if(!zoomweb)zoomweb = true;
websitezoom = response.websitezoom;
if (typeof websitezoom == "undefined" || websitezoom == null) {
    websitezoom = JSON.stringify({ 'https://www.stefanvd.net': ["90"], 'https://www.google.com': ["90"], 'http://www.nytimes.com': ["75"] });
}
websitezoom = JSON.parse(websitezoom);
defaultzoom = response.defaultzoom;if(!defaultzoom)defaultzoom = 100; // default zoom value

    chrome.tabs.query({ active: true, currentWindow: true},
    function (tabs) {
        job = tabs[0].url;
        webjob = job.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[0];
        if (zoomchrome == true) {
            chrome.tabs.getZoom(tabs[0].id, function (zoomFactor) {
                ratio = zoomFactor;
                if (ratio == null) { ratio = 1 }
                currentRatio = ratio;
                document.getElementById("number").value = Math.round(ratio * 100);
                document.getElementById("range").value = Math.round(ratio * 100);
            });
        } else {
            chrome.tabs.sendMessage(tabs[0].id, { text: 'getwebzoom' }, function (info) {
                if (info == null || info == "") { info = 1 }
                ratio = info;
                currentRatio = ratio;
                document.getElementById("number").value = Math.round(ratio * 100);
                document.getElementById("range").value = Math.round(ratio * 100);
            });
        }
    });

});

});