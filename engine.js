document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor"); 
    const preview = document.getElementById("preview") || document.getElementById("glanchlo-preview");
    
    let rules = {};

    // Load rules.json asynchronously
    fetch("rules.json")
        .then(response => response.json())
        .then(data => {
            rules = data;
            console.log("CBÉS Engine double-tap rules loaded successfully.");
        })
        .catch(error => console.error("Error loading rules.json:", error));

    if (editor) {
        editor.addEventListener("input", (e) => {
            if (!e.inputType || e.inputType.startsWith("delete")) return;

            let cursorPos = editor.selectionStart;
            let text = editor.value;

            // 1. Check for triple-tap resets first (e.g., 'bbb' -> 'bb')
            if (rules.triple_tap_resets) {
                for (const [trigger, replacement] of Object.entries(rules.triple_tap_resets)) {
                    if (cursorPos >= trigger.length) {
                        let sliceToCheck = text.substring(cursorPos - trigger.length, cursorPos);
                        if (sliceToCheck === trigger) {
                            editor.value = text.substring(0, cursorPos - trigger.length) + replacement + text.substring(cursorPos);
                            let newCursorPos = cursorPos - (trigger.length - replacement.length);
                            editor.setSelectionRange(newCursorPos, newCursorPos);
                            updatePreview();
                            return;
                        }
                    }
                }
            }

            // 2. Check for double-tap dot conversions (e.g., 'bb' -> 'ḃ')
            if (rules.double_tap_replacements) {
                for (const [trigger, replacement] of Object.entries(rules.double_tap_replacements)) {
                    if (cursorPos >= trigger.length) {
                        let sliceToCheck = text.substring(cursorPos - trigger.length, cursorPos);
                        if (sliceToCheck === trigger) {
                            editor.value = text.substring(0, cursorPos - trigger.length) + replacement + text.substring(cursorPos);
                            let newCursorPos = cursorPos - (trigger.length - replacement.length);
                            editor.setSelectionRange(newCursorPos, newCursorPos);
                            updatePreview();
                            return;
                        }
                    }
                }
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
