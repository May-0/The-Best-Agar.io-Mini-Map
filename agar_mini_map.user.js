// ==UserScript==
// @name         My Fancy Agar Mini Map
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var vZ = GM_getValue("zoom", 50);

var canvas = document.createElement('canvas');

canvas.id = "mapCanvas";
canvas.width = (window.agar.dimensions[2]-window.agar.dimensions[0])/vZ;
canvas.height = (window.agar.dimensions[3]-window.agar.dimensions[1])/vZ;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.border = "1px solid";

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

mapCanvas = document.getElementById("mapCanvas");

var c=document.getElementById("mapCanvas");
var ctx=c.getContext("2d");

var run = setInterval(drawUpdate, 100);

function drawUpdate(){

    var rX = window.agar.rawViewport.x-window.agar.dimensions[0];
    var rY = window.agar.rawViewport.y-window.agar.dimensions[1];
    
    var grd=ctx.createRadialGradient(rX/vZ, rY/vZ, 1, rX/vZ, rY/vZ, 15000/vZ);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1,"black");

    ctx.clearRect(0,0,2048,1200);

    ctx.beginPath();
    ctx.strokeStyle = grd;
    ctx.moveTo(rX/vZ, 0);
    ctx.lineTo(rX/vZ, canvas.height);
    ctx.moveTo(0, rY/vZ);
    ctx.lineTo(canvas.width, rY/vZ);
    ctx.stroke();
    
    for each (cell in window.agar.allCells){
        var cX = (cell.x-window.agar.dimensions[0]);
        var cY = (cell.y-window.agar.dimensions[1]);

        if(cell.size > 15){
            ctx.beginPath();

            ctx.strokeStyle = cell.color;
            ctx.arc(cX/vZ, cY/vZ, cell.size/vZ, 0, 2*Math.PI);
            ctx.fillStyle = cell.color;
            ctx.fill();
            ctx.stroke();
        }
    }
}

window.addEventListener("keypress", function(e){
    if(e.keyCode == 61){
        vZ -= 5;
        mapCanvas.width = (window.agar.dimensions[2]-window.agar.dimensions[0])/vZ;
        mapCanvas.height = (window.agar.dimensions[3]-window.agar.dimensions[1])/vZ;
    }else if(e.keyCode == 45){
        vZ += 5;
        mapCanvas.width = (window.agar.dimensions[2]-window.agar.dimensions[0])/vZ;
        mapCanvas.height = (window.agar.dimensions[3]-window.agar.dimensions[1])/vZ;
    }
    GM_setValue("zoom", vZ);
});
