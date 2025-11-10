chrome.runtime.onInstalled.addListener(function () {
  // Set default values
  chrome.storage.sync.set({
    blurringEnabled: true,
    blurIntensity: 5,
    regexPatterns: '',
    unblurOnHover: true,
    blurMode: 'selective'
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('mail.google.com')) {
    chrome.storage.sync.get(['blurringEnabled', 'blurIntensity', 'regexPatterns', 'unblurOnHover', 'blurMode'], function (data) {
      chrome.tabs.sendMessage(tabId, {
        blurringEnabled: data.blurringEnabled,
        blurIntensity: data.blurIntensity,
        regexPatterns: data.regexPatterns,
        unblurOnHover: data.unblurOnHover,
        blurMode: data.blurMode,
        from: "background"
      });
    });
  }
});
