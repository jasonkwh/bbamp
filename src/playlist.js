const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
const current_win = BrowserWindow.getFocusedWindow()

const closeBtn = document.getElementById('closebutton')

closeBtn.addEventListener('click', function(event) {
    current_win.close()
})