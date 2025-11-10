# Gmail Selective Blur Extension

A Chrome extension that selectively blurs Gmail messages based on configurable regex patterns to protect sensitive content when working in public spaces.

## Features

- **Selective Blurring**: Only blur messages that match your configured patterns
- **Regex Support**: Use powerful regular expressions to define what should be blurred
- **Hover to Reveal**: Blurred messages become clear when you hover over them
- **Customizable Intensity**: Adjust blur intensity from 1-20px
- **Easy Toggle**: Quick on/off toggle in the popup

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `sample` folder
5. The extension should now appear in your Chrome toolbar

## Usage

### Setting Up Regex Patterns

1. Click the extension icon in your Chrome toolbar
2. Right-click and select "Options" to open the options page
3. In the "Regex Patterns" field, enter comma-separated patterns:

**Examples:**
- `urgent` - Blurs messages containing the word "urgent"
- `confidential,private,sensitive` - Blurs messages with any of these words
- `bank.*statement` - Blurs messages containing "bank" followed by "statement"
- `\d{4}-\d{4}-\d{4}` - Blurs messages with credit card-like number patterns
- `(?i)invoice` - Case-insensitive match for "invoice"

### Quick Controls

Use the popup (click the extension icon) to:
- Toggle blurring on/off
- Adjust blur intensity (1-20px)
- Save settings

## How It Works

The extension:
1. Monitors Gmail inbox for email list items
2. Checks each email's text content against your regex patterns
3. Applies blur effect only to matching emails
4. Removes blur on hover for easy reading
5. Reapplies blur when mouse leaves the email

## Regex Pattern Tips

- Patterns are case-insensitive by default
- Use `.*` for wildcard matching (e.g., `meeting.*tomorrow`)
- Use `\d` for digits, `\w` for word characters
- Escape special characters with backslash: `\$`, `\.`, `\(`
- Test your patterns at [regex101.com](https://regex101.com) before adding them

## Privacy & Security

- All settings are stored locally in your browser
- No data is sent to external servers
- Extension only works on mail.google.com
- Patterns are processed entirely on your device

## Troubleshooting

- **Not working on Gmail**: Make sure you're on mail.google.com (not the basic HTML view)
- **Patterns not matching**: Check regex syntax and test at regex101.com
- **Extension not loading**: Verify Developer mode is enabled in Chrome extensions

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `content.js` - Main logic for detecting and blurring emails
- `options.html/js` - Configuration interface
- `popup.html/js` - Quick controls interface
- `background.js` - Service worker for extension lifecycle

## License

This extension is provided as-is for personal use. Modify and distribute as needed.# blur-gmail-chrome-extension
