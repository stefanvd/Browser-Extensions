//================================================
/*

Proper Menubar
Add the black menubar below the addresbar. To get easy and fast access to all your Google products.
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

var check2 = $('stefanvdnavwrappe');
if(check2){
		document.body.removeChild(check2);
		document.getElementsByTagName('html')[0].style.top = '0px';
		document.getElementsByTagName('html')[0].style.marginTop = '0px';
	
		if (window.location.href.match("https://plus.google.com")){
		$("gb").style.marginTop = "0px";

		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('Msd Fge Ide b-K b-K-Xb yld')) {div[i].style.cssText='top: 60px !important;';}}

		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('Dge fOa vld')) {div[i].style.cssText='top: 60px !important;';}}
		
		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('rw Uc ZJ aK')) {div[i].style.cssText='top: 60px !important;';}}

		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('GSc n7c DJb OVd')) {div[i].style.cssText='top: 104px !important;';}}
		}
		
		// spreadsheet Google
		if (window.location.href.match("https://docs.google.com")){
			//spread
			if($("docs-editor-container")){
			$("docs-editor-container").style.top = "0px";
			$("docs-editor-container").style.position = "relative";
			}
		
			if($("grid-bottom-bar")){
			$("docs-editor").style.bottom = "0px";
			$("docs-editor").style.position = "relative";
			}
		}
		
		if(window.location.href.match("http://mail.google.com") || window.location.href.match("https://mail.google.com")){
		// class detect
		var div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('gb_ub gb_l gb_Ua')) {
			div[i].style.position = "relative";div[i].style.top = '0px';
		}}
		
		$("gba").style.height = '0px';
		// use id detect
		$("gb").style.position = "relative";
		$("gb").style.top = '0px';
		}
		
		if(window.location.href.match("http://www.google.com/maps") || window.location.href.match("https://www.google.com/maps")){
			if($("content-container")){ $("content-container").style.top = '0px'; }
		}
		
		if(window.location.href.match("http://www.youtube.com") || window.location.href.match("https://www.youtube.com")){
			if($("masthead-positioner")){ $("masthead-positioner").style.zIndex = 'auto'; $("masthead-positioner").style.top = '0px'; }
			if($("appbar-guide-menu")){ $("appbar-guide-menu").style.top = '0px'; }
		}
	}