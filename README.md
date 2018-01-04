Label Gun
================

A tool for accumulating labelled images from the web for machine learning.

This is a Chrome Extension which provides functionality for super quick labelled downloads.
Collecting image data for machine learning sucks, especially if you have to click around in the browser.
This tool should help make it faster and suck a lot less.

## How it works

After installing, simply go to a web page, hover over the image you want, and press a number key.
The number is the "classification".
You should see this image appear inside `Downloads/label-gun`.
The file name should include the MD5 hash to prevent duplicates.
You should also see confirmation of download in the lower left hand corner of the page.

![demo](images/demo.gif)

## Installation

Not in the chrome web store yet. You'll have to download the code, enable Chrome's developer mode in `chrome://extensions`, and install the extension manually.

### Warning

If you happen to have [Vimium](https://github.com/philc/vimium) installed, it will block the keypress events on the number keys that Label Gun looks for.

