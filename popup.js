document.getElementById('lookupButton').addEventListener('click', () => {
    const eventId = document.getElementById('eventId').value.trim();
    if (eventId) {
        const queryUrl = `https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=${eventId}`;
        chrome.tabs.create({ url: queryUrl });
    } else {
        alert("Please enter a valid Event ID.");
    }
});
