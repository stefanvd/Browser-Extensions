//================================================
/*

Note Sidebar
Simple note sidebar which can be used to write a note, record thoughts, to-do list, meeting notes, etc.
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

var maintext; var powertext; var theValue; var multiValue; var counter; var copy; var speech; var voices; var fontsize; var lineheight; var colorlight; var colordark; var backgroundlight; var backgrounddark; var backgroundcolor; var backgroundimage; var backgroundsource; var backgroundsize; var printicon; var password; var enterpassword; var richtext; var plaintext; var multiple;

function save(){
	var savingtext;
	if(plaintext == true){
		savingtext = maintext.value;
	}else if(richtext == true){
		savingtext = powertext.innerHTML;
	}

	if(multiple == true){
		var previoustab = document.getElementById("tabstrip").dataset.active;
		if(plaintext == true){
			multiValue[previoustab].note = savingtext;
		}else if(richtext == true){
			multiValue[previoustab].note = savingtext;
		}
		chrome.runtime.sendMessage({name: "newmultinotetext", value: multiValue});
	}else{
		theValue = savingtext;
		chrome.runtime.sendMessage({name: "newnotetext", value: savingtext});
	}
}

var i18nfirsttext = chrome.i18n.getMessage("firsttext");
var i18ndefault = chrome.i18n.getMessage("titeldefault");
var i18npasswordplaceholder = chrome.i18n.getMessage("passwordplaceholder");
var i18ntitelcopytext = chrome.i18n.getMessage("titlecopytextdone");
var i18ndescopytext = chrome.i18n.getMessage("descopytextdone");
var i18nnote = chrome.i18n.getMessage("note");

function focuspassword(){
	document.getElementById("inputpass").focus();
}

// Begin tabs functions
function removeObjectAtIndex(index, array){
	if(index > -1 && index < array.length){
		array.splice(index, 1);
	}
	return array;
}

function removeTabs(){
	var tabs = document.getElementById("tabstrip").querySelectorAll(".tab");
	tabs.forEach(function(tab){
		tab.parentNode.removeChild(tab);
	});
}

function setActiveTab(tab){
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((t) => t.classList.remove("active"));
	tab.classList.add("active");
}

function setActiveTabContent(numb){
	// Retrieve the note value
	var noteValue = multiValue[numb].note;
	if(!noteValue){
		noteValue = "";
	}

	if(plaintext == true){
		maintext.value = noteValue;
	}else if(richtext == true){
		powertext.innerHTML = noteValue;
	}
}

function createAllTabsInBar(){
	var totaltabs = multiValue.length;
	// Loop to create the specified number of tabs
	for(var i = 0; i < totaltabs; i++){
		const newTab = document.createElement("div");
		newTab.classList.add("tab");
		newTab.textContent = i18nnote + parseInt(i + 1);
		newTab.innerHTML += "<div class=\"tab-close\">x</div>";
		tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
	}
}

function createNewTab(){
	const newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.textContent = i18nnote + ` ${tabContainer.children.length}`;
	newTab.innerHTML += "<div class=\"tab-close\">x</div>";
	tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
	setActiveTab(newTab);

	// Adding a new object to the array
	multiValue.push({"note": ""});
	// set the current active tab
	document.getElementById("tabstrip").dataset.active = multiValue.length - 1;
	setActiveTabContent(multiValue.length - 1);
	save();
}
// End tabs functions

var tabContainer;
function init(){
	// open connnection to background that the panel is open
	chrome.runtime.connect({name: "myNoteSidebar"});

	// Begin multiple tabs
	tabContainer = document.querySelector(".tab-bar");

	tabContainer.addEventListener("click", function(event){
		// save previous text
		var previoustab = document.getElementById("tabstrip").dataset.active;
		if(plaintext == true){
			multiValue[previoustab].note = document.getElementById("maintext").value;
		}else if(richtext == true){
			multiValue[previoustab].note = document.getElementById("powertext").innerHTML;
		}

		// change tab
		const targetTab = event.target.closest(".tab");
		if(targetTab && !targetTab.classList.contains("add-tab")){
			setActiveTab(targetTab);
			const index = [...targetTab.parentNode.children].indexOf(targetTab);
			document.getElementById("tabstrip").dataset.active = index;
			setActiveTabContent(index);
		}
	});

	tabContainer.addEventListener("click", function(event){
		if(event.target.classList.contains("tab-close")){
			if(multiValue.length > 1){
				const index = [...event.target.parentNode.parentNode.children].indexOf(event.target.parentNode);
				multiValue = removeObjectAtIndex(index, multiValue);

				document.getElementById("tabstrip").dataset.active = multiValue.length - 1;
				setActiveTabContent(multiValue.length - 1);

				save();

				// remove all tabs
				removeTabs();
				// create all tabs, and set active
				createAllTabsInBar();
				// set the current active tab
				document.getElementById("tabstrip").dataset.active = 0;
				const tabs = document.querySelectorAll(".tab");
				tabs.forEach((t) => t.classList.remove("active"));
				const firstTab = tabs[0];
				firstTab.classList.add("active");
				setActiveTabContent(0);
			}
		}
	});

	document.querySelector(".add-tab").addEventListener("click", createNewTab);
	// End multiple tabs ---

	maintext = document.querySelector("#maintext");
	powertext = document.querySelector("#powertext");
	chrome.storage.sync.get(["firstDate", "optionskipremember", "txtvalue", "multivalue", "counter", "copy", "speech", "voices", "fontsize", "lineheight", "colorlight", "colordark", "backgroundlight", "backgrounddark", "backgroundcolor", "backgroundimage", "backgroundsource", "backgroundsize", "print", "password", "enterpassword", "richtext", "plaintext", "multiple"], function(items){
		theValue = items["txtvalue"]; if(theValue == null){ theValue = i18nfirsttext; }
		multiValue = items["multivalue"]; if(multiValue == null){ multiValue = [{"note":i18nfirsttext}]; }
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
		password = items["password"]; if(password == null){ password = false; }
		enterpassword = items["enterpassword"]; if(enterpassword == null){ enterpassword = ""; }
		richtext = items["richtext"]; if(richtext == null){ richtext = false; }
		plaintext = items["plaintext"]; if(plaintext == null){ plaintext = true; }
		multiple = items["multiple"]; if(multiple == null){ multiple = false; }


		if(password == true){
			var darklayer = document.createElement("div");
			darklayer.id = "lockscreen";
			darklayer.addEventListener("contextmenu", (event) => event.preventDefault());
			document.body.appendChild(darklayer);

			var newinput = document.createElement("input");
			newinput.type = "password";
			newinput.id = "inputpass";
			newinput.setAttribute("autofocus", "autofocus");
			newinput.placeholder = i18npasswordplaceholder;
			newinput.addEventListener("mousemove", function(){
				focuspassword();
			});
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
			focuspassword();
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

		// show the tab bar or not
		applyStyles(multiple, richtext);
		// show the content
		createTabContent();

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

		if(plaintext == true){
			maintext.oninput = function(){
				save();
				countcharacters();
			};
		}else if(richtext == true){
			powertext.oninput = function(){
				save();
				countcharacters();
			};
		}
	});

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
		--ext-font-size:` + fontsize + `px;
		--ext-line-height:` + lineheight + `px;
		--ext-lock-boxshadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
		--ext-lock-hover:#fbfbfb;
	}
	
	/* Dark mode */
	@media (prefers-color-scheme: dark) {
		:root{
		--ext-primary-background:` + backgrounddark + `;
		--ext-primary-font-color:#fff;
		--ext-nav-color:` + colordark + `;
		--ext-font-size:` + fontsize + `px;
		--ext-line-height:` + lineheight + `px;
		--ext-lock-boxshadow: 0 1px 6px 0 rgba(255, 255, 255, 0.28);
		--ext-lock-hover:#282828;
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
	if(plaintext == true){
		document.getElementById("counter").textContent = document.querySelector("#maintext").value.length;
	}else if(richtext == true){
		var content = document.getElementById("powertext").innerText;
		var charCount = content.length;
		document.getElementById("counter").textContent = charCount;
	}
}

window.addEventListener("DOMContentLoaded", () => {
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
		var toSay;
		if(richtext == true){
			toSay = document.getElementById("powertext").innerText.trim();
		}else{
			toSay = document.getElementById("maintext").value.trim();
		}
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
		var input;
		if(richtext == true){
			var content = document.getElementById("powertext").innerHTML;
			// Create a temporary textarea element to hold the content
			var tempTextArea = document.createElement("textarea");
			tempTextArea.value = content;
			document.body.appendChild(tempTextArea);
			// Select and copy the content
			tempTextArea.select();
			document.execCommand("copy");
			// Remove the temporary textarea
			document.body.removeChild(tempTextArea);

			// Select all
			var range = document.createRange();
			range.selectNode(document.getElementById("powertext"));
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}else{
			input = document.getElementById("maintext");
			input.select();
			document.execCommand("copy");
		}

		if(showingcopybadge == false){
			showcopytextbadge();
		}
	});

	document.getElementById("printtext").addEventListener("click", () => {
		print();
	});

});

var showingcopybadge = false;
function showcopytextbadge(){
	var div = document.createElement("div");
	div.setAttribute("id", "stefanvdremoteadd");
	div.className = "stefanvdremote";
	document.body.appendChild(div);

	var h3 = document.createElement("h3");
	h3.innerText = i18ntitelcopytext;
	div.appendChild(h3);

	var p = document.createElement("p");
	p.innerText = i18ndescopytext;
	div.appendChild(p);
	showingcopybadge = true;

	window.setTimeout(function(){
		var element = document.getElementById("stefanvdremoteadd");
		element.parentNode.removeChild(element);
		showingcopybadge = false;
	}, 4000);
}

function applyStyles(multiple, richtext){
	if(multiple){
		// multiple notes
		if(richtext){
			document.getElementById("tabstrip").className = "tab-bar";
			document.getElementById("powertext").className = "enablebar";
		}else{
			document.getElementById("tabstrip").className = "tab-bar";
			document.getElementById("maintext").className = "enablebar";
		}
	}else{
		// single note
		if(richtext){
			document.getElementById("tabstrip").className = "hidden";
			document.getElementById("powertext").className = "regularbar";
		}else{
			document.getElementById("tabstrip").className = "hidden";
			document.getElementById("maintext").className = "regularbar";
		}
	}
}

function createTabContent(){
	if(multiple == true){
		if(!multiValue){
			multiValue = [{"note":""}];
		}

		// remove all tabs
		removeTabs();
		createAllTabsInBar();
		// set the current active tab
		document.getElementById("tabstrip").dataset.active = 0;
		const tabs = document.querySelectorAll(".tab");
		tabs.forEach((t) => t.classList.remove("active"));
		const firstTab = tabs[0];
		firstTab.classList.add("active");

		if(plaintext == true){
			setActiveTabContent(0);
		}else if(richtext == true){
			setActiveTabContent(0);
		}
	}else{
		if(plaintext == true){
			if(!theValue){
				theValue = "";
			}
			maintext.value = theValue;
		}else if(richtext == true){
			if(!theValue){
				theValue = "";
			}
			powertext.innerHTML = theValue;
		}
	}
}

document.addEventListener("DOMContentLoaded", init, false);

chrome.runtime.onMessage.addListener(function(request){
	if(request.msg == "setnotetext"){
		if(plaintext == true){
			document.querySelector("#maintext").value = request.value;
		}else if(richtext == true){
			document.querySelector("#powertext").innerHTML = request.value;
		}
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
	}else if(request.msg == "setbackgroundcolor"){
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
	}else if(request.msg == "settype"){
		location.reload();
	}else if(request.msg == "setmultiple"){
		multiple = request.value;
		applyStyles(request.value, richtext);
		createTabContent();
	}
});