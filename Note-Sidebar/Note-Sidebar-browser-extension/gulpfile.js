/* eslint-disable no-undef */
const{src, dest} = require("gulp");
const mergeJson = require("gulp-merge-json");
const rename = require("gulp-rename");
const merge = require("merge-stream");
const fs = require("fs-extra");
const{join} = require("path");
const outputDir = "dist";

// This is useful for pulling the extension version in from the
// package.json at the root level
const packageDef = require("./package.json");

const buildManifest = (browser, destination) => {
	// Set up manifest values created in code
	const mergeOverride = {
		version: packageDef.version,
	};

	const fileName = "manifest.json";

	src([
		"./src/manifests/common.json",
		`./src/manifests/${browser}.json`,
	])
		.pipe(
			mergeJson({
				fileName,
				mergeOverride,
			})
		)
		.pipe(dest(`${destination}/`));
};

const buildConstants = (browser, destination) => {
	const fs = require("fs");
	const path = require("path");

	// Copy constant.js depending on the browser
	const browserConstantFile = `./src/constants/${browser}/constants.js`;
	const destinationConstantFile = path.join(destination, "scripts", "constants.js");

	// Ensure the destination scripts folder exists
	fs.mkdirSync(path.join(destination, "scripts"), {recursive: true});

	// Copy the file
	fs.copyFileSync(browserConstantFile, destinationConstantFile);
};

const combineSources = (browser, destination) => {
	const sourceFiles = src([
		"!**/index.js",
		"./src/LICENSE",
		"./src/**/*.html",
		"./src/scripts/**/*.js",
		"./src/styles/**/*.css"
	]);

	const processedFiles = sourceFiles.pipe(rename((file) => {
		if(file.extname === ".html" || file.basename === "LICENSE"){
			file.dirname = ""; // Move files to the root
		}else if(file.dirname.includes("styles") || file.dirname.includes("scripts")){
			file.dirname = file.dirname.split("/").pop(); // Move styles and scripts to src root
		}
	}));

	return processedFiles.pipe(dest(destination));
};

const ImagesSources = (browser, destination) => {
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
};

const LanguagesSources = (browser, destination) => {
	const commonFiles = src([
		"./src/_locales/**/*.json",
	])
		.pipe(dest(destination + "/_locales"));
	return merge(commonFiles);
};

const packageExtension = (browser) => {
	const destination = `${outputDir}/${browser}`;
	buildManifest(browser, destination);
	buildConstants(browser, destination);
	combineSources(browser, destination);
	ImagesSources(browser, destination);
	LanguagesSources(browser, destination);
};

function createTask(browser){
	return function(cb){
		packageExtension(browser);
		cb();
	};
}

exports.chrome = createTask("chrome");
exports.firefox = createTask("firefox");
exports.edge = createTask("edge");
exports.opera = createTask("opera");
exports.safari = createTask("safari");
exports.whale = createTask("whale");
exports.yandex = createTask("yandex");