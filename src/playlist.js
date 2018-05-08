const electron = require('electron')
const current_win = electron.remote.getCurrentWindow()
const ipc = electron.ipcRenderer
const closeBtn = document.getElementById('closebutton')

closeBtn.addEventListener('click', function(event) {
    current_win.close()
})