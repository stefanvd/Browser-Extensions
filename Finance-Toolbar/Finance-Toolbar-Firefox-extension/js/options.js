//================================================
/*

Finance Toolbar
Get real time stock market information about your favorite stocks. With mini-charts of the currency value.
Copyright (C) 2018 Stefan vd
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

window.addEventListener("message", (event) => {
	if(event.origin == "https://www.stefanvd.net"){
    if (event.source == window &&
        event.data &&
        event.data.direction == "from-page-script") {
        //alert("Content script received message: \"" + event.data.message + "\"");
        var myid = chrome.runtime.id;
        var myversion = chrome.runtime.getManifest().version;
        window.postMessage({
            direction: "from-financetoolbar-script",
            message: myid,
            version: myversion
        }, "https://www.stefanvd.net");
    }
    }
});

// Option to save current value
function save_options(){
	var em = $("marqueebehaviour");
	var ed = $("direction");
    var eg = $("getfontfamily");
    var se = $("searchbehaviour");

	// Excluded domains
	var excludedstockBox = document.getElementById("excludedstockBox");
	var excludedstock = {};
	for (var i = 0; i < excludedstockBox.length; i++){excludedstock[excludedstockBox.options[i].value] = true;}

	// toolbar Excluded domains
	var toolbarDomainsBox = $("toolbarDomainsBox");
	var toolbarDomains = {};
	for (var i = 0; i < toolbarDomainsBox.length; i++){toolbarDomains[toolbarDomainsBox.options[i].value] = true;}

    // Excluded domains double
	var excludedstockBoxdouble = document.getElementById("excludedstockBoxdouble");
	var excludedstockdouble = {};
	for (var i = 0; i < excludedstockBoxdouble.length; i++){excludedstockdouble[excludedstockBoxdouble.options[i].value] = true;}

  chrome.storage.sync.set({ "marqueebehaviour": em.options[em.selectedIndex].value, "direction": ed.options[ed.selectedIndex].value, "scrollamount": $('scrollamount').value, "japan": $('japan').checked, "xminutes": $('xminutes').value, "favoritestock": $('favoritestock').checked, "favo1": $('favo1').value, "favo2": $('favo2').value, "favo3": $('favo3').value, "favo4": $('favo4').value, "getinfovaluepercent": $('getinfovaluepercent').checked, "getinfovaluestock": $('getinfovaluestock').checked, "getinfovaluemc": $('getinfovaluemc').checked, "getfontfamily": eg.options[eg.selectedIndex].value, "getfontsize": $('getfontsize').value, "excludedstock": JSON.stringify(excludedstock),"optionskipremember": $('optionskipremember').checked, "lightcolor": $('lightcolor').value, "redcolor": $('redcolor').value, "greencolor": $('greencolor').value,"textcolor": $('textcolor').value, "dropshadow": $("dropshadow").checked,"toolbarDomains": JSON.stringify(toolbarDomains), "allsites": $("allsites").checked, "toolbaronly": $("toolbaronly").checked,"excludedstockdouble": JSON.stringify(excludedstockdouble),"doublebar": $("doublebar").checked, "getpositiontop": $("getpositiontop").checked,'getpositionbottom': $("getpositionbottom").checked, 'scrollbar': $("scrollbar").checked, 'staticbar': $("staticbar").checked,"favo1b": $('favo1b').value, "favo2b": $('favo2b').value, "favo3b": $('favo3b').value, "favo4b": $('favo4b').value, "fillchange": $("fillchange").checked, "toolbarwhite": $("toolbarwhite").checked, "toolbarblack": $("toolbarblack").checked, "worldmapcolor": $('worldmapcolor').value, "worldmapopacity": $('worldmapopacity').value, "hideworldmap": $('hideworldmap').checked, "getfullvaluedata": $('getfullvaluedata').checked, "fullname": $('fullname').checked, "fullnamearea": $('fullnamearea').value, "searchbehaviour": se.options[se.selectedIndex].value, "bellmarket": $("bellmarket").checked, "opentime": $('opentime').value, "closetime": $('closetime').value, "simultan": $("simultan").checked, "fromiexe": $("fromiexe").checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['getinfovaluepercent','getinfovaluestock','getinfovaluepercent','dropshadow','allsites','getpositiontop','getpositionbottom','scrollbar','staticbar','favoritestock','toolbarwhite','toolbarblack','getfullvaluedata','simultan','fromiexe'], function(items){
    // find no localstore zoomengine
	if(items['getinfovaluepercent'] == null && items['getinfovaluestock'] == null && items['getinfovaluemc'] == null && items['getfullvaluedata'] == null){firstdefaultvalues['getinfovaluepercent'] = true;firstdefaultvalues['getinfovaluestock'] = false;firstdefaultvalues['getinfovaluemc'] = false;firstdefaultvalues['getfullvaluedata'] = false;}
    if(items['dropshadow'] == null){firstdefaultvalues['dropshadow'] = true}
    if(items['allsites'] == null){firstdefaultvalues['allsites'] = true}
    if(items['getpositiontop'] == null && items['getpositionbottom'] == null){firstdefaultvalues['getpositiontop'] = true;firstdefaultvalues['getpositionbottom'] = false;}
    if(items['scrollbar'] == null && items['staticbar'] == null && items['simultan'] == null){firstdefaultvalues['scrollbar'] = true;firstdefaultvalues['staticbar'] = false;firstdefaultvalues['simultan'] = false;}
    if(items['favoritestock'] == null){firstdefaultvalues['favoritestock'] = false}
    if(items['toolbarwhite'] == null && items['toolbarblack'] == null){firstdefaultvalues['toolbarwhite'] = true;firstdefaultvalues['toolbarblack'] = false;}
    if(items['fromiexe'] == null){firstdefaultvalues['fromiexe'] = true;}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
//---
// rate
$("materialModalRate").addEventListener('click', function(e){
    closeMaterialRateAlert(e, false);
});
$("materialModalRateContent").addEventListener('click', function(e){
    e.stopPropagation();
});
$("materialModalRateButtonOK").addEventListener('click', function(e){
    closeMaterialRateAlert(e, true);
    window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});
});
$("materialModalRateButtonCANCEL").addEventListener('click', function(e){
    closeMaterialRateAlert(e, false);
});

// introduce
$("materialModalIntroduce").addEventListener('click', function(e){
    closeMaterialIntroduceAlert(e, false);
});
$("materialModalIntroduceContent").addEventListener('click', function(e){
    e.stopPropagation();
});
$("materialModalIntroduceButtonOK").addEventListener('click', function(e){
    closeMaterialIntroduceAlert(e, true);
});
$("materialModalIntroduceButtonCANCEL").addEventListener('click', function(e){
    closeMaterialIntroduceAlert(e, false);
});

// dialog
function materialAlert(callback){
    document.getElementById('materialModalButtonCANCEL').style.display = 'none';
    document.getElementById('materialModal').className = 'show';
    document.getElementById('materialModal').setAttribute('aria-disabled', "false");   
}
function closeMaterialAlert(e, result){
    e.stopPropagation();
    document.getElementById('materialModal').className = 'hide';
    document.getElementById('materialModal').setAttribute('aria-disabled', "true");   
}

// rate
function materialRateAlert(callback){
    document.getElementById('materialModalRate').className = 'show';
    document.getElementById('materialModalRate').setAttribute('aria-disabled', "false");   
}
function closeMaterialRateAlert(e, result){
    e.stopPropagation();
    document.getElementById('materialModalRate').className = 'hide';
    document.getElementById('materialModalRate').setAttribute('aria-disabled', "true");   
}

// introduce
function materialIntroduceAlert(callback){
    document.getElementById('materialModalIntroduceButtonCANCEL').style.display = 'none';
    document.getElementById('materialModalIntroduce').className = 'show';
    document.getElementById('materialModalIntroduce').setAttribute('aria-disabled', "false");   
}
function closeMaterialIntroduceAlert(e, result){
    e.stopPropagation();
    document.getElementById('materialModalIntroduce').className = 'hide';
    document.getElementById('materialModalIntroduce').setAttribute('aria-disabled', "true");  
}
//---

chrome.storage.sync.get(['firstDate','optionskipremember','countremember','marqueebehaviour','direction','scrollamount','japan','xminutes','favoritestock','favo1','favo2','favo3','favo4','getinfovaluestock','getinfovaluepercent','getinfovaluemc','getfontfamily','getfontsize','excludedstock','lightcolor','redcolor','greencolor','textcolor','dropshadow','toolbarDomains','allsites','toolbaronly','introduce','excludedstockdouble','doublebar','getpositiontop','getpositionbottom','scrollbar','staticbar','favo1b','favo2b','favo3b','favo4b','fillchange','toolbarwhite','toolbarblack','worldmapcolor','worldmapopacity','hideworldmap','getfullvaluedata','fullname','fullnamearea','searchbehaviour','bellmarket','opentime','closetime','simultan','firstsawrate','fromiexe'], function(items){
		if(items['marqueebehaviour']){$('marqueebehaviour').value = items['marqueebehaviour'];}
		else {$('marqueebehaviour').value = "scroll";}
		if(items['direction']){$('direction').value = items['direction'];}
		else {$('direction').value = "left";}
		if(items['scrollamount']){$('scrollamount').value = items['scrollamount'];}
		else {$('scrollamount').value = '35';}
		if(items['japan'] == true){$('japan').checked = true;}
		if(items['xminutes']){$('xminutes').value = items['xminutes'];}
		else {$('xminutes').value = '60';}
		if(items['favoritestock'] == true){$('favoritestock').checked = true;}
		if(items['favo1']){$('favo1').value = items['favo1'];}
		else {$('favo1').value = 'EUR';}
		if(items['favo2']){$('favo2').value = items['favo2'];}
		else {$('favo2').value = 'JPY';}
		if(items['favo3']){$('favo3').value = items['favo3'];}
		else {$('favo3').value = 'GBP';}
		if(items['favo4']){$('favo4').value = items['favo4'];}
        else {$('favo4').value = 'BTC';}
		if(items['favo1b']){$('favo1b').value = items['favo1b'];}
		else {$('favo1b').value = 'USD';}
		if(items['favo2b']){$('favo2b').value = items['favo2b'];}
		else {$('favo2b').value = 'USD';}
		if(items['favo3b']){$('favo3b').value = items['favo3b'];}
		else {$('favo3b').value = 'USD';}
		if(items['favo4b']){$('favo4b').value = items['favo4b'];}
        else {$('favo4b').value = 'USD';}
		if(items['getinfovaluestock'] == true)$('getinfovaluestock').checked = true;
		if(items['getinfovaluepercent'] == true)$('getinfovaluepercent').checked = true;
		if(items['getinfovaluemc'] == true)$('getinfovaluemc').checked = true;
		if(items['getfontfamily']){$('getfontfamily').value = items['getfontfamily'];}
		else {$('getfontfamily').value = 'jd_lcd_roundedregular';}
		if(items['getfontsize']){$('getfontsize').value = items['getfontsize'];}
		else {$('getfontsize').value = '27';}
		if(items['lightcolor']){$('lightcolor').value = items['lightcolor'];$('examplebar').style.background = items['lightcolor'];}
		else {$('lightcolor').value = '#000000';$('examplebar').style.background = '#000000';}
        if(items['optionskipremember'] == true)$('optionskipremember').checked = true;
		if(items['redcolor']){$('redcolor').value = items['redcolor'];}
		else {$('redcolor').value = '#f00000';}
		if(items['greencolor']){$('greencolor').value = items['greencolor'];}
		else {$('greencolor').value = '#008000';}
		if(items['textcolor']){$('textcolor').value = items['textcolor'];}
		else {$('textcolor').value = '#ffffff';}
		if(items['dropshadow'] == true)$('dropshadow').checked = true;
		if(items['allsites'] == true)$('allsites').checked = true;
        if(items['toolbaronly'] == true)$('toolbaronly').checked = true;
        if(items['doublebar'] == true)$('doublebar').checked = true;
        if(items['getpositiontop'] == true)$('getpositiontop').checked = true;
        if(items['getpositionbottom'] == true)$('getpositionbottom').checked = true;
        if(items['scrollbar'] == true)$('scrollbar').checked = true;
        if(items['staticbar'] == true)$('staticbar').checked = true;
        if(items['fillchange'] == true)$('fillchange').checked = true;
        if(items['toolbarwhite'] == true)$('toolbarwhite').checked = true;
        if(items['toolbarblack'] == true)$('toolbarblack').checked = true;
        if(items['worldmapcolor']){$('worldmapcolor').value = items['worldmapcolor'];}
		else {$('worldmapcolor').value = '#ffffff';}
        if(items['worldmapopacity']){$('worldmapopacity').value = items['worldmapopacity'];}
		else {$('worldmapopacity').value = '40';}
        if(items['hideworldmap'] == true)$('hideworldmap').checked = true;
        if(items['getfullvaluedata'] == true)$('getfullvaluedata').checked = true;
        if(items['fullname'] == true)$('fullname').checked = true;
		if(items['fullnamearea']){$('fullnamearea').value = items['fullnamearea'];}
        else {$('fullnamearea').value = 'DIA=SPDR Dow Jones Industrial Average (DIA)';}
        if(items['searchbehaviour']){$('searchbehaviour').value = items['searchbehaviour'];}
        else {$('searchbehaviour').value = "Google";}
        if(items['bellmarket'] == true)$('bellmarket').checked = true;
		if(items['opentime']){$('opentime').value = items['opentime'];}
        else {$('opentime').value = '09:30';}
        if(items['closetime']){$('closetime').value = items['closetime'];}
        else {$('closetime').value = '16:00';}
        if(items['simultan'] == true)$('simultan').checked = true;
        if(items['fromiexe'] == true)$('fromiexe').checked = true;

// show introduce
if(items['introduce'] != true){
    window.setTimeout(function () {
        materialIntroduceAlert(function (result) { console.log(result) });
    }, 2500);
    chrome.storage.sync.set({"introduce": true});
}

// show remember page
var firstmonth = false;
var currentDate = new Date().getTime();
if(items['firstDate']){
    var datestart = items['firstDate'];
    var dateend = datestart + (30 * 24 * 60 * 60 * 1000);
    if(currentDate>=dateend){firstmonth = false;}
    else{firstmonth = true;}
}else{
    chrome.storage.sync.set({"firstDate": currentDate});
    firstmonth = true;
}

if(firstmonth){
// show nothing
$("sectionreviewbox").style.display = "none";
}else{
    if($('optionskipremember').checked != true){
        $("sectionreviewbox").style.display = "block"; // show now always the banner
            if(items['firstsawrate'] != true){
                window.setTimeout(function () {
                    materialRateAlert(function(result){console.log(result)})
                }, 2500);
                chrome.storage.sync.set({"firstsawrate": true});
            }
        else{}
    }else{
        $("sectionreviewbox").style.display = "none";
    }
}		
		
	// load tab div
	var tabListItems = document.getElementById('navbar').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == 'LI' ) {
		var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
		var id = getHash( tabLink.getAttribute('data-tab') );
		tabLinks[id] = tabLink;
		contentDivs[id] = document.getElementById( id );
        }
    }
    
    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;
 
    for ( var id in tabLinks ) {
    	tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function() { this.blur() };
		if ( i == 0 ) tabLinks[id].className = 'navbar-item-selected';
		i++;
    }
    
    // Hide all content divs except the first
    var i = 0;
 
    for ( var id in contentDivs ) {
    	if ( i != 0 ) contentDivs[id].className = 'page hidden';
        i++;
    }

    // display version number
	var manifestData = chrome.runtime.getManifest();
	$("version_number").innerText = manifestData.version;
	
// Excluded stock
var excludedstock = items['excludedstock'];
if(typeof excludedstock == "undefined")
// default stocks
excludedstock = JSON.stringify({'AAPL': true,'DIA': true,'GOOG': true,'SPY': true,'GOLD': true,'TSLA': true,'PBFX': true,'GE': true,'FB': true,'MSFT': true});
if(typeof excludedstock == "string") {
	excludedstock = JSON.parse(excludedstock);
	var buf = [];
	for(var domain in excludedstock)
		buf.push(domain);
	for(var i = 0; i < buf.length; i++)
		appendToListBox("excludedstockBox", buf[i]);
    }

var excludedstockdouble = items['excludedstockdouble'];
if(typeof excludedstockdouble == "undefined")
// default stocks
excludedstockdouble = JSON.stringify({});
if(typeof excludedstockdouble == "string") {
	excludedstockdouble = JSON.parse(excludedstockdouble);
	var buf = [];
	for(var domain in excludedstockdouble)
		buf.push(domain);
	for(var i = 0; i < buf.length; i++)
		appendToListBox("excludedstockBoxdouble", buf[i]);
    }

// toolbar - Excluded domains - sort these alphabetically
var toolbarDomains = items["toolbarDomains"];
if(typeof toolbarDomains == "undefined")
toolbarDomains = JSON.stringify({'https://www.google.com': true});

if(typeof toolbarDomains == "string") {
	toolbarDomains = JSON.parse(toolbarDomains);
	var abuf = [];
	for(var domain in toolbarDomains)
		abuf.push(domain);
        abuf.sort();
	for(var i = 0; i < abuf.length; i++)
		appendToListBox("toolbarDomainsBox", abuf[i]);
	}
	
	// retest the function
	test();

	});// chrome storage end
} // end read


// Add a filter string to the list box.
function appendToListBox(boxId, text) { var elt = document.createElement("option"); elt.text = text; elt.value = text; document.getElementById(boxId).add(elt, null); }

// tabel script
    var tabLinks = new Array();
    var contentDivs = new Array();
 
    function showTab() {
      var selectedId = getHash( this.getAttribute('data-tab') );
 
      // Highlight the selected tab, and dim all others.
      // Also show the selected content div, and hide all others.
      for ( var id in contentDivs ) {
        if ( id == selectedId ) {
          tabLinks[id].className = 'navbar-item-selected';
          contentDivs[id].className = 'page';
        } else {
          tabLinks[id].className = 'navbar-item';
          contentDivs[id].className = 'page hidden';
        }
      }
 
      // Stop the browser following the link
      return false;
    }
 
    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }
 
    function getHash( url ) {
      var hashPos = url.lastIndexOf ( '#' );
      return url.substring( hashPos + 1 );
    }

// Stocks list
function addWhitelistDomain() {
    var domain = document.getElementById("websiteurl").value.toUpperCase();
	if (domain.indexOf(',') > -1) {
		var match = domain.split(',')
		for (var a in match)
		{
            var variable = match[a];

            var options = document.getElementById("excludedstockBox");
            var optArray = [];
            for (var i = 0; i < options.length; i++) {
                optArray.push(options[i].text);
            }
            if(optArray.indexOf(variable) == -1){
                // not in the list, add me

                // check the other selection box
                var optionsdouble = document.getElementById("excludedstockBoxdouble");
                var optArraydouble = [];
                for (var i = 0; i < optionsdouble.length; i++) {
                    optArraydouble.push(optionsdouble[i].text);
                }
                if(optArraydouble.indexOf(variable) == -1){
                    // not in the list, add me
                    appendToListBox("excludedstockBox", variable);
                }
   
            }
		}	
	} else {

        var options = document.getElementById("excludedstockBox");
        var optArray = [];
        for (var i = 0; i < options.length; i++) {
            optArray.push(options[i].text);
        }
        if(optArray.indexOf(domain) == -1){
                // not in the list, add me

                // check the other selection box
                var optionsdouble = document.getElementById("excludedstockBoxdouble");
                var optArraydouble = [];
                for (var i = 0; i < optionsdouble.length; i++) {
                    optArraydouble.push(optionsdouble[i].text);
                }
                if(optArraydouble.indexOf(domain) == -1){
                    // not in the list, add me
                    appendToListBox("excludedstockBox", domain);
                }
            
        }

	}
    save_options();
}

function addWhitelistDomaindouble() {
    var domain = document.getElementById("websiteurldouble").value.toUpperCase();
	if (domain.indexOf(',') > -1) {
		var match = domain.split(',')
		for (var a in match)
		{
            var variable = match[a];
            
            var optionsdouble = document.getElementById("excludedstockBoxdouble");
            var optArraydouble = [];
            for (var i = 0; i < optionsdouble.length; i++) {
                optArraydouble.push(optionsdouble[i].text);
            }
            if(optArraydouble.indexOf(variable) == -1){
                // not in the list, add me

                // check the other selection box
                var options = document.getElementById("excludedstockBox");
                var optArray = [];
                for (var i = 0; i < options.length; i++) {
                    optArray.push(options[i].text);
                }
                if(optArray.indexOf(variable) == -1){
                    // not in the list, add me
                    appendToListBox("excludedstockBoxdouble", variable);
                }
   
            }

		}	
	} else {
        
        var optionsdouble = document.getElementById("excludedstockBoxdouble");
        var optArraydouble = [];
        for (var i = 0; i < optionsdouble.length; i++) {
            optArraydouble.push(optionsdouble[i].text);
        }
        if(optArraydouble.indexOf(domain) == -1){
                // not in the list, add me

                // check the other selection box
                var options = document.getElementById("excludedstockBox");
                var optArray = [];
                for (var i = 0; i < options.length; i++) {
                    optArray.push(options[i].text);
                }
                if(optArray.indexOf(domain) == -1){
                    // not in the list, add me
                    appendToListBox("excludedstockBoxdouble", domain);
                }
            
        }
        
	}
    save_options();
}

function removeSelectedExcludedDomain() {
    var excludedstockBox = document.getElementById("excludedstockBox");
    for (var i = excludedstockBox.length-1; i >= 0; i--) {
        if (excludedstockBox.options[i].selected)
            excludedstockBox.remove(i);
    }
    save_options();
}

function removeSelectedExcludedDomaindouble() {
    var excludedstockBox = document.getElementById("excludedstockBoxdouble");
    for (var i = excludedstockBox.length-1; i >= 0; i--) {
        if (excludedstockBox.options[i].selected)
            excludedstockBox.remove(i);
    }
    save_options();
}

function movestockdown() {
	var excludedstockBox = document.getElementById("excludedstockBox");
    var i = excludedstockBox.selectedIndex;
    try{
	var txt = excludedstockBox.options[i + 1].text
	var val = excludedstockBox.options[i + 1].value
	excludedstockBox.options[i + 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i + 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i + 1;
    save_options();
    }catch(e){}
}

function movestockdowndouble() {
	var excludedstockBox = document.getElementById("excludedstockBoxdouble");
    var i = excludedstockBox.selectedIndex;
    try{
	var txt = excludedstockBox.options[i + 1].text
	var val = excludedstockBox.options[i + 1].value
	excludedstockBox.options[i + 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i + 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i + 1;
    save_options();
    }catch(e){}
}

function movestockup() {
	var excludedstockBox = document.getElementById("excludedstockBox");
    var i = excludedstockBox.selectedIndex;
    try{
	var txt = excludedstockBox.options[i - 1].text
	var val = excludedstockBox.options[i - 1].value
	excludedstockBox.options[i - 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i - 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i - 1;	
    save_options();
    }catch(e){}
}

function movestockupdouble() {
	var excludedstockBox = document.getElementById("excludedstockBoxdouble");
    var i = excludedstockBox.selectedIndex;
    try{
	var txt = excludedstockBox.options[i - 1].text
	var val = excludedstockBox.options[i - 1].value
	excludedstockBox.options[i - 1].text = excludedstockBox.options[i].text;
	excludedstockBox.options[i - 1].value = excludedstockBox.options[i].value;
	excludedstockBox.options[i].text = txt;
	excludedstockBox.options[i].value = val;
	excludedstockBox.selectedIndex = i - 1;	
    save_options();
    }catch(e){}
}

// whitelist proper menu domain
function toolbaraddWhitelistDomain() {
    var domain = $("toolbarwebsiteurl").value;
    appendToListBox("toolbarDomainsBox", domain);
    save_options();
}

function toolbarremoveSelectedExcludedDomain() {
    var toolbarDomainsBox = $("toolbarDomainsBox");
    for (var i = toolbarDomainsBox.length-1; i >= 0; i--) {
        if (toolbarDomainsBox.options[i].selected)
		toolbarDomainsBox.remove(i);
    }
    save_options();
}

function test(){
if(document.getElementById("doublebar").checked == true){
    document.getElementById("excludedstockBoxdouble").disabled = false;
    document.getElementById("removebuttondouble").disabled = false;
    document.getElementById("moveupbuttondouble").disabled = false;
    document.getElementById("movedownbuttondouble").disabled = false;
    document.getElementById("websiteurldouble").disabled = false;
    document.getElementById("addbuttondouble").disabled = false;
}else{
    document.getElementById("excludedstockBoxdouble").disabled = true;
    document.getElementById("removebuttondouble").disabled = true;
    document.getElementById("moveupbuttondouble").disabled = true;
    document.getElementById("movedownbuttondouble").disabled = true;
    document.getElementById("websiteurldouble").disabled = true;
    document.getElementById("addbuttondouble").disabled = true;
}

if(document.getElementById("toolbaronly").checked == true){
    document.getElementById("toolbarwebsiteurl").disabled = false;
    document.getElementById("toolbaraddbutton").disabled = false;
    document.getElementById("toolbarremovebutton").disabled = false;
    document.getElementById("toolbarDomainsBox").disabled = false;
    document.getElementById("toolbarwhite").disabled = false;
    document.getElementById("toolbarblack").disabled = false;
}else{
    document.getElementById("toolbarwebsiteurl").disabled = true;
    document.getElementById("toolbaraddbutton").disabled = true;
    document.getElementById("toolbarremovebutton").disabled = true;
    document.getElementById("toolbarDomainsBox").disabled = true;
    document.getElementById("toolbarwhite").disabled = true;
    document.getElementById("toolbarblack").disabled = true;
}

if(document.getElementById("favoritestock").checked == true){
document.getElementById("favorite").style.display = "";
document.getElementById("stefanvdfinancemarquee").style.marginLeft = "332px";
document.getElementById("arrowleft").style.marginLeft = "315px";
} else {
document.getElementById("favorite").style.display = "none";
document.getElementById("stefanvdfinancemarquee").style.marginLeft = "100px";
document.getElementById("arrowleft").style.marginLeft = "83px";
}
document.getElementById("stefanvdfinancemarquee").style.marginRight = "25px";

$('examplebar').style.background = $('lightcolor').value;

var etempl = $("direction");var currentdirection = etempl.options[etempl.selectedIndex].value;
var posbegin = "+100%";
var posend = "-100%";
if(currentdirection == "left"){
posbegin = "+100%";
posend = "-100%";
}else{
posbegin = "-100%";
posend = "+100%";
}
var timecredit = $("scrollamount").value;

var em = $("marqueebehaviour");var currentbehaviour = em.options[em.selectedIndex].value;
var beginbeh = "normal";
if(currentbehaviour == "scroll"){beginbeh = "normal"}
else{beginbeh = "alternate"}

var fncss = '#examplebar #stefanvdfinancemarquee .moveeffect{animation:marquee '+timecredit+'s linear infinite '+beginbeh+'} #stefanvdfinancemarquee div a{color: '+$('textcolor').value+'!important} #stefanvdfinancemarquee .green a{color:'+$('greencolor').value+'!important} #stefanvdfinancemarquee .red a{color:'+$('redcolor').value+'!important}@keyframes marquee{0%{transform:translateX('+posbegin+')}100%{transform:translateX('+posend+')}}';
if($("fnstyle")){
$("fnstyle").innerText = fncss;
}else{
var style = document.createElement('style');
style.type = 'text/css';
style.setAttribute('id','fnstyle');
style.innerText = fncss;
document.body.appendChild(style);
}
}

// Current year
function yearnow(){
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

function checkdarkmode(){
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false

        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            document.body.className = 'light';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
        }
    });
}

/* Option page body action */
// Read current value settings
window.addEventListener('load', function(){
    // remove loading screen
    $('loading').style.display = "none";
});

if(window.location.href != exoptionspage){
    document.addEventListener('DOMContentLoaded', domcontentloaded);
}else{
    domcontentloaded();
}

function domcontentloaded(){
checkdarkmode();

if(window.location.href != exoptionspage){

    var condition = navigator.onLine ? "online" : "offline";
    if(condition == "online"){
        fetch(developerwebsite).then(function(response) {
            if(response.status === 200){
                // website is online
                // redirect to there
                window.location.href = exoptionspage;
            }
            else{
                throw new Error(response.statusText);
            }

        }).catch(e=>{
        //is not there
        // use offline page
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YpNSpneMPXqqghriKws079";
        read_options();
        yearnow();
        });
    }else{
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YpNSpneMPXqqghriKws079";
        read_options();
        yearnow();
    }

} else {
    // Add the YouTube player
    $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YpNSpneMPXqqghriKws079";
    read_options();
    yearnow();
}

var sharetext = chrome.i18n.getMessage("sharetextd");
var stefanvdurl = financetoolbarproduct;
var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
if($("shareboxyoutube")){
    $("shareboxyoutube").addEventListener("click", function() {window.open(linkyoutube,"_blank");});
}
if($("shareboxfacebook")){
    $("shareboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
}
if($("shareboxtwitter")){
    $("shareboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});
}

var isMenuClick = false;
var menu = document.getElementById('dotmenu');
document.addEventListener('click',()=>{
    if(!isMenuClick){
       //Hide the menu here
       $('dropmenu').className = "hide";
    }
    //Reset isMenuClick 
    isMenuClick = false;
})
menu.addEventListener('click',()=>{
    isMenuClick = true;
})

$("dotmenu").addEventListener('click', function() {
    if($('dropmenu').className == "show"){
        $('dropmenu').className = "hide";
    }else{
        $('dropmenu').className = "show";
    }
});

$("darkpanel").addEventListener('click', function() {
    $('menuToggle').click();
});

$("titleex").addEventListener('click', function() {
    window.open(developerwebsite);
});

$("btnsupport").addEventListener('click', function() {
    window.open(linksupport);$('dropmenu').className = "hide";
});

$("btnactivedarkmode").addEventListener('click', function() {
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false
        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            $('dropmenu').className = "hide";
            document.body.className = 'light';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
            chrome.storage.sync.set({"darkmode":false});
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            $('dropmenu').className = "hide";
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
            chrome.storage.sync.set({"darkmode":true});
        }
    });
});

// promotion
$("promotext").innerText = chrome.i18n.getMessage("donatetext");
$("spnpromoaction").innerText = chrome.i18n.getMessage("donatecalltoaction");
$("btnpromoaction").addEventListener('click', function() {window.open(donatewebsite)});

// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}
var select = document.querySelectorAll('select');
for (var i = 0; i < select.length; i++) {select[i].addEventListener('change', test);select[i].addEventListener('change', save_options);}
// save text area
$("fullnamearea").addEventListener('input', save_options);

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

// left
var goleft = document.getElementById("arrowleft")
goleft.addEventListener("mousedown", function() {
});

goleft.addEventListener("mouseup", function() {
});

// right
var goright = document.getElementById("arrowright")
goright.addEventListener("mousedown", function() {
});

goright.addEventListener("mouseup", function() {
});

// Add stock
$("addbutton").addEventListener('click', function() {addWhitelistDomain();});
$("addbuttondouble").addEventListener('click', function() {addWhitelistDomaindouble();});

// Remove stock
$("removebutton").addEventListener('click', function() {removeSelectedExcludedDomain();});
$("removebuttondouble").addEventListener('click', function() {removeSelectedExcludedDomaindouble();});

// Move up
$("moveupbutton").addEventListener('click', function() {movestockup();});
$("moveupbuttondouble").addEventListener('click', function() {movestockupdouble();});

// Move down
$("movedownbutton").addEventListener('click', function() {movestockdown();});
$("movedownbuttondouble").addEventListener('click', function() {movestockdowndouble();});

// toolbar Add website
$('formtoolbar').addEventListener("submit", function(e){e.preventDefault();toolbaraddWhitelistDomain();});

// toolbar Remove website
$("toolbarremovebutton").addEventListener('click', function() {toolbarremoveSelectedExcludedDomain();});

var guidekb = true;
function memguide(){
    if(guidekb == true){
        // already visible
    }else{
        $("managed-prefs-banner").style.display = "";
    }
}

function mobilecheck(){
    if(window.innerWidth < 480){$('menuToggle').click();}
}

// Save KB download
$("tabbasic").addEventListener('click', function() {Scrolltotop();$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YpNSpneMPXqqghriKws079";$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});
$("tabdesign").addEventListener('click', function() {Scrolltotop();$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});
$("tabadvan").addEventListener('click', function() {Scrolltotop();$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});
$("tabguide").addEventListener('click', function() {Scrolltotop();$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";guidekb = false;mobilecheck();});
$("tabhelp").addEventListener('click', function() {Scrolltotop();$('dont-turn-off-the-lights').src = "";$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";memguide();guidekb = true;mobilecheck();});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport);});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog);});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate);});

// scroll to top
function Scrolltotop(){$("mainview").scrollTop = 0;}

// Reset settings
$("resetfinancetoolbar").addEventListener('click', function() {chrome.storage.sync.clear();
    chrome.runtime.sendMessage({name: "refreshbackground"}, function(response) {location.reload();});
});

// Review box
$("war").addEventListener('click', function() {window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});

// Finance Toolbar app box
$("apgetapp").addEventListener('click', function() {window.open(financetoolbarapp);$("sectionfinancetoolbarappbox").style.display = "none";chrome.storage.sync.set({"applastonversion": chrome.runtime.getManifest().version});});
$("apnt").addEventListener('click', function() {$("sectionfinancetoolbarappbox").style.display = "none";chrome.storage.sync.set({"applastonversion": chrome.runtime.getManifest().version});});

};