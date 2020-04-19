function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('proper-menubar-opera-install-button')) {
		$('proper-menubar-opera-install-button').style.display = 'none';
		$('proper-menubar-opera-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/proper-menubar/browser/options.html";
var ambientaureaproduct = "https://addons.opera.com/extensions/details/ambient-aurea/";
var datetodayproduct = "https://addons.opera.com/extensions/details/date-today/";
var turnoffthelightsproduct = "https://addons.opera.com/extensions/details/turn-off-the-lights/";
var financetoolbarproduct = "https://addons.opera.com/extensions/details/finance-toolbar/";
var propermenubarproduct = "https://addons.opera.com/extensions/details/proper-menubar/";
var fullscreenproduct = "https://addons.opera.com/extensions/details/full-screen/";
var zoomproduct = "https://addons.opera.com/extensions/details/zoom/";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://addons.opera.com/extensions/details/proper-menubar/";
var linkchangelog = "https://www.stefanvd.net/project/proper-menubar/browser/opera/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkguide = "https://www.stefanvd.net/project/proper-menubar/browser/opera/guide.htm";
var linkwelcomepage = "https://www.stefanvd.net/project/proper-menubar/browser/opera/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/project/proper-menubar/browser/opera/uninstall.htm";
var propermenubarwebsite = "https://www.stefanvd.net/project/proper-menubar/browser/";
var browsernewtab = "chrome://startpage/";
var browserextensions = "chrome://extensions/";
var browsersettings = "chrome://settings/";
var browserstore = "https://chrome.google.com";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";
var newtaburl = "chrome://newtab";
var newdownloads = "chrome://downloads";
var newextensions = "chrome://extensions";
var newpolicy = "chrome://policy";
var newinspect = "chrome://inspect";
var newflags = "chrome://flags";
var newabout = "chrome://about";
var newbookmarks = "chrome://bookmarks";
var newhistory =  "chrome://history";
var newsettings = "chrome://settings";

var country = null;
var keyword = "";
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
}

var productlink1 = "https://www.google."+country+"/account";
var productlink2 = "https://www.google."+country+"";
var productlink3 = "https://images.google."+country+"";
var productlink4 = "https://maps.google."+country+"";
var productlink5 = "https://play.google."+country+"";
var productlink6 = "https://www.youtube."+country+"";
var productlink7 = "https://news.google."+country+"";
var productlink8 = "https://mail.google."+country+"";
var productlink9 = "https://drive.google."+country+"";
var productlink10 = "https://calendar.google."+country+"";
var productlink11 = "https://translate.google."+country+"";
var productlink12 = "https://mobile.google."+country+"";
var productlink13 = "https://books.google."+country+"";
var productlink14 = "https://docs.google."+country+"";
var productlink15 = "https://pay.google."+country+"";
var productlink16 = "https://shopping.google."+country+"";
var productlink17 = "https://www.blogger."+country+"";
var productlink18 = "https://finance.google."+country+"";
var productlink19 = "https://photos.google."+country+"";
var productlink20 = "https://www.google."+country+"/?tbm=vid";
var productlink21 = 'https://www.google.com/intl/'+country+'/about/products';
var productlink22 = "https://www.google.com/voice";
var productlink23 = "https://www.google.com/contacts/#contacts"
var productlink24 = "https://scholar.google."+country+"";
var productlink25 = "https://keep.google.com";
var productlink26 = "https://docs.google.com/presentation";
var productlink27 = "https://groups.google.com";
var productlink28 = "https://hangouts.google.com";
var productlink29 = "https://ai.google";
var productlink30 = "https://artsandculture.google.com";
var productlink31 = "https://play.google.com/music";
var productlink32 = "https://play.google.com/store";
var productlink33 = "https://www.google.'+country+'/save";
var productlink34 = "https://business.google.com";
var productlink35 = "https://classroom.google.com";
var productlink36 = "https://earth.google.com/web";
var productlink37 = "https://jamboard.google.com";
var productlink38 = "https://support.google.com";
var productlink39 = "https://sites.google.com";
var productlink40 = "https://trends.google.com";
var productlink41 = "https://www.google.com/flights";
var productlink42 = "https://fit.google.com";
var productlink43 = "https://store.google.com";
var productlink44 = "https://console.cloud.google.com";
var productlink45 = "https://analytics.google.com";
var productlink46 = "https://ads.google.com";
var productlink47 = "https://search.google.com/search-console";
var productlink48 = "https://merchants.google.com";
var productlink49 = "https://www.google.com/adsense";
var productlink50 = "https://play.google.com/apps/publish";
var productlink51 = "https://chrome.google.com/webstore";
var productlink52 = "https://docs.google.com/spreadsheets";
var productlink53 = "https://docs.google.com/forms";

var productlinksearch1 = function(a,b){return"https://www.google."+a+"/account"};
var productlinksearch2 = function(a,b){return"https://www.google."+a+"/search?q="+b+""};
var productlinksearch3 = function(a,b){return"https://www.google."+a+"/search?tbm=isch&q="+b+""};
var productlinksearch4 = function(a,b){return"https://www.google."+a+"/maps/search/"+b};
var productlinksearch5 = function(a,b){return"https://play.google.com/store/search?q="+b};
var productlinksearch6 = function(a,b){return"https://www.youtube."+a+"/results?search_query="+b};
var productlinksearch7 = function(a,b){return"https://www.google."+a+"/search?q="+b+"&source=lnms&tbm=nws"};
var productlinksearch8 = function(a,b){return"https://mail.google."+a+""};
var productlinksearch9 = function(a,b){return"https://drive.google."+a+""};
var productlinksearch10 = function(a,b){return"https://calendar.google."+a+""};
var productlinksearch11 = function(a,b){return"https://translate.google."+a+"/#auto/"+b};
var productlinksearch12 = function(a,b){return"https://mobile.google."+a+""};
var productlinksearch13 = function(a,b){return"https://www.google."+a+"/search?tbm=bks&q="+b+""};
var productlinksearch14 = function(a,b){return"https://docs.google."+a+""};
var productlinksearch15 = function(a,b){return"https://pay.google."+a+""};
var productlinksearch16 = function(a,b){return"https://shopping.google."+a+"search?tbm=shop&q="+b+""};
var productlinksearch17 = function(a,b){return"https://www.blogger."+a+""};
var productlinksearch18 = function(a,b){return"https://finance.google.com/finance?q="+b};
var productlinksearch19 = function(a,b){return"https://photos.google."+a+""};
var productlinksearch20 = function(a,b){return"https://www.google."+a+"/search?tbm=vid&source=hp&q="+b};
var productlinksearch21 = function(a,b){return"https://www.google.com/intl/"+a+"/about/products"};
var productlinksearch22 = function(a,b){return"https://www.google.com/voice"};
var productlinksearch23 = function(a,b){return"https://www.google.com/contacts/#contacts‎"};
var productlinksearch24 = function(a,b){return"https://scholar.google."+a+""};
var productlinksearch25 = function(a,b){return"https://keep.google.com"};
var productlinksearch26 = function(a,b){return"https://docs.google.com/presentation"};
var productlinksearch27 = function(a,b){return"https://groups.google.com"};
var productlinksearch28 = function(a,b){return"https://hangouts.google.com"};
var productlinksearch29 = function(a,b){return"https://ai.google"};
var productlinksearch30 = function(a,b){return"https://artsandculture.google.com"};
var productlinksearch31 = function(a,b){return"https://play.google.com/music"};
var productlinksearch32 = function(a,b){return"https://play.google.com/movies"};
var productlinksearch33 = function(a,b){return"https://www.google."+a+"/save"};
var productlinksearch34 = function(a,b){return"https://business.google.com"};
var productlinksearch35 = function(a,b){return"https://classroom.google.com"};
var productlinksearch36 = function(a,b){return"https://earth.google.com/web"};
var productlinksearch37 = function(a,b){return"https://jamboard.google.com"};
var productlinksearch38 = function(a,b){return"https://support.google.com"};
var productlinksearch39 = function(a,b){return"https://sites.google.com"};
var productlinksearch40 = function(a,b){return"https://trends.google.com"};
var productlinksearch41 = function(a,b){return"https://www.google.com/flights"};
var productlinksearch42 = function(a,b){return"https://fit.google.com"};
var productlinksearch43 = function(a,b){return"https://store.google.com"};
var productlinksearch44 = function(a,b){return"https://console.cloud.google.com"};
var productlinksearch45 = function(a,b){return"https://analytics.google.com"};
var productlinksearch46 = function(a,b){return"https://ads.google.com"};
var productlinksearch47 = function(a,b){return"https://search.google.com/search-console"};
var productlinksearch48 = function(a,b){return"https://merchants.google.com"};
var productlinksearch49 = function(a,b){return"https://www.google.com/adsense"};
var productlinksearch50 = function(a,b){return"https://play.google.com/apps/publish"};
var productlinksearch51 = function(a,b){return"https://chrome.google.com/webstore"};
var productlinksearch52 = function(a,b){return"https://docs.google.com/spreadsheets"};
var productlinksearch53 = function(a,b){return"https://docs.google.com/forms"};