//================================================
/*

Full Screen
Go full screen with one click on the button.
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

/* inject script for autofullscreen */
try {
var script = document.createElement("script");script.type = "text/javascript";script.src = chrome.extension.getURL("/js/injected.js");document.getElementsByTagName("head")[0].appendChild(script);
} catch(e) {}

function $(id) { return document.getElementById(id); }
// settings
var contextmenus = null, autofullscreen = null;

chrome.storage.local.get(['contextmenus','autofullscreen'], function(items){
contextmenus = items['contextmenus'];if(contextmenus == null)contextmenus = true; 
autofullscreen = items['autofullscreen'];

// auto bring the html5 or youtube video to fullscreen
if(autofullscreen == true) {
var gracePeriod = 250, lastEvent = null, timeout = null;

			function trigger (data) {
				var that = this;
				if (gracePeriod > 0 && (lastEvent === null || String(lastEvent).split(":")[0] === String(data).split(":")[0])) {
					window.clearTimeout(timeout);
					timeout = window.setTimeout(function () {dispatch(data);}, gracePeriod);
				} else {
					dispatch(data);
				}
			}
			
			function dispatch (data) {
				if (data !== lastEvent) {
					lastEvent = data;
					data = String(data).split(":");
					switch (data[0]) {
						case "playerStateChange":
							//console.log("received playerStateChange", data[1]);
							if (data[1] === "2" || data[1] === "0" || data[1] === "-1") {
								shadesOff(this.player);
								if (data[1] === "0") {
									try {
									//playerReset(this.player);
									//playerStop(this.player);
									playerPause(this.player);
									} catch(e){};
								}
							} else {
								shadesOn(this.player);
							}
							break;
						default:
							//console.log("unknown event", data);
							break;
					}
				}
			}

	function playerPause(player) {
		if (player !== null) {
			if (typeof(player.pauseVideo) === "function") {
				player.pauseVideo();
			} else if (typeof(player.pause) === "function") {
				player.pause();
			}
		}
	}
	function playerReady(player) {
		this.player = player;
		//this.playerPause(player);
		//this.playerReset(player);
	}
	function playerReset(player) {
		if (player !== null) {
			if (typeof(player.seekTo) === "function") {
				player.seekTo(0, false);
			} else if (typeof(player.currentTime) !== "undefined") {
				player.currentTime = 0;
			}
		}
	}
	function playerStop(player) {
		if (player !== null) {
			if (typeof(player.stopVideo) === "function") {
				player.stopVideo();
			} else if (typeof(player.pause) === "function") {
				player.pause();
			}
		}
	}
	function shadesOff(player) {
		if (player !== null) {
				var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
				var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

			if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
				if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}else{
				if (!fullscreenEnabled) {}
				else {
					if(document.exitFullscreen) {
					document.exitFullscreen();
					player.style.cssText="position: relative;width: 100%!important;height: 100%!important;";
					} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
					player.style.cssText="position: relative;width: 100%!important;height: 100%!important;";
					}
				}
			}
		}
	}
	function shadesOn(player) {
		if (player !== null) {
			if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
				// send to background
				chrome.runtime.sendMessage({name: 'youtubefullscreen'});
			}else{
				if (player.requestFullScreen) {
				player.requestFullScreen();
				player.style.cssText="position: relative;width: " + screen.width + "px!important;height: " + screen.height +"px!important;";
				} else if(player.webkitRequestFullscreen) {
				player.webkitRequestFullscreen();
				player.style.cssText="position: relative;width: " + screen.width + "px!important;height: " + screen.height +"px!important;";
				}
			}
		}
	}

		// player ready check
		var startautoplay = setInterval(function () {
		try {
			var youtubeplayer = $("movie_player") || null
			var htmlplayer = document.getElementsByTagName("video") || null;
			if (youtubeplayer !== null) { // youtube video element
	   				if (youtubeplayer.pauseVideo) {playerReady(youtubeplayer);}
			} else if (htmlplayer !== null) { // html5 video elements
				for(var j=0; j<htmlplayer.length; j++) {
	   				if (htmlplayer[j].pause) {playerReady(htmlplayer[j]);}
				}
			}
		}
		catch(err) {} // i see nothing, that is good
		},1000); // 1000 refreshing it

		// injected code messaging
		var bodytag = document.getElementsByTagName("body")[0], message = document.createElement("div");
		message.setAttribute("id", "StefanvdFullSreenMessage");
		message.style.display = "none";
		bodytag.appendChild(message);
		$(message.id).addEventListener(message.id, function () {
			var eventData = $(message.id).innerText;
			trigger(eventData);
  		});

} // option autofullscreen on end
});

var last_target = null;
document.addEventListener('mousedown', function(event){
  last_target = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendMessage) {
	if (request.action == "gofullscreen") {
		var elem = last_target;
		// if it get the "hide" command from the background page
		// run this code

		if(elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if(elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		} else if(elem.mozRequestFullscreen) {
			elem.mozRequestFullscreen();
		}
	}
})