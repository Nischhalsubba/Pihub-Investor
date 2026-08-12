"use strict";var gRanger=function(t,e,n,i){
/* init main view-objects */
var s=null,a=null,d=null,m={min:0,max:0,minLeft:0,maxLeft:0,width:0,step:10,minDragged:!1,init:function(){a.style.left=0,d.style.left=this.maxLeft+"px"},sync:function(){
/* set min */
this.minDragged&&(e.value=this.min+Math.round(this.minLeft/this.width)),this.maxDragged&&(n.value=this.min+Math.round(this.maxLeft/this.width))},slideDrag:function(t){var e=t.clientX-s.offsetLeft;
/* min scroll */this.minDragged&&(e<0?e=0:e>=this.maxLeft-a.offsetWidth&&(e=this.maxLeft-a.offsetWidth),this.minLeft=e,a.style.left=e+"px",this.sync())
/* max scroll */,this.maxDragged&&(e>s.offsetWidth?e=s.offsetWidth:e<=this.minLeft+a.offsetWidth&&(e=this.minLeft+a.offsetWidth),this.maxLeft=e,d.style.left=e+"px",this.sync())}};null!==(
/* Get range container and greate 2 slider (.min and .max) */
s=document.querySelector(String(t)))&&(a=document.createElement("div"),d=document.createElement("div"),a.className="slider min",d.className="slider max",s.appendChild(a),s.appendChild(d),
/* setInit value */
e=document.querySelector(String(e)),n=document.querySelector(String(n)),null!=e&&null!=n&&(m.min=Math.floor(e.value),m.max=Math.floor(n.value),m.maxLeft=s.offsetWidth,m.width=s.offsetWidth/(m.max-m.min),m.step=!isNaN(parseInt(i))&&0<parseInt(i)?parseInt(i):m.step,m.init(),
/* set Min slide Listener */
a.addEventListener("mousedown",function(t){m.minDragged=!0}),a.addEventListener("mouseup",function(t){m.minDragged=!1}),
/* set Max slide Listener */
d.addEventListener("mousedown",function(t){m.maxDragged=!0}),d.addEventListener("mouseup",function(t){m.maxDragged=!1}),
/* default unset */
document.addEventListener("mouseup",function(t){m.minDragged=!1,m.maxDragged=!1}),
/* set default Listener */
document.addEventListener("mousemove",function(t){m.slideDrag(t)})))};