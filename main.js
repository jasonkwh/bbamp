/*jshint esversion: 6 */
const {app, BrowserWindow, dialog} = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
const { exec } = require('child_process');
var Datastore = require('nedb')
    , db = new Datastore({ filename: './songs.db', autoload: true });

//Audio Decoders
let AV = require('av');
let mm = require('music-metadata');
require('flac.js');
require('ogg.js');
require('opus.js');
require('vorbis.js');

let win;
const winwidth = 300;
const winheight = 75;
const projname = app.getName();
let songname = "";
let artist = "";
let album = "";
let fileext = "";
let duration = 0;

exec('mkdir -p ~/Documents/' + projname + '/');

function createWindow () {
    win = new BrowserWindow({
        frame:false,
        width:winwidth,
        height:winheight,
        resizable:false,
        maximizable:false,
        alwaysOnTop:true,
        backgroundColor:'#262626'
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
        app.quit();
    });
}

ipc.on('addToPlaylist', function (event, arg) {
    let selectedfiles = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    });
    if(selectedfiles!=undefined) {
        for(let i=0;i<selectedfiles.length;i++) {
            selectedfiles[i] = { filelocation:selectedfiles[i], isRead:0 };
        }
        db.insert(selectedfiles, function (err, newDocs) {
            if(err!=null) {
                console.error(err.message);
            } else {
                for(let i=0;i<newDocs.length;i++) {
                    songname = "Unknown";
                    artist = "Unknown";
                    album = "Unknown";
                    duration = 0;
                    mm.parseFile(newDocs[i].filelocation, {duration:true,native:true,skipCovers:true})
                        .then(function (metadata) {
                            fileext = path.extname(newDocs[i].filelocation).toLowerCase();
                            duration = metadata.format.duration;
                            if(fileext==".wav" || fileext==".wave") {
                                songname = path.basename(newDocs[i].filelocation);
                            } else {
                                if(metadata.common.title!=undefined) {
                                    songname = metadata.common.title;
                                }
                                if(metadata.common.album!=undefined) {
                                    album = metadata.common.album;
                                }
                                if(metadata.common.artist!=undefined) {
                                    artist = metadata.common.artist;
                                }
                            }
                        })
                        .catch(function (err) {
                            console.error(err.message);
                            fileext = path.extname(newDocs[i].filelocation).toLowerCase();
                            songname = path.basename(newDocs[i].filelocation);
                        });
                }
            }
        });
    }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});