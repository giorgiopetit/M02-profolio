(() => {
    const root = document.documentElement;
    const minimumTextSize = 16;
    const maximumTextSize = 24;
    const defaultTextSize = 16;

    const readPreference = (key) => {
        try {
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    };

    const savePreference = (key, value) => {
        try {
            window.localStorage.setItem(key, value);
        } catch {
            return;
        }
    };

    const savedTextSize = Number(readPreference("portfolio-text-size"));
    let textSize = Number.isFinite(savedTextSize)
        && savedTextSize >= minimumTextSize
        && savedTextSize <= maximumTextSize
        ? savedTextSize
        : defaultTextSize;
    let highContrast = readPreference("portfolio-high-contrast") === "true";

    const widget = document.createElement("aside");
    widget.className = "accessibility-tools";
    widget.setAttribute("aria-label", "Accessibility options");
    widget.innerHTML = `
        <button type="button" id="accessibility-toggle" aria-expanded="false" aria-controls="accessibility-panel">Accessibility</button>
        <div class="accessibility-panel" id="accessibility-panel" hidden>
            <p id="text-size-label">Text size</p>
            <div role="group" aria-labelledby="text-size-label">
                <button type="button" id="text-smaller" aria-label="Decrease text size">A-</button>
                <button type="button" id="text-larger" aria-label="Increase text size">A+</button>
                <button type="button" id="text-reset">Reset text</button>
            </div>
            <button type="button" id="contrast-toggle" aria-pressed="false">High contrast</button>
        </div>
        <span class="visually-hidden" id="accessibility-status" role="status" aria-live="polite"></span>
    `;

    const navPlaceholder = document.getElementById("nav-placeholder");
    if (navPlaceholder) {
        navPlaceholder.insertAdjacentElement("afterend", widget);
    } else {
        document.body.prepend(widget);
    }

    const panel = document.getElementById("accessibility-panel");
    const toggle = document.getElementById("accessibility-toggle");
    const contrastButton = document.getElementById("contrast-toggle");
    const status = document.getElementById("accessibility-status");

    const applyTextSize = () => {
        root.style.fontSize = `${textSize}px`;
        savePreference("portfolio-text-size", String(textSize));
    };

    const applyContrast = () => {
        root.dataset.highContrast = String(highContrast);
        contrastButton.setAttribute("aria-pressed", String(highContrast));
        savePreference("portfolio-high-contrast", String(highContrast));
    };

    applyTextSize();
    applyContrast();

    toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isExpanded));
        panel.hidden = isExpanded;
    });

    document.getElementById("text-smaller").addEventListener("click", () => {
        textSize = Math.max(minimumTextSize, textSize - 2);
        applyTextSize();
        status.textContent = `Text size ${textSize} pixels.`;
    });

    document.getElementById("text-larger").addEventListener("click", () => {
        textSize = Math.min(maximumTextSize, textSize + 2);
        applyTextSize();
        status.textContent = `Text size ${textSize} pixels.`;
    });

    document.getElementById("text-reset").addEventListener("click", () => {
        textSize = defaultTextSize;
        applyTextSize();
        status.textContent = "Text size reset to default.";
    });

    contrastButton.addEventListener("click", () => {
        highContrast = !highContrast;
        applyContrast();
        status.textContent = highContrast ? "High contrast enabled." : "High contrast disabled.";
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            panel.hidden = true;
            toggle.setAttribute("aria-expanded", "false");
            toggle.focus();
        }
    });
})();