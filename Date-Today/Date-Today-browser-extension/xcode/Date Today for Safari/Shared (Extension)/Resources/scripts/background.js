//================================================
/*

Date Today
The best clock to see in one glance the current day and time. With an option to see the digital clock in the browser toolbar.
Copyright (C) 2025 Stefan vd
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

// Importing the constants
// Execute if importScripts is support such as Google Chrome and not Firefox
if(typeof importScripts !== "undefined"){
	// eslint-disable-next-line no-undef
	importScripts("constants.js");
}

var twelfh = null, badge = null, lightcolor = null, clockbck = null, colorhours = null, colorminutes = null, clockanalog = null, clocktickpoint = null, colorbackground = null, colordots = null, badgeclock = null, badgedate = null, badgeweek = null, badgemonth = null, badgedatesystema = null, badgedatesystemb = null, textcanvascolor = null, stamptypeA = null, stamptypeB = null, stamptypeC = null, stamptypeD = null, stamptypeE = null, datetoday = null, badgetop = null, badgebottom = null, hidemonth = null, stamptypeF = null;
var pastetext;

// Read current value settings
function init(){
	chrome.storage.sync.get(["twelfh", "badge", "lightcolor", "clockbck", "colorhours", "colorminutes", "clockanalog", "clocktickpoint", "colorbackground", "colordots", "badgeclock", "badgedate", "badgeweek", "badgemonth", "badgedatesystema", "badgedatesystemb", "textcanvascolor", "stamptypeA", "stamptypeB", "stamptypeC", "stamptypeD", "stamptypeE", "badgetop", "badgebottom", "hidemonth", "stamptypeF"], function(response){
		twelfh = response.twelfh; if(twelfh == null)twelfh = false;
		badge = response.badge; if(badge == null)badge = false;
		lightcolor = response.lightcolor; if(lightcolor == null)lightcolor = "#3cb4fe";
		clockbck = response.clockbck;
		colorhours = response.colorhours; if(colorhours == null)colorhours = "#3c5886";
		colorminutes = response.colorminutes; if(colorminutes == null)colorminutes = "#3c5886";
		clockanalog = response.clockanalog; if(clockanalog == null)clockanalog = true;
		clocktickpoint = response.clocktickpoint; if(clocktickpoint == null)clocktickpoint = false;
		colorbackground = response.colorbackground; if(colorbackground == null)colorbackground = "#F7F8FA";
		colordots = response.colordots; if(colordots == null)colordots = "#000000";
		badgeclock = response.badgeclock; if(badgeclock == null)badgeclock = true;
		badgedate = response.badgedate; if(badgedate == null)badgedate = false;
		badgeweek = response.badgeweek; if(badgeweek == null)badgeweek = false;
		badgemonth = response.badgemonth; if(badgemonth == null)badgemonth = false;
		badgedatesystema = response.badgedatesystema; if(badgedatesystema == null)badgedatesystema = true;
		badgedatesystemb = response.badgedatesystemb; if(badgedatesystemb == null)badgedatesystemb = false;
		textcanvascolor = response.textcanvascolor; if(textcanvascolor == null)textcanvascolor = "#000000";
		stamptypeA = response.stamptypeA; if(stamptypeA == null)stamptypeA = true;
		stamptypeB = response.stamptypeB; if(stamptypeB == null)stamptypeB = false;
		stamptypeC = response.stamptypeC; if(stamptypeC == null)stamptypeC = false;
		stamptypeD = response.stamptypeD; if(stamptypeD == null)stamptypeD = false;
		stamptypeE = response.stamptypeE; if(stamptypeE == null)stamptypeE = false;
		stamptypeF = response.stamptypeF; if(stamptypeF == null)stamptypeF = false;
		badgetop = response.badgetop; if(badgetop == null)badgetop = false;
		badgebottom = response.badgebottom; if(badgebottom == null)badgebottom = true;
		hidemonth = response.hidemonth; if(hidemonth == null)hidemonth = false;

		var jan = chrome.i18n.getMessage("jan"); var feb = chrome.i18n.getMessage("feb"); var mar = chrome.i18n.getMessage("mar");
		var apr = chrome.i18n.getMessage("apr"); var may = chrome.i18n.getMessage("may"); var jun = chrome.i18n.getMessage("jun");
		var jul = chrome.i18n.getMessage("jul"); var aug = chrome.i18n.getMessage("aug"); var sep = chrome.i18n.getMessage("sep");
		var oct = chrome.i18n.getMessage("oct"); var nov = chrome.i18n.getMessage("nov"); var dec = chrome.i18n.getMessage("dec");

		var sun = chrome.i18n.getMessage("sun"); var mon = chrome.i18n.getMessage("mon"); var tue = chrome.i18n.getMessage("tue");
		var wed = chrome.i18n.getMessage("wed"); var thu = chrome.i18n.getMessage("thu"); var fri = chrome.i18n.getMessage("fri");
		var sat = chrome.i18n.getMessage("sat");

		// Date today now
		var this_weekday_name_array = new Array(sun, mon, tue, wed, thu, fri, sat);	// predefine weekday names
		var this_month_name_array = new Array(jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec);	// predefine month names
		//---
		var currentday = new Date();	// get current day-time stamp

		var this_weekday = currentday.getDay();	// extract weekday
		var this_date = currentday.getDate();	// extract day of month
		var this_month = currentday.getMonth();	// extract month
		var this_year = currentday.getYear();	// extract year

		if(this_year < 1000)
			this_year += 1900; // fix Y2K problem

		// var currentdate = this_weekday_name_array[this_weekday] + " " + this_month_name_array[this_month] + " " + this_date + " " + this_year; // long date string

		var tic = "";

		// analog clock
		var canvas; var c; var d; var hours; var minutes; var seconds;

		chrome.runtime.onStartup.addListener(function(){
			startTime();
		});

		chrome.alarms.onAlarm.addListener(function(){
			startTime();
		});

		function drawPen(angle, len, smaller){
			c.save();
			c.lineWidth = 3.2;
			c.lineCap = "round";
			if(smaller == true){
				c.strokeStyle = colorhours;
			}else{
				c.strokeStyle = colorminutes;
			}
			c.translate(19, 19);
			c.rotate(angle);
			c.beginPath();
			c.moveTo(0, 2);
			c.lineTo(0, len);
			c.stroke();
			c.restore();
		}

		function Shape(x, y, w, h, fill){
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.fill = fill;
		}

		var bckshowclock = false;
		function updateClock(){
			canvas = new OffscreenCanvas(38, 38);
			c = canvas.getContext("2d");
			d = new Date();
			hours = d.getHours();
			minutes = d.getMinutes();
			seconds = d.getSeconds();

			// Clean canvas
			c.clearRect(0, 0, 38, 38);

			if((badgedate == true) && (badge == true)){ bckshowclock = true; }else if((badgeweek == true) && (badge == true)){ bckshowclock = true; }else if((badgemonth == true) && (badge == true)){ bckshowclock = false; }else if((badgeclock == true) && (badge == true)){ bckshowclock = true; }else{ bckshowclock = true; }

			if((bckshowclock == true)){
				if(clockanalog == true){
					// Draw Arc
					c.beginPath();

					// Draw arc way
					if(clockbck != true){
						c.arc(19, 19, 19, 0, Math.PI * 2, true);
						c.lineWidth = .5;
						c.fillStyle = colorbackground;
						c.fill();
					}
					c.strokeStyle = "rgba(229,229,229,.3)";
					c.stroke();

					// Draw current minutes from pen
					drawPen((minutes / 60) * (2 * Math.PI), -13, false);
					// Draw current hour from pen
					drawPen(((hours / 12) + (minutes / 720)) * (2 * Math.PI), -9, true);
				}
			}

			if((badge == true) && (badgemonth == true)){
				if(hidemonth == true){
					c.font = "38px Arial";
					c.fillStyle = textcanvascolor;
					c.textAlign = "center";
					c.fillText(d.getDate(), canvas.width / 2, canvas.height - 4);
				}else{
					c.font = "22px Arial";
					c.fillStyle = textcanvascolor;
					c.textAlign = "center";
					if(badgebottom == true){
						c.fillText(d.getDate(), canvas.width / 2, canvas.height / 2 - 2);
					}else{
						c.fillText(d.getDate(), canvas.width / 2, canvas.height);
					}
				}
			}

			if(clocktickpoint == true){
				var myRect = [];
				var oRec;
				myRect.push(new Shape(0, 19, 2, 2, colordots));
				myRect.push(new Shape(36, 19, 2, 2, colordots));
				myRect.push(new Shape(19, 0, 2, 2, colordots));
				myRect.push(new Shape(19, 36, 2, 2, colordots));
				for(var i in myRect){
					oRec = myRect[i];
					c.fillStyle = oRec.fill;
					c.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);
				}
			}

			// Update tooltip text
			this_weekday = d.getDay();
			this_date = d.getDate();
			this_month = d.getMonth();
			this_year = d.getFullYear();

			if(twelfh == true){
				if(hours >= 12){ hours -= 12; tic = "pm "; }else{ tic = "am "; }
				if(hours == 0){ hours = 12; }
			}else{ tic = ""; }

			if(String(minutes).length == 1){
				minutes = "0" + String(minutes);
			}

			if(String(seconds).length == 1){
				seconds = "0" + String(seconds);
			}

			// Write to the action
			chrome.action.setIcon({imageData:c.getImageData(0, 0, canvas.width, canvas.height)});

			if(stamptypeA == true){ datetoday = this_date + " " + this_month_name_array[this_month] + " " + this_year + " " + hours + ":" + minutes + ":" + seconds + " " + tic; }else if(stamptypeB == true){ datetoday = this_weekday_name_array[this_weekday] + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year + " " + hours + ":" + minutes + ":" + seconds + " " + tic; }else if(stamptypeC == true){ datetoday = this_date + "/" + parseInt(this_month + 1) + "/" + this_year + " " + hours + ":" + minutes + ":" + seconds + " " + tic; }else if(stamptypeD == true){ datetoday = parseInt(this_month + 1) + "/" + this_date + "/" + this_year + " " + hours + ":" + minutes + ":" + seconds + " " + tic; }else if(stamptypeE == true){ datetoday = this_weekday_name_array[this_weekday] + ", " + this_month_name_array[this_month] + " " + this_date + ", " + this_year + " " + hours + ":" + minutes + ":" + seconds + " " + tic; }else if(stamptypeF == true){ datetoday = this_year + "-" + String(this_month + 1).padStart(2, "0") + "-" + String(this_date).padStart(2, "0") + " " + String(hours).padStart(2, "0") + String(minutes).padStart(2, "0") + tic; }


			var badgelabel = "";
			if(badge == true){
				if(badgeclock == true){ badgelabel = hours + "" + minutes; }else if(badgedate == true){
					if(badgedatesystema == true){ badgelabel = parseInt(this_month + 1) + "" + this_date; }else{ badgelabel = this_date + "" + parseInt(this_month + 1); }
				}else if(badgeweek == true){
					badgelabel = this_weekday_name_array[this_weekday]; badgelabel = badgelabel.substring(0, 3); // only the first 3 characters
				}else if(badgemonth == true){
					badgelabel = this_month_name_array[this_month]; badgelabel = badgelabel.substring(0, 3); // only the first 3 characters
				}
				if(hidemonth == true && badgemonth == true){
					chrome.action.setBadgeText({text: ""});
				}else{
					chrome.action.setBadgeText({text: badgelabel});
				}
				chrome.action.setBadgeBackgroundColor({color:lightcolor});
			}else{
				chrome.action.setBadgeText({text: ""});
			}
			chrome.action.setTitle({title:datetoday});
			// Clean this
			canvas = null;
			c = null;
			d = null;
			hours = null;
			minutes = null;
			tic = null;
		}

		function startTime(){
			updateClock(); timestamp();
			chrome.alarms.create("startTime", {when:Date.now() + 1000});
		}

		// Date stamp
		var dt; var h; var m;
		var dttic = "";

		function timestamp(){
			dt = new Date();
			h = dt.getHours();
			m = dt.getMinutes();

			if(twelfh == true){
				if(h >= 12){ h -= 12; dttic = "pm "; }else{ dttic = "am "; }
				if(h == 0){ h = 12; }
			}else{ dttic = ""; }
			if(String(m).length == 1){
				m = "0" + String(m);
			}

			if(stamptypeA == true){ pastetext = this_date + " " + this_month_name_array[this_month] + " " + this_year + " " + h + ":" + m + dttic; }else if(stamptypeB == true){ pastetext = this_weekday_name_array[this_weekday] + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year + " " + h + ":" + m + dttic; }else if(stamptypeC == true){ pastetext = this_date + "/" + parseInt(this_month + 1) + "/" + this_year + " " + h + ":" + m + dttic; }else if(stamptypeD == true){ pastetext = parseInt(this_month + 1) + "/" + this_date + "/" + this_year + " " + h + ":" + m + dttic; }else if(stamptypeE == true){ pastetext = this_weekday_name_array[this_weekday] + ", " + this_month_name_array[this_month] + " " + this_date + ", " + this_year + " " + h + ":" + m + dttic; }else if(stamptypeF == true){ pastetext = this_year + "-" + String(this_month + 1).padStart(2, "0") + "-" + String(this_date).padStart(2, "0") + " " + String(h).padStart(2, "0") + String(m).padStart(2, "0") + dttic; }
		}

		startTime();
	});
}

// contextMenus
function onClickHandler(info){
	if(info.menuItemId == contextMenuIds.stamp){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.sendMessage(tabs[i].id, {text: "getpaste", "topaste": pastetext});
			}
		}
		);
	}else if(info.menuItemId == "totlguideemenu"){
		chrome.tabs.create({url: linkguide, active:true});
	}else if(info.menuItemId == "totldevelopmenu"){
		chrome.tabs.create({url: linkdonate, active:true});
	}else if(info.menuItemId == "totlratemenu"){
		chrome.tabs.create({url: writereview, active:true});
	}else if(info.menuItemId == "totlshareemail"){
		var sturnoffthelightemail = "mailto:your@email.com?subject=" + chrome.i18n.getMessage("sharetexta") + "&body=" + chrome.i18n.getMessage("sharetextb") + " " + linkproduct; chrome.tabs.create({url: sturnoffthelightemail, active:true});
	}else if(info.menuItemId == "totlsharex"){
		var slinkproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextd") + " " + linkproduct); chrome.tabs.create({url: "https://x.com/intent/tweet?text=" + slinkproductcodeurl, active:true});
	}else if(info.menuItemId == "totlsharefacebook"){
		chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u=" + linkproduct, active:true});
	}else if(info.menuItemId == "totlsubscribe"){
		chrome.tabs.create({url: linkyoutube, active:true});
	}else if(info.menuItemId == "totlshareqq"){
		chrome.tabs.create({url: "https://connect.qq.com/widget/shareqq/index.html?url=" + encodeURIComponent(linkproduct) + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
	}else if(info.menuItemId == "totlshareweibo"){
		chrome.tabs.create({url: "https://service.weibo.com/share/share.php?url=" + linkproduct + "&title=" + encodeURIComponent(chrome.i18n.getMessage("sharetextd")), active:true});
	}else if(info.menuItemId == "totlsharevkontakte"){
		chrome.tabs.create({url: "https://vk.com/share.php?url=" + linkproduct, active:true});
	}else if(info.menuItemId == "totlsharewhatsapp"){
		chrome.tabs.create({url: "https://api.whatsapp.com/send?text=" + chrome.i18n.getMessage("sharetextd") + "%0a" + linkproduct, active:true});
	}else if(info.menuItemId == "totloptions"){
		chrome.runtime.openOptionsPage();
	}
}


// check to remove all contextmenus
if(chrome.contextMenus){
	chrome.contextMenus.removeAll(function(){
	// console.log("contextMenus.removeAll callback");
	});
}

var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenupostonx = chrome.i18n.getMessage("sharemenupostonx");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
// var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
// var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");
var sharemenupostonweibo = chrome.i18n.getMessage("sharemenupostonweibo");
var sharemenupostonvkontakte = chrome.i18n.getMessage("sharemenupostonvkontakte");
var sharemenupostonwhatsapp = chrome.i18n.getMessage("sharemenupostonwhatsapp");
var sharemenupostonqq = chrome.i18n.getMessage("sharemenupostonqq");
var sharemenuoptions = chrome.i18n.getMessage("titelpopupoptions");

function browsercontext(a, b, c, d){
	var item = {"title": a, "type": "normal", "id": b, "contexts": contexts};
	var newitem;
	if(d != ""){
		item = Object.assign({}, item, {parentId: d});
	}
	if(c != ""){
		newitem = Object.assign({}, item, {icons: c});
	}
	try{
		// try show web browsers that do support "icons"
		// Firefox, Opera, Microsoft Edge
		return chrome.contextMenus.create(newitem);
	}catch(e){
		// catch web browsers that do NOT show the icon
		// Google Chrome
		return chrome.contextMenus.create(item);
	}
}

var actionmenuadded = false;
if(chrome.contextMenus){
	if(actionmenuadded == false){
		actionmenuadded = true;

		var contexts = ["action"];

		browsercontext(sharemenuwelcomeguidetitle, "totlguideemenu", {"16": "images/IconGuide.png", "32": "images/IconGuide@2x.png"});
		browsercontext(sharemenudonatetitle, "totldevelopmenu", {"16": "images/IconDonate.png", "32": "images/IconDonate@2x.png"});
		// browsercontext(sharemenuratetitle, "totlratemenu", {"16": "images/IconStar.png", "32": "images/IconStar@2x.png"});

		// Create a parent item and two children.
		var parent = null;
		parent = browsercontext(sharemenusharetitle, "totlsharemenu", {"16": "images/IconShare.png", "32": "images/IconShare@2x.png"});
		browsercontext(sharemenutellafriend, "totlshareemail", {"16": "images/IconEmail.png", "32": "images/IconEmail@2x.png"}, parent);
		chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});

		var uiLanguage = chrome.i18n.getUILanguage();
		if(uiLanguage.includes("zh")){
			// Chinese users
			browsercontext(sharemenupostonweibo, "totlshareweibo", {"16": "images/IconWeibo.png", "32": "images/IconWeibo@2x.png"}, parent);
			browsercontext(sharemenupostonqq, "totlshareqq", {"16": "images/IconQQ.png", "32": "images/IconQQ@2x.png"}, parent);
		}else if(uiLanguage.includes("ru")){
			// Russian users
			browsercontext(sharemenupostonvkontakte, "totlsharevkontakte", {"16": "images/IconVkontakte.png", "32": "images/IconVkontakte@2x.png"}, parent);
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}else{
			// all users
			browsercontext(sharemenupostonfacebook, "totlsharefacebook", {"16": "images/IconFacebook.png", "32": "images/IconFacebook@2x.png"}, parent);
			browsercontext(sharemenupostonwhatsapp, "totlsharewhatsapp", {"16": "images/IconWhatsApp.png", "32": "images/IconWhatsApp@2x.png"}, parent);
			browsercontext(sharemenupostonx, "totlsharex", {"16": "images/IconX.png", "32": "images/IconX@2x.png"}, parent);
		}

		// browsercontext(sharemenusubscribetitle, "totlsubscribe", {"16": "images/IconYouTube.png", "32": "images/IconYouTube@2x.png"});

		if(exbrowser == "safari" || exbrowser == "firefox"){
			chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
			browsercontext(sharemenuoptions, "totloptions", {"16": "images/options.png", "32": "images/options@2x.png"});
		}

		chrome.contextMenus.onClicked.addListener(onClickHandler);
	}
}

var stamp;
chrome.storage.sync.get(["stamp"], function(items){
	stamp = items.stamp; if(stamp == null)stamp = false;
	if(stamp){ checkcontextmenus(); }
});

// context menu for page and video
var contextmenuadded = false;

let contextMenuIds = {
	stamp: null
};

function addwebpagecontext(title, contexts, id){
	// Remove if exists
	if(contextMenuIds[id] !== null){
		chrome.contextMenus.remove(contextMenuIds[id], () => {
			if(chrome.runtime.lastError){
				console.warn(`Failed to remove menu ${id}: ${chrome.runtime.lastError.message}`);
			}
		});
	}
	// Create context menu and store the returned ID
	contextMenuIds[id] = chrome.contextMenus.create({
		id: id,
		title,
		type: "normal",
		contexts: contexts
	});
}

function checkcontextmenus(){
	if(chrome.contextMenus){
		if(!contextmenuadded){
			contextmenuadded = true;
			// page
			addwebpagecontext(chrome.i18n.getMessage("pastestamp"), ["editable"], "stamp");
		}
	}
}
function removecontexmenus(){
	Object.values(contextMenuIds).forEach((id) => {
		if(id !== null){
			chrome.contextMenus.remove(id, () => {
				if(chrome.runtime.lastError){
					console.warn(`Failed to remove menu ${id}: ${chrome.runtime.lastError.message}`);
				}
			});
		}
	});
	contextMenuIds.stamp = null;
	contextmenuadded = false;
}

chrome.runtime.onMessage.addListener(function request(request, sender){
	switch(request.name){
	case"bckreload":
		installation();
		break;
	case"redirectionoptions":
		chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
			chrome.tabs.remove(tabs[0].id);
			chrome.runtime.openOptionsPage();
		});
		break;
	case"getallpermissions":
		var result = "";
		chrome.permissions.getAll(function(permissions){
			result = permissions.permissions;
			chrome.tabs.sendMessage(sender.tab.id, {text: "receiveallpermissions", value: result});
		});
		break;
	}
});

chrome.storage.onChanged.addListener(function(changes){
	if(changes["stamp"]){ if(changes["stamp"].newValue == true){ checkcontextmenus(); }else{ removecontexmenus(); } }
	if(changes["badge"]){
		if(changes["badge"].newValue){ badge = true; }else{ badge = false; chrome.action.setBadgeText({text: ""}); }
	}
	if(changes["badgeclock"]){
		if(changes["badgeclock"].newValue == true){ badgeclock = true; }else{ badgeclock = false; }
	}
	if(changes["badgedate"]){
		if(changes["badgedate"].newValue == true){ badgedate = true; }else{ badgedate = false; }
	}
	if(changes["badgeweek"]){
		if(changes["badgeweek"].newValue == true){ badgeweek = true; }else{ badgeweek = false; }
	}
	if(changes["badgemonth"]){
		if(changes["badgemonth"].newValue == true){ badgemonth = true; }else{ badgemonth = false; }
	}
	if(changes["badgetop"]){
		if(changes["badgetop"].newValue == true){ badgetop = true; }else{ badgetop = false; }
	}
	if(changes["badgebottom"]){
		if(changes["badgebottom"].newValue == true){ badgebottom = true; }else{ badgebottom = false; }
	}
	if(changes["hidemonth"]){
		if(changes["hidemonth"].newValue == true){ hidemonth = true; }else{ hidemonth = false; }
	}
	if(changes["badgedatesystema"]){
		if(changes["badgedatesystema"].newValue == true){ badgedatesystema = true; }else{ badgedatesystema = false; }
	}
	if(changes["badgedatesystemb"]){
		if(changes["badgedatesystemb"].newValue == true){ badgedatesystemb = true; }else{ badgedatesystemb = false; }
	}
	if(changes["textcanvascolor"]){
		if(changes["textcanvascolor"].newValue){ textcanvascolor = changes["textcanvascolor"].newValue; }
	}
	if(changes["stamptypeA"]){
		if(changes["stamptypeA"].newValue == true){ stamptypeA = true; }else{ stamptypeA = false; }
	}
	if(changes["stamptypeB"]){
		if(changes["stamptypeB"].newValue == true){ stamptypeB = true; }else{ stamptypeB = false; }
	}
	if(changes["stamptypeC"]){
		if(changes["stamptypeC"].newValue == true){ stamptypeC = true; }else{ stamptypeC = false; }
	}
	if(changes["stamptypeD"]){
		if(changes["stamptypeD"].newValue == true){ stamptypeD = true; }else{ stamptypeD = false; }
	}
	if(changes["stamptypeE"]){
		if(changes["stamptypeE"].newValue == true){ stamptypeE = true; }else{ stamptypeE = false; }
	}
	if(changes["lightcolor"]){
		if(changes["lightcolor"].newValue){ lightcolor = changes["lightcolor"].newValue; chrome.action.setBadgeBackgroundColor({color: changes["lightcolor"].newValue}); }
	}
	if(changes["twelfh"]){
		if(changes["twelfh"].newValue == true){ twelfh = true; }else{ twelfh = false; }
	}
	if(changes["clockbck"]){
		if(changes["clockbck"].newValue == true){ clockbck = true; }else{ clockbck = false; }
	}
	if(changes["colorhours"]){
		if(changes["colorhours"].newValue){ colorhours = changes["colorhours"].newValue; }
	}
	if(changes["colorminutes"]){
		if(changes["colorminutes"].newValue){ colorminutes = changes["colorminutes"].newValue; }
	}
	if(changes["clockanalog"]){
		if(changes["clockanalog"].newValue){ clockanalog = true; }else{ clockanalog = false; }
	}
	if(changes["clocktickpoint"]){
		if(changes["clocktickpoint"].newValue){ clocktickpoint = true; }else{ clocktickpoint = false; }
	}
	if(changes["colorbackground"]){
		if(changes["colorbackground"].newValue){ colorbackground = changes["colorbackground"].newValue; }
	}
	if(changes["colordots"]){
		if(changes["colordots"].newValue){ colordots = changes["colordots"].newValue; }
	}
});

init();

chrome.runtime.setUninstallURL(linkuninstall);

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "1.1", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});