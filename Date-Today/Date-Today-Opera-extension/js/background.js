//================================================
/*

Date Today
The best clock to see in one glance the current day and time. With an option to see the digital clock in the browser toolbar.
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

var twelfh = null, timenow = null, badge = null, lightcolor = null, clockbck = null, colorhours = null, colorminutes = null, clockanalog = null, clocktickpoint = null, colorbackground = null, colordots = null, badgeclock = null, badgedate = null, badgeweek = null, badgemonth = null, badgedatesystema = null, badgedatesystemb = null, textcanvascolor = null, stamptypeA = null, stamptypeB = null, stamptypeC = null, stamptypeD = null;
var callback = null;
var pastetext;
chrome.runtime.onMessageExternal.addListener(function(req,sender,callback){if(req){if(req.message){if(req.message == "installed"){if(sender.tab.url){var hostname = (new URL(sender.tab.url)).protocol+'//'+(new URL(sender.tab.url)).hostname;}if(sender.id == idaa || sender.id == idz || sender.id == idtotl || sender.id == idft || sender.id == idpp || sender.id == idfs || sender.id == iddt || hostname == developerwebsite){callback(true);}}}}return true;});
// Read current value settings
document.addEventListener('DOMContentLoaded', function () {
chrome.storage.sync.get(['twelfh','badge','lightcolor','clockbck','colorhours','colorminutes','clockanalog','clocktickpoint','colorbackground','colordots','badgeclock','badgedate','badgeweek','badgemonth','badgedatesystema','badgedatesystemb','textcanvascolor','stamptypeA','stamptypeB','stamptypeC','stamptypeD'], function(response){
twelfh = response.twelfh;if(twelfh == null)twelfh = false;
badge = response.badge;if(badge == null)badge = false;
lightcolor = response.lightcolor;if(lightcolor == null)lightcolor = '#3cb4fe';
clockbck = response.clockbck;
colorhours = response.colorhours;if(colorhours == null)colorhours = '#3c5886';
colorminutes = response.colorminutes;if(colorminutes == null)colorminutes = '#3c5886';
clockanalog = response.clockanalog;if(clockanalog == null)clockanalog = true;
clocktickpoint = response.clocktickpoint;if(clocktickpoint == null)clocktickpoint = false;
colorbackground = response.colorbackground;if(colorbackground == null)colorbackground = '#F7F8FA';
colordots = response.colordots;if(colordots == null)colordots = '#000000';
badgeclock = response.badgeclock;if(badgeclock == null)badgeclock = true;
badgedate = response.badgedate;if(badgedate == null)badgedate = false;
badgeweek = response.badgeweek;if(badgeweek == null)badgeweek = false;
badgemonth = response.badgemonth;if(badgemonth == null)badgemonth = false;
badgedatesystema = response.badgedatesystema;if(badgedatesystema == null)badgedatesystema = true;
badgedatesystemb = response.badgedatesystemb;if(badgedatesystemb == null)badgedatesystemb = false;
textcanvascolor = response.textcanvascolor;if(textcanvascolor == null)textcanvascolor = '#000000';
stamptypeA = response.stamptypeA;if(stamptypeA == null)stamptypeA = true;
stamptypeB = response.stamptypeB;if(stamptypeB == null)stamptypeB = false;
stamptypeC = response.stamptypeC;if(stamptypeC == null)stamptypeC = false;
stamptypeD = response.stamptypeD;if(stamptypeD == null)stamptypeD = false;

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
var tic = "";
		
// analog clock
var canvas; var c; var d; var hours; var minutes; var seconds;
 
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
	
	function Shape(x, y, w, h, fill) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.fill = fill;
	}

	var bckshowclock = false;
	function updateClock() {
		canvas = document.getElementById("clock");
		c = canvas.getContext('2d');
		d = new Date();
		hours = d.getHours();
		minutes = d.getMinutes();
		seconds = d.getSeconds();

		// Clean canvas
		c.clearRect(0,0,38,38);

		if((badgedate == true) && (badge == true)){bckshowclock=true;}
		else if((badgeweek == true) && (badge == true)){bckshowclock=true;}
		else if((badgemonth == true) && (badge == true)){bckshowclock=false;}
		else if((badgeclock == true) && (badge == true)){bckshowclock=true;}
		else {bckshowclock=true;}

		if((bckshowclock == true)){
		if(clockanalog == true){
		// Draw Arc
		c.beginPath();

        // Draw arc way
		if(clockbck == true){}else{
        c.arc(19,19,19,0,Math.PI*2,true); 
        c.lineWidth = .5;
        c.fillStyle=colorbackground;
        c.fill()
		}
		c.strokeStyle = "rgba(229,229,229,.3)";
		c.stroke();
    	
		// Draw current minutes from pen
		drawPen((minutes/60)*(2*Math.PI),-13,false);
		// Draw current hour from pen
		drawPen(((hours/12) + (minutes/720))*(2*Math.PI),-9,true);
 		}
		}

		if((badge == true) && (badgemonth == true)){
			c.font = "22px Arial";
			c.fillStyle = textcanvascolor;
			c.textAlign = "center";
			c.fillText(d.getDate(), canvas.width/2, canvas.height/2-2);
		}
		 
		if(clocktickpoint == true){
			var myRect = [];
			myRect.push(new Shape(0, 19, 2, 2, colordots));
			myRect.push(new Shape(36, 19, 2, 2, colordots));
			myRect.push(new Shape(19, 0, 2, 2, colordots));
			myRect.push(new Shape(19, 36, 2, 2, colordots));
			for (var i in myRect) {
				oRec = myRect[i];
				c.fillStyle = oRec.fill;
				c.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);
			}
	 	}

		// Update tooltip text
		this_weekday= d.getDay();
		this_date = d.getDate();
		this_month = d.getMonth();
		this_year = d.getFullYear();
 
		if(twelfh == true)
		{
			if (hours >= 12){hours -= 12; tic = "pm ";}else{tic = "am ";}
			if (hours == 0){hours = 12;}
		}else {tic = "";}
		
		if (String(minutes).length == 1) {
			minutes = "0" + String(minutes);
		}
		
		// Write to the browserAction
		chrome.browserAction.setIcon({imageData:c.getImageData(0, 0, canvas.width,canvas.height)});
 		timenow = hours + ":" + minutes;
		datetoday = hours + ":" + minutes + ":" + seconds + " " + tic + this_weekday_name_array[this_weekday] + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year;
		
		var badgelabel = "";
		if(badge == true){
			if(badgeclock == true){badgelabel = hours + "" + minutes;}
			else if(badgedate == true){
				 if(badgedatesystema == true){badgelabel = parseInt(this_month + 1) + "" + this_date;}
				 else{badgelabel = this_date + "" + parseInt(this_month + 1);}
			}
			else if(badgeweek == true){badgelabel = this_weekday_name_array[this_weekday];}
			else if(badgemonth == true){badgelabel = this_month_name_array[this_month];}
			chrome.browserAction.setBadgeText({ text: badgelabel });
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
		timenow = null;
		}
 
		function startTime(){
		updateClock();timestamp();
		t = setTimeout(startTime,500);  // refresh
		}

// Date stamp
var dt;var h;var m;
var dttic = "";

function timestamp(){
	dt = new Date();
	h = dt.getHours();
	m = dt.getMinutes();

	if(twelfh == true)
	{
		if(h >= 12){h -= 12;dttic = "pm ";}
    	else{dttic = "am ";}
		if(h == 0){h = 12;}
	}
	else {dttic = ""}
	if (String(m).length == 1) {
		m = "0" + String(m);
	}

	if(stamptypeA == true){pastetext = h + ":" + m + dttic + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year;}
	else if(stamptypeB == true){pastetext = h + ":" + m + dttic + " " + this_weekday_name_array[this_weekday] + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year;}
	else if(stamptypeC == true){pastetext = h + ":" + m + dttic + " " + this_date + "/" + parseInt(this_month + 1) + "/" + this_year;}
	else if(stamptypeD == true){pastetext = h + ":" + m + dttic + " " + parseInt(this_month + 1) + "/" + this_date + "/" + this_year;}
}

startTime();
});
});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "stamp") {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
					chrome.tabs.sendMessage(tabs[i].id, { text: 'getpaste', 'topaste': pastetext }, function (info) {});
                    }
                }
            );
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
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "contexts": contexts, "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "contexts": contexts, "parentId": parent});
var child3 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "contexts": contexts, "parentId": parent});
var child4 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "contexts": contexts, "parentId": parent});

chrome.storage.sync.get(['stamp'], function(items){
    if(items['stamp']){checkcontextmenus();}
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
		  if(changes['badgeclock']){
			  if(changes['badgeclock'].newValue == true){ badgeclock = true; } else { badgeclock = false; }
		  }
		  if(changes['badgedate']){
			  if(changes['badgedate'].newValue == true){ badgedate = true; } else { badgedate = false; }
		  }
		  if(changes['badgeweek']){
			  if(changes['badgeweek'].newValue == true){ badgeweek = true; } else { badgeweek = false; }
		  }
		  if(changes['badgemonth']){
			  if(changes['badgemonth'].newValue == true){ badgemonth = true; } else { badgemonth = false; }
		  }
		  if(changes['badgedatesystema']){
			  if(changes['badgedatesystema'].newValue == true){ badgedatesystema = true; } else { badgedatesystema = false; }
		  }
		  if(changes['badgedatesystemb']){
			  if(changes['badgedatesystemb'].newValue == true){ badgedatesystemb = true; } else { badgedatesystemb = false; }
		  }
          if(changes['textcanvascolor']) {
              if(changes['textcanvascolor'].newValue) { textcanvascolor = changes['textcanvascolor'].newValue; }
          }
		  if(changes['stamptypeA']){
			  if(changes['stamptypeA'].newValue == true){ stamptypeA = true; } else { stamptypeA = false; }
		  }
		  if(changes['stamptypeB']){
			  if(changes['stamptypeB'].newValue == true){ stamptypeB = true; } else { stamptypeB = false; }
		  }
		  if(changes['stamptypeC']){
			  if(changes['stamptypeC'].newValue == true){ stamptypeC = true; } else { stamptypeC = false; }
		  }
		  if(changes['stamptypeD']){
			  if(changes['stamptypeD'].newValue == true){ stamptypeD = true; } else { stamptypeD = false; }
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
		  if(changes['clocktickpoint']) {
              if(changes['clocktickpoint'].newValue) { clocktickpoint = true; } else { clocktickpoint = false; }
		  }
		  if(changes['colorbackground']) {
              if(changes['colorbackground'].newValue) { colorbackground = changes['colorbackground'].newValue; }
		  }
		 if(changes['colordots']) {
              if(changes['colordots'].newValue) { colordots = changes['colordots'].newValue; }
		  }

    }
})

chrome.runtime.setUninstallURL(linkuninstall);

chrome.storage.sync.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage})
  var crrinstall = new Date().getTime();
  chrome.storage.sync.set({"firstRun": false, "version": "1.1", "firstDate": crrinstall});
}
});