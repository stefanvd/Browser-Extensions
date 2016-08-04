//================================================
/*
 
Date Today
The best clock to see in one glance the current day and time. With an option to see the digital clock in the browser toolbar.
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

var clickedElement = null;
// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'getpaste') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        clickedElement.value += msg.topaste;
    }
});

window.addEventListener('contextmenu', function(event) {
clickedElement = event.target;
}, false);