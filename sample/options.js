document.getElementById('optionsForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const blurIntensity = document.getElementById('blurIntensity').value;
  const regexPatterns = document.getElementById('regexPatterns').value;
  const enableBlurring = document.getElementById('enableBlurring').checked;

  chrome.storage.sync.set({
    blurIntensity: parseInt(blurIntensity),
    regexPatterns: regexPatterns,
    blurringEnabled: enableBlurring
  }, function () {
    alert('Settings saved');
  });
});

// Load saved settings
chrome.storage.sync.get(['blurIntensity', 'regexPatterns', 'blurringEnabled'], function (data) {
  document.getElementById('blurIntensity').value = data.blurIntensity || 5; // Default blur intensity
  document.getElementById('regexPatterns').value = data.regexPatterns || '';
  document.getElementById('enableBlurring').checked = data.blurringEnabled !== undefined ? data.blurringEnabled : true;
});
