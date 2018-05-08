const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

const current_win = BrowserWindow.getFocusedWindow()
const playBtn = document.getElementById('playbutton')
const playlistBtn = document.getElementById('playlistbutton')

let win
var playlistwiny

document.onmouseup = (event) => {
    if(win!=null) {
        if(current_win.getPosition()[1]>(window.screen.height/2)) {
            playlistwiny = current_win.getPosition()[1] - 200
        } else {
            playlistwiny = current_win.getPosition()[1] + 75
        }
        win.setPosition(current_win.getPosition()[0],playlistwiny,false)
    }
}

playBtn.addEventListener('click', function(event) {

})

playlistBtn.addEventListener('click', function(event) {
    let pos = current_win.getPosition()
    console.log(pos[1])
    if(pos[1]>(window.screen.height/2)) {
        playlistwiny = pos[1] - 200
    } else {
        playlistwiny = pos[1] + 75
    }
    const modalPath = path.join('file://',__dirname,'playlist.html')
    if(win==null) {
        win = new BrowserWindow({
            width:300,
            height:200,
            frame:false,
            resizable:false,
            maximizable:false,
            backgroundColor:'#262626',
            titleBarStyle:'hidden',
            x:pos[0],
            y:playlistwiny
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