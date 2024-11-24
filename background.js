// Create a context menu item that appears when text is selected
browser.contextMenus.create({
    id: "lookupWindowsEvent",
    title: "Lookup Windows Event ID",
    contexts: ["selection"]
});

// Listener for when the context menu item is clicked
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookupWindowsEvent" && info.selectionText) {
        // Get the selected text (assumed to be the Event ID)
        const eventId = info.selectionText.trim();
        const queryUrl = `https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=${eventId}`;
        
        // Open a new tab with the constructed URL
        browser.tabs.create({ url: queryUrl });
    }
});
