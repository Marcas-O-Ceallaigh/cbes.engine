document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById('editor');
    const output = document.getElementById('output');

    if (!editor || !output) return;

    // Direct rules map — no fetch() needed, immune to CORS/path bugs!
    const replacements = {
        "bb": "ḃ", "cc": "ċ", "dd": "ḋ", "ff": "ḟ", "gg": "ġ",
        "mm": "ṁ", "pp": "ṗ", "ss": "ṡ", "tt": "ṫ", "ii": "ı",
        "aa": "ȧ", "ee": "ė", "oo": "ȯ", "uu": "u̇",
        "BB": "Ḃ", "CC": "Ċ", "DD": "Ḋ", "FF": "Ḟ", "GG": "Ġ",
        "MM": "Ṁ", "PP": "Ṗ", "SS": "Ṡ", "TT": "Ṫ"
    };

    editor.addEventListener('input', () => {
        let text = editor.value;

        for (const [key, val] of Object.entries(replacements)) {
            text = text.replaceAll(key, val);
        }

        output.textContent = text;
    });
});
