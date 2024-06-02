/* eslint-disable no-undef */
const{src, dest, series} = require("gulp");
const mergeJson = require("gulp-merge-json");
const rename = require("gulp-rename");
const fs = require("fs-extra");
const{join} = require("path");

const outputDir = "dist";
const packageDef = require("./package.json");

const buildExtension = (browser) => {
	const destination = `${outputDir}/${browser}`;

	// manifest file
	const mergeOverride = {version: packageDef.version};
	const commonManifest = "./src/manifests/common.json";
	const browserManifest = `./src/manifests/${browser}.json`;

	src([commonManifest, browserManifest])
		.pipe(mergeJson({fileName: "manifest.json", mergeOverride}))
		.pipe(dest(`${destination}/`));

	const browserConstantFile = `./src/constants/${browser}/constants.js`;
	const destinationConstantFile = join(destination, "scripts", "constants.js");
	fs.mkdirSync(join(destination, "scripts"), {recursive: true});
	fs.copyFileSync(browserConstantFile, destinationConstantFile);

	// html, scripts, styles files
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

const createTask = (browser) => {
	return series(() => buildExtension(browser));
};

exports.chrome = createTask("chrome");
exports.firefox = createTask("firefox");
exports.edge = createTask("edge");
exports.opera = createTask("opera");
exports.safari = createTask("safari");
exports.whale = createTask("whale");
exports.yandex = createTask("yandex");