//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
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
var marqueebehaviour = null, direction = null, scrollamount = null, japan = null, xminutes = null, excludedstock = null, favoritestock = null, favo1 = null, favo2 = null, favo3 = null, favo4 = null, getinfovaluestock = null, getinfovaluepercent = null, getinfovaluemc = null, getfontfamily = null, getfontsize = null, lightcolor = null, redcolor = null, greencolor = null, textcolor = null;

// inject CSS for the font family
try{
var totlvideovolume = "@font-face{font-family:'Wallstreet';src:url('"+chrome.runtime.getURL('wallstreet.eot')+"');src:url('"+chrome.runtime.getURL('wallstreet.ttf')+"')format('truetype');font-weight:normal;font-style:normal}@font-face{font-family:'jd_lcd_roundedregular';src:url('"+chrome.runtime.getURL('jdlcdrounded-webfont.eot')+"');src:url('"+chrome.runtime.getURL('jdlcdrounded-webfont.eot')+"?#iefix') format('embedded-opentype'),url('"+chrome.runtime.getURL('jdlcdrounded-webfont.woff')+"')format('woff'),url('"+chrome.runtime.getURL('jdlcdrounded-webfont.ttf')+"')format('truetype'),url('"+chrome.runtime.getURL('jdlcdrounded-webfont.svg')+"#jd_lcd_roundedregular')format('svg');font-weight:normal;font-style:normal}";

if($("cssfinancetoolbar")){
 var elem = document.getElementById("cssfinancetoolbar");
 elem.parentElement.removeChild(elem);
}

var css = document.createElement('style');
css.setAttribute('id','cssfinancetoolbar');
css.type = 'text/css';
css.appendChild(document.createTextNode(totlvideovolume));
document.getElementsByTagName("head")[0].appendChild(css);

}
catch(e) {}

/////////// Option page settings
chrome.storage.local.get(['marqueebehaviour','direction','scrollamount','japan','xminutes','favoritestock','favo1','favo2','favo3','favo4','getinfovaluestock','getinfovaluepercent','getinfovaluemc','getfontfamily','getfontsize','excludedstock','countremember','optionskipremember','lightcolor','redcolor','greencolor','textcolor'], function(items){
		marqueebehaviour = items['marqueebehaviour'];if(marqueebehaviour == null)marqueebehaviour = 'scroll';
		direction = items['direction'];if(direction == null)direction = 'left';
		scrollamount = items['scrollamount'];if(scrollamount == null)scrollamount = '35';
		japan = items['japan'];
		xminutes = items['xminutes'];if(xminutes == null)xminutes = '15';
		favoritestock = items['favoritestock'];
		favo1 = items['favo1'];if(favo1 == null)favo1 = 'EURUSD=X';
		favo2 = items['favo2'];if(favo2 == null)favo2 = 'USDJPY=X';
		favo3 = items['favo3'];if(favo3 == null)favo3 = 'GBPUSD=X';
		favo4 = items['favo4'];if(favo4 == null)favo4 = 'USDCAD=X';
		getinfovaluestock = items['getinfovaluestock'];if(getinfovaluestock == null)getinfovaluestock = false;
		getinfovaluepercent = items['getinfovaluepercent'];if(getinfovaluepercent == null)getinfovaluepercent = true;
		getinfovaluemc = items['getinfovaluemc'];if(getinfovaluemc == null)getinfovaluemc = false;
		getfontfamily = items['getfontfamily'];if(getfontfamily == null)getfontfamily = 'jd_lcd_roundedregular';
		getfontsize = items['getfontsize'];if(getfontsize == null)getfontsize = '27';
		lightcolor = items['lightcolor'];if(lightcolor == null)lightcolor = '#000000';
		redcolor = items['redcolor'];if(redcolor == null)redcolor = '#f00000';
		greencolor = items['greencolor'];if(greencolor == null)greencolor = '#008000';
		textcolor = items['textcolor'];if(textcolor == null)textcolor = '#ffffff';
		lightcolor = items['lightcolor'];if(lightcolor == null)lightcolor = '#000000';
		excludedstock = items['excludedstock'];if(excludedstock == null)excludedstock = JSON.stringify({'GOOG': true,'MSFT': true,'YHOO': true,'AAPL': true,'^DJX': true,'^SPX': true,'Gold': true,'Oil': true,'QQQX': true,'EURUSD=X': true,'^BFX': true});

//--- Begin CSS inject ---
var posbegin = "+100%";
var posend = "-100%";
if(direction == "left"){
posbegin = "+100%";
posend = "-100%";
}else{
posbegin = "-100%";
posend = "+100%";
}
var timecredit = scrollamount;

var beginbeh = "normal";
if(marqueebehaviour == "scroll"){beginbeh = "normal"}
else{beginbeh = "alternate"}

var fncss = '#stefanvdfinance #stefanvdfinancemarquee .moveeffect{animation:marquee '+timecredit+'s linear infinite '+beginbeh+'} #stefanvdfinancemarquee div a{color: '+textcolor+'!important} #stefanvdfinancemarquee .green a{color:'+greencolor+'!important} #stefanvdfinancemarquee .red a{color:'+redcolor+'!important}@keyframes marquee{0%{transform:translateX('+posbegin+')}100%{transform:translateX('+posend+')}}';
if($("fnstyle")){
$("fnstyle").innerText = fncss;
}else{
var style = document.createElement('style');
style.type = 'text/css';
style.setAttribute('id','fnstyle');
style.innerText = fncss;
document.body.appendChild(style);
}
//--- End CSS inject ---

var element = "ChangeRealtime";
var ask = "LastTradePriceOnly";
if(getinfovaluestock == true){element = "ChangeRealtime";}
else if(getinfovaluepercent == true){element = "ChangeinPercent";}
else if(getinfovaluemc == true){element = "MarketCapitalization";}

// create marquee
	    var newframe = document.createElement("div");
	    newframe.setAttribute('id','stefanvdfinance');
		newframe.style.background = lightcolor;
		document.body.insertBefore(newframe, document.body.firstChild);
	
	    var newworld = document.createElement("div");
	    newworld.setAttribute('class','stefanvdfinanceworld');
		newworld.textContent = "";
		newworld.addEventListener("click", function() { document.getElementById("audioplayer").play(); });
		newframe.appendChild(newworld);

	    var newsoundframe = document.createElement("span");
	    newsoundframe.setAttribute('id','stefanvdfinancesound');
		newworld.appendChild(newsoundframe);
		
		var stefanvdfinancesound = document.getElementById("stefanvdfinancesound");
		var audioelement = document.createElement('audio');
		audioelement.setAttribute('id','audioplayer');
		audioelement.setAttribute('src','wallstreetbell.mp3');
		audioelement.setAttribute('hidden','true');
		stefanvdfinancesound.appendChild(audioelement);

		if(favoritestock == true){
		var newstockfavo = document.createElement("div");
		newstockfavo.setAttribute('id','stefanvdfinancefavo');
		newframe.appendChild(newstockfavo);	
		
			
		var newstockfavo1text = document.createTextNode(favo1);
		newstockfavo.appendChild(newstockfavo1text);
		var newstockfavo1img = document.createElement('img');
		newstockfavo1img.setAttribute('src','http://ichart.finance.yahoo.com/h?s=' + favo1 + '');
		newstockfavo1img.setAttribute('alt',favo1);
		newstockfavo1img.setAttribute('border','0');
		newstockfavo1img.setAttribute('height','15px');
		newstockfavo.appendChild(newstockfavo1img);
		var newstockfavo2text = document.createTextNode(favo2);
		newstockfavo.appendChild(newstockfavo2text);
		var newstockfavo2img = document.createElement('img');
		newstockfavo2img.setAttribute('src','http://ichart.finance.yahoo.com/h?s=' + favo2 + '');
		newstockfavo2img.setAttribute('alt',favo1);
		newstockfavo2img.setAttribute('border','0');
		newstockfavo2img.setAttribute('height','15px');
		newstockfavo.appendChild(newstockfavo2img);
		var newstockfavo3text = document.createTextNode(favo3);
		newstockfavo.appendChild(newstockfavo3text);
		var newstockfavo3img = document.createElement('img');
		newstockfavo3img.setAttribute('src','http://ichart.finance.yahoo.com/h?s=' + favo3 + '');
		newstockfavo3img.setAttribute('alt',favo1);
		newstockfavo3img.setAttribute('border','0');
		newstockfavo3img.setAttribute('height','15px');
		newstockfavo.appendChild(newstockfavo3img);
		var newstockfavo4text = document.createTextNode(favo4);
		newstockfavo.appendChild(newstockfavo4text);
		var newstockfavo4img = document.createElement('img');
		newstockfavo4img.setAttribute('src','http://ichart.finance.yahoo.com/h?s=' + favo4 + '');
		newstockfavo4img.setAttribute('alt',favo1);
		newstockfavo4img.setAttribute('border','0');
		newstockfavo4img.setAttribute('height','15px');
		newstockfavo.appendChild(newstockfavo4img);
		}

	    var newspeedleft = document.createElement("div");
	    newspeedleft.setAttribute('class','arrowleft');
		if(favoritestock == true){
		newspeedleft.style.left = "310px";
		} else {
		newspeedleft.style.left = "75px";
		}
		newspeedleft.textContent = "<";
		newspeedleft.addEventListener("mousedown", function() {});
		newspeedleft.addEventListener("mouseup", function() {});		
		newframe.appendChild(newspeedleft);
		
		var newbar = document.createElement("div");
	    newbar.setAttribute('class', "bar");
		if(favoritestock == true){
		newbar.style.left = "332px";
		} else{
		newbar.style.left = "96px";
		}
		newframe.appendChild(newbar);
		
		var newmaqinframe = document.createElement("div");
		newmaqinframe.setAttribute('id', "stefanvdfinancemarquee");
		newmaqinframe.style.fontFamily = getfontfamily;
	    newmaqinframe.style.fontSize = getfontsize + "px";
		newmaqinframe.addEventListener("mouseover", function() {}, false);
		newmaqinframe.addEventListener("mouseout", function() {}, false);
		newbar.appendChild(newmaqinframe);

	    var newfinframe = document.createElement("div");
	    newfinframe.setAttribute('class', "moveeffect");
	   	newmaqinframe.appendChild(newfinframe);
		
	    var newspeedright = document.createElement("div");
	    newspeedright.setAttribute('class','arrowright');
	    newspeedright.style.right = "0px";
		newspeedright.textContent = ">";
		newspeedright.addEventListener("mousedown", function() {}, false);
		newspeedright.addEventListener("mouseup", function() {}, false);
		newframe.appendChild(newspeedright);
		
		var newfinitembox;
		var newfinitem;
		var newfinitemask;

if(typeof excludedstock == "string") {
	excludedstock = JSON.parse(excludedstock);
	var buf = [];
	for(var domain in excludedstock)
		buf.push(domain);
	for(var i = 0; i < buf.length; i++) {
		// check if not ^
		var str = buf[i]; var nameoutput;
		if (str.indexOf("^")){ nameoutput = str.replace("^","%5E"); }
		else { nameoutput = buf[i]; }	
	
		// box
		    newfinitembox = document.createElement("div");
			newfinitembox.style.fontFamily = getfontfamily;
			newfinitembox.style.fontSize = getfontsize + "px";
			newfinframe.appendChild(newfinitembox);			
			var newfinitemboxa = document.createElement('a');
			newfinitemboxa.setAttribute('href','https://finance.yahoo.com/q?s=' + encodeURIComponent(nameoutput) + '');
			newfinitemboxa.setAttribute('target','_blank');
			newfinitemboxa.style.fontFamily = getfontfamily;
			newfinitemboxa.style.fontSize = getfontsize + "px";
			newfinitembox.appendChild(newfinitemboxa);			
				var newfinitemboxatext = document.createTextNode(nameoutput);
				newfinitemboxa.appendChild(newfinitemboxatext);
		// span	
		    newfinitemask = document.createElement("span");
			newfinitemask.style.fontFamily = getfontfamily;
			newfinitemask.style.fontSize = getfontsize + "px";
			newfinitemask.setAttribute('id',nameoutput + ask);
			newfinitembox.appendChild(newfinitemask);			
		// span
		    newfinitem = document.createElement("span");
			newfinitem.style.fontFamily = getfontfamily;
			newfinitem.style.fontSize = getfontsize + "px";
			newfinitem.setAttribute('id',nameoutput + element);
			newfinitembox.appendChild(newfinitem);
			getinformation(nameoutput, element, ask);
	}
}

function getinformation(company, element, ask){
var a = company;
var b = element;
var c = ask;

var atext = "";
var ctext = "";

stockupdaterequest();
function stockupdaterequest() {
var reqversion = new XMLHttpRequest();
reqversion.onreadystatechange = function() {
	if(reqversion.readyState == 4) {
		if(reqversion.status == 200) {
				var downloadcloudversion = reqversion.responseXML;
				var x=downloadcloudversion.getElementsByTagName("quote");
	
				for (i=0;i<x.length;i++)
				{
				try {
				ctext =(x[i].getElementsByTagName(""+c+"")[0].childNodes[0].nodeValue);

				ctext = parseFloat(Math.round(ctext * 100) / 100).toFixed(2); // 2 numbers after the comma
				
				var tempac = document.getElementById(""+a+c+"");
					var linkc = document.getElementById("Alink" + a);
					if(linkc) { linkc.textContent = ctext; } else {
					var tempaclink = document.createElement('a');
					tempaclink.setAttribute('id','Alink' + a);
					tempaclink.style.fontFamily = getfontfamily;
					tempaclink.style.fontSize = getfontsize + "px";
					tempaclink.setAttribute('href','https://finance.yahoo.com/q?s=' + encodeURIComponent(a) + '');
					tempaclink.setAttribute('target','_blank');
					tempac.appendChild(tempaclink);			
						var tempaclinktext = document.createTextNode(ctext);
						tempaclink.appendChild(tempaclinktext);
					}
				} catch(err){
						var reqindia = new XMLHttpRequest();
						reqindia.onreadystatechange = function() {
							if(reqindia.readyState == 4) {
								if(reqindia.status == 200) {
									var downloadindiaversion = reqindia.responseXML;
									var y=downloadindiaversion.getElementsByTagName("field");
									for(var z = 0; z < y.length; z++){
										var current = y[0].childNodes[0].nodeValue;
										if(y[z].getAttribute("name") == "price"){
											ctext = y[z].childNodes[0].nodeValue;
											ctext = parseFloat(Math.round(ctext * 100) / 100).toFixed(2); // 2 numbers after the comma
										}
														var tempac = document.getElementById(""+a+c+"");
														var linkc = document.getElementById("Alink" + a);
														if(linkc) { linkc.textContent = ctext; } else {
														var tempaclink = document.createElement('a');
														tempaclink.setAttribute('id','Alink' + a);
														tempaclink.style.fontFamily = getfontfamily;
														tempaclink.style.fontSize = getfontsize + "px";
														tempaclink.setAttribute('href','https://finance.yahoo.com/q?s=' + encodeURIComponent(a) + '');
														tempaclink.setAttribute('target','_blank');
														tempac.appendChild(tempaclink);			
															var tempaclinktext = document.createTextNode(ctext);
															tempaclink.appendChild(tempaclinktext);
														}
									} 
								}
							}
						}
						reqindia.open("GET","https://finance.yahoo.com/webservice/v1/symbols/"+a+"/quote?format=xml", true);
						reqindia.send(null);

				}
				try {
				atext =(x[i].getElementsByTagName(""+b+"")[0].childNodes[0].nodeValue);
				var tekena = atext.charAt(0);
				atext = atext.slice(1, -1);
				atext = parseFloat(Math.round(atext * 100) / 100).toFixed(2); // 2 numbers after the comma
				atext = tekena + atext +"%";
				
				var tempab = document.getElementById(""+a+b+"");
					var linkb = document.getElementById("Blink" + a);
					if(linkb) { linkb.textContent = atext; } else {
					var tempablink = document.createElement('a');
					tempablink.setAttribute('id','Blink' + a);
					tempablink.style.fontFamily = getfontfamily;
					tempablink.style.fontSize = getfontsize + "px";
					tempablink.setAttribute('href','https://finance.yahoo.com/q?s=' + encodeURIComponent(a) + '');
					tempablink.setAttribute('target','_blank');
					tempab.appendChild(tempablink);			
						var tempablinktext = document.createTextNode(atext);
						tempablink.appendChild(tempablinktext);
					}
				} catch(err){}
				
				
				if(japan == true){
				// give color span
				// red
				if(atext.substring(0, 1) == '-') { document.getElementById(""+a+b+"").className = "green"; }
				// green
				else if(atext.substring(0, 1) == '+') { document.getElementById(""+a+b+"").className = "red"; }
				// white
				else { document.getElementById(""+a+b+"").className = "white"; }
				}
				else {
				// give color span
				// red
				if(atext.substring(0, 1) == '-') { document.getElementById(""+a+b+"").className = "red"; }
				// green
				else if(atext.substring(0, 1) == '+') { document.getElementById(""+a+b+"").className = "green"; }
				// white
				else { document.getElementById(""+a+b+"").className = "white"; }
				}
				
				}
				
		}
	}
}
try {
reqversion.open("GET","https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+a+"%22)&env=store://datatables.org/alltableswithkeys", true);
reqversion.send(null);
} catch(err){}
}

// Reload stock information every X minutes, which will trigger the autoupdate
// if stay on the same page
window.setInterval(stockupdaterequest, xminutes * 1000);
}

});