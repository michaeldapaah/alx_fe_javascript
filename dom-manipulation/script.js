// Global quotes array. Load from localStorage if available; otherwise, use default quotes.
let quotes = [];
const localStorageKey = "quotes";

// Try to load quotes from local storage
if (localStorage.getItem(localStorageKey)) {
  try {
    quotes = JSON.parse(localStorage.getItem(localStorageKey));
  } catch (error) {
    console.error("Error parsing quotes from localStorage:", error);
    quotes = [];
  }
} 

// If no quotes are found, use these default ones.
if (quotes.length === 0) {
  quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspiration" },
    { text: "I think, therefore I am.", category: "Philosophy" }
  ];
  saveQuotes();
}

/**
 * Function: saveQuotes
 * Saves the current quotes array to local storage.
 */
function saveQuotes() {
  localStorage.setItem(localStorageKey, JSON.stringify(quotes));
}

/**
 * Function: showRandomQuote
 * Selects a random quote from the quotes array and displays it in the #quoteDisplay element.
 * Also saves the last viewed quote to session storage.
 */
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Display the quote and its category.
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>Category: ${quote.category}</p>`;

  // Save the displayed quote in session storage.
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));

  // Optionally update a session info element with the last viewed quote.
  updateSessionInfo();
}

/**
 * Function: updateSessionInfo
 * Displays session-specific data (last viewed quote) in the #sessionInfo element.
 */
function updateSessionInfo() {
  const sessionInfo = document.getElementById("sessionInfo");
  const lastViewed = sessionStorage.getItem("lastViewedQuote");

  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    sessionInfo.innerHTML = `<p><strong>Last Viewed Quote:</strong> "${quote.text}" (Category: ${quote.category})</p>`;
  }
}

/**
 * Function: addQuote
 * Retrieves input values, creates a new quote object, adds it to the quotes array,
 * saves the array to local storage, and updates the display.
 */
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const newText = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Add new quote and save to local storage.
  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  // Clear the inputs.
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  // Optionally show a new random quote.
  showRandomQuote();
}

/**
 * Function: exportQuotes
 * Exports the quotes array as a JSON file using Blob and URL.createObjectURL.
 */
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2); // Beautify JSON with indentation.
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger the download.
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();

  // Cleanup: remove the temporary link and revoke the object URL.
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Function: importFromJsonFile
 * Reads a JSON file from an input event, parses it, merges the quotes,
 * saves them to local storage, and notifies the user.
 */
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      // Validate that the imported data is an array
      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid file format: expected an array of quotes.");
      }

      // Merge imported quotes into the existing array.
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      // Optionally, show a new random quote after import.
      showRandomQuote();
    } catch (error) {
      alert("Error importing quotes: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Event Listeners and Initialization ---

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// Show an initial random quote when the page loads.
showRandomQuote();
