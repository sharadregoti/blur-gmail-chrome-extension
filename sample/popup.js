document.getElementById('optionsForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const blurIntensity = parseInt(document.getElementById('blurIntensity').value);
  const blurringEnabled = document.getElementById("toggleButton").checked;
  const regexPatterns = document.getElementById('regexPatterns').value;
  const unblurOnHover = document.getElementById('unblurOnHover').checked;
  const blurMode = document.querySelector('input[name="blurMode"]:checked').value;

  chrome.storage.sync.set({
    blurIntensity: blurIntensity,
    blurringEnabled: blurringEnabled,
    regexPatterns: regexPatterns,
    unblurOnHover: unblurOnHover,
    blurMode: blurMode
  });

  // Notify content script to update blurring state
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      blurringEnabled: blurringEnabled,
      blurIntensity: blurIntensity,
      regexPatterns: regexPatterns,
      unblurOnHover: unblurOnHover,
      blurMode: blurMode,
      from: "popup"
    });
  });

  // Show feedback and close popup
  const button = document.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.textContent = 'Saved!';
  button.style.backgroundColor = '#4CAF50';

  setTimeout(() => {
    window.close(); // Close the popup
  }, 800);
});

// Handle toggle button changes
document.getElementById('toggleButton').addEventListener('change', function () {
  const blurringEnabled = this.checked;
  const blurIntensity = parseInt(document.getElementById('blurIntensity').value);
  const regexPatterns = document.getElementById('regexPatterns').value;
  const unblurOnHover = document.getElementById('unblurOnHover').checked;
  const blurMode = document.querySelector('input[name="blurMode"]:checked').value;

  chrome.storage.sync.set({ blurringEnabled: blurringEnabled });

  // Notify content script to update blurring state
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      blurringEnabled: blurringEnabled,
      blurIntensity: blurIntensity,
      regexPatterns: regexPatterns,
      unblurOnHover: unblurOnHover,
      blurMode: blurMode,
      from: "popup"
    });
  });
});

// Handle blur mode changes
document.addEventListener('change', function (e) {
  if (e.target.name === 'blurMode') {
    const patternsSection = document.getElementById('patternsSection');
    if (e.target.value === 'full') {
      patternsSection.style.display = 'none';
    } else {
      patternsSection.style.display = 'block';
    }
  }
});

// Handle close button
document.getElementById('closeButton').addEventListener('click', function () {
  window.close();
});

// Load saved settings
chrome.storage.sync.get(['blurIntensity', 'regexPatterns', 'blurringEnabled', 'unblurOnHover', 'blurMode'], function (data) {
  document.getElementById('blurIntensity').value = data.blurIntensity || 5;
  document.getElementById('regexPatterns').value = data.regexPatterns || '';
  document.getElementById('unblurOnHover').checked = data.unblurOnHover !== undefined ? data.unblurOnHover : true;

  // Set blur mode
  const blurMode = data.blurMode || 'selective';
  document.querySelector(`input[name="blurMode"][value="${blurMode}"]`).checked = true;

  // Show/hide patterns section based on mode
  const patternsSection = document.getElementById('patternsSection');
  if (blurMode === 'full') {
    patternsSection.style.display = 'none';
  } else {
    patternsSection.style.display = 'block';
  }

  if (data.blurringEnabled) {
    document.getElementById('toggleButton').setAttribute("checked", true);
  } else {
    document.getElementById('toggleButton').removeAttribute("checked");
  }
});