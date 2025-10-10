let feedbackButtonTimeout;

document.addEventListener("mouseup", (e) => {
  const target = e.target;

  // Prevent handling mouseup if clicking on existing button
  if (target instanceof Element && target.closest("#feedback-button")) return;

  // Ignore clicks inside the feedback modal
  if (target instanceof Element && target.closest("#feedback-overlay")) return;

  const selection = window.getSelection();
  const parent = selection.anchorNode.parentElement;


  // Check if selection is inside <main>
  const main = parent.closest("main");
  if (!main) return; // not in main, ignore

  // Check if selection is in <h1> OR in a <div class="prose">
  const allowed = parent.closest("main h1, main div.prose");


  if (!allowed) return; // not in allowed area, ignore

  const text = selection.toString().trim();
  if (!text || text.length < 5) return;

  // Remove all existing buttons and popups immediately
  document.querySelectorAll("#feedback-button, #feedback-overlay").forEach(el => el.remove());

  // Clear any previous timeout
  clearTimeout(feedbackButtonTimeout);

  // Remove older button
  setTimeout(() => {
    const oldButton = document.getElementById("feedback-button");
    if (oldButton) oldButton.remove();
  }, 2000);

  // Delay creation slightly to avoid double-click flash
  feedbackMouseupTimeout = setTimeout(() => {
    // Remove existing buttons/popups

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Create floating button
    const button = document.createElement("button");
    button.id = "feedback-button";
    button.textContent = "💬 Suggest edit";
    button.style.position = "fixed";
    button.style.top = `${rect.bottom + 8}px`;
    button.style.left = `${rect.left }px`;
    button.style.zIndex = 9999;
    button.style.padding = "4px 8px";
    button.style.borderRadius = "6px";
    button.style.background = "#2563eb";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.fontSize = "0.85rem";
    button.style.opacity = "0";
    button.style.transition = "opacity 0.3s ease";

    document.body.appendChild(button);

    // Fade-in
    requestAnimationFrame(() => button.style.opacity = "1");

    // Function to remove button
    const hideButton = () => {
      button.style.opacity = "0";
      setTimeout(() => button.remove(), 600);
    };

    // Auto-hide after 2.5s
    feedbackButtonTimeout = setTimeout(hideButton, 2500);

    // Keep button visible while hovering
    button.addEventListener("mouseenter", () => clearTimeout(feedbackButtonTimeout));
    button.addEventListener("mouseleave", () => {
      feedbackButtonTimeout = setTimeout(hideButton, 1500); // short delay after leaving
    });

    button.addEventListener("click", () => {
      // Clear the auto-hide to prevent the button or modal from disappearing
      clearTimeout(feedbackButtonTimeout);

      // Remove button (optional)
      button.remove();

      // Show modal below the selected text, passing the selection
      showFeedbackModalBelow(text, window.getSelection());
    });
  }, 50); // 50ms debounce to prevent double-click flash

});

// Display centered feedback modal
function showFeedbackModalBelow(selectedText, selection) {
  const overlay = document.createElement("div");
  overlay.id = "feedback-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.4)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 10000;

  const mainBlock = document.querySelector("main"); // adjust selector to your content block
  const mainWidth = mainBlock ? mainBlock.offsetWidth : "501px"; // fallback width

  const modal = document.createElement("div");
  modal.style.background = "white";
  modal.style.padding = "1.5rem";
  modal.style.borderRadius = "10px";
  modal.style.maxWidth = mainWidth;
  modal.style.setProperty("max-width", mainWidth + "px", "important");
  modal.style.width = "80%";
  modal.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
  modal.className = "prose"; // keep Tailwind styles

  // Clone the selection
  let htmlFragment = "";
  if (selection && selection.rangeCount > 0) {
    const frag = selection.getRangeAt(0).cloneContents();
    const div = document.createElement("div");
    div.appendChild(frag);

    // Copy computed styles from each element recursively
    function getStyledSelectionHTML(selection) {
      if (!selection || selection.rangeCount === 0) return "";

      const frag = selection.getRangeAt(0).cloneContents();
      const container = document.createElement("div");

      // Special case for title
      const parent = selection.anchorNode?.parentElement;
      if (parent && /^H[1-6]$/.test(parent.tagName)) {
        const h1Clone = parent.cloneNode(true); // clone juste le H1
        container.appendChild(h1Clone);

        // Copy computed style
        const computed = window.getComputedStyle(parent);
        h1Clone.style.fontFamily = computed.fontFamily;
        h1Clone.style.fontSize = computed.fontSize;
        h1Clone.style.fontWeight = computed.fontWeight;
        h1Clone.style.color = computed.color;
        h1Clone.style.lineHeight = computed.lineHeight;

        return container.innerHTML;
      }

      container.appendChild(frag);

      // Copy basic styles from parent element
      if (parent) {
        const computed = window.getComputedStyle(parent);
        container.style.fontFamily = computed.fontFamily;
        container.style.fontSize = computed.fontSize;
        container.style.fontWeight = computed.fontWeight;
        container.style.color = computed.color;
        container.style.lineHeight = computed.lineHeight;
      }

      return container.innerHTML;
    }
    htmlFragment = getStyledSelectionHTML(selection);
  }

  modal.innerHTML = `
    <h3 style="margin-top:0;">💬 Suggest an edit</h3>

    <p style="font-size:0.9rem; color:#444;">Selected text (styled as in page):</p>
    <div style="background:#f9fafb; padding:0.5rem 0.75rem; border-left:3px solid #2563eb; margin:0 0 1rem;">
      ${htmlFragment}
    </div>

    <p style="font-size:0.9rem; color:#444;">Your suggestion:</p>
    <textarea id="feedback-text" placeholder="Your suggestion..." style="width:100%; height:100px; padding:0.5rem; border:1px solid #ccc; border-radius:6px; resize:vertical;">
${selection.toString().trim()}
    </textarea>

    <div style="margin-top:1rem; display:flex; justify-content:flex-end; gap:0.5rem;">
      <button id="cancel-feedback" style="background:#e5e7eb; border:none; padding:0.5rem 1rem; border-radius:6px; cursor:pointer;">Cancel</button>
      <button id="submit-feedback" style="background:#2563eb; color:white; border:none; padding:0.5rem 1rem; border-radius:6px; cursor:pointer;">Submit</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const feedbackInput = modal.querySelector("#feedback-text");
  feedbackInput.focus();

  // Close modal on cancel
  document.getElementById("cancel-feedback").onclick = () => overlay.remove();

  // Submit feedback (opens GitHub issue)
  document.getElementById("submit-feedback").onclick = () => {
    const feedback = feedbackInput.value.trim();
    if (!feedback) return alert("Please enter your suggestion!");

    // Use the selection only for anchor, fallback if lost
    const selection = window.getSelection();
    const anchor = getClosestAnchor(selection.anchorNode.parentElement);
    const url = window.location.href.split('#')[0] + anchor;

    const title = encodeURIComponent("Content feedback: " + document.title);
    const issueBaseUrl = typeof FEEDBACK_ISSUE_URL !== "undefined" ? FEEDBACK_ISSUE_URL : "https://github.com/platformsh/platformsh-docs/issues/new";
    const body = encodeURIComponent(
      `### 📝 Selected text
\`\`\`
${selectedText}
\`\`\`

### 💡 Suggestion
${feedback}

### 🌐 Page
${url}

### Template
${CURRENT_TEMPLATE}
`
    );

    const issueUrl = `${issueBaseUrl}?title=${title}&body=${body}`;
    window.open(issueUrl, "_blank");
    overlay.remove();
  };

  // Close modal on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.remove();
  });
}

function getClosestAnchor(element) {
  let current = element;
  while (current) {
    if (current.id) {
      return `#${current.id}`; // return fragment
    }
    current = current.parentElement;
  }
  return ""; // no anchor found
}
