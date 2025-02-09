async function EncodeInput(input, options = {}) {
    // Default options
    const {
        trim = true, // Trim spaces from start and end
        removeMultipleSpaces = true, // Replace multiple spaces with a single space
        removeSpecialChars = false, // Remove special characters
        toLowerCase = false, // Convert to lowercase
        toUpperCase = false, // Convert to uppercase
        maxLength = null, // Truncate to a maximum length
        replaceDelimiters = null, // Replace specific delimiters with a custom character
        urlSafe = true, // Ensure URL-safe encoding
    } = options;

    // Handle non-string inputs
    if (typeof input !== 'string') {
        input = String(input);
    }

    // Trim spaces from the beginning and end
    if (trim) {
        input = input.trim();
    }

    // Replace multiple spaces with a single space
    if (removeMultipleSpaces) {
        input = input.replace(/\s+/g, ' ');
    }

    // Remove special characters (optional)
    if (removeSpecialChars) {
        input = input.replace(/[^\w\s-]/g, ''); // Keep alphanumeric, spaces, and hyphens
    }

    // Convert to lowercase or uppercase
    if (toLowerCase) {
        input = input.toLowerCase();
    } else if (toUpperCase) {
        input = input.toUpperCase();
    }

    // Truncate to a maximum length
    if (maxLength && input.length > maxLength) {
        input = input.substring(0, maxLength);
    }

    // Replace specific delimiters
    if (replaceDelimiters && typeof replaceDelimiters === 'object') {
        for (const [delimiter, replacement] of Object.entries(replaceDelimiters)) {
            input = input.split(delimiter).join(replacement);
        }
    }

    // Encode the URI component
    let encodedInput = encodeURIComponent(input);

    // Ensure URL-safe encoding
    if (urlSafe) {
        encodedInput = encodedInput
            .replace(/\+/g, '-') // Replace + with -
            .replace(/\//g, '_') // Replace / with _
            .replace(/=/g, ''); // Remove = signs
    }

    return encodedInput;
}

module.exports = { EncodeInput };