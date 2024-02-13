//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2024 Stefan vd
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

let redirectionHosts = [linkredirectionoptions];
if(redirectionHosts.includes(window.location.href)){
	if($("allowpermission")){
		$("allowpermission").className = "";
		chrome.runtime.sendMessage({name: "redirectionoptions"});
	}
	if($("disallowpermission")){
		$("disallowpermission").className = "hidden";
	}
}

// settings
var startautofullscreen = null, contextmenus = null, autofullscreen = null, videoinwindow = null, videooutwindow = null, autofullscreenDomains, autofullscreenonly, autofullscreenchecklistblack, autofullscreenchecklistwhite = null;

chrome.storage.sync.get(["contextmenus", "autofullscreen", "videoinwindow", "videooutwindow", "autofullscreenonly", "autofullscreenchecklistwhite", "autofullscreenchecklistblack"], function(items){
	contextmenus = items["contextmenus"]; if(contextmenus == null)contextmenus = true;
	autofullscreen = items["autofullscreen"]; if(autofullscreen == null)autofullscreen = false;
	videoinwindow = items["videoinwindow"]; if(videoinwindow == null)videoinwindow = true;
	videooutwindow = items["videooutwindow"]; if(videooutwindow == null)videooutwindow = false;
	autofullscreenonly = items["autofullscreenonly"]; if(autofullscreenonly == null)autofullscreenonly = false;
	autofullscreenchecklistwhite = items["autofullscreenchecklistwhite"]; if(autofullscreenchecklistwhite == null)autofullscreenchecklistwhite = true;
	autofullscreenchecklistblack = items["autofullscreenchecklistblack"]; if(autofullscreenchecklistblack == null)autofullscreenchecklistblack = false;

	if(autofullscreen == true){
		addautofullscreenfile();
	}
	runautofullscreencheck();
});

// auto bring the html5 or youtube video to fullscreen
function addautofullscreenfile(){
	if(!document.getElementById("fsautofullscreen")){
		var script = document.createElement("script"); script.id = "fsautofullscreen"; script.type = "text/javascript"; script.src = chrome.runtime.getURL("scripts/video-player-status.js"); document.getElementsByTagName("head")[0].appendChild(script);
	}
}

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
	// this.playerPause(player);
	// this.playerReset(player);
}

function autofullscreenfunction(){
	// player ready check
	startautofullscreen = window.setInterval(function(){
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

function checkregdomaininside(thaturl, websiteurl){
	// regex test
	var rxUrlSplit = /((?:http|ftp)s?):\/\/([^/]+)(\/.*)?/;
	var prepUrl = ""; var m;
	if((m = thaturl.match(rxUrlSplit)) !== null){
		prepUrl = m[1] + "://" + m[2].replace(/[?()[\]\\.+^$|]/g, "\\$&").replace(/\*\\./g, "(?:[^/]*\\.)*").replace(/\*$/, "[^/]*");
		if(m[3]){
			prepUrl += m[3].replace(/[?()[\]\\.+^$|]/g, "\\$&").replace(/\/\*(?=$|\/)/g, "(?:/[^]*)?");
		}
	}
	if(prepUrl){
		// console.log(prepUrl); // ^http://(?:[^/]*\.)*google\.com(?:/[^]*)?$
		if(websiteurl.match(RegExp("^" + prepUrl + "$", "i"))){
			return true;
		}else{
			return false;
		}
	}
	return false;
}

function runautofullscreencheck(){
	if(autofullscreen == true){
		if(autofullscreenonly == true){
			var currenturl = window.location.protocol + "//" + window.location.host;
			var blackrabbit = false;
			if(typeof autofullscreenDomains == "string"){
				autofullscreenDomains = JSON.parse(autofullscreenDomains);
				var abuf = [];
				var domain;
				for(domain in autofullscreenDomains)
					abuf.push(domain);
				abuf.sort();
				var i;
				var l = abuf.length;
				for(i = 0; i < l; i++){
					if(autofullscreenchecklistwhite == true){
						if(abuf[i].includes("*")){
							// regex test
							if(checkregdomaininside(abuf[i], currenturl) == true){
								autofullscreenfunction();
							}
						}else{
							// regular text
							if(currenturl == abuf[i]){ autofullscreenfunction(); }
						}
					}else if(autofullscreenchecklistblack == true){
						if(abuf[i].includes("*")){
							// regex test
							if(checkregdomaininside(abuf[i], currenturl) == true){
								blackrabbit = true;
							}
						}else{
							// regular text
							if(currenturl == abuf[i]){ blackrabbit = true; }
						}
					}
				}
			}
			if(autofullscreenchecklistblack == true && blackrabbit == false){ autofullscreenfunction(); }
		}else{ autofullscreenfunction(); }
	} // option autofullscreen on end
}

var videowindow = false;
var checktheatermode;
var initialtheatermode = false;
var thatPrevControlEnabled = false;
function windowfullaction(){
	if(document.getElementsByTagName("video")[0]){
		if(window.location.href.match(/^http(s)?:\/\/(www\.)?youtube.com/i)){
			// YouTube website
			// var playertheater = document.getElementById("player-theater-container");
			var playercontrols = document.getElementsByClassName("ytp-chrome-bottom")[0];
			var playercontainer = document.getElementById("ytd-player");

			var masthead = $("masthead-container");
			if(masthead)masthead.style.cssText = "z-index:auto !important";

			if(playercontainer){
				var stefanvdregularhtmlplayer = document.getElementsByClassName("stefanvdvideowindow")[0];
				var original = document.getElementsByClassName("ytp-size-button")[0];
				var watchContainer = document.querySelector("ytd-watch-flexy");
				if(stefanvdregularhtmlplayer){
					if(!initialtheatermode){
						original.click();
					}
					playercontainer.classList.remove("stefanvdvideowindow");
					// playertheater.classList.remove("stefanvdvideotheather");
					playercontrols.classList.remove("stefanvdvideocontrols");
					document.getElementsByTagName("video")[0].classList.remove("stefanvdvideowindow");

					videowindow = false;
					removeexitshortcut();
				}else{
					checktheatermode = watchContainer ? watchContainer.hasAttribute("theater") : true;
					initialtheatermode = checktheatermode;
					if(!checktheatermode){
						original.click();
						checktheatermode = true;
					}
					playercontainer.classList.add("stefanvdvideowindow");
					// playertheater.classList.add("stefanvdvideotheather");
					playercontrols.classList.add("stefanvdvideocontrols");
					document.getElementsByTagName("video")[0].classList.add("stefanvdvideowindow");

					videowindow = true;
					setexitshortcut();
				}
			}
		}else{
			// regular HTML5 video
			var stefanvdregularhtmlplayerb = document.getElementsByClassName("stefanvdvideowindow")[0];
			if(stefanvdregularhtmlplayerb){
				document.getElementsByTagName("video")[0].classList.remove("stefanvdvideowindow");
				if(thatPrevControlEnabled == true){
					document.getElementsByTagName("video")[0].controls = true;
				}else{
					document.getElementsByTagName("video")[0].controls = false;
				}
				videowindow = false;
				removeexitshortcut();
			}else{
				document.getElementsByTagName("video")[0].classList.add("stefanvdvideowindow");
				if(document.getElementsByTagName("video")[0].hasAttribute("controls")){
					thatPrevControlEnabled = true;
				}
				document.getElementsByTagName("video")[0].controls = true;
				videowindow = true;
				setexitshortcut();
			}
		}
	}
}

function shortcut(e){
	if(e.keyCode == 27){
		if(videowindow == true){
			windowfullaction();
		}
	}
}
function removeexitshortcut(){
	window.removeEventListener("keyup", shortcut, false);
}
function setexitshortcut(){
	window.addEventListener("keyup", shortcut, false);
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

function removeElement(elementId){
	var element = document.getElementById(elementId);
	element.parentNode.removeChild(element);
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
	}else if(request.name == "gorefreshvideoinwindow"){
		chrome.storage.sync.get(["videoinwindow", "videooutwindow"], function(items){
			videoinwindow = items["videoinwindow"];
			videooutwindow = items["videooutwindow"];
		});
	}else if(request.name == "gorefreshautofullscreen"){
		chrome.storage.sync.get(["autofullscreen"], function(items){
			autofullscreen = items["autofullscreen"];
			autofullscreenonly = items["autofullscreenonly"]; if(autofullscreenonly == null)autofullscreenonly = false;
			autofullscreenchecklistwhite = items["autofullscreenchecklistwhite"]; if(autofullscreenchecklistwhite == null)autofullscreenchecklistwhite = true;
			autofullscreenchecklistblack = items["autofullscreenchecklistblack"]; if(autofullscreenchecklistblack == null)autofullscreenchecklistblack = false;
			if(autofullscreen == true){
				addautofullscreenfile();
				runautofullscreencheck();
			}else{
				// remove
				window.clearInterval(startautofullscreen);
				if(document.getElementById("fsautofullscreen")){
					removeElement("fsautofullscreen");
				}
				if(document.getElementById("stefanvdfullscreenmessage")){
					removeElement("stefanvdfullscreenmessage");
				}
			}
		});
	}
});