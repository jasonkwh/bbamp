const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;

const playBtn = document.getElementById('playbutton');
const playlistBtn = document.getElementById('playlistbutton');

playBtn.addEventListener('click', function(event) {

});

playlistBtn.addEventListener('click', function(event) {
    const modalPath = path.join('file://',__dirname,'playlist.html');
    let win = new BrowserWindow({
        width:300,
        height:200,
        frame:false,
        resizable:false,
        maximizable:false,
        alwaysOnTop:true,
        backgroundColor:'#262626',
        titleBarStyle:'hidden'
    });
    win.on('close',function() { win = null });
    win.loadURL(modalPath);
    win.show();
});