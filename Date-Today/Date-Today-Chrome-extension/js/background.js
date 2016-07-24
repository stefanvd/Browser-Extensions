//================================================
/*

Date Today
The best clock to see in one glance the current day and time. With an option to see the digital clock in the browser toolbar.
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

var twelfh; var timenow; var badge; var lightcolor; var clockbck; var colorhours; var colorminutes; var clockanalog;
var callback = null;
var pastetext;
// Read current value settings
document.addEventListener('DOMContentLoaded', function () {
chrome.storage.sync.get(['twelfh','badge','lightcolor','clockbck','colorhours','colorminutes','clockanalog'], function(response){
twelfh = response.twelfh;
badge = response.badge;
lightcolor = response.lightcolor;if(!lightcolor)lightcolor = '#3cb4fe';
clockbck = response.clockbck;
colorhours = response.colorhours;if(!colorhours)colorhours = '#3c5886';
colorminutes = response.colorminutes;if(!colorminutes)colorminutes = '#3c5886';
clockanalog = response.clockanalog;if(!clockanalog)clockanalog = true;

var jan = chrome.i18n.getMessage('jan');var feb = chrome.i18n.getMessage('feb');var mar = chrome.i18n.getMessage('mar');
var apr = chrome.i18n.getMessage('apr');var may = chrome.i18n.getMessage('may');var jun = chrome.i18n.getMessage('jun');
var jul = chrome.i18n.getMessage('jul');var aug = chrome.i18n.getMessage('aug');var sep = chrome.i18n.getMessage('sep');
var oct = chrome.i18n.getMessage('oct');var nov = chrome.i18n.getMessage('nov');var dec = chrome.i18n.getMessage('dec');
 
var sun = chrome.i18n.getMessage('sun');var mon = chrome.i18n.getMessage('mon');var tue = chrome.i18n.getMessage('tue');
var wed = chrome.i18n.getMessage('wed');var thu = chrome.i18n.getMessage('thu');var fri = chrome.i18n.getMessage('fri');
var sat = chrome.i18n.getMessage('sat');
 
// Date today now
var this_weekday_name_array = new Array(sun, mon, tue, wed, thu, fri, sat);	//predefine weekday names
var this_month_name_array = new Array(jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec);	//predefine month names
 
var currentday = new Date();	//get current day-time stamp
 
var this_weekday = currentday.getDay();	//extract weekday
var this_date = currentday.getDate();	//extract day of month
var this_month = currentday.getMonth();	//extract month
var this_year = currentday.getYear();	//extract year
 
if (this_year < 1000)
this_year += 1900; //fix Y2K problem
 
var currentdate = this_weekday_name_array[this_weekday] + " " + this_month_name_array[this_month] + " " + this_date + " " + this_year; //long date string 
var tic;
		
// analog clock
var canvas; var c; var d; var hours; var minutes;
 
	function drawPen(angle, len, smaller) {
		c.save();
		c.lineWidth = 2.5;
		c.lineCap = "round";
		if(smaller == true){
			c.strokeStyle = colorhours;
		}else{
			c.strokeStyle = colorminutes;
		}
		c.translate(19,19);
		c.rotate(angle);
		c.beginPath();	
		c.moveTo(0,2);
		c.lineTo(0,len);
		c.stroke();
		c.restore();
	}
	
	function updateClock() {
		canvas = document.getElementById("clock");
		c = canvas.getContext('2d');
		d = new Date();
		hours = d.getHours();
		minutes = d.getMinutes();
				
		// Clean canvas
		c.clearRect(0,0,38,38);
		
		if(clockanalog == true){
		// Draw Arc
		c.beginPath();

        // Draw arc way
		if(clockbck == true){}else{
        c.arc(19,19,19,0,Math.PI*2,true); 
        c.lineWidth = .5;
        c.fillStyle="rgb(247,248,250)";
        c.fill()
		}
		c.strokeStyle = "rgba(229,229,229,.3)";
		c.stroke();
    	
		// Draw current minutes from pen
		drawPen((minutes/60)*(2*Math.PI),-13,false);
		// Draw current hour from pen
		drawPen(((hours/12) + (minutes/720))*(2*Math.PI),-9,true);
 		}
		 
		// Update tooltip text
		this_weekday= d.getDay();
		this_date = d.getDate();
		this_month = d.getMonth();
		this_year = d.getFullYear();
 
		if(twelfh == true)
		{
				if (hours >= 12) {hours -= 12; tic = "pm "; }
	    			else {tic = "am "; }
				if (hours == 0) {hours = 12;}
		}
		if (String(minutes).length == 1) {
			minutes = "0" + String(minutes);
		}
		
		// Write to the browserAction
		chrome.browserAction.setIcon({imageData:c.getImageData(0, 0, canvas.width,canvas.height)});
 		timenow = hours + ":" + minutes;
		datetoday = hours + ":" + minutes + " " + tic + this_weekday_name_array[this_weekday] + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year;
		
		if(badge == true){
			chrome.browserAction.setBadgeText({ text: timenow })
			chrome.browserAction.setBadgeBackgroundColor({color:lightcolor}); 
		}else{
			chrome.browserAction.setBadgeText({ text: "" })
		}
		chrome.browserAction.setTitle({title:datetoday});
		// Clean this
		canvas = null;
		c = null;
		d = null;
		hours = null;
		minutes = null;
		tic = null;
		this_weekday = null;
		this_day = null;
		this_date = null;
		this_month = null;
		this_year = null;
		datetoday = null;
		timenow = null;
		}
 
		function startTime(){
		updateClock();timestamp();
		t = setTimeout(startTime,500);  // refresh
		}

// Date stamp
var dt;var dthours;var dtminutes;var dttic;

function timestamp(){
dt = new Date();
dthours = dt.getHours();
dtminutes = dt.getMinutes();

		if(twelfh == true)
		{
				if (dthours >= 12) {dthours -= 12; dttic = "pm "; }
	    			else {dttic = "am "; }
				if (dthours == 0) {dthours = 12;}
		}
		else {dttic = ""}
		if (String(dtminutes).length == 1) {
			dtminutes = "0" + String(dtminutes);
		}
pastetext = dthours + ":" + dtminutes + " " + dttic + currentdate;
}

startTime();
});
});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "stamp") {
	    chrome.windows.getCurrent(function (w) {
        chrome.tabs.getSelected(w.id,
        function (response) {
            tabId = response.id;
			chrome.tabs.sendMessage(tabId, { text: 'getpaste', 'topaste': pastetext }, function (info) {
	});
  });
});
}
else if (info.menuItemId == "totlguideemenu") {window.open(linkguide, "_blank");}
else if (info.menuItemId == "totldevelopmenu") {window.open(donatewebsite, "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open(writereview, "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open(datetodaywebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Date Today extension&body=Hé, This is amazing. I just tried today this Date Today Browser extension"+datetodayproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var sdatetodayproductcodeurl = encodeURIComponent("The Best and Amazing Date Today Browser extension "+datetodayproduct+"");window.open("https://twitter.com/home?status="+sdatetodayproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+datetodayproduct, "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url="+datetodayproduct, "_blank");}
}

chrome.runtime.onInstalled.addListener(function() {
// check to remove all contextmenus
chrome.contextMenus.removeAll(function() {
//console.log("contextMenus.removeAll callback");
});

// pageaction
var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenupostongoogleplus = chrome.i18n.getMessage("sharemenupostongoogleplus");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");

var contexts = ["page_action", "browser_action"];
chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts":contexts});
chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts":contexts});

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts":contexts});
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "parentId": parent});

chrome.storage.sync.get(['stamp'], function(items){
    if(items['stamp']){checkcontextmenus();}
});
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

// context menu for page and video
var menupage = null;
var contextmenuadded = false;
var contextarraypage = [];

function checkcontextmenus(){
    if(contextmenuadded == false){
    contextmenuadded = true;

    // page
    var contexts = ["editable"];
        for (var i = 0; i < contexts.length; i++){
        var context = contexts[i];
        var pagetitle = chrome.i18n.getMessage("pastestamp");
        menupage = chrome.contextMenus.create({"id": "stamp","title": pagetitle, "contexts":[context]});
        contextarraypage.push(menupage);
        }
    }
}

function removecontexmenus(){
    if (contextarraypage.length > 0) {
        for (var i=0;i<contextarraypage.length;i++) {
            if (contextarraypage[i] === undefined || contextarraypage[i] === null){}else{
            chrome.contextMenus.remove(contextarraypage[i]);
            }
        }
    }
    contextarraypage = [];
    contextmenuadded = false;
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
   for (key in changes) {
          var storageChange = changes[key];
          if(changes['stamp']){if(changes['stamp'].newValue == true){checkcontextmenus()}else{removecontexmenus()}}
          if(changes['badge']) {
              if(changes['badge'].newValue) { badge = true; } else { badge = false; chrome.browserAction.setBadgeText({ text: "" }) }
          }
          if(changes['lightcolor']) {
              if(changes['lightcolor'].newValue) { chrome.browserAction.setBadgeBackgroundColor({ color: lightcolor }) }
          }
		  if(changes['twelfh']){
			  if(changes['twelfh'].newValue == true){ twelfh = true; } else { twelfh = false; }
		  }
		  if(changes['clockbck']){
			  if(changes['clockbck'].newValue == true){ clockbck = true; } else { clockbck = false; }
		  }
		  if(changes['colorhours']) {
              if(changes['colorhours'].newValue) { colorhours = changes['colorhours'].newValue; }
          }
		  if(changes['colorminutes']) {
              if(changes['colorminutes'].newValue) { colorminutes = changes['colorminutes'].newValue; }
		  }
		  if(changes['clockanalog']) {
              if(changes['clockanalog'].newValue) { clockanalog = true; } else { clockanalog = false; }
		  }
		 
    }
})

try{ chrome.runtime.setUninstallUrl(linkuninstall); }
catch(e){}

// Fired when an update is available
chrome.runtime.onUpdateAvailable.addListener(function() {chrome.runtime.reload();});

chrome.storage.sync.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage, selected:true})
  chrome.storage.sync.set({"firstRun": "false"});
  chrome.storage.sync.set({"version": "1.1"});
}
});