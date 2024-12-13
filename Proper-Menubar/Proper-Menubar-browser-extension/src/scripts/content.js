//================================================
/*

Proper Menubar
Add the best menu bar to get easy and fast access to all your useful browser options and internet products!
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

function $(id){ return document.getElementById(id); }

// Install on www.stefanvd.net
if(window.location.href.match(/^http(s)?:\/\/(www\.)?stefanvd.net/i)){
	if($("proper-menubar-" + exbrowser + "-install-button")){
		$("proper-menubar-" + exbrowser + "-install-button").style.display = "none";
		$("proper-menubar-" + exbrowser + "-thanks-button").style.display = "block";
	}
}

var faviconserver = "https://s2.googleusercontent.com/s2/favicons?domain=";
function createbrowserbookmark(){
	chrome.runtime.sendMessage({action: "getBookmarks"}, (response) => {
		if(response.type == true){
			if(response.resp){
				renderBookmarks(response.resp[0].children, SD("list"));
			}
		}else{
			if(response.resp){
				renderBookmarks(response.resp[0].children, SD("list"));
			}
		}
	});
}

function renderBookmarks(bookmarks, parentElement){
	var rgb = hex2rgb(backgroundhex);
	bookmarks.forEach(function(bookmark){
		if(parentElement){
			if(bookmark.children){
				// Create a sublist for folders
				var sublist = document.createElement("ul");
				sublist.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
				sublist.className = "hideitem";

				// Check if folder has children
				if(bookmark.children.length > 0){
					renderBookmarks(bookmark.children, sublist);
				}else{
					// Add "empty" menu item if folder is empty
					var emptyItem = document.createElement("li");
					emptyItem.textContent = "(" + chrome.i18n.getMessage("titelempty") + ")";
					emptyItem.style.color = fontcolor;
					emptyItem.className = "empty-item";
					sublist.appendChild(emptyItem);
				}

				var listItemsub = document.createElement("li");
				var folderLink = document.createElement("a");
				folderLink.href = "#";
				folderLink.style.color = fontcolor;

				// Create folder icon
				var folderIcon = document.createElement("img");
				folderIcon.src = chrome.runtime.getURL("images/folder@2x.png");
				folderIcon.alt = "Folder Icon";
				folderIcon.height = 16;
				folderIcon.width = 16;
				folderLink.appendChild(folderIcon); // Append folder icon inside the link

				// Create span for bookmark title
				var titleSpan = document.createElement("div");
				titleSpan.textContent = bookmark.title;
				folderLink.appendChild(titleSpan);

				// Create arrow element for folder
				var arrow = document.createElement("div");
				arrow.textContent = "⌃";
				arrow.style.marginLeft = "10px";
				arrow.style.float = "right";
				arrow.style.transform = "rotate(90deg)";
				folderLink.appendChild(arrow);

				listItemsub.appendChild(folderLink);
				listItemsub.appendChild(sublist);
				parentElement.appendChild(listItemsub);

				// Add event listeners for mouseenter and mouseleave
				listItemsub.addEventListener("mouseenter", function(){
					sublist.className = "showitem";
				});

				listItemsub.addEventListener("mouseleave", function(){
					sublist.className = "hideitem";
				});

				// Folder is expanded or collapsed
				folderLink.addEventListener("click", function(event){
					event.preventDefault();
					if(sublist.className === "hideitem"){
						sublist.className = "showitem";
					}else{
						sublist.className = "hideitem";
					}
				});

				// Add class for CSS styling
				listItemsub.classList.add("bookmark-item");
			}else{
				// Create list item for bookmarks
				var listItem = document.createElement("li");
				var link = document.createElement("a");
				link.href = bookmark.url;
				link.style.color = fontcolor;
				link.addEventListener("click", function(event){
					// Prevent the default action of following the link
					event.preventDefault();
					openweb(bookmark.url, existingtab);
					SD("btnfile").checked = false;
					SD("btnedit").checked = false;
					SD("btnview").checked = false;
					SD("btnhistory").checked = false;
					SD("btnbookmarks").checked = false;
					SD("btnwindow").checked = false;
					SD("btnhelp").checked = false;
					let existingDiv = SD("menubookmarks");
					if(existingDiv){
						existingDiv.parentNode.removeChild(existingDiv); // Remove the div
					}
				});

				// Create favicon
				var favicon = document.createElement("img");
				favicon.src = faviconserver + getDomain(bookmark.url);
				favicon.alt = "Favicon";
				favicon.height = 16;
				favicon.width = 16;
				link.appendChild(favicon); // Append favicon inside the link

				// Create span for bookmark title
				var titleSpanRoot = document.createElement("div");
				titleSpanRoot.textContent = bookmark.title;
				link.appendChild(titleSpanRoot);

				listItem.appendChild(link);
				parentElement.appendChild(listItem);

				// Add class for CSS styling
				listItem.classList.add("bookmark-item");
			}
		}
	});
}

// Function to extract domain from URL
function getDomain(url){
	var domain;
	// Find & remove protocol (http, https, ftp) and get domain
	if(url.indexOf("://") > -1){
		domain = url.split("/")[2];
	}else{
		domain = url.split("/")[0];
	}
	// Find & remove port number
	domain = domain.split(":")[0];
	return domain;
}

function openweb(url, openInNewTab){
	if(openInNewTab == true){
		// Open the URL in the current window
		window.location.href = url;
	}else{
		// Open the URL in a new tab
		window.open(url, "_blank");
	}
}

function hex2rgb(hex){
	if(hex[0] == "#") hex = hex.substr(1);
	if(hex.length == 3){
		var temp = hex; hex = "";
		temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
		for(var i = 0; i < 3; i++) hex += temp[i] + temp[i];
	}
	var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
	return{
		red:   parseInt(triplets[0], 16),
		green: parseInt(triplets[1], 16),
		blue:  parseInt(triplets[2], 16)
	};
}

var el;
function SD(id){ return el.shadowRoot.getElementById(id); }

function createmenubar(a, b, c, d, e){
	var newdropdowncontent = SD(e[0]);
	if(!newdropdowncontent){
		var newdropdown = document.createElement("label");
		newdropdown.setAttribute("for", e[0]);

		// automatically open new panel with hover
		if(hovermenu == true){
			newdropdown.addEventListener("mouseover", function(event){
				if(SD("btnfile").checked || SD("btnedit").checked || SD("btnview").checked || SD("btnhistory").checked || SD("btnbookmarks").checked || SD("btnwindow").checked || SD("btnhelp").checked){
					SD("btnfile").checked = false;
					SD("btnedit").checked = false;
					SD("btnview").checked = false;
					SD("btnhistory").checked = false;
					SD("btnbookmarks").checked = false;
					SD("btnwindow").checked = false;
					SD("btnhelp").checked = false;
					// enable the current panel
					SD(this.getAttribute("for")).checked = true;
				}

				if(event.target.id != "hyperbtnviewbookmarks"){
					let existingDiv = SD("menubookmarks");
					if(existingDiv){
						existingDiv.parentNode.removeChild(existingDiv); // Remove the div
					}
				}
			}, false);
		}

		newtoolbarul.appendChild(newdropdown);

		var newinputcheck = document.createElement("input");
		newinputcheck.setAttribute("id", e[0]);
		newinputcheck.setAttribute("type", "checkbox");
		newinputcheck.setAttribute("name", "ppcontrol");
		if(e[1] != ""){
			newinputcheck.setAttribute("accesskey", e[1]);
		}
		newinputcheck.addEventListener("change", function(event){
			if(event.target.id == e[0]){
				if(event.target.checked == true){
					var inputs, index;
					inputs = newtoolbarul.getElementsByTagName("input");
					for(index = 0; index < inputs.length; ++index){
						if(inputs[index].id != event.target.id){
							inputs[index].checked = false;
						}
					}
				}
			}
		}, false);
		newdropdown.appendChild(newinputcheck);

		var newdropdowna = document.createElement("a");
		newdropdowna.style.color = fontcolor;
		newdropdowna.id = "hyper" + e[0];
		newdropdowna.innerHTML = d;
		newdropdowna.tabIndex = 0;
		newdropdown.appendChild(newdropdowna);

		var rgb = hex2rgb(backgroundhex);
		var newdropdowncontentpart = document.createElement("div");
		newdropdowncontentpart.setAttribute("id", c);
		newdropdowncontentpart.setAttribute("class", c);
		if(getpositiontop == true){
			newdropdowncontentpart.style.top = height;
		}else{
			newdropdowncontentpart.style.bottom = height;
		}
		newdropdowncontentpart.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
		newdropdown.appendChild(newdropdowncontentpart);
	}
	// create the link
	var newdropdowncontentlink = SD(c);
	var newdropdowncontentul;
	if(newdropdowncontentlink.getElementsByTagName("ul")[0]){
		newdropdowncontentul = newdropdowncontentlink.getElementsByTagName("ul")[0];
	}else{
		newdropdowncontentul = document.createElement("ul");
		newdropdowncontentlink.appendChild(newdropdowncontentul);
	}

	var newdropdowncontentli = document.createElement("li");
	newdropdowncontentul.appendChild(newdropdowncontentli);

	var newdropdowncontentlia = document.createElement("a");
	newdropdowncontentlia.setAttribute("id", b[0]);
	if(b[1] != ""){
		newdropdowncontentlia.setAttribute("accesskey", b[1]);
	}
	newdropdowncontentlia.style.color = fontcolor;
	newdropdowncontentlia.innerHTML = a;
	newdropdowncontentlia.tabIndex = 0;
	newdropdowncontentli.appendChild(newdropdowncontentlia);
}

function createline(a){
	var hrelement = document.createElement("hr");
	SD(a).getElementsByTagName("ul")[0].appendChild(hrelement);
}

var numberitems = 0;
function createlink(a, b, c){
	// only the first 13 in the bar, rest dropdown menu
	if(numberitems < display){
		var newtoolbarulli = document.createElement("li");
		newtoolbarul.appendChild(newtoolbarulli);

		var newtoolbarullia = document.createElement("a");
		if(search != true){
			if(existingtab == true){ newtoolbarullia.setAttribute("target", "_self"); }else{ newtoolbarullia.setAttribute("target", "_blank"); }
		}

		newtoolbarullia.setAttribute("id", c);
		newtoolbarullia.style.color = fontcolor;
		newtoolbarullia.innerHTML = a;
		if(search != true){
			newtoolbarullia.setAttribute("href", b);
		}
		newtoolbarulli.appendChild(newtoolbarullia);
	}else{
		newdropdowncontent = SD("stefanvdpropermenubardropdown");
		if(!newdropdowncontent){
			var newdropdown = document.createElement("li");
			newdropdown.setAttribute("id", "stefanvdpropermenubardropdown");
			newtoolbarul.appendChild(newdropdown);

			var newdropdowna = document.createElement("a");
			newdropdowna.setAttribute("id", "stefanvdpropermenubarmore");
			newdropdowna.style.color = fontcolor;
			newdropdowna.innerHTML = chrome.i18n.getMessage("linkmore");
			newdropdowna.setAttribute("href", "#");
			newdropdown.appendChild(newdropdowna);

			var rgb = hex2rgb(backgroundhex);
			var newdropdowncontentpart = document.createElement("div");
			newdropdowncontentpart.setAttribute("id", "stefanvdpropermenubardropdowncontent");
			newdropdowncontentpart.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
			if(getpositiontop == true){
				newdropdowncontentpart.style.top = height;
			}else{
				newdropdowncontentpart.style.bottom = height;
			}
			newdropdown.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
			newdropdown.appendChild(newdropdowncontentpart);
		}
		// create the link
		var newdropdowncontent = SD("stefanvdpropermenubardropdowncontent");
		var newdropdowncontentli = document.createElement("li");
		newdropdowncontent.appendChild(newdropdowncontentli);

		var newdropdowncontentlia = document.createElement("a");
		if(search != true){
			if(existingtab == true){ newdropdowncontentlia.setAttribute("target", "_self"); }else{ newdropdowncontentlia.setAttribute("target", "_blank"); }
		}
		newdropdowncontentlia.setAttribute("id", c);
		newdropdowncontentlia.style.color = fontcolor;
		newdropdowncontentlia.innerHTML = a;
		newdropdowncontentlia.setAttribute("href", b);
		newdropdowncontentli.appendChild(newdropdowncontentlia);
	}
	numberitems = numberitems + 1;
}

window.addEventListener("load", function(){
	chrome.runtime.sendMessage({name: "stefanproper"});
}, true);

var height;

var skipPositionedChild = function(node){
	if(this.offsetParent &&
         this.offsetParent.tagName !== "BODY")return true;
	if(hasPositionedParent(node))return true;
	return false;
};

var hasPositionedParent = function(node){
	if(node.tagName === "BODY")return false;
	var parent = node.parentNode;
	var position = getComputedStyle(parent).position;
	if(position !== "static"){
		return true;
	}
	return hasPositionedParent(parent);
};

function removetoolbar(){
	var checkb = $("stefanvdpropermenubar");
	if(checkb){
		document.documentElement.removeChild(checkb);
		var a = document.body.getElementsByTagName("*");
		for(var i = 0, len = a.length; i < len; i++){
			if(a[i].hasAttribute("data-spmtop")){
				a[i].style.marginTop = a[i].getAttribute("data-spmtop");
			}
			if(a[i].hasAttribute("data-spmbottom")){
				a[i].style.bottom = a[i].getAttribute("data-spmbottom");
			}
			if(a[i].hasAttribute("data-spmheight")){
				a[i].style.height = a[i].getAttribute("data-spmheight");
			}
			a[i].setAttribute("data-propermenubar", false);
		}
	}

	var checkc = $("stefanvdproperblocksmall");
	if(checkc){
		document.body.removeChild(checkc);
	}

	el = null;
	newtoolbardiv = null;
	newtoolbarul = null;
	numberitems = 0;
}

var i18nlink1a = chrome.i18n.getMessage("link1a");
var i18nlink2a = chrome.i18n.getMessage("link2a");
var i18nlink3a = chrome.i18n.getMessage("link3a");
var i18nlink4a = chrome.i18n.getMessage("link4a");
var i18nlink5a = chrome.i18n.getMessage("link5a");
var i18nlink6a = chrome.i18n.getMessage("link6a");
var i18nlink7a = chrome.i18n.getMessage("link7a");
var i18nlink8a = chrome.i18n.getMessage("link8a");
var i18nlink9a = chrome.i18n.getMessage("link9a");
var i18nlink10a = chrome.i18n.getMessage("link10a");
var i18nlink11a = chrome.i18n.getMessage("link11a");
var i18nlink12a = chrome.i18n.getMessage("link12a");
var i18nlink13a = chrome.i18n.getMessage("link13a");
var i18nlink14a = chrome.i18n.getMessage("link14a");
var i18nlink15a = chrome.i18n.getMessage("link15a");
var i18nlink16a = chrome.i18n.getMessage("link16a");
var i18nlink17a = chrome.i18n.getMessage("link17a");
var i18nlink18a = chrome.i18n.getMessage("link18a");
var i18nlink19a = chrome.i18n.getMessage("link19a");
var i18nlink20a = chrome.i18n.getMessage("link20a");
var i18nlink21a = chrome.i18n.getMessage("link21a");
var i18nlink22a = chrome.i18n.getMessage("link22a");
var i18nlink23a = chrome.i18n.getMessage("link23a");
var i18nlink24a = chrome.i18n.getMessage("link24a");
var i18nlink25a = chrome.i18n.getMessage("link25a");
var i18nlink26a = chrome.i18n.getMessage("link26a");
var i18nlink27a = chrome.i18n.getMessage("link27a");
var i18nlink28a = chrome.i18n.getMessage("link28a");
var i18nlink29a = chrome.i18n.getMessage("link29a");
var i18nlink30a = chrome.i18n.getMessage("link30a");
var i18nlink31a = chrome.i18n.getMessage("link31a");
var i18nlink32a = chrome.i18n.getMessage("link32a");
var i18nlink33a = chrome.i18n.getMessage("link33a");
var i18nlink34a = chrome.i18n.getMessage("link34a");
var i18nlink35a = chrome.i18n.getMessage("link35a");
var i18nlink36a = chrome.i18n.getMessage("link36a");
var i18nlink37a = chrome.i18n.getMessage("link37a");
var i18nlink38a = chrome.i18n.getMessage("link38a");
var i18nlink39a = chrome.i18n.getMessage("link39a");
var i18nlink40a = chrome.i18n.getMessage("link40a");
var i18nlink41a = chrome.i18n.getMessage("link41a");
var i18nlink42a = chrome.i18n.getMessage("link42a");
var i18nlink43a = chrome.i18n.getMessage("link43a");
var i18nlink44a = chrome.i18n.getMessage("link44a");
var i18nlink45a = chrome.i18n.getMessage("link45a");
var i18nlink46a = chrome.i18n.getMessage("link46a");
var i18nlink47a = chrome.i18n.getMessage("link47a");
var i18nlink48a = chrome.i18n.getMessage("link48a");
var i18nlink49a = chrome.i18n.getMessage("link49a");
var i18nlink50a = chrome.i18n.getMessage("link50a");
var i18nlink51a = chrome.i18n.getMessage("link51a");
var i18nlink52a = chrome.i18n.getMessage("link52a");
var i18nlink53a = chrome.i18n.getMessage("link53a");

// Simple clean browser menu bar
var i18nmenufile = chrome.i18n.getMessage("menufile");
var i18nmenuedit = chrome.i18n.getMessage("menuedit");
var i18nmenuview = chrome.i18n.getMessage("menuview");
var i18nmenuhistory = chrome.i18n.getMessage("menuhistory");
var i18nmenubookmarks = chrome.i18n.getMessage("menubookmarks");
var i18nmenuwindow = chrome.i18n.getMessage("menuwindow");
var i18nmenuhelp = chrome.i18n.getMessage("menuhelp");
var i18nmenu1a = chrome.i18n.getMessage("menu1a");
var i18nmenu2a = chrome.i18n.getMessage("menu2a");
var i18nmenu3a = chrome.i18n.getMessage("menu3a");
var i18nmenu4a = chrome.i18n.getMessage("menu4a");
var i18nmenu5a = chrome.i18n.getMessage("menu5a");
var i18nmenu6a = chrome.i18n.getMessage("menu6a");
var i18nmenu7a = chrome.i18n.getMessage("menu7a");
var i18nmenu8a = chrome.i18n.getMessage("menu8a");
var i18nmenu9a = chrome.i18n.getMessage("menu9a");
var i18nmenu10a = chrome.i18n.getMessage("menu10a");
var i18nmenu11a = chrome.i18n.getMessage("menu11a");
var i18nmenu12a = chrome.i18n.getMessage("menu12a");
var i18nmenu13a = chrome.i18n.getMessage("menu13a");
var i18nmenu14a = chrome.i18n.getMessage("menu14a");
var i18nmenu15a = chrome.i18n.getMessage("menu15a");
var i18nmenu16a = chrome.i18n.getMessage("menu16a");
var i18nmenu17a = chrome.i18n.getMessage("menu17a");
var i18nmenu18a = chrome.i18n.getMessage("menu18a");
var i18nmenu19a = chrome.i18n.getMessage("menu19a");
var i18nmenu20a = chrome.i18n.getMessage("menu20a");
var i18nmenu21a = chrome.i18n.getMessage("menu21a");
var i18nmenu22a = chrome.i18n.getMessage("menu22a");
var i18nmenu23a = chrome.i18n.getMessage("menu23a");
var i18nmenu24a = chrome.i18n.getMessage("menu24a");
var i18nmenu25a = chrome.i18n.getMessage("menu25a");
var i18nmenu26a = chrome.i18n.getMessage("menu26a");
var i18nmenu27a = chrome.i18n.getMessage("menu27a");
var i18nmenu28a = chrome.i18n.getMessage("menu28a");
var i18nmenu29a = chrome.i18n.getMessage("menu29a");
var i18nmenu30a = chrome.i18n.getMessage("menu30a");
var i18nmenu31a = chrome.i18n.getMessage("menu31a");
var i18nmenu32a = chrome.i18n.getMessage("menu32a");
var i18nmenu33a = chrome.i18n.getMessage("menu33a");
var i18nmenu34a = chrome.i18n.getMessage("menu34a");
var i18nmenu35a = chrome.i18n.getMessage("menu35a");
var i18nmenu36a = chrome.i18n.getMessage("menu36a");
var i18nmenu37a = chrome.i18n.getMessage("menu37a");
var i18nmenu38a = chrome.i18n.getMessage("menu38a");
var i18nmenu39a = chrome.i18n.getMessage("menu39a");
var i18nmenu40a = chrome.i18n.getMessage("menu40a");
var i18nmenu41a = chrome.i18n.getMessage("menu41a");
// var i18nmenu42a = chrome.i18n.getMessage("menu42a");
var i18nmenu43a = chrome.i18n.getMessage("menu43a");
var i18nmenu44a = chrome.i18n.getMessage("menu44a");
var i18nmenu45a = chrome.i18n.getMessage("menu45a");
var i18nmenu46a = chrome.i18n.getMessage("menu46a");
var i18nmenu47a = chrome.i18n.getMessage("menu47a");
var i18nmenu48a = chrome.i18n.getMessage("menu48a");

var i18nviewbookmarks = chrome.i18n.getMessage("menuviewbookmarks");

var taskchangepositiontop = false;
var x, w, v, y, z, q;
var newtoolbardiv;
var newtoolbarul;
function addtoolbar(){
	var checka = $("stefanvdpropermenubar");
	if(!checka){
		height = "30px";

		var Children = document.body.getElementsByTagName("*");
		for(var i = 0, len = Children.length; i < len; i++){

			if(Children[i].currentStyle){
				x = Children[i].currentStyle["position"];
				w = Children[i].currentStyle["margin-top"];
				v = Children[i].currentStyle["margin-bottom"];
				y = Children[i].currentStyle["top"];
				z = Children[i].currentStyle["bottom"];
				q = Children[i].currentStyle["height"];
			}else if(window.getComputedStyle){
				var st = document.defaultView.getComputedStyle(Children[i], null);
				x = st.getPropertyValue("position");
				w = st.getPropertyValue("margin-top");
				v = st.getPropertyValue("margin-bottom");
				y = st.getPropertyValue("top");
				z = st.getPropertyValue("bottom");
				q = st.getPropertyValue("height");
			}

			if(getpositiontop == true){
				if((x == "absolute" || x == "fixed") && y !== "auto"){
					taskchangepositiontop = false;
					if(x === "absolute" && skipPositionedChild(Children[i])){
						taskchangepositiontop = false;
					}else{
						if(x === "fixed"){
							if(y == height){
								taskchangepositiontop = false;
							}else{
								taskchangepositiontop = true;
							}
						}else{
							// absolute
							taskchangepositiontop = true;
						}
					}


					if(taskchangepositiontop == true){
						Children[i].setAttribute("data-propermenubar", true);
						if(w != ""){
							Children[i].setAttribute("data-spmtop", w);
							Children[i].style.marginTop = parseInt(w, 10) + parseInt(height, 10) + "px";
						}else if(v != ""){
							Children[i].setAttribute("data-spmbottom", w);
							Children[i].style.marginBottom = parseInt(w, 10) + parseInt(height, 10) + "px";
						}

						// if "top" and "bottom" is 0 => then calc height
						if((q != "0px") && (y == "0px" && z == "0px")){
							Children[i].setAttribute("data-spmheight", q);
							Children[i].style.height = "calc( " + q + " - " + height + ")";
						}
					}
				}
			}else{
				if((x == "absolute" || x == "fixed") && z !== "auto"){
					if(x != "absolute" && !skipPositionedChild(Children[i])){
						Children[i].setAttribute("data-propermenubar", true);
						Children[i].setAttribute("data-spmbottom", w);
						Children[i].style.marginBottom = parseInt(z, 10) + parseInt(height, 10) + "px";
						// if "top" and "bottom" is 0 => then calc height
						if((q != "0px") && (y == "0px" && z == "0px")){
							Children[i].setAttribute("data-spmheight", q);
							Children[i].style.height = "calc( " + q + " - " + height + ")";
						}
					}
				}
			}

		}

		if(getpositiontop == true){
			var divblock = document.createElement("div");
			divblock.setAttribute("id", "stefanvdproperblocksmall");
			document.body.insertBefore(divblock, document.body.firstChild);
		}

		var frame = document.createElement("proper-menubar");
		frame.setAttribute("id", "stefanvdpropermenubar");
		frame.setAttribute("role", "toolbar");
		frame.style.height = "30px";
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
		frame.style.width = "100%";
		frame.style.boxSizing = "border-box";
		if(dropshadow == true){
			if(getpositiontop == true){
				frame.style.boxShadow = "0px 2px 10px rgba(0,0,0,.2)";
			}else{
				frame.style.boxShadow = "0px -2px 10px rgba(0,0,0,.2)";
			}
		}
		document.documentElement.appendChild(frame);

		//------
		el = document.querySelector("#stefanvdpropermenubar");
		el.attachShadow({mode: "open"});
		// Just like prototype & constructor bi-directional references, we have...
		// el.shadowRoot // the shadow root.
		// el.shadowRoot.host // the element itself.

		var link = document.createElement("link");
		link.id = "csspalette";
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = chrome.runtime.getURL("styles/toolbar.css");
		link.media = "all";
		// wait for the CSS is loaded, then show the bar
		link.onload = function(){
			newtoolbar.style.display = "block";
		};
		el.shadowRoot.appendChild(link);
		//----

		// inject CSS for the hover effect
		try{
			var pmcssbar = "#stefanvdnavwrappe #stefanvdpropermenubarnav li:hover a,#stefanvdnavwrappe #stefanvdpropermenubarnav a:focus,#stefanvdnavwrappe #stefanvdpropermenubarnav a:active{padding:0 7px;line-height:30px!important;color:" + hovertextcolor + "!important;background:" + hoverbackground + "!important;text-decoration:none;height:30px;font-weight:normal}#stefanvdnavwrappe #stefanvdpropermenubarclose:hover{color:" + hovertextcolor + "!important}#stefanvdnavwrappe #stefanvdpropermenubarnav label a:hover{color:" + hovertextcolor + "!important;background:" + hoverbackground + "!important;}#menubookmarks a:hover{background:" + hoverbackground + "}";

			if($("csspropermenubar")){
				var elem = el.shadowRoot.getElementById("csspropermenubar");
				elem.parentElement.removeChild(elem);
			}

			var css = document.createElement("style");
			css.setAttribute("id", "csspropermenubar");
			css.type = "text/css";
			css.appendChild(document.createTextNode(pmcssbar));
			el.shadowRoot.appendChild(css);
		}catch(e){
			// console.log(e);
		}

		//---
		var newtoolbar = document.createElement("div");
		newtoolbar.addEventListener("contextmenu", function(e){
			e.preventDefault();
		}, false);
		newtoolbar.setAttribute("id", "stefanvdnavwrappe");
		if(getpositionbottom == false){
			newtoolbar.dataset.bar = "top";
		}else{
			newtoolbar.dataset.bar = "bottom";
		}
		newtoolbar.style.display = "none"; // Hide the menu until everything is loaded
		newtoolbar.style.zIndex = "2147483647";
		newtoolbar.style.width = "100%";
		// newtoolbar.style.height = "30px";
		newtoolbar.style.border = "0";
		if(backgroundcolor == true){
			var rgb = hex2rgb(backgroundhex);
			newtoolbar.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
		}
		if(backgroundimage == true){
			if(backgroundimagesource == ""){ newtoolbar.style.background = "url(" + chrome.runtime.getURL("/images/slice1.png") + ")"; }else{ newtoolbar.style.background = "url(" + backgroundimagesource + ")"; }
		}
		if(dropshadow == true){
			newtoolbar.style.boxShadow = "0px 2px 10px rgba(0,0,0,.2)";
		}
		el.shadowRoot.appendChild(newtoolbar);

		var newtoolbarclose = document.createElement("div");
		newtoolbarclose.setAttribute("id", "stefanvdpropermenubarclose");
		newtoolbarclose.innerText = "X";
		newtoolbarclose.style.color = fontcolor;
		newtoolbarclose.addEventListener("click", function(){
			chrome.runtime.sendMessage({name: "stefanremovebar"});
		}, false);
		newtoolbar.appendChild(newtoolbarclose);

		newtoolbardiv = document.createElement("div");
		newtoolbardiv.setAttribute("id", "stefanvdpropermenubarnav");
		newtoolbar.appendChild(newtoolbardiv);

		newtoolbarul = document.createElement("ul");
		newtoolbarul.className = "stefanvdpropermenubarroot";
		newtoolbardiv.appendChild(newtoolbarul);

		// gmail app
		// https://mail.google.com/a/turnoffthelights.com
		// calendar
		// https://calendar.google.com/a/turnoffthelights.com
		// drive
		// https://drive.google.com/a/turnoffthelights.com

		if(googleproducts == true){
			// Parse googlebarDomains if it's a string
			if(typeof googlebarDomains === "string"){
				googlebarDomains = JSON.parse(googlebarDomains);
			}

			const domainKeys = Object.keys(googlebarDomains || {});
			const links = [
				{key: "link1a", i18n: i18nlink1a, product: productlink1, selector: "link1s", searchLink: productlinksearch1},
				{key: "link2a", i18n: i18nlink2a, product: productlink2, selector: "link2s", searchLink: productlinksearch2},
				{key: "link3a", i18n: i18nlink3a, product: productlink3, selector: "link3s", searchLink: productlinksearch3},
				{key: "link4a", i18n: i18nlink4a, product: productlink4, selector: "link4s", searchLink: productlinksearch4},
				{key: "link5a", i18n: i18nlink5a, product: productlink5, selector: "link5s", searchLink: productlinksearch5},
				{key: "link6a", i18n: i18nlink6a, product: productlink6, selector: "link6s", searchLink: productlinksearch6},
				{key: "link7a", i18n: i18nlink7a, product: productlink7, selector: "link7s", searchLink: productlinksearch7},
				{key: "link8a", i18n: i18nlink8a, product: productlink8, selector: "link8s", searchLink: productlinksearch8},
				{key: "link9a", i18n: i18nlink9a, product: productlink9, selector: "link9s", searchLink: productlinksearch9},
				{key: "link10a", i18n: i18nlink10a, product: productlink10, selector: "link10s", searchLink: productlinksearch10},
				{key: "link11a", i18n: i18nlink11a, product: productlink11, selector: "link11s", searchLink: productlinksearch11},
				{key: "link12a", i18n: i18nlink12a, product: productlink12, selector: "link12s", searchLink: productlinksearch12},
				{key: "link13a", i18n: i18nlink13a, product: productlink13, selector: "link13s", searchLink: productlinksearch13},
				{key: "link14a", i18n: i18nlink14a, product: productlink14, selector: "link14s", searchLink: productlinksearch14},
				{key: "link15a", i18n: i18nlink15a, product: productlink15, selector: "link15s", searchLink: productlinksearch15},
				{key: "link16a", i18n: i18nlink16a, product: productlink16, selector: "link16s", searchLink: productlinksearch16},
				{key: "link17a", i18n: i18nlink17a, product: productlink17, selector: "link17s", searchLink: productlinksearch17},
				{key: "link18a", i18n: i18nlink18a, product: productlink18, selector: "link18s", searchLink: productlinksearch18},
				{key: "link19a", i18n: i18nlink19a, product: productlink19, selector: "link19s", searchLink: productlinksearch19},
				{key: "link20a", i18n: i18nlink20a, product: productlink20, selector: "link20s", searchLink: productlinksearch20},
				{key: "link22a", i18n: i18nlink22a, product: productlink22, selector: "link22s", searchLink: productlinksearch22},
				{key: "link23a", i18n: i18nlink23a, product: productlink23, selector: "link23s", searchLink: productlinksearch23},
				{key: "link24a", i18n: i18nlink24a, product: productlink24, selector: "link24s", searchLink: productlinksearch24},
				{key: "link25a", i18n: i18nlink25a, product: productlink25, selector: "link25s", searchLink: productlinksearch25},
				{key: "link26a", i18n: i18nlink26a, product: productlink26, selector: "link26s", searchLink: productlinksearch26},
				{key: "link27a", i18n: i18nlink27a, product: productlink27, selector: "link27s", searchLink: productlinksearch27},
				{key: "link28a", i18n: i18nlink28a, product: productlink28, selector: "link28s", searchLink: productlinksearch28},
				{key: "link29a", i18n: i18nlink29a, product: productlink29, selector: "link29s", searchLink: productlinksearch29},
				{key: "link30a", i18n: i18nlink30a, product: productlink30, selector: "link30s", searchLink: productlinksearch30},
				{key: "link31a", i18n: i18nlink31a, product: productlink31, selector: "link31s", searchLink: productlinksearch31},
				{key: "link32a", i18n: i18nlink32a, product: productlink32, selector: "link32s", searchLink: productlinksearch32},
				{key: "link33a", i18n: i18nlink33a, product: productlink33, selector: "link33s", searchLink: productlinksearch33},
				{key: "link34a", i18n: i18nlink34a, product: productlink34, selector: "link34s", searchLink: productlinksearch34},
				{key: "link35a", i18n: i18nlink35a, product: productlink35, selector: "link35s", searchLink: productlinksearch35},
				{key: "link36a", i18n: i18nlink36a, product: productlink36, selector: "link36s", searchLink: productlinksearch36},
				{key: "link37a", i18n: i18nlink37a, product: productlink37, selector: "link37s", searchLink: productlinksearch37},
				{key: "link38a", i18n: i18nlink38a, product: productlink38, selector: "link38s", searchLink: productlinksearch38},
				{key: "link39a", i18n: i18nlink39a, product: productlink39, selector: "link39s", searchLink: productlinksearch39},
				{key: "link40a", i18n: i18nlink40a, product: productlink40, selector: "link40s", searchLink: productlinksearch40},
				{key: "link41a", i18n: i18nlink41a, product: productlink41, selector: "link41s", searchLink: productlinksearch41},
				{key: "link42a", i18n: i18nlink42a, product: productlink42, selector: "link42s", searchLink: productlinksearch42},
				{key: "link43a", i18n: i18nlink43a, product: productlink43, selector: "link43s", searchLink: productlinksearch43},
				{key: "link44a", i18n: i18nlink44a, product: productlink44, selector: "link44s", searchLink: productlinksearch44},
				{key: "link45a", i18n: i18nlink45a, product: productlink45, selector: "link45s", searchLink: productlinksearch45},
				{key: "link46a", i18n: i18nlink46a, product: productlink46, selector: "link46s", searchLink: productlinksearch46},
				{key: "link47a", i18n: i18nlink47a, product: productlink47, selector: "link47s", searchLink: productlinksearch47},
				{key: "link48a", i18n: i18nlink48a, product: productlink48, selector: "link48s", searchLink: productlinksearch48},
				{key: "link49a", i18n: i18nlink49a, product: productlink49, selector: "link49s", searchLink: productlinksearch49},
				{key: "link50a", i18n: i18nlink50a, product: productlink50, selector: "link50s", searchLink: productlinksearch50},
				{key: "link51a", i18n: i18nlink51a, product: productlink51, selector: "link51s", searchLink: productlinksearch51},
				{key: "link52a", i18n: i18nlink52a, product: productlink52, selector: "link52s", searchLink: productlinksearch52},
				{key: "link53a", i18n: i18nlink53a, product: productlink53, selector: "link53s", searchLink: productlinksearch53},
				// other
				{key: "link21a", i18n: i18nlink21a, product: productlink21, selector: "link21s", searchLink: productlinksearch21}
			];

			// Create links based on googlebarDomains
			links.forEach((link) => {
				if(domainKeys.includes(link.key)){
					createlink(link.i18n, link.product, link.selector);
				}
			});

			if(search === true){
				const pushNewTab = existingtab ? "_self" : "_blank";
				const keyword = getkeyword();

				links.forEach((link) => {
					const element = SD(link.selector);
					if(element){
						const finalLink = keyword ? link.searchLink : link.product;
						element.addEventListener("click", () => propopenurl(finalLink, pushNewTab), false);
					}
				});
			}
		}else{
			// Regular file menu bar
			document.addEventListener("click", function(event){
				if(menuproducts == true){
					if(event.target.id == "btnfile" || event.target.id == "btnedit" || event.target.id == "btnview" || event.target.id == "btnhistory" || event.target.id == "btnbookmarks" || event.target.id == "btnwindow" || event.target.id == "btnhelp" || event.target.id == "stefanvdpropermenubar"){
						// console.log(event);
					}else{
						SD("btnfile").checked = false;
						SD("btnedit").checked = false;
						SD("btnview").checked = false;
						SD("btnhistory").checked = false;
						SD("btnbookmarks").checked = false;
						SD("btnwindow").checked = false;
						SD("btnhelp").checked = false;

						// remove browser bookmarks panel
						var element = SD("menubookmarks");
						if(element){
							element.parentNode.removeChild(element);
						}
					}
				}
			});

			// File
			var rootfile = ["btnfile", "f"];
			createmenubar(i18nmenu1a, ["menu1s", "t"], "panelfile", i18nmenufile, rootfile);
			SD("menu1s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleannewtab"});
			}, false);
			createmenubar(i18nmenu2a, ["menu2s", "w"], "panelfile", i18nmenufile, rootfile);
			SD("menu2s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleannewwindow"});
			}, false);
			createmenubar(i18nmenu3a, ["menu3s", "i"], "panelfile", i18nmenufile, rootfile);
			SD("menu3s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleannewwindowincognito"});
			}, false);
			createline("panelfile");
			createmenubar(i18nmenu48a, ["menu48s", "c"], "panelfile", i18nmenufile, rootfile);
			SD("menu48s").addEventListener("click", function(){
				runopenfile();
			}, false);
			createmenubar(i18nmenu4a, ["menu4s", "c"], "panelfile", i18nmenufile, rootfile);
			SD("menu4s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleanclosewindow"});
			}, false);
			createmenubar(i18nmenu5a, ["menu5s", "x"], "panelfile", i18nmenufile, rootfile);
			SD("menu5s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleanclosetab"});
			}, false);
			createmenubar(i18nmenu27a, ["menu27s", "h"], "panelfile", i18nmenufile, rootfile);
			SD("menu27s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefansavemhtml"});
			}, false);
			createline("panelfile");
			createmenubar(i18nmenu6a, ["menu6s", "p"], "panelfile", i18nmenufile, rootfile);
			SD("menu6s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanprint"});
			}, false);
			createline("panelfile");
			createmenubar(i18nmenu45a, ["menu45s", "q"], "panelfile", i18nmenufile, rootfile);
			SD("menu45s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanexit"});
			}, false);

			// Edit
			var rootedit = ["btnedit", "e"];
			createmenubar(i18nmenu7a, ["menu7s", ""], "paneledit", i18nmenuedit, rootedit);
			SD("menu7s").addEventListener("click", function(){
				document.execCommand("cut");
			}, false);
			createmenubar(i18nmenu8a, ["menu8s", ""], "paneledit", i18nmenuedit, rootedit);
			SD("menu8s").addEventListener("click", function(){
				document.execCommand("copy");
			}, false);
			createmenubar(i18nmenu9a, ["menu9s", ""], "paneledit", i18nmenuedit, rootedit);
			SD("menu9s").addEventListener("click", function(){
				document.execCommand("paste");
			}, false);
			createline("paneledit");
			createmenubar(i18nmenu10a, ["menu10s", ""], "paneledit", i18nmenuedit, rootedit);
			SD("menu10s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefansettings"});
			}, false);
			createline("paneledit");
			createmenubar(i18nmenu11a, ["menu11s", ""], "paneledit", i18nmenuedit, rootedit);
			SD("menu11s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanselectall"});
			}, false);

			// View
			var rootview = ["btnview", "v"];
			createmenubar(i18nmenu12a, ["menu12s", ""], "panelview", i18nmenuview, rootview);
			SD("menu12s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanstoppage"});
			}, false);
			createmenubar(i18nmenu28a, ["menu28s", ""], "panelview", i18nmenuview, rootview);
			SD("menu28s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanreloadpage"});
			}, false);
			createline("panelview");
			createmenubar(i18nmenu29a, ["menu29s", ""], "panelview", i18nmenuview, rootview);
			SD("menu29s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanfullscreenpage"});
			}, false);
			createmenubar(i18nmenu30a, ["menu30s", ""], "panelview", i18nmenuview, rootview);
			SD("menu30s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoomactual"});
			}, false);
			createmenubar(i18nmenu31a, ["menu31s", ""], "panelview", i18nmenuview, rootview);
			SD("menu31s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoomin"});
			}, false);
			createmenubar(i18nmenu32a, ["menu32s", ""], "panelview", i18nmenuview, rootview);
			SD("menu32s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoomout"});
			}, false);
			createmenubar(i18nmenu47a, ["menu47s", ""], "panelview", i18nmenuview, rootview);
			SD("menu47s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanviewsource"});
			}, false);

			// History
			var roothistory = ["btnhistory", "h"];
			createmenubar(i18nmenu13a, ["menu13s", ""], "panelhistory", i18nmenuhistory, roothistory);
			SD("menu13s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhometab"});
			}, false);
			createmenubar(i18nmenu19a, ["menu19s", ""], "panelhistory", i18nmenuhistory, roothistory);
			SD("menu19s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhistoryback"});
			}, false);
			createmenubar(i18nmenu20a, ["menu20s", ""], "panelhistory", i18nmenuhistory, roothistory);
			SD("menu20s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhistoryforward"});
			}, false);
			createline("panelhistory");
			createmenubar(i18nmenu26a, ["menu26s", ""], "panelhistory", i18nmenuhistory, roothistory);
			SD("menu26s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhistory"});
			}, false);

			// Bookmarks
			var rootbookmarks = ["btnbookmarks", "b"];
			createmenubar(i18nmenu14a, ["menu14s", ""], "panelbookmarks", i18nmenubookmarks, rootbookmarks);
			SD("menu14s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanbookmarkmanager"});
			}, false);
			createmenubar(i18nmenu18a, ["menu18s", ""], "panelbookmarks", i18nmenubookmarks, rootbookmarks);
			SD("menu18s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanbookmarkadd"});
			}, false);
			createmenubar(i18nmenu33a, ["menu33s", ""], "panelbookmarks", i18nmenubookmarks, rootbookmarks);
			SD("menu33s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanbookmarkaddall"});
			}, false);
			createline("panelbookmarks");
			var panelbookmarks = SD("panelbookmarks");
			const div = document.createElement("div");
			const ul = document.createElement("ul");
			div.appendChild(ul);
			const li = document.createElement("li");
			ul.appendChild(li);
			const a = document.createElement("a");
			a.id = "hyperbtnviewbookmarks";
			a.innerText = i18nviewbookmarks;
			a.style.color = fontcolor;

			let menubookmarks; // Variable to store the reference of the "menubookmarks" div
			a.addEventListener("mouseover", function(event){
				// Parent container where the new div will be added
				const parentNav = SD("stefanvdnavwrappe");

				var rgb = hex2rgb(backgroundhex);
				// Check if the div with ID "menubookmarks" already exists inside the parent container
				let existingDiv = SD("menubookmarks");
				if(!existingDiv){
					// Create the new div if it doesn't exist
					menubookmarks = document.createElement("div");
					menubookmarks.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
					menubookmarks.id = "menubookmarks";
					if(getpositionbottom == false){
						menubookmarks.className = "top";
					}else{
						menubookmarks.className = "bottom";
					}

					// Add ul and other elements inside the new div
					const newUl = document.createElement("ul");
					newUl.id = "list";
					menubookmarks.appendChild(newUl);

					// Get the position of the hovered element
					const rect = event.target.getBoundingClientRect();

					// Set the position of the new div
					menubookmarks.style.position = "absolute";
					if(getpositionbottom == false){
						menubookmarks.style.top = `${rect.top + window.scrollY - 5}px`;
						menubookmarks.style.left = `${rect.right + window.scrollX - 8}px`;
					}else{
						menubookmarks.style.bottom = "30px";
						menubookmarks.style.left = `${rect.right + window.scrollX - 8}px`;
					}

					// Add event listeners to remove the div when the mouse leaves
					menubookmarks.addEventListener("mouseleave", function(){
						// Remove the div when the mouse leaves the "menubookmarks" area
						if(document.body.contains(menubookmarks)){
							let existingDiv = SD("menubookmarks");
							if(existingDiv){
								existingDiv.parentNode.removeChild(existingDiv); // Remove the div
							}
							menubookmarks = null;
						}
					});

					// Append the new div to the "stefanvdpropermenubarnav" container
					parentNav.appendChild(menubookmarks);
					createbrowserbookmark();
				}
			});

			a.addEventListener("mouseleave", function(event){
				// Check if the mouse moved to the "menubookmarks" area
				const relatedTarget = event.relatedTarget;
				if(menubookmarks && (!relatedTarget || !menubookmarks.contains(relatedTarget))){
					let existingDiv = SD("menubookmarks");
					if(existingDiv){
						existingDiv.parentNode.removeChild(existingDiv); // Remove the div
					}
				}
			});
			li.appendChild(a);

			var arrow = document.createElement("div");
			arrow.textContent = "⌃";
			arrow.style.margin = "0 10px";
			arrow.style.float = "right";
			arrow.style.transform = "rotate(90deg)";
			a.appendChild(arrow);

			panelbookmarks.appendChild(div);

			// Window
			var rootwindow = ["btnwindow", "w"];
			createmenubar(i18nmenu43a, ["menu43s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu43s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanminimise"});
			}, false);
			createmenubar(i18nmenu44a, ["menu44s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu44s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmaximize"});
			}, false);
			createline("panelwindow");
			createmenubar(i18nmenu15a, ["menu15s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu15s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanswitchtabright"});
			}, false);
			createmenubar(i18nmenu34a, ["menu34s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu34s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanswitchtableft"});
			}, false);
			createmenubar(i18nmenu35a, ["menu35s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu35s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanduplicatetab"});
			}, false);
			createmenubar(i18nmenu36a, ["menu36s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu36s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanpintab"}, function(response){
					if(response.pinit == true){
						SD("menu36s").innerText = i18nmenu36a;
					}else{
						SD("menu36s").innerText = i18nmenu46a;
					}
				});
			}, false);
			createline("panelwindow");
			createmenubar(i18nmenu37a, ["menu37s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu37s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmutetab"}, function(response){
					if(response.soundoff == true){
						SD("menu37s").innerText = i18nmenu37a;
					}else{
						SD("menu37s").innerText = i18nmenu40a;
					}
				});
			}, false);
			createmenubar(i18nmenu38a, ["menu38s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu38s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmuteothertab"});
				// i18nmenu42a
			}, false);
			createmenubar(i18nmenu39a, ["menu39s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu39s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmutealltabs"}, function(response){
					if(response.soundoff == true){
						SD("menu39s").innerText = i18nmenu39a;
					}else{
						SD("menu39s").innerText = i18nmenu41a;
					}
				});
			}, false);
			createline("panelwindow");
			createmenubar(i18nmenu21a, ["menu21s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu21s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefandownloads"});
			}, false);
			createmenubar(i18nmenu22a, ["menu22s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu22s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanextensions"});
			}, false);
			createmenubar(i18nmenu23a, ["menu23s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu23s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanpolicy"});
			}, false);
			createmenubar(i18nmenu24a, ["menu24s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu24s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefaninspect"});
			}, false);
			createmenubar(i18nmenu25a, ["menu25s", ""], "panelwindow", i18nmenuwindow, rootwindow);
			SD("menu25s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanflags"});
			}, false);

			// Help
			var roothelp = ["btnhelp", "h"];
			createmenubar(i18nmenu16a, ["menu16s", ""], "panelhelp", i18nmenuhelp, roothelp);
			SD("menu16s").addEventListener("click", function(){
				window.open(linksupport, "_target");
			}, false);
			createmenubar(i18nmenu17a, ["menu17s", ""], "panelhelp", i18nmenuhelp, roothelp);
			SD("menu17s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanchromeabout"});
			}, false);


			// Start root menu shortcut
			menuRootItems = el.shadowRoot.querySelectorAll("#btnfile + a, #btnhelp + a, #btnedit + a, #btnview + a, #btnhistory + a, #btnbookmarks + a, #btnwindow + a");

			// Add event listener for keyboard events
			let keyboardEventListener = null;

			// Event listener to toggle keyboard event listener based on focus
			document.addEventListener("focusin", function(event){
				const focusedElement = event.target;
				if(focusedElement.id === "stefanvdpropermenubar"){
					keyboardEventListener = handleKeyboardEvent;
					document.addEventListener("keydown", keyboardEventListener);
				}
			});

			document.addEventListener("focusout", function(){
				if(keyboardEventListener){
					document.removeEventListener("keydown", keyboardEventListener);
					keyboardEventListener = null;
				}
			});
			// End root menu shortcut
		}
	}
}

// Begin shorcut to move to left, right, up and down
var menuRootItems = null;
let activeMenuItemFile = 0;
let activeMenuItemHelp = 0;
let activeMenuItemEdit = 0;
let activeMenuItemView = 0;
let activeMenuItemHistory = 0;
let activeMenuItemBookmarks = 0;
let activeMenuItemWindow = 0;
let currentRootIndex = 0;

function handleKeyboardEvent(event){
	if(menuproducts == true){
		if(event.key === "ArrowDown" || event.key === "ArrowUp"){
			event.preventDefault();
			const direction = event.key === "ArrowDown" ? 1 : -1;
			let activeMenuItem;
			let menuItemsArray;
			if(el.shadowRoot.getElementById("btnfile").checked){
				activeMenuItem = activeMenuItemFile;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".panelfile a"));
			}else if(el.shadowRoot.getElementById("btnhelp").checked){
				activeMenuItem = activeMenuItemHelp;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".panelhelp a"));
			}else if(el.shadowRoot.getElementById("btnedit").checked){
				activeMenuItem = activeMenuItemEdit;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".paneledit a"));
			}else if(el.shadowRoot.getElementById("btnview").checked){
				activeMenuItem = activeMenuItemView;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".panelview a"));
			}else if(el.shadowRoot.getElementById("btnhistory").checked){
				activeMenuItem = activeMenuItemHistory;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".panelhistory a"));
			}else if(el.shadowRoot.getElementById("btnbookmarks").checked){
				activeMenuItem = activeMenuItemBookmarks;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".panelbookmarks a"));
			}else if(el.shadowRoot.getElementById("btnwindow").checked){
				activeMenuItem = activeMenuItemWindow;
				menuItemsArray = Array.from(el.shadowRoot.querySelectorAll(".panelwindow a"));
			}
			if(menuItemsArray && menuItemsArray.length > 0){
				const newIndex = (activeMenuItem + direction + menuItemsArray.length) % menuItemsArray.length;
				switch(true){
				case el.shadowRoot.getElementById("btnfile").checked:
					activeMenuItemFile = newIndex;
					break;
				case el.shadowRoot.getElementById("btnhelp").checked:
					activeMenuItemHelp = newIndex;
					break;
				case el.shadowRoot.getElementById("btnedit").checked:
					activeMenuItemEdit = newIndex;
					break;
				case el.shadowRoot.getElementById("btnview").checked:
					activeMenuItemView = newIndex;
					break;
				case el.shadowRoot.getElementById("btnhistory").checked:
					activeMenuItemHistory = newIndex;
					break;
				case el.shadowRoot.getElementById("btnbookmarks").checked:
					activeMenuItemBookmarks = newIndex;
					break;
				case el.shadowRoot.getElementById("btnwindow").checked:
					activeMenuItemWindow = newIndex;
					break;
				default:
					break;
				}
				menuItemsArray[newIndex].focus();
			}
		}else if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
			event.preventDefault();
			const newIndex = event.key === "ArrowRight" ? (currentRootIndex + 1) % menuRootItems.length : (currentRootIndex - 1 + menuRootItems.length) % menuRootItems.length;
			const nextCheckbox = menuRootItems[newIndex].previousElementSibling;
			if(nextCheckbox){
				const prevCheckbox = menuRootItems[currentRootIndex].previousElementSibling;
				if(prevCheckbox){
					prevCheckbox.checked = false;
					prevCheckbox.nextElementSibling.style.display = "none";
				}
				nextCheckbox.checked = !nextCheckbox.checked;
				nextCheckbox.nextElementSibling.style.display = "block";
				menuRootItems[newIndex].focus();
				currentRootIndex = newIndex;
				// Reset active item index for the opened flyout
				activeMenuItemFile = -1;
				activeMenuItemHelp = -1;
				activeMenuItemEdit = -1;
				activeMenuItemView = -1;
				activeMenuItemHistory = -1;
				activeMenuItemBookmarks = -1;
				activeMenuItemWindow = -1;
			}
		}else if(event.key === "Enter"){
			event.preventDefault();
			const focusedElement = el.shadowRoot.activeElement;
			if(focusedElement){
				focusedElement.click();
			}
		}
	}
}
// End shortcut

// Observe a specific DOM element:
if(document.body){
	// B New Mutation Summary API Reference
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if(MutationObserver){
	// setup MutationSummary observer
		var videolist = document.body;
		var observer = new MutationObserver(function(mutations){
			if(addbar == true){

				mutations.forEach(function(mutation){
					// detect change style - this for floating box in div detection
					if(mutation.attributeName == "style"){
						if(getpositiontop == true){
							if(mutation.target.getAttribute("data-propermenubar") == "true"){
								if(mutation.target.getAttribute("data-spmtop") == mutation.target.style.marginTop){
									mutation.target.style.marginTop = parseInt(mutation.target.getAttribute("data-spmtop"), 10) + parseInt(height, 10) + "px";
								}
							}else{
								mutation.target.setAttribute("data-propermenubar", true);
								mutation.target.setAttribute("data-spmtop", mutation.target.style.marginTop);
								mutation.target.style.marginTop = parseInt(mutation.target.style.marginTop, 10) + parseInt(height, 10) + "px";
							}
						}
					}
				});

			}

		});

		observer.observe(videolist, {
			subtree: true, // observe the subtree rooted at ...videolist...
			childList: false, // include childNode insertion/removals
			characterData: false, // include textContent changes
			attributes: true // include changes to attributes within the subtree
		});

		window.addEventListener("beforeunload", function(){ observer.disconnect(); });

	}
}

function propopenurl(a, b){
	const thatkeyword = getkeyword();
	const openthat = thatkeyword ? a(country, thatkeyword) : a;
	chrome.runtime.sendMessage({name: "stefanthaturl", url: openthat, tabaction: b});
}

function getkeyword(){
	try{
		const inputs = document.getElementsByTagName("input");
		for(let input of inputs){
			if(input.getAttribute("name") === "q"){
				return input.value;
			}
		}
	}catch(e){
		// console.log(e);
	}
	return"";
}

// Open local file
function runopenfile(){
	// <input type="file" id="attachment" style="display: none;" onchange="fileSelected(this)"/>
	// <input type="button" id="btnAttachment" onclick="openAttachment()" value="File"/>
	var input = document.createElement("input");
	input.type = "file";
	input.id = "attachment";
	input.className = "stefanvdhidden";
	input.addEventListener("change", function(){ fileSelected(this); });
	el.shadowRoot.appendChild(input);

	el.shadowRoot.getElementById("attachment").click();

	var element = SD("attachment");
	if(element){
		element.parentNode.removeChild(element);
	}
}

function fileSelected(input){
	var thatfile = input.files[0];
	var path = (window.URL || window.webkitURL).createObjectURL(thatfile);
	window.open(path);
}

var addbar = null; var dropshadow = null; var allsites = null; var toolbaronly = null; var toolbarDomains = null; var getpositiontop = null; var getpositionbottom = null; var toolbarwhite = null; var toolbarblack = null;
var opacity = null; var backgroundcolor = null; var backgroundhex = null; var backgroundimagesource = null; var backgroundimage = null; var country = null; var fontcolor = null; var googlesites = null; var search = null; var existingtab = null; var display = null; var hovertextcolor = null; var hoverbackground = null; var googleproducts = null; var menuproducts = null; var googlebarDomains = null, hovermenu = null; var filterbydomain = null; var filterbypage = null; var currenturl = null;

chrome.runtime.onMessage.addListener(function request(request){
	if(request.action == "goselectall"){
		var range = document.createRange();
		range.selectNode(document.body);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
	}else if(request.action == "goprint"){
		window.print();
	}else if(request.action == "gostop"){
		window.stop();
	}else if(request.action == "goreload"){
		window.location.reload();
	}else if(request.action == "gofullscreen"){
		document.documentElement.requestFullscreen();
	}else if(request.action == "goback"){
		window.history.back();
	}else if(request.action == "goforward"){
		window.history.forward();
	}else if(request.action == "gofocus"){
		const btnFile = el.shadowRoot.getElementById("hyperbtnfile");
		if(btnFile){
			btnFile.focus();
		}
	}else if(request.action == "addremove"){
		chrome.storage.sync.get(["country", "addbar", "dropshadow", "toolbarDomains", "allsites", "toolbaronly", "getpositiontop", "getpositionbottom", "toolbarwhite", "toolbarblack", "backgroundhex", "backgroundimagesource", "opacity", "backgroundcolor", "backgroundimage", "allsites", "fontcolor", "googlesites", "search", "existingtab", "display", "hovertextcolor", "hoverbackground", "googleproducts", "menuproducts", "googlebarDomains", "hovermenu", "filterbydomain", "filterbypage"], function(items){
			country = items.country;
			if(country == null){
				var userLang = navigator.language || navigator.userLanguage;
				if(userLang == "en-US"){ country = "com"; }else if(userLang == "en-UK"){ country = "co.uk"; }else if(userLang == "en-IE"){ country = "ie"; }else if(userLang == "en-AU"){ country = "au"; }else if(userLang == "en-CA"){ country = "ca"; }else if(userLang == "ar-AR"){ country = "ar"; }else if(userLang == "de-DE"){ country = "de"; }else if(userLang == "ru-RU"){ country = "ru"; }else if(userLang == "it-IT"){ country = "it"; }else if(userLang == "es-ES"){ country = "es"; }else if(userLang == "ja-JP"){ country = "co.jp"; }else if(userLang == "pl-PL"){ country = "pl"; }else if(userLang == "pt-PT"){ country = "pt"; }else if(userLang == "nl-NL"){ country = "nl"; }else if(userLang == "nl-BE"){ country = "be"; }else if(userLang == "fi-FI"){ country = "fi"; }else if(userLang == "fr-CA"){ country = "ca"; }else if(userLang == "fr-BE"){ country = "be"; }else if(userLang == "fr-FR"){ country = "fr"; }else if(userLang == "uk-UK"){ country = "uk"; }else if(userLang == "sv-SV"){ country = "sv"; }else if(userLang == "th-TH"){ country = "th"; }else if(userLang == "tr-TR"){ country = "tr"; }else{ country = "com"; }
				chrome.storage.sync.set({"country": country});
			}
			addbar = items["addbar"]; if(addbar == null)addbar = true;
			dropshadow = items["dropshadow"]; if(dropshadow == null)dropshadow = true;
			allsites = items["allsites"]; if(allsites == null)allsites = true;
			toolbaronly = items["toolbaronly"]; if(toolbaronly == null)toolbaronly = false;
			toolbarDomains = items["toolbarDomains"];
			if(typeof toolbarDomains == "undefined")
				toolbarDomains = JSON.stringify({"https://www.google.com": true, "https://www.youtube.com": true});
			getpositiontop = items["getpositiontop"]; if(getpositiontop == null)getpositiontop = true;
			getpositionbottom = items["getpositionbottom"]; if(getpositionbottom == null)getpositionbottom = false;
			toolbarwhite = items["toolbarwhite"]; if(toolbarwhite == null)toolbarwhite = true;
			toolbarblack = items["toolbarblack"]; if(toolbarblack == null)toolbarblack = false;
			googlebarDomains = items["googlebarDomains"];
			if(typeof googlebarDomains == "undefined")
				googlebarDomains = JSON.stringify({"link1a": true, "link2a": true, "link3a": true, "link4a": true, "link5a": true, "link6a": true, "link7a": true, "link8a": true, "link9a": true, "link10a": true, "link11a": true, "link12a": true, "link13a": true, "link14a": true, "link15a": true, "link16a": true, "link17a": true, "link18a": true, "link19a": true, "link20a": true, "link21a": true, "link22a": true, "link23a": true, "link24a": true, "link25a": true, "link26a": true, "link27a": true, "link28a": true});

			backgroundhex = items["backgroundhex"]; if(backgroundhex == null)backgroundhex = "#2d2d2d";
			backgroundimagesource = items["backgroundimagesource"];
			opacity = items["opacity"]; if(opacity == null)opacity = "100";
			backgroundcolor = items["backgroundcolor"]; if(backgroundcolor == null)backgroundcolor = true;
			backgroundimage = items["backgroundimage"]; if(backgroundimage == null)backgroundimage = false;
			fontcolor = items["fontcolor"]; if(fontcolor == null)fontcolor = "#cccccc";
			googlesites = items["googlesites"]; if(googlesites == null)googlesites = false;
			search = items["search"]; if(search == null)search = true;
			existingtab = items["existingtab"];
			display = items["display"]; if(display == null)display = 13;
			hovertextcolor = items["hovertextcolor"]; if(hovertextcolor == null)hovertextcolor = "#ffffff";
			hoverbackground = items["hoverbackground"]; if(hoverbackground == null)hoverbackground = "#444444";
			googleproducts = items["googleproducts"]; if(googleproducts == null)googleproducts = false;
			menuproducts = items["menuproducts"]; if(menuproducts == null)menuproducts = true;
			hovermenu = items["hovermenu"]; if(hovermenu == null)hovermenu = true;
			filterbydomain = items["filterbydomain"]; if(filterbydomain == null)filterbydomain = true;
			filterbypage = items["filterbypage"]; if(filterbypage == null)filterbypage = false;
			if(addbar == true){
				var urlinthelist = false;
				if(toolbaronly == true){
					currenturl = window.location.href;
					var filtermatch = currenturl.match(/^[\w-]+:\/*\[?([\w.:-]+)\]?(?::\d+)?/);
					// console.log("filtermatch=", currenturl);
					if(filterbydomain == true){
						if(filtermatch){
							currenturl = filtermatch[0];
							// Remove trailing slash if it exists
							if(currenturl.endsWith("/")){
								currenturl = currenturl.slice(0, -1);
							}
						}
					}
					// Remove the trailing slash only if the URL is the root domain
					if(currenturl.endsWith("/")){
						const domainPattern = /^[\w-]+:\/{2}[\w.:-]+\/?$/;
						if(domainPattern.test(currenturl)){
							currenturl = currenturl.slice(0, -1);
						}
					}
					// console.log("filtermatch=", currenturl);
					var blackrabbit = false;
					if(typeof toolbarDomains == "string"){
						toolbarDomains = JSON.parse(toolbarDomains);
						var abuf = [];
						for(var domain in toolbarDomains)
							abuf.push(domain);
						abuf.sort();
						for(var i = 0; i < abuf.length; i++){
							if(toolbarwhite == true){
								if(currenturl == abuf[i]){
									// prevent opening in the popup window
									if(window.opener && window.opener !== window){
										// you are in a popup
									}else{
										addtoolbar();
										urlinthelist = true;
									}
								}
							}else if(toolbarblack == true){
								if(currenturl == abuf[i]){ blackrabbit = true; }
							}
						}
						if(urlinthelist == false){
							// if the length of the list is done, check if the toolbar visible and if still "false", then remove this
							removetoolbar();
						}
					}
					if(toolbarblack == true){
						if(blackrabbit == false){
							// prevent opening in the popup window
							if(window.opener && window.opener !== window){
								// you are in a popup
							}else{
								addtoolbar();
							}
							blackrabbit = false;
						}else{
							removetoolbar();
						}
					}
				}else if(googlesites == true){
					if(window.location.href.match("^http(|s)://([a-z.]*).google.[a-z.]*/")){
						// prevent opening in the popup window
						if(window.opener && window.opener !== window){
							// you are in a popup
						}else{
							addtoolbar();
						}
					}
				}else{
					// prevent opening in the popup window
					if(window.opener && window.opener !== window){
						// you are in a popup
					}else{
						addtoolbar();
					}
				}
			}else{
				removetoolbar();
			}
		});
	}

});