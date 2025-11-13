//================================================
/*

Note Sidebar
Simple note sidebar which can be used to write a note, record thoughts, to-do list, meeting notes, etc.
Copyright (C) 2025 Stefan vd
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

var maintext; var powertext; var txtvalue; var multivalue; var counter; var copy; var speech; var voices; var fontsize; var lineheight; var colorlight; var colordark; var backgroundlight; var backgrounddark; var backgroundcolor; var backgroundimage; var backgroundsource; var backgroundsize; var printicon; var password; var enterpassword; var richtext; var plaintext; var multiple; var preventclose; var texttabname; var save; var bartabdesign; var barselectdesign; var download; var find; var textarea; var highlightedText; var searchInput; var searchBox; var richtexttoolbar; var richtextshortcut; var selectedvoice;

function wrapText(tag){
	const selection = window.getSelection();
	if(!selection.rangeCount)return;

	const range = selection.getRangeAt(0);
	const container = range.commonAncestorContainer;

	// Ensure the selection is inside #powertext
	const powertext = document.getElementById("powertext");
	if(!powertext.contains(container))return;

	function findWrappingTag(node, tagName){
		while(node && node !== document.body){
			if(node.nodeType === 1 && node.tagName === tagName.toUpperCase()){
				return node;
			}
			node = node.parentNode;
		}
		return null;
	}

	const existingTag = findWrappingTag(container, tag);
	if(existingTag){
		// Unwrap: move children out of the tag
		const parent = existingTag.parentNode;
		const children = Array.from(existingTag.childNodes);

		children.forEach((child) => parent.insertBefore(child, existingTag));
		parent.removeChild(existingTag);

		// Restore selection over unwrapped content
		if(children.length > 0){
			selection.removeAllRanges();
			const newRange = document.createRange();
			newRange.setStartBefore(children[0]);
			newRange.setEndAfter(children[children.length - 1]);
			selection.addRange(newRange);
		}
	}else{
		// Wrap
		const el = document.createElement(tag);
		el.appendChild(range.extractContents());
		range.insertNode(el);

		// Restore selection
		selection.removeAllRanges();
		const newRange = document.createRange();
		newRange.selectNodeContents(el);
		selection.addRange(newRange);
	}

	notesave();
}

function changeBlockStyle(tag){
	let selection = window.getSelection();
	if(!selection.rangeCount)return;
	let range = selection.getRangeAt(0);
	let parent = selection.focusNode.parentElement;

	if(parent && parent.tagName.toLowerCase() !== "div"){
		let newElement = document.createElement(tag);
		newElement.innerHTML = parent.innerHTML.replace(/\n/g, "<br>");
		parent.replaceWith(newElement);
	}else{
		let newElement = document.createElement(tag);
		newElement.innerHTML = range.extractContents().textContent.replace(/\n/g, "<br>");
		range.deleteContents();
		range.insertNode(newElement);
	}
	notesave();
}

function clearFormatting(){
	const selection = window.getSelection();
	if(!selection.rangeCount)return;

	const range = selection.getRangeAt(0);
	const container = range.commonAncestorContainer;

	// Ensure the selection is inside #powertext
	const powertext = document.getElementById("powertext");
	if(!powertext.contains(container))return;

	// Function to remove the parent tag of the selected range
	function removeParentTag(node){
		while(node && node !== document.body){
			// Ensure the node is inside #powertext, but not the powertext div itself
			if(node.nodeType === 1 && node !== powertext && powertext.contains(node)){
				const parentNode = node.parentNode;
				const fragment = document.createDocumentFragment();

				// Move all child nodes of the parent element into the document fragment
				while(node.firstChild){
					fragment.appendChild(node.firstChild);
				}

				// Replace the parent element with its children
				parentNode.replaceChild(fragment, node);
				return true;
			}
			node = node.parentNode;
		}
		return false;
	}

	// If the selection is wrapped in a tag, remove it
	if(removeParentTag(container)){
		// Optional: restore selection
		selection.removeAllRanges();
		const newRange = document.createRange();
		newRange.selectNodeContents(container);
		selection.addRange(newRange);

		notesave();
	}
}

function notesave(){
	var savingtext;
	if(plaintext == true){
		savingtext = maintext.value;
	}else if(richtext == true){
		savingtext = powertext.innerHTML;
	}

	if(multiple == true){
		var previoustab = document.getElementById("tabstrip").dataset.active;
		if(plaintext == true){
			multivalue[previoustab].note = savingtext;
		}else if(richtext == true){
			multivalue[previoustab].note = savingtext;
		}
		// Check actual storage usage for 'multivalue' key
		getNotesStorageArea(function(noteStorage){
			noteStorage.getBytesInUse("multivalue", function(bytesInUse){
				// console.log("Current bytes in use (multivalue):", bytesInUse);
				// For sync storage, check if the new value would exceed the 8KB limit
				if(noteStorage === chrome.storage.sync && bytesInUse >= 8192){
					// Default web browser storage 8192 bytes = 8 KB
					// console.log("Warning: Multivalue size exceeds 8 KB limit");
					showWarning(chrome.i18n.getMessage("warningtitle"), chrome.i18n.getMessage("warningdes", String(bytesInUse)));
				}else{
					removeWarning();
				}
				noteStorage.set({"multivalue": multivalue});
				chrome.runtime.sendMessage({name: "newmultinotetext", value: multivalue});
			});
		});
	}else{
		// Check actual storage usage for 'txtvalue' key
		getNotesStorageArea(function(noteStorage){
			noteStorage.getBytesInUse("txtvalue", function(bytesInUse){
				// console.log("Current bytes in use (txtvalue):", bytesInUse);
				// For sync storage, check if the new value would exceed the 8KB limit
				if(noteStorage === chrome.storage.sync && bytesInUse >= 8192){
					// Default web browser storage 8192 bytes = 8 KB
					// console.log("Warning: New value size exceeds 8 KB limit");
					showWarning(chrome.i18n.getMessage("warningtitle"), chrome.i18n.getMessage("warningdes", String(bytesInUse)));
				}else{
					removeWarning();
				}
				txtvalue = savingtext;
				noteStorage.set({"txtvalue": savingtext});
				chrome.runtime.sendMessage({name: "newnotetext", value: savingtext});
			});
		});
	}
}

var i18nfirsttext = chrome.i18n.getMessage("firsttext");
var i18ndefault = chrome.i18n.getMessage("titeldefault");
var i18npasswordplaceholder = chrome.i18n.getMessage("passwordplaceholder");
var i18ntitelcopytext = chrome.i18n.getMessage("titlecopytextdone");
var i18ndescopytext = chrome.i18n.getMessage("descopytextdone");
var i18nnote = chrome.i18n.getMessage("note");
var i18nclosetab = chrome.i18n.getMessage("closetab");
var i18ntitelsavetext = chrome.i18n.getMessage("titlesavetextdone");
var i18ndessavetext = chrome.i18n.getMessage("descopysavedone");
var i18ntooltipremovenote = chrome.i18n.getMessage("tooltipremovenote");

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
	// That is for regular tab bar
	// Remove all elements with the class "tab" inside "tabstrip"
	var tabs = document.getElementById("tabstrip").querySelectorAll(".tab");
	tabs.forEach(function(tab){
		tab.parentNode.removeChild(tab);
	});

	// That is for selection box
	// Remove the <select> element with class "tab-select"
	var selectElement = document.querySelector(".tab-select");
	if(selectElement){
		selectElement.parentNode.removeChild(selectElement);
	}

	// Remove all <button> elements with the class "sel-close"
	var buttons = document.querySelectorAll(".sel-close");
	buttons.forEach(function(button){
		button.parentNode.removeChild(button);
	});
}

function setActiveTab(tab){
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((t) => t.classList.remove("active"));
	tab.classList.add("active");
}

function setActiveTabContent(numb){
	// Retrieve the note value
	var noteValue = multivalue[numb].note;
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
	var totaltabs = multivalue.length;
	// Loop to create the specified number of tabs
	for(var i = 0; i < totaltabs; i++){
		const newTab = document.createElement("div");
		newTab.classList.add("tab");
		const titleDiv = document.createElement("div");
		titleDiv.classList.add("title");
		titleDiv.textContent = i18nnote + parseInt(i + 1);
		newTab.appendChild(titleDiv);
		newTab.innerHTML += "<div class=\"tab-close\">x</div>";
		tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
	}

	if(barselectdesign == true){
		// Create the selection box dynamically
		const selectBox = document.createElement("select");
		selectBox.classList.add("tab-select");
		tabContainer.appendChild(selectBox);

		// Event listener for tab switching
		selectBox.addEventListener("change", function(){
			hideSearchBox();
			switchToTab(this.value);
		});
		for(var j = 0; j < totaltabs; j++){
			// Add an option to the selection box for each tab
			const option = document.createElement("option");
			option.value = j; // Tab index
			option.textContent = i18nnote + parseInt(j + 1);
			selectBox.appendChild(option);
		}

		// Add close button to the tab
		const closeButton = document.createElement("button");
		closeButton.classList.add("sel-close");
		closeButton.title = i18ntooltipremovenote;
		closeButton.textContent = "x";
		closeButton.addEventListener("click", function(){
			hideSearchBox();
			removeTab();
		});
		tabContainer.appendChild(closeButton);
	}
}

function removeTab(){
	var continueremove = false;
	if(preventclose == true){
		// Example usage
		var userResponse = showConfirmationDialog();
		if(userResponse == 1){
			// yes
			continueremove = true;
			// remove tab
		}else{
			// no
			continueremove = false;
			// do nothing
		}
	}else{
		continueremove = true;
	}

	if(continueremove == true){
		if(multivalue.length > 1){
			const index = document.getElementById("tabstrip").dataset.active;
			multivalue = removeObjectAtIndex(index, multivalue);

			document.getElementById("tabstrip").dataset.active = multivalue.length - 1;
			setActiveTabContent(multivalue.length - 1);

			notesave();

			if(barselectdesign == true){
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

				updatetabname();
			}
		}
	}
}

// Function to switch to a specific tab by index
function switchToTab(index){
	// Clear active state from all tabs
	const tabs = tabContainer.querySelectorAll(".tab");
	tabs.forEach((tab) => tab.classList.remove("active"));

	switchtab(index);
}

function createNewTab(){
	hideSearchBox();
	if(bartabdesign == true){
		const newTab = document.createElement("div");
		newTab.classList.add("tab");
		const titleDiv = document.createElement("div");
		titleDiv.classList.add("title");
		titleDiv.textContent = i18nnote + ` ${tabContainer.children.length}`;
		newTab.appendChild(titleDiv);
		newTab.innerHTML += "<div class=\"tab-close\">x</div>";
		tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
		setActiveTab(newTab);
	}else{
		const newTab = document.createElement("div");
		newTab.classList.add("tab");
		const titleDiv = document.createElement("div");
		titleDiv.classList.add("title");
		titleDiv.textContent = i18nnote + ` ${tabContainer.children.length}`;
		newTab.appendChild(titleDiv);
		newTab.innerHTML += "<div class=\"sel-close\">x</div>";
		tabContainer.insertBefore(newTab, tabContainer.lastElementChild);
		setActiveTab(newTab);

		// Add the new tab to the selection box
		var tabs = document.getElementById("tabstrip").querySelectorAll(".tab");
		const tabIndex = tabs.length - 1;
		newTab.dataset.tabIndex = tabIndex;
		var selectBox = document.querySelector(".tab-select");
		const option = document.createElement("option");
		option.value = tabIndex; // Tab index
		option.textContent = i18nnote + ` ${tabIndex + 1}`;
		selectBox.appendChild(option);
		selectBox.value = tabIndex;
	}

	// Adding a new object to the array
	multivalue.push({"note": ""});
	// set the current active tab
	document.getElementById("tabstrip").dataset.active = multivalue.length - 1;
	setActiveTabContent(multivalue.length - 1);
	notesave();
}
// End tabs functions

// Function to show a custom confirmation dialog
function showConfirmationDialog(){
	if(exbrowser == "opera"){
		// Opera does not support confirm in this panel
		return new Promise((resolve) => {
			// Create modal container
			const modal = document.createElement("div");
			modal.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.5);
				display: table;
				z-index: 3000;
				font-family: Arial, sans-serif;
			`;

			// Create modal content
			const modalContent = document.createElement("div");
			modalContent.style.cssText = `
				display: table-cell;
				vertical-align: middle;
				padding: 20px;
			`;

			// Create dialog box
			const dialogBox = document.createElement("div");
			dialogBox.style.cssText = `
				background: var(--ext-primary-background, #fff);
				color: var(--ext-primary-font-color, #000);
				max-width: 400px;
				margin: auto;
				padding: 20px;
				border-radius: 8px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			`;

			// Add message
			const message = document.createElement("p");
			message.textContent = i18nclosetab;
			message.style.cssText = `
				margin: 0 0 20px 0;
				font-size: 14px;
			`;

			// Create button container
			const buttonContainer = document.createElement("div");
			buttonContainer.style.cssText = `
				display: flex;
				justify-content: flex-end;
				gap: 10px;
			`;

			// Create buttons
			const okButton = document.createElement("button");
			okButton.textContent = chrome.i18n.getMessage("titleok");
			okButton.style.cssText = `
				padding: 8px 16px;
				border: none;
				border-radius: 4px;
				background: #4285f4;
				color: white;
				cursor: pointer;
			`;
			okButton.addEventListener("click", () => {
				document.body.removeChild(modal);
				resolve(1);
			});

			const cancelButton = document.createElement("button");
			cancelButton.textContent = chrome.i18n.getMessage("titlecancel");
			cancelButton.style.cssText = `
				padding: 8px 16px;
				border: none;
				border-radius: 4px;
				background: var(--ext-secundar-background, #f1f1f1);
				color: var(--ext-primary-font-color, #000);
				cursor: pointer;
			`;
			cancelButton.addEventListener("click", () => {
				document.body.removeChild(modal);
				resolve(0);
			});

			// Assemble the modal
			buttonContainer.appendChild(cancelButton);
			buttonContainer.appendChild(okButton);
			dialogBox.appendChild(message);
			dialogBox.appendChild(buttonContainer);
			modalContent.appendChild(dialogBox);
			modal.appendChild(modalContent);
			document.body.appendChild(modal);

			// Focus the OK button
			okButton.focus();
		});
	}else{
		// all other web browsers
		// Display the confirmation dialog with custom message
		var result = confirm(i18nclosetab);

		// Check the result and return 1 for 'Yes' and 0 for 'No'
		if(result){
			return 1; // 'Yes' clicked
		}else{
			return 0; // 'No' clicked
		}
	}
}

// Begin Hard Saving ---
// Chrome.storage API MAX_WRITE_OPERATIONS_PER_MINUTE = 120
// 500ms (2 per second)

// Queue to store save requests
let saveQueue = [];

// Function to process the save queue
function processQueue(){
	if(saveQueue.length === 0)return;

	// Get the next save request from the queue
	const nextSave = saveQueue.shift();

	// Execute the save function
	nextSave();

	// Process the next save request after 1 second
	setTimeout(processQueue, 1000);
}

// Your save function that writes to chrome storage
function hardsave(){
	// Add the save request to the queue
	saveQueue.push(() => {
		// Send the message and wait for a response
		chrome.runtime.sendMessage({name: "hardsave"});
	});

	// If the queue was empty before adding this save request, start processing
	if(saveQueue.length === 1){
		processQueue();
	}
}
// End Hard Saving ---

function switchtab(number){
	// save previous text
	var previoustab = document.getElementById("tabstrip").dataset.active;
	if(plaintext == true){
		multivalue[previoustab].note = document.getElementById("maintext").value;
	}else if(richtext == true){
		multivalue[previoustab].note = document.getElementById("powertext").innerHTML;
	}

	// change tab
	// set that to active tab
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((t) => t.classList.remove("active"));
	const firstTab = tabs[number];
	firstTab.classList.add("active");
	document.getElementById("tabstrip").dataset.active = number;
	setActiveTabContent(number);

	// recount characters
	if(counter == true){
		countcharacters();
	}
}

var tabContainer;
var currentVoice;
function init(){
	// open connnection to background that the panel is open
	chrome.runtime.connect({name: "myNoteSidebar"});

	// Begin multiple tabs
	tabContainer = document.querySelector(".tab-bar");

	tabContainer.addEventListener("click", function(event){
		hideSearchBox();

		// save previous text
		var previoustab = document.getElementById("tabstrip").dataset.active;
		if(plaintext == true){
			multivalue[previoustab].note = document.getElementById("maintext").value;
		}else if(richtext == true){
			multivalue[previoustab].note = document.getElementById("powertext").innerHTML;
		}

		// change tab
		const targetTab = event.target.closest(".tab");
		if(targetTab && !targetTab.classList.contains("add-tab")){
			setActiveTab(targetTab);
			const index = [...targetTab.parentNode.children].indexOf(targetTab);
			document.getElementById("tabstrip").dataset.active = index;
			setActiveTabContent(index);
		}

		// recount characters
		if(counter == true){
			countcharacters();
		}
	});

	tabContainer.addEventListener("click", function(event){
		if(event.target.classList.contains("tab-close")){
			hideSearchBox();
			var continueremove = false;
			if(preventclose == true){
				// Example usage
				var userResponse = showConfirmationDialog();
				if(userResponse == 1){
					// yes
					continueremove = true;
					// remove tab
				}else{
					// no
					continueremove = false;
					// do nothing
				}
			}else{
				continueremove = true;
			}

			if(continueremove == true){
				if(multivalue.length > 1){
					const index = [...event.target.parentNode.parentNode.children].indexOf(event.target.parentNode);
					multivalue = removeObjectAtIndex(index, multivalue);

					document.getElementById("tabstrip").dataset.active = multivalue.length - 1;
					setActiveTabContent(multivalue.length - 1);

					notesave();

					if(bartabdesign == true){
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

						updatetabname();
					}else{
						// have the own function, see class "sel-close"
					}
				}
			}
		}
	});

	document.querySelector(".add-tab").addEventListener("click", createNewTab);
	// End multiple tabs ---

	maintext = document.querySelector("#maintext");
	powertext = document.querySelector("#powertext");

	loadNotesAndSettings(function(items){
		txtvalue = items["txtvalue"]; if(txtvalue == null){ txtvalue = i18nfirsttext; }
		multivalue = items["multivalue"]; if(multivalue == null){ multivalue = [{"note":i18nfirsttext}]; }
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
		preventclose = items["preventclose"]; if(preventclose == null){ preventclose = false; }
		texttabname = items["texttabname"]; if(texttabname == null){ texttabname = false; }
		save = items["save"]; if(save == null){ save = false; }
		bartabdesign = items["bartabdesign"]; if(bartabdesign == null){ bartabdesign = true; }
		barselectdesign = items["barselectdesign"]; if(barselectdesign == null){ barselectdesign = false; }
		download = items["download"]; if(download == null){ download = false; }
		find = items["find"]; if(find == null){ find = false; }
		richtexttoolbar = items["richtexttoolbar"]; if(richtexttoolbar == null){ richtexttoolbar = false; }
		richtextshortcut = items["richtextshortcut"]; if(richtextshortcut == null){ richtextshortcut = false; }
		selectedvoice = items["selectedvoice"]; if(selectedvoice == null){ selectedvoice = 0; }

		if(richtexttoolbar == true){
			document.getElementById("richtexttoolbar").className = "richtexttoolbar";
		}else{
			document.getElementById("richtexttoolbar").className = "hidden";
		}

		document.getElementById("btnbold").addEventListener("click", function(){
			wrapText("b");
		}, false);
		document.getElementById("btnitalic").addEventListener("click", function(){
			wrapText("i");
		}, false);
		document.getElementById("btnunderline").addEventListener("click", function(){
			wrapText("u");
		}, false);
		document.getElementById("btnstrikethrough").addEventListener("click", function(){
			wrapText("s");
		}, false);
		document.getElementById("btnh1").addEventListener("click", function(){
			changeBlockStyle("h1");
		}, false);
		document.getElementById("btnh2").addEventListener("click", function(){
			changeBlockStyle("h2");
		}, false);
		document.getElementById("btnp").addEventListener("click", function(){
			changeBlockStyle("p");
		}, false);
		document.getElementById("btnclearformat").addEventListener("click", function(){
			clearFormatting();
		}, false);

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

		if(save == true){
			document.getElementById("savetext").className = "btn-save";
		}else{
			document.getElementById("savetext").className = "hidden";
		}

		if(download == true){
			document.getElementById("downloadtext").className = "btn-download";
		}else{
			document.getElementById("downloadtext").className = "hidden";
		}

		if(find == true){
			document.getElementById("findtext").className = "btn-find";
		}else{
			document.getElementById("findtext").className = "hidden";
		}

		if(backgroundimage == true){
			addbackgroundpaper();
		}

		if(richtextshortcut == true){
			addRichTextShortcut();
		}

		// Add stylesheet
		addstylecode();

		if(plaintext == true){
			maintext.oninput = function(){
				notesave();
				countcharacters();
				updatetabname();
				hardsave();
			};
		}else if(richtext == true){
			powertext.oninput = function(){
				notesave();
				countcharacters();
				updatetabname();
				hardsave();
			};
		}

		// on the end update tab names or not
		updatetabname();

		// Find that text
		if(plaintext == true){
			textarea = document.getElementById("maintext");
		}else if(richtext == true){
			textarea = document.getElementById("powertext");
		}

		highlightedText = document.getElementById("highlighted-text");
		searchInput = document.getElementById("search-input");
		searchBox = document.getElementById("search-box");
		const closeSearchButton = document.getElementById("close-search-box");

		// Event listeners
		textarea.addEventListener("scroll", syncScroll);
		searchInput.addEventListener("input", updateHighlight);
		closeSearchButton.addEventListener("click", hideSearchBox);

		// Speech Synthesis - Populate voices list
		populateVoices();
		// Speech Synthesis - Load voices
		if(speechSynthesis.onvoiceschanged !== undefined){
			speechSynthesis.onvoiceschanged = populateVoices;
		}
	});

	document.querySelector(".close").addEventListener("click", () => {
		document.getElementById("stefanvdpromo").className = "hidden";
	});

	document.getElementById("voices").addEventListener("change", (event) => {
		const selectedIndex = event.target.selectedIndex;
		currentVoice = voices[selectedIndex];

		// save selected voice index selectedIndex;
		chrome.storage.sync.set({"selectedvoice": selectedIndex});
	});

	var utterance;
	document.getElementById("startspeech").addEventListener("click", (event) => {
		event.preventDefault();

		// set the selected voice
		var currentvoice = document.getElementById("voices").selectedIndex;
		currentVoice = voices[currentvoice];
		// ---

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
			document.getElementsByTagName("main")[0].classList.add("speaking");
			document.getElementById("startspeech").classList.add("hidden");
			document.getElementById("stopspeech").classList.remove("hidden");
		});
		utterance.addEventListener("end", () => {
			document.getElementsByTagName("main")[0].classList.remove("speaking");
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

	document.getElementById("savetext").addEventListener("click", () => {
		notesave();
		if(showingsavebadge == false){
			showsavetextbadge();
		}
	});

	document.getElementById("downloadtext").addEventListener("click", () => {
		var notecontent;
		if(plaintext == true){
			notecontent = document.getElementById("maintext").value;
		}else if(richtext == true){
			notecontent = document.getElementById("powertext").innerHTML;
		}
		// Create a Blob object with the note content
		const blob = new Blob([notecontent], {type: "text/plain"});

		// Create a download link
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "note.txt"; // Default filename for the download

		// Trigger the download
		link.click();

		// Clean up the URL object
		URL.revokeObjectURL(link.href);
	});

	document.getElementById("printtext").addEventListener("click", () => {
		print();
	});

	document.getElementById("findtext").addEventListener("click", () => {
		if(searchBox.className === "hidden"){
			searchBox.className = "";
			searchInput.focus();
			updateHighlight();
		}else{
			searchBox.className = "hidden";
			clearHighlights();
			highlightedText.textContent = "";
		}
	});

	// Function to set cursor to the end of the input field
	const setCursorToEnd = () => {
		if(richtext == true){
			const powerTextDiv = document.getElementById("powertext");
			if(powerTextDiv){
				const range = document.createRange();
				const selection = window.getSelection();
				range.selectNodeContents(powerTextDiv);
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);
				powerTextDiv.focus();
			}
		}else{
			const input = document.getElementById("maintext");
			if(input){
				// Focus the input field
				input.focus();
				// Set cursor position to the end
				input.setSelectionRange(input.value.length, input.value.length);
			}
		}
	};

	// Set a timeout to execute the function after 1,5 seconds (1500 milliseconds)
	setTimeout(setCursorToEnd, 1500);
}

const populateVoices = () => {
	const availableVoices = speechSynthesis.getVoices();
	document.getElementById("voices").innerHTML = "";

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
		document.getElementById("voices").appendChild(option);
	});
	voices = availableVoices;

	// set selected voice from settings
	document.getElementById("voices").selectedIndex = selectedvoice;
	currentVoice = voices[selectedvoice];
};

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

function stripHtmlTags(str){
	return str.replace(/<[^>]*>/g, ""); // Removes all HTML tags
}

function updatetabname(){
	if(texttabname == true){
		if(multiple == true){
			// multi
			// Get the tab titles
			var tabTitles = document.querySelectorAll(".tab .title");
			// Get the select element
			var selectElement = document.querySelector(".tab-select");

			// Loop through each tab title
			tabTitles.forEach(function(title, index){
				// Ensure the note exists before processing
				var noteText = multivalue[index]?.note || "";

				// Get the first line of the note text
				var firstLine;
				if(richtext == true){
					try{
						// Treat <div> and <br> as line breaks BEFORE parsing
						let cleanHTML = noteText
							.replace(/<div[^>]*>/gi, "\n")
							.replace(/<br\s*\/?>/gi, "\n")
							.replace(/<\/div>/gi, "");

						const parser = new DOMParser();
						const doc = parser.parseFromString(cleanHTML, "text/html");

						// Extract text content
						let text = doc.body.textContent || "";
						text = text.replace(/\u00a0/g, " "); // replace &nbsp;

						// Split into lines, trim, and remove empty ones
						const lines = text
							.split(/\r?\n+/)
							.map((line) => line.trim())
							.filter((line) => line.length > 0);

						// First non-empty line
						firstLine = lines.length > 0 ? lines[0] : "";
					}catch(e){
						firstLine = "";
					}
				}else{
					// plaintext default
					firstLine = noteText.split("\n")[0].trim();
					firstLine = stripHtmlTags(firstLine);
				}

				if(!firstLine){
					// If note text is empty, show default text with index number
					firstLine = i18nnote + (index + 1);
				}

				// Update the tab title with the first line of the note text
				if(title){
					title.textContent = firstLine;
				}

				// Also update the select option text
				if(selectElement){
					// Ensure the 'options' property exists and the index is within bounds
					if(selectElement.options && selectElement.options[index]){
						selectElement.options[index].textContent = firstLine;
					}
				}
			});
		}else{
			// single
		}
	}else{
		// update to use the regular tab names
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

function addRichTextShortcut(){
	const element = document.getElementById("powertext");
	if(element){
		element.addEventListener("keydown", createrichtextshortcut);
	}
}

function removeRichTextShortcut(){
	const element = document.getElementById("powertext");
	if(element){
		element.removeEventListener("keydown", createrichtextshortcut);
	}
}

function createrichtextshortcut(e){
	if(richtext !== true)return;

	const selection = window.getSelection();
	if(!selection.rangeCount)return;

	// Ctrl + Shift + X → Strikethrough toggle
	if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "x"){
		e.preventDefault();
		wrapText("s");
	}

	// Ctrl + Shift + C → Clear formatting
	if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c"){
		e.preventDefault();
		clearFormatting();
	}

	notesave();
}

function clearHighlights(){
	var text;
	if(plaintext === true){
		text = textarea.value;
		// Escape < and > for display purposes
		text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}else if(richtext === true){
		text = textarea.innerHTML;
	}
	highlightedText.innerHTML = text.replace(/\n/g, "<br>");
}

// Function to update the highlighted text
function updateHighlight(){
	var searchQuery = "";
	if(searchInput){
		searchQuery = searchInput.value.toLowerCase();
	}

	var text;
	if(plaintext === true){
		text = textarea.value; // Get original text
	}else if(richtext === true){
		text = textarea.innerHTML;
	}

	if(!searchQuery){
		if(plaintext === true){
			// Escape < and > for display purposes
			highlightedText.innerHTML = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
		}else if(richtext === true){
			highlightedText.innerHTML = text.replace(/\n/g, "<br>"); // Preserve line breaks
		}
		return;
	}

	// Use regex to find matches for the search term in the original text
	const regex = new RegExp(searchQuery, "gi");

	let highlighted = text.replace(regex, (match) => {
		return`<span class="highlight">${match}</span>`;
	});

	if(plaintext === true){
		// Escape < and > for non-highlighted parts of the text
		highlighted = highlighted
			.replace(/&(?!(lt|gt|amp);)/g, "&amp;") // Escape standalone & to prevent misinterpretation
			.replace(/</g, "&lt;") // Escape <
			.replace(/>/g, "&gt;") // Escape >
			.replace(/&lt;span class="highlight"&gt;/g, "<span class=\"highlight\">") // Restore highlight opening tag
			.replace(/&lt;\/span&gt;/g, "</span>"); // Restore highlight closing tag

		highlightedText.innerHTML = highlighted.replace(/\n/g, "<br>"); // Preserve line breaks
	}else if(richtext === true){
		highlightedText.innerHTML = highlighted; // Preserve line breaks
	}
}

// Synchronize the textarea and highlighted text
function syncScroll(){
	highlightedText.scrollTop = textarea.scrollTop;
}

function hideSearchBox(){
	searchBox.className = "hidden";
	clearHighlights();
	highlightedText.textContent = "";
}

// Badge queue to prevent overlapping badges
let badgeQueue = [];
let badgeShowing = false;

function showBadge(title, description){
	badgeQueue.push({title, description});
	processBadgeQueue();
}

function showWarning(title, description){
	var el = document.getElementById("warning");
	while(el.firstChild)el.removeChild(el.firstChild);
	el.className = "warning-message";

	var divtitle = document.createElement("div");
	divtitle.className = "title";
	divtitle.innerText = title;
	el.appendChild(divtitle);

	var divdes = document.createElement("div");
	divdes.className = "description";
	divdes.innerText = description;
	el.appendChild(divdes);
}

function removeWarning(){
	var el = document.getElementById("warning");
	el.className = "hidden";
	while(el.firstChild)el.removeChild(el.firstChild);
}

function processBadgeQueue(){
	if(badgeShowing || badgeQueue.length === 0)return;
	badgeShowing = true;
	const{title, description} = badgeQueue.shift();

	var div = document.createElement("div");
	div.setAttribute("id", "stefanvdremoteadd");
	div.className = "stefanvdremote";
	document.body.appendChild(div);

	var h3 = document.createElement("h3");
	h3.innerText = title;
	div.appendChild(h3);

	var p = document.createElement("p");
	p.innerText = description;
	div.appendChild(p);

	window.setTimeout(function(){
		var element = document.getElementById("stefanvdremoteadd");
		if(element && element.parentNode){
			element.parentNode.removeChild(element);
		}
		badgeShowing = false;
		processBadgeQueue();
	}, 4000);
}

var showingcopybadge = false;
function showcopytextbadge(){
	if(!showingcopybadge){
		showingcopybadge = true;
		showBadge(i18ntitelcopytext, i18ndescopytext);
	}
}

var showingsavebadge = false;
function showsavetextbadge(){
	if(!showingsavebadge){
		showingsavebadge = true;
		showBadge(i18ntitelsavetext, i18ndessavetext);
	}
}

function applyStyles(multiple, richtext){
	if(multiple){
		// multiple notes
		if(richtext){
			if(richtexttoolbar == true){
				document.getElementById("richtexttoolbar").className = "richtexttoolbar";
				document.getElementById("tabstrip").className = "tab-bar";
				document.getElementById("powertext").className = "enablerichbarmulti";
				document.getElementById("highlighted-text").className = "enablerichbarmulti";
			}else{
				document.getElementById("richtexttoolbar").className = "hidden";
				document.getElementById("tabstrip").className = "tab-bar";
				document.getElementById("powertext").className = "enablebar";
				document.getElementById("highlighted-text").className = "enablebar";
			}
		}else{
			document.getElementById("richtexttoolbar").className = "hidden";
			document.getElementById("tabstrip").className = "tab-bar";
			document.getElementById("maintext").className = "enablebar";
			document.getElementById("highlighted-text").className = "enablebar";
		}
	}else{
		// single note
		if(richtext){
			if(richtexttoolbar == true){
				document.getElementById("richtexttoolbar").className = "richtexttoolbar";
				document.getElementById("tabstrip").className = "hidden";
				document.getElementById("powertext").className = "enablerichbarsingle";
				document.getElementById("highlighted-text").className = "enablerichbarsingle";
			}else{
				document.getElementById("richtexttoolbar").className = "hidden";
				document.getElementById("tabstrip").className = "hidden";
				document.getElementById("powertext").className = "regularbar";
				document.getElementById("highlighted-text").className = "regularbar";
			}
		}else{
			document.getElementById("richtexttoolbar").className = "hidden";
			document.getElementById("tabstrip").className = "hidden";
			document.getElementById("maintext").className = "regularbar";
			document.getElementById("highlighted-text").className = "regularbar";
		}
	}
}

function createTabContent(){
	if(multiple == true){
		if(multivalue == null){ multivalue = [{"note":i18nfirsttext}]; }

		if(bartabdesign == true){
			document.getElementById("tabstrip").setAttribute("data-hide", "false");
		}else{
			document.getElementById("tabstrip").setAttribute("data-hide", "true");
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
			if(!txtvalue){
				txtvalue = "";
			}
			maintext.value = txtvalue;
		}else if(richtext == true){
			if(!txtvalue){
				txtvalue = "";
			}
			powertext.innerHTML = txtvalue;
		}
	}

	// recount characters
	if(counter == true){
		countcharacters();
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
		updatetabname();
	}else if(request.msg == "setnotemulti"){
		multivalue = request.value;
		applyStyles(multivalue, richtext);
		createTabContent();
		updatetabname();
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
		txtvalue = request.singletext;
		multivalue = request.tabtext;
		applyStyles(multiple, richtext);
		createTabContent();

		updatetabname();
	}else if(request.msg == "setpreventclose"){
		if(multiple == true){
			if(request.value == true){
				preventclose = true;
			}else{
				preventclose = false;
			}
		}
	}else if(request.msg == "settexttabname"){
		if(multiple == true){
			hideSearchBox();
			if(request.value == true){
				texttabname = true;
				updatetabname();
			}else{
				texttabname = false;
				if(bartabdesign == true){
					document.getElementById("tabstrip").setAttribute("data-hide", "false");
				}else{
					document.getElementById("tabstrip").setAttribute("data-hide", "true");
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
				setActiveTabContent(0);
			}
		}
	}else if(request.msg == "setlineheight"){
		lineheight = request.value;
		removestylecode();
		addstylecode();
	}else if(request.msg == "setsave"){
		if(request.value == true){
			document.getElementById("savetext").className = "btn-save";
		}else{
			document.getElementById("savetext").className = "hidden";
		}
	}else if(request.msg == "setdownload"){
		if(request.value == true){
			document.getElementById("downloadtext").className = "btn-download";
		}else{
			document.getElementById("downloadtext").className = "hidden";
		}
	}else if(request.msg == "setbartabdesign"){
		bartabdesign = true;
		barselectdesign = false;

		hideSearchBox();

		document.getElementById("tabstrip").setAttribute("data-hide", "false");
		// remove all tabs
		removeTabs();
		createAllTabsInBar();
		// set the current active tab
		document.getElementById("tabstrip").dataset.active = 0;
		const tabs = document.querySelectorAll(".tab");
		tabs.forEach((t) => t.classList.remove("active"));
		const firstTab = tabs[0];
		firstTab.classList.add("active");
		setActiveTabContent(0);

		updatetabname();
	}else if(request.msg == "setbarselectdesign"){
		bartabdesign = false;
		barselectdesign = true;

		hideSearchBox();

		document.getElementById("tabstrip").setAttribute("data-hide", "true");
		// remove all tabs
		removeTabs();
		createAllTabsInBar();
		// set the current active tab
		document.getElementById("tabstrip").dataset.active = 0;
		const tabs = document.querySelectorAll(".tab");
		tabs.forEach((t) => t.classList.remove("active"));
		const firstTab = tabs[0];
		firstTab.classList.add("active");
		setActiveTabContent(0);

		updatetabname();
	}else if(request.msg == "setfind"){
		if(request.value == true){
			document.getElementById("findtext").className = "btn-find";
		}else{
			document.getElementById("findtext").className = "hidden";
		}
	}else if(request.msg == "setrichtexttoolbar"){
		richtexttoolbar = request.value;
		if(richtexttoolbar == true){
			document.getElementById("richtexttoolbar").className = "richtexttoolbar";
		}else{
			document.getElementById("richtexttoolbar").className = "hidden";
		}
		applyStyles(multiple, richtext);
	}else if(request.msg == "setrichtextshortcut"){
		if(request.value == true){
			addRichTextShortcut();
		}else{
			removeRichTextShortcut();
		}
	}
});

// Helper to get the correct storage area for notes
function getNotesStorageArea(callback){
	chrome.storage.sync.get(["notesStorageType"], function(items){
		if(items.notesStorageType === "local"){
			callback(chrome.storage.local);
		}else{
			callback(chrome.storage.sync);
		}
	});
}

function loadNotesAndSettings(callback){
	// Load txtvalue and multivalue from the correct storage
	getNotesStorageArea(function(noteStorage){
		noteStorage.get(["txtvalue", "multivalue"], function(noteItems){
			// Load all other settings from sync
			chrome.storage.sync.get(["firstDate", "optionskipremember", "counter", "copy", "speech", "voices", "fontsize", "lineheight", "colorlight", "colordark", "backgroundlight", "backgrounddark", "backgroundcolor", "backgroundimage", "backgroundsource", "backgroundsize", "print", "password", "enterpassword", "richtext", "plaintext", "multiple", "preventclose", "texttabname", "save", "bartabdesign", "barselectdesign", "download", "find", "richtexttoolbar", "richtextshortcut", "selectedvoice"], function(settingsItems){
				callback(Object.assign({}, noteItems, settingsItems));
			});
		});
	});
}