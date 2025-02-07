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
 * Also restores the last selected category from local storage when the page loads.
 */
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  
  // Clear existing options and add the default "All Categories" option.
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  // Use a Set to collect unique categories.
  const categories = new Set();
  quotes.forEach(quote => categories.add(quote.category));
  
  // Populate the dropdown with unique categories.
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore the last selected filter from local storage (if available).
  const savedFilter = localStorage.getItem(filterStorageKey);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

/**
 * filterQuotes()
 * Filters and displays quotes based on the selected category.
 * Saves the current filter selection to local storage.
 */
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  
  // Save the selected category in local storage.
  localStorage.setItem(filterStorageKey, selectedCategory);
  
  // Determine which quotes to display.
  let quotesToDisplay;
  if (selectedCategory === "all") {
    quotesToDisplay = quotes;
  } else {
    quotesToDisplay = quotes.filter(q => q.category === selectedCategory);
  }
  
  // Update the display using the Array.map method.
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for the selected category.</p>";
  } else {
    const html = quotesToDisplay
      .map(quote => {
        return `<div class="quoteItem">
                  <p>"${quote.text}"</p>
                  <p><em>Category: ${quote.category}</em></p>
                </div>`;
      })
      .join("");
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
  
  // Optionally, save this quote in session storage.
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

/**
 * addQuote()
 * Retrieves input values, creates a new quote object, adds it to the quotes array,
 * updates local storage, repopulates categories, and refreshes the displayed quotes.
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
  
  // Update the category filter dropdown and refresh displayed quotes.
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
 * updates local storage, repopulates categories, and notifies the user.
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
// SERVER SYNC & CONFLICT RESOLUTION FUNCTIONS
// ------------------------

/**
 * showNotification(message)
 * Displays a message to the user in a notification element.
 * If the element doesn't exist, it is created and styled.
 */
function showNotification(message) {
  let notificationElement = document.getElementById("notification");
  if (!notificationElement) {
    // Create a notification element if it doesn't exist.
    notificationElement = document.createElement("div");
    notificationElement.id = "notification";
    // Basic styling for the notification element.
    notificationElement.style.position = "fixed";
    notificationElement.style.bottom = "10px";
    notificationElement.style.right = "10px";
    notificationElement.style.backgroundColor = "#f8d7da";
    notificationElement.style.padding = "10px";
    notificationElement.style.border = "1px solid #f5c6cb";
    notificationElement.style.borderRadius = "5px";
    document.body.appendChild(notificationElement);
  }
  notificationElement.textContent = message;
  
  // Clear the notification after 5 seconds.
  setTimeout(() => {
    notificationElement.textContent = "";
  }, 5000);
}

/**
 * syncWithServer()
 * Simulates syncing local quote data with a server.
 * Uses JSONPlaceholder as a mock API to fetch server data.
 * Conflict Resolution: If the fetched data differs from local data, the server's data takes precedence.
 */
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(serverData => {
      // Simulate conversion: take the first 3 posts as server quotes.
      // For demonstration, we use the post title as the quote text and a fixed category "Server".
      const serverQuotes = serverData.slice(0, 3).map(item => {
        return { text: item.title, category: "Server" };
      });
      
      // Simple conflict resolution: if server data differs, update local quotes.
      if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        filterQuotes();
        showNotification("Data synced with server. Server data took precedence over local changes.");
      } else {
        showNotification("Data is already up-to-date with the server.");
      }
    })
    .catch(error => {
      console.error("Error syncing with server:", error);
      showNotification("Error syncing with server: " + error.message);
    });
}

// Periodically sync data with the server every 30 seconds.
setInterval(syncWithServer, 30000);

// Optional: If you have a manual "Sync Now" button in your HTML (with id="syncButton"), attach an event listener.
const syncButton = document.getElementById("syncButton");
if (syncButton) {
  syncButton.addEventListener("click", syncWithServer);
}

// ------------------------
// INITIALIZATION & EVENT LISTENERS
// ------------------------

// Populate the category filter dropdown and restore the last selected category on page load.
populateCategories();

// Apply the current filter (or default to all) on page load.
filterQuotes();

// Event listener for showing a random quote (from the currently filtered set).
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for adding a new quote.
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Event listener for exporting quotes.
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
