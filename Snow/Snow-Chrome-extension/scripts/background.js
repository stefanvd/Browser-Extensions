var linkwelcome = "http://www.stefanvd.net/project/snow/browser/google-chrome/welcome/";
var linkuninstall = "http://www.stefanvd.net/project/snow/browser/google-chrome/uninstall/";

chrome.runtime.setUninstallURL(linkuninstall);

chrome.action.onClicked.addListener(function(tab) {chrome.tabs.executeScript(null,{file:"snowstorm-min.js"});});

function initwelcome(){
	chrome.storage.sync.get(["firstRun"], function(chromeset){
		if((chromeset["firstRun"] != "false") && (chromeset["firstRun"] != false)){
			chrome.tabs.create({url: linkwelcome});
			var crrinstall = new Date().getTime();
			chrome.storage.sync.set({"firstRun": false, "version": "1.1", "firstDate": crrinstall});
		}
	});
}

function installation(){
	initwelcome();
}

chrome.runtime.onInstalled.addListener(function(){
	installation();
});