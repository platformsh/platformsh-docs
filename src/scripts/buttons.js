/**
 * Make any "next" and "prev" links point to the right URL dynamically.
 */
document.addEventListener('DOMContentLoaded', () => {
  let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href")
  // let nextLinkTarget = document.querySelectorAll('[class="navigation navigation-next]').getAttribute("href")
  // let nextLinkTarget = document.querySelector("a.navigation.navigation-next").getAttribute("href");
  document.querySelectorAll('a.next-link').forEach((elm) => {
    elm.setAttribute('href', nextLinkTarget);
  });

  let prevLinkTarget = document.querySelector("link[rel=prev]").getAttribute("href");
  document.querySelectorAll('a.prev-link').forEach((elm) => {
    elm.setAttribute('href', prevLinkTarget);
  });
});
