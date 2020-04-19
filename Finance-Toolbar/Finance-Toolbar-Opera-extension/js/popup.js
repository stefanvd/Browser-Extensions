//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
Copyright (C) 2018 Stefan vd
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

// prevent right click
document.addEventListener('contextmenu', event => event.preventDefault());

var addbar = null;
var darkmode = null;
var japan = null;
var xminutes = null;
var favoritestock = null;
var favo1 = null;
var favo1b = null;
var favo2 = null;
var favo2b = null;
var favo3 = null;
var favo3b = null;
var favo4 = null;
var favo4b = null;
var getinfovaluestock = null;
var getinfovaluepercent = null;
var getinfovaluemc = null;
var getfontfamily = null;
var getfontsize = null;
var redcolor = null;
var greencolor = null;
var textcolor = null;
var excludedstock = null;
var doublebar = null;
var excludedstockdouble = null;
var fillchange = null;
var fullname = null;
var fullnamearea = null;
var searchbehaviour = null;

function toggleoff(){
  chrome.tabs.query({active: true}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    // Send a request to the content script.
                    chrome.storage.sync.set({ "addbar": false});
                    chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
                    $("turnoff").style.display = "none";
                    $("turnon").style.display = "";
                    }
                }
            );
}
function toggleon(){
  chrome.tabs.query({active: true}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    // Send a request to the content script.
                    chrome.storage.sync.set({ "addbar": true});
                    chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
                    $("turnoff").style.display = "";
                    $("turnon").style.display = "none";
                    }
                }
            );
}
document.addEventListener('DOMContentLoaded', function () {
chrome.storage.sync.get(['addbar','darkmode','japan','xminutes','favoritestock','favo1','favo1b','favo2','favo2b','favo3','favo3b','favo4','favo4b','getinfovaluestock','getinfovaluepercent','getinfovaluemc','getfontfamily','getfontsize','redcolor','greencolor','textcolor','excludedstock','doublebar','excludedstockdouble','fillchange','getfullvaluedata','fullname','fullnamearea','searchbehaviour'], function(items){
darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false
if(items['addbar']){addbar = items['addbar'];}if(!addbar)addbar = false;
// dark mode
if(darkmode == true){
  document.body.className = 'dark';
} else{
  document.body.className = 'light';
}
if(addbar == true){
  $("turnoff").style.display = "";
  $("turnon").style.display = "none";
} else{
  $("turnoff").style.display = "none";
  $("turnon").style.display = "";
}


// create ticker bar
japan = items['japan'];
xminutes = items['xminutes'];if(xminutes == null)xminutes = '60';
favoritestock = items['favoritestock'];if(favoritestock == null)favoritestock = false;
favo1 = items['favo1'];if(favo1 == null)favo1 = 'EUR';
favo1b = items['favo1b'];if(favo1b == null)favo1b = 'USD';
favo2 = items['favo2'];if(favo2 == null)favo2 = 'JPY';
favo2b = items['favo2b'];if(favo2b == null)favo2b = 'USD';
favo3 = items['favo3'];if(favo3 == null)favo3 = 'GBP';
favo3b = items['favo3b'];if(favo3b == null)favo3b = 'USD';
favo4 = items['favo4'];if(favo4 == null)favo4 = 'BTC';
favo4b = items['favo4b'];if(favo4b == null)favo4b = 'USD';
getinfovaluestock = items['getinfovaluestock'];if(getinfovaluestock == null)getinfovaluestock = false;
getinfovaluepercent = items['getinfovaluepercent'];if(getinfovaluepercent == null)getinfovaluepercent = true;
getinfovaluemc = items['getinfovaluemc'];if(getinfovaluemc == null)getinfovaluemc = false;
getfontfamily = items['getfontfamily'];if(getfontfamily == null)getfontfamily = 'jd_lcd_roundedregular';
getfontsize = items['getfontsize'];if(getfontsize == null)getfontsize = '27';
redcolor = items['redcolor'];if(redcolor == null)redcolor = '#f00000';
greencolor = items['greencolor'];if(greencolor == null)greencolor = '#008000';
textcolor = items['textcolor'];if(textcolor == null)textcolor = '#ffffff';
excludedstock = items['excludedstock'];if(excludedstock == null)excludedstock = JSON.stringify({'AAPL': true,'DIA': true,'GOOG': true,'SPY': true,'GOLD': true,'TSLA': true,'PBFX': true,'GE': true,'FB': true,'MSFT': true});
doublebar = items['doublebar'];if(doublebar == null)doublebar = false;
excludedstockdouble = items['excludedstockdouble'];if(excludedstockdouble == null)excludedstockdouble = JSON.stringify({});
fillchange = items['fillchange'];if(fillchange == null)fillchange = false;
getfullvaluedata = items['getfullvaluedata'];if(getfullvaluedata == null)getfullvaluedata = false;
fullname = items['fullname'];if(fullname == null)fullname = false;
fullnamearea = items['fullnamearea'];if(fullnamearea == null)fullnamearea = '^DJI=Dow Jones Industrial Average';
searchbehaviour = items['searchbehaviour'];if(searchbehaviour == null)searchbehaviour = 'Google';

var thesearchurl;var thesearchurlcurrency;
if(searchbehaviour == "Google"){
  thesearchurl = "https://www.google.com/search?site=finance&tbm=fin&q=";
  thesearchurlcurrency = "https://www.google.com/search?q=";
}else if(searchbehaviour == "Yahoo"){
  thesearchurl = "https://finance.yahoo.com/quote/";
  thesearchurlcurrency = "https://finance.yahoo.com/quote/";
}

if(fillchange == true){
	var fncss = '#stefanvdfinance #stefanvdfinancemarquee .moveeffect,#stefanvdfinancetwo #stefanvdfinancemarqueetwo .moveeffect{overflow-x:hidden!important;width:100%!important}  #stefanvdfinancefavo .green{background:'+greencolor+'!important;color:white!important} #stefanvdfinancemarquee .green a, #stefanvdfinancemarqueetwo .green a{background:'+greencolor+'!important;border-radius:2px!important;padding:0px 3px!important;color:white!important} #stefanvdfinancefavo .red{background:'+redcolor+'!important;color:white!important} #stefanvdfinancemarquee .red a,#stefanvdfinancemarqueetwo .red a{background:'+redcolor+'!important;border-radius:2px!important;padding:0px 3px!important;color:white!important}}}';
}else{
	var fncss = '#stefanvdfinance #stefanvdfinancemarquee .moveeffect,#stefanvdfinancetwo #stefanvdfinancemarqueetwo .moveeffect{overflow-x:hidden!important;width:100%!important} #stefanvdfinance .green,#stefanvdfinancetwo .green{color:'+greencolor+'!important} #stefanvdfinancemarquee .green a, #stefanvdfinancemarqueetwo .green a{color:'+greencolor+'!important} #stefanvdfinance .red, #stefanvdfinancetwo .red{color:'+redcolor+'!important} #stefanvdfinancemarquee .red a,#stefanvdfinancemarqueetwo .red a{color:'+redcolor+'!important}}}';	
}

if($("fnstyle")){
$("fnstyle").innerText = fncss;
}else{
var style = document.createElement('style');
style.type = 'text/css';
style.setAttribute('id','fnstyle');
style.innerText = fncss;
document.body.appendChild(style);
}

var element = "change";
var ask = "latestPrice";
if(getinfovaluestock == true){element = "change";}
else if(getinfovaluepercent == true){element = "changePercent";}
else if(getinfovaluemc == true){element = "marketCap";}
else if(getfullvaluedata == true){element = "getfullvaluedata";}

// create marquee
var newframe = document.createElement("div");
newframe.setAttribute('id','stefanvdfinance');
document.getElementById("tickerbar").appendChild(newframe);

if(favoritestock == true){
var newstockfavo = document.createElement("div");
newstockfavo.setAttribute('id','stefanvdfinancefavo');
newframe.appendChild(newstockfavo);	


var newstockfavo1text = document.createElement('div');
newstockfavo1text.style.display = "inline-block";
//newstockfavo1text.style.width = "120px";
newstockfavo1text.style.verticalAlign = "top";
newstockfavo1text.style.marginTop = "1px";
newstockfavo1text.textContent = favo1 + "-" + favo1b;
newstockfavo1text.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo1+favo1b + '','_blank');
});
newstockfavo.appendChild(newstockfavo1text);
var newstockfavo1img = document.createElement('span');
newstockfavo1img.setAttribute('id','currency'+favo1+favo1b);
newstockfavo1img.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo1+favo1b + '','_blank');
});
newstockfavo1img.style.display = "inline-block";
newstockfavo1img.style.marginLeft = "4px";
newstockfavo1img.textContent = "";
newstockfavo1text.appendChild(newstockfavo1img);
var newstockfavo1diff = document.createElement('span');
newstockfavo1diff.setAttribute('id','diff'+favo1+favo1b);
newstockfavo1diff.style.display = "inline-block";
newstockfavo1diff.style.marginLeft = "4px";
newstockfavo1text.appendChild(newstockfavo1diff);
currencyupdaterequest(favo1,favo1b);
window.setInterval( function() { currencyupdaterequest(favo1,favo1b); }, xminutes * 1000 );

var newstockfavo2text = document.createElement('div');
newstockfavo2text.style.display = "inline-block";
//newstockfavo2text.style.width = "120px";
newstockfavo2text.style.verticalAlign = "top";
newstockfavo2text.style.marginTop = "1px";
newstockfavo2text.textContent = favo2 + "-" + favo2b;
newstockfavo2text.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo2+favo2b + '','_blank');
});
newstockfavo.appendChild(newstockfavo2text);
var newstockfavo2img = document.createElement('span');
newstockfavo2img.setAttribute('id','currency'+favo2+favo2b);
newstockfavo2img.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo2+favo2b + '','_blank');
});
newstockfavo2img.style.display = "inline-block";
newstockfavo2img.style.marginLeft = "4px";
newstockfavo2img.textContent = "";
newstockfavo2text.appendChild(newstockfavo2img);
var newstockfavo2diff = document.createElement('span');
newstockfavo2diff.setAttribute('id','diff'+favo2+favo2b);
newstockfavo2diff.style.display = "inline-block";
newstockfavo2text.appendChild(newstockfavo2diff);
currencyupdaterequest(favo2,favo2b);
window.setInterval( function() { currencyupdaterequest(favo2,favo2b); }, xminutes * 1000 );

var newstockfavo3text = document.createElement('div');
newstockfavo3text.style.display = "inline-block";
//newstockfavo3text.style.width = "120px";
newstockfavo3text.style.verticalAlign = "top";
newstockfavo3text.style.marginTop = "1px";
newstockfavo3text.textContent = favo3 + "-" + favo3b;
newstockfavo3text.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo3+favo3b + '','_blank');
});
newstockfavo.appendChild(newstockfavo3text);
var newstockfavo3img = document.createElement('span');
newstockfavo3img.setAttribute('id','currency'+favo3+favo3b);
newstockfavo3img.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo3+favo3b + '','_blank');
});
newstockfavo3img.style.display = "inline-block";
newstockfavo3img.style.marginLeft = "4px";
newstockfavo3img.textContent = "";
newstockfavo3text.appendChild(newstockfavo3img);
var newstockfavo3diff = document.createElement('span');
newstockfavo3diff.setAttribute('id','diff'+favo3+favo3b);
newstockfavo3diff.style.display = "inline-block";
newstockfavo3text.appendChild(newstockfavo3diff);
currencyupdaterequest(favo3,favo3b);
window.setInterval( function() { currencyupdaterequest(favo3,favo3b); }, xminutes * 1000 );

var newstockfavo4text = document.createElement('div');
newstockfavo4text.style.display = "inline-block";
//newstockfavo4text.style.width = "120px";
newstockfavo4text.style.verticalAlign = "top";
newstockfavo4text.style.marginTop = "1px";
newstockfavo4text.textContent = favo4 + "-" + favo4b;
newstockfavo4text.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo4+favo4b + '','_blank');
});
newstockfavo.appendChild(newstockfavo4text);
var newstockfavo4img = document.createElement('span');
newstockfavo4img.setAttribute('id','currency'+favo4+favo4b);
newstockfavo4img.addEventListener("click", function(){
window.open(thesearchurlcurrency + favo4+favo4b + '','_blank');
});
newstockfavo4img.style.display = "inline-block";
newstockfavo4img.style.marginLeft = "4px";
newstockfavo4img.textContent = "";
newstockfavo4text.appendChild(newstockfavo4img);
var newstockfavo4diff = document.createElement('span');
newstockfavo4diff.setAttribute('id','diff'+favo4+favo4b);
newstockfavo4diff.style.display = "inline-block";
newstockfavo4diff.style.marginLeft = "4px";
newstockfavo4text.appendChild(newstockfavo4diff);
currencyupdaterequest(favo4,favo4b);
window.setInterval( function() { currencyupdaterequest(favo4,favo4b); }, xminutes * 1000 );
}


function currencyupdaterequest(favo,favob){
  var z = favo;
  var x = favob;

  chrome.runtime.sendMessage({name: "currvalue", currencyparta: z, currencypartb: x}, function(response) {
    var stockopen = response.thatcurr;
    var diffvalue = response.thatcurrchange;

    var linkfdif = document.getElementById("diff"+z+x);
    if(linkfdif) {
      linkfdif.textContent = diffvalue;
    }
    
    if(japan == true){
    // give color span
    // red
    if(diffvalue.substring(0, 1) == '-') { document.getElementById("diff"+z+x+"").className = "green"; }
    // green
    else if(diffvalue.substring(0, 1) == '+') { document.getElementById("diff"+z+x+"").className = "red"; }
    // white
    else { 
      document.getElementById("diff"+z+x+"").className = "red";
    }
    }
    else {
    // give color span
    // red
    if(diffvalue.substring(0, 1) == '-') { document.getElementById("diff"+z+x+"").className = "red"; }
    // green
    else if(diffvalue.substring(0, 1) == '+') { document.getElementById("diff"+z+x+"").className = "green"; }
    // white
    else {
      document.getElementById("diff"+z+x+"").className = "green";
    }
    }

    var linkfva = document.getElementById("currency"+z+x);
    if(linkfva) {
      linkfva.textContent = stockopen;
    }

    });
}

var fontsize = getfontsize;
var newbar = document.createElement("div");
newbar.setAttribute('class', "bar");
newframe.appendChild(newbar);

var newmaqinframe = document.createElement("div");
newmaqinframe.setAttribute('id', "stefanvdfinancemarquee");
newmaqinframe.style.fontFamily = getfontfamily;
newmaqinframe.style.fontSize = fontsize + "px";
newmaqinframe.addEventListener("mouseover", function() {}, false);
newmaqinframe.addEventListener("mouseout", function() {}, false);
newbar.appendChild(newmaqinframe);

var newfinframe = document.createElement("div");
newfinframe.setAttribute('class', "moveeffect");
newmaqinframe.appendChild(newfinframe);


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
newfinitembox.style.fontSize = fontsize + "px";
newfinframe.appendChild(newfinitembox);			
var newfinitemboxa = document.createElement('a');
newfinitemboxa.setAttribute('href',thesearchurl + nameoutput + '');
newfinitemboxa.setAttribute('target','_blank');
newfinitemboxa.style.fontFamily = getfontfamily;
newfinitemboxa.style.fontSize = fontsize + "px";
newfinitembox.appendChild(newfinitemboxa);			
  var newfinitemboxatext = document.createTextNode(nameoutput);
  newfinitemboxa.setAttribute('class','stockname');
  newfinitemboxa.appendChild(newfinitemboxatext);
// span	
  newfinitemask = document.createElement("span");
newfinitemask.style.fontFamily = getfontfamily;
newfinitemask.style.fontSize = fontsize + "px";
newfinitemask.setAttribute('id',nameoutput + ask);
newfinitembox.appendChild(newfinitemask);			
// span
  newfinitem = document.createElement("span");
newfinitem.style.fontFamily = getfontfamily;
newfinitem.style.fontSize = fontsize + "px";
newfinitem.setAttribute('id',nameoutput + element);
newfinitembox.appendChild(newfinitem);
getinformation(nameoutput, element, ask);
setRefresh(nameoutput, element, ask);
}
}

function setRefresh(nameoutput, element, ask) {
window.setInterval(function(){
getinformation(nameoutput, element, ask);
}, 1 * xminutes * 1000);
}

function getinformation(company, element, ask){
var a = company;
var b = element;
var c = ask;

var atext = "";
var ctext = "";
//---
    chrome.runtime.sendMessage({name: "barvalue", type:"oldprice", stock: a}, function(response) {
      if(undefined == response){}else{
      var stockclose = response.thatask;
      var oldstockclose = response.thatoldprice;
      var marketcap = response.thatmarketcap;
//---
      ctext = stockclose;
      ctext = parseFloat(Math.round(ctext * 100) / 100).toFixed(2); // 2 numbers after the comma
      var tempac = document.getElementById(""+a+c+"");
      var linkc = document.getElementById("Alink" + a);
      if(linkc) { linkc.textContent = ctext; } else {
      var tempaclink = document.createElement('a');
      tempaclink.setAttribute('id','Alink' + a);
      tempaclink.style.fontFamily = getfontfamily;
      tempaclink.style.fontSize = fontsize + "px";
      tempaclink.setAttribute('href',thesearchurl + a + '');
      tempaclink.setAttribute('target','_blank');
      tempac.appendChild(tempaclink);
        var tempaclinktext = document.createTextNode(ctext);
        tempaclink.appendChild(tempaclinktext);
      }
    
      var stockchange = stockclose - oldstockclose;
            
      //-- correct format
      if(element == "change"){
        atext = stockchange;
        atext = parseFloat(Math.round(atext * 100) / 100).toFixed(2); // 2 numbers after the comma

        // if no negative value, add the plus character
        if(atext.substring(0, 1) == '-') {}
        else if(atext.substring(0, 1) == '-') {}
        else{ atext = "+"+atext; }
      }
      else if(element == "changePercent"){
        atext = (stockchange/oldstockclose)*100;
        atext = parseFloat(Math.round(atext * 100) / 100).toFixed(2); // 2 numbers after the comma
        atext = atext +"%";

        // if no negative value, add the plus character
        if(atext.substring(0, 1) == '-') {}
        else if(atext.substring(0, 1) == '-') {}
        else{ atext = "+"+atext; }
      }
      else if(element == "getfullvaluedata"){
        atextparta = stockchange;
        atextparta = parseFloat(Math.round(atextparta * 100) / 100).toFixed(2); // 2 numbers after the comma

        // if no negative value, add the plus character
        if(atextparta.substring(0, 1) == '-') {}
        else if(atextparta.substring(0, 1) == '-') {}
        else{ atextparta = "+"+atextparta; }

        atextpartb = (stockchange/oldstockclose)*100;
        atextpartb = parseFloat(Math.round(atextpartb * 100) / 100).toFixed(2); // 2 numbers after the comma
        atextpartb = atextpartb +"%";

        // if no negative value, add the plus character
        if(atextpartb.substring(0, 1) == '-') {}
        else if(atextpartb.substring(0, 1) == '-') {}
        else{ atextpartb = "+"+atextpartb; }
        atextpartb = "("+atextpartb+")";

        atext = atextparta + " " + atextpartb;
      }
      else if(element == "marketCap"){
        try {
          var marketcapvalue = marketcap;
          atext = marketcapvalue;
        }
        catch(e){
          atext = "";
        }
        //create item in the toolbar
        var tempab = document.getElementById(""+a+b+"");
        var linkb = document.getElementById("Blink" + a);
        if(linkb) { linkb.textContent = atext; } else {
          var tempablink = document.createElement('a');
          tempablink.setAttribute('id','Blink' + a);
          tempablink.style.fontFamily = getfontfamily;
          tempablink.style.fontSize = fontsize + "px";
          tempablink.setAttribute('href',thesearchurl + a + '');
          tempablink.setAttribute('target','_blank');
          tempab.appendChild(tempablink);
            var tempablinktext = document.createTextNode(atext);
            tempablink.appendChild(tempablinktext);
        }
      }
      //---
            
      var tempab = document.getElementById(""+a+b+"");
      var linkb = document.getElementById("Blink" + a);
      if(linkb) { linkb.textContent = atext; } else {
        var tempablink = document.createElement('a');
        tempablink.setAttribute('id','Blink' + a);
        tempablink.style.fontFamily = getfontfamily;
        tempablink.style.fontSize = fontsize + "px";
        tempablink.setAttribute('href',thesearchurl + a + '');
        tempablink.setAttribute('target','_blank');
        tempab.appendChild(tempablink);			
          var tempablinktext = document.createTextNode(atext);
          tempablink.appendChild(tempablinktext);
      }


      if(japan == true){
      // give color span
      // red
      if(atext.substring(0, 1) == '-') { document.getElementById(""+a+b+"").className = "green"; }
      // green
      else if(atext.substring(0, 1) == '+') { document.getElementById(""+a+b+"").className = "red"; }
      // white
      else {
        document.getElementById(""+a+b+"").className = "red";
      }
      }
      else {
      // give color span
      // red
      if(atext.substring(0, 1) == '-') { document.getElementById(""+a+b+"").className = "red"; }
      // green
      else if(atext.substring(0, 1) == '+') { document.getElementById(""+a+b+"").className = "green"; }
      // white
      else {
        document.getElementById(""+a+b+"").className = "green";
      }
      }
    }
  });
}

if(doublebar == true){

var newframe = document.createElement("div");
newframe.setAttribute('id','stefanvdfinancetwo');
document.getElementById("tickerbar").appendChild(newframe);

var newbar = document.createElement("div");
newbar.setAttribute('class', "bar");
newbar.style.left = "0px";
newframe.appendChild(newbar);

var newmaqinframe = document.createElement("div");
newmaqinframe.setAttribute('id', "stefanvdfinancemarqueetwo");
newbar.style.left = "20px";
newmaqinframe.style.fontFamily = getfontfamily;
newmaqinframe.style.fontSize = fontsize + "px";
newmaqinframe.addEventListener("mouseover", function() {}, false);
newmaqinframe.addEventListener("mouseout", function() {}, false);
newbar.appendChild(newmaqinframe);

var newfinframe = document.createElement("div");
newfinframe.setAttribute('class', "moveeffect");
newmaqinframe.appendChild(newfinframe);

var newfinitembox;
var newfinitem;
var newfinitemask;

if(typeof excludedstockdouble == "string") {
excludedstockdouble = JSON.parse(excludedstockdouble);
var buf = [];
for(var domain in excludedstockdouble)
buf.push(domain);
for(var i = 0; i < buf.length; i++) {
// check if not ^
var str = buf[i]; var nameoutput;
if (str.indexOf("^")){ nameoutput = str.replace("^","%5E"); }
else { nameoutput = buf[i]; }

// box
newfinitembox = document.createElement("div");
newfinitembox.style.fontFamily = getfontfamily;
newfinitembox.style.fontSize = fontsize + "px";
newfinframe.appendChild(newfinitembox);			
var newfinitemboxa = document.createElement('a');
newfinitemboxa.setAttribute('href',thesearchurl + nameoutput + '');
newfinitemboxa.setAttribute('target','_blank');
newfinitemboxa.style.fontFamily = getfontfamily;
newfinitemboxa.style.fontSize = fontsize + "px";
newfinitembox.appendChild(newfinitemboxa);			
var newfinitemboxatext = document.createTextNode(nameoutput);
newfinitemboxa.appendChild(newfinitemboxatext);
// span	
newfinitemask = document.createElement("span");
newfinitemask.style.fontFamily = getfontfamily;
newfinitemask.style.fontSize = fontsize + "px";
newfinitemask.setAttribute('id',nameoutput + ask);
newfinitembox.appendChild(newfinitemask);			
// span
newfinitem = document.createElement("span");
newfinitem.style.fontFamily = getfontfamily;
newfinitem.style.fontSize = fontsize + "px";
newfinitem.setAttribute('id',nameoutput + element);
newfinitembox.appendChild(newfinitem);
getinformation(nameoutput, element, ask);
setRefresh(nameoutput, element, ask);
}
}


}

// change stock name to custom name
if(fullname == true){
	var lines = fullnamearea.split('\n');
	for (var j = 0; j < lines.length; j++) {
		if(lines[j].indexOf("=")){
			var str = lines[j];
			var res = str.split("=");

			var elements = document.querySelectorAll('.stockname');
			for ( var i=elements.length; i--; ) {
				try{
				elements[i].textContent = elements[i].textContent.replace(res[0], res[1]);
				}catch(e){}
			}

		}
	}
}

// end create ticker bar
});

// Toggle on
$("turnoff").addEventListener('click', function() {toggleoff()});
// Toggle off
$("turnon").addEventListener('click', function() {toggleon()});

$("opendonate").addEventListener('click', function() {window.open(donatewebsite)});
$("openrate").addEventListener('click', function() {window.open(writereview)});
$("openoptions").addEventListener('click', function() {window.open(chrome.extension.getURL('options.html'))});

$("opensupport").addEventListener('click', function() {window.open(linksupport)});
$("openwelcomeguide").addEventListener('click', function() {window.open(linkguide)});
$("openyoutube").addEventListener('click', function() {window.open(linkyoutube)});

var currentencodeurl = encodeURIComponent(financetoolbarproduct);
$("opengoogleplus").addEventListener('click', function() {window.open('https://plus.google.com/share?ur\l=' + currentencodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no')});
$("openfacebook").addEventListener('click', function() {window.open("https://www.facebook.com/sharer.php?u="+ financetoolbarproduct + "&t=Try this out, I check my stocks with this Finance Toolbar browser extension!", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no')});
$("opentwitter").addEventListener('click', function() {window.open("https://twitter.com/share?url=" + currentencodeurl + "&text=Try this out, I check my stocks with this Finance Toolbar browser extension!", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no')});

});