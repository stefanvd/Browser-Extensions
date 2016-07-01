function $(id) { return document.getElementById(id); }

function read_options(){
	// load current languages
	document.title = chrome.i18n.getMessage("optionpagetitle");
	
	// load current languages
	setText('name', chrome.i18n.getMessage("name"));
	setText('head2', chrome.i18n.getMessage("head2"));
	setText('textfoot', chrome.i18n.getMessage("textfoot"));

	setText('managed-prefs-text', chrome.i18n.getMessage('donatepromotext'));
	
	setText('version', chrome.i18n.getMessage('version'));
	setText('changelog', chrome.i18n.getMessage('changelog'));
	setText('reportbug', chrome.i18n.getMessage('reportbug'));
	
	setText('settings', chrome.i18n.getMessage('settings'));
	setText('basicsettings', chrome.i18n.getMessage('basicsettings'));

	// load tab div
	var tabListItems = document.getElementById('navbar').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == 'LI' ) {
		var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
		var id = getHash( tabLink.getAttribute('onclick') );
		tabLinks[id] = tabLink;
		contentDivs[id] = document.getElementById( id );
        }
    }
    
    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;
 
    for ( var id in tabLinks ) {
    	tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function() { this.blur() };
		if ( i == 0 ) tabLinks[id].className = 'navbar-item-selected';
		i++;
    }
    
    // Hide all content divs except the first
    var i = 0;
 
    for ( var id in contentDivs ) {
    	if ( i != 0 ) contentDivs[id].className = 'page hidden';
        i++;
    }

    // display version number
    function displayVersionNumber() {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", chrome.extension.getURL('manifest.json'), false);
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              var theManifest = JSON.parse(this.responseText);
              document.getElementById("version_number").innerText = theManifest.version;
            }
          };
          xhr.send();
        } catch (ex) {} // silently fail
    }
    displayVersionNumber();

}

// find element to load
function setText(elementId, text) {
document.getElementById(elementId).innerText = text;
}

// tabel script
    var tabLinks = new Array();
    var contentDivs = new Array();
 
    function showTab() {
      var selectedId = getHash( this.getAttribute('onclick') );
 
      // Highlight the selected tab, and dim all others.
      // Also show the selected content div, and hide all others.
      for ( var id in contentDivs ) {
        if ( id == selectedId ) {
          tabLinks[id].className = 'navbar-item-selected';
          contentDivs[id].className = 'page';
        } else {
          tabLinks[id].className = '';
          contentDivs[id].className = 'page hidden';
        }
      }
 
      // Stop the browser following the link
      return false;
    }
 
    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }
 
    function getHash( url ) {
      var hashPos = url.lastIndexOf ( '#' );
      return url.substring( hashPos + 1 );
    }
	
	
	
// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

document.addEventListener('DOMContentLoaded', function () {
read_options(); yearnow();

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

$("o1").addEventListener('click', function() {document.images['preview'].src='reel19.png'});
$("p1").addEventListener('click', function() {document.images['preview'].src='icon.png'});
$("p2").addEventListener('click', function() {document.images['preview'].src='gray19.png'});
$("p3").addEventListener('click', function() {document.images['preview'].src='whitegray19.png'});
$("p4").addEventListener('click', function() {document.images['preview'].src='white19.png'});
$("p5").addEventListener('click', function() {document.images['preview'].src='wood19.png'});
$("p6").addEventListener('click', function() {document.images['preview'].src='gold19.png'});
$("p7").addEventListener('click', function() {document.images['preview'].src='darkgreen19.png'});
$("p8").addEventListener('click', function() {document.images['preview'].src='green19.png'});
$("p9").addEventListener('click', function() {document.images['preview'].src='pink19.png'});
$("p10").addEventListener('click', function() {document.images['preview'].src='red19.png'});


// save all setting
var colors = document.getElementsByClassName("color");
for(var i=0,ii=colors.length;i<ii;i++){
	colors[i].addEventListener("click", changeColor);
}

function changeColor(e){
	localStorage["icon"] = e.target.src;
	chrome.browserAction.setIcon({"path":localStorage["icon"]});
}

});	