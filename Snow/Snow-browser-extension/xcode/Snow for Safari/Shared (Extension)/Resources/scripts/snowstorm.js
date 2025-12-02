//================================================
/*

Snow
Add falling snow to your page for a snowstorm effect and turn it into a winter wonderland.
Copyright (C) 2025 Stefan vd
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

let redirectionHosts = [linkredirectionoptions];
if(redirectionHosts.includes(window.location.href)){
	if($("allowpermission")){
		$("allowpermission").className = "";
		chrome.runtime.sendMessage({name: "redirectionoptions"});
	}
	if($("disallowpermission")){
		$("disallowpermission").className = "hidden";
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
			snowAmount = items["snowAmount"]; if(snowAmount == null)snowAmount = 500;
			snowColor = items["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
			colorOption = items["colorOption"]; if(colorOption == null)colorOption = "solid";
			snowShape = items["snowShape"]; if(snowShape == null)snowShape = "dot";
			snowSize = items["snowSize"]; if(snowSize == null)snowSize = 3;
			snowSpeed = items["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
			windDirectionControl = items["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = false;
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
			windDirectionControl = items["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = false;
			snowOnBottom = items["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;

			removeCanvas();
			if(addbar == true){
				createCanvas();
			}
		});
	}else if(request.action == "refreshcontent"){
		// from popup panel
		const snowSettings = request.snowSettings;
		// console.log("Received snow settings:", snowSettings);

		addbar = snowSettings["addbar"]; if(addbar == null)addbar = true;
		snowAmount = snowSettings["snowAmount"]; if(snowAmount == null)snowAmount = 100;
		snowColor = snowSettings["snowColor"]; if(snowColor == null)snowColor = "#ffffff";
		colorOption = snowSettings["colorOption"]; if(colorOption == null)colorOption = "solid";
		snowShape = snowSettings["snowShape"]; if(snowShape == null)snowShape = "dot";
		snowSize = snowSettings["snowSize"]; if(snowSize == null)snowSize = 3;
		snowSpeed = snowSettings["snowSpeed"]; if(snowSpeed == null)snowSpeed = 2;
		windDirectionControl = snowSettings["windDirectionControl"]; if(windDirectionControl == null)windDirectionControl = false;
		snowOnBottom = snowSettings["snowOnBottom"]; if(snowOnBottom == null)snowOnBottom = true;


		removeCanvas();
		if(addbar == true){
			createCanvas();
		}
	}
});

// Function to create and add the canvas
function createCanvas(){
	// Create a shadow host
	var shadowHost = document.createElement("div");
	shadowHost.id = "stefanvdsnowhost";
	document.body.appendChild(shadowHost);

	// Attach a shadow root to the shadow host
	var shadow = shadowHost.attachShadow({mode: "open"});

	// Create a style element inside the shadow DOM
	var style = document.createElement("style");
	style.type = "text/css";
	style.id = "stefanvdcanvasstyle";
	style.textContent = "#stefanvdsnowcanvas{position:fixed;top:0;left:0;bottom:0;right:0;pointer-events:none;height:100%;width:100%;z-index:990}";

	// Append the style to the shadow root
	shadow.appendChild(style);

	// Append your canvas inside the shadow DOM as well
	var canvas = document.createElement("canvas");
	canvas.id = "stefanvdsnowcanvas";
	shadow.appendChild(canvas);

	addSnow();
}

// Function to remove the canvas and the shadow DOM
function removeCanvas(){
	removeSnow();

	// Find the shadow host element (assuming it's already created)
	let shadowHost = document.querySelector("#stefanvdsnowhost"); // or use an ID/class if necessary

	// Check if the shadow host exists
	if(shadowHost){
		var shadow = shadowHost.shadowRoot;

		// Find the canvas element inside the shadow DOM
		var canvas = shadow.getElementById("stefanvdsnowcanvas");

		// Check if the canvas exists inside the shadow DOM and remove it
		if(canvas){
			shadow.removeChild(canvas);
		}

		// Find the stylesheet inside the shadow DOM
		var style = shadow.getElementById("stefanvdcanvasstyle");

		// Check if the stylesheet exists and remove it
		if(style){
			shadow.removeChild(style);
		}

		// Remove the shadow host itself from the document body
		document.body.removeChild(shadowHost);
	}
}

let canvas, ctx, snowflakes, mouseX, animationFrameId;
const SnowEffect = (function(){

	function init(){
		// Find the shadow host element (assuming it's already created)
		let shadowHost = document.querySelector("#stefanvdsnowhost"); // or use an ID/class if necessary

		// Check if the shadow host exists and get the shadow DOM
		if(shadowHost){
			let shadow = shadowHost.shadowRoot;

			// Retrieve the canvas from the shadow DOM
			canvas = shadow.getElementById("stefanvdsnowcanvas");

			if(canvas){
				// Initialize the canvas context and properties
				ctx = canvas.getContext("2d");
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;

				// Initialize other variables
				snowflakes = [];
				mouseX = canvas.width / 2;

				// Add event listeners for resize and mousemove
				window.addEventListener("resize", onResize);
				window.addEventListener("mousemove", onMouseMove);
			}
		}
	}

	function onResize(){
		if(canvas){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
	}

	function onMouseMove(e){
		mouseX = e.clientX;
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
		if(!ctx)return; // Safety check for context

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

		animationFrameId = requestAnimationFrame(animateSnow);
	}

	function addSnow(){
		if(animationFrameId)return; // Prevent adding multiple snow effects
		init();
		createSnowflakes();
		animateSnow();
	}

	function removeSnow(){
		if(!animationFrameId)return; // If no animation is running, return early
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;

		window.removeEventListener("resize", onResize);
		window.removeEventListener("mousemove", onMouseMove);

		// Clear canvas and reset variables
		if(ctx){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		snowflakes = [];
		canvas = null;
		ctx = null;
	}

	return{
		addSnow,
		removeSnow
	};
})();

function addSnow(){
	SnowEffect.addSnow();
}

function removeSnow(){
	SnowEffect.removeSnow();
}