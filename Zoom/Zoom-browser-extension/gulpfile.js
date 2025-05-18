/* eslint-disable no-undef */
const{src, dest, series} = require("gulp");
const mergeJson = require("gulp-merge-json");
const rename = require("gulp-rename");
const fs = require("fs-extra");
const{join} = require("path");
const{exec} = require("child_process");

const outputDir = "dist";
const safariOutputDir = "xcode/Zoom for Safari/Shared (Extension)/Resources";
const packageDef = require("./package.json");

const buildExtension = (browser) => {
	// Set destination based on browser type
	const destination = browser === "safari" ? safariOutputDir : `${outputDir}/${browser}`;

	// Manifest file
	const commonManifest = "./src/manifests/common.json";
	const browserManifest = `./src/manifests/${browser}.json`;

	// Helper function to merge content_scripts
	const mergeContentScripts = (commonScripts, browserScripts) => {
		const mergedScripts = [...commonScripts];

		browserScripts.forEach((browserScript) => {
			const matchExists = commonScripts.some((commonScript) =>
				JSON.stringify(commonScript.matches) === JSON.stringify(browserScript.matches) &&
            JSON.stringify(commonScript.js || []) === JSON.stringify(browserScript.js || []) &&
            JSON.stringify(commonScript.css || []) === JSON.stringify(browserScript.css || [])
			);
			if(!matchExists){
				mergedScripts.push(browserScript);
			}
		});

		return mergedScripts;
	};

	// Get the version number from package.json and add it to manifest.json
	src([commonManifest, browserManifest])
		.pipe(mergeJson({
			fileName: "manifest.json",
			edit: (json) => {
				json.version = packageDef.version;

				// Merge content_scripts if present
				if(json.content_scripts && Array.isArray(json.content_scripts)){
					const commonContentScripts = require(commonManifest).content_scripts || [];
					const browserContentScripts = require(browserManifest).content_scripts || [];
					json.content_scripts = mergeContentScripts(commonContentScripts, browserContentScripts);
				}

				return json;
			}
		}))
		.pipe(dest(`${destination}/`));

	// Constants file
	const browserConstantFile = `./src/constants/${browser}/constants.js`;
	const destinationConstantFile = join(destination, "scripts", "constants.js");
	fs.mkdirSync(join(destination, "scripts"), {recursive: true});
	fs.copyFileSync(browserConstantFile, destinationConstantFile);

	// HTML, scripts, styles, and other necessary files
	const sourceFiles = src([
		"!**/index.js",
		"./src/LICENSE",
		"./src/**/*.html",
		"./src/scripts/**/*.js",
		"./src/styles/**/*.css"
	]);

	const processedFiles = sourceFiles.pipe(rename((file) => {
		if(file.extname === ".html" || file.basename === "LICENSE"){
			file.dirname = "";
		}else if(file.dirname.includes("styles") || file.dirname.includes("scripts")){
			file.dirname = file.dirname.split("/").pop();
		}
	}));

	processedFiles.pipe(dest(destination));

	// images folder
	const imageExtensions = ["png", "webp", "svg", "webm", "mp4"];
	imageExtensions.forEach((extension) => {
		const files = fs.readdirSync("./src/images", {withFileTypes: true});
		files.forEach((file) => {
			if(file.isFile() && file.name.endsWith(`.${extension}`)){
				const destPath = join(destination, "images", file.name);
				fs.ensureDirSync(join(destination, "images"));
				fs.copySync(join("./src/images", file.name), destPath);
			}
		});
	});

	// languages
	const commonFiles = src(["./src/_locales/**/*.json"])
		.pipe(dest(`${destination}/_locales`));

	return commonFiles;
};

// Helper function to run npm scripts for zipping
const runZipCommand = (browser) => {
	return(cb) => {
		exec(`npm run ${browser}-create-zip`, (err, stdout, stderr) => {
			if(err){
				console.error(`Error during ${browser} zipping:`, stderr);
			}else{
				console.log(`Zipped ${browser} successfully:`, stdout);
			}
			cb(err);
		});
	};
};

// Build tasks for each browser
exports.chrome = () => buildExtension("chrome");
exports.firefox = () => buildExtension("firefox");
exports.opera = () => buildExtension("opera");
exports.edge = () => buildExtension("edge");
exports.safari = () => buildExtension("safari");
exports.whale = () => buildExtension("whale");

// Zipping tasks for each browser
exports["chrome-zip"] = runZipCommand("chrome");
exports["firefox-zip"] = runZipCommand("firefox");
exports["opera-zip"] = runZipCommand("opera");
exports["edge-zip"] = runZipCommand("edge");
exports["whale-zip"] = runZipCommand("whale");

// Main task to build and zip all browsers sequentially
exports.browserzip = series(
	exports.chrome,
	exports["chrome-zip"],
	exports.firefox,
	exports["firefox-zip"],
	exports.opera,
	exports["opera-zip"],
	exports.edge,
	exports["edge-zip"],
	exports.whale,
	exports["whale-zip"],
	exports.safari
);