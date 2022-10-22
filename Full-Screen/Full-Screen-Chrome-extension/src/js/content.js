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
var startautoplay = null, contextmenus = null, mediafullscreen = null, videoinwindow = null, videooutwindow = null;

chrome.storage.sync.get(["contextmenus", "mediafullscreen", "videoinwindow", "videooutwindow"], function(items){
	contextmenus = items["contextmenus"]; if(contextmenus == null)contextmenus = true;
	mediafullscreen = items["mediafullscreen"]; if(mediafullscreen == null)mediafullscreen = false;
	videoinwindow = items["videoinwindow"]; if(videoinwindow == null)videoinwindow = true;
	videooutwindow = items["videooutwindow"]; if(videooutwindow == null)videooutwindow = false;

	// auto bring the html5 or youtube video to fullscreen
	if(mediafullscreen == true){
		startvideostatus();
	} // option mediafullscreen on end
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
var checktheatermode;
var initialtheatermode = false;
function windowfullaction(){
	if(document.getElementsByTagName("video")[0]){
		if(window.location.href.match(/^http(s)?:\/\/(www\.)?youtube.com/i)){
			// YouTube website
			var playertheater = document.getElementById("player-theater-container");
			var playercontrols = document.getElementsByClassName("ytp-chrome-bottom")[0];
			var playercontainer = document.getElementById("player-container");

			if(playercontainer){
				var stefanvdregularhtmlplayer = document.getElementsByClassName("stefanvdvideowindow")[0];
				var original = document.getElementsByClassName("ytp-size-button")[0];
				var watchContainer = document.querySelector("ytd-watch") || document.querySelector("ytd-watch-flexy");
				if(stefanvdregularhtmlplayer){
					if(!initialtheatermode){
						original.click();
					}
					playercontainer.classList.remove("stefanvdvideowindow");
					playertheater.classList.remove("stefanvdvideotheather");
					playercontrols.classList.remove("stefanvdvideocontrols");
					document.getElementsByTagName("video")[0].classList.remove("stefanvdvideowindow");
					videowindow = false;
				}else{
					checktheatermode = watchContainer ? watchContainer.hasAttribute("theater") : true;
					initialtheatermode = checktheatermode;
					if(!checktheatermode){
						original.click();
						checktheatermode = true;
					}
					playercontainer.classList.add("stefanvdvideowindow");
					playertheater.classList.add("stefanvdvideotheather");
					playercontrols.classList.add("stefanvdvideocontrols");
					document.getElementsByTagName("video")[0].classList.add("stefanvdvideowindow");
					videowindow = true;
				}
			}
		}else{
			var stefanvdregularhtmlplayerb = document.getElementsByClassName("stefanvdvideowindow")[0];
			if(stefanvdregularhtmlplayerb){
				document.getElementsByTagName("video")[0].classList.remove("stefanvdvideowindow");
				videowindow = false;
			}else{
				document.getElementsByTagName("video")[0].classList.add("stefanvdvideowindow");
				videowindow = true;
			}
		}
	}
}

function shadesOff(player){
	if(player !== null){
		// Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
		// skip it and use => videoinwindow
		// if(videoinwindow == true){
		if(window.location.href.match(/^http(s)?:\/\/(www\.)?youtube.com/i)){
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
		if(window.location.href.match(/^http(s)?:\/\/(www\.)?youtube.com/i)){
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

function setexitshortcut(){
	window.addEventListener("keyup", function(e){
		if(e.keyCode == 27){
			if(videowindow == true){
				windowfullaction();
			}
		}
	}, false);
}
setexitshortcut();

// player ready check
function startvideostatus(){
	// inject script for mediafullscreen
	chrome.runtime.sendMessage({name: "sendautoplay"});

	startautoplay = window.setInterval(function(){
		try{
			var youtubeplayer = $("movie_player") || null;
			var htmlplayer = document.getElementsByTagName("video") || null;

			// check first for the HTML5 player
			// if nothing then try the flash for YouTube
			if(htmlplayer !== null){ // html5 video elements
				var j;
				var l = htmlplayer.length;
				for(j = 0; j < l; j++){
					if(htmlplayer[j].pause){ playerReady(htmlplayer[j]); }
				}
			}else{
				if(youtubeplayer !== null){ // youtube video element
					if(youtubeplayer.pauseVideo){ playerReady(youtubeplayer); }
				}
			}
		}catch(e){ console.log(e); } // I see nothing, that is good
	}, 1000); // 1000 refreshing it

	var cinemahandler;
	var messagediv = $("stefanvdfullscreenmessage");
	if(messagediv == null){
		// injected code messaging
		var message = document.createElement("div");
		var bt = document.getElementsByTagName("body"); if(!bt.length)return;
		message.setAttribute("id", "stefanvdfullscreenmessage");
		message.style.display = "none";
		if(!bt.length)return;
		bt[0].appendChild(message);
		cinemahandler = function(){
			var eventData = $(message.id).textContent;
			trigger(eventData);
		};
		$(message.id).addEventListener(message.id, cinemahandler, false);
	}
}

var last_target = null;
document.addEventListener("mousedown", function(event){
	if(event.button !== 2){
		return false;
	}
	last_target = event.target;
	chrome.runtime.sendMessage({name: "updateContextMenu"});
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
	}else if(request.name == "govideoinwindow"){
		windowfullaction();
	}else if(request.name == "injectvideostatus"){
		var script = document.createElement("script"); script.type = "text/javascript"; script.textContent = request.message; document.getElementsByTagName("head")[0].appendChild(script);
	}else if(request.name == "gorefreshvideoinwindow"){
		chrome.storage.sync.get(["videoinwindow", "videooutwindow"], function(items){
			videoinwindow = items["videoinwindow"];
			videooutwindow = items["videooutwindow"];
		});
	}else if(request.name == "gorefreshmediafullscreen"){
		chrome.storage.sync.get(["mediafullscreen"], function(items){
			mediafullscreen = items["mediafullscreen"];
			if(mediafullscreen == true){
				startvideostatus();
			}else{
				window.clearInterval(startautoplay);
			}
		});
	}
});