//================================================
/*

Zoom
Zoom in or out on web content using the zoom button for more comfortable reading.
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

var manifestData = chrome.runtime.getManifest();
const GA_TRACKING_ID = "UA-16237836-40";
const GA_CLIENT_ID = "c886270f-b296-4034-ae7e-3cb42b97332d";

let request = new XMLHttpRequest();
let message =
  "v=1&tid=" + GA_TRACKING_ID + "&cid= " + GA_CLIENT_ID + "&aip=1" +
  "&ds=add-on&t=pageview&dp=%2Fbackground.html?version=" + manifestData.version + "";
request.open("POST", "https://www.google-analytics.com/collect", true);
request.send(message);