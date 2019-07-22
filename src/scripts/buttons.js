/**
 * Make any "next" and "prev" links point to the right URL dynamically.
 */

function makeButtonLinks() {
   els = document.getElementsByClassName("somethingnext");
   [].forEach.call(els, function (el) {
     el.on("click", gitbook.navigation.goNext());
   });
 })

makeButtonLinks();

// document.addEventListener('DOMContentLoaded', () => {
//   var els = document.getElementsByClassName("somethingnext");
//   [].forEach.call(els, function (el) {
//     el.on("click", gitbook.navigation.goNext());
//   });
// })









// function document.makeButtonLinks () {
//   var next = document.getElementsByClassName("somethingnext");
//
//   [].forEach.call(next, function (el) {
//     console.log("put in dcl function - next")
//     el.onclick = gitbook.navigation.goNext();
//   });
//
//   var prev = document.getElementsByClassName("somethingprev");
//
//   [].forEach.call(prev, function (el) {
//     console.log("put in dcl function - prev")
//     el.setAttribute("onclick", gitbook.navigation.goNext());
//     // el.onclick = gitbook.navigation.goPrev();
//   });
// };
//
// makeButtonLinks();


// function doSomething() {
//   console.log("something");
// }
// // console.log("something");
// doSomething();
//
// var els = document.getElementsByClassName("somethingnext");
//
// [].forEach.call(els, function (el) {
//   console.log(el)
//   // el.on("click", gitbook.navigation.goNext());
//   el.onclick = gitbook.navigation.goNext();
// });


// document.getElementsByClassName('a.somethingnext').forEach((elm) => {
//   elm.setAttribute("onclick", "gitbook.navigation.goNext()");
// });

 // document.getElementsByClassName('somethingnext')[0].on("click", function() {
 //   return "gitbook.navigation.goNext()";
 // });
 //
 // document.getElementsByClassName('somethingprev')[0].on("click", function() {
 //   return "gitbook.navigation.goPrev()";
 // });


// document.addEventListener('DOMContentLoaded', () => {
// // document.addEventListener("window['gitbook'].page.hasChanged", () => {
//   console.log(window["gitbook"]);
//   let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href");
//   document.querySelectorAll('a.button-link.next').forEach((elm) => {
//     elm.setAttribute('href', nextLinkTarget);
//   });
//
//    let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
//   document.querySelectorAll('a.button-link.prev').forEach((elm) => {
//     elm.setAttribute('href', prevLinkTarget);
//   });
// });

// XMLHttpRequest.onloadstart = function () {
//   let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href");
//   document.querySelectorAll('a.button-link.next').forEach((elm) => {
//     elm.setAttribute('href', nextLinkTarget);
//   });
//
//    let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
//   document.querySelectorAll('a.button-link.prev').forEach((elm) => {
//     elm.setAttribute('href', prevLinkTarget);
//   });
// };
// // }

// document.getElementsByClassName('something next').on("click", function() {
//   return "gitbook.navigation.goNext()";
// });
//
// document.getElementsByClassName('something prev')[0].on("click", function() {
//   return "gitbook.navigation.goPrev()";
// });
