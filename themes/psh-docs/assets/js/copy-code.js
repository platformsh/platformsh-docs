document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre > code").forEach((codeBlock) => {
    const pre = codeBlock.parentNode;

    // check if a parent has class "no-copy"
    if (pre.closest(".no-copy")) {
      return;
    }

    // Create a container to add the button outside of the <pre>
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";
    wrapper.style.position = "relative";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Create copy button
    const button = document.createElement("button");
    button.className = "hextra-code-copy-btn";
    button.type = "button";
    button.title = "Copy code";

    button.innerHTML = `
      <div class="copy-icon pointer-events-none h-4 w-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </div>
      <div class="success-icon hidden pointer-events-none h-4 w-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    `;

    wrapper.appendChild(button);

    // manage click
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.innerText);

        button.querySelector(".copy-icon").classList.add("hidden");
        button.querySelector(".success-icon").classList.remove("hidden");

        // Tooltip
        const tooltip = document.createElement("span");
        tooltip.textContent = "Copied to clipboard!";
        tooltip.className = "copy-tooltip";
        button.appendChild(tooltip);

        setTimeout(() => {
          button.querySelector(".copy-icon").classList.remove("hidden");
          button.querySelector(".success-icon").classList.add("hidden");
          tooltip.remove();
        }, 1500);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  });
});
