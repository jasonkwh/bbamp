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
    ipc.send('addToPlaylist', 1);
});