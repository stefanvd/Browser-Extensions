//================================================
/*

Proper Menubar
Add the best menu bar to get easy and fast access to all your useful browser options and internet products!
Copyright (C) 2019 Stefan vd
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

function hex2rgb(hex) {
    if (hex[0]=="#") hex=hex.substr(1);
    if (hex.length==3) {
      var temp=hex; hex='';
      temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
      for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
    }
    var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
    return {
      red:   parseInt(triplets[0],16),
      green: parseInt(triplets[1],16),
      blue:  parseInt(triplets[2],16)
    }
}

window.addEventListener('load', function() {
	chrome.runtime.sendMessage({name: 'stefanproper'});
}, true);

var height;

var skipPositionedChild = function( node, style ) {
    if ( this.offsetParent &&
         this.offsetParent.tagName !== 'BODY') return true;
    if ( hasPositionedParent(node) ) return true;
    return false;
};

var hasPositionedParent = function( node ){
    if ( node.tagName === 'BODY') return false;
    var parent = node.parentNode;
    var position = getComputedStyle(parent).position;
    if (position !== 'static') {
      return true;
    }
    return hasPositionedParent( parent );
};

function removetoolbar(){
	var checkb = $('stefanvdpropermenubar');
	if(checkb){
		document.documentElement.removeChild(checkb);

			var a = document.querySelectorAll('[data-propermenubar]');

			var a = document.body.getElementsByTagName("*");
			for (var i = 0, len = a.length; i < len; i++) {
					if(a[i].hasAttribute("data-spmtop")){
						a[i].style.marginTop = a[i].getAttribute("data-spmtop");
					}
					if(a[i].hasAttribute("data-spmbottom")){
						a[i].style.bottom = a[i].getAttribute("data-spmbottom");
					}
					if(a[i].hasAttribute("data-spmheight")){
						a[i].style.height = a[i].getAttribute("data-spmheight");
					}
					a[i].setAttribute("data-propermenubar",false);
			}

	}

	var checkc = $('stefanvdproperblocksmall');
	if(checkc){
		document.body.removeChild(checkc);
	}
}

var taskchangepositiontop = false;
function addtoolbar(){
    var checka = $('stefanvdpropermenubar');
    if(checka){}else{
        height = '30px';
        
        var Children = document.body.getElementsByTagName("*");
        for (var i = 0, len = Children.length; i < len; i++) {

            if(Children[i].currentStyle){
                var x = Children[i].currentStyle["position"];
                var w = Children[i].currentStyle["margin-top"];
                var v = Children[i].currentStyle["margin-bottom"];
                var y = Children[i].currentStyle["top"];
                var z = Children[i].currentStyle["bottom"];
                var q = Children[i].currentStyle["height"];
            }
            else if(window.getComputedStyle){
                var st = document.defaultView.getComputedStyle(Children[i], null);
                var x = st.getPropertyValue("position");
                var w = st.getPropertyValue("margin-top");
                var v = st.getPropertyValue("margin-bottom");
                var y = st.getPropertyValue("top");
                var z = st.getPropertyValue("bottom");
                var q = st.getPropertyValue("height");
            }

            if(getpositiontop == true){
                if((x == "absolute" || x == "fixed") && y !== 'auto'){
                    taskchangepositiontop = false;
                    if (x === 'absolute' && skipPositionedChild(Children[i]) ) {
                        taskchangepositiontop = false;
                    }else{
                        if(x === 'fixed'){
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
                        Children[i].setAttribute("data-propermenubar",true);
                        if(w != ""){
                            Children[i].setAttribute("data-spmtop",w);
                            Children[i].style.marginTop = parseInt(w, 10) + parseInt(height, 10) + "px";
                        }else if(v != ""){
                            Children[i].setAttribute("data-spmbottom",w);
                            Children[i].style.marginBottom = parseInt(w, 10) + parseInt(height, 10) + "px";
                        }

                        // if "top" and "bottom" is 0 => then calc height
                        if((q != "0px") && (y=="0px" && z=="0px")){
                            Children[i].setAttribute("data-spmheight",q);
                            Children[i].style.height = "calc( " + q + " - " + height + ")";
                        }
                    }
                }
            }else{
                if((x == "absolute" || x == "fixed") && z !== 'auto'){
                    if (x === 'absolute' && skipPositionedChild(Children[i]) ) {}else{
                        Children[i].setAttribute("data-propermenubar",true);
                        Children[i].setAttribute("data-spmbottom",w);
                        Children[i].style.marginBottom = parseInt(z, 10) + parseInt(height, 10) + "px";
                        // if "top" and "bottom" is 0 => then calc height
                        if((q != "0px") && (y=="0px" && z=="0px")){
                            Children[i].setAttribute("data-spmheight",q);
                            Children[i].style.height = "calc( " + q + " - " + height + ")";
                        }
                    }
                }
            }

        }

        if(getpositiontop == true){
            var divblock = document.createElement("div");
            divblock.setAttribute('id', "stefanvdproperblocksmall");
            document.body.insertBefore(divblock, document.body.firstChild);
        }

        var frame = document.createElement("div");
        frame.setAttribute('id', "stefanvdpropermenubar");
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
        frame.style.width  = '100%';
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
        let el = document.querySelector("#stefanvdpropermenubar");
        el.attachShadow({mode: "open"});
        // Just like prototype & constructor bi-directional references, we have...
        //el.shadowRoot // the shadow root.
        //el.shadowRoot.host // the element itself.

        var link  = document.createElement('link');
        link.id   = "csspalette";
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href =  chrome.runtime.getURL("css/body.css");
        link.media = 'all';
        el.shadowRoot.appendChild(link);

        function SD(id) { return el.shadowRoot.getElementById(id); }
        //----

		// inject CSS for the hover effect
		try{
            var pmcssbar = "#stefanvdnavwrappe #stefanvdpropermenubarnav li:hover a,#stefanvdnavwrappe #stefanvdpropermenubarnav a:focus,#stefanvdnavwrappe #stefanvdpropermenubarnav a:active{padding:0 7px;line-height:30px!important;color:"+hovertextcolor+"!important;background:"+hoverbackground+"!important;text-decoration:none;height:30px;font-weight:normal}#stefanvdnavwrappe #stefanvdpropermenubarclose:hover{color:"+hovertextcolor+"!important}#stefanvdnavwrappe #stefanvdpropermenubarnav label a:hover{color:"+hovertextcolor+"!important;background:"+hoverbackground+"!important;}";
    
            if($("csspropermenubar")){
            var elem = el.shadowRoot.getElementById("csspropermenubar");
            elem.parentElement.removeChild(elem);
            }
            
            var css = document.createElement('style');
            css.setAttribute('id','csspropermenubar');
            css.type = 'text/css';
            css.appendChild(document.createTextNode(pmcssbar));
            el.shadowRoot.appendChild(css);
        }
        catch(e) {}

            //---
            var newtoolbar = document.createElement('div');
            newtoolbar.setAttribute('id','stefanvdnavwrappe');
            newtoolbar.style.zIndex='2147483647';
            newtoolbar.style.width='100%';
            //newtoolbar.style.height='30px';
            newtoolbar.style.border='0';
            if(backgroundcolor == true){
                var rgb = hex2rgb(backgroundhex);
                newtoolbar.style.background='rgba('+rgb.red+','+ rgb.green+','+rgb.blue+','+(opacity/100)+')';
            }
            if (backgroundimage == true){
                if(backgroundimagesource == ""){newtoolbar.style.background='url('+chrome.extension.getURL('/images/slice1.png')+')';}
                else{newtoolbar.style.background='url('+backgroundimagesource+')';}
            }
            if(dropshadow == true){
                newtoolbar.style.boxShadow = "0px 2px 10px rgba(0,0,0,.2)";
            }
            el.shadowRoot.appendChild(newtoolbar);
    
            var newtoolbarclose = document.createElement('div');
            newtoolbarclose.setAttribute('id','stefanvdpropermenubarclose');
            newtoolbarclose.innerText = "X";
            newtoolbarclose.style.color = fontcolor;
            newtoolbarclose.addEventListener("click", function(){
                chrome.runtime.sendMessage({name: 'stefanremovebar'});
            },false);
            newtoolbar.appendChild(newtoolbarclose);


            var newtoolbardiv = document.createElement('div');
            newtoolbardiv.setAttribute('id','stefanvdpropermenubarnav');
            newtoolbar.appendChild(newtoolbardiv);

            var newtoolbarul = document.createElement('ul');
            newtoolbardiv.appendChild(newtoolbarul);
    
            if(googleproducts == true){
            var numberitems = 0;
            function createlink(a, b, c){
                // only the first 13 in the bar, rest dropdown menu
                if(numberitems < display){
                    var newtoolbarulli = document.createElement('li');
                    newtoolbarul.appendChild(newtoolbarulli);
    
                    var newtoolbarullia = document.createElement('a');
                    if(search == true){}else{
                    if(existingtab == true){ newtoolbarullia.setAttribute('target','_self'); }
                    else{ newtoolbarullia.setAttribute('target','_blank'); }
                    }
    
                    newtoolbarullia.setAttribute('id',c);
                    newtoolbarullia.style.color = fontcolor;
                    newtoolbarullia.innerHTML = a;
                    if(search == true){}else{
                    newtoolbarullia.setAttribute('href', b);
                    }
                    newtoolbarulli.appendChild(newtoolbarullia);
                }else{
                        var newdropdowncontent = SD("stefanvdpropermenubardropdown");
                        if(newdropdowncontent){}else{
                        var newdropdown = document.createElement('li');
                        newdropdown.setAttribute('id','stefanvdpropermenubardropdown');
                        newtoolbarul.appendChild(newdropdown);
    
                        var newdropdowna = document.createElement('a');
                        newdropdowna.setAttribute('id','stefanvdpropermenubarmore');
                        newdropdowna.style.color = fontcolor;
                        newdropdowna.innerHTML = chrome.i18n.getMessage("linkmore");
                        newdropdowna.setAttribute('href', '#');
                        newdropdown.appendChild(newdropdowna);
    
                        var rgb = hex2rgb(backgroundhex);
                        var newdropdowncontent = document.createElement('div');
                        newdropdowncontent.setAttribute('id','stefanvdpropermenubardropdowncontent');
                        newdropdowncontent.style.background='rgba('+rgb.red+','+ rgb.green+','+rgb.blue+','+(opacity/100)+')';
                        if(getpositiontop == true){
                            newdropdowncontent.style.top = height;
                        }else{
                            newdropdowncontent.style.bottom = height;
                        }
                        newdropdown.style.background='rgba('+rgb.red+','+ rgb.green+','+rgb.blue+','+(opacity/100)+')';
                        newdropdown.appendChild(newdropdowncontent);
                        }
                    // create the link
                    var newdropdowncontent = SD("stefanvdpropermenubardropdowncontent");
                    var newdropdowncontentli = document.createElement('li');
                    newdropdowncontent.appendChild(newdropdowncontentli);
    
                    var newdropdowncontentlia = document.createElement('a');
                    if(search == true){}else{
                    if(existingtab == true){ newdropdowncontentlia.setAttribute('target','_self'); }
                    else{ newdropdowncontentlia.setAttribute('target','_blank'); }
                    }
                    newdropdowncontentlia.setAttribute('id',c);
                    newdropdowncontentlia.style.color = fontcolor;
                    newdropdowncontentlia.innerHTML = a;
                    newdropdowncontentlia.setAttribute('href', b);
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

                if(typeof googlebarDomains == "string") {
                    googlebarDomains = JSON.parse(googlebarDomains);
                    var pbuf = [];
                    for(var domain in googlebarDomains)
                    pbuf.push(domain);
                        for(var i = 0; i < pbuf.length; i++){
                            if("link1a" == pbuf[i]){createlink(i18nlink1a,productlink1,'link1s');}
                            if("link2a" == pbuf[i]){createlink(i18nlink2a,productlink2,'link2s');}
                            if("link3a" == pbuf[i]){createlink(i18nlink3a,productlink3,'link3s');}
                            if("link4a" == pbuf[i]){createlink(i18nlink4a,productlink4,'link4s');}
                            if("link5a" == pbuf[i]){createlink(i18nlink5a,productlink5,'link5s');}
                            if("link6a" == pbuf[i]){createlink(i18nlink6a,productlink6,'link6s');}
                            if("link7a" == pbuf[i]){createlink(i18nlink7a,productlink7,'link7s');}
                            if("link8a" == pbuf[i]){createlink(i18nlink8a,productlink8,'link8s');}
                            if("link9a" == pbuf[i]){createlink(i18nlink9a,productlink9,'link9s');}
                            if("link10a" == pbuf[i]){createlink(i18nlink10a,productlink10,'link10s');}
                            if("link11a" == pbuf[i]){createlink(i18nlink11a,productlink11,'link11s');}
                            if("link12a" == pbuf[i]){createlink(i18nlink12a,productlink12,'link12s');}
                            if("link13a" == pbuf[i]){createlink(i18nlink13a,productlink13,'link13s');}
                            if("link14a" == pbuf[i]){createlink(i18nlink14a,productlink14,'link14s');}
                            if("link15a" == pbuf[i]){createlink(i18nlink15a,productlink15,'link15s');}
                            if("link16a" == pbuf[i]){createlink(i18nlink16a,productlink16,'link16s');}
                            if("link17a" == pbuf[i]){createlink(i18nlink17a,productlink17,'link17s');}
                            if("link18a" == pbuf[i]){createlink(i18nlink18a,productlink18,'link18s');}
                            if("link19a" == pbuf[i]){createlink(i18nlink19a,productlink19,'link19s');}
                            if("link20a" == pbuf[i]){createlink(i18nlink20a,productlink20,'link20s');}
                            if("link22a" == pbuf[i]){createlink(i18nlink22a,productlink22,'link22s');}
                            if("link23a" == pbuf[i]){createlink(i18nlink23a,productlink23,'link23s');}
                            if("link24a" == pbuf[i]){createlink(i18nlink24a,productlink24,'link24s');}
                            if("link25a" == pbuf[i]){createlink(i18nlink25a,productlink25,'link25s');}
                            if("link26a" == pbuf[i]){createlink(i18nlink26a,productlink26,'link26s');}
                            if("link27a" == pbuf[i]){createlink(i18nlink27a,productlink27,'link27s');}
                            if("link28a" == pbuf[i]){createlink(i18nlink28a,productlink28,'link28s');}
                            if("link29a" == pbuf[i]){createlink(i18nlink29a,productlink29,'link29s');}
                            if("link30a" == pbuf[i]){createlink(i18nlink30a,productlink30,'link30s');}
                            if("link31a" == pbuf[i]){createlink(i18nlink31a,productlink31,'link31s');}
                            if("link32a" == pbuf[i]){createlink(i18nlink32a,productlink32,'link32s');}
                            if("link33a" == pbuf[i]){createlink(i18nlink33a,productlink33,'link33s');}
                            if("link34a" == pbuf[i]){createlink(i18nlink34a,productlink34,'link34s');}
                            if("link35a" == pbuf[i]){createlink(i18nlink35a,productlink35,'link35s');}
                            if("link36a" == pbuf[i]){createlink(i18nlink36a,productlink36,'link36s');}
                            if("link37a" == pbuf[i]){createlink(i18nlink37a,productlink37,'link37s');}
                            if("link38a" == pbuf[i]){createlink(i18nlink38a,productlink38,'link38s');}
                            if("link39a" == pbuf[i]){createlink(i18nlink39a,productlink39,'link39s');}
                            if("link40a" == pbuf[i]){createlink(i18nlink40a,productlink40,'link40s');}
                            if("link41a" == pbuf[i]){createlink(i18nlink41a,productlink41,'link41s');}
                            if("link42a" == pbuf[i]){createlink(i18nlink42a,productlink42,'link42s');}
                            if("link43a" == pbuf[i]){createlink(i18nlink43a,productlink43,'link43s');}
                            if("link44a" == pbuf[i]){createlink(i18nlink44a,productlink44,'link44s');}
                            if("link45a" == pbuf[i]){createlink(i18nlink45a,productlink45,'link45s');}
                            if("link46a" == pbuf[i]){createlink(i18nlink46a,productlink46,'link46s');}
                            if("link47a" == pbuf[i]){createlink(i18nlink47a,productlink47,'link47s');}
                            if("link48a" == pbuf[i]){createlink(i18nlink48a,productlink48,'link48s');}
                            if("link49a" == pbuf[i]){createlink(i18nlink49a,productlink49,'link49s');}
                            if("link50a" == pbuf[i]){createlink(i18nlink50a,productlink50,'link50s');}
                            if("link51a" == pbuf[i]){createlink(i18nlink51a,productlink51,'link51s');}
                            if("link52a" == pbuf[i]){createlink(i18nlink52a,productlink52,'link52s');}
                            if("link53a" == pbuf[i]){createlink(i18nlink53a,productlink53,'link53s');}
                            if("link21a" == pbuf[i]){createlink(i18nlink21a,productlink21,'link21s');}
                        }
                }

                if(search == true){
                    // gmail app 
                    // http://mail.google.com/a/turnoffthelights.com
                    // calendar
                    // http://calendar.google.com/a/turnoffthelights.com
                    // drive
                    // http://drive.google.com/a/turnoffthelights.com

                    var pushnewtab = "_blank";
                    if(existingtab == true){ pushnewtab = "_self"; }
                    else{ pushnewtab = "_blank" }

                    if(SD("link1s")){SD("link1s").addEventListener('click', function (e) { propopenurl(productlinksearch1,pushnewtab); }, false);}
                    if(SD("link2s")){SD("link2s").addEventListener('click', function (e) { propopenurl(productlinksearch2,pushnewtab); }, false);}
                    if(SD("link3s")){SD("link3s").addEventListener('click', function (e) { propopenurl(productlinksearch3,pushnewtab); }, false);}
                    if(SD("link4s")){SD("link4s").addEventListener('click', function (e) { propopenurl(productlinksearch4,pushnewtab); }, false);}
                    if(SD("link5s")){SD("link5s").addEventListener('click', function (e) { propopenurl(productlinksearch5,pushnewtab); }, false);}
                    if(SD("link6s")){SD("link6s").addEventListener('click', function (e) { propopenurl(productlinksearch6,pushnewtab); }, false);}
                    if(SD("link7s")){SD("link7s").addEventListener('click', function (e) { propopenurl(productlinksearch7,pushnewtab); }, false);}
                    if(SD("link8s")){SD("link8s").addEventListener('click', function (e) { propopenurl(productlinksearch8,pushnewtab); }, false);}
                    if(SD("link9s")){SD("link9s").addEventListener('click', function (e) { propopenurl(productlinksearch9,pushnewtab); }, false);}
                    if(SD("link10s")){SD("link10s").addEventListener('click', function (e) { propopenurl(productlinksearch10,pushnewtab); }, false);}
                    if(SD("link11s")){SD("link11s").addEventListener('click', function (e) { propopenurl(productlinksearch11,pushnewtab); }, false);}
                    if(SD("link12s")){SD("link12s").addEventListener('click', function (e) { propopenurl(productlinksearch12,pushnewtab); }, false);}
                    if(SD("link13s")){SD("link13s").addEventListener('click', function (e) { propopenurl(productlinksearch13,pushnewtab); }, false);}
                    if(SD("link14s")){SD("link14s").addEventListener('click', function (e) { propopenurl(productlinksearch14,pushnewtab); }, false);}
                    if(SD("link15s")){SD("link15s").addEventListener('click', function (e) { propopenurl(productlinksearch15,pushnewtab); }, false);}
                    if(SD("link16s")){SD("link16s").addEventListener('click', function (e) { propopenurl(productlinksearch16,pushnewtab); }, false);}
                    if(SD("link17s")){SD("link17s").addEventListener('click', function (e) { propopenurl(productlinksearch17,pushnewtab); }, false);}
                    if(SD("link18s")){SD("link18s").addEventListener('click', function (e) { propopenurl(productlinksearch18,pushnewtab); }, false);}
                    if(SD("link19s")){SD("link19s").addEventListener('click', function (e) { propopenurl(productlinksearch19,pushnewtab); }, false);}
                    if(SD("link20s")){SD("link20s").addEventListener('click', function (e) { propopenurl(productlinksearch20,pushnewtab); }, false);}
                    if(SD("link22s")){SD("link22s").addEventListener('click', function (e) { propopenurl(productlinksearch22,pushnewtab); }, false);}
                    if(SD("link23s")){SD("link23s").addEventListener('click', function (e) { propopenurl(productlinksearch23,pushnewtab); }, false);}
                    if(SD("link24s")){SD("link24s").addEventListener('click', function (e) { propopenurl(productlinksearch24,pushnewtab); }, false);}
                    if(SD("link25s")){SD("link25s").addEventListener('click', function (e) { propopenurl(productlinksearch25,pushnewtab); }, false);}
                    if(SD("link26s")){SD("link26s").addEventListener('click', function (e) { propopenurl(productlinksearch26,pushnewtab); }, false);}
                    if(SD("link27s")){SD("link27s").addEventListener('click', function (e) { propopenurl(productlinksearch27,pushnewtab); }, false);}
                    if(SD("link28s")){SD("link28s").addEventListener('click', function (e) { propopenurl(productlinksearch28,pushnewtab); }, false);}
                    if(SD("link29s")){SD("link29s").addEventListener('click', function (e) { propopenurl(productlinksearch29,pushnewtab); }, false);}
                    if(SD("link30s")){SD("link30s").addEventListener('click', function (e) { propopenurl(productlinksearch30,pushnewtab); }, false);}
                    if(SD("link31s")){SD("link31s").addEventListener('click', function (e) { propopenurl(productlinksearch31,pushnewtab); }, false);}
                    if(SD("link32s")){SD("link32s").addEventListener('click', function (e) { propopenurl(productlinksearch32,pushnewtab); }, false);}
                    if(SD("link33s")){SD("link33s").addEventListener('click', function (e) { propopenurl(productlinksearch33,pushnewtab); }, false);}
                    if(SD("link34s")){SD("link34s").addEventListener('click', function (e) { propopenurl(productlinksearch34,pushnewtab); }, false);}
                    if(SD("link35s")){SD("link35s").addEventListener('click', function (e) { propopenurl(productlinksearch35,pushnewtab); }, false);}
                    if(SD("link36s")){SD("link36s").addEventListener('click', function (e) { propopenurl(productlinksearch36,pushnewtab); }, false);}
                    if(SD("link37s")){SD("link37s").addEventListener('click', function (e) { propopenurl(productlinksearch37,pushnewtab); }, false);}
                    if(SD("link38s")){SD("link38s").addEventListener('click', function (e) { propopenurl(productlinksearch38,pushnewtab); }, false);}
                    if(SD("link39s")){SD("link39s").addEventListener('click', function (e) { propopenurl(productlinksearch39,pushnewtab); }, false);}
                    if(SD("link40s")){SD("link40s").addEventListener('click', function (e) { propopenurl(productlinksearch40,pushnewtab); }, false);}
                    if(SD("link41s")){SD("link41s").addEventListener('click', function (e) { propopenurl(productlinksearch41,pushnewtab); }, false);}
                    if(SD("link42s")){SD("link42s").addEventListener('click', function (e) { propopenurl(productlinksearch42,pushnewtab); }, false);}
                    if(SD("link43s")){SD("link43s").addEventListener('click', function (e) { propopenurl(productlinksearch43,pushnewtab); }, false);}
                    if(SD("link44s")){SD("link44s").addEventListener('click', function (e) { propopenurl(productlinksearch44,pushnewtab); }, false);}
                    if(SD("link45s")){SD("link45s").addEventListener('click', function (e) { propopenurl(productlinksearch45,pushnewtab); }, false);}
                    if(SD("link46s")){SD("link46s").addEventListener('click', function (e) { propopenurl(productlinksearch46,pushnewtab); }, false);}
                    if(SD("link47s")){SD("link47s").addEventListener('click', function (e) { propopenurl(productlinksearch47,pushnewtab); }, false);}
                    if(SD("link48s")){SD("link48s").addEventListener('click', function (e) { propopenurl(productlinksearch48,pushnewtab); }, false);}
                    if(SD("link49s")){SD("link49s").addEventListener('click', function (e) { propopenurl(productlinksearch49,pushnewtab); }, false);}
                    if(SD("link50s")){SD("link50s").addEventListener('click', function (e) { propopenurl(productlinksearch50,pushnewtab); }, false);}
                    if(SD("link51s")){SD("link51s").addEventListener('click', function (e) { propopenurl(productlinksearch51,pushnewtab); }, false);}
                    if(SD("link52s")){SD("link52s").addEventListener('click', function (e) { propopenurl(productlinksearch52,pushnewtab); }, false);}
                    if(SD("link53s")){SD("link53s").addEventListener('click', function (e) { propopenurl(productlinksearch53,pushnewtab); }, false);}
                    if(SD("link21s")){SD("link21s").addEventListener('click', function (e) { propopenurl(productlinksearch21,pushnewtab); }, false);}
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
                    var hrelement = document.createElement('hr');
                    SD(a).getElementsByTagName('ul')[0].appendChild(hrelement);
                }

                document.addEventListener('click', function(event) {
                    if(event.target.id == "btnfile" || event.target.id == "btnedit" || event.target.id == "btnview" || event.target.id == "btnhistory" || event.target.id == "btnbookmarks" || event.target.id == "btnwindow" || event.target.id == "btnhelp" || event.target.id == "stefanvdpropermenubar"){}else{
                      SD("btnfile").checked = false;
                      SD("btnedit").checked = false;
                      SD("btnview").checked = false;
                      SD("btnhistory").checked = false;
                      SD("btnbookmarks").checked = false;
                      SD("btnwindow").checked = false;
                      SD("btnhelp").checked = false;
                    }
                });

                function createmenubar(a,b,c,d,e){
                    var newdropdowncontent = SD(e);
                        if(newdropdowncontent){}else{
                        var newdropdown = document.createElement('label');
                        newdropdown.setAttribute('for',e);
                        newtoolbarul.appendChild(newdropdown);

                        var newinputcheck = document.createElement('input');
                        newinputcheck.setAttribute('id',e);
                        newinputcheck.setAttribute('type',"checkbox");
                        newinputcheck.setAttribute('name',"ppcontrol");
                        newinputcheck.addEventListener("change", function(event){
                            if(event.target.id == e){
                                if(event.target.checked == true){
                                    var inputs, index;
                                    inputs = newtoolbarul.getElementsByTagName('input');
                                    for (index = 0; index < inputs.length; ++index) {
                                        if(inputs[index].id != event.target.id){
                                            inputs[index].checked = false;
                                        }
                                    }
                                }
                            }
                        },false);
                        newdropdown.appendChild(newinputcheck);

                        var newdropdowna = document.createElement('a');
                        newdropdowna.style.color = fontcolor;
                        newdropdowna.innerHTML = d;
                        newdropdown.appendChild(newdropdowna);
    
                        var rgb = hex2rgb(backgroundhex);
                        var newdropdowncontent = document.createElement('div');
                        newdropdowncontent.setAttribute('id',c);
                        newdropdowncontent.setAttribute('class',c);
                        if(getpositiontop == true){
                            newdropdowncontent.style.top = height;
                        }else{
                            newdropdowncontent.style.bottom = height;
                        }
                        newdropdowncontent.style.background='rgba('+rgb.red+','+ rgb.green+','+rgb.blue+','+(opacity/100)+')';
                        newdropdown.appendChild(newdropdowncontent);
                        }
                    // create the link
                    var newdropdowncontent = SD(c);
                    
                    if(newdropdowncontent.getElementsByTagName('ul')[0]){
                        var newdropdowncontentul = newdropdowncontent.getElementsByTagName('ul')[0];
                    }
                    else{
                        var newdropdowncontentul = document.createElement('ul');
                        newdropdowncontent.appendChild(newdropdowncontentul);
                    }

                    var newdropdowncontentli = document.createElement('li');
                    newdropdowncontentul.appendChild(newdropdowncontentli);
    
                    var newdropdowncontentlia = document.createElement('a');
                    newdropdowncontentlia.setAttribute('id',b);
                    newdropdowncontentlia.style.color = fontcolor;
                    newdropdowncontentlia.innerHTML = a;
                    newdropdowncontentli.appendChild(newdropdowncontentlia);
                }

                // File
                createmenubar(i18nmenu1a,"menu1s","panelfile",i18nmenufile,"btnfile");
                SD("menu1s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefancleannewtab'});
                },false);
                createmenubar(i18nmenu2a,"menu2s","panelfile",i18nmenufile,"btnfile");
                SD("menu2s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefancleannewwindow'});
                },false);
                createmenubar(i18nmenu3a,"menu3s","panelfile",i18nmenufile,"btnfile");
                SD("menu3s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefancleannewwindowincognito'});
                },false);
                createline("panelfile");
                createmenubar(i18nmenu4a,"menu4s","panelfile",i18nmenufile,"btnfile");
                SD("menu4s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefancleanclosewindow'});
                },false);
                createmenubar(i18nmenu5a,"menu5s","panelfile",i18nmenufile,"btnfile");
                SD("menu5s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefancleanclosetab'});
                },false);
                createmenubar(i18nmenu27a,"menu27s","panelfile",i18nmenufile,"btnfile");
                SD("menu27s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefansavemhtml'});
                },false);
                createline("panelfile");
                createmenubar(i18nmenu6a,"menu6s","panelfile",i18nmenufile,"btnfile");
                SD("menu6s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanprint'});
                },false);
                createline("panelfile");
                createmenubar(i18nmenu45a,"menu45s","panelfile",i18nmenufile,"btnfile");
                SD("menu45s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanexit'});
                },false);

                // Edit
                createmenubar(i18nmenu7a,"menu7s","paneledit",i18nmenuedit,"btnedit");
                SD("menu7s").addEventListener("click", function(){
                    document.execCommand('cut');
                },false);
                createmenubar(i18nmenu8a,"menu8s","paneledit",i18nmenuedit,"btnedit");
                SD("menu8s").addEventListener("click", function(){
                    document.execCommand('copy');
                },false);
                createmenubar(i18nmenu9a,"menu9s","paneledit",i18nmenuedit,"btnedit");
                SD("menu9s").addEventListener("click", function(){
                    document.execCommand('paste');
                },false);
                createline("paneledit");
                createmenubar(i18nmenu10a,"menu10s","paneledit",i18nmenuedit,"btnedit");
                SD("menu10s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefansettings'});
                },false);
                createline("paneledit");
                createmenubar(i18nmenu11a,"menu11s","paneledit",i18nmenuedit,"btnedit");
                SD("menu11s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanselectall'});
                },false);

                // View
                createmenubar(i18nmenu12a,"menu12s","panelview",i18nmenuview,"btnview");
                SD("menu12s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanstoppage'});
                },false);
                createmenubar(i18nmenu28a,"menu28s","panelview",i18nmenuview,"btnview");
                SD("menu28s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanreloadpage'});
                },false);
                createline("panelview");
                createmenubar(i18nmenu29a,"menu29s","panelview",i18nmenuview,"btnview");
                SD("menu29s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanfullscreenpage'});
                },false);
                createmenubar(i18nmenu30a,"menu30s","panelview",i18nmenuview,"btnview");
                SD("menu30s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanzoomactual'});
                },false);
                createmenubar(i18nmenu31a,"menu31s","panelview",i18nmenuview,"btnview");
                SD("menu31s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanzoomin'});
                },false);
                createmenubar(i18nmenu32a,"menu32s","panelview",i18nmenuview,"btnview");
                SD("menu32s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanzoomout'});
                },false);
                createmenubar(i18nmenu47a,"menu47s","panelview",i18nmenuview,"btnview");
                SD("menu47s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanviewsource'});
                },false);

                // History
                createmenubar(i18nmenu13a,"menu13s","panelhistory",i18nmenuhistory,"btnhistory");
                SD("menu13s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanhometab'});
                },false);
                createmenubar(i18nmenu19a,"menu19s","panelhistory",i18nmenuhistory,"btnhistory");
                SD("menu19s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanhistoryback'});
                },false);
                createmenubar(i18nmenu20a,"menu20s","panelhistory",i18nmenuhistory,"btnhistory");
                SD("menu20s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanhistoryforward'});
                },false);
                createline("panelhistory");
                createmenubar(i18nmenu26a,"menu26s","panelhistory",i18nmenuhistory,"btnhistory");
                SD("menu26s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanhistory'});
                },false);

                // Bookmarks
                createmenubar(i18nmenu14a,"menu14s","panelbookmarks",i18nmenubookmarks,"btnbookmarks");
                SD("menu14s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanbookmarkmanager'});
                },false);
                createmenubar(i18nmenu18a,"menu18s","panelbookmarks",i18nmenubookmarks,"btnbookmarks");
                SD("menu18s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanbookmarkadd'});
                },false);
                createmenubar(i18nmenu33a,"menu33s","panelbookmarks",i18nmenubookmarks,"btnbookmarks");
                SD("menu33s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanbookmarkaddall'});
                },false);

                // Windows
                createmenubar(i18nmenu43a,"menu43s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu43s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanminimise'});
                },false);
                createmenubar(i18nmenu44a,"menu44s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu44s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanzoom'});
                },false);
                createline("panelwindow");
                createmenubar(i18nmenu15a,"menu15s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu15s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanswitchtabright'});
                },false);
                createmenubar(i18nmenu34a,"menu34s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu34s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanswitchtableft'});
                },false);
                createmenubar(i18nmenu35a,"menu35s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu35s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanduplicatetab'});
                },false);
                createmenubar(i18nmenu36a,"menu36s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu36s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanpintab'}, function(response) {
                        if(response.pinit == true){
                            SD("menu36s").innerText = i18nmenu36a;
                        }else{
                            SD("menu36s").innerText = i18nmenu46a;
                        }
                        });
                },false);
                createline("panelwindow");
                createmenubar(i18nmenu37a,"menu37s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu37s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanmutetab'}, function(response) {
                    if(response.soundoff == true){
                        SD("menu37s").innerText = i18nmenu37a;
                    }else{
                        SD("menu37s").innerText = i18nmenu40a;
                    }
                    });
                },false);
                createmenubar(i18nmenu38a,"menu38s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu38s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanmuteothertab'});
                },false);
                createmenubar(i18nmenu39a,"menu39s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu39s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanmutealltabs'}, function(response) {
                    if(response.soundoff == true){
                        SD("menu39s").innerText = i18nmenu39a;
                    }else{
                        SD("menu39s").innerText = i18nmenu41a;
                    }
                    });
                },false);
                createline("panelwindow");
                createmenubar(i18nmenu21a,"menu21s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu21s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefandownloads'});
                },false);
                createmenubar(i18nmenu22a,"menu22s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu22s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanextensions'});
                },false);
                createmenubar(i18nmenu23a,"menu23s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu23s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanpolicy'});
                },false);
                createmenubar(i18nmenu24a,"menu24s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu24s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefaninspect'});
                },false);
                createmenubar(i18nmenu25a,"menu25s","panelwindow",i18nmenuwindow,"btnwindow");
                SD("menu25s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanflags'});
                },false);

                // Help
                createmenubar(i18nmenu16a,"menu16s","panelhelp",i18nmenuhelp,"btnhelp");
                SD("menu16s").addEventListener("click", function(){
                    window.open(linksupport,"_target");
                },false);
                createmenubar(i18nmenu17a,"menu17s","panelhelp",i18nmenuhelp,"btnhelp");
                SD("menu17s").addEventListener("click", function(){
                    chrome.runtime.sendMessage({name: 'stefanchromeabout'});
                },false);

            }
    }
}

// observeDOM - dynamic check
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true, attributes: true, characterData: true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

// Observe a specific DOM element:
if(document.body){
	// B New Mutation Summary API Reference
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if(MutationObserver){
	// setup MutationSummary observer
	var videolist = document.body;
	var observer = new MutationObserver(function (mutations, observer) {
            if(addbar == true){

            mutations.forEach(function (mutation) {
                // detect change style - this for floating box in div detection
                if(mutation.attributeName == 'style'){
                    if(getpositiontop == true){
                        if(mutation.target.getAttribute("data-propermenubar") == "true"){
                            if(mutation.target.getAttribute("data-spmtop") == mutation.target.style.marginTop){
                                mutation.target.style.marginTop = parseInt(mutation.target.getAttribute("data-spmtop"), 10) + parseInt(height, 10) + "px";
                            }
                        }else{
                            mutation.target.setAttribute("data-propermenubar",true);
                            mutation.target.setAttribute("data-spmtop",mutation.target.style.marginTop);
                            mutation.target.style.marginTop = parseInt(mutation.target.style.marginTop, 10) + parseInt(height, 10) + "px";
                        }
                    }
                }
            });
        
        }

	});

	observer.observe(videolist, {
		subtree: true,       // observe the subtree rooted at ...videolist...
		childList: false,     // include childNode insertion/removals
		characterData: false, // include textContent changes
		attributes: true     // include changes to attributes within the subtree
	});
    
    window.addEventListener("beforeunload",function() {observer.disconnect();});

	}
}

function propopenurl(a,b){
    getkeyword();
    openthat = a(country,keyword);
    chrome.runtime.sendMessage({name: 'stefanthaturl', url: openthat, tabaction: b});
}

function getkeyword(){
    try{
        var inputs = document.getElementsByTagName('input');
        for (index = 0; index < inputs.length; ++index) {
            // deal with inputs[index] element.
            if(inputs[index].getAttribute("name")=="q"){keyword = inputs[index].value;}
        }
    }catch(e){}
return keyword;
}

var addbar = null; var dropshadow = null; var allsites = null; var toolbaronly = null; var toolbarDomains = null; var getpositiontop = null; var getpositionbottom = null; var toolbarwhite = null; toolbarblack = null;
var opacity = null; var backgroundcolor = null; var backgroundhex = null; var backgroundimagesource = null; var backgroundimage = null; var country = null; var fontcolor = null;var googlesites = null; var search = null; var existingtab = null; var display = null; var hovertextcolor = null; var hoverbackground = null; var googleproducts = null; var menuproducts = null; var googlebarDomains = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendMessage) {
if (request.action == "goselectall"){
    var range = document.createRange();
    range.selectNode(document.body);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
} else if (request.action == "goprint"){
    window.print();
} else if (request.action == "gostop"){
    window.stop();
} else if (request.action == "goreload"){
    window.location.reload();
} else if (request.action == "gofullscreen"){
    document.documentElement.requestFullscreen();
} else if (request.action == "goback"){
    window.history.back();
} else if (request.action == "goforward"){
    window.history.forward();
} else if (request.action == "addremove"){
chrome.storage.sync.get(['country','addbar','dropshadow','toolbarDomains','allsites','toolbaronly','getpositiontop','getpositionbottom','toolbarwhite','toolbarblack','backgroundhex','backgroundimagesource','opacity','backgroundcolor','backgroundimage','allsites','fontcolor','googlesites','search','existingtab','display','hovertextcolor','hoverbackground','googleproducts','menuproducts','googlebarDomains'], function(items){
country = items.country;
if(country == null){
var userLang = navigator.language || navigator.userLanguage; 
if(userLang == "en-US"){country = "com"}
else if(userLang == "en-UK"){country = "co.uk"}
else if(userLang == "en-US"){country = "com"}
else if(userLang == "en-IE"){country = "ie"}
else if(userLang == "en-AU"){country = "au"}
else if(userLang == "en-CA"){country = "ca"}
else if(userLang == "ar-AR"){country = "ar"}
else if(userLang == "de-DE"){country = "de"}
else if(userLang == "ru-RU"){country = "ru"}
else if(userLang == "it-IT"){country = "it"}
else if(userLang == "es-ES"){country = "es"}
else if(userLang == "ja-JP"){country = "co.jp"}
else if(userLang == "pl-PL"){country = "pl"}
else if(userLang == "pt-PT"){country = "pt"}
else if(userLang == "nl-NL"){country = "nl"}
else if(userLang == "nl-BE"){country = "be"}
else if(userLang == "fi-FI"){country = "fi"}
else if(userLang == "fr-CA"){country = "ca"}
else if(userLang == "fr-BE"){country = "be"}
else if(userLang == "fr-FR"){country = "fr"}
else if(userLang == "uk-UK"){country = "uk"}
else if(userLang == "sv-SV"){country = "sv"}
else if(userLang == "th-TH"){country = "th"}
else if(userLang == "tr-TR"){country = "tr"}
else {country = "com";}
chrome.storage.sync.set({"country": country});
}
addbar = items['addbar'];if(addbar == null)addbar = true;
dropshadow = items['dropshadow'];if(dropshadow == null)dropshadow = true;
allsites = items['allsites'];if(allsites == null)allsites = true;
toolbaronly = items['toolbaronly'];if(toolbaronly == null)toolbaronly = false;
toolbarDomains = items['toolbarDomains'];
if(typeof toolbarDomains == "undefined")
toolbarDomains = JSON.stringify({'https://www.google.com': true, 'https://www.youtube.com': true});
getpositiontop = items['getpositiontop'];if(getpositiontop == null)getpositiontop = true;
getpositionbottom = items['getpositionbottom'];if(getpositionbottom == null)getpositionbottom = false;
toolbarwhite = items['toolbarwhite'];if(toolbarwhite == null)toolbarwhite = true;
toolbarblack = items['toolbarblack'];if(toolbarblack == null)toolbarblack = false;
googlebarDomains = items['googlebarDomains'];
if(typeof googlebarDomains == "undefined")
googlebarDomains = JSON.stringify({'link1a': true, 'link2a': true, 'link3a': true, 'link4a': true, 'link5a': true, 'link6a': true, 'link7a': true, 'link8a': true, 'link9a': true, 'link10a': true, 'link11a': true, 'link12a': true, 'link13a': true, 'link14a': true, 'link15a': true, 'link16a': true, 'link17a': true, 'link18a': true, 'link19a': true, 'link20a': true, 'link21a': true, 'link22a': true, 'link23a': true, 'link24a': true, 'link25a': true, 'link26a': true, 'link27a': true, 'link28a': true});

backgroundhex = items['backgroundhex'];if(backgroundhex == null)backgroundhex = '#2d2d2d';
backgroundimagesource = items['backgroundimagesource'];
opacity = items['opacity'];if(opacity == null)opacity = '100';
backgroundcolor = items['backgroundcolor'];if(backgroundcolor == null)backgroundcolor = true;
backgroundimage = items['backgroundimage'];if(backgroundimage == null)backgroundimage = false;
fontcolor = items['fontcolor'];if(fontcolor == null)fontcolor = '#cccccc';
googlesites = items['googlesites'];if(googlesites == null)googlesites = false;
search = items['search'];if(search == null)search = true;
existingtab = items['existingtab'];
display = items['display'];if(display == null)display = 13;
hovertextcolor = items['hovertextcolor'];if(hovertextcolor == null)hovertextcolor = '#ffffff';
hoverbackground = items['hoverbackground'];if(hoverbackground == null)hoverbackground = '#444444';
googleproducts = items['googleproducts'];if(googleproducts == null)googleproducts = false;
menuproducts = items['menuproducts'];if(menuproducts == null)menuproducts = true;

if(addbar == true){
	var urlinthelist = false;
	if(toolbaronly == true){
	var currenturl = window.location.protocol + '//' + window.location.host;
	var blackrabbit = false;
	if(typeof toolbarDomains == "string") {
		toolbarDomains = JSON.parse(toolbarDomains);
		var abuf = [];
		for(var domain in toolbarDomains)
			abuf.push(domain);
			abuf.sort();
			for(var i = 0; i < abuf.length; i++){
				if(toolbarwhite == true){
					if(currenturl == abuf[i]){
						// prevent opening in the popup window
						if (window.opener && window.opener !== window) {
							// you are in a popup
						} else {
							addtoolbar();
							urlinthelist = true;
						}
					}
				}
				else if(toolbarblack == true){
					if(currenturl == abuf[i]){blackrabbit=true;}
				}
			}
			if(urlinthelist == false){
				// if the length of the list is done, check if the toolbar visible and if still 'false', then remove this
				removetoolbar();
			}
		}
		if(toolbarblack == true){
			if(blackrabbit == false){
				// prevent opening in the popup window
				if (window.opener && window.opener !== window) {
					// you are in a popup
				} else {
					addtoolbar();
				}
				blackrabbit = false;
			}else{
				removetoolbar();
			}
		}
    }
    else if(googlesites == true){
        if(window.location.href.match("^http(|s)://([a-z.]*).google.[a-z.]*/")){
            // prevent opening in the popup window
            if (window.opener && window.opener !== window) {
                // you are in a popup
            } else {
                addtoolbar();
            }
        }
    }
    else{
		// prevent opening in the popup window
		if (window.opener && window.opener !== window) {
			// you are in a popup
		} else {
			addtoolbar();
		}
	}
}else{
	removetoolbar();
}
});

} else if (request.action == "toolbarrefresh") {
chrome.storage.sync.get(['country','addbar','dropshadow','toolbarDomains','allsites','toolbaronly','getpositiontop','getpositionbottom','toolbarwhite','toolbarblack','backgroundhex','backgroundimagesource','opacity','backgroundcolor','backgroundimage','allsites','fontcolor','googlesites','search','existingtab','display','hovertextcolor','hoverbackground','googleproducts','menuproducts','googlebarDomains'], function(items){
country = items.country;
if(country == null){
var userLang = navigator.language || navigator.userLanguage; 
if(userLang == "en-US"){country = "com"}
else if(userLang == "en-UK"){country = "co.uk"}
else if(userLang == "en-US"){country = "com"}
else if(userLang == "en-IE"){country = "ie"}
else if(userLang == "en-AU"){country = "au"}
else if(userLang == "en-CA"){country = "ca"}
else if(userLang == "ar-AR"){country = "ar"}
else if(userLang == "de-DE"){country = "de"}
else if(userLang == "ru-RU"){country = "ru"}
else if(userLang == "it-IT"){country = "it"}
else if(userLang == "es-ES"){country = "es"}
else if(userLang == "ja-JP"){country = "co.jp"}
else if(userLang == "pl-PL"){country = "pl"}
else if(userLang == "pt-PT"){country = "pt"}
else if(userLang == "nl-NL"){country = "nl"}
else if(userLang == "nl-BE"){country = "be"}
else if(userLang == "fi-FI"){country = "fi"}
else if(userLang == "fr-CA"){country = "ca"}
else if(userLang == "fr-BE"){country = "be"}
else if(userLang == "fr-FR"){country = "fr"}
else if(userLang == "uk-UK"){country = "uk"}
else if(userLang == "sv-SV"){country = "sv"}
else if(userLang == "th-TH"){country = "th"}
else if(userLang == "tr-TR"){country = "tr"}
else {country = "com";}
chrome.storage.sync.set({"country": country});
}
addbar = items['addbar'];if(addbar == null)addbar = true;
dropshadow = items['dropshadow'];if(dropshadow == null)dropshadow = true;
allsites = items['allsites'];if(allsites == null)allsites = true;
toolbaronly = items['toolbaronly'];if(toolbaronly == null)toolbaronly = false;
toolbarDomains = items['toolbarDomains'];
if(typeof toolbarDomains == "undefined")
toolbarDomains = JSON.stringify({'https://www.google.com': true, 'https://www.youtube.com': true});
getpositiontop = items['getpositiontop'];if(getpositiontop == null)getpositiontop = true;
getpositionbottom = items['getpositionbottom'];if(getpositionbottom == null)getpositionbottom = false;
toolbarwhite = items['toolbarwhite'];if(toolbarwhite == null)toolbarwhite = true;
toolbarblack = items['toolbarblack'];if(toolbarblack == null)toolbarblack = false;
googlebarDomains = items['googlebarDomains'];
if(typeof googlebarDomains == "undefined")
googlebarDomains = JSON.stringify({'link1a': true, 'link2a': true, 'link3a': true, 'link4a': true, 'link5a': true, 'link6a': true, 'link7a': true, 'link8a': true, 'link9a': true, 'link10a': true, 'link11a': true, 'link12a': true, 'link13a': true, 'link14a': true, 'link15a': true, 'link16a': true, 'link17a': true, 'link18a': true, 'link19a': true, 'link20a': true, 'link21a': true, 'link22a': true, 'link23a': true, 'link24a': true, 'link25a': true, 'link26a': true, 'link27a': true, 'link28a': true});

backgroundhex = items['backgroundhex'];if(backgroundhex == null)backgroundhex = '#2d2d2d';
backgroundimagesource = items['backgroundimagesource'];
opacity = items['opacity'];if(opacity == null)opacity = '100';
backgroundcolor = items['backgroundcolor'];if(backgroundcolor == null)backgroundcolor = true;
backgroundimage = items['backgroundimage'];if(backgroundimage == null)backgroundimage = false;
fontcolor = items['fontcolor'];if(fontcolor == null)fontcolor = '#cccccc';
googlesites = items['googlesites'];if(googlesites == null)googlesites = false;
search = items['search'];if(search == null)search = true;
existingtab = items['existingtab'];
display = items['display'];if(display == null)display = 13;
hovertextcolor = items['hovertextcolor'];if(hovertextcolor == null)hovertextcolor = '#ffffff';
hoverbackground = items['hoverbackground'];if(hoverbackground == null)hoverbackground = '#444444';
googleproducts = items['googleproducts'];if(googleproducts == null)googleproducts = false;
menuproducts = items['menuproducts'];if(menuproducts == null)menuproducts = true;
	removetoolbar();
	addtoolbar();
    //window.location.reload();
});
}

});