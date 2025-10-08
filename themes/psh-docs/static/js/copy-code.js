document.addEventListener("DOMContentLoaded", () => {
  // For any pre.code block
  document.querySelectorAll("pre > code").forEach((codeBlock) => {
    const pre = codeBlock.parentNode

    // create button
    const button = document.createElement("button");
    button.className =
      "hextra-code-copy-btn";
    button.type = "button";
    button.title = "Copy code";

    // Icones (SVG Hextra-like)
    button.innerHTML = `
      <div class="copy-icon group-[.copied]/copybtn:hidden pointer-events-none h-4 w-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </div>
      <div class="success-icon hidden group-[.copied]/copybtn:block pointer-events-none h-4 w-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    `;

    // Click -> copy code
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.innerText);
        button.classList.add("copied");

        const tooltip = document.createElement("span");
        tooltip.textContent = "Copied in clipboard!";
        tooltip.style.position = "absolute";
        tooltip.style.background = "#575757";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "2px 6px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.fontSize = "12px";
        tooltip.style.top = "0rem"; //
        tooltip.style.right = "-0.2rem";
        tooltip.style.whiteSpace = "nowrap";
        pre.appendChild(tooltip);

        // Supprime le tooltip après 1,5 seconde
        setTimeout(() => tooltip.remove(), 1500);

        setTimeout(() => {
          button.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });

    // Insert button
    pre.style.position = "relative"
    pre.appendChild(button)
  })
})
