//================================================
/*

Proper Menubar
Add the black menubar below the address bar. To get easy and fast access to all your Google products.
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

chrome.runtime.onMessage.addListener(function(request, sender, sendMessage) {
if (request.action == "addremove"){
var addbar = null;
chrome.storage.sync.get(['addbar'], function(items){
addbar = items['addbar'];
if(addbar == true){ chrome.runtime.sendMessage({name : 'navON'}); }
else { chrome.runtime.sendMessage({name : 'navOFF'}); }
});
} else if (request.action == "toolbarrefresh") {
    //window.location.reload();
    chrome.runtime.sendMessage({name : 'navOFF', function(response) {
    chrome.runtime.sendMessage({name : 'navON'});
    }});
}


// observeDOM - dynamic check
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

// Observe a specific DOM element:
if(window.location.href.match(/^https?\:\/\/(www\.)?google\.[a-z]+\/maps\b/)){
if(document.body){
	observeDOM( document.body ,function(){
            chrome.storage.sync.get(['addbar'], function(items){
            if(items['addbar'] == true){
                // fixed Google Maps drop overlay
                if($("content-container")){ $("content-container").style.top = '30px'; }
            }
        });
	});
}
}

});