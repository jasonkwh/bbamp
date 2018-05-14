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
    document.getElementById('playlistcontent').innerHTML += '<tr id="' + arg.id + '"><input type="hidden" class="songlocation" value="' + arg.filelocation + '"><input type="hidden" class="songduration" value="' + arg.duration + '"><td class="playstatus"><i class="fas fa-play"></i></td><td style="text-align:left"><ul><li class="playlistsongname">' + arg.songname + '</li><li style="font-size:10px">' + arg.artist + '</li></ul></td><td>' + arg.duration.split('.')[0] + '</td></tr>';
});