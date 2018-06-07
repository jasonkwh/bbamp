/*jshint esversion: 6 */
const electron = require('electron');
const ipc = electron.ipcRenderer;
const current_win = electron.remote.getCurrentWindow();
const Sortable = require('sortablejs');
const closeBtn = document.getElementById('closebutton');
const addPlaylistBtn = document.getElementById('playlistbtn');
const { exec } = require('child_process');
const list = document.getElementById("playlisttable");
Sortable.create(list, {
    animation: 300
});

closeBtn.addEventListener('click', function(event) {
    current_win.close();
});

addPlaylistBtn.addEventListener('click', function(event) {
    ipc.send('addToDatabase', 1);
});

ipc.on('addToPlaylist', function(event,arg) {
    document.getElementById('playlisttable').innerHTML += '<li id="' + arg.id + '" class="playlistitem" onclick="playthisfile(this)" title="Drag to change order"><input type="hidden" class="songlocation" value="' + arg.filelocation + '"><input type="hidden" class="songduration" value="' + arg.duration + '"><table style="width:305px"><tr><td class="playstatus" style="width:40px"><i class="fas fa-play"></i></td><td style="text-align:left;width:220px"><table><tr style="line-height:13px"><td class="playlistsongname">' + arg.songname + '</td></tr><tr style="line-height:13px"><td style="font-size:10px">' + arg.artist + '</td></tr></table></td><td style="width:40px">' + arg.duration.split('.')[0] + '</td></tr></table></li>';
});

let playprocess = null;
function playthisfile(e) {
    if(playprocess!=null) {
        playprocess.kill();
    }
    playprocess = exec('binaries/ffplay ' + e.getElementsByClassName('songlocation')[0].value + ' -nodisp -hide_banner', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}