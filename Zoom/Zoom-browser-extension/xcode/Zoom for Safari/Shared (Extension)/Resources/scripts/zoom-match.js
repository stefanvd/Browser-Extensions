// Shared URL matching for website zoom entries.
(function(){
	function normalizeUrl(url, zoombydomain){
		if(!zoombydomain)return url || "";

		try{
			return new URL(url).origin;
		}catch(e){
			return url || "";
		}
	}

	function matchesPattern(pattern, url){
		var wildcardPattern = pattern.includes("*") && !pattern.includes(".*") && !/[\\^$()[\]|]/.test(pattern);
		if(wildcardPattern){
			var wildcard = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*");
			return new RegExp("^" + wildcard + "$").test(url);
		}
		try{
			if(new RegExp(pattern).test(url))return true;
		}catch(e){
			// Fall through to wildcard matching.
		}
		var escaped = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*");
		return new RegExp("^" + escaped + "$").test(url);
	}

	function findOverride(websitezoom, url, zoombydomain, zoombyregex){
		var normalizedUrl = normalizeUrl(url, zoombydomain);
		var match = null;

		Object.keys(websitezoom || {}).sort().forEach(function(key){
			var matched = false;
			if(zoombyregex){
				try{
					matched = matchesPattern(key, normalizedUrl);
				}catch(e){
					matched = false;
				}
			}else{
				matched = key === normalizedUrl;
			}

			if(matched)match = {key: key, value: Number(websitezoom[key]) / 100};
		});

		return match;
	}

	function createKey(url, zoombydomain, zoombyregex){
		var normalizedUrl = normalizeUrl(url, zoombydomain);
		if(!zoombyregex)return normalizedUrl;
		return("^" + normalizedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$");
	}

	globalThis.ZoomMatch = {normalizeUrl: normalizeUrl, findOverride: findOverride, createKey: createKey};
})();
