function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('zoom-edge-install-button')) {
		$('zoom-edge-install-button').style.display = 'none';
		$('zoom-edge-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/zoom/browser/options.html";
var ambientaureaproduct = "https://chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa";
var datetodayproduct = "https://chrome.google.com/webstore/detail/date-today/mhgknbehalhkedjgfhiaindklahhkccc";
var turnoffthelightsproduct = "https://chrome.google.com/webstore/detail/turn-off-the-lights/bfbmjmiodbnnpllbbbfblcplfjjepjdn";
var financetoolbarproduct = "https://chrome.google.com/webstore/detail/finance-toolbar/cichbngoomgnobmmjpagmbkimbamigie";
var propermenubarproduct = "https://chrome.google.com/webstore/detail/proper-menubar/egclcjdpndeoioimlbbbmdhcaopnedkp";
var fullscreenproduct = "https://chrome.google.com/webstore/detail/full-screen/gmimocjjppdelmhpcmpkhekmpoddgima";
var zoomproduct = "https://chrome.google.com/webstore/detail/zoom/lajondecmobodlejlcjllhojikagldgd";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://microsoftedge.microsoft.com/addons/detail/akclpjahoedloodjomjhnlmmblikemjj";
var linkchangelog = "https://www.stefanvd.net/project/zoom/browser/edge/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkguide = "https://www.stefanvd.net/project/zoom/browser/edge/guide.htm";
var linkwelcomepage = "https://www.stefanvd.net/project/zoom/browser/edge/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/project/zoom/browser/edge/uninstall.htm";
var zoomwebsite = "https://www.stefanvd.net/project/zoom/browser/";
var browsernewtab = "edge://newtab/";
var browserstore = "https://microsoftedge.microsoft.com";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";
var devmode = false;