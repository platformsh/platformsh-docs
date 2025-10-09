document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener("click", event => {
      // Skip links that are inside a <nav>
      if (link.closest("nav")) return;

      const href = link.getAttribute("href");
      const url = new URL(href, window.location.href);

      // Only handle anchors within the same page
      if (url.pathname === window.location.pathname && url.hash) {
        event.preventDefault();
        navigator.clipboard.writeText(url.href).then(() => {
          const tooltip = document.createElement("span");
          tooltip.textContent = "Copied in the clipboard!";
          tooltip.style.position = "absolute";
          tooltip.style.background = "#333";
          tooltip.style.color = "#fff";
          tooltip.style.padding = "2px 6px";
          tooltip.style.borderRadius = "4px";
          tooltip.style.fontSize = "12px";
          tooltip.style.marginLeft = "6px";
          link.appendChild(tooltip);
          setTimeout(() => tooltip.remove(), 1000);
        });
      }
    });
  });
});
