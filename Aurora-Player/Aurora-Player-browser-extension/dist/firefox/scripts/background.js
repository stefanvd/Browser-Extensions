//================================================
/*

Aurora Player
Open the video to the video player app
Copyright (C) 2024 Stefan vd
www.stefanvd.net

*/
//================================================

chrome.action.onClicked.addListener((tab) => {
	if(tab.url.startsWith("http://") || tab.url.startsWith("https://")){
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			files: ["scripts/currentvideo.js"]
		});
	}
});