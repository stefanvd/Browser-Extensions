//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
Copyright (C) 2019 Stefan vd
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

function $(id) { return document.getElementById(id); }

window.addEventListener('load', function() {
	chrome.runtime.sendMessage({name: 'stefanfinance'});
}, true);

var height;

var skipPositionedChild = function( node, style ) {
    if ( this.offsetParent &&
         this.offsetParent.tagName !== 'BODY') return true;
    if ( hasPositionedParent(node) ) return true;
    return false;
};

var hasPositionedParent = function( node ){
    if ( node.tagName === 'BODY') return false;
    var parent = node.parentNode;
    var position = getComputedStyle(parent).position;
    if (position !== 'static') {
      return true;
    }
    return hasPositionedParent( parent );
};

function removetoolbar(){
	var checkb = $('stefanvdfinancetoolbar');
	if(checkb){
		document.documentElement.removeChild(checkb);

			var a = document.querySelectorAll('[data-financetoolbar]');

			var a = document.body.getElementsByTagName("*");
			for (var i = 0, len = a.length; i < len; i++) {
					if(a[i].hasAttribute("data-sfttop")){
						a[i].style.top = a[i].getAttribute("data-sfttop");
					}
					if(a[i].hasAttribute("data-sftbottom")){
						a[i].style.bottom = a[i].getAttribute("data-sftbottom");
					}
					if(a[i].hasAttribute("data-sftheight")){
						a[i].style.height = a[i].getAttribute("data-sftheight");
					}
					a[i].setAttribute("data-financetoolbar",false);
			}

	}

	var checkc = $('stefanvdfinanceblocksmall');
	if(checkc){
		document.body.removeChild(checkc);
	}

	var checkd = $('stefanvdfinanceblocklarge');
	if(checkd){
		document.body.removeChild(checkd);
	}

}

function addtoolbar(){
		var checka = $('stefanvdfinancetoolbar');
		if(checka){}else{
			if(doublebar == true){
				height = '61px'; // with border top
			}else{
				height = '30px';
			}
			
			var Children = document.body.getElementsByTagName("*");
			for (var i = 0, len = Children.length; i < len; i++) {

				if(Children[i].currentStyle){
					var x = Children[i].currentStyle["position"];
					var y = Children[i].currentStyle["top"];
					var z = Children[i].currentStyle["bottom"];
					var q = Children[i].currentStyle["height"];
				}
				else if(window.getComputedStyle){
					var st = document.defaultView.getComputedStyle(Children[i], null);
					var x = st.getPropertyValue("position");
					var y = st.getPropertyValue("top");
					var z = st.getPropertyValue("bottom");
					var q = st.getPropertyValue("height");
				}

				if(getpositiontop == true){
					if((x == "absolute" || x == "fixed") && y !== 'auto'){
						if ( x === 'absolute' && skipPositionedChild(Children[i]) ) {}else{
							if(y == "0px"){
								Children[i].setAttribute("data-financetoolbar",true);
								Children[i].setAttribute("data-sfttop",Children[i].style.top);
								Children[i].style.top = parseInt(y, 10) + parseInt(height, 10) + "px";
								// if "top" and "bottom" is 0 => then calc height
								if(q != "auto" && (y=="0px" && z=="0px")){
									Children[i].setAttribute("data-sftheight",q);
									Children[i].style.height = "calc(100% - " + height + ")";		
								}
							}else if(z == "0px"){
								//Children[i].setAttribute("data-financetoolbar",true);
								//Children[i].setAttribute("data-sftbottom",Children[i].style.bottom);
								//Children[i].style.bottom = parseInt(z, 10) + parseInt(height, 10) + "px";
							}
						}
					}
				}else{
					if((x == "absolute" || x == "fixed") && z !== 'auto'){
						if ( x === 'absolute' && skipPositionedChild(Children[i]) ) {}else{
							if(z == "0px"){
								Children[i].setAttribute("data-financetoolbar",true);
								Children[i].setAttribute("data-sftbottom",Children[i].style.bottom);
								Children[i].style.bottom = parseInt(z, 10) + parseInt(height, 10) + "px";
								// if "top" and "bottom" is 0 => then calc height
								if(q != "auto" && (y=="0px" && z=="0px")){
									Children[i].setAttribute("data-sftheight",q);
									Children[i].style.height = "calc(100% - " + height + ")";
								}
							}else if(y == "0px"){
								//Children[i].setAttribute("data-financetoolbar",true);
								//Children[i].setAttribute("data-sftbottom",Children[i].style.bottom);
								//Children[i].style.bottom = parseInt(y, 10) + parseInt(height, 10) + "px";
							}
						}
					}
				}

			}

			if(getpositiontop == true){
				if(doublebar == true){
					var divblock = document.createElement("div");
					divblock.setAttribute('id', "stefanvdfinanceblocklarge");
					document.body.insertBefore(divblock, document.body.firstChild);
				}else{
					var divblock = document.createElement("div");
					divblock.setAttribute('id', "stefanvdfinanceblocksmall");
					document.body.insertBefore(divblock, document.body.firstChild);
				}
			}

			var frame = document.createElement("iframe");
			frame.setAttribute("src", ""+chrome.runtime.getURL('toolbar.html')+"");
			frame.setAttribute('id', "stefanvdfinancetoolbar");
			frame.setAttribute('allowtransparency', "true");
			frame.setAttribute('width','100%');
			if(doublebar == true){
				frame.style.height = "61px";
			}else{
				frame.style.height = "30px";
			}
			frame.style.border = "none";
			frame.style.position = "fixed";
			if(getpositiontop == true){
				frame.style.top = "0px";
			}else{
				frame.style.bottom = "0px";
			}
			frame.style.left = "0px";
			frame.style.marginBottom = "0px";
			frame.style.marginLeft = "0px";
			frame.style.zIndex = 2147483647;
			frame.style.width  = '100%';
			frame.style.boxSizing = "border-box";
			if(dropshadow == true){
				if(getpositiontop == true){
					frame.style.boxShadow = "0px 2px 10px rgba(0,0,0,.2)";
				}else{
					frame.style.boxShadow = "0px -2px 10px rgba(0,0,0,.2)";
				}
			}

			document.documentElement.appendChild(frame);
		}
}

var addbar = null; var dropshadow = null; var allsites = null; var toolbaronly = null; var toolbarDomains = null;var getpositiontop = null; var getpositionbottom = null; var doublebar = null; var toolbarwhite = null; toolbarblack = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendMessage) {
if (request.action == "addremove"){
chrome.storage.sync.get(['addbar','dropshadow','toolbarDomains','allsites','toolbaronly','getpositiontop','getpositionbottom','doublebar','toolbarwhite','toolbarblack'], function(items){
addbar = items['addbar'];
dropshadow = items['dropshadow'];if(dropshadow == null)dropshadow = true;
allsites = items['allsites'];if(allsites == null)allsites = true;
toolbaronly = items['toolbaronly'];if(toolbaronly == null)toolbaronly = false;
toolbarDomains = items['toolbarDomains'];
getpositiontop = items['getpositiontop'];if(getpositiontop == null)getpositiontop = true;
getpositionbottom = items['getpositionbottom'];if(getpositionbottom == null)getpositionbottom = false;
doublebar = items['doublebar'];if(doublebar == null)doublebar = false;
toolbarwhite = items['toolbarwhite'];if(toolbarwhite == null)toolbarwhite = true;
toolbarblack = items['toolbarblack'];if(toolbarblack == null)toolbarblack = false;

if(addbar == true){
	var urlinthelist = false;
	if(toolbaronly == true){
	var currenturl = window.location.protocol + '//' + window.location.host;
	var blackrabbit = false;
	if(typeof toolbarDomains == "string") {
		toolbarDomains = JSON.parse(toolbarDomains);
		var abuf = [];
		for(var domain in toolbarDomains)
			abuf.push(domain);
			abuf.sort();
			for(var i = 0; i < abuf.length; i++){
				if(toolbarwhite == true){
					if(currenturl == abuf[i]){
						// prevent opening in the popup window
						if (window.opener && window.opener !== window) {
							// you are in a popup
						} else {
							addtoolbar();
							urlinthelist = true;
						}
					}
				}
				else if(toolbarblack == true){
					if(currenturl == abuf[i]){blackrabbit=true;}
				}
			}
			if(urlinthelist == false){
				// if the length of the list is done, check if the toolbar visible and if still 'false', then remove this
				removetoolbar();
			}
		}
		if(toolbarblack == true){
			if(blackrabbit == false){
				// prevent opening in the popup window
				if (window.opener && window.opener !== window) {
					// you are in a popup
				} else {
					addtoolbar();
				}
				blackrabbit = false;
			}else{
				removetoolbar();
			}
		}
	}else{
		// prevent opening in the popup window
		if (window.opener && window.opener !== window) {
			// you are in a popup
		} else {
			addtoolbar();
		}
	}
}else{
	removetoolbar();
}
});

} else if (request.action == "toolbarrefresh") {
	removetoolbar();
	addtoolbar();
    //window.location.reload();
}

});