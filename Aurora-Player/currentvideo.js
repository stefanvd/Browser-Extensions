//================================================
/*
 
Aurora Player
Open the video to the video player app
Copyright (C) 2024 Stefan vd
www.stefanvd.net

*/
//================================================

var currentvideo = document.getElementsByTagName("video")[0];
if (currentvideo) {
    var currentweb = window.location.href;
    var videoitem = getVideoSource(currentvideo);
    var openlink = "";
    
    if (isYouTube(currentweb, videoitem)) {
        openlink = "auroraplayer://?yt=" + extractYouTubeVideoId(currentweb);
    } else if (isBilibili(currentweb)) {
        openlink = "auroraplayer://?bi=" + extractBilibiliVideoId(currentweb);
    } else {
        openlink = "auroraplayer://?url=" + videoitem;
    }
    
    if (!currentvideo.paused) {
        currentvideo.pause();
    }
    
    window.open(openlink);
} else {
    var errormessage = chrome.i18n.getMessage("errornovideo");
    alert(errormessage);
}

//---

function isYouTube(url, videoSrc) {
    var youtubeRegExp = /^(https?:\/\/)?(www\.)?(youtube\.com\/)/;
    return youtubeRegExp.test(url);
}

function isBilibili(url) {
    var bilibiliRegex = /^(https?:\/\/)?(www\.)?bilibili\.com/i;
    return bilibiliRegex.test(url);
}

function extractYouTubeVideoId(url) {
    var videoid = url.match(/[?&]v=([^&]+)/);
    return videoid ? videoid[1] : null;
}

function extractBilibiliVideoId(url) {
    var bilibiliRegex = /bilibili\.com\/video\/([^/?]+)/;
    var match = url.match(bilibiliRegex);
    return match && match[1] ? match[1] : null;
}

function getVideoSource(videoElement) {
    var videoSrc = videoElement.src;
    if (!videoSrc) {
        var sources = videoElement.getElementsByTagName("source");
        if (sources.length > 0 && sources[0].src) {
            videoSrc = sources[0].src;
        }
    }
    return videoSrc;
}
