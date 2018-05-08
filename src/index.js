const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

const current_win = BrowserWindow.getFocusedWindow()
const playBtn = document.getElementById('playbutton')
const playlistBtn = document.getElementById('playlistbutton')

let win

document.onmouseup = (event) => {
    if(win!=null) {
        win.setPosition(current_win.getPosition()[0],current_win.getPosition()[1]+75,false)
    }
}

playBtn.addEventListener('click', function(event) {

})

playlistBtn.addEventListener('click', function(event) {
    let pos = current_win.getPosition()
    const modalPath = path.join('file://',__dirname,'playlist.html')
    if(win==null) {
        win = new BrowserWindow({
            width:300,
            height:200,
            frame:false,
            resizable:false,
            maximizable:false,
            alwaysOnTop:true,
            backgroundColor:'#262626',
            titleBarStyle:'hidden',
            x:pos[0],
            y:pos[1] + 75
        })
        win.on('close',function() {
            win = null
        })
        win.loadURL(modalPath)
        win.show()
    } else {
        win.close()
    }
})