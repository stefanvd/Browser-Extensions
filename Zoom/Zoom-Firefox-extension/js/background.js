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

var currentURL;var allzoom;var allzoomvalue;var badge;

chrome.runtime.onMessage.addListener(function request(request,sender,sendResponse){
if(request.action == 'getallRatio'){
currentURL = request.website;
chrome.storage.local.get(['allzoom','allzoomvalue','websitezoom','badge','lightcolor','zoomchrome','zoomweb'], function(response){
allzoom = response.allzoom;if(!allzoom)allzoom = false; // default allzoom false
allzoomvalue = response.allzoomvalue;
badge = response.badge;
lightcolor = response.lightcolor;if(!lightcolor)lightcolor = '#3cb4fe';
zoomchrome = response.zoomchrome;if(!zoomchrome)zoomchrome = false;
zoomweb = response.zoomweb;if(!zoomweb)zoomweb = true;

if (allzoom == true) {
        chrome.tabs.query({ active: true, currentWindow: true},
        function (tabs) {
            chrome.tabs.getZoom(tabs[0].id, function (zoomFactor) {
                //console.log(zoomFactor);
            });  
        
            if(zoomchrome == true){
                chrome.tabs.setZoom(tabs[0].id, allzoomvalue);
            } else{
                // Check for transform support so that we can fallback otherwise
                var supportsZoom = 'zoom' in document.body.style;
                if(supportsZoom){
                    chrome.tabs.executeScript(tabs[0].id,{code:"document.body.style.zoom=" + allzoomvalue});
                }else{
                    chrome.tabs.executeScript(tabs[0].id,{code:"document.body.style.transformOrigin='left top';document.body.style.transform='scale(" + allzoomvalue + ")'"});
                }
            }
            if(badge == true){
                chrome.browserAction.setBadgeBackgroundColor({color:lightcolor}); 
                chrome.browserAction.setBadgeText ( { text: ""+parseInt(allzoomvalue*100)+"" } );
            } else{
                chrome.browserAction.setBadgeText ( { text: "" } );
            }
        });
}
else{
  var websitezoom = response['websitezoom'];  
  if(typeof websitezoom == "string") {
    websitezoom = JSON.parse(websitezoom);
    var atbbuf = [];
    for(var domain in websitezoom)
      atbbuf.push(domain);
      atbbuf.sort();
    for(var i = 0; i < atbbuf.length; i++){
      if(atbbuf[i] == currentURL){
        var tempatbbuf = atbbuf[i];
        var editzoom = websitezoom[atbbuf[i]]/100;
              chrome.tabs.query({},
              function (tabs) {
                  tabs.forEach(function(tab){
                        var tor = tab.url;
                        var webtor = tor.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[0];
                        if(webtor == tempatbbuf){
                            if (zoomchrome == true) {
                                chrome.tabs.setZoom(tab.id, editzoom);
                            } else {
                                chrome.tabs.executeScript(tab.id, { code: "document.body.style.zoom=" + editzoom });
                            }
                            if (badge == true) {
                                chrome.browserAction.setBadgeBackgroundColor({ color: lightcolor });
                                chrome.browserAction.setBadgeText({ text: "" + parseInt(editzoom * 100) + "" });
                            } else {
                                chrome.browserAction.setBadgeText({ text: "" });
                            }
                        }
                  });
              });
      }
    }
  }
}

});
}
// contextmenu
else if (request.name == "contextmenuon") {checkcontextmenus();}
else if (request.name == "contextmenuoff") {removecontexmenus();}
});

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(){
    chrome.storage.local.get(['badge','zoomchrome','zoomweb','lightcolor'], function(response){
    var lightcolor = response.lightcolor;
    var badge = response.badge;if(!badge)badge = false;
    var zoomchrome = response.zoomchrome;if(!zoomchrome)zoomchrome = false;
    var zoomweb = response.zoomweb;if(!zoomweb)zoomweb = true;

        chrome.tabs.query({ active: true, currentWindow: true},
        function (tabs) {
            if (zoomchrome == true) {
                chrome.tabs.getZoom(tabs[0].id, function (zoomFactor) {
                    if (badge == true) {
                        chrome.browserAction.setBadgeBackgroundColor({ color: lightcolor });
                        chrome.browserAction.setBadgeText({ text: "" + parseInt(zoomFactor * 100) + "" });
                    } else {
                        chrome.browserAction.setBadgeText({ text: "" });
                    }
                });
            } else {
                chrome.tabs.sendMessage(tabs[0].id, { text: 'getwebzoom' }, function (info) {
                    if (info == null) { info = 1 }
                    else if (info == 0) { info = 1 }
                    if (badge == true) {
                        chrome.browserAction.setBadgeBackgroundColor({ color: lightcolor });
                        chrome.browserAction.setBadgeText({ text: "" + parseInt(info * 100) + "" });
                    } else {
                        chrome.browserAction.setBadgeText({ text: "" });
                    }
                });
            }
        });
    });
});

// contextMenus
function onClickHandler(info, tab) {
var str = info.menuItemId;var respage = str.substring(0, 8);var czl = str.substring(8);
if (respage == "zoompage") {
    chrome.storage.local.get(['allzoom','allzoomvalue','zoomchrome','zoomweb','websitezoom'], function(response){
    allzoom = response.allzoom;
    allzoomvalue = response.allzoomvalue;
    zoomchrome = response.zoomchrome;if(!zoomchrome)zoomchrome = false;
    zoomweb = response.zoomweb;if(!zoomweb)zoomweb = true;
    websitezoom = response.websitezoom;websitezoom = JSON.parse(websitezoom);
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        if(zoomchrome == true){
            chrome.tabs.setZoom(tabs[0].id, czl/100);
        }else{
            var supportsZoom = 'zoom' in document.body.style;
            if(supportsZoom){
                 chrome.tabs.executeScript(tabs[0].id,{code:"document.body.style.zoom=" + czl/100});
            }else{
                chrome.tabs.executeScript(tabs[0].id,{code:"document.body.style.transformOrigin='left top';document.body.style.transform='scale(" + czl/100 + ")'"});
            }
        }
        if(badge == true){
            chrome.browserAction.setBadgeBackgroundColor({color:lightcolor}); 
            chrome.browserAction.setBadgeText ( { text: ""+parseInt(czl)+"" } ); }else{chrome.browserAction.setBadgeText ( { text: "" } );
        }
        job = tabs[0].url;
        webjob = job.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[0];
        if(allzoom == true){
            // save for all zoom feature
            chrome.storage.local.set({"allzoomvalue": czl/100});
        }else{
                var atbbuf = [];
                for(var domain in websitezoom){atbbuf.push(domain);atbbuf.sort();}
                for(var i = 0; i < atbbuf.length; i++){
                    if(atbbuf[i] == webjob){ //update
                        if(parseInt(czl/100) == 1){
                        // remove from list
                        delete websitezoom[''+atbbuf[i]+''];
                        } else {
                        // update ratio
                        websitezoom[''+atbbuf[i]+''] = parseInt(czl);
                        }
                    }else{
                        // add to list
                        websitezoom[''+webjob+''] = parseInt(czl);
                    }
                }
                // save for zoom feature
                chrome.storage.local.set({"websitezoom": JSON.stringify(websitezoom) });
        }
    });
    });
}
else if (info.menuItemId == "totlguideemenu") {window.open(linkguide, "_blank");}
else if (info.menuItemId == "totldevelopmenu") {window.open(donatewebsite, "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open(writereview, "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open(zoomwebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Zoom extension&body=Hé, This is amazing. I just tried today this Zoom Browser extension"+zoomproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var szoomproductcodeurl = encodeURIComponent("The Best and Amazing Zoom Browser extension "+zoomproduct+"");window.open("https://twitter.com/home?status="+szoomproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+zoomproduct, "_blank");}
else if (info.menuItemId == "totlsharegoogleplus") {window.open("https://plus.google.com/share?url="+zoomproduct, "_blank");}
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
var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "parentId": parent});
var child2 = chrome.contextMenus.create({"title": sharemenupostongoogleplus, "id": "totlsharegoogleplus", "parentId": parent});

chrome.storage.local.get(['contextmenus'], function(items){
    if(items['contextmenus']){checkcontextmenus();}
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

// context menu for page and video
var menupage = null;
var contextmenuadded = false;
var contextarraypage = [];
var contextdefault = "100";

function checkcontextmenus(){
    if(contextmenuadded == false){
    contextmenuadded = true;

    // page
    var contexts = ["page","selection","link","editable","image","audio"];
        for (var i = 0; i < contexts.length; i++){
        var context = contexts[i];
        var pagetitle = chrome.i18n.getMessage("name");
            for (var j = 200; j >= 10; j=j-25) { 
                if(contextdefault && contextdefault == j){     
                    menupage = chrome.contextMenus.create({"type":"radio", "checked" : true, "id": "zoompage"+j+"", "title": "Zoom: "+ (j) + "%", "contexts":[context]});
                }else{
                    menupage = chrome.contextMenus.create({"type":"radio","id": "zoompage"+j+"","title": "Zoom: "+ (j) + "%", "contexts":[context]});
                } 
                contextarraypage.push(menupage);
            }
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
          if(changes['contextmenus']){if(changes['contextmenus'].newValue == true){checkcontextmenus()}else{removecontexmenus()}}
          if(changes['badge']) {
              if(changes['badge'].newValue) { chrome.browserAction.setBadgeText({ text: "100" }) } else { chrome.browserAction.setBadgeText({ text: "" }) }
          }
          if(changes['lightcolor']) {
              if(changes['lightcolor'].newValue) { chrome.browserAction.setBadgeBackgroundColor({ color: lightcolor }) }
          }
    }
})

try{ chrome.runtime.setUninstallUrl(linkuninstall); }
catch(e){}

chrome.storage.local.get(['firstRun'], function(chromeset){
if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
  chrome.tabs.create({url: linkwelcomepage})
  chrome.storage.local.set({"firstRun": false});
  chrome.storage.local.set({"version": "2.1"});
}
});