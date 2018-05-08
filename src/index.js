const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

const current_win = BrowserWindow.getFocusedWindow()
const playBtn = document.getElementById('playbutton')
const playlistBtn = document.getElementById('playlistbutton')

let win
let winwidth = 300
let winheight = 250
let curwinheight = 75
var playlistwiny

function fadeIn(el, time) {
    el.style.opacity = 0;
    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
}

function fadeOut(el, time) {
    el.style.opacity = 1;
    var last = new Date();
    var tick = function() {
        el.style.opacity = el.style.opacity - (new Date() - last) / time;
        last = new Date();

        if (el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
}

document.onmouseup = (event) => {
    if(win!=null) {
        if(current_win.getPosition()[1]>(window.screen.height/2)) {
            playlistwiny = current_win.getPosition()[1] - winheight
        } else {
            playlistwiny = current_win.getPosition()[1] + curwinheight
        }
        win.setPosition(current_win.getPosition()[0],playlistwiny,false)
    }
}

document.onmouseenter = (event) => {
    var el = document.getElementById('controlbtnset')
    fadeIn(el,200)
}

document.onmouseleave = (event) => {
    var el = document.getElementById('controlbtnset')
    fadeOut(el,200)
}

playBtn.addEventListener('click', function(event) {

})

playlistBtn.addEventListener('click', function(event) {
    let pos = current_win.getPosition()
    if(pos[1]>(window.screen.height/2)) {
        playlistwiny = pos[1] - winheight
    } else {
        playlistwiny = pos[1] + curwinheight
    }
    const modalPath = path.join('file://',__dirname,'playlist.html')
    if(win==null) {
        win = new BrowserWindow({
            width:winwidth,
            height:winheight,
            frame:false,
            resizable:false,
            maximizable:false,
            alwaysOnTop:true,
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