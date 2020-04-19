function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('zoom-firefox-install-button')) {
		$('zoom-firefox-install-button').style.display = 'none';
		$('zoom-firefox-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/zoom/browser/options.html";
var ambientaureaproduct = "https://addons.mozilla.org/firefox/addon/ambient-aurea";
var datetodayproduct = "https://addons.mozilla.org/firefox/addon/date-today";
var turnoffthelightsproduct = "https://addons.mozilla.org/firefox/addon/turn-off-the-lights";
var financetoolbarproduct = "https://addons.mozilla.org/firefox/addon/finance-toolbar";
var propermenubarproduct = "https://addons.mozilla.org/firefox/addon/proper-menubar";
var fullscreenproduct = "https://addons.mozilla.org/firefox/addon/full-screen-for-firefox";
var zoomproduct = "https://addons.mozilla.org/firefox/addon/zoom";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://addons.mozilla.org/firefox/addon/zoom/reviews/";
var linkchangelog = "https://www.stefanvd.net/project/zoom/browser/firefox/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkguide = "https://www.stefanvd.net/project/zoom/browser/firefox/guide.htm";
var linkwelcomepage = "https://www.stefanvd.net/project/zoom/browser/firefox/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/project/zoom/browser/firefox/uninstall.htm";
var zoomwebsite = "https://www.stefanvd.net/project/zoom/browser/";
var browsernewtab = "about:newtab";
var browserstore = "https://addons.mozilla.org";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";