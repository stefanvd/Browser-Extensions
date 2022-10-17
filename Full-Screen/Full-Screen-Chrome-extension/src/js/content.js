//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2022 Stefan vd
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

function $(id){ return document.getElementById(id); }

// Install on www.stefanvd.net
if(window.location.href.match(/^http(s)?:\/\/(www\.)?stefanvd.net/i)){
	if($("full-screen-" + exbrowser + "-install-button")){
		$("full-screen-" + exbrowser + "-install-button").style.display = "none";
		$("full-screen-" + exbrowser + "-thanks-button").style.display = "block";
	}
}

// settings
var startautoplay = null, contextmenus = null, autofullscreen = null, videoinwindow = null, videooutwindow = null;

chrome.storage.sync.get(["contextmenus", "autofullscreen", "videoinwindow", "videooutwindow"], function(items){
	contextmenus = items["contextmenus"]; if(contextmenus == null)contextmenus = true;
	autofullscreen = items["autofullscreen"]; if(autofullscreen == null)autofullscreen = false;
	videoinwindow = items["videoinwindow"]; if(videoinwindow == null)videoinwindow = true;
	videooutwindow = items["videooutwindow"]; if(videooutwindow == null)videooutwindow = false;

	// auto bring the html5 or youtube video to fullscreen
	if(autofullscreen == true){
		startvideostatus();
	} // option autofullscreen on end
});

var gracePeriod = 250, lastEvent = null, timeout = null;

function trigger(data){
	if(gracePeriod > 0 && (lastEvent === null || String(lastEvent).split(":")[0] === String(data).split(":")[0])){
		window.clearTimeout(timeout);
		timeout = window.setTimeout(function(){ dispatch(data); }, gracePeriod);
	}else{
		dispatch(data);
	}
}

function dispatch(data){
	if(data !== lastEvent){
		lastEvent = data;
		data = String(data).split(":");
		switch(data[0]){
		case"playerStateChange":
			// console.log("received playerStateChange", data[1]);
			if(data[1] === "2" || data[1] === "0" || data[1] === "-1"){
				shadesOff(this.player);
				if(data[1] === "0"){
					try{
						// playerReset(this.player);
						// playerStop(this.player);
						playerPause(this.player);
					}catch(e){
						// console.log(e);
					}
				}
			}else{
				shadesOn(this.player);
			}
			break;
		default:
			// console.log("unknown event", data);
			break;
		}
	}
}

function playerPause(player){
	if(player !== null){
		if(typeof(player.pauseVideo) === "function"){
			player.pauseVideo();
		}else if(typeof(player.pause) === "function"){
			player.pause();
		}
	}
}
function playerReady(player){
	this.player = player;
}

var videowindow = false;
var stefanvdregularhtmlplayer;
var stefanyoutubecontrols;
function windowfullaction(){
	if(document.getElementsByTagName("video")[0]){
		if(window.location.href.match(/^http(s)?:\/\/(www\.)?youtube.com/i)){
		// YouTube website
			var ytplayerapi = document.getElementById("player-api");
			var playercontainer = document.getElementById("player-container");

			var pagemanager = $("page-manager");
			if(pagemanager)$("page-manager").style.cssText = "z-index:auto !important";

			if(playercontainer){
				stefanvdregularhtmlplayer = document.getElementsByClassName("stefanvdvideowindow")[0];
				stefanyoutubecontrols = document.getElementsByClassName("ytp-chrome-bottom")[0];
				if(stefanvdregularhtmlplayer){
					playercontainer.classList.remove("stefanvdvideowindow");
					document.getElementsByTagName("video")[0].classList.remove("stefanvdvideowindow");
					videowindow = false;
				}else{
					if(document.getElementsByTagName("video")[0].paused == false){
						playercontainer.classList.add("stefanvdvideowindow");
						document.getElementsByTagName("video")[0].classList.add("stefanvdvideowindow");
						stefanyoutubecontrols.style.cssText = "width:100% !important";
						videowindow = true;
					}
				}
			}else if(ytplayerapi){
				stefanvdregularhtmlplayer = document.getElementsByClassName("stefanvdvideowindow")[0];
				stefanyoutubecontrols = document.getElementsByClassName("ytp-chrome-bottom")[0];
				if(stefanvdregularhtmlplayer){
					ytplayerapi.classList.remove("stefanvdvideowindow");
					document.getElementsByTagName("video")[0].classList.remove("stefanvdvideowindow");
					videowindow = false;
				}else{
					if(document.getElementsByTagName("video")[0].paused == false){
						ytplayerapi.classList.add("stefanvdvideowindow");
						document.getElementsByTagName("video")[0].classList.add("stefanvdvideowindow");
						stefanyoutubecontrols.style.width = "98%";
						videowindow = true;
					}
				}
			}
		}
	}
}

function shadesOff(player){
	if(player !== null){
		// Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
		// skip it and use => videoinwindow
		// if(videoinwindow == true){
		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
			windowfullaction(player);
		}else{
			player.classList.remove("stefanvdvideowindow");
		}
		// }else if(videooutwindow == true){
		// 	if(!document.fullscreenElement){}
		// 	else{document.exitFullscreen();}
		// }
	}
}
function shadesOn(player){
	if(player !== null){
		// Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
		// skip it and use => videoinwindow
		// if(videoinwindow == true){
		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
			windowfullaction(player);
		}else{
			player.classList.add("stefanvdvideowindow");
		}
		// }else if(videooutwindow == true){
		// 	if(!document.fullscreenElement){
		// 		if(document.documentElement.requestFullScreen){
		// 		document.getElementsByTagName('video')[0].requestFullScreen();
		// 		}else if(document.documentElement.mozRequestFullScreen){
		// 		document.getElementsByTagName('video')[0].mozRequestFullScreen();
		// 		}else if(document.documentElement.webkitRequestFullScreen){
		// 		document.getElementsByTagName('video')[0].webkitRequestFullScreen();
		// 		}
		// 	}
		// }
	}
}

// player ready check
function startvideostatus(){
	// inject script for autofullscreen
	chrome.runtime.sendMessage({name: "sendautoplay"});
	window.addEventListener("keyup", function(e){ if(e.keyCode == 27){ if(videowindow == true){ windowfullaction(); } } }, false);

	startautoplay = setInterval(function(){
		try{
			var youtubeplayer = $("movie_player") || null;
			var htmlplayer = document.getElementsByTagName("video") || null;
			if(youtubeplayer !== null){ // youtube video element
				if(youtubeplayer.pauseVideo){ playerReady(youtubeplayer); }
			}else if(htmlplayer !== null){ // html5 video elements
				for(var j = 0; j < htmlplayer.length; j++){
					if(htmlplayer[j].pause){ playerReady(htmlplayer[j]); }
				}
			}
		}catch(err){
			// console.log(e);
		} // i see nothing, that is good
	}, 1000); // 1000 refreshing it

	// injected code messaging
	var bodytag = document.getElementsByTagName("body")[0], message = document.createElement("div");
	message.setAttribute("id", "stefanvdfullscreencinemamessage");
	message.style.display = "none";
	bodytag.appendChild(message);
	$(message.id).addEventListener(message.id, function(){
		if(autofullscreen == true){
			var eventData = $(message.id).innerText;
			trigger(eventData);
		}
	});
}

var last_target = null;
document.addEventListener("mousedown", function(event){
	if(event.button !== 2){
		return false;
	}
	last_target = event.target;
	chrome.extension.sendMessage({name: "updateContextMenu"});
}, true);


function exitFullscreen(){
	if(document.exitFullscreen){
		document.exitFullscreen();
	}else if(document.mozCancelFullScreen){
		document.mozCancelFullScreen();
	}else if(document.webkitExitFullscreen){
		document.webkitExitFullscreen();
	}
}

chrome.runtime.onMessage.addListener(function(request){
	if(request.name == "gofullscreen"){
		var elem = last_target;
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		// if it get the "hide" command from the background page
		// run this code
		if(!fullscreenElement){
			if(elem.requestFullscreen){
				elem.requestFullscreen();
			}else if(elem.webkitRequestFullscreen){
				elem.webkitRequestFullscreen();
			}
		}else{
			// Cancel fullscreen for web browser
			exitFullscreen();
		}
	}else if(request.name == "injectvideostatus"){
		var script = document.createElement("script"); script.type = "text/javascript"; script.textContent = request.message; document.getElementsByTagName("head")[0].appendChild(script);
	}else if(request.name == "gorefreshvideoinwindow"){
		chrome.storage.sync.get(["videoinwindow", "videooutwindow"], function(items){
			videoinwindow = items["videoinwindow"];
			videooutwindow = items["videooutwindow"];
		});
	}else if(request.name == "gorefreshautofullscreen"){
		chrome.storage.sync.get(["autofullscreen"], function(items){
			autofullscreen = items["autofullscreen"];
			console.log("autofullscreen=" + autofullscreen);
			if(autofullscreen == true){
				startvideostatus();
			}else{
				window.clearInterval(startautoplay);
			}
		});
	}
});