/*jshint esversion: 6 */
const electron = require('electron');
const ipc = electron.ipcRenderer;
const current_win = electron.remote.getCurrentWindow();
const closeBtn = document.getElementById('closebutton');
const addPlaylistBtn = document.getElementById('playlistbtn');

closeBtn.addEventListener('click', function(event) {
    current_win.close();
});

addPlaylistBtn.addEventListener('click', function(event) {
    ipc.send('addToDatabase', 1);
});

ipc.on('addToPlaylist', function(event,arg) {
    document.getElementById('playlisttable').innerHTML += '<li id="' + arg.id + '"><input type="hidden" class="songlocation" value="' + arg.filelocation + '"><input type="hidden" class="songduration" value="' + arg.duration + '"><table style="width:300px;margin-left:-45px"><tr><td class="playstatus" style="width:40px"><i class="fas fa-play"></i></td><td style="text-align:left;width:220px"><ul><li class="playlistsongname">' + arg.songname + '</li><li style="font-size:10px">' + arg.artist + '</li></ul></td><td style="width:40px">' + arg.duration.split('.')[0] + '</td></tr></table></li>';
});