const compromise = require('compromise');

async function summarizeText(inputText) {
    // Tokenize input text using compromise
    const doc = compromise(inputText.toLowerCase());

    // Remove stop words specific to legal language
    const stopWords = new Set(['court', 'law', 'section', 'act', 'petition', 'legal', 'case']);
    doc.out(stopWords);

    // Extract significant terms
    const significantTerms = doc.terms().out('array');

    // Set the desired summary length (in terms of significant terms)
    const summaryLength = 16000;

    // Generate summary
    const summary = significantTerms.slice(0, summaryLength).join(' ');

    // Return the summary instead of logging
    return summary;
}

module.exports = summarizeText;
