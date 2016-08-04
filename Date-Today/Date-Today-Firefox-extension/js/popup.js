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
//===============================================

function $(id) { return document.getElementById(id); }

var color1;var color2;var color3;var color4;var color5;var color6;
var twelfh;var begintime;var endtime;
var color1night;var color2night;var color3night;var color4night;var color5night;var color6night;
// Read current value settings
document.addEventListener('DOMContentLoaded', function () {
chrome.storage.local.get(['color1','color2','color3','color4','color5','color6','twelfh','begintime','endtime','nightmode','color1night','color2night','color3night','color4night','color5night','color6night'], function(response){
color1 = response.color1;if(color1 == null)color1 = 'Gray';
color2 = response.color2;if(color2 == null)color2 = 'Black';
color3 = response.color3;if(color3 == null)color3 = 'Gray';
color4 = response.color4;if(color4 == null)color4 = 'Black';
color5 = response.color5;if(color5 == null)color5 = 'Black';
color6 = response.color6;if(color6 == null)color6 = 'Black';
twelfh = response.twelfh;
begintime = response.begintime;if(begintime == null)begintime = "21:00";
endtime = response.endtime;if(endtime == null)endtime = "23:45";
nightmode = response.nightmode;
color1night = response.color1night;if(color1night == null)color1night = '#0fff58';
color2night = response.color2night;if(color2night == null)color2night = '#0fff58';
color3night = response.color3night;if(color3night == null)color3night = '#0fff58';
color4night = response.color4night;if(color4night == null)color4night = '#0fff58';
color5night = response.color5night;if(color5night == null)color5night = '#0fff58';
color6night = response.color6night;if(color6night == null)color6night = '#0fff58';

		var hours = $('hours');
		if(hours){
        hours.setAttribute('id','hours');
        hours.style.width = "100px"; 
        hours.style.height = "100px"; 
        hours.style.left = "6px"; 
        hours.style.top = "1px"; 
        hours.style.position = "absolute";
        hours.style.fontSize = "70pt";
        hours.style.textAlign = "right";
        hours.style.fontFamily = "arial";
        hours.style.color = color1;
        }

		var minutes = $('minutes');
		if(minutes){
        minutes.setAttribute('id','minutes');
        minutes.style.width = "120px"; 
        minutes.style.height = "100px"; 
        minutes.style.left = "128px"; 
        minutes.style.top = "1px"; 
        minutes.style.position = "absolute";
        minutes.style.fontSize = "70pt";
        minutes.style.textAlign = "center";
        minutes.style.fontFamily = "arial";
        minutes.style.color = color2;
        }

		var daynumber = $('daynumber'); 
		if(daynumber){
        daynumber.style.width = "60x"; 
        daynumber.style.height = "45px"; 
        daynumber.style.left = "240px"; 
        daynumber.style.top = "11px";
		daynumber.style.width = "55px"; 
        daynumber.style.position = "absolute";
        daynumber.style.fontSize = "32pt";
        daynumber.style.textAlign = "center";
        daynumber.style.fontFamily = "arial";
        daynumber.style.color = color3;
        }
        
		var month = $('month'); 
		if(month){
        month.style.width = "160px"; 
        month.style.height = "40px"; 
        month.style.left = "300px"; 
        month.style.top = "14px"; 
        month.style.position = "absolute";
        month.style.fontSize = "23pt";
        month.style.textAlign = "";
        month.style.fontFamily = "arial";
        month.style.color = color4;
        }
        
		var day = $('day'); 
		if(day){
        day.style.width = "205px"; 
        day.style.height = "45px"; 
        day.style.left = "245px"; 
        day.style.top = "56px"; 
        day.style.position = "absolute";
        day.style.fontSize = "25pt";
        day.style.textAlign = "";
        day.style.fontFamily = "arial";
        day.style.color = color5;
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

		if (twelfh == true){
	      	  if (h >= 12) {h -= 12; tic = "pm "; }
	      	  else {tic = "am "; }
	      	  if (h == 0) {h = 12;}
	      	  document.getElementById('hours').innerHTML = h;
	      	  document.getElementById('minutes').innerHTML = (m<10?'0':'') + m;
	      	  document.getElementById('tic').innerHTML = tic;
	    }
	    else {document.getElementById('hours').innerHTML = h;
	          document.getElementById('minutes').innerHTML = (m<10?'0':'') + m;
	          document.getElementById('tic').innerHTML = "";
	    }

		m = checkTime(m); // (check) Add a zero number if below 10
        s = checkTime(s); // (check) Add a zero number if below 10
        
		// regular colors
		document.getElementById('hours').style.color = color1;
		document.getElementById('minutes').style.color = color2;
		document.getElementById('day').style.color = color5;
		document.getElementById('month').style.color = color4;
		document.getElementById('daynumber').style.color = color3;
		document.getElementById('point').style.color = color6;
		
		// auto night
		var now = new Date();var hours = now.getHours();var minutes = now.getMinutes();var gettime = hours + ":" + minutes;
		var gettimesecond = gettime.split(":")[0] * 3600 + gettime.split(":")[1] * 60;

		var time1 = begintime;var time2 = endtime;
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
		if(nightmode == true){
            document.body.style.background = "black";
            document.getElementById('tic').style.color = "white";
			document.getElementById('hours').style.color = color1night;
			document.getElementById('minutes').style.color = color2night;
			document.getElementById('day').style.color = color5night;
			document.getElementById('month').style.color = color4night;
			document.getElementById('daynumber').style.color = color3night;
			document.getElementById('point').style.color = color6night;
		}
}

// clean refresh
tic = null;h = null;m = null;

startTime();
$('daynumber').innerText = this_date;
$('month').innerText = this_month_name_array[this_month];
$('day').innerText = this_weekday_name_array[this_weekday];

});
});