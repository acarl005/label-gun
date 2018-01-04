const background = chrome.extension.getBackgroundPage()

checkbox = document.getElementById('label-gun-toggle')
checkbox.checked = !background.disabled
checkbox.addEventListener('change', e => {
  background.disabled = !e.target.checked
})

