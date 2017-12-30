/* global chrome */

// to get around CORS issues we need to send our requests through a proxy
const proxyURL = '//cors-anywhere.herokuapp.com/'
// we want data URLs instead of links
const dataURLPattern = /data:image\/\w+;/
// an identifier we assign to downloaded images
let id = 0

// keep track of which image is currently under the mouse
let selectedImage = null

// add a popup to the DOM to confirm afte a download
const popup = document.createElement('div')
popup.id = 'label-popup'
const container = document.createElement('div')
container.id = 'label-container'
popup.appendChild(container)
const classLabel = document.createElement('div')
classLabel.id = 'label-class'
container.appendChild(classLabel)
const imgPreview = document.createElement('img')
imgPreview.id = 'label-image'
container.appendChild(imgPreview)
document.body.appendChild(popup)

// keeps track of the timeout that hides the popup, we want to reset if another image is downloaded before the last popup goes away
let popupTimeout = null

$(document).ready(() => {
  // use these events to keep `selectedImage` updated
  $('body').on('mouseenter', 'img', e => {
    selectedImage = e.target
  })

  $('body').on('mouseleave', 'img', () => {
    selectedImage = null
  })

  // when a number key is pressed, trigger the download
  $('body').on('keypress', e => {
    if (isNumberKey(e.keyCode)) {
      const number = e.keyCode - 48
      download(selectedImage, number)
    }
  })
})

function isNumberKey(keyCode) {
  return 48 <= keyCode && keyCode <= 57
}

// start the download by determining if conversion to a data URL is required first
function download(image, number) {
  let url = image.src
  image.setAttribute('data-label-id', id++)
  image.classList.add('downloading')
  if (!dataURLPattern.test(url)) {
    toDataURL(image, number)
  } else {
    tellBackgroundToDownload(url, number, image.getAttribute('data-label-id'))
  }
}


// send message to content script to do the download
function tellBackgroundToDownload(url, number, id) {
  chrome.extension.sendMessage({
    command: 'download',
    imageURL: url,
    imageId: id,
    number
  }, onDownloadComplete)
}

// show the popup to confirm
function onDownloadComplete(resp) {
  const { imageURL, imageId, number } = resp
  // locate the image that triggered this download
  const img = $(`img[data-label-id=${resp.imageId}]`)
  img.removeClass('downloading')
  img.addClass(`downloaded downloaded-${number}`)
  // show the popup and add the image
  popup.classList.add('visible')
  imgPreview.src = imageURL
  classLabel.innerText = number
  if (popupTimeout) {
    clearTimeout(popupTimeout)
  }
  // hide the popup 3 secounds later
  popupTimeout = setTimeout(() => {
    popup.classList.remove('visible')
  }, 3000)
}

// convert image link to data URL
function toDataURL(image, number) {
  // create new image tag
  // this is necessary to add the cross origin property to get around CORS
  const newImage = document.createElement('img')
  newImage.crossOrigin = 'anonymous'
  // than draw to canvas after the image is fetched
  newImage.addEventListener('load', () => {
    const canvas = document.createElement('canvas')
    canvas.width = newImage.width
    canvas.height = newImage.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(newImage, 0, 0)
    tellBackgroundToDownload(canvas.toDataURL('image/jpg'), number, image.getAttribute('data-label-id'))
  })
  // prefix the URL with our proxy URL
  newImage.src = proxyURL + image.src
}

