//================================================
/*

Proper Menubar
Add the best menu bar to get easy and fast access to all your useful browser options and internet products!
Copyright (C) 2022 Stefan vd
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

function toggleoff(){
	chrome.tabs.query({active: true}, function(tabs){
		for(var i = 0; i < tabs.length; i++){
			// Send a request to the content script.
			chrome.storage.sync.set({"addbar": false});
			chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
			$("turnoff").style.display = "none";
			$("turnon").style.display = "block";
		}
	}
	);
}
function toggleon(){
	chrome.tabs.query({active: true}, function(tabs){
		for(var i = 0; i < tabs.length; i++){
			// Send a request to the content script.
			chrome.storage.sync.set({"addbar": true});
			chrome.tabs.sendMessage(tabs[i].id, {action: "addremove"});
			$("turnoff").style.display = "block";
			$("turnon").style.display = "none";
		}
	}
	);
}


function addtoolbar(){
	var frame = $("stefanvdpropermenubar");
	if(frame){
		height = "30px";

		// inject CSS for the hover effect
		try{
			var pmcssbar = "#stefanvdnavwrappe #stefanvdpropermenubarnav li:hover a,#stefanvdnavwrappe #stefanvdpropermenubarnav a:focus,#stefanvdnavwrappe #stefanvdpropermenubarnav a:active{padding:0 7px;line-height:30px!important;color:" + hovertextcolor + "!important;background:" + hoverbackground + "!important;text-decoration:none;height:30px;font-weight:normal}#stefanvdnavwrappe #stefanvdpropermenubarnav label:hover{color:" + hovertextcolor + "!important;background:" + hoverbackground + "!important}";

			if($("csspropermenubar")){
				var elem = document.body.getElementById("csspropermenubar");
				elem.parentElement.removeChild(elem);
			}

			var css = document.createElement("style");
			css.setAttribute("id", "csspropermenubar");
			css.type = "text/css";
			css.appendChild(document.createTextNode(pmcssbar));
			document.body.appendChild(css);
		}catch(e){}

		//---
		var newtoolbar = document.createElement("div");
		newtoolbar.setAttribute("id", "stefanvdnavwrappe");
		var rgb = hex2rgb(backgroundhex);
		newtoolbar.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
		frame.appendChild(newtoolbar);

		var newtoolbardiv = document.createElement("div");
		newtoolbardiv.setAttribute("id", "stefanvdpropermenubarnav");
		newtoolbar.appendChild(newtoolbardiv);

		var newtoolbarul = document.createElement("ul");
		newtoolbardiv.appendChild(newtoolbarul);

		if(googleproducts == true){
			var numberitems = 0;
			function createlink(a, b, c){
				// only the first 13 in the bar, rest dropdown menu
				if(numberitems < display){
					var newtoolbarulli = document.createElement("li");
					newtoolbarul.appendChild(newtoolbarulli);

					var newtoolbarullia = document.createElement("a");
					if(existingtab == true){ newtoolbarullia.setAttribute("target", "_self"); }else{ newtoolbarullia.setAttribute("target", "_blank"); }

					newtoolbarullia.setAttribute("id", c);
					newtoolbarullia.style.color = fontcolor;
					newtoolbarullia.innerHTML = a;
					newtoolbarullia.setAttribute("href", b);
					newtoolbarulli.appendChild(newtoolbarullia);
				}else{
					var newdropdowncontent = $("stefanvdpropermenubardropdown");
					if(newdropdowncontent){}else{
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
						var newdropdowncontent = document.createElement("div");
						newdropdowncontent.setAttribute("id", "stefanvdpropermenubardropdowncontent");
						newdropdowncontent.style.top = 0;
						newdropdown.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
						newdropdown.appendChild(newdropdowncontent);
					}
					// create the link
					var newdropdowncontent = $("stefanvdpropermenubardropdowncontent");
					var newdropdowncontentli = document.createElement("li");
					newdropdowncontent.appendChild(newdropdowncontentli);

					var newdropdowncontentlia = document.createElement("a");
					if(existingtab == true){ newdropdowncontentlia.setAttribute("target", "_self"); }else{ newdropdowncontentlia.setAttribute("target", "_blank"); }
					newdropdowncontentlia.setAttribute("id", c);
					newdropdowncontentlia.style.color = fontcolor;
					newdropdowncontentlia.innerHTML = a;
					newdropdowncontentlia.setAttribute("href", b);
					newdropdowncontentli.appendChild(newdropdowncontentlia);
				}
				numberitems = numberitems + 1;
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

			if(typeof googlebarDomains == "string"){
				googlebarDomains = JSON.parse(googlebarDomains);
				var pbuf = [];
				for(var domain in googlebarDomains)
					pbuf.push(domain);
				for(var i = 0; i < pbuf.length; i++){
					if(pbuf[i] == "link1a"){ createlink(i18nlink1a, productlink1, "link1s"); }
					if(pbuf[i] == "link2a"){ createlink(i18nlink2a, productlink2, "link2s"); }
					if(pbuf[i] == "link3a"){ createlink(i18nlink3a, productlink3, "link3s"); }
					if(pbuf[i] == "link4a"){ createlink(i18nlink4a, productlink4, "link4s"); }
					if(pbuf[i] == "link5a"){ createlink(i18nlink5a, productlink5, "link5s"); }
					if(pbuf[i] == "link6a"){ createlink(i18nlink6a, productlink6, "link6s"); }
					if(pbuf[i] == "link7a"){ createlink(i18nlink7a, productlink7, "link7s"); }
					if(pbuf[i] == "link8a"){ createlink(i18nlink8a, productlink8, "link8s"); }
					if(pbuf[i] == "link9a"){ createlink(i18nlink9a, productlink9, "link9s"); }
					if(pbuf[i] == "link10a"){ createlink(i18nlink10a, productlink10, "link10s"); }
					if(pbuf[i] == "link11a"){ createlink(i18nlink11a, productlink11, "link11s"); }
					if(pbuf[i] == "link12a"){ createlink(i18nlink12a, productlink12, "link12s"); }
					if(pbuf[i] == "link13a"){ createlink(i18nlink13a, productlink13, "link13s"); }
					if(pbuf[i] == "link14a"){ createlink(i18nlink14a, productlink14, "link14s"); }
					if(pbuf[i] == "link15a"){ createlink(i18nlink15a, productlink15, "link15s"); }
					if(pbuf[i] == "link16a"){ createlink(i18nlink16a, productlink16, "link16s"); }
					if(pbuf[i] == "link17a"){ createlink(i18nlink17a, productlink17, "link17s"); }
					if(pbuf[i] == "link18a"){ createlink(i18nlink18a, productlink18, "link18s"); }
					if(pbuf[i] == "link19a"){ createlink(i18nlink19a, productlink19, "link19s"); }
					if(pbuf[i] == "link20a"){ createlink(i18nlink20a, productlink20, "link20s"); }
					if(pbuf[i] == "link22a"){ createlink(i18nlink22a, productlink22, "link22s"); }
					if(pbuf[i] == "link23a"){ createlink(i18nlink23a, productlink23, "link23s"); }
					if(pbuf[i] == "link24a"){ createlink(i18nlink24a, productlink24, "link24s"); }
					if(pbuf[i] == "link25a"){ createlink(i18nlink25a, productlink25, "link25s"); }
					if(pbuf[i] == "link26a"){ createlink(i18nlink26a, productlink26, "link26s"); }
					if(pbuf[i] == "link27a"){ createlink(i18nlink27a, productlink27, "link27s"); }
					if(pbuf[i] == "link28a"){ createlink(i18nlink28a, productlink28, "link28s"); }
					if(pbuf[i] == "link29a"){ createlink(i18nlink29a, productlink29, "link29s"); }
					if(pbuf[i] == "link30a"){ createlink(i18nlink30a, productlink30, "link30s"); }
					if(pbuf[i] == "link31a"){ createlink(i18nlink31a, productlink31, "link31s"); }
					if(pbuf[i] == "link32a"){ createlink(i18nlink32a, productlink32, "link32s"); }
					if(pbuf[i] == "link33a"){ createlink(i18nlink33a, productlink33, "link33s"); }
					if(pbuf[i] == "link34a"){ createlink(i18nlink34a, productlink34, "link34s"); }
					if(pbuf[i] == "link35a"){ createlink(i18nlink35a, productlink35, "link35s"); }
					if(pbuf[i] == "link36a"){ createlink(i18nlink36a, productlink36, "link36s"); }
					if(pbuf[i] == "link37a"){ createlink(i18nlink37a, productlink37, "link37s"); }
					if(pbuf[i] == "link38a"){ createlink(i18nlink38a, productlink38, "link38s"); }
					if(pbuf[i] == "link39a"){ createlink(i18nlink39a, productlink39, "link39s"); }
					if(pbuf[i] == "link40a"){ createlink(i18nlink40a, productlink40, "link40s"); }
					if(pbuf[i] == "link41a"){ createlink(i18nlink41a, productlink41, "link41s"); }
					if(pbuf[i] == "link42a"){ createlink(i18nlink42a, productlink42, "link42s"); }
					if(pbuf[i] == "link43a"){ createlink(i18nlink43a, productlink43, "link43s"); }
					if(pbuf[i] == "link44a"){ createlink(i18nlink44a, productlink44, "link44s"); }
					if(pbuf[i] == "link45a"){ createlink(i18nlink45a, productlink45, "link45s"); }
					if(pbuf[i] == "link46a"){ createlink(i18nlink46a, productlink46, "link46s"); }
					if(pbuf[i] == "link47a"){ createlink(i18nlink47a, productlink47, "link47s"); }
					if(pbuf[i] == "link48a"){ createlink(i18nlink48a, productlink48, "link48s"); }
					if(pbuf[i] == "link49a"){ createlink(i18nlink49a, productlink49, "link49s"); }
					if(pbuf[i] == "link50a"){ createlink(i18nlink50a, productlink50, "link50s"); }
					if(pbuf[i] == "link51a"){ createlink(i18nlink51a, productlink51, "link51s"); }
					if(pbuf[i] == "link52a"){ createlink(i18nlink52a, productlink52, "link52s"); }
					if(pbuf[i] == "link53a"){ createlink(i18nlink53a, productlink53, "link53s"); }
					if(pbuf[i] == "link21a"){ createlink(i18nlink21a, productlink21, "link21s"); }
				}
			}
		}else{
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
			var i18nmenu42a = chrome.i18n.getMessage("menu42a");
			var i18nmenu43a = chrome.i18n.getMessage("menu43a");
			var i18nmenu44a = chrome.i18n.getMessage("menu44a");
			var i18nmenu45a = chrome.i18n.getMessage("menu45a");
			var i18nmenu46a = chrome.i18n.getMessage("menu46a");
			var i18nmenu47a = chrome.i18n.getMessage("menu47a");

			function createline(a){
				var hrelement = document.createElement("hr");
				$(a).getElementsByTagName("ul")[0].appendChild(hrelement);
			}

			function createmenubar(a, b, c, d, e){
				var newdropdowncontent = $(e);
				if(newdropdowncontent){}else{
					var newdropdown = document.createElement("label");
					newdropdown.setAttribute("for", e);
					newtoolbarul.appendChild(newdropdown);

					var newinputcheck = document.createElement("input");
					newinputcheck.setAttribute("id", e);
					newinputcheck.setAttribute("type", "checkbox");
					newinputcheck.setAttribute("name", "ppcontrol");
					newinputcheck.addEventListener("change", function(event){
						if(event.target.id == e){
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
					newdropdowna.innerHTML = d;
					// newdropdowna.setAttribute('href', '#');
					newdropdown.appendChild(newdropdowna);

					var rgb = hex2rgb(backgroundhex);
					var newdropdowncontent = document.createElement("div");
					newdropdowncontent.setAttribute("id", c);
					newdropdowncontent.setAttribute("class", c);
					newdropdowncontent.style.border = "1px solid gray";
					newdropdowncontent.style.background = "rgba(" + rgb.red + "," + rgb.green + "," + rgb.blue + "," + (opacity / 100) + ")";
					newdropdown.appendChild(newdropdowncontent);
				}
				// create the link
				var newdropdowncontent = $(c);

				if(newdropdowncontent.getElementsByTagName("ul")[0]){
					var newdropdowncontentul = newdropdowncontent.getElementsByTagName("ul")[0];
				}else{
					var newdropdowncontentul = document.createElement("ul");
					newdropdowncontent.appendChild(newdropdowncontentul);
				}

				var newdropdowncontentli = document.createElement("li");
				newdropdowncontentul.appendChild(newdropdowncontentli);

				var newdropdowncontentlia = document.createElement("a");
				newdropdowncontentlia.setAttribute("id", b);
				newdropdowncontentlia.style.color = fontcolor;
				newdropdowncontentlia.innerHTML = a;
				// newdropdowncontentlia.setAttribute('href', "#");
				newdropdowncontentli.appendChild(newdropdowncontentlia);
			}

			// File
			createmenubar(i18nmenu1a, "menu1s", "panelfile", i18nmenufile, "btnfile");
			$("menu1s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleannewtab"});
			}, false);
			createmenubar(i18nmenu2a, "menu2s", "panelfile", i18nmenufile, "btnfile");
			$("menu2s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleannewwindow"});
			}, false);
			createmenubar(i18nmenu3a, "menu3s", "panelfile", i18nmenufile, "btnfile");
			$("menu3s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleannewwindowincognito"});
			}, false);
			createline("panelfile");
			createmenubar(i18nmenu4a, "menu4s", "panelfile", i18nmenufile, "btnfile");
			$("menu4s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleanclosewindow"});
			}, false);
			createmenubar(i18nmenu5a, "menu5s", "panelfile", i18nmenufile, "btnfile");
			$("menu5s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefancleanclosetab"});
			}, false);
			createmenubar(i18nmenu27a, "menu27s", "panelfile", i18nmenufile, "btnfile");
			$("menu27s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefansavemhtml"});
			}, false);
			createline("panelfile");
			createmenubar(i18nmenu6a, "menu6s", "panelfile", i18nmenufile, "btnfile");
			$("menu6s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanprint"});
			}, false);
			createline("panelfile");
			createmenubar(i18nmenu45a, "menu45s", "panelfile", i18nmenufile, "btnfile");
			$("menu45s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanexit"});
			}, false);

			// Edit
			createmenubar(i18nmenu7a, "menu7s", "paneledit", i18nmenuedit, "btnedit");
			$("menu7s").addEventListener("click", function(){
				document.execCommand("cut");
			}, false);
			createmenubar(i18nmenu8a, "menu8s", "paneledit", i18nmenuedit, "btnedit");
			$("menu8s").addEventListener("click", function(){
				document.execCommand("copy");
			}, false);
			createmenubar(i18nmenu9a, "menu9s", "paneledit", i18nmenuedit, "btnedit");
			$("menu9s").addEventListener("click", function(){
				document.execCommand("paste");
			}, false);
			createline("paneledit");
			createmenubar(i18nmenu10a, "menu10s", "paneledit", i18nmenuedit, "btnedit");
			$("menu10s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefansettings"});
			}, false);
			createline("paneledit");
			createmenubar(i18nmenu11a, "menu11s", "paneledit", i18nmenuedit, "btnedit");
			$("menu11s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanselectall"});
			}, false);

			// View
			createmenubar(i18nmenu12a, "menu12s", "panelview", i18nmenuview, "btnview");
			$("menu12s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanstoppage"});
			}, false);
			createmenubar(i18nmenu28a, "menu28s", "panelview", i18nmenuview, "btnview");
			$("menu28s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanreloadpage"});
			}, false);
			createline("panelview");
			createmenubar(i18nmenu29a, "menu29s", "panelview", i18nmenuview, "btnview");
			$("menu29s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanfullscreenpage"});
			}, false);
			createmenubar(i18nmenu30a, "menu30s", "panelview", i18nmenuview, "btnview");
			$("menu30s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoomactual"});
			}, false);
			createmenubar(i18nmenu31a, "menu31s", "panelview", i18nmenuview, "btnview");
			$("menu31s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoomin"});
			}, false);
			createmenubar(i18nmenu32a, "menu32s", "panelview", i18nmenuview, "btnview");
			$("menu32s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoomout"});
			}, false);
			createline("panelview");
			createmenubar(i18nmenu47a, "menu47s", "panelview", i18nmenuview, "btnview");
			$("menu47s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanviewsource"});
			}, false);

			// History
			createmenubar(i18nmenu13a, "menu13s", "panelhistory", i18nmenuhistory, "btnhistory");
			$("menu13s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhometab"});
			}, false);
			createmenubar(i18nmenu19a, "menu19s", "panelhistory", i18nmenuhistory, "btnhistory");
			$("menu19s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhistoryback"});
			}, false);
			createmenubar(i18nmenu20a, "menu20s", "panelhistory", i18nmenuhistory, "btnhistory");
			$("menu20s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhistoryforward"});
			}, false);
			createline("panelhistory");
			createmenubar(i18nmenu26a, "menu26s", "panelhistory", i18nmenuhistory, "btnhistory");
			$("menu26s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanhistory"});
			}, false);

			// Bookmarks
			createmenubar(i18nmenu14a, "menu14s", "panelbookmarks", i18nmenubookmarks, "btnbookmarks");
			$("menu14s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanbookmarkmanager"});
			}, false);
			createmenubar(i18nmenu18a, "menu18s", "panelbookmarks", i18nmenubookmarks, "btnbookmarks");
			$("menu18s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanbookmarkadd"});
			}, false);
			createmenubar(i18nmenu33a, "menu33s", "panelbookmarks", i18nmenubookmarks, "btnbookmarks");
			$("menu33s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanbookmarkaddall"});
			}, false);

			// Windows
			createmenubar(i18nmenu43a, "menu43s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu43s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanminimise"});
			}, false);
			createmenubar(i18nmenu44a, "menu44s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu44s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanzoom"});
			}, false);
			createline("panelwindow");
			createmenubar(i18nmenu15a, "menu15s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu15s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanswitchtabright"});
			}, false);
			createmenubar(i18nmenu34a, "menu34s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu34s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanswitchtableft"});
			}, false);
			createmenubar(i18nmenu35a, "menu35s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu35s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanduplicatetab"});
			}, false);
			createmenubar(i18nmenu36a, "menu36s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu36s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanpintab"}, function(response){
					if(response.pinit == true){
						$("menu36s").innerText = i18nmenu36a;
					}else{
						$("menu36s").innerText = i18nmenu46a;
					}
				});
			}, false);
			createline("panelwindow");
			createmenubar(i18nmenu37a, "menu37s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu37s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmutetab"}, function(response){
					if(response.soundoff == true){
						$("menu37s").innerText = i18nmenu37a;
					}else{
						$("menu37s").innerText = i18nmenu40a;
					}
				});
			}, false);
			createmenubar(i18nmenu38a, "menu38s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu38s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmuteothertab"});
			}, false);
			createmenubar(i18nmenu39a, "menu39s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu39s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanmutealltabs"}, function(response){
					if(response.soundoff == true){
						$("menu39s").innerText = i18nmenu39a;
					}else{
						$("menu39s").innerText = i18nmenu41a;
					}
				});
			}, false);
			createline("panelwindow");
			createmenubar(i18nmenu21a, "menu21s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu21s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefandownloads"});
			}, false);
			createmenubar(i18nmenu22a, "menu22s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu22s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanextensions"});
			}, false);
			createmenubar(i18nmenu23a, "menu23s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu23s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanpolicy"});
			}, false);
			createmenubar(i18nmenu24a, "menu24s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu24s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefaninspect"});
			}, false);
			createmenubar(i18nmenu25a, "menu25s", "panelwindow", i18nmenuwindow, "btnwindow");
			$("menu25s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanflags"});
			}, false);

			// Help
			createmenubar(i18nmenu16a, "menu16s", "panelhelp", i18nmenuhelp, "btnhelp");
			$("menu16s").addEventListener("click", function(){
				window.open(linksupport, "_target");
			}, false);
			createmenubar(i18nmenu17a, "menu17s", "panelhelp", i18nmenuhelp, "btnhelp");
			$("menu17s").addEventListener("click", function(){
				chrome.runtime.sendMessage({name: "stefanchromeabout"});
			}, false);

		}
	}
}

var addbar = null; var dropshadow = null; var allsites = null; var toolbaronly = null; var toolbarDomains = null; var getpositiontop = null; var getpositionbottom = null; var toolbarwhite = null; toolbarblack = null;
var opacity = null; var backgroundcolor = null; var backgroundhex = null; var backgroundimagesource = null; var backgroundimage = null; var country = null; var fontcolor = null; var googlesites = null; var search = null; var existingtab = null; var display = null; var hovertextcolor = null; var hoverbackground = null; var googleproducts = null; var menuproducts = null; var googlebarDomains = null;

document.addEventListener("DOMContentLoaded", function(){
	chrome.storage.sync.get(["country", "addbar", "dropshadow", "toolbarDomains", "allsites", "toolbaronly", "getpositiontop", "getpositionbottom", "toolbarwhite", "toolbarblack", "backgroundhex", "backgroundimagesource", "opacity", "backgroundcolor", "backgroundimage", "allsites", "fontcolor", "googlesites", "search", "existingtab", "display", "hovertextcolor", "hoverbackground", "googleproducts", "menuproducts", "googlebarDomains"
	], function(items){
		addbar = items["addbar"]; if(addbar == null)addbar = true;
		if(addbar == true){
			$("turnoff").style.display = "block";
			$("turnon").style.display = "none";
		}else{
			$("turnoff").style.display = "none";
			$("turnon").style.display = "block";
		}
		country = items.country;
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

		//---

		addtoolbar();

		// if current tab is 'web store' or 'new tab', show error message
		chrome.tabs.query({"active": true, "windowId": chrome.windows.WINDOW_ID_CURRENT},
			function(tabs){
				var currenttaburl = tabs[0].url;
				if((new URL(currenttaburl)).origin == browserstore || currenttaburl == browserextensions || currenttaburl == browsernewtab || currenttaburl == browsersettings || currenttaburl == exoptionspage){
					$("turnoff").style.display = "none";
					$("turnon").style.display = "none";
					$("errormessage").className = "";
				}
			}
		);

	});

	// Toggle on
	$("turnoff").addEventListener("click", function(){ toggleoff(); });
	// Toggle off
	$("turnon").addEventListener("click", function(){ toggleon(); });

	$("opendonate").addEventListener("click", function(){ window.open(donatewebsite); });
	$("openrate").addEventListener("click", function(){ window.open(writereview); });
	$("openoptions").addEventListener("click", function(){ window.open(chrome.extension.getURL("options.html")); });

	$("opensupport").addEventListener("click", function(){ window.open(linksupport); });
	$("openwelcomeguide").addEventListener("click", function(){ window.open(linkguide); });
	$("openyoutube").addEventListener("click", function(){ window.open(linkyoutube); });

	$("openemail").addEventListener("click", function(){ var spropermenubaremail = "mailto:your@email.com?subject=" + chrome.i18n.getMessage("sharetexta") + "&body=" + chrome.i18n.getMessage("sharetextb") + " " + propermenubarproduct; chrome.tabs.create({url: spropermenubaremail, active:true}); });
	$("openfacebook").addEventListener("click", function(){ chrome.tabs.create({url: "https://www.facebook.com/sharer/sharer.php?u=" + propermenubarproduct, active:true}); });
	$("opentwitter").addEventListener("click", function(){ var spropermenubarproductcodeurl = encodeURIComponent(chrome.i18n.getMessage("sharetextc") + " " + propermenubarproduct); chrome.tabs.create({url: "https://twitter.com/home?status=" + spropermenubarproductcodeurl, active:true}); });

});