/*jshint esversion: 6 */
const {app, BrowserWindow, dialog} = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
let mm = require('music-metadata');
var Datastore = require('nedb')
    , db = new Datastore({ filename: './songs.db', autoload: true });

let win;
const winwidth = 300;
const winheight = 75;
let songname = "";
let artist = "";
let album = "";
let fileext = "";
let duration = 0;

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
            selectedfiles[i] = { recordtype:'playlist',filelocation:selectedfiles[i] };
        }
        db.insert(selectedfiles, function (err, newDocs) {
            if(err!=null) {
                console.error(err.message);
            } else {
                for(let i=0;i<newDocs.length;i++) {
                    songname = "Unknown";
                    artist = "Unknown";
                    album = "Unknown";
                    duration = "0:00.00";
                    mm.parseFile(newDocs[i].filelocation, {duration:true,native:true,skipCovers:true})
                        .then(function (metadata) {
                            fileext = path.extname(newDocs[i].filelocation).toLowerCase();
                            duration = convertSecondsToMMSS(metadata.format.duration);
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
                            updateDatabaseRecord(songname,album,artist,duration,newDocs[i]._id)
                                .then((result) => {
                                    console.log(result);
                                })
                                .catch((e) => {
                                    console.error(e);
                                });
                        })
                        .catch(function (err) {
                            console.error(err.message);
                            songname = path.basename(newDocs[i].filelocation);
                            updateDatabaseRecord(songname,album,artist,duration,newDocs[i]._id)
                                .then((result) => {
                                    console.log(result);
                                })
                                .catch((e) => {
                                    console.error(e);
                                });
                        });
                }
            }
        });
    }
});

function convertSecondsToMMSS(seconds) {
    let mins = parseInt(seconds/60);
    let secs = (seconds-(mins*60)).toFixed(2);
    return mins + ":" + secs;
}

function updateDatabaseRecord(songname,album,artist,duration,docsid) {
    return new Promise((resolve,reject) => {
        db.update({ _id: docsid }, { $set: { songname:songname,album:album,artist:artist,duration:duration } }, {}, function (err) {
            if(err!=null) {
                reject(err.message);
            } else {
                resolve("success");
            }
        });
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});