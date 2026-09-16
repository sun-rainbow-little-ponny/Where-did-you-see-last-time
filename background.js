chrome.tabs.onUpdated.addListener(async (tab_id, change_info, tab) => {
    if (change_info.status !== "complete") { return; }

    let url = tab.url;

    // this tab is not an intra-system file
    if (!is_intra_url(url)) { return; }
    
    // inject content.js to the current page
    // and listen to the scroll event
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });

});


function is_intra_url(url) {
    return url.startsWith("file");
}


chrome.runtime.onMessage.addListener((msg, sender, send_response) => {
    if (msg.type !== "pos") { return; }

});


