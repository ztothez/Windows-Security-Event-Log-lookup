// Function to determine the event lookup URL based on the selected text
function getEventLookupUrl(eventId) {
    return `https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=${eventId}`;
}

// Function to create the context menu item
function createEventLookupMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "eventLookup",
            title: "Lookup Windows Event ID",
            contexts: ["selection"]
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error creating context menu:", chrome.runtime.lastError.message);
            } else {
                console.log("Context menu created successfully.");
            }
        });
    });
}

// Set up the context menu on extension installation and startup
chrome.runtime.onInstalled.addListener(createEventLookupMenu);
chrome.runtime.onStartup.addListener(createEventLookupMenu);

// Listener for when the context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // Ensure that the selection exists, the correct menu item is clicked, and the selection is numeric
    if (info.menuItemId === "eventLookup" && info.selectionText && /^\d+$/.test(info.selectionText.trim())) {
        // Get the selected text (assumed to be the Event ID)
        const eventId = info.selectionText.trim();
        const queryUrl = getEventLookupUrl(eventId);

        // Open a new tab with the constructed URL
        chrome.tabs.create({ url: queryUrl });
    } else if (info.menuItemId === "eventLookup") {
        console.warn("Please select a valid numeric Event ID.");
    }
});
