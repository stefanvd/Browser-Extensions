//================================================
/*

Full Screen
Go full screen with one click on the button.
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
if (request.name == "youtubefullscreen") {
    chrome.tabs.query({active: true}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.executeScript(tabs[i].id, {file: "js/video.js"});
            }
        }
    );
}
else if (request.name == "sendautoplay") {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function (e) { if (oReq.readyState == 4) {chrome.tabs.sendMessage(sender.tab.id, {name: "injectvideostatus",message: oReq.responseText});} };
    oReq.open("GET","/js/injected.js",true);oReq.send();
}
// contextmenu
else if (request.name == "contextmenuon") {checkcontextmenus();}
else if (request.name == "contextmenuoff") {removecontexmenus()}
else if(request.name == "getallpermissions"){
    var result = "";
    chrome.permissions.getAll(function(permissions){
       result = permissions.permissions;
       chrome.tabs.sendMessage(sender.tab.id,{text: 'receiveallpermissions', value: result});
    });
}
else if(request.name == "sendcurrentmaximize"){
    chrome.windows.getCurrent(function(window){
        if(window.state=="maximized"){
            chrome.windows.update(window.id, { state: oldwindowstatus });
        }else{
            oldwindowstatus = window.state;
            chrome.windows.update(window.id, { state: "maximized" });
        }
    });
}
else if(request.name == "sendallmaximize"){
    chrome.windows.getAll({},function(windows){
        windows.forEach(function(window){
            if(window.state=="maximized"){
                chrome.windows.update(window.id, { state: "normal" });
            }else{
                chrome.windows.update(window.id, { state: "maximized" });
            }
        });
    });
}
else if(request.name == "sendcurrentfullscreen"){
    chrome.windows.getCurrent(function(window){
        if(window.state=="fullscreen"){
            chrome.windows.update(window.id, { state: oldwindowstatus });
        }else{
            oldwindowstatus = window.state;
            chrome.windows.update(window.id, { state: "fullscreen" });
        }
    });
}
else if(request.name == "sendallfullscreen"){
    chrome.windows.getAll({},function(windows){
        windows.forEach(function(window){
            if(window.state=="fullscreen"){
                chrome.windows.update(window.id, { state: oldwindowstatus });
            }else{
                chrome.windows.update(window.id, { state: "fullscreen" });
                oldwindowstatus = window.state;
            }
        });
    });
}
else if(request.name == "sendcurrentpopup"){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        // close current tab
        var websiteurl = tabs[0].url;
        if(tabs[0]){
            chrome.tabs.remove(tabs[0].id);
        }
        // open popup window
        chrome.tabs.create({
            url: websiteurl,
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                state:"maximized"
            });
        });
    }
);
}
else if(request.name == "updateContextMenu"){
    renewcontextmenu();
}
else if(request.name == "sendalltabspopup"){
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        

        var screenWidth = screen.availWidth;
        var screenHeight = screen.availHeight;

        var i = 0;
        var l = tabs.length;
        for(i; i < l; i++){
            // support up to 2x2 matrix
            // example: 2 popup windows
            if(l == 2){
                var left = (screenWidth/2);
                var top = (screenHeight/2);
                var w = (screenWidth/2);
                var h = (screenHeight);
                var websiteurl = tabs[i].url;
                if(tabs[i]){
                    chrome.tabs.remove(tabs[i].id);
                }
                chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: h, left: i * left, top: 0}, function(window) {});
            }else if(l == 3){
                var left = (screenWidth/2);
                var top = (screenHeight/2);
                var w = (screenWidth/2);
                var h = (screenHeight/2);
                var websiteurl = tabs[i].url;
                if(tabs[i]){
                    chrome.tabs.remove(tabs[i].id);
                }
                if(i==2){
                    chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: screenHeight, left: 0, top: 0}, function(window) {});
                }else{
                    chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: h, left: left, top: i * top}, function(window) {});
                }
            }else if(l == 4){
                var left = (screenWidth/2);
                var top = (screenHeight/2);
                var w = (screenWidth/2);
                var h = (screenHeight/2);
                var websiteurl = tabs[i].url;
                if(tabs[i]){
                    chrome.tabs.remove(tabs[i].id);
                }
                if(i==0){
                    chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: h, left: 0, top: 0}, function(window) {});
                }else if(i==1){
                    chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: h, left: 0, top: top}, function(window) {});
                }else if(i==2){
                    chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: h, left: left, top: 0}, function(window) {});
                }else if(i==3){
                    chrome.windows.create({url: websiteurl, type: 'popup', width: w, height: h, left: left, top: top}, function(window) {});
                }
            }else{
                // regular open tab in background popup window
                var websiteurl = tabs[i].url;
                if(tabs[i]){
                    chrome.tabs.remove(tabs[i].id);
                }
                // open popup window
                chrome.tabs.create({
                    url: websiteurl,
                    active: false
                }, function(tab) {
                    // After the tab has been created, open a window to inject the tab
                    chrome.windows.create({
                        tabId: tab.id,
                        type: 'popup',
                        focused: true,
                        state:"maximized"
                    });
                });
            }
        }


    }
);
}
});

function renewcontextmenu(){
    chrome.windows.getCurrent(null, function (window) {
        if(window.type=="popup"){
            var backpopuptitle = chrome.i18n.getMessage("backpopuptitle");
            chrome.contextMenus.update("fspage",{'title': backpopuptitle});
        }else{
            var pagetitle = chrome.i18n.getMessage("pagetitle");
            chrome.contextMenus.update("fspage",{'title': pagetitle});
        }
    });
}

// update when click on the tab
chrome.tabs.onHighlighted.addListener(function(){
    renewcontextmenu();
});

// focus window changed (from popup to window)
chrome.windows.onFocusChanged.addListener(function(){
    renewcontextmenu();
});

// browser check
var nAgt = navigator.userAgent;
var browserName;
var urlbrowservendor = window.navigator.vendor;
if((nAgt.indexOf("OPR/"))!=-1){browserName = "Opera";}
else if(urlbrowservendor.search("Safari") >= 0){browserName = "Safari";}
else if(urlbrowservendor.search("Yandex") >= 0){browserName = "Yandex";}
else if(urlbrowservendor.search("Google") >= 0){browserName = "Google Chrome";}
else if(navigator.appCodeName == "Mozilla"){browserName = "Firefox";}
else if((nAgt.indexOf("Maxthon/"))!=-1){browserName = "Maxthon";}

var oldwindowstatus;
var fullscreenweb = null, fullscreenwindow = null, fullscreenpopup = null, fullscreenvideo = null, allwindows = null;

// Set click to false at beginning
var alreadyClicked = false;
// Declare a timer variable
var timer;
var popupcreated = false;
chrome.browserAction.onClicked.addListener(function(tabs){

        // Check for previous click
        if(alreadyClicked){
            // console.log("Doubleclick");
            // Yes, Previous Click Detected
            // Clear timer already set in earlier Click
            window.clearTimeout(timer);
            // Show the popup window
            // Clear all Clicks
            alreadyClicked = false;
            chrome.browserAction.setPopup({tabId: tabs.id, popup:""});
            return;
        }


        //Set Click to  true
        alreadyClicked = true;
        chrome.browserAction.setPopup({tabId: tabs.id, popup:"palette.html"});

        // Add a timer to detect next click to a sample of 250
        timer = window.setTimeout(function(){
            // console.log("Singelclick");
            var popups = chrome.extension.getViews({type: "popup"});
            if(popups.length != 0){ // popup exist

            }else{ // not exist
                
                chrome.windows.getCurrent(function(window){
                    chrome.storage.sync.get(['fullscreenweb','fullscreenwindow','fullscreenpopup','fullscreenvideo','allwindows'], function(items){
                      fullscreenweb = items['fullscreenweb'];if(fullscreenweb == null)fullscreenweb = true;
                      fullscreenwindow = items['fullscreenwindow'];
                      fullscreenpopup = items['fullscreenpopup'];
                      fullscreenvideo = items['fullscreenvideo'];
                      allwindows = items['allwindows'];
                
                        if(fullscreenweb == true){
                            if(allwindows == true){
                                chrome.windows.getAll({},function(windows){
                                    windows.forEach(function(window){
                                        if(window.state=="fullscreen"){
                                            chrome.windows.update(window.id, { state: oldwindowstatus });
                                        }else{
                                            oldwindowstatus = window.state;
                                            chrome.windows.update(window.id, { state: "fullscreen" });
                                        }
                                    });
                                });
                            }else{
                                // Firefox extension do not use the Full Screen API, permission issue. So use the Chrome window method
                                // Bug Chrome: do not restore previous state
                                if(window.state=="fullscreen"){
                                    chrome.windows.update(window.id, { state: oldwindowstatus });
                                }else{
                                    oldwindowstatus = window.state;
                                    chrome.windows.update(window.id, { state: "fullscreen" });
                                }
                
                                // Chromium web browsers
                                // Old way
                                //if(tab.url.match(/^http/i)||tab.url.match(/^file/i)){
                                //    chrome.tabs.executeScript(tab.id, { file: "js/fullscreen.js" });
                                //}
                            }
                        }
                        else if(fullscreenwindow == true){
                            if(allwindows == true){
                                chrome.windows.getAll({},function(windows){
                                    windows.forEach(function(window){
                                        if(window.state=="maximized"){
                                            chrome.windows.update(window.id, { state: "normal" });
                                        }else{
                                            chrome.windows.update(window.id, { state: "maximized" });
                                        }
                                    });
                                });
                            }else{
                                if(window.state=="maximized"){
                                    chrome.windows.update(window.id, { state: "normal" });
                                }else{
                                    chrome.windows.update(window.id, { state: "maximized" });
                                }
                            }
                        }
                        else if(fullscreenpopup == true){
                            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                                // close current tab
                                var websiteurl = tabs[0].url;
                                if(tabs[0]){
                                    chrome.tabs.remove(tabs[0].id);
                                }
                                // open popup window
                                chrome.tabs.create({
                                    url: websiteurl,
                                    active: false
                                }, function(tab) {
                                    // After the tab has been created, open a window to inject the tab
                                    chrome.windows.create({
                                        tabId: tab.id,
                                        type: 'popup',
                                        focused: true,
                                        state:"maximized"
                                    });
                                });
                            });
                        }
                        else if(fullscreenvideo == true){
                            if(allwindows == true){
                                chrome.tabs.query({}, function(tabs){
                                    var i;
                                    var l = tabs.length;
                                    for(i = 0; i < l; i++){
                                        chrome.tabs.executeScript(tabs[i].id, {file: "js/video.js"}, function(){if(chrome.runtime.lastError){
                                            // console.error(chrome.runtime.lastError.message);
                                        }});
                                    }
                                }
                                );
                            }else{
                                chrome.tabs.executeScript(tabs.id, {file: "js/video.js"}, function(){if(chrome.runtime.lastError){
                                    // console.error(chrome.runtime.lastError.message);
                                }});
                            }
                        }
                    });
                  });

            }

            // Clear all timers
            window.clearTimeout(timer);
            // Ignore clicks
            alreadyClicked = false;
            chrome.browserAction.setPopup({tabId: tabs.id, popup:""});
        }, 250);

});

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "fsvideo" || info.menuItemId == "fsimage") {chrome.tabs.sendMessage(tab.id, { name: "gofullscreen" });}
else if(info.menuItemId == "fspage"){
    chrome.windows.getCurrent(null, function (window) {
        // Firefox extension do not use the Full Screen API, permission issue. So use the Chrome window method
        // Bug Chrome: do not restore previous state
        if(window.type=="popup"){
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                // close current pop window
                var websiteurl = tabs[0].url;
                if(tabs[0]){
                    chrome.tabs.remove(tabs[0].id);
                    //and create tab
                    chrome.tabs.create({url: websiteurl, active:true})
                }
            });
            // add back the regular page title
            var pagetitle = chrome.i18n.getMessage("pagetitle");
            chrome.contextMenus.update("fspage",{'title': pagetitle});
        }else{
            if(window.state=="fullscreen"){
                chrome.windows.update(window.id, { state: oldwindowstatus });
            }else{
                oldwindowstatus = window.state;
                chrome.windows.update(window.id, { state: "fullscreen" });
            }
        }
        
        // Chromium web browsers
        // Old way
        //if(tab.url.match(/^http/i)||tab.url.match(/^file/i)){
        //    chrome.tabs.executeScript(tab.id, { file: "js/fullscreen.js" });
        //}
    });
}
else if (info.menuItemId == "totlguideemenu") {window.open(linkguide, "_blank");}
else if (info.menuItemId == "totldevelopmenu") {window.open(donatewebsite, "_blank");}
else if (info.menuItemId == "totlratemenu") {window.open(writereview, "_blank");}
else if (info.menuItemId == "totlsharemenu") {window.open(fullscreenwebsite, "_blank");}
else if (info.menuItemId == "totlshareemail") {window.open("mailto:youremail?subject=Full Screen extension&body=Hé, This is amazing. I just tried today this Full Screen Browser extension"+fullscreenproduct+"", "_blank");}
else if (info.menuItemId == "totlsharetwitter") {var sfullscreenproductcodeurl = encodeURIComponent("The Best and Amazing Full Screen Browser extension "+fullscreenproduct+"");window.open("https://twitter.com/home?status="+sfullscreenproductcodeurl+"", "_blank");}
else if (info.menuItemId == "totlsharefacebook") {window.open("https://www.facebook.com/sharer/sharer.php?u="+fullscreenproduct, "_blank");}
else if (info.menuItemId == "totlsubscribe") {chrome.tabs.create({url: linkyoutube, active:true})}
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
var sharemenuratetitle = chrome.i18n.getMessage("sharemenuratetitle");
var sharemenudonatetitle = chrome.i18n.getMessage("sharemenudonatetitle");
var sharemenusubscribetitle = chrome.i18n.getMessage("desremyoutube");

var contexts = ["page_action", "browser_action"];
try{
    // try show web browsers that do support "icons"
    // Firefox, Opera, Microsoft Edge
    chrome.contextMenus.create({"title": sharemenuwelcomeguidetitle, "type":"normal", "id": "totlguideemenu", "contexts": contexts, "icons": {"16": "images/IconGuide.png","32": "images/IconGuide@2x.png"}});
    chrome.contextMenus.create({"title": sharemenudonatetitle, "type":"normal", "id": "totldevelopmenu", "contexts": contexts, "icons": {"16": "images/IconDonate.png","32": "images/IconDonate@2x.png"}});
    chrome.contextMenus.create({"title": sharemenuratetitle, "type":"normal", "id": "totlratemenu", "contexts": contexts, "icons": {"16": "images/IconStar.png","32": "images/IconStar@2x.png"}});
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
    var parent = chrome.contextMenus.create({"title": sharemenusharetitle, "id": "totlsharemenu", "contexts": contexts, "icons": {"16": "images/IconShare.png","32": "images/IconShare@2x.png"}});
    var child1 = chrome.contextMenus.create({"title": sharemenutellafriend, "id": "totlshareemail", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconEmail.png","32": "images/IconEmail@2x.png"}});
    chrome.contextMenus.create({"title": "", "type":"separator", "id": "totlsepartorshare", "contexts": contexts, "parentId": parent});
    var child2 = chrome.contextMenus.create({"title": sharemenusendatweet, "id": "totlsharetwitter", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconTwitter.png","32": "images/IconTwitter@2x.png"}});
    var child3 = chrome.contextMenus.create({"title": sharemenupostonfacebook, "id": "totlsharefacebook", "contexts": contexts, "parentId": parent, "icons": {"16": "images/IconFacebook.png","32": "images/IconFacebook@2x.png"}});
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
    chrome.contextMenus.create({"title": sharemenusubscribetitle, "type":"normal", "id": "totlsubscribe", "contexts":contexts, "icons": {"16": "images/IconYouTube.png","32": "images/IconYouTube@2x.png"}});
}
catch(e){
    // catch web browsers that do NOT show the icon
    // Google Chrome
    chrome.contextMenus.create({"title": sharemenusubscribetitle, "type":"normal", "id": "totlsubscribe", "contexts":contexts});
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.storage.sync.get(['contextmenus'], function(items){
    if(items['contextmenus']){checkcontextmenus();}
});

// context menu for page and video
var menuvideo = null; var menuimage = null; var menupage = null;
var contextmenuadded = false;
var contextarrayvideo = [];
var contextarrayimage = [];
var contextarraypage = [];

function checkcontextmenus(){
    if(contextmenuadded == false){
    contextmenuadded = true;

    // video
    var contexts = ["video"];
    for (var i = 0; i < contexts.length; i++){
    var context = contexts[i];
    var videotitle = chrome.i18n.getMessage("videotitle");
    menuvideo = chrome.contextMenus.create({"title": videotitle, "type":"normal", "id": "fsvideo", "contexts":[context]});
    contextarrayvideo.push(menuvideo);
    }

    // image
    var contexts = ["image"];
    for (var i = 0; i < contexts.length; i++){
    var context = contexts[i];
    var imagetitle = chrome.i18n.getMessage("imagetitle");
    menuimage = chrome.contextMenus.create({"title": imagetitle, "type":"normal", "id": "fsimage", "contexts":[context]});
    contextarrayimage.push(menuimage);
    }

    // page
    var contexts = ["page"];
    for (var i = 0; i < contexts.length; i++){
    var context = contexts[i];
    var pagetitle = chrome.i18n.getMessage("pagetitle");
    menupage = chrome.contextMenus.create({"title": pagetitle, "type":"normal", "id": "fspage", "contexts":[context]});
    contextarraypage.push(menupage);
    }

    }
}

function removecontexmenus(){
    if (contextarrayvideo.length > 0) {
        for (var i=0;i<contextarrayvideo.length;i++) {
            if (contextarrayvideo[i] === undefined || contextarrayvideo[i] === null){}else{
            chrome.contextMenus.remove(contextarrayvideo[i]);
            }
        }
    }
    if (contextarrayimage.length > 0) {
        for (var i=0;i<contextarrayimage.length;i++) {
            if (contextarrayimage[i] === undefined || contextarrayimage[i] === null){}else{
            chrome.contextMenus.remove(contextarrayimage[i]);
            }
        }
    }
    if (contextarraypage.length > 0) {
        for (var i=0;i<contextarraypage.length;i++) {
            if (contextarraypage[i] === undefined || contextarraypage[i] === null){}else{
            chrome.contextMenus.remove(contextarraypage[i]);
            }
        }
    }
    contextarrayvideo = [];
    contextarrayimage = [];
    contextarraypage = [];
    contextmenuadded = false;
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if(changes['contextmenus']){if(changes['contextmenus'].newValue == true){checkcontextmenus()}else{removecontexmenus()}}
    if(changes['videoinwindow']){
        // change for videoinwindow and videooutwindow
        chrome.tabs.query({}, function(tabs){
            var i;
            var l = tabs.length;
            for(i = 0; i < l; i++){
                chrome.tabs.sendMessage(tabs[i].id, { name: "gorefreshvideoinwindow" });
            }
        });
    }
    if(changes['autofullscreen']){
        chrome.tabs.query({}, function(tabs){
            var i;
            var l = tabs.length;
            for(i = 0; i < l; i++){
                chrome.tabs.sendMessage(tabs[i].id, { name: "gorefreshautofullscreen" });
            }
        });
    }
})

chrome.runtime.setUninstallURL(linkuninstall);

chrome.storage.sync.get(['firstRun'], function(chromeset){
    if ((chromeset["firstRun"]!="false") && (chromeset["firstRun"]!=false)){
    chrome.tabs.create({url: linkwelcomepage});
    var crrinstall = new Date().getTime();
    chrome.storage.sync.set({"firstRun": false, "version": "0.1", "firstDate": crrinstall});  
}
});