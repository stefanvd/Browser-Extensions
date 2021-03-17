function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('zoom-opera-install-button')) {
		$('zoom-opera-install-button').style.display = 'none';
		$('zoom-opera-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/zoom/browser/options.html";
var ambientaureaproduct = "https://addons.opera.com/extensions/details/ambient-aurea/";
var datetodayproduct = "https://addons.opera.com/extensions/details/date-today/";
var turnoffthelightsproduct = "https://addons.opera.com/extensions/details/turn-off-the-lights/";
var financetoolbarproduct = "https://addons.opera.com/extensions/details/finance-toolbar/";
var propermenubarproduct = "https://addons.opera.com/extensions/details/proper-menubar/";
var fullscreenproduct = "https://addons.opera.com/extensions/details/full-screen/";
var zoomproduct = "https://addons.opera.com/extensions/details/zoom/";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://addons.opera.com/extensions/details/zoom/";
var linkchangelog = "https://www.stefanvd.net/project/zoom/browser/opera/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkguide = "https://www.stefanvd.net/project/zoom/browser/opera/guide.htm";
var linkwelcomepage = "https://www.stefanvd.net/project/zoom/browser/opera/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/project/zoom/browser/opera/uninstall.htm";
var zoomwebsite = "https://www.stefanvd.net/project/zoom/browser/";
var browsernewtab = "opera://newtab/";
var browserstore = "https://addons.opera.com";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";
var devmode = false;