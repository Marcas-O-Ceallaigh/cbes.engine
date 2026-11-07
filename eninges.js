document.addEventListener("DOMContentLoaded", async () => {
    const editor = document.getElementById('editor');
    const output = document.getElementById('output');

    if (!editor || !output) return;

    let replacements = {};

    try {
        // Fetch your rules.json automatically
        const response = await fetch('rules.json');
        const data = await response.json();
        
        // Handle both formats: direct object map or your double_tap_replacements wrapper
        replacements = data.double_tap_replacements || data;
    } catch (error) {
        console.error("Could not load rules.json, falling back to empty map:", error);
    }

    // Listen for typing and apply replacements on the fly
    editor.addEventListener('input', () => {
        let text = editor.value;

        for (const [key, val] of Object.entries(replacements)) {
            text = text.replaceAll(key, val);
        }

        output.textContent = text;
    });
});