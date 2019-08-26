$(document).ready(function(){if($("#file_dropzone").length){var e=document.querySelector("#tpl").innerHTML;$("div#file_dropzone").dropzone({url:"http://google.com",previewTemplate:e,previewsContainer:".file-upload-display",acceptedFiles:"accept"})}
//hamburger action
$("#hamburger").click(function(){window.innerWidth;$(this).toggleClass("open"),$(".sidebar").toggleClass("active")})});