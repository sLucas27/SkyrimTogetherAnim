const ELEMENT_ID = "toanimate";
let obj;
let canvas;
function setup(){
	noise.seed(Math.random());
	obj = document.getElementById(ELEMENT_ID);
	canvas = document.createElement("canvas");
	canvas.height = obj.getBoundingClientRect().height;
	canvas.width = obj.getBoundingClientRect().width;
	obj.appendChild(canvas);
	window.requestAnimationFrame(draw);
}

let counter = 0;
function draw(){
	setTimeout(function(){
		window.requestAnimationFrame(draw);
	},1000/30);
	
	let ctx = canvas.getContext("2d");
	let image = ctx.createImageData(canvas.width, canvas.height);
	let data = image.data;
	
	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
			let value = Math.abs(noise.perlin2(x / 300, y / 300+counter/300));
			value *= 256;
			let cell = (x + y * canvas.width) * 4;
			//data[cell] = data[cell + 1] = data[cell + 2] = value*Math.exp(-Math.pow((x-canvas.width/2)/300,2))*Math.exp(-Math.pow((y-canvas.height/2)/300,2));
			data[cell] = data[cell + 1] = data[cell + 2] = value*mapCenter(x,0,canvas.width,0,1)*mapCenter(y,0,canvas.height,0,1)*0.5*Math.min(counter/(3*30),1);
			data[cell + 3] = 255; // alpha.
		}
	}
	ctx.putImageData(image, 0, 0);
	counter++;
}

function map(val,f,t,min,max){
	return (val-f)/(t-f)*(max-min)+min;
}

function mapCenter(val,f,t,min,max){
	if((val-f)/(t-f) < 0.5){
		return map(val,f,t/2,min,max);
	}else if((val-f)/(t-f) >= 0.5){
		return map(val,f+t/2,t,max,min);
	}
}

window.onresize = function(){
	canvas.height = obj.getBoundingClientRect().height;
	canvas.width = obj.getBoundingClientRect().width;
}

document.body.onload = function(){
	setup();
}