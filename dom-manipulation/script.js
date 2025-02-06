// An array of quote objects with text and category properties.
const quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspiration" },
  { text: "I think, therefore I am.", category: "Philosophy" }
];

/**
 * Function: showRandomQuote
 * Selects a random quote from the quotes array and displays it in the #quoteDisplay element.
 */
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // If there are no quotes, display a fallback message.
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  
  // Get a random index and use it to pick a quote.
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Update the DOM with the selected quote and its category.
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>Category: ${quote.category}</p>`;
}

/**
 * Function: createAddQuoteForm
 * Dynamically creates a simple form that lets users add a new quote and its category.
 */
function createAddQuoteForm() {
  // Create a container div for the form.
  const formContainer = document.createElement("div");

  // Set the inner HTML of the form container.
  formContainer.innerHTML = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  // Append the form to the body (or any other container you prefer).
  document.body.appendChild(formContainer);

  // Attach an event listener to the "Add Quote" button.
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

/**
 * Function: addQuote
 * Retrieves the input values from the form, creates a new quote object, adds it to the quotes array,
 * and updates the display.
 */
function addQuote() {
  // Get the input elements.
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  // Trim the input values to remove extra spaces.
  const newText = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  // Ensure that both fields are filled.
  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Create a new quote object and add it to the quotes array.
  quotes.push({ text: newText, category: newCategory });

  // Clear the input fields.
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  // Optionally, display the newly added quote immediately.
  showRandomQuote();
}

// --- Event Listeners and Initialization ---

// Attach the event listener to the "Show New Quote" button.
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// When the page loads, display an initial random quote.
showRandomQuote();

// Dynamically create the add quote form.
createAddQuoteForm();
