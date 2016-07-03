//================================================
/*

Proper Menubar
Add the black menubar below the addresbar. To get easy and fast access to all your Google products.
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

//settings
var opacity = null;var country = null;var addbar = null;var link1a = null;var link2a = null;var link3a = null;var link4a = null;var link5a = null;var link6a = null;var link7a = null;var link8a = null;var link9a = null;var link10a = null;var link11a = null;var link12a = null;var link13a = null;var link14a = null;var link15a = null;var link16a = null;var link17a = null;var link18a = null;var link19a = null;var link20a = null;var link21a = null;var link22a = null;var link23a = null;var link24a = null;var link25a = null;var link26a = null;var allsites = null;var fontcolor = null;var googlesites = null;var propermenuonly = null;var propermenuDomains = null;var search = null;var existingtab = null; var display = null;

function hex2rgb(hex) {
  if (hex[0]=="#") hex=hex.substr(1);
  if (hex.length==3) {
    var temp=hex; hex='';
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
  }
  var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
  return {
    red:   parseInt(triplets[0],16),
    green: parseInt(triplets[1],16),
    blue:  parseInt(triplets[2],16)
  }
}

chrome.storage.sync.get(['country','addbar','backgroundhex','backgroundimagesource','opacity','backgroundcolor','backgroundimage','googleplus','dropshadow','link1a','link2a','link3a','link4a','link5a','link6a','link7a','link8a','link9a','link10a','link11a','link12a','link13a','link14a','link15a','link16a','link17a','link18a','link19a','link20a','link21a','link22a','link23a','link24a','link25a','link26a','allsites','fontcolor','googlesites','propermenuonly','propermenuDomains','search','existingtab','display'], function(items){
country = items['country'];
if(!country){
var userLang = navigator.language || navigator.userLanguage; 
if(userLang == "en-US"){country = "com"}
else if(userLang == "en-UK"){country = "co.uk"}
else if(userLang == "ar-AR"){country = "ar"}
else if(userLang == "de-DE"){country = "de"}
else if(userLang == "ru-RU"){country = "ru"}
else if(userLang == "it-IT"){country = "it"}
else if(userLang == "es-ES"){country = "es"}
else if(userLang == "ja-JP"){country = "co.jp"}
else if(userLang == "pl-PL"){country = "pl"}
else if(userLang == "pt-PT"){country = "pt"}
else if(userLang == "nl-NL"){country = "nl"}
else if(userLang == "nl-BE"){country = "be"}
else if(userLang == "fr-BE"){country = "be"}
else if(userLang == "fr-FR"){country = "fr"}
else {country = "com";}
chrome.storage.sync.set({"country": country});
}
addbar = items['addbar'];if(!addbar)addbar = true;
backgroundhex = items['backgroundhex'];if(!backgroundhex)backgroundhex = '#2d2d2d';
backgroundimagesource = items['backgroundimagesource'];
opacity = items['opacity'];if(!opacity)opacity = '100';
backgroundcolor = items['backgroundcolor'];if(!backgroundcolor)backgroundcolor = true;
backgroundimage = items['backgroundimage'];if(!backgroundimage)backgroundimage = false;
googleplus = items['googleplus'];if(!googleplus)googleplus = '';
dropshadow = items['dropshadow'];if(!dropshadow)dropshadow = true;
link1a = items['link1a'];if(!link1a)link1a = true;
link2a = items['link2a'];if(!link2a)link2a = true;
link4a = items['link4a'];if(!link3a)link3a = true;
link4a = items['link4a'];if(!link4a)link4a = true;
link5a = items['link5a'];if(!link5a)link5a = true;
link6a = items['link6a'];if(!link6a)link6a = true;
link7a = items['link7a'];if(!link7a)link7a = true;
link8a = items['link8a'];if(!link8a)link8a = true;
link9a = items['link9a'];if(!link9a)link9a = true;
link10a = items['link10a'];if(!link10a)link10a = true;
link11a = items['link11a'];if(!link11a)link11a = true;
link12a = items['link12a'];if(!link12a)link12a = true;
link13a = items['link13a'];if(!link13a)link13a = true;
link14a = items['link14a'];if(!link14a)link14a = true;
link15a = items['link15a'];if(!link15a)link15a = true;
link16a = items['link16a'];if(!link16a)link16a = true;
link17a = items['link17a'];if(!link17a)link17a = true;
link18a = items['link18a'];if(!link18a)link18a = true;
link19a = items['link19a'];if(!link19a)link19a = true;
link20a = items['link20a'];if(!link20a)link20a = true;
link21a = items['link21a'];if(!link21a)link21a = true;
link22a = items['link22a'];if(!link22a)link22a = true;
link23a = items['link23a'];if(!link23a)link23a = true;
link24a = items['link24a'];if(!link24a)link24a = true;
link25a = items['link25a'];if(!link25a)link25a = true;
link26a = items['link26a'];if(!link26a)link26a = true;
allsites = items['allsites'];
fontcolor = items['fontcolor'];if(!fontcolor)fontcolor = '#ccc';
googlesites = items['googlesites'];if(!googlesites)googlesites = true;
propermenuonly = items['propermenuonly'];
propermenuDomains = items['propermenuDomains'];
search = items['search'];
existingtab = items['existingtab'];
display = items['display'];if(!display)display = 13;

var keyword = "";
function getkeyword(){
		try{
			if($("gbqfq")){ keyword = $("gbqfq").value;}
		}catch(e){}
}

function positionnavwebpage(){
	if(!window.location.href.match("https://www.google.com/maps")){
		if(window.location.href.match("http://mail.google.com") || window.location.href.match("https://mail.google.com")){
		// use id detect
		$("gb").style.position = "relative";
		$("gb").style.top = '30px';
		$("gba").style.height = '30px';
		} else if(window.location.href.match("http://docs.google.com/spreadsheet/") || window.location.href.match("https://docs.google.com/spreadsheet/")){
		// do nothing
		}
		else {
		document.getElementsByTagName('html')[0].style.position = 'absolute';
		document.getElementsByTagName('html')[0].style.top = '0px';
		document.getElementsByTagName('html')[0].style.left = '0px';
		document.getElementsByTagName('html')[0].style.right = '0px';
		document.getElementsByTagName('html')[0].style.bottom = '0px';
		document.getElementsByTagName('html')[0].style.marginTop = '30px';
		}
	}
	
	if(window.location.href.match("http://www.google.com/maps") || window.location.href.match("https://www.google.com/maps")){
		if($("content-container")){ $("content-container").style.top = '30px'; }
	}
	
	if(window.location.href.match("http://www.youtube.com") || window.location.href.match("https://www.youtube.com")){
		if($("masthead-positioner")){ $("masthead-positioner").style.zIndex = 'auto'; $("masthead-positioner").style.top = '30px'; }
		if($("appbar-guide-menu")){ $("appbar-guide-menu").style.top = '30px'; }
	}
}

function addtoolbar(){
		positionnavwebpage();
		
		var newtoolbar = document.createElement('div');
		newtoolbar.setAttribute('id','stefanvdnavwrappe');
		//newtoolbar.style.overflow='hidden';
		newtoolbar.style.zIndex='2147483647';
		newtoolbar.style.position='fixed';
		newtoolbar.style.top='0px';
		newtoolbar.style.left='0px';
		newtoolbar.style.width='100%';
		newtoolbar.style.height='30px';
		newtoolbar.style.border='0';
		if(backgroundcolor == true){
			var rgb = hex2rgb(backgroundhex);
			newtoolbar.style.background='rgba('+rgb.red+','+ rgb.green+','+rgb.blue+','+(opacity/100)+')';
		}
		if (backgroundimage == true){
			if(backgroundimagesource == ""){newtoolbar.style.background='url('+chrome.extension.getURL('/images/slice1.png')+')';}
			else{newtoolbar.style.background='url('+backgroundimagesource+')';}
		}
		if(dropshadow == true){
			newtoolbar.style.boxShadow = "0px 2px 10px rgba(0,0,0,.2)";
		}

		document.body.insertBefore(newtoolbar, document.body.firstChild);

		var newtoolbarul = document.createElement('div');
		newtoolbarul.setAttribute('id','stefanvdpropermenubarnav');
		newtoolbarul.className='floatleft';
		newtoolbar.appendChild(newtoolbarul);

		var numberitems = 0;
		function createlink(a, b, c){
			// only the first 13 in the bar, rest dropdown menu
			if(numberitems < display){
				var newtoolbarulli = document.createElement('li');
				newtoolbarul.appendChild(newtoolbarulli);

				var newtoolbarullia = document.createElement('a');
				if(existingtab == true){ newtoolbarullia.setAttribute('target','_self'); }
				else{ newtoolbarullia.setAttribute('target','_blank'); }

				newtoolbarullia.setAttribute('id',c);
				newtoolbarullia.style.color = fontcolor;
				newtoolbarullia.innerHTML = a;
				newtoolbarullia.setAttribute('href', b);
				newtoolbarulli.appendChild(newtoolbarullia);
			}else{
					var dropdown = $("stefanvdpropermenubardropdown");
					if(dropdown){}else{
					var newdropdown = document.createElement('li');
					newdropdown.setAttribute('id','stefanvdpropermenubardropdown');
					newtoolbarul.appendChild(newdropdown);

					var newdropdowna = document.createElement('a');
					newdropdowna.setAttribute('id','stefanvdpropermenubarmore');
					newdropdowna.style.color = fontcolor;
					newdropdowna.innerHTML = chrome.i18n.getMessage("linkmore");
					newdropdowna.setAttribute('href', '#');
					newdropdown.appendChild(newdropdowna);

					var rgb = hex2rgb(backgroundhex);
					var newdropdowncontent = document.createElement('div');
					newdropdowncontent.setAttribute('id','stefanvdpropermenubardropdowncontent');
					newdropdown.style.background='rgba('+rgb.red+','+ rgb.green+','+rgb.blue+','+(opacity/100)+')';
					newdropdown.appendChild(newdropdowncontent);
					}
				// create the link
				var newdropdowncontent = $("stefanvdpropermenubardropdowncontent");
				var newdropdowncontentli = document.createElement('li');
				newdropdowncontent.appendChild(newdropdowncontentli);

				var newdropdowncontentlia = document.createElement('a');
				if(existingtab == true){ newdropdowncontentlia.setAttribute('target','_self'); }
				else{ newdropdowncontentlia.setAttribute('target','_blank'); }

				newdropdowncontentlia.setAttribute('id',c);
				newdropdowncontentlia.style.color = fontcolor;
				newdropdowncontentlia.innerHTML = a;
				newdropdowncontentlia.setAttribute('href', b);
				newdropdowncontentli.appendChild(newdropdowncontentlia);
			}
		numberitems = numberitems + 1;
		}

		var i18nlink1a = null;
		if(googleplus != ""){
			try{
			if($("gbi4t")){
				i18nlink1a = $("gbi4t").innerHTML;
			} else {i18nlink1a = "+" + googleplus;}
			}
			catch(e){i18nlink1a = "+" + googleplus;}
		}
		else{var i18nlink1a = chrome.i18n.getMessage("link1a");}
		var i18nlink2a = chrome.i18n.getMessage("link2a");
		var i18nlink3a = chrome.i18n.getMessage("link3a");
		var i18nlink4a = chrome.i18n.getMessage("link4a");
		var i18nlink5a = chrome.i18n.getMessage("link5a");
		var i18nlink6a = chrome.i18n.getMessage("link6a");
		var i18nlink7a = chrome.i18n.getMessage("link7a");
		var i18nlink8a = chrome.i18n.getMessage("link8a");
		var i18nlink9a = chrome.i18n.getMessage("link9a");
		var i18nlink10a = chrome.i18n.getMessage("link10a");
		var i18nlink11a = chrome.i18n.getMessage("link11a");
		var i18nlink12a = chrome.i18n.getMessage("link12a");
		var i18nlink13a = chrome.i18n.getMessage("link13a");
		var i18nlink14a = chrome.i18n.getMessage("link14a");
		var i18nlink15a = chrome.i18n.getMessage("link15a");
		var i18nlink16a = chrome.i18n.getMessage("link16a");
		var i18nlink17a = chrome.i18n.getMessage("link17a");
		var i18nlink18a = chrome.i18n.getMessage("link18a");
		var i18nlink19a = chrome.i18n.getMessage("link19a");
		var i18nlink20a = chrome.i18n.getMessage("link20a");
		var i18nlink21a = chrome.i18n.getMessage("link21a");
		var i18nlink22a = chrome.i18n.getMessage("link22a");
		var i18nlink23a = chrome.i18n.getMessage("link23a");
		var i18nlink24a = chrome.i18n.getMessage("link24a");
		var i18nlink25a = chrome.i18n.getMessage("link25a");
		var i18nlink26a = chrome.i18n.getMessage("link26a");

		if(search == true){
		if(link1a == true){createlink(i18nlink1a,'#','link1s');}
		if(link2a == true){createlink(i18nlink2a,'#','link2s');}
		if(link3a == true){createlink(i18nlink3a,'#','link3s');}
		if(link4a == true){createlink(i18nlink4a,'#','link4s');}
		if(link5a == true){createlink(i18nlink5a,'#','link5s');}
		if(link6a == true){createlink(i18nlink6a,'#','link6s');}
		if(link7a == true){createlink(i18nlink7a,'#','link7s');}
		if(link8a == true){createlink(i18nlink8a,'#','link8s');}
		if(link9a == true){createlink(i18nlink9a,'#','link9s');}
		if(link10a == true){createlink(i18nlink10a,'#','link10s');}
		if(link11a == true){createlink(i18nlink11a,'#','link11s');}
		if(link12a == true){createlink(i18nlink12a,'#','link12s');}
		if(link13a == true){createlink(i18nlink13a,'#','link13s');}
		if(link14a == true){createlink(i18nlink14a,'#','link14s');}
		if(link15a == true){createlink(i18nlink15a,'#','link15s');}
		if(link16a == true){createlink(i18nlink16a,'#','link16s');}
		if(link17a == true){createlink(i18nlink17a,'#','link17s');}
		if(link18a == true){createlink(i18nlink18a,'#','link18s');}
		if(link19a == true){createlink(i18nlink19a,'#','link19s');}
		if(link20a == true){createlink(i18nlink20a,'#','link20s');}
		if(link22a == true){createlink(i18nlink22a,'#','link22s');}
		if(link23a == true){createlink(i18nlink23a,'#','link23s');}
		if(link24a == true){createlink(i18nlink24a,'#','link24s');}
		if(link25a == true){createlink(i18nlink25a,'#','link25s');}
		if(link26a == true){createlink(i18nlink26a,'#','link26s');}
		if(link21a == true){createlink(i18nlink21a,'#','link21s');}
		
		$("link1s").addEventListener('click', function (e) { getkeyword(); window.open('https://plus.google.'+country+''); }, true);
		$("link2s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.google.'+country+'/search?q='+keyword+''); }, true);
		$("link3s").addEventListener('click', function (e) { getkeyword(); window.open('https://images.google.'+country+'/search?q='+keyword+'&source=lnms&tbm=isch'); }, true);
		$("link4s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.google.'+country+'/maps/search/'+keyword); }, true);
		$("link5s").addEventListener('click', function (e) { getkeyword(); window.open('https://play.google.'+country+'/store/search?q='+keyword); }, true);
		$("link6s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.youtube.'+country+'/results?search_query='+keyword); }, true);
		$("link7s").addEventListener('click', function (e) { getkeyword(); window.open('https://news.google.'+country+''); }, true);
		$("link8s").addEventListener('click', function (e) { getkeyword(); window.open('https://mail.google.'+country+''); }, true);
		$("link9s").addEventListener('click', function (e) { getkeyword(); window.open('https://drive.google.'+country+''); }, true);
		$("link10s").addEventListener('click', function (e) { getkeyword(); window.open('https://calendar.google.'+country+''); }, true);
		$("link11s").addEventListener('click', function (e) { getkeyword(); window.open('https://translate.google.'+country+''); }, true);
		$("link12s").addEventListener('click', function (e) { getkeyword(); window.open('https://mobile.google.'+country+''); }, true);
		$("link13s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.google.'+country+'/search?tbm=bks&q='+keyword+''); }, true);
		$("link14s").addEventListener('click', function (e) { getkeyword(); window.open('https://offers.google.'+country+''); }, true);
		$("link15s").addEventListener('click', function (e) { getkeyword(); window.open('https://wallet.google.'+country+''); }, true);
		$("link16s").addEventListener('click', function (e) { getkeyword(); window.open('https://shopping.google.'+country+'search?tbm=shop&q='+keyword+''); }, true);
		$("link17s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.blogger.'+country+''); }, true);
		$("link18s").addEventListener('click', function (e) { getkeyword(); window.open('https://finance.google.'+country+'/finance?q='+keyword); }, true);
		$("link19s").addEventListener('click', function (e) { getkeyword(); window.open('https://photos.google.'+country+''); }, true);
		$("link20s").addEventListener('click', function (e) { getkeyword(); window.open('https://videos.google.'+country+'/search?q='+keyword+'&tbm=vid'); }, true);
		$("link22s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.google.com/voice'); }, true);
		$("link23s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.google.com/contacts/#contacts‎'); }, true);
		$("link24s").addEventListener('click', function (e) { getkeyword(); window.open('https://scholar.google.'+country+''); }, true);
		$("link25s").addEventListener('click', function (e) { getkeyword(); window.open('https://keep.google.com'); }, true);
		$("link26s").addEventListener('click', function (e) { getkeyword(); window.open('https://spaces.google.com'); }, true);
		$("link21s").addEventListener('click', function (e) { getkeyword(); window.open('https://www.google.com/intl/en/about/products'); }, true);
		} else {
		if(link1a == true){createlink(i18nlink1a,'https://plus.google.'+country+'','link1s');}
		if(link2a == true){createlink(i18nlink2a,'https://www.google.'+country+'','link2s');}
		if(link3a == true){createlink(i18nlink3a,'https://images.google.'+country+'','link3s');}
		if(link4a == true){createlink(i18nlink4a,'https://maps.google.'+country+'','link4s');}
		if(link5a == true){createlink(i18nlink5a,'https://play.google.'+country+'','link5s');}
		if(link6a == true){createlink(i18nlink6a,'https://www.youtube.'+country+'','link6s');}
		if(link7a == true){createlink(i18nlink7a,'https://news.google.'+country+'','link7s');}
		if(link8a == true){createlink(i18nlink8a,'https://mail.google.'+country+'','link8s');}
		if(link9a == true){createlink(i18nlink9a,'https://drive.google.'+country+'','link9s');}
		if(link10a == true){createlink(i18nlink10a,'https://calendar.google.'+country+'','link10s');}
		if(link11a == true){createlink(i18nlink11a,'https://translate.google.'+country+'','link11s');}
		if(link12a == true){createlink(i18nlink12a,'https://mobile.google.'+country+'','link12s');}
		if(link13a == true){createlink(i18nlink13a,'https://books.google.'+country+'','link13s');}
		if(link14a == true){createlink(i18nlink14a,'https://offers.google.'+country+'','link14s');}
		if(link15a == true){createlink(i18nlink15a,'https://wallet.google.'+country+'','link15s');}
		if(link16a == true){createlink(i18nlink16a,'https://shopping.google.'+country+'','link16s');}
		if(link17a == true){createlink(i18nlink17a,'https://www.blogger.'+country+'','link17s');}
		if(link18a == true){createlink(i18nlink18a,'https://finance.google.'+country+'','link18s');}
		if(link19a == true){createlink(i18nlink19a,'https://photos.google.'+country+'','link19s');}
		if(link20a == true){createlink(i18nlink20a,'https://videos.google.'+country+'','link20s');}
		if(link22a == true){createlink(i18nlink22a,'https://www.google.com/voice','link22s');}
		if(link23a == true){createlink(i18nlink23a,'https://www.google.com/contacts/#contacts','link23s');}
		if(link24a == true){createlink(i18nlink24a,'https://scholar.google.'+country+'','link24s');}
		if(link25a == true){createlink(i18nlink25a,'https://keep.google.com','link25s');}
		if(link26a == true){createlink(i18nlink26a,'https://spaces.google.com','link26s');}
		if(link21a == true){createlink(i18nlink21a,'https://www.google.com/intl/en/about/products','link21s');}
		}
		
		// spreadsheet Google
		if (window.location.href.match("https://docs.google.com")){		
			//spread
			if($("docs-editor-container")){
			$("docs-editor-container").style.top = "30px";
			$("docs-editor-container").style.position = "relative";
			}
		
			if($("grid-bottom-bar")){
			$("docs-editor").style.bottom = "30px";
			$("docs-editor").style.position = "relative";
			}
		}

		// Google+
		if (window.location.href.match("https://plus.google.com")){
		$("gb").style.marginTop = "30px";

		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('Msd Fge Ide b-K b-K-Xb yld')) {div[i].style.cssText='top: 90px !important;';}}

		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('Dge fOa vld')) {div[i].style.cssText='top: 90px !important;';}}
		
		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('rw Uc ZJ aK')) {div[i].style.cssText='top: 90px !important;';}}
		
		setTimeout(function(){
		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('GSc n7c DJb OVd')) {div[i].style.cssText='top: 134px !important;';}}
		},90000);
		}
}

if(addbar == true){
var check1 = $('stefanvdnavwrappe');
if(check1){}else{

	if(allsites == true){addtoolbar();}
	else if(propermenuonly == true){

		var currenturl = location.protocol + '//' + location.host;

		if(typeof propermenuDomains == "string") {
			propermenuDomains = JSON.parse(propermenuDomains);
			var abuf = [];
			for(var domain in propermenuDomains)
				abuf.push(domain);
				abuf.sort();
			for(var i = 0; i < abuf.length; i++)
			if(currenturl == abuf[i]){addtoolbar();}
		}
	}
	else if(googlesites == true){
		if (window.location.href.match("^http(|s)://([a-z.]*).google.[a-z.]*/")){
		 if(window.location.href.match("http://docs.google.com/spreadsheet/") || window.location.href.match("https://docs.google.com/spreadsheet/") || window.location.href.match("http://docs.google.com/a/") || window.location.href.match("https://docs.google.com/a/")){} // do nothing
		 else{addtoolbar();}
		}
	}
	
	}
}

});