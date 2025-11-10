window.onload = function () {
  // Function to blur email content
  function addBlur(element, blurIntensity) {
    return function () {
      element.style.filter = `blur(${blurIntensity}px)`;
    };
  }

  function removeBlur(element) {
    return function () {
      element.style.filter = 'none';
    };
  }

  // Store references to event listeners
  const eventListeners = new Map();

  // Function to check if email should be blurred
  function shouldBlurEmail(emailElement, regexPatterns, blurMode) {
    // If full blur mode, blur everything
    if (blurMode === 'full') {
      return true;
    }

    // If selective blur mode, check patterns
    if (!regexPatterns || regexPatterns.trim() === '') {
      return false; // No patterns configured, don't blur anything
    }

    // Get the text content of the email row
    const emailText = emailElement.textContent || emailElement.innerText || '';

    // Split patterns by comma and trim whitespace
    const patterns = regexPatterns.split(',').map(p => p.trim()).filter(p => p.length > 0);

    // Check if any pattern matches
    for (const pattern of patterns) {
      try {
        const regex = new RegExp(pattern, 'i'); // Case insensitive matching
        if (regex.test(emailText)) {
          return true;
        }
      } catch (e) {
        // Invalid regex pattern, skip it
        console.warn('Invalid regex pattern:', pattern, e);
      }
    }

    return false;
  }

  // Function to toggle blurring
  function toggleBlurring(enable, blurIntensity = 5, regexPatterns = '', unblurOnHover = true, blurMode = 'selective') {
    const emails = document.querySelectorAll('.UI tr');

    emails.forEach(email => {
      // Remove existing listeners if any
      if (eventListeners.has(email)) {
        const { blurHandler, removeHandler } = eventListeners.get(email);
        email.removeEventListener('mouseenter', removeHandler);
        email.removeEventListener('mouseleave', blurHandler);
        eventListeners.delete(email);
      }

      // Remove any existing blur
      removeBlur(email)();

      if (enable && shouldBlurEmail(email, regexPatterns, blurMode)) {
        // Add hover listeners only if unblurOnHover is enabled
        if (unblurOnHover) {
          const blurHandler = addBlur(email, blurIntensity);
          const removeHandler = removeBlur(email);
          email.addEventListener('mouseenter', removeHandler);
          email.addEventListener('mouseleave', blurHandler);
          eventListeners.set(email, { blurHandler, removeHandler });
        }

        // Apply initial blur
        addBlur(email, blurIntensity)();
      }
    });
  }

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector(".UI");

  if (targetNode) {
    const observer = new MutationObserver(() => {
      chrome.storage.sync.get(['blurIntensity', 'blurringEnabled', 'regexPatterns', 'unblurOnHover', 'blurMode'], function (data) {
        const blurIntensity = data.blurIntensity || 5; // Default blur intensity
        const blurringEnabled = data.blurringEnabled !== undefined ? data.blurringEnabled : true; // Default blurring enabled
        const regexPatterns = data.regexPatterns || '';
        const unblurOnHover = data.unblurOnHover !== undefined ? data.unblurOnHover : true; // Default hover enabled
        const blurMode = data.blurMode || 'selective'; // Default to selective blur

        toggleBlurring(blurringEnabled, blurIntensity, regexPatterns, unblurOnHover, blurMode);
      });
    });
    observer.observe(targetNode, { childList: true, subtree: true });

    // Initial load
    chrome.storage.sync.get(['blurIntensity', 'blurringEnabled', 'regexPatterns', 'unblurOnHover', 'blurMode'], function (data) {
      const blurIntensity = data.blurIntensity || 5;
      const blurringEnabled = data.blurringEnabled !== undefined ? data.blurringEnabled : true;
      const regexPatterns = data.regexPatterns || '';
      const unblurOnHover = data.unblurOnHover !== undefined ? data.unblurOnHover : true;
      const blurMode = data.blurMode || 'selective';

      toggleBlurring(blurringEnabled, blurIntensity, regexPatterns, unblurOnHover, blurMode);
    });
  }

  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    toggleBlurring(message.blurringEnabled, message.blurIntensity, message.regexPatterns, message.unblurOnHover, message.blurMode);
  });
};
