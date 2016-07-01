//================================================
/*

Proper Menubar
Add back the black menubar below the omnibox.
Copyright (C) 2014 Stefan vd
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

chrome.extension.onMessage.addListener(function request(request,sender,sendMessage){
if(request.comando == 'proprequest')sendMessage({addbar:localStorage['addbar'], googleplus:localStorage['googleplus'], opacity:localStorage['opacity'], backgroundhex:localStorage['backgroundhex'], backgroundcolor:localStorage['backgroundcolor'], backgroundimage:localStorage['backgroundimage'], backgroundimagesource:localStorage['backgroundimagesource'], country:localStorage['country'], link1a:localStorage['link1a'], link2a:localStorage['link2a'], link3a:localStorage['link3a'], link4a:localStorage['link4a'], link5a:localStorage['link5a'], link6a:localStorage['link6a'], link7a:localStorage['link7a'], link8a:localStorage['link8a'], link9a:localStorage['link9a'], link10a:localStorage['link10a'], link11a:localStorage['link11a'], link12a:localStorage['link12a'], link13a:localStorage['link13a'], link14a:localStorage['link14a'], link15a:localStorage['link15a'], link16a:localStorage['link16a'], link17a:localStorage['link17a'], link18a:localStorage['link18a'], link19a:localStorage['link19a'], link20a:localStorage['link20a'], link21a:localStorage['link21a'], allsites:localStorage['allsites'], fontcolor:localStorage['fontcolor'], propermenuDomains:localStorage['propermenuDomains'], googlesites:localStorage['googlesites'], propermenuonly:localStorage['propermenuonly'], link22a:localStorage['link22a'], search:localStorage['search'], link23a:localStorage['link23a'], link24a:localStorage['link24a'], link25a:localStorage['link25a'], existingtab:localStorage['existingtab']});
else if (request.name == "savevalueaddbar") {localStorage['addbar'] = request.value;}
else if (request.name == "savevaluecountry") {localStorage['country'] = request.value;}
else if (request.name == "navOFF") {
chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.executeScript(tabs[i].id, {file: "js/navremove.js"});
            }
        }
    );
}
else if (request.name == "navON") {
chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.executeScript(tabs[i].id, {file: "js/navadd.js"});
            }
        }
    );
}
});

function init() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if ((tab.url.match(/^http/i))) {
			
			chrome.tabs.getSelected(null, function(tab) {
			// Send a request to the content script.
			chrome.tabs.sendMessage(tab.id, {action: "addremove"});
			});
			
		}
	});
}

if ((localStorage["firstRun"]!="false") && (localStorage["firstRun"]!=false)){
  chrome.tabs.create({url: "http://www.stefanvd.net/project/propermenubarchrome.htm", selected:true})
  localStorage["firstRun"] = false;
  localStorage["version"]  = "1.7";
}

// Read current value settings
window.addEventListener('load', function() {
init();
});


// desknotify listeners
function desktopNotifyCliked(id,index){
    if(id.indexOf('rate') != -1){
		var ratemyextension = chrome.i18n.getMessage("@@extension_id");
        var rateURL = 'https://chrome.google.com/webstore/detail/' + ratemyextension + '/reviews';
		window.open(rateURL,'_blank');
    }else if(id == 'upgrade' && index!=undefined){
		var myextension = chrome.i18n.getMessage("@@extension_id");
        var shareUrl = 'https://chrome.google.com/webstore/detail/' + myextension;
        var tweetText = encodeURIComponent("Proper Menubar is the most awesome extension. Don't believe me try yourself,") + '%20' + encodeURIComponent(shareUrl);
        if(index == 0){
            window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(shareUrl),'_blank');
        }else if(index == 1){
            window.open('https://twitter.com/home?status=' + tweetText,'_blank');
        }
    }
}
chrome.notifications.onClicked.addListener(function(id){
    desktopNotifyCliked(id);
});
chrome.notifications.onButtonClicked.addListener(function(id,index){
    desktopNotifyCliked(id,index);
});
function desknotGetIcon128(){
    var icon = 'icons/icon128.png';
    return icon;
}

if ((localStorage["version"]=="0.1")){ 
localStorage["version"]  = "1.7";

var upgradecontexttitle = chrome.i18n.getMessage("upgradecontexttitle");
var upgradecontextmessage = chrome.i18n.getMessage("upgradecontextmessage");
var upgradecontextitemta = chrome.i18n.getMessage("upgradecontextitemta"); // title item
var upgradecontextitemma = chrome.i18n.getMessage("upgradecontextitemma"); // message item
var upgradecontextitemtb = chrome.i18n.getMessage("upgradecontextitemtb");
var upgradecontextitemmb = chrome.i18n.getMessage("upgradecontextitemmb");

var upgradefbshare = chrome.i18n.getMessage("upgradefbshare");
var upgradetwshare = chrome.i18n.getMessage("upgradetwshare");


chrome.notifications.create(
                    'upgrade',{
                        type: 'list', 
                        iconUrl: desknotGetIcon128(), 
                        title: upgradecontexttitle, 
                        message: upgradecontextmessage, // for the basic
						items: [{ title: "\u2713 " + upgradecontextitemta + "", message: upgradecontextitemma},
								{ title: "\u2713 " + upgradecontextitemtb + "", message: upgradecontextitemmb}],
                        buttons: [
                            { title: upgradefbshare, iconUrl: 'images/fb_share_16.png'},
                            { title: upgradetwshare, iconUrl: 'images/twt_share_16.png'},
                        ],
                        priority: 0},
                    function(){} 
                );

				
var ratetitle = chrome.i18n.getMessage("ratetitle");
var ratedes = chrome.i18n.getMessage("ratedes");
var rateitema = chrome.i18n.getMessage("rateitema");

chrome.notifications.create(
                    'rate',{   
                        type: 'basic', 
                        iconUrl: desknotGetIcon128(), 
                        title: ratetitle, 
                        message: ratedes, // for the basic
                        buttons: [
                            { title: rateitema, iconUrl: 'images/browser_star_16.png'},
                        ],
                        priority: 0},
                    function(){} 
                );
}