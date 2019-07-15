/**
 * Make any "next" and "prev" links point to the right URL dynamically.
 */


require(["gitbook"], function(gitbook) {

  document.addEventListener('DOMContentLoaded', () => {
    let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href")
    document.querySelectorAll('a.button-link.next').forEach((elm) => {
      elm.setAttribute('href', nextLinkTarget);
    });

    let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
    document.querySelectorAll('a.button-link.prev').forEach((elm) => {
      elm.setAttribute('href', prevLinkTarget);
    });
  });

  gitbook.events.bind("page.change", function() {
       track("page.change");
  });

});

// function ready(fn) {
//   if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
//
//
// function makeButtonTargets() {
//   let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href")
//   document.querySelectorAll("a.button-link.next").forEach((elm) => {
//     elm.setAttribute("href", nextLinkTarget);
//   });
//
//   let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
//   document.querySelectorAll("a.button-link.prev").forEach((elm) => {
//     elm.setAttribute("href", prevLinkTarget);
//   });
//
// }
//
// ready(makeButtonTargets);
