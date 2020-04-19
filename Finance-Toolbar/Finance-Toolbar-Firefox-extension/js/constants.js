function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('finance-toolbar-firefox-install-button')) {
		$('finance-toolbar-firefox-install-button').style.display = 'none';
		$('finance-toolbar-firefox-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/finance-toolbar/browser/options.html";
var ambientaureaproduct = "https://addons.mozilla.org/firefox/addon/ambient-aurea";
var datetodayproduct = "https://addons.mozilla.org/firefox/addon/date-today";
var turnoffthelightsproduct = "https://addons.mozilla.org/firefox/addon/turn-off-the-lights";
var financetoolbarproduct = "https://addons.mozilla.org/firefox/addon/finance-toolbar";
var propermenubarproduct = "https://addons.mozilla.org/firefox/addon/proper-menubar";
var fullscreenproduct = "https://addons.mozilla.org/firefox/addon/full-screen-for-firefox";
var zoomproduct = "https://addons.mozilla.org/firefox/addon/zoom";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://addons.mozilla.org/firefox/addon/finance-toolbar/reviews";
var linkchangelog = "https://www.stefanvd.net/project/finance-toolbar/browser/firefox/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkguide = "https://www.stefanvd.net/project/finance-toolbar/browser/firefox/guide.htm";
var linkwelcomepage = "https://www.stefanvd.net/project/finance-toolbar/browser/firefox/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/project/finance-toolbar/browser/firefox/uninstall.htm";
var financetoolbarwebsite = "https://www.stefanvd.net/project/finance-toolbar/browser/";
/* promo app */
var financetoolbarapp = "https://www.stefanvd.net/project/finance-toolbar/"
var browsernewtab = "chrome://newtab/";
var browserstore = "https://chrome.google.com";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";