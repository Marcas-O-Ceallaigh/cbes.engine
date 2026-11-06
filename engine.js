document.addEventListener("DOMContentLoaded", () => {
    // Connect to your text inputs/preview boxes
    const editor = document.getElementById("editor"); 
    const preview = document.getElementById("preview") || document.getElementById("glanchlo-preview");
    
    let rules = {};

    // Load rules.json asynchronously
    fetch("rules.json")
        .then(response => response.json())
        .then(data => {
            rules = data;
            console.log("CBÉS Engine rules loaded successfully.");
        })
        .catch(error => console.error("Error loading rules.json:", error));

    // Live typing mirror (updates your Glanchló preview box in real time)
    if (editor && preview) {
        editor.addEventListener("input", () => {
            preview.textContent = editor.value;
        });
    }
});

// Mobile long-press helpers for your on-screen keyboard buttons
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
