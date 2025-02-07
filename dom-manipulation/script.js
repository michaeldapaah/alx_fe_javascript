// ------------------------
// GLOBAL VARIABLES & INITIALIZATION
// ------------------------
let quotes = [];
const quotesStorageKey = "quotes";
const filterStorageKey = "selectedCategoryFilter";

// Attempt to load quotes from local storage.
if (localStorage.getItem(quotesStorageKey)) {
  try {
    quotes = JSON.parse(localStorage.getItem(quotesStorageKey));
  } catch (error) {
    console.error("Error parsing quotes from localStorage:", error);
    quotes = [];
  }
}

// If no quotes are stored, initialize with some default quotes.
if (quotes.length === 0) {
  quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspiration" },
    { text: "I think, therefore I am.", category: "Philosophy" }
  ];
  saveQuotes();
}

// ------------------------
// UTILITY FUNCTIONS
// ------------------------

/**
 * saveQuotes()
 * Saves the quotes array to local storage.
 */
function saveQuotes() {
  localStorage.setItem(quotesStorageKey, JSON.stringify(quotes));
}

/**
 * populateCategories()
 * Extracts unique categories from the quotes array and populates the filter dropdown.
 * Restores the last selected category filter from local storage if available.
 */
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  // Clear existing options and add the default "All Categories" option.
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  // Use a Set to collect unique categories.
  const categories = new Set();
  quotes.forEach(quote => categories.add(quote.category));
  
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore the last selected filter if it exists.
  const savedFilter = localStorage.getItem(filterStorageKey);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

/**
 * filterQuotes()
 * Filters and displays quotes based on the selected category.
 * Also saves the current filter selection to local storage.
 */
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  
  // Save the selected category in local storage.
  localStorage.setItem(filterStorageKey, selectedCategory);
  
  // Determine the quotes to display.
  let quotesToDisplay;
  if (selectedCategory === "all") {
    quotesToDisplay = quotes;
  } else {
    quotesToDisplay = quotes.filter(q => q.category === selectedCategory);
  }
  
  // Update the display.
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for the selected category.</p>";
  } else {
    // Display all matching quotes.
    let html = "";
    quotesToDisplay.forEach(quote => {
      html += `<div class="quoteItem">
                <p>"${quote.text}"</p>
                <p><em>Category: ${quote.category}</em></p>
              </div>`;
    });
    quoteDisplay.innerHTML = html;
  }
}

/**
 * showRandomQuote()
 * Displays a random quote. If a category filter is selected, chooses randomly
 * from the filtered set.
 */
function showRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  
  // Choose from either all quotes or the filtered list.
  let availableQuotes = (selectedCategory === "all") ?
    quotes :
    quotes.filter(q => q.category === selectedCategory);
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  
  if (availableQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];
  
  // Display the randomly selected quote.
  quoteDisplay.innerHTML = `<div class="quoteItem">
                              <p>"${quote.text}"</p>
                              <p><em>Category: ${quote.category}</em></p>
                            </div>`;
  
  // Save this quote in session storage (optional session data).
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

/**
 * addQuote()
 * Retrieves input values, creates a new quote object, adds it to the quotes array,
 * updates local storage, repopulates categories, and refreshes the display.
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
  
  // Add the new quote.
  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  
  // Clear the input fields.
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";
  
  // Update the filter dropdown and refresh displayed quotes.
  populateCategories();
  filterQuotes();
}

/**
 * exportQuotes()
 * Exports the quotes array as a JSON file using Blob and URL.createObjectURL.
 */
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * importFromJsonFile(event)
 * Reads a JSON file, parses its content, merges the imported quotes with the existing array,
 * updates local storage, repopulates the categories, and notifies the user.
 */
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid file format: expected an array of quotes.");
      }
      
      // Merge imported quotes into the existing array.
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      
      // Update the categories and refresh the display.
      populateCategories();
      filterQuotes();
    } catch (error) {
      alert("Error importing quotes: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ------------------------
// INITIALIZATION & EVENT LISTENERS
// ------------------------

// Populate the category filter dropdown on load.
populateCategories();

// Apply the current filter (or default to all) on page load.
filterQuotes();

// Event listener for showing a random quote (from the currently filtered set).
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for adding a new quote.
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Event listener for exporting quotes.
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
