chrome.browserAction.onClicked.addListener(function(tab) {
  var action_url = "javascript:window.print();";
  chrome.tabs.update(tab.id, {url: action_url});
});

var icon = localStorage["icon"];if(icon == undefined){icon = "icon.png";localStorage["icon"] = icon;}
chrome.browserAction.setIcon({"path":localStorage["icon"]});

if ((localStorage["firstRun"]!="false") && (localStorage["firstRun"]!=false)){
  chrome.tabs.create({url: "http://www.stefanvd.net/project/printchrome.htm", selected:true})
  localStorage["firstRun"] = false;
  localStorage["version"]  = "2.0.2";
}