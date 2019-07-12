/**
 * Make any "next" and "prev" links point to the right URL dynamically.
 */
// document.addEventListener('DOMContentLoaded', () => {
//   // let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href")
//   let nextLinkTarget = document.querySelector("a.navigation.navigation-next").getAttribute("href");
//   document.querySelectorAll('a.button-link.next').forEach((elm) => {
//     elm.setAttribute('href', nextLinkTarget);
//   });
//
//   let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
//   document.querySelectorAll('a.prev-link').forEach((elm) => {
//     elm.setAttribute('href', prevLinkTarget);
//   });
// });

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


function makeButtonTargets() {
  let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href")
  document.querySelectorAll("a.button-link.next").forEach((elm) => {
    elm.setAttribute("href", nextLinkTarget);
  });

  let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
  document.querySelectorAll("a.button-link.prev").forEach((elm) => {
    elm.setAttribute("href", prevLinkTarget);
  });

}

ready(makeButtonTargets);
