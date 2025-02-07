const quotes = JSON.parse(localStorage.getItem("quotes")) || [];

async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        resolveConflicts(data);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

async function postQuoteToServer(quote) {
    try {
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

function resolveConflicts(serverQuotes) {
    localStorage.setItem("quotes", JSON.stringify(serverQuotes));
    notifyUser("Quotes synced with server!");
}

function notifyUser(message) {
    alert(message);
}

async function syncQuotes() {
    await fetchQuotesFromServer();
}

setInterval(syncQuotes, 30000);

document.addEventListener("DOMContentLoaded", syncQuotes);
