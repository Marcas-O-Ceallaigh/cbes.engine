class CBESEngine {
  constructor() {
    this.rules = null;
  }

  // Load rules.json directly from your repository
  async init() {
    try {
      const response = await fetch('./rules.json');
      this.rules = await response.json();
      console.log('CBÉS Engine rules loaded successfully.');
    } catch (error) {
      console.error('Error loading rules.json:', error);
    }
  }

  // Primary function to process typed input
  transform(text) {
    if (!this.rules) return text;
    
    let output = text;

    // Example transformation handling standard ponc conversions
    // Add custom key mapping logic here based on your rules.json structure
    if (this.rules.poncMappings) {
      for (const [key, val] of Object.entries(this.rules.poncMappings)) {
        const regex = new RegExp(key, 'g');
        output = output.replace(regex, val);
      }
    }

    return output;
  }
}

const cbesEngine = new CBESEngine();
cbesEngine.init();