const electron = require('electron')
const current_win = electron.remote.getCurrentWindow()

const closeBtn = document.getElementById('closebutton')

closeBtn.addEventListener('click', function(event) {
    current_win.close()
})