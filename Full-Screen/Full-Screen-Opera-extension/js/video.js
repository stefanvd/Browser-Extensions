//================================================
/*

Full Screen
Go full screen with one click on the button.
Copyright (C) 2017 Stefan vd
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

if(document.getElementsByTagName('video')[0]){

if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
    // YouTube website
        var ytplayerapi = document.getElementById("player-api");
        var playercontainer = document.getElementById("player-container");

        var pagemanager = $('page-manager');
        if(pagemanager)$('page-manager').style.cssText = 'z-index:auto !important';

        if(playercontainer){
            var stefanvdregularhtmlplayer = document.getElementsByClassName('stefanvdvideowindow')[0];
            var stefanyoutubecontrols = document.getElementsByClassName('ytp-chrome-bottom')[0];
            if(stefanvdregularhtmlplayer){
                playercontainer.classList.remove("stefanvdvideowindow");
                document.getElementsByTagName('video')[0].classList.remove("stefanvdvideowindow");
                videowindow = false;
            } else {
                if(document.getElementsByTagName('video')[0].paused == false){
                playercontainer.classList.add('stefanvdvideowindow');
                document.getElementsByTagName('video')[0].classList.add('stefanvdvideowindow');
                stefanyoutubecontrols.style.cssText = "width:100% !important";
                videowindow = true;
                }
            }
        }
        else if(ytplayerapi){
            var stefanvdregularhtmlplayer = document.getElementsByClassName('stefanvdvideowindow')[0];
            var stefanyoutubecontrols = document.getElementsByClassName('ytp-chrome-bottom')[0];
            if(stefanvdregularhtmlplayer){
                ytplayerapi.classList.remove("stefanvdvideowindow");
                document.getElementsByTagName('video')[0].classList.remove("stefanvdvideowindow");
                videowindow = false;
            } else {
                if(document.getElementsByTagName('video')[0].paused == false){
                ytplayerapi.classList.add('stefanvdvideowindow');
                document.getElementsByTagName('video')[0].classList.add('stefanvdvideowindow');
                stefanyoutubecontrols.style.width = "98%";
                videowindow = true;
                }
            }
        }
}else{
if(document.documentElement.requestFullScreen) {
document.getElementsByTagName('video')[0].requestFullScreen();
} else if (document.documentElement.mozRequestFullScreen) {
document.getElementsByTagName('video')[0].mozRequestFullScreen();
} else if (document.documentElement.webkitRequestFullScreen) {
document.getElementsByTagName('video')[0].webkitRequestFullScreen();
}
}

}
else{

if (document.documentElement.requestFullScreen) {
document.documentElement.requestFullScreen();
} else if (document.documentElement.mozRequestFullScreen) {
document.documentElement.mozRequestFullScreen();
} else if (document.documentElement.webkitRequestFullScreen) {
document.documentElement.webkitRequestFullScreen();
}

}