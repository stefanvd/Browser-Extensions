//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
Copyright (C) 2016 Stefan vd
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

chrome.runtime.onMessage.addListener(function(request, sender, sendMessage) {
if (request.action == "addremove"){
var addbar = null; var dropshadow = null;
chrome.storage.sync.get(['addbar','dropshadow'], function(items){
addbar = items['addbar'];
dropshadow = items['dropshadow'];if(dropshadow == null)dropshadow = true;
if(addbar == true){
	var check1 = $('stefanvdfinancetoolbar');
	if(check1){}else{
	document.body.style.position = "relative";
	document.getElementsByTagName('html')[0].style.position = 'absolute';
	document.getElementsByTagName('html')[0].style.top = '0px';
	document.getElementsByTagName('html')[0].style.left = '0px';
	document.getElementsByTagName('html')[0].style.right = '0px';
	document.getElementsByTagName('html')[0].style.bottom = '0px';
	document.getElementsByTagName('html')[0].style.marginTop = '30px';
	var frame = document.createElement("iframe");
	frame.setAttribute("src", ""+chrome.runtime.getURL('toolbar.html')+"");
	frame.setAttribute('id', "stefanvdfinancetoolbar");
	frame.setAttribute('allowtransparency', "true");
	frame.setAttribute('width','100%');
	frame.style.height = "30px";
	frame.style.border = "none";
	frame.style.position = "fixed";
	frame.style.top = "0px";
	frame.style.left = "0px";
	frame.style.marginBottom = "0px";
	frame.style.marginLeft = "0px";
	frame.style.zIndex = 2147483647;
	frame.style.width  = '100%';
	if(dropshadow == true){
		frame.style.boxShadow = "0px 2px 10px rgba(0,0,0,.2)";
	}
	document.body.insertBefore(frame, document.body.firstChild);
	}
}else{
	var check2 = $('stefanvdfinancetoolbar');
	if(check2){
	document.body.removeChild(check2);
	document.body.style.position = "relative";
	document.getElementsByTagName('html')[0].style.top = '0px';
	document.getElementsByTagName('html')[0].style.marginTop = '0px';
}
}
});

} else if (request.action == "toolbarrefresh") {
    window.location.reload();
}

});