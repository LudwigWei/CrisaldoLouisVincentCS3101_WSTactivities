document.addEventListener('DOMContentLoaded', function() {
    // Reference to the textarea and display elements.
    const textInput = document.getElementById('textInput');
    const wordCount = document.getElementById('wordCount');
    const sentenceCount = document.getElementById('sentenceCount');

    // Event listener to update counts whenever input changes.
    textInput.addEventListener('input', function() {
        // Retrieve and trim the input text
        const text = textInput.value.trim();

        // Word Count Calculation.
        // Splits by whitespace, then filters out empty strings.
        const words = text.split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = `Words: ${words.length}`;

        // Sentence Count Calculation.
        // Splits by punctuation (., !, ?), then filters out empty strings.
        const sentences = text.split(/[.!?]+(?=\s|$)/).filter(sentence => sentence.length > 0);
        sentenceCount.textContent = `Sentences: ${sentences.length}`;
    });
});
