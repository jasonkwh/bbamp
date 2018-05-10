const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const current_win = electron.remote.getCurrentWindow();
const playlistBtn = document.getElementById('playlistbutton');
const closeBtn = document.getElementById('closebutton');
let win;
const winwidth = 300;
const winheight = 250;
const curwinheight = 75;
let playlistwiny;
let songdisplaymode = 0;

function fadeIn(el, time) {
    el.style.display = "block";
    el.style.opacity = 0;
    let last = +new Date();
    let tick = function() {
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
    let last = new Date();
    let tick = function() {
        el.style.opacity = el.style.opacity - (new Date() - last) / time;
        last = new Date();

        if (el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
    el.style.display = "none";
}

setInterval(function(){ setSongDisplay(); }, 10000);
function setSongDisplay() {
    fadeOut(document.getElementById('songname'),500);
    fadeOut(document.getElementById('artist'),500);
    fadeIn(document.getElementById('songname'),500);
    fadeIn(document.getElementById('artist'),500);
    if(songdisplaymode==0) {
        document.getElementById('songname').innerHTML = '<i class="fas fa-play"></i>&nbsp;Now Playing';
        document.getElementById('artist').innerHTML = 'Song Name';
        songdisplaymode = 1;
    } else {
        document.getElementById('songname').innerHTML = 'Song Name';
        document.getElementById('artist').innerHTML = 'Artist';
        songdisplaymode = 0;
    }
}

document.onmouseup = (event) => {
    if(win!=null) {
        if(current_win.getPosition()[1]>(window.screen.height/2)) {
            playlistwiny = current_win.getPosition()[1] - winheight;
        } else {
            playlistwiny = current_win.getPosition()[1] + curwinheight;
        }
        win.setPosition(current_win.getPosition()[0],playlistwiny,false);
    }
};

document.onmouseenter = (event) => {
    fadeOut(document.getElementById('songinfo'),200);
    fadeIn(document.getElementById('controlbtnset'),200);
};

document.onmouseleave = (event) => {
    fadeOut(document.getElementById('controlbtnset'),200);
    fadeIn(document.getElementById('songinfo'),200);
};

closeBtn.addEventListener('click', function(event) {
    current_win.close();
});

playlistBtn.addEventListener('click', function(event) {
    let pos = current_win.getPosition();
    if(pos[1]>(window.screen.height/2)) {
        playlistwiny = pos[1] - winheight;
    } else {
        playlistwiny = pos[1] + curwinheight;
    }
    const modalPath = path.join('file://',__dirname,'playlist.html');
    if(win==null) {
        win = new BrowserWindow({
            frame:false,
            width:winwidth,
            height:winheight,
            resizable:false,
            maximizable:false,
            alwaysOnTop:true,
            backgroundColor:'#262626',
            x:pos[0],
            y:playlistwiny
        });
        win.on('close',function() {
            win = null;
        });
        win.webContents.openDevTools();
        win.loadURL(modalPath);
        win.show();
    } else {
        win.close();
    }
});