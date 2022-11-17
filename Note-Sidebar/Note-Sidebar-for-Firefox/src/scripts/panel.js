//================================================
/*

Note Sidebar
Write small or large notes in your sidebar.
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

var maintext; var theValue; var counter; var copy; var speech; var voices; var fontsize; var lineheight; var colorlight; var colordark; var backgroundlight; var backgrounddark; var backgroundcolor; var backgroundimage; var backgroundsource; var backgroundsize; var printicon; var password; var enterpassword;

function save(){
	theValue = maintext.value;
	chrome.storage.sync.set({"txtvalue": theValue});
}

var i18nfirsttext = chrome.i18n.getMessage("firsttext");
var i18ndefault = chrome.i18n.getMessage("titeldefault");

function init(){
	maintext = document.querySelector("#maintext");
	chrome.storage.sync.get(["firstDate", "optionskipremember", "txtvalue", "counter", "copy", "speech", "voices", "fontsize", "lineheight", "colorlight", "colordark", "backgroundlight", "backgrounddark", "backgroundcolor", "backgroundimage", "backgroundsource", "backgroundsize", "print", "password", "enterpassword"], function(items){
		theValue = items["txtvalue"]; if(theValue == null){ theValue = i18nfirsttext; }
		counter = items["counter"]; if(counter == null){ counter = true; }
		copy = items["copy"]; if(copy == null){ copy = true; }
		speech = items["speech"]; if(speech == null){ speech = true; }
		voices = items["voices"]; if(voices == null){ voices = false; }
		fontsize = items["fontsize"]; if(fontsize == null){ fontsize = 18; }
		lineheight = items["lineheight"]; if(lineheight == null){ lineheight = 26; }
		colorlight = items["colorlight"]; if(colorlight == null){ colorlight = "#373737"; }
		colordark = items["colordark"]; if(colordark == null){ colordark = "#ffffff"; }
		backgroundlight = items["backgroundlight"]; if(backgroundlight == null){ backgroundlight = "#ffffff"; }
		backgrounddark = items["backgrounddark"]; if(backgrounddark == null){ backgrounddark = "#232323"; }
		backgroundcolor = items["backgroundcolor"]; if(backgroundcolor == null){ backgroundcolor = true; }
		backgroundimage = items["backgroundimage"]; if(backgroundimage == null){ backgroundimage = false; }
		backgroundsource = items["backgroundsource"]; if(backgroundsource == null){ backgroundsource = 0; }
		backgroundsize = items["backgroundsize"]; if(backgroundsize == null){ backgroundsize = 150; }
		printicon = items["print"]; if(printicon == null){ printicon = false; }
		password = items["password"]; if(printicon == null){ printicon = false; }
		enterpassword = items["enterpassword"]; if(enterpassword == null){ enterpassword = ""; }

		if(password == true){
			var darklayer = document.createElement("div");
			darklayer.id = "lockscreen";
			document.body.appendChild(darklayer);

			var newinput = document.createElement("input");
			newinput.type = "password";
			newinput.id = "inputpass";
			newinput.addEventListener("input", function(){
				checkpassword(this.value);
			});
			newinput.addEventListener("keypress", function(e){
				if(e.key === "Enter"){
					checkpassword(this.value);
					if(this.value != enterpassword){
						newinput.classList.add("animation");
						window.setTimeout(() => {
							if(newinput.classList.contains("animation")){
								newinput.classList.remove("animation");
							}
						}, 1000);
					}
				}
			});
			darklayer.appendChild(newinput);
			document.getElementById("inputpass").focus();
		}

		// show remember page
		var firstmonth = false;
		var currentDate = new Date().getTime();
		if(items["firstDate"]){
			var datestart = items["firstDate"];
			var dateend = datestart + (30 * 24 * 60 * 60 * 1000);
			if(currentDate >= dateend){ firstmonth = false; }else{ firstmonth = true; }
		}else{
			chrome.storage.sync.set({"firstDate": currentDate});
			firstmonth = true;
		}

		if(firstmonth){
			// show nothing
			document.getElementById("stefanvdpromo").className = "hidden";
		}else{
			if(items["optionskipremember"] != true){
				document.getElementById("stefanvdpromo").className = ""; // show now always the banner
			}else{
				document.getElementById("stefanvdpromo").className = "hidden";
			}
		}

		if(!theValue){
			theValue = "";
		}
		maintext.value = theValue;

		if(counter == true){
			countcharacters();
			document.getElementById("boxcharacter").className = "";
		}else{
			document.getElementById("boxcharacter").className = "hidden";
		}

		if(copy == true){
			document.getElementById("copytext").className = "btn-copy";
		}else{
			document.getElementById("copytext").className = "hidden";
		}

		if(speech == true){
			document.getElementById("texttospeech").className = "";
		}else{
			document.getElementById("texttospeech").className = "hidden";
		}

		if(voices == true){
			document.getElementById("field").className = "";
		}else{
			document.getElementById("field").className = "hidden";
		}

		if(printicon == true){
			document.getElementById("printtext").className = "btn-print";
		}else{
			document.getElementById("printtext").className = "hidden";
		}

		if(backgroundimage == true){
			addbackgroundpaper();
		}

		// Add stylesheet
		addstylecode();
	});

	maintext.onchange = function(){
		save();
	};
	maintext.oninput = function(){
		countcharacters();
	};

	document.querySelector(".close").addEventListener("click", () => {
		document.getElementById("stefanvdpromo").className = "hidden";
	});
}

function checkpassword(value){
	if(value == enterpassword){
		var elem = document.getElementById("lockscreen");
		if(elem){
			elem.parentNode.removeChild(elem);
		}
	}
}

function addstylecode(){
	const style = document.createElement("style");
	style.id = "notestyle";
	style.textContent = `
	/* Light mode */
	:root {
		--ext-primary-background:` + backgroundlight + `;
		--ext-primary-font-color:#000;
		--ext-nav-color:` + colorlight + `;
		--ext-font-size: ` + fontsize + `px;
		--ext-line-height: ` + lineheight + `px;
	}
	
	/* Dark mode */
	@media (prefers-color-scheme: dark) {
		:root{
		--ext-primary-background:` + backgrounddark + `;
		--ext-primary-font-color:#fff;
		--ext-nav-color:` + colordark + `;
		--ext-font-size: ` + fontsize + `px;
		--ext-line-height: ` + lineheight + `px;
		}
	}
	`;
	document.head.appendChild(style);
}

function removestylecode(){
	var elem = document.getElementById("notestyle");
	if(elem){
		elem.parentNode.removeChild(elem);
	}
}

function addbackgroundpaper(){
	const bck = document.createElement("div");
	bck.id = "bcknotepaper";
	bck.className = "notepaper";
	bck.style.backgroundSize = backgroundsize + "px " + backgroundsize + "px";
	document.body.appendChild(bck);
	updatebackgroundpaper();
}

function removebackgroundpaper(){
	var elem = document.getElementById("bcknotepaper");
	if(elem){
		elem.parentNode.removeChild(elem);
	}
}

function updatebackgroundpaper(){
	var bcknotepaper = document.getElementById("bcknotepaper");
	if(bcknotepaper){
		if(backgroundsource == 0){
			bcknotepaper.style.backgroundImage = "url(" + chrome.runtime.getURL("images/blue-grid.png") + ")";
		}else if(backgroundsource == 1){
			bcknotepaper.style.backgroundImage = "url(" + chrome.runtime.getURL("images/black-grid.png") + ")";
		}else if(backgroundsource == 2){
			bcknotepaper.style.backgroundImage = "url(" + chrome.runtime.getURL("images/blue-lines.png") + ")";
		}else if(backgroundsource == 3){
			bcknotepaper.style.backgroundImage = "url(" + chrome.runtime.getURL("images/black-lines.png") + ")";
		}
	}
}

function countcharacters(){
	document.getElementById("counter").textContent = document.querySelector("#maintext").value.length;
}

window.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("maintext");
	const main = document.getElementsByTagName("main")[0];
	const voiceSelect = document.getElementById("voices");
	let voices;
	let currentVoice;

	const populateVoices = () => {
		const availableVoices = speechSynthesis.getVoices();
		voiceSelect.innerHTML = "";

		availableVoices.forEach((voice) => {
			const option = document.createElement("option");
			let optionText = `${voice.name} (${voice.lang})`;
			if(voice.default){
				optionText += " [" + i18ndefault + "]";
				if(typeof currentVoice === "undefined"){
					currentVoice = voice;
					option.selected = true;
				}
			}
			if(currentVoice === voice){
				option.selected = true;
			}
			option.textContent = optionText;
			voiceSelect.appendChild(option);
		});
		voices = availableVoices;
	};

	populateVoices();
	if(speechSynthesis.onvoiceschanged !== undefined){
		speechSynthesis.onvoiceschanged = populateVoices;
	}

	voiceSelect.addEventListener("change", (event) => {
		const selectedIndex = event.target.selectedIndex;
		currentVoice = voices[selectedIndex];
	});

	var utterance;
	document.getElementById("startspeech").addEventListener("click", (event) => {
		event.preventDefault();
		const toSay = input.value.trim();
		utterance = new SpeechSynthesisUtterance(toSay);
		utterance.voice = currentVoice;
		utterance.rate = 0.85;
		utterance.addEventListener("start", () => {
			main.classList.add("speaking");
			document.getElementById("startspeech").classList.add("hidden");
			document.getElementById("stopspeech").classList.remove("hidden");
		});
		utterance.addEventListener("end", () => {
			main.classList.remove("speaking");
			document.getElementById("startspeech").classList.remove("hidden");
			document.getElementById("stopspeech").classList.add("hidden");
		});
		speechSynthesis.speak(utterance);
	});

	document.getElementById("stopspeech").addEventListener("click", (event) => {
		event.preventDefault();
		speechSynthesis.cancel();
		document.getElementById("startspeech").classList.remove("hidden");
		document.getElementById("stopspeech").classList.add("hidden");
	});

	document.getElementById("copytext").addEventListener("click", () => {
		const input = document.getElementById("maintext");
		input.select();
		document.execCommand("copy");
	});

	document.getElementById("printtext").addEventListener("click", () => {
		print();
	});

});

document.addEventListener("DOMContentLoaded", init, false);

chrome.runtime.onMessage.addListener(function(request){
	if(request.msg == "setnotetext"){
		document.querySelector("#maintext").value = request.value;
	}else if(request.msg == "setcounter"){
		if(request.value == true){
			countcharacters();
			document.getElementById("boxcharacter").className = "";
		}else{
			document.getElementById("boxcharacter").className = "hidden";
		}
	}else if(request.msg == "setcopy"){
		if(request.value == true){
			document.getElementById("copytext").className = "btn-copy";
		}else{
			document.getElementById("copytext").className = "hidden";
		}
	}else if(request.msg == "setspeech"){
		if(request.value == true){
			document.getElementById("texttospeech").className = "";
		}else{
			document.getElementById("texttospeech").className = "hidden";
		}
	}else if(request.msg == "setvoices"){
		if(request.value == true){
			document.getElementById("field").className = "";
		}else{
			document.getElementById("field").className = "hidden";
		}
	}else if(request.msg == "setfontsize"){
		fontsize = request.value;
		removestylecode();
		addstylecode();
	}else if(request.msg == "setcolorlight"){
		colorlight = request.value;
		removestylecode();
		addstylecode();
	}else if(request.msg == "setcolordark"){
		colordark = request.value;
		removestylecode();
		addstylecode();
	}else if(request.msg == "setbackgroundlight"){
		backgroundlight = request.value;
		removestylecode();
		addstylecode();
	}else if(request.msg == "setbackgrounddark"){
		backgrounddark = request.value;
		removestylecode();
		addstylecode();
	}else if(request.msg == "setbackgroundcolor" || request.msg == "setbackgroundimage"){
		if(request.value == true){
			removebackgroundpaper();
		}else{
			addbackgroundpaper();
		}
	}else if(request.msg == "setbackgroundsource"){
		backgroundsource = request.value;
		updatebackgroundpaper();
	}else if(request.msg == "setbackgroundsize"){
		var bcknotepaper = document.getElementById("bcknotepaper");
		if(bcknotepaper){
			bcknotepaper.style.backgroundSize = request.value + "px";
		}
	}else if(request.msg == "setprint"){
		if(request.value == true){
			document.getElementById("printtext").className = "btn-print";
		}else{
			document.getElementById("printtext").className = "hidden";
		}
	}
});