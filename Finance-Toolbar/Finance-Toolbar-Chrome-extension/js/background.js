//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
Copyright (C) 2020 Stefan vd
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

chrome.runtime.onMessage.addListener(function request(request,sender,sendResponse){
    if(request.name == "stefanfinance"){
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
            for (var i = 0; i < tabs.length; i++){
                chrome.tabs.sendMessage(tabs[i].id,{action: "addremove"});
            }
        });
    }else if(request.name == "barvalue"){
        var tempab = document.getElementById(""+request.stock+"ask");
        var tempcd = document.getElementById(""+request.stock+"changes");
        var tempef = document.getElementById(""+request.stock+"changesPercentage");
        var tempgh = document.getElementById(""+request.stock+"marketcap");
        // if available that stock
        if(tempab && tempab.textContent != ""){
            //console.log("DEBUG: "+request.stock+" deze stefan: "+tempab.textContent+"  "+tempcd.textContent+ "  "+tempef.textContent);
            sendResponse({thatask: tempab.textContent, thatchanges: tempcd.textContent, thatchangesPercentage: tempef.textContent, thatmarketcap: tempgh.textContent});
        }
    }else if(request.name == "currvalue"){
        var tempwx = document.getElementById("currency"+request.currencyparta+request.currencypartb+"");
        var tempyz = document.getElementById("diff"+request.currencyparta+request.currencypartb+"");
        if(tempwx && tempwx.textContent != ""){
            sendResponse({thatcurr: tempwx.textContent, thatcurrchange: tempyz.textContent});
        }else{
            sendResponse({thatcurr: "0", thatcurrchange: "0"});
        }
    }else if(request.name == "refreshbackground"){
        window.clearInterval(curtotl);

        window.clearInterval(tourrefresh);
        
        //refresh the page
        window.location.reload();
    }
});

// update when refresh on the tab
/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if((tab.url.match(/^http/i))){
            chrome.tabs.query({active: true}, function (tabs){
                for (var i = 0; i < tabs.length; i++){
                    chrome.tabs.sendMessage(tabs[i].id,{action: "addremove"});
                    }
                }
            );
		}
});*/

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
                for (var i = 0; i < tabs.length; i++){
                    chrome.tabs.sendMessage(tabs[i].id,{action: "addremove"});
                    }
                }
            );
});

chrome.commands.onCommand.addListener(function(command){
if(command == "toggle-feature-financetoolbar"){
    chrome.tabs.sendMessage(null,{action: "addremove"});
}
});

// contextMenus
function onClickHandler(info, tab){
if(info.menuItemId == "totlguideemenu"){window.open(linkguide, "_blank");}
else if(info.menuItemId == "totldevelopmenu"){window.open(donatewebsite, "_blank");}
else if(info.menuItemId == "totlratemenu"){window.open(writereview, "_blank");}
else if(info.menuItemId == "totlsharemenu"){window.open(financetoolbarwebsite, "_blank");}
else if(info.menuItemId == "totlshareemail"){window.open("mailto:youremail?subject=Finance Toolbar extension&body=Hé, This is amazing. I just tried today this Finance Toolbar Browser extension"+financetoolbarproduct+"", "_blank");}
else if(info.menuItemId == "totlsharetwitter"){var sfinancetoolbarproductcodeurl = encodeURIComponent("The Best and Amazing Finance Toolbar Browser extension "+financetoolbarproduct+" @financetoolbar");window.open("https://twitter.com/home?status="+sfinancetoolbarproductcodeurl+"", "_blank");}
else if(info.menuItemId == "totlsharefacebook"){window.open("https://www.facebook.com/sharer/sharer.php?u="+financetoolbarproduct, "_blank");}
else if(info.menuItemId == "totlsubscribe"){chrome.tabs.create({url: linkyoutube, active:true})}
}

// check to remove all contextmenus
chrome.contextMenus.removeAll(function(){
//console.log("contextMenus.removeAll callback");
});

// pageaction
var sharemenusharetitle = chrome.i18n.getMessage("sharemenusharetitle");
var sharemenuwelcomeguidetitle = chrome.i18n.getMessage("sharemenuwelcomeguidetitle");
var sharemenutellafriend = chrome.i18n.getMessage("sharemenutellafriend");
var sharemenusendatweet = chrome.i18n.getMessage("sharemenusendatweet");
var sharemenupostonfacebook = chrome.i18n.getMessage("sharemenupostonfacebook");
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");

var contexts = ["browser_action"];
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts": contexts, "icons":{"16": "images/IconGuide.png","32": "images/IconGuide@2x.png"}});
    chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts": contexts, "icons":{"16": "images/IconDonate.png","32": "images/IconDonate@2x.png"}});
    chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts": contexts, "icons":{"16": "images/IconStar.png","32": "images/IconStar@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts": contexts});
    chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts": contexts});
    chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts": contexts});
}

// Create a parent item and two children.
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts": contexts, "icons":{"16": "images/IconShare.png","32": "images/IconShare@2x.png"}});
    var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "contexts": contexts, "parentId": parent, "icons":{"16": "images/IconEmail.png","32": "images/IconEmail@2x.png"}});
    chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});
    var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "contexts": contexts, "parentId": parent, "icons":{"16": "images/IconTwitter.png","32": "images/IconTwitter@2x.png"}});
    var child3 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "contexts": contexts, "parentId": parent, "icons":{"16": "images/IconFacebook.png","32": "images/IconFacebook@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts": contexts});
    var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "contexts": contexts, "parentId": parent});
    chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});
    var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "contexts": contexts, "parentId": parent});
    var child3 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "contexts": contexts, "parentId": parent});
}

chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartor", "contexts": contexts});
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    chrome.contextMenus.create({"title": sharemenusubscribetitle, "type":"normal", "id": "totlsubscribe", "contexts":contexts, "icons":{"16": "images/IconYouTube.png","32": "images/IconYouTube@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    chrome.contextMenus.create({"title": sharemenusubscribetitle, "type":"normal", "id": "totlsubscribe", "contexts":contexts});
}
chrome.contextMenus.onClicked.addListener(onClickHandler);

function refreshtoolbar(){
    chrome.tabs.query({}, function (tabs){
        for (var i = 0; i < tabs.length; ++i){
            chrome.tabs.sendMessage(tabs[i].id,{ action: "toolbarrefresh" });
        }
    });
}

document.addEventListener("DOMContentLoaded", function(event){
    // create the bell
    if(document.getElementById("bell")){
        document.getElementById("bell").setAttribute('src','wallstreetbell.mp3');
        addbell();
    }

    // toolbar data
    backengine();
});

var excludedstock;
var excludedstockdouble;
var unitedbar;
var xminutes;
var doublebar;
var favoritestock;
var favo1;
var favo1b;
var favo2;
var favo2b;
var favo3;
var favo3b;
var favo4;
var favo4b;

var fromfinanceapi;
var apikey;

var curtotl;
function backengine(){
    chrome.storage.sync.get(['excludedstock','excludedstockdouble','xminutes','doublebar','favoritestock','favo1','favo1b','favo2','favo2b','favo3','favo3b','favo4','favo4b','fromfinanceapi','apikey'], function(items){
    excludedstock = items['excludedstock'];if(excludedstock == null)excludedstock = JSON.stringify({'AAPL': true,'DIA': true,'GOOG': true,'SPY': true,'GOLD': true,'TSLA': true,'PBFX': true,'GE': true,'FB': true,'MSFT': true});
    excludedstockdouble = JSON.stringify({});
    xminutes = items['xminutes'];if(xminutes == null)xminutes = '60';
    doublebar = items['doublebar'];if(doublebar == null)doublebar = false;
    favoritestock = items['favoritestock'];if(favoritestock == null)favoritestock = false;
    favo1 = items['favo1'];if(favo1 == null)favo1 = 'EUR';
    favo1b = items['favo1b'];if(favo1b == null)favo1b = 'USD';
    favo2 = items['favo2'];if(favo2 == null)favo2 = 'USD';
    favo2b = items['favo2b'];if(favo2b == null)favo2b = 'JPY';
    favo3 = items['favo3'];if(favo3 == null)favo3 = 'GBP';
    favo3b = items['favo3b'];if(favo3b == null)favo3b = 'USD';
    favo4 = items['favo4'];if(favo4 == null)favo4 = 'USD';
    favo4b = items['favo4b'];if(favo4b == null)favo4b = 'CAD';

    fromfinanceapi = items['fromfinanceapi'];if(fromfinanceapi == null)fromfinanceapi = true;
    apikey = items['apikey'];if(apikey == null)apikey = "";
    if(devmode == true){
        apikey = ""; // no api key needed
    }

    if(favoritestock == true){
        createcurrencybar();
    }

    createstockbar();
});
}

function createcurrencybar(){
    var newstockfavo = document.createElement("div");
    newstockfavo.setAttribute('id','backgroundcurrency');
    document.body.appendChild(newstockfavo);	
        
    var newstockfavo1text = document.createElement('div');
    newstockfavo1text.textContent = favo1+favo1b;
    newstockfavo.appendChild(newstockfavo1text);
    var newstockfavo1img = document.createElement('div');
    newstockfavo1img.setAttribute('id','currency'+favo1+favo1b);
    newstockfavo1img.textContent = "";
    newstockfavo1text.appendChild(newstockfavo1img);
    var newstockfavo1diff = document.createElement('div');
    newstockfavo1diff.setAttribute('id','diff'+favo1+favo1b);
    newstockfavo1text.appendChild(newstockfavo1diff);

    var newstockfavo2text = document.createElement('div');
    newstockfavo2text.textContent = favo2+favo2b;
    newstockfavo2text.addEventListener("click", function(){
        window.open(thesearchurl + favo2+favo2b + '','_blank');
    });
    newstockfavo.appendChild(newstockfavo2text);
    var newstockfavo2img = document.createElement('div');
    newstockfavo2img.setAttribute('id','currency'+favo2+favo2b);
    newstockfavo2img.textContent = "";
    newstockfavo2text.appendChild(newstockfavo2img);
    var newstockfavo2diff = document.createElement('div');
    newstockfavo2diff.setAttribute('id','diff'+favo2+favo2b);
    newstockfavo2text.appendChild(newstockfavo2diff);

    var newstockfavo3text = document.createElement('div');
    newstockfavo3text.textContent = favo3+favo3b;
    newstockfavo.appendChild(newstockfavo3text);
    var newstockfavo3img = document.createElement('div');
    newstockfavo3img.setAttribute('id','currency'+favo3+favo3b);
    newstockfavo3text.appendChild(newstockfavo3img);
    var newstockfavo3diff = document.createElement('div');
    newstockfavo3diff.setAttribute('id','diff'+favo3+favo3b);
    newstockfavo3text.appendChild(newstockfavo3diff);

    var newstockfavo4text = document.createElement('div');
    newstockfavo4text.textContent = favo4+favo4b;
    newstockfavo.appendChild(newstockfavo4text);
    var newstockfavo4img = document.createElement('div');
    newstockfavo4img.setAttribute('id','currency'+favo4+favo4b);
    newstockfavo4img.textContent = "";
    newstockfavo4text.appendChild(newstockfavo4img);
    var newstockfavo4diff = document.createElement('div');
    newstockfavo4diff.setAttribute('id','diff'+favo4+favo4b);
    newstockfavo4text.appendChild(newstockfavo4diff);


    var totalcurrency = favo1+""+favo1b+","+favo2+""+favo2b+","+favo3+""+favo3b+","+favo4+""+favo4b;
    currencyupdaterequest(totalcurrency); // update now
    curtotl = window.setInterval(function (){
        currencyupdaterequest(totalcurrency);
    }, xminutes * 1000);
}

var allstocksline = "";
var buf = [];
var cuf = [];
function createstockbar(){
    var newfinframe = document.createElement("div");
    newfinframe.setAttribute('id', "backgrounddata");
    document.body.appendChild(newfinframe);

    var parta = JSON.parse(excludedstock);
    var partb = JSON.parse(excludedstockdouble);
    if(doublebar == true){
        var obj = Object.assign(parta, partb);
        unitedbar = JSON.stringify(obj);
    }else{
        unitedbar = excludedstock;
    }

    allstocksline = "";// reset this each time
    buf = [];// reset this each time
    if(typeof unitedbar == "string"){
        unitedbar = [JSON.parse(unitedbar)];
        unitedbar.forEach(function(item){
            Object.keys(item).forEach(function(key){
              //console.log("key:" + key + "value:" + item[key]);
              buf.push(key);
            });
        });
        
        // total stock list
        for(var i = 0; i < buf.length; i++){
            // check if not ^
            var str = buf[i];
            if(str.indexOf("^")){ allstocksline += str.replace("^","%5E"); }
            else{ allstocksline += buf[i]; }

            if(i != (buf.length-1)){
                allstocksline += ",";
            }
        }

        //---
        for(var i = 0; i < buf.length; i++){
            // check if not ^
            var str = buf[i]; var nameoutput;
            if(str.indexOf("^")){ nameoutput = str.replace("^","%5E"); }
            else{ nameoutput = buf[i]; }
        
            // box
            newfinitembox = document.createElement("div");
            newfinframe.appendChild(newfinitembox);			
            var newfinitemboxa = document.createElement('span');
            newfinitembox.appendChild(newfinitemboxa);			
            var newfinitemboxatext = document.createTextNode(nameoutput);
            newfinitemboxa.appendChild(newfinitemboxatext);
            // span	
            newfinitemask = document.createElement("span");
            newfinitemask.setAttribute('id',nameoutput + "ask");
            newfinitembox.appendChild(newfinitemask);
            // span
            newfinitem = document.createElement("span");
            newfinitem.setAttribute('id',nameoutput + "changes");
            newfinitembox.appendChild(newfinitem);
            // span
            newfinitem = document.createElement("span");
            newfinitem.setAttribute('id',nameoutput + "changesPercentage");
            newfinitembox.appendChild(newfinitem);
            // span
            newfinitem = document.createElement("span");
            newfinitem.setAttribute('id',nameoutput + "marketcap");
            newfinitembox.appendChild(newfinitem);
        }
        getinformation(allstocksline); //refresh now
        setRefresh(allstocksline); // set auto refresh
    }
}
//-------

function currencyupdaterequest(listfavo){
    var namesArray = listfavo.split(",");
    cuf = [];
    for (var i = 0; i < namesArray.length; i++){
        cuf.push(namesArray[i]);
    }

    var currversion = new XMLHttpRequest();
    currversion.onreadystatechange = function (){
        if(currversion.readyState == 4){
            if(currversion.status == 200){
                var downloadcurrcloudversion = currversion.responseText;

                var mycurrObject = JSON.parse(downloadcurrcloudversion);

                for (var i = 0; i < cuf.length; i++){
                    var currcompletename = cuf[i];

                    var diffvalue;
                    var stockopen = 0;
                    var priceclosed = 0;

                    if(mycurrObject[i] != null){
                        stockopen = mycurrObject[i]["rate"];
                        stockopen = stockopen.toString(); // convert to string elements
                    }

                    if(mycurrObject[i] != null){
                        if(document.getElementById("currency"+currcompletename).textContent != "" && document.getElementById("currency"+currcompletename).textContent != 0 && document.getElementById("currency"+currcompletename).textContent != stockopen){
                            priceclosed = document.getElementById("currency"+currcompletename).textContent;
                            diffvalue = stockopen - priceclosed;
                        }else{
                            priceclosed = 0;
                            diffvalue = 0;
                        }
                        
                        // 5 decimals
                        diffvalue = diffvalue.toFixed(5);
                        diffvalue = diffvalue.toString(); // convert to string elements
                    }

                    var linkfdif = document.getElementById("diff" + currcompletename);
                    if(linkfdif){
                        linkfdif.textContent = diffvalue;
                    }

                    var linkfva = document.getElementById("currency"+currcompletename);
                    if(linkfva){
                        linkfva.textContent = stockopen;
                    }
                }

            }
        }
    }
    try{
        currversion.open("GET", ""+getcurrencyurl+listfavo+getcurrencyapi+apikey+"", true);
        currversion.send(null);
    } catch (err){ }
}

var tourrefresh;
function setRefresh(allstocksline){
    // refresh after 1 minute (=60s)
	tourrefresh = window.setInterval( function(){
		// delay item number seconds
		getinformation(allstocksline);
    }, 1 * xminutes * 1000);
}

function getinformation(allstocksline){
var newgetstocksurl = allstocksline;
var array = newgetstocksurl.split(','); // position of the array

var a = "";
var atext = "";
var ctext = "";

var reqversion = new XMLHttpRequest();
reqversion.onreadystatechange = function(){
	if(reqversion.readyState == 4){
		if(reqversion.status == 200){
            var downloadcloudversion = reqversion.responseText;
            var myObject = JSON.parse(downloadcloudversion);

            // stock by stock
            for(var i = 0; i < buf.length; i++){
                a = buf[i];// stock company name

                if(typeof(myObject[a]) == 'undefined'){
                    var stockclose = 0;
                    var oldchange = 0;
                    var oldchangepercent = 0;
                }else{
                    var stockclose = myObject[a]["quote"]["iexRealtimePrice"];
                    if(stockclose == null){
                        stockclose = myObject[a]["quote"]["previousClose"];
                    }
                    // remove comma
                    //stockclose = stockclose.replace(/,/g, '');
                    //var prevclosed = myObject[a]["quote"]["previousClose"];
                    // remove comma
                    //prevclosed = prevclosed.replace(/,/g, '');
                    
                    //var oldchange = stockclose - prevclosed;
                    var oldchange = parseFloat(Math.round(myObject[a]["quote"]["change"] * 100) / 100).toFixed(2); // 2 numbers after the comma;

                    //var oldchangepercent = oldchange/stockclose*100;
                    //oldchangepercent = parseFloat(Math.round(oldchangepercent * 100) / 100).toFixed(2)+"%"; // 2 numbers after the comma
                    var oldchangepercent = parseFloat(Math.round(myObject[a]["quote"]["changePercent"] * 100 * 100) / 100).toFixed(2)+"%"; // x100 for percent value, and 2 numbers after the comma
                }

                //--
                if(typeof(myObject[a]) == 'undefined'){
                    ctext = chrome.i18n.getMessage("desstocknotsupported");
                }else{
                    ctext = stockclose;
                    ctext = parseFloat(Math.round(ctext * 100) / 100).toFixed(2); // 2 numbers after the comma
                }

                var tempac = document.getElementById(""+a+"ask");
                if(tempac){ tempac.textContent = ctext; }
                var tempab = document.getElementById(""+a+"changes");
                if(tempab){ tempab.textContent = oldchange; }
                var tempad = document.getElementById(""+a+"changesPercentage");
                if(tempad){ tempad.textContent = oldchangepercent; }
                // marketcap
                    try{
                        if(myObject[a]["quote"] != null){
                            var marketcapvalue = myObject[a]["quote"]["marketCap"];
                        } else{
                            var marketcapvalue = 0;
                        }
                        var marktext = marketcapvalue;
                    }
                    catch(e){
                        marktext = "";
                    }

                    if(marktext != "null"){
                        if(marktext.toString().length >10){
                            marktext = parseFloat(Math.round(marktext) / 1000000000000).toFixed(3)+"T";
                        }
                        else if(marktext.toString().length >=6){
                            marktext = parseFloat(Math.round(marktext) / 1000000000).toFixed(3)+"B";
                        }else{
                            marktext = parseFloat(Math.round(marktext)).toFixed(0)+"";
                        }
                    }else{
                        marktext = "N/A";
                    }
                    var tempab = document.getElementById(""+a+"marketcap");
                    if(tempab){ tempab.textContent = marktext; }
                //---
                }
		}
	}
}
try{
    if(fromfinanceapi == true){
    reqversion.open("GET",""+getstockurl+newgetstocksurl+getstockapi+apikey+"", true);
    reqversion.send(null);
    }
} catch(err){}
}

chrome.alarms.onAlarm.addListener(function(alarm){
    chrome.storage.sync.get(['bellmarket'], function(items){
        if(items['bellmarket']){bellmarket = items['bellmarket'];}if(bellmarket == null)bellmarket = false;
        if(bellmarket == true){
            var d = new Date();
            var n = d.getDay();
            // not on sunday = 0
            // not on saterday = 6
            if(n == 1 || n == 2 || n == 3 || n == 4 || n == 5){
                document.getElementById("bell").play();
            }
        }
    });
});

var bellmarket;
var opentime;
var closetime;
function addbell(){
    chrome.storage.sync.get(['bellmarket','opentime','closetime'], function(items){
        if(items['bellmarket']){bellmarket = items['bellmarket'];}if(bellmarket == null)bellmarket = false;
        if(items['opentime']){opentime = items['opentime'];}if(opentime == null)opentime = "09:30";
        if(items['closetime']){closetime = items['closetime'];}if(closetime == null)closetime = "16:00";

        // first remove all the bells
        removebell();

        var resopen = opentime.split(":");
        var whenToRingopen = new Date().setHours(resopen[0],resopen[1],0);
        chrome.alarms.create('theAlarmOpen',{ when: whenToRingopen });

        var resclose = closetime.split(":");
        var whenToRingclose = new Date().setHours(resclose[0],resclose[1],0);
        chrome.alarms.create('theAlarmClose',{ when: whenToRingclose });
    });
}

function removebell(){
    chrome.alarms.getAll(function(alarms){
        //console.log(alarms);
        //console.log(alarms[0]);
        chrome.alarms.clear("theAlarmOpen");
        chrome.alarms.clear("theAlarmClose");
      });
}

function refreshcurrencybar(){
    window.clearInterval(curtotl);
    var checkdatacurr = document.getElementById('backgroundcurrency');
    if(checkdatacurr){
        document.body.removeChild(checkdatacurr);
    }
    createcurrencybar();
    refreshtoolbar();
}

chrome.storage.onChanged.addListener(function(changes){
        if(changes['apikey']){ refreshtoolbar() }
        if(changes['scrollbar']){ refreshtoolbar() }
        if(changes['staticbar']){ refreshtoolbar() }
        if(changes['simultan']){ refreshtoolbar() }
        if(changes['marqueebehaviour']){ if(changes['marqueebehaviour'].newValue){ refreshtoolbar() } }
        if(changes['direction']){ if(changes['direction'].newValue){ refreshtoolbar() } }
        if(changes['scrollamount']){ if(changes['scrollamount'].newValue){ refreshtoolbar() } }
        if(changes['japan']){ refreshtoolbar() }
        if(changes['fillchange']){ refreshtoolbar() }
        if(changes['xminutes']){ if(changes['xminutes'].newValue){ refreshtoolbar() } }
        if(changes['favoritestock']){
            favoritestock = changes['favoritestock'].newValue;
            if(favoritestock == true){
                createcurrencybar();
            }else{
                window.clearInterval(curtotl);
                var checkdatacurr = document.getElementById('backgroundcurrency');
                if(checkdatacurr){
                    document.body.removeChild(checkdatacurr);
                }
            }
            
            refreshtoolbar();
        }
        if(changes['favo1']){ if(changes['favo1'].newValue){ favo1 = changes['favo1'].newValue; refreshcurrencybar(); } }
        if(changes['favo1b']){ if(changes['favo1b'].newValue){ favo1b = changes['favo1b'].newValue; refreshcurrencybar(); } }
        if(changes['favo2']){ if(changes['favo2'].newValue){ favo2 = changes['favo2'].newValue; refreshcurrencybar(); } }
        if(changes['favo2b']){ if(changes['favo2b'].newValue){ favo2b = changes['favo2b'].newValue; refreshcurrencybar(); } }
        if(changes['favo3']){ if(changes['favo3'].newValue){ favo3 = changes['favo3'].newValue; refreshcurrencybar(); } }
        if(changes['favo3b']){ if(changes['favo3b'].newValue){ favo3b = changes['favo3b'].newValue; refreshcurrencybar(); } }
        if(changes['favo4']){ if(changes['favo4'].newValue){ favo4 = changes['favo4'].newValue; refreshcurrencybar(); } }
        if(changes['favo4b']){ if(changes['favo4b'].newValue){ favo4b = changes['favo4b'].newValue; refreshcurrencybar(); } }
        if(changes['getinfovaluestock']){ refreshtoolbar() }
        if(changes['getinfovaluepercent']){ refreshtoolbar() }
        if(changes['getinfovaluemc']){ refreshtoolbar() }
        if(changes['getfontfamily']){ if(changes['getfontfamily'].newValue){ refreshtoolbar() } }
        if(changes['getfontsize']){ if(changes['getfontsize'].newValue){ refreshtoolbar() } }
        if(changes['lightcolor']){ if(changes['lightcolor'].newValue){ refreshtoolbar() } }
        if(changes['redcolor']){ if(changes['redcolor'].newValue){ refreshtoolbar() } }
        if(changes['greencolor']){ if(changes['greencolor'].newValue){ refreshtoolbar() } }
        if(changes['textcolor']){ if(changes['textcolor'].newValue){ refreshtoolbar() } }
        if(changes['bellmarket']){ if(changes['bellmarket'].newValue == true){ addbell() } else{ removebell() } } 
        if(changes['doublebar']){
            doublebar = changes['doublebar'].newValue;
            window.clearInterval(tourrefresh);
            var checkdatabar = document.getElementById('backgrounddata');
            if(checkdatabar){
                document.body.removeChild(checkdatabar);
            }
            createstockbar();
        }
        if(changes['excludedstock']){
            excludedstock = changes['excludedstock'].newValue;
            window.clearInterval(tourrefresh);
            var checkdatabar = document.getElementById('backgrounddata');
            if(checkdatabar){
                document.body.removeChild(checkdatabar);
            }
            createstockbar();
        }
        if(changes['excludedstockdouble']){
            excludedstockdouble = changes['excludedstockdouble'].newValue; 
            window.clearInterval(tourrefresh);
            var checkdatabar = document.getElementById('backgrounddata');
            if(checkdatabar){
                document.body.removeChild(checkdatabar);
            }
            createstockbar();
        }
        if(changes['apikey']){
            apikey = changes['apikey'].newValue;
            window.clearInterval(tourrefresh);
            var checkdatabar = document.getElementById('backgrounddata');
            if(checkdatabar){
                document.body.removeChild(checkdatabar);
            }
            createstockbar();
        }
})

chrome.runtime.setUninstallURL(linkuninstall);

chrome.commands.onCommand.addListener(function(command){
    if(command == "toggle-feature-financetoolbar"){
        var addbar = null;
        chrome.storage.sync.get(['addbar'], function(items){
        if(items['addbar']){addbar = items['addbar'];}if(addbar == null)addbar = false;
         chrome.tabs.query({active: true}, function (tabs){
                for (var i = 0; i < tabs.length; i++){
                    if(addbar == true){
                    chrome.storage.sync.set({ "addbar": false});
                    chrome.tabs.sendMessage(tabs[i].id,{action: "addremove"});
                    }else{
                    chrome.storage.sync.set({ "addbar": true});
                    chrome.tabs.sendMessage(tabs[i].id,{action: "addremove"});
                    }
                    }
                }
            );
        });
    }
});

chrome.storage.sync.get(['firstRun'], function(chromeset){
if((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage});
  var crrinstall = new Date().getTime();
  chrome.storage.sync.set({"firstRun": false, "version": "2.0", "firstDate": crrinstall});  
}
});