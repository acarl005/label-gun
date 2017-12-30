/* global chrome */
const dataURLPattern = /data:image\/(\w+);/

// the main message listener
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  // a switch to handle potentially a bunch of different commands. right now "download" is the only one though
  switch (req.command) {
    case 'download':
      download(req, sendResponse)
      break
    default:
      throw new Error(`Unknown command: ${req.command}`)
  }
  // tells the content script we intend to send a response
  return true
})

function download(req, done) {
  const { imageURL, imageId, number } = req
  const mimetype = imageURL.match(dataURLPattern)[1]
  // hash the image itself and use this as a filename, this is a way to prevent duplicates
  const newFilename = md5(imageURL)
  chrome.downloads.download({
    url: imageURL,
    filename: `label-gun/${number}/${newFilename}.${mimetype}`,
    conflictAction: 'overwrite'
  }, () => done({ imageURL, imageId, number }))
}

