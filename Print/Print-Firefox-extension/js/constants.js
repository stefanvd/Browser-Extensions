function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('print-firefox-install-button')) {
		$('print-firefox-install-button').style.display = 'none';
		$('print-firefox-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/print/browser/options.html";
var ambientaureaproduct = "https://addons.mozilla.org/firefox/addon/ambient-aurea";
var datetodayproduct = "https://addons.mozilla.org/firefox/addon/date-today";
var turnoffthelightsproduct = "https://addons.mozilla.org/firefox/addon/turn-off-the-lights";
var financetoolbarproduct = "https://addons.mozilla.org/firefox/addon/finance-toolbar";
var propermenubarproduct = "https://addons.mozilla.org/firefox/addon/proper-menubar";
var printproduct = "https://addons.mozilla.org/firefox/addon/print-for-firefox/"
var fullscreenproduct = "https://addons.mozilla.org/firefox/addon/full-screen-for-firefox";
var zoomproduct = "https://addons.mozilla.org/firefox/addon/zoom";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://addons.mozilla.org/en-US/firefox/addon/print-for-firefox/reviews";
var linkchangelog = "https://www.stefanvd.net/project/print/browser/firefox/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkwelcomepage = "https://www.stefanvd.net/project/print/browser/firefox/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/";
var printwebsite = "https://www.stefanvd.net/project/print/browser/";
var browsernewtab = "chrome://newtab/";
var browserstore = "https://chrome.google.com";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";