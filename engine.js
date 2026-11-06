document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor"); 
    const preview = document.getElementById("preview") || document.getElementById("glanchlo-preview");
    
    let rules = {};

    // Load rules.json
    fetch("rules.json")
        .then(response => response.json())
        .then(data => {
            rules = data;
            console.log("CBÉS Engine loaded successfully.");
        })
        .catch(error => console.error("Error loading rules.json:", error));

    if (editor) {
        editor.addEventListener("input", (e) => {
            // Skip deletion events
            if (e.inputType && e.inputType.startsWith("delete")) {
                updatePreview();
                return;
            }

            let cursorPos = editor.selectionStart;
            let text = editor.value;

            // Helper function to check and perform string swap
            function checkAndReplace(replacementMap) {
                if (!replacementMap) return false;
                
                for (const [trigger, replacement] of Object.entries(replacementMap)) {
                    let len = trigger.length;
                    if (cursorPos >= len) {
                        let sliceToCheck = text.slice(cursorPos - len, cursorPos);
                        if (sliceToCheck === trigger) {
                            let before = text.slice(0, cursorPos - len);
                            let after = text.slice(cursorPos);
                            
                            editor.value = before + replacement + after;
                            
                            let newPos = before.length + replacement.length;
                            editor.setSelectionRange(newPos, newPos);
                            return true;
                        }
                    }
                }
                return false;
            }

            // 1. Try triple-tap resets first (bbb -> bb)
            let replaced = checkAndReplace(rules.triple_tap_resets);
            
            // 2. If no triple-tap, try double-tap conversions (bb -> ḃ)
            if (!replaced) {
                checkAndReplace(rules.double_tap_replacements);
            }

            updatePreview();
        });
    }

    function updatePreview() {
        if (editor && preview) {
            preview.textContent = editor.value;
        }
    }
});
