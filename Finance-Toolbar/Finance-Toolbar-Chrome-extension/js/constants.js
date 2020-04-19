function $(id) { return document.getElementById(id); }
// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('finance-toolbar-chrome-install-button')) {
		$('finance-toolbar-chrome-install-button').style.display = 'none';
		$('finance-toolbar-chrome-thanks-button').style.display = 'block';
	}
}
var developerwebsite = "https://www.stefanvd.net";
var exoptionspage = "https://www.stefanvd.net/project/finance-toolbar/browser/options.html";
var ambientaureaproduct = "https://chrome.google.com/webstore/detail/ambient-aurea/pkaglmndhfgdaiaccjglghcbnfinfffa";
var datetodayproduct = "https://chrome.google.com/webstore/detail/date-today/mhgknbehalhkedjgfhiaindklahhkccc";
var turnoffthelightsproduct = "https://chrome.google.com/webstore/detail/turn-off-the-lights/bfbmjmiodbnnpllbbbfblcplfjjepjdn";
var financetoolbarproduct = "https://chrome.google.com/webstore/detail/finance-toolbar/cichbngoomgnobmmjpagmbkimbamigie";
var propermenubarproduct = "https://chrome.google.com/webstore/detail/proper-menubar/egclcjdpndeoioimlbbbmdhcaopnedkp";
var fullscreenproduct = "https://chrome.google.com/webstore/detail/full-screen/gmimocjjppdelmhpcmpkhekmpoddgima";
var zoomproduct = "https://chrome.google.com/webstore/detail/zoom/lajondecmobodlejlcjllhojikagldgd";
var donatewebsite = "https://www.stefanvd.net/donate.htm";
var writereview = "https://chrome.google.com/webstore/detail/finance-toolbar/cichbngoomgnobmmjpagmbkimbamigie/reviews";
var linkchangelog = "https://www.stefanvd.net/project/finance-toolbar/browser/google-chrome/changelog.htm";
var linktranslate = "https://www.stefanvd.net/project/translate.htm";
var linksupport = "https://www.stefanvd.net/support/";
var linkguide = "https://www.stefanvd.net/project/finance-toolbar/browser/google-chrome/guide.htm";
var linkwelcomepage = "https://www.stefanvd.net/project/finance-toolbar/browser/google-chrome/welcome.htm";
var linkuninstall = "https://www.stefanvd.net/project/finance-toolbar/browser/google-chrome/uninstall.htm";
var financetoolbarwebsite = "https://www.stefanvd.net/project/finance-toolbar/browser/";
/* promo app */
var financetoolbarapp = "https://www.stefanvd.net/project/finance-toolbar/"
var browsernewtab = "chrome://newtab/";
var browserstore = "https://chrome.google.com";
var linkyoutube = "https://www.youtube.com/c/stefanvandamme?sub_confirmation=1";
var devmode = false;
if(devmode == true){
	var getstockurl = "https://sandbox.iexapis.com/stable/stock/market/batch?symbols=";
	var getstockapi = "&types=quote&token=Tsk_81963986030a48be9785546985179fd2";
	var getcurrencyurl = "https://sandbox.iexapis.com/stable/fx/latest?symbols=";
	var getcurrencyapi = "&token=Tsk_81963986030a48be9785546985179fd2";
}else{
	var getstockurl = "https://cloud.iexapis.com/stable/stock/market/batch?symbols=";
	var getstockapi = "&types=quote&token=";
	var getcurrencyurl = "https://cloud.iexapis.com/stable/fx/latest?symbols=";
	var getcurrencyapi = "&token=";
}