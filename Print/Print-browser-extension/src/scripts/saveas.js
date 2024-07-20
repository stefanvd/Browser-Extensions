//================================================
/*

Print
Print the current page you see.
Copyright (C) 2024 Stefan vd
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

// save as a html file
var currenturl = window.location.href;
if((currenturl.match(/^http/i) || currenturl.match(/^file/i))){
	var saveHTML = function(fileName){
		var escapedHTML = document.body.innerHTML;
		var link = document.createElement("a");
		link.download = fileName;
		link.href = "data:text/plain," + escapedHTML;
		link.click();
	};
	saveHTML("page.html");
}