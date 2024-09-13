//================================================
/*

Snow
Experience a snowstorm effect with falling snow on your page. Transform it into a winter wonderland with snowflakes.
Copyright (C) 2024 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

function $(id){ return document.getElementById(id); }

// Install on www.stefanvd.net
if(window.location.href.match(/^http(s)?:\/\/(www\.)?stefanvd.net/i)){
	if($("snow-" + exbrowser + "-install-button")){
		$("snow-" + exbrowser + "-install-button").style.display = "none";
		$("snow-" + exbrowser + "-thanks-button").style.display = "block";
	}
}

window.addEventListener("load", function(){
	chrome.runtime.sendMessage({name: "stefansnow"});
}, true);

var addbar, snowAmount, snowColor, colorOption, snowShape, snowSize, snowSpeed, windDirectionControl, snowOnBottom;
chrome.runtime.onMessage.addListener(function request(request){
	if(request.action == "addremove"){
		chrome.storage.sync.get(["addbar", "snowAmount", "snowColor", "colorOption", "snowShape", "snowSize", "snowSpeed", "windDirectionControl", "snowOnBottom"], function(items){
			addbar = items["addbar"]; if(addbar == null)addbar = true;
			snowAmount = items["snowAmount"]; if(snowAmount == null)snowAmount = 100;
			snowColor = items["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
			colorOption = items["colorOption"]; if(colorOption == null)colorOption = "solid";
			snowShape = items["snowShape"]; if(snowShape == null)snowShape = "dot";
			snowSize = items["snowSize"]; if(snowSize == null)snowSize = 3;
			snowSpeed = items["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
			windDirectionControl = items["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = true;
			snowOnBottom = items["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;

			if(addbar == true){
				createCanvas();
			}else{
				removeCanvas();
			}
		});
	}else if(request.action == "refreshsnow"){
		// from the options
		chrome.storage.sync.get(["addbar", "snowAmount", "snowColor", "colorOption", "snowShape", "snowSize", "snowSpeed", "windDirectionControl", "snowOnBottom"], function(items){
			addbar = items["addbar"]; if(addbar == null)addbar = true;
			snowAmount = items["snowAmount"]; if(snowAmount == null)snowAmount = 100;
			snowColor = items["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
			colorOption = items["colorOption"]; if(colorOption == null)colorOption = "solid";
			snowShape = items["snowShape"]; if(snowShape == null)snowShape = "dot";
			snowSize = items["snowSize"]; if(snowSize == null)snowSize = 3;
			snowSpeed = items["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
			windDirectionControl = items["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = true;
			snowOnBottom = items["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;

			removeCanvas();
			if(addbar == true){
				createCanvas();
			}
		});
	}else if(request.action == "refreshcontent"){
		// from popup panel
		const snowSettings = request.snowSettings;
		console.log("Received snow settings:", snowSettings)

		addbar = snowSettings["addbar"]; if(addbar == null)addbar = true;
		snowAmount = snowSettings["snowAmount"]; if(snowAmount == null)snowAmount = 100;
		snowColor = snowSettings["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
		colorOption = snowSettings["colorOption"]; if(colorOption == null)colorOption = "solid";
		snowShape = snowSettings["snowShape"]; if(snowShape == null)snowShape = "dot";
		snowSize = snowSettings["snowSize"]; if(snowSize == null)snowSize = 3;
		snowSpeed = snowSettings["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
		windDirectionControl = snowSettings["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = true;
		snowOnBottom = snowSettings["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;

		removeCanvas();
		if(addbar == true){
			createCanvas();
		}
	}
});

// Function to create and add the canvas
function createCanvas(){
	// Check if the canvas already exists
	if(document.getElementById("stefanvdsnowcanvas")){
		return;
	}

	// Create a canvas element
	var canvas = document.createElement("canvas");

	// Set the id attribute
	canvas.id = "stefanvdsnowcanvas";

	// Append the canvas to the body or another container
	document.body.appendChild(canvas);

	// Add stylesheet for the canvas
	var style = document.createElement("style");
	style.type = "text/css";
	style.id = "stefanvdcanvasstyle";
	style.textContent = "#stefanvdsnowcanvas{position:absolute;top:0;left:0;pointer-events:none;height:100%;width:100%;z-index:990}";
	document.head.appendChild(style);

	addSnowLayer();
}

// Function to remove the canvas
function removeCanvas(){
	// Find the canvas element
	var canvas = document.getElementById("stefanvdsnowcanvas");

	// Check if the canvas exists
	if(canvas){
		document.body.removeChild(canvas);
	}
	// Remove the stylesheet
	var style = document.getElementById("stefanvdcanvasstyle");
	if(style){
		document.head.removeChild(style);
	}
}



var canvas;
var ctx;
var snowflakes = [];
var mouseX;
function addSnowLayer(){

	console.log("create addSnowLayer")
	canvas = document.getElementById("stefanvdsnowcanvas");
	ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	snowflakes = [];
	mouseX = canvas.width / 2;

	window.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
	});

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	createSnowflakes();
	animateSnow();
}

class Snowflake{
	constructor(){
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.radius = Math.random() * snowSize + 1;
		this.speedY = Math.random() * snowSpeed + 0.5;
		this.speedX = 0;
		this.opacity = 1;
		this.stuck = false;
		this.color = colorOption === "solid" ? snowColor : getRandomColor();
		this.shape = snowShape;
	}

	update(){
		if(!this.stuck){
			if(windDirectionControl){
				const direction = mouseX - canvas.width / 2;
				this.speedX = direction / 200;
			}else{
				this.speedX = 0;
			}

			this.y += this.speedY;
			this.x += this.speedX;
		}

		if(snowOnBottom && this.y >= canvas.height){
			this.y = canvas.height;
			this.speedY = 0;
			this.stuck = true;
			this.opacity -= 0.005;
			if(this.opacity <= 0){
				this.reset();
			}
		}

		if(this.x > canvas.width){
			this.x = 0;
		}else if(this.x < 0){
			this.x = canvas.width;
		}

		if(this.y > canvas.height && !snowOnBottom){
			this.reset();
		}
	}

	reset(){
		this.x = Math.random() * canvas.width;
		this.y = 0;
		this.radius = Math.random() * snowSize + 1;
		this.speedY = Math.random() * snowSpeed + 0.5;
		this.opacity = 1;
		this.stuck = false;
		this.color = colorOption === "solid" ? snowColor : getRandomColor();
		this.shape = snowShape;
	}

	draw(){
		ctx.save();
		ctx.fillStyle = `rgba(${hexToRgb(this.color)}, ${this.opacity})`;
		ctx.translate(this.x, this.y);

		if(this.shape === "dot"){
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		}else if(this.shape === "star"){
			this.drawStar(5, this.radius, this.radius / 2);
		}else if(this.shape === "snowflake"){
			this.drawSnowflake();
		}

		ctx.restore();
	}

	drawStar(points, outerRadius, innerRadius){
		let angle = Math.PI / points;

		ctx.beginPath();
		for(let i = 0; i < 2 * points; i++){
			const radius = i % 2 === 0 ? outerRadius : innerRadius;
			const x = Math.cos(i * angle) * radius;
			const y = Math.sin(i * angle) * radius;
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.fill();
	}

	// Updated method to draw the Unicode snowflake symbol
	drawSnowflake(){
		ctx.font = `${this.radius * 5}px Arial`; // Adjust size using the radius
		ctx.fillText("❄", -this.radius, this.radius); // Position slightly adjusted for centering
	}
}

function getRandomColor(){
	const letters = "0123456789ABCDEF";
	let color = "#";
	for(let i = 0; i < 6; i++){
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function hexToRgb(hex){
	let r = parseInt(hex.slice(1, 3), 16);
	let g = parseInt(hex.slice(3, 5), 16);
	let b = parseInt(hex.slice(5, 7), 16);
	return`${r}, ${g}, ${b}`;
}

function createSnowflakes(){
	snowflakes = [];
	for(let i = 0; i < snowAmount; i++){
		snowflakes.push(new Snowflake());
	}
}

function animateSnow(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(snowflakes.length < snowAmount){
		const difference = snowAmount - snowflakes.length;
		for(let i = 0; i < difference; i++){
			snowflakes.push(new Snowflake());
		}
	}else if(snowflakes.length > snowAmount){
		snowflakes.splice(0, snowflakes.length - snowAmount);
	}

	snowflakes.forEach((snowflake) => {
		snowflake.update();
		snowflake.draw();
	});

	requestAnimationFrame(animateSnow);
}