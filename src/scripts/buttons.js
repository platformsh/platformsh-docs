/**
 * Make any "next" and "prev" links point to the right URL dynamically.
 */
 document.addEventListener("DOMContentLoaded", () => {
    let nextLinkTarget = document.querySelector("link[rel=next]").getAttribute("href")
    document.querySelectorAll('a.button-link.next').forEach((elm) => {
      elm.setAttribute('href', nextLinkTarget);
    });
});
