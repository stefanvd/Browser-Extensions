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

function $(id) { return document.getElementById(id); }

// Option to save current value
function save_options(){
	var e = $("getfontfamily");
	chrome.storage.sync.set({ "optionskipremember": $('optionskipremember').checked, "color1night": $('color1night').value, "color2night": $('color2night').value, "color3night": $('color3night').value, "color4night": $('color4night').value, "color5night": $('color5night').value, "color6night": $('color6night').value, "color7night": $('color7night').value, "twelfh": $('twelfh').checked, "stamp": $('stamp').checked, "color1": $('color1').value, "color2": $('color2').value, "color3": $('color3').value, "color4": $('color4').value, "color5": $('color5').value, "color6": $('color6').value, "color7": $('color7').value, "badge": $('badge').checked, "nightmode": $('nightmode').checked, "begintime": $('begintime').value, "endtime": $('endtime').value, "getfontfamily": e.options[e.selectedIndex].value, "lightcolor": $('lightcolor').value , "clockbck": $('clockbck').checked, "colorhours": $('colorhours').value, "colorminutes": $('colorminutes').value, "clockanalog": $('clockanalog').checked,"clocktickpoint": $('clocktickpoint').checked,"colorbackground": $('colorbackground').value,"colordots": $('colordots').value,"badgeclock": $('badgeclock').checked,"badgedate": $('badgedate').checked,"badgeweek": $('badgeweek').checked,"badgedatesystema": $('badgedatesystema').checked,"badgedatesystemb": $('badgedatesystemb').checked,"badgemonth": $('badgemonth').checked,"stamptypeA": $('stamptypeA').checked,"stamptypeB": $('stamptypeB').checked,"stamptypeC": $('stamptypeC').checked,"stamptypeD": $('stamptypeD').checked,"textcanvascolor": $('textcanvascolor').value});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['color1','color2','color3','color4','color5','color6','color7','color1night','color2night','color3night','color4night','color5night','color6night','color7night','clockanalog','colorbackground','badgeclock','badgedatesystema','stamptypeA','textcanvascolor'], function(items){
    // find no localstore datetodayengine
	if(items['color1'] == null && items['color2'] == null && items['color3'] == null && items['color4'] == null && items['color5'] == null && items['color6'] == null && items['color7'] == null){firstdefaultvalues['color1'] = "#808080";firstdefaultvalues['color2'] = "#000000";firstdefaultvalues['color3'] = "#808080";firstdefaultvalues['color4'] = "#000000";firstdefaultvalues['color5'] = "#000000";firstdefaultvalues['color6'] = "#808080";firstdefaultvalues['color7'] = "#ffffff"}
    if(items['color1night'] == null && items['color2night'] == null && items['color3night'] == null && items['color4night'] == null && items['color5night'] == null && items['color6night'] == null){firstdefaultvalues['color1night'] = "#0fff58";firstdefaultvalues['color2night'] = "#0fff58";firstdefaultvalues['color3night'] = "#0fff58";firstdefaultvalues['color4night'] = "#0fff58";firstdefaultvalues['color5night'] = "#0fff58";firstdefaultvalues['color6night'] = "#0fff58";;firstdefaultvalues['color6night'] = "#000000"}// find no localstore lightimage
    if(items['clockanalog'] == null){firstdefaultvalues['clockanalog'] = true}
	if(items['colorbackground'] == null){firstdefaultvalues['colorbackground'] = '#F7F8FA'}
	if(items['badgeclock'] == null){firstdefaultvalues['badgeclock'] = true}
	if(items['badgedatesystema'] == null){firstdefaultvalues['badgedatesystema'] = true}
	if(items['stamptypeA'] == null){firstdefaultvalues['stamptypeA'] = true}
	if(items['textcanvascolor'] == null){firstdefaultvalues['textcanvascolor'] = '#000000'}
	// Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
chrome.storage.sync.get(['firstDate','optionskipremember','countremember','color1','color2','color3','color4','color5','color6','color7','twelfh','stamp','color1night','color2night','color3night','color4night','color5night','color6night','color7night','badge','nightmode','begintime','endtime','getfontfamily','lightcolor','clockbck','colorhours','colorminutes','clockanalog','clocktickpoint','colorbackground','colordots','badgeclock','badgedate','badgeweek','badgemonth','badgedatesystema','badgedatesystemb','stamptypeA','stamptypeB','stamptypeC','stamptypeD','textcanvascolor'], function(items){
    if(items['color1']){$('color1').value = items['color1'];}	
	else $('color1').value = "#808080";
	if(items['color2']){$('color2').value = items['color2'];}	
	else $('color2').value = "#000000";
	if(items['color3']){$('color3').value = items['color3'];}	
	else $('color3').value = "#808080";
	if(items['color4']){$('color4').value = items['color4'];}	
	else $('color4').value = "#000000";
	if(items['color5']){$('color5').value = items['color5'];}	
	else $('color5').value = "#000000";
	if(items['color6']){$('color6').value = items['color6'];}	
	else $('color6').value = "#808080";
	if(items['color7']){$('color7').value = items['color7'];}	
	else $('color7').value = "#ffffff";
	if(items['twelfh'] == true)$('twelfh').checked = true;
	if(items['stamp'] == true)$('stamp').checked = true;
	if(items['color1night']){$('color1night').value = items['color1night'];}	
	else $('color1night').value = "#0fff58";
	if(items['color2night']){$('color2night').value = items['color2night'];}	
	else $('color2night').value = "#0fff58";
	if(items['color3night']){$('color3night').value = items['color3night'];}	
	else $('color3night').value = "#0fff58";
	if(items['color4night']){$('color4night').value = items['color4night'];}	
	else $('color4night').value = "#0fff58";
	if(items['color5night']){$('color5night').value = items['color5night'];}
	else $('color5night').value = "#0fff58";
	if(items['color6night']){$('color6night').value = items['color6night'];}
	else $('color6night').value = "#0fff58";
	if(items['color7night']){$('color7night').value = items['color7night'];}
	else $('color7night').value = "#000000";
    if(items['badge'] == true)$('badge').checked = true;
	if(items['nightmode'] == true)$('nightmode').checked = true;
	if(items['begintime']){$('begintime').value = items['begintime'];}
	else {$('begintime').value = "21:00";}
	if(items['endtime']){$('endtime').value = items['endtime'];}
	else {$('endtime').value = "23:45";}
	if(items['getfontfamily']){$('getfontfamily').value = items['getfontfamily'];}
	if(items['optionskipremember'] == true)$('optionskipremember').checked = true;
    if(items['lightcolor']){$('lightcolor').value = items['lightcolor'];}	
	else $('lightcolor').value = "#3cb4fe";
	if(items['clockbck'] == true)$('clockbck').checked = true;
	if(items['colorhours']){$('colorhours').value = items['colorhours'];}	
	else $('colorhours').value = "#3c5886";
	if(items['colorminutes']){$('colorminutes').value = items['colorminutes'];}	
	else $('colorminutes').value = "#3c5886";
	if(items['clockanalog'] == true)$('clockanalog').checked = true;
	if(items['clocktickpoint'] == true)$('clocktickpoint').checked = true;
	if(items['colorbackground']){$('colorbackground').value = items['colorbackground'];}	
	else $('colorbackground').value = "#F7F8FA";
	if(items['colordots']){$('colordots').value = items['colordots'];}	
	else $('colordots').value = "#000000";
	if(items['badgeclock'] == true)$('badgeclock').checked = true;
	if(items['badgedate'] == true)$('badgedate').checked = true;
	if(items['badgeweek'] == true)$('badgeweek').checked = true;
	if(items['badgemonth'] == true)$('badgemonth').checked = true;
	if(items['badgedatesystema'] == true)$('badgedatesystema').checked = true;
	if(items['badgedatesystemb'] == true)$('badgedatesystemb').checked = true;
	if(items['stamptypeA'] == true)$('stamptypeA').checked = true;
	if(items['stamptypeB'] == true)$('stamptypeB').checked = true;
	if(items['stamptypeC'] == true)$('stamptypeC').checked = true;
	if(items['stamptypeD'] == true)$('stamptypeD').checked = true;
	if(items['textcanvascolor']){$('textcanvascolor').value = items['textcanvascolor'];}	
	else $('textcanvascolor').value = "#000000";

// show remember page
var countremember = items['countremember'];
if(!countremember){countremember = 0;}
countremember = parseInt(countremember) + 1;

var firstweek = false;
var currentDate = new Date().getTime();
if(items['firstDate']){
    var datestart = items['firstDate'];
    var dateend = datestart + (7 * 24 * 60 * 60 * 1000);
    if(currentDate>=dateend){firstweek = false;}
    else{firstweek = true;}
}else{
    chrome.storage.sync.set({"firstDate": currentDate});
    firstweek = true;
}

if(firstweek){$('remembershare').style.display = "none";}else{
var d = new Date();
var dayweek = d.getDay();
var dayhour = d.getHours();
if((dayweek == 4 && dayhour >= 16) || (dayweek == 5 && dayhour >= 16)){
    if($('optionskipremember').checked != true){
        $('remembershare').style.display = "block";
    } else {$('remembershare').style.display = "none";}
}
else if(dayweek == 6 || dayweek == 0){
    if($('optionskipremember').checked != true){
        $('remembershare').style.display = "block";
    } else {$('remembershare').style.display = "none";}
} else {
    if($('optionskipremember').checked != true){
        if(countremember >= 4) {$('remembershare').style.display = "block";countremember = 0;}
        else {$('remembershare').style.display = "none";}
    } else {$('remembershare').style.display = "none";}
    chrome.storage.sync.set({"countremember": countremember});
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

  // Date now
		var jan = chrome.i18n.getMessage('jan')
		var feb = chrome.i18n.getMessage('feb')
		var mar = chrome.i18n.getMessage('mar')
		var apr = chrome.i18n.getMessage('apr')
		var may = chrome.i18n.getMessage('may')
		var jun = chrome.i18n.getMessage('jun')
		var jul = chrome.i18n.getMessage('jul')
		var aug = chrome.i18n.getMessage('aug')
		var sep = chrome.i18n.getMessage('sep')
		var oct = chrome.i18n.getMessage('oct')
		var nov = chrome.i18n.getMessage('nov')
		var dec = chrome.i18n.getMessage('dec')

		var sun = chrome.i18n.getMessage('sun')
		var mon = chrome.i18n.getMessage('mon')
		var tue = chrome.i18n.getMessage('tue')
		var wed = chrome.i18n.getMessage('wed')
		var thu = chrome.i18n.getMessage('thu')
		var fri = chrome.i18n.getMessage('fri')
		var sat = chrome.i18n.getMessage('sat')

        var this_weekday_name_array = new Array(sun, mon, tue, wed, thu, fri, sat)	//predefine weekday names
        var this_month_name_array = new Array(jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec)	//predefine month names

        var currentday = new Date()	//get current day-time stamp

        var this_weekday = currentday.getDay()	//extract weekday
        var this_date = currentday.getDate()	//extract day of month
        var this_month = currentday.getMonth()	//extract month
        var this_year = currentday.getYear()	//extract year

        if (this_year < 1000)
            this_year += 1900; //fix Y2K problem

        var currentdate = this_weekday_name_array[this_weekday] + ", " + this_month_name_array[this_month] + " " + this_date + ", " + this_year	//long date string 
		var tic;
       
// Time now (hours + minutes)  
        function startTime()
        {
        var time = new Date();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();

		if (twelfh.checked == true){
	      	  if (h >= 12) {h -= 12; tic = "pm"; }
	      	  else {tic = "am"; }
	      	  if (h == 0) {h = 12;}
	      	  document.getElementById('hours').innerText = h;
	      	  document.getElementById('minutes').innerText = (m<10?'0':'') + m;
	      	  document.getElementById('tic').innerText = tic;
	    }
	    else {document.getElementById('hours').innerText = h;
	          document.getElementById('minutes').innerText = (m<10?'0':'') + m;
	          document.getElementById('tic').innerText = "";
	    }
		
		m = checkTime(m); // (check) Add a zero number if below 10
        s = checkTime(s); // (check) Add a zero number if below 10
        
		// regular colors
		document.getElementById('hours').style.color = $("color1").value;
		document.getElementById('minutes').style.color = $("color2").value;
		document.getElementById('day').style.color = $("color5").value;
		document.getElementById('month').style.color = $("color4").value;
		document.getElementById('daynumber').style.color = $("color3").value;
		document.getElementById('point').style.color = $("color6").value;

		// option stamp
		document.getElementById("titlestampA").innerText = h + ":" + m + document.getElementById('tic').innerText + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year;
		document.getElementById("titlestampB").innerText = h + ":" + m + document.getElementById('tic').innerText + " " + this_weekday_name_array[this_weekday] + " " + this_date + " " + this_month_name_array[this_month] + " " + this_year;
		document.getElementById("titlestampC").innerText = h + ":" + m + document.getElementById('tic').innerText + " " + this_date + "/" + parseInt(this_month+1) + "/" + this_year;
		document.getElementById("titlestampD").innerText = h + ":" + m + document.getElementById('tic').innerText + " " + parseInt(this_month+1) + "/" + this_date + "/" + this_year;

		// auto night
		var now = new Date();var hours = now.getHours();var minutes = now.getMinutes();var gettime = hours + ":" + minutes;
		var gettimesecond = gettime.split(":")[0] * 3600 + gettime.split(":")[1] * 60;

		var time1 = $("begintime").value;var time2 = $("endtime").value;
		var seconds1 = time1.split(":")[0] * 3600 + time1.split(":")[1] * 60;
		var seconds2 = time2.split(":")[0] * 3600 + time2.split(":")[1] * 60;

		// example
		// if begintime set 10:00 but endtime is 18:00
		// then do this
		if(seconds1 <= seconds2){ // default for user
		if((seconds1 <= gettimesecond) && (gettimesecond <= seconds2)){nightdojob();}
		}
		// example
		else if (seconds1 > seconds2){
		var getotherdaypart = 86400; // ... to 24:00 end
		var getothernightpart = 0; // start from 0:00 to seconds2 (example 11:00) 

		if((seconds1 <= gettimesecond) && (gettimesecond <= getotherdaypart)){ // 13 -> 24
		nightdojob();
		} else if((getothernightpart <= gettimesecond) && (gettimesecond <= seconds2)){ // 0 -> 11
		nightdojob();
		}
		}


        t = window.setTimeout(startTime,500);  // refresh
        }

function checkTime(i){if(i<10){i="0" + i;}return i;}

function nightdojob(){
		if(nightmode.checked == true){
			document.getElementById('hours').style.color = $("color1night").value;
			document.getElementById('minutes').style.color = $("color2night").value;
			document.getElementById('day').style.color = $("color5night").value;
			document.getElementById('month').style.color = $("color4night").value;
			document.getElementById('daynumber').style.color = $("color3night").value;
			document.getElementById('point').style.color = $("color6night").value;
		}
}

// clean refresh
tic = null;h = null;m = null;

function test(){   
if (twelfh.checked == true){startTime()}
else{startTime()}

if (nightmode.checked == true){
$("begintime").disabled = false;
$("endtime").disabled = false;
$("confirmtime").disabled = false;
$("color1night").disabled = false;
$("color2night").disabled = false;
$("color3night").disabled = false;
$("color4night").disabled = false;
$("color5night").disabled = false;
}
else{
$("begintime").disabled = true;
$("endtime").disabled = true;
$("confirmtime").disabled = true;
$("color1night").disabled = true;
$("color2night").disabled = true;
$("color3night").disabled = true;
$("color4night").disabled = true;
$("color5night").disabled = true;
}

var e = $("getfontfamily");
document.getElementById('hours').style.fontFamily = e.options[e.selectedIndex].value ;
document.getElementById('minutes').style.fontFamily = e.options[e.selectedIndex].value ;
document.getElementById('tic').style.fontFamily =e.options[e.selectedIndex].value;
document.getElementById('day').style.fontFamily = e.options[e.selectedIndex].value ;
document.getElementById('month').style.fontFamily = e.options[e.selectedIndex].value ;
document.getElementById('daynumber').style.fontFamily =e.options[e.selectedIndex].value;
}

// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
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
function IsExist(extensionId,callback){chrome.runtime.sendMessage(extensionId,{message:"installed"},function(reply){if(reply){callback(true);}else{callback(false);}});}
IsExist(idaa,function(installed){if(!installed){items.push(1)}});
IsExist(idz,function(installed){if(!installed){items.push(2)}});
IsExist(idtotl,function(installed){if(!installed){items.push(3)}});
IsExist(idft,function(installed){if(!installed){items.push(4)}});
IsExist(idpp,function(installed){if(!installed){items.push(5)}});
IsExist(idfs,function(installed){if(!installed){items.push(6)}});
IsExist(iddt,function(installed){if(!installed){items.push(7)}runinstalltest()});

function runinstalltest(){
var numberpick = items[Math.floor(Math.random()*items.length)];
// pick this extension
if(numberpick == 1){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Ambient Aurea");
  $("btnpromoaction").addEventListener('click', function() {window.open(ambientaureaproduct)});  
} else if(numberpick == 2){
  $("promotext").innerText = chrome.i18n.getMessage("promotext", "Zoom");
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
var sharetext = "I highly recommended Date Today. Download and try it yourself! www.stefanvd.net";
var stefanvdurl = datetodayproduct;var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
$("rememberboxrate").addEventListener("click", function() {window.open(writereview);});
$("rememberboxyoutube").addEventListener("click", function() {if($('remyoutube').style.display == "block"){$('remyoutube').style.display = "none";}else{$('remyoutube').style.display = "block";}});
$("rememberboxfacebook").addEventListener("click", function() {if($('remfacebook').style.display == "block"){$('remfacebook').style.display = "none";}else{$('remfacebook').style.display = "block";}});
$("remclosethisdonate").addEventListener("click", function() {$('remclosethisdonate').style.display = "none";$('remdonate').style.display = "none";});

$("shareboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});


// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}
var select = document.querySelectorAll('select');
for (var i = 0; i < select.length; i++) {select[i].addEventListener('change', test);select[i].addEventListener('change', save_options);}

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

$("color1").addEventListener('change', function() {document.getElementById('hours').style.color = '#'+this.color;save_options();});
$("color2").addEventListener('change', function() {document.getElementById('minutes').style.color = '#'+this.color;save_options();});
$("color3").addEventListener('change', function() {document.getElementById('daynumber').style.color = '#'+this.color;save_options();});
$("color4").addEventListener('change', function() {document.getElementById('month').style.color = '#'+this.color;save_options();});
$("color5").addEventListener('change', function() {document.getElementById('day').style.color = '#'+this.color;save_options();});

$('daynumber').innerText = this_date;
$('month').innerText = this_month_name_array[this_month];
$('day').innerText = this_weekday_name_array[this_weekday];

// Download Upgrade
$("fndownload").addEventListener('click', function() {window.open(financetoolbarproduct);});
$("ppdownload").addEventListener('click', function() {window.open(propermenubarproduct);});
$("aadownload").addEventListener('click', function() {window.open(ambientaureaproduct)});
$("totldownload").addEventListener('click', function() {window.open(turnoffthelightsproduct)});
$("fsdownload").addEventListener('click', function() {window.open(fullscreenproduct)});
$("zdownload").addEventListener('click', function() {window.open(zoomproduct)});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4aQO_0CqR8f31hNXK5FXa8e";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport)});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog)});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate)});

// Save time
$("confirmtime").addEventListener('click', function() {save_options();var optiontimetemp = chrome.i18n.getMessage('optiontimesaved');window.alert(optiontimetemp);});

// Reset settings
$("resetdatetoday").addEventListener('click', function() {chrome.storage.sync.clear();location.reload()});

// Review box
$("war").addEventListener('click', function() {window.open(writereview, "_blank");$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version})});

// retina check
if(window.devicePixelRatio >= 2) {
$("loadinglamp").src = "icons/icon16@2x.png";$("loadinglamp").style.width = "16px"; $("loadinglamp").style.height = "16px";
$("welcomelamp").src = "icons/icon16@2x.png";$("welcomelamp").style.width = "16px"; $("welcomelamp").style.height = "16px";
$("rememberlamp").src = "icons/icon16@2x.png";$("rememberlamp").style.width = "16px"; $("rememberlamp").style.height = "16px";
}

});