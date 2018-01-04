/* global chrome */
const dataURLPattern = /data:image\/(\w+);/
const mimeTypePattern = /\.(png|jpe?g)\b/i

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
  // a global switch the the user can toggle to enable or disable the extension
  if (window.disabled) {
    return done({ imageURL, imageId, number })
  }
  const downloadOpts = {
    url: imageURL,
    conflictAction: 'overwrite'
  }
  if (dataURLPattern.test(imageURL)) {
    const mimetype = imageURL.match(dataURLPattern)[1]
    // hash the image itself and use this as a filename, this is a way to prevent duplicates
    const newFilename = md5(imageURL)
    downloadOpts.filename = `label-gun/${number}/${newFilename}.${mimetype}`
  } else {
    let filename = String(Date.now())
    if (mimeTypePattern.test(imageURL)) {
      filename += imageURL.match(mimeTypePattern)[0]
    }
    downloadOpts.filename = filename
  }
  chrome.downloads.download(downloadOpts, () => done({ imageURL, imageId, number, downloaded: true }))
}

