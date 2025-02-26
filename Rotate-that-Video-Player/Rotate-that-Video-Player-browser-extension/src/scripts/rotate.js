//================================================
/*

Rotate that Video Player
Improve your video experience by effortlessly rotating your video clips by 90, 180, or 270 degrees.
Copyright (C) 2025 Stefan vd
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

// eslint-disable-next-line no-unused-vars
function startRotate(videorotate, videotop, videoleft, videoscale, videoscalex, videoscaley){
	// Check if the style element is already added to the document head
	var styleElement = document.getElementById("stefanvdrotate-style");
	if(!styleElement){
		// If not added, create a new style element and add it to the head
		styleElement = document.createElement("style");
		styleElement.id = "stefanvdrotate-style";
		document.head.appendChild(styleElement);
	}

	// Generate CSS rule based on the current values
	const transformValue = `rotate(${videorotate}deg) scale(${videoscale / 100}) translate(${videoleft}px, ${videotop}px) scaleX(${videoscalex / 100}) scaleY(${videoscaley / 100})`;
	var cssRule = `.stefanvdrotate { transform: ${transformValue}; }`;

	// Remove any existing rules from the style element
	while(styleElement.sheet.cssRules.length > 0){
		styleElement.sheet.deleteRule(0);
	}

	// Insert the new CSS rule into the style element's stylesheet
	styleElement.sheet.insertRule(cssRule, 0);

	// Apply the class to the appropriate elements based on the URL
	function applyRotationClass(){
		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
			if(document.getElementById("movie_player")){
				document.getElementById("movie_player").style.zIndex = 1001;
				document.getElementById("movie_player").style.position = "relative";
			}
			if(document.getElementById("player-api")){
				document.getElementById("player-api").style.cssText = "overflow:visible !important";
			}
			const player = document.getElementById("player");
			if(player && !player.classList.contains("stefanvdrotate")){
				player.classList.add("stefanvdrotate");
				player.style.zIndex = 1001;
			}
		}else if(window.location.href.match(/((http:\/\/(.*vimeo\.com\/.*))|(https:\/\/(.*vimeo\.com\/.*)))/i)){
			const videoWrappers = document.getElementsByClassName("vp-video-wrapper");
			for(let i = 0; i < videoWrappers.length; i++){
				videoWrappers[i].style.overflow = "visible";
			}
			const playerAreas = document.getElementsByClassName("player_area");
			for(let j = 0; j < playerAreas.length; j++){
				playerAreas[j].style.overflow = "visible";
			}
			const rightContentAreas = document.querySelectorAll(".right-content-area-supported");
			for(let k = 0; k < rightContentAreas.length; k++){
				rightContentAreas[k].style.overflow = "visible";
			}
		}else{
			const video = document.getElementsByTagName("video")[0];
			if(video && !video.classList.contains("stefanvdrotate")){
				video.classList.add("stefanvdrotate");
			}
		}
	}

	// Initial application of rotation class
	applyRotationClass();

	function checkPlayerAndApplyRotation(){
		// Check if the current URL is a YouTube link
		if(window.location.href.match(/^(http:\/\/|https:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*/i)){
			// Check if the element with id "player" exists and has the class "stefanvdrotate"
			const playerElement = document.getElementById("player");

			if(!playerElement || !playerElement.classList.contains("stefanvdrotate")){
				applyRotationClass(); // Call the function if the conditions are met
			}
		}
	}

	// Run the check initially
	checkPlayerAndApplyRotation();

	// Optional: If you still want to observe for any future changes to the DOM
	const observer = new MutationObserver(() => {
		checkPlayerAndApplyRotation(); // Check again after any changes
	});

	// Start observing the body and its inner nodes for child node changes
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	if(videorotate == 0 && videotop == 0 && videoleft == 0 && videoscale == 100 && videoscalex == 100 && videoscaley == 100){
		console.log("delete here stefan");

		var item = document.getElementById("stefanvdrotate-style");
		if(item){
			item.parentNode.removeChild(item);
		}
		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
			if(document.getElementById("player").classList.contains("stefanvdrotate")){
				document.getElementById("player").classList.remove("stefanvdrotate");
			}
		}else{
			var video = document.getElementsByTagName("video")[0];
			if(video && video.classList.contains("stefanvdrotate")){
				video.classList.remove("stefanvdrotate");
			}
		}
	}
}