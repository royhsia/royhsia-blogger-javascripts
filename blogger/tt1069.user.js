// ==UserScript==
// @name Auto clear "jammer" text
// @description Auto clear tt1069 "jammer" hidden text
// @author XPC
// @version 1.0
// @namespace http://royhsia.blogspot.com
// @include http://www.tt1069.com/*
// @include https://www.tt1069.com/*
// @run-at document-end
// @license free
// ==/UserScript==

(function(){
  var ClassNameArray = document.getElementsByClassName ("jammer");
  for (var i = 0; i < ClassNameArray.length; i++) {
    if (ClassNameArray[i].innerText != undefined) {
      ClassNameArray[i].innerText = "";
    } else {
	  ClassNameArray[i].textContent = "";
	}
  }
})();
