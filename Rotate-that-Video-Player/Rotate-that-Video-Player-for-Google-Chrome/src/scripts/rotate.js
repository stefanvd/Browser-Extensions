// eslint-disable-next-line no-unused-vars
function startRotate(videorotate, videotop, videoleft, videoscale){
	// Check if the class is already added to the document body head
	var styleElement = document.getElementById("stefanvdrotate-style");
	if(!styleElement){
	// If not added, create a new style element and add it to the head
		styleElement = document.createElement("style");
		styleElement.id = "stefanvdrotate-style";
		document.head.appendChild(styleElement);
	}

	// Generate CSS rule based on the current values
	const transformValue = `rotate(${videorotate}deg) scale(${videoscale / 100}) translate(${videoleft}px, ${videotop}px)`;
	var cssRule = ".stefanvdrotate { transform: " + transformValue + "; }";

	// Update the style element with the new CSS rule
	styleElement.innerHTML = cssRule;

	// Apply the class to the appropriate elements based on the URL
	if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		if(document.getElementById("movie_player")){
			document.getElementById("movie_player").style.zIndex = 1001;
			document.getElementById("movie_player").style.position = "relative";
		}
		if(document.getElementById("player-api")){
			document.getElementById("player-api").style.cssText = "overflow:visible !important";
		}
		if(document.getElementById("player")){
			document.getElementById("player").classList.add("stefanvdrotate");
			document.getElementById("player").style.zIndex = 1001;
		}
	}else if(window.location.href.match(/((http:\/\/(.*vimeo\.com\/.*))|(https:\/\/(.*vimeo\.com\/.*)))/i)){
		var videoWrappers = document.getElementsByClassName("vp-video-wrapper");
		for(var i = 0; i < videoWrappers.length; i++){
			videoWrappers[i].style.overflow = "visible";
		}
		var playerAreas = document.getElementsByClassName("player_area");
		for(var j = 0; j < playerAreas.length; j++){
			playerAreas[j].style.overflow = "visible";
		}
		var rightContentAreas = document.querySelectorAll(".right-content-area-supported");
		for(var k = 0; k < rightContentAreas.length; k++){
			rightContentAreas[k].style.overflow = "visible";
		}
	}else{
		if(document.getElementsByTagName("video")[0]){
			document.getElementsByTagName("video")[0].classList.add("stefanvdrotate");
		}
	}

	// console.log("videorotate", videorotate, "videotop", videotop, "videoleft", videoleft, "videoscale=", videoscale);
	if(videorotate == 0 && videotop == 0 && videoleft == 0 && videoscale == 100){
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