const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
const LOCAL_STORAGE_KEY = "quotes";
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        resolveConflicts(serverQuotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

// Post a new quote to mock server
async function postQuoteToServer(quote) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

// Sync function to check for updates periodically
async function syncQuotes() {
    await fetchQuotesFromServer();
    setInterval(fetchQuotesFromServer, 30000); // Fetch every 30 sec
}

// Conflict resolution: Server data takes precedence
function resolveConflicts(serverQuotes) {
    let mergedQuotes = [...quotes];
    serverQuotes.forEach(serverQuote => {
        if (!quotes.some(localQuote => localQuote.id === serverQuote.id)) {
            mergedQuotes.push(serverQuote);
        }
    });
    quotes = mergedQuotes;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
    notifyUser("Quotes synced with the server!");
}

// Notify user of updates
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "10px";
    notification.style.right = "10px";
    notification.style.background = "#28a745";
    notification.style.color = "white";
    notification.style.padding = "10px";
    notification.style.borderRadius = "5px";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize sync
syncQuotes();
