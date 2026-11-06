document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("editor"); // Make sure your textarea ID matches this
    let rules = {};

    // Load rules.json asynchronously
    fetch("rules.json")
        .then(response => response.json())
        .then(data => {
            rules = data;
            console.log("CBÉS Engine rules loaded successfully.");
        })
        .catch(error => console.error("Error loading rules.json:", error));

    // 1. Real-time typing replacement (e.g. typing 'bh' -> 'ḃ')
    if (textarea) {
        textarea.addEventListener("input", (e) => {
            if (!e.inputType || e.inputType.startsWith("delete")) return;
            if (!rules.digraph_replacements) return;

            let cursorPos = textarea.selectionStart;
            let text = textarea.value;

            // Check against digraph lenition rules
            for (const [trigger, replacement] of Object.entries(rules.digraph_replacements)) {
                if (cursorPos >= trigger.length) {
                    let sliceToCheck = text.substring(cursorPos - trigger.length, cursorPos);
                    if (sliceToCheck === trigger) {
                        textarea.value = text.substring(0, cursorPos - trigger.length) + replacement + text.substring(cursorPos);
                        let newCursorPos = cursorPos - (trigger.length - replacement.length);
                        textarea.setSelectionRange(newCursorPos, newCursorPos);
                        break;
                    }
                }
            }
        });
    }
});

// 2. Mobile long-press helpers (ready for your virtual keyboard buttons)
let touchTimer = null;

function handleTouchStart(char, keyElement, rulesData) {
    touchTimer = setTimeout(() => {
        if (!rulesData) return;
        const vowelRule = rulesData.vowels && rulesData.vowels[char];
        const consonantRule = rulesData.consonants && rulesData.consonants[char];

        if (vowelRule) {
            // Show menu with fada (primary) AND dotted vowel (secondary)
            if (typeof showPopupOptions === "function") {
                showPopupOptions(keyElement, vowelRule.options);
            }
        } else if (consonantRule) {
            // Show list for consonants (e.g. g -> ġ or ᵹ)
            if (typeof showPopupOptions === "function") {
                showPopupOptions(keyElement, consonantRule.longPress);
            }
        }
    }, 400); // 400ms long press delay
}

function handleTouchEnd() {
    clearTimeout(touchTimer);
}
