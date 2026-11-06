document.addEventListener("DOMContentLoaded", () => {

    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");

    let rules = {};

    // Load rules.json
    fetch("rules.json")
        .then(response => response.json())
        .then(data => {
            rules = data;
            console.log("CBÉS Engine loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading rules.json:", error);
        });

    editor.addEventListener("input", (e) => {

        // Ignore deletes for now
        if (e.inputType && e.inputType.startsWith("delete")) {
            updatePreview();
            return;
        }

        if (!rules.double_tap_replacements) {
            updatePreview();
            return;
        }

        let cursorPos = editor.selectionStart;
        let text = editor.value;

        for (const [trigger, replacement] of Object.entries(rules.double_tap_replacements)) {

            const len = trigger.length;

            if (cursorPos >= len) {

                const typed = text.slice(cursorPos - len, cursorPos);

                if (typed === trigger) {

                    const before = text.slice(0, cursorPos - len);
                    const after = text.slice(cursorPos);

                    editor.value = before + replacement + after;

                    const newPos = before.length + replacement.length;

                    editor.setSelectionRange(newPos, newPos);

                    break;
                }
            }
        }

        updatePreview();
    );

    function updatePreview() {
        preview.textContent = editor.value;
    }

    preview.textContent = "CBÉS loaded";
});
