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

ipc.on('addToDatabase', function (event, arg) {
    let selectedfiles = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    });
    if(selectedfiles!=undefined) {
        for(let i=0;i<selectedfiles.length;i++) {
            selectedfiles[i] = { recordtype:'playlist',filelocation:selectedfiles[i],songname:path.basename(selectedfiles[i]),album:"Unknown",artist:"Unknown",duration:"0:00.00" };
        }
        db.insert(selectedfiles, function (err, newDocs) {
            if(err!=null) {
                console.error(err.message);
            } else {
                for(let i=0;i<newDocs.length;i++) {
                    getSongMetadata(newDocs[i].filelocation)
                        .then((result) => {
                            updateDatabaseRecord(result.songname,result.album,result.artist,result.duration,newDocs[i]._id)
                                .then((result2) => {
                                    if(result2=="success") {
                                        event.sender.send('addToPlaylist',{id:newDocs[i]._id,filelocation:newDocs[i].filelocation,songname:result.songname,artist:result.artist,duration:result.duration});
                                    }
                                })
                                .catch((e) => {
                                    console.error(e.message);
                                });
                        })
                        .catch((e) => {
                            event.sender.send('addToPlaylist',{id:newDocs[i]._id,filelocation:newDocs[i].filelocation,songname:path.basename(newDocs[i].filelocation),artist:"Unknown",duration:"0:00.00"});
                            console.error(e.message);
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

function getSongMetadata(filelocation) {
    return new Promise((resolve,reject) => {
        let songname = "Unknown";
        let artist = "Unknown";
        let album = "Unknown";
        let duration = "0:00.00";
        let fileext = "";
        mm.parseFile(filelocation, {duration:true,native:true,skipCovers:true})
            .then(function (metadata) {
                fileext = path.extname(filelocation).toLowerCase();
                duration = convertSecondsToMMSS(metadata.format.duration);
                if(fileext==".wav" || fileext==".wave") {
                    songname = path.basename(filelocation);
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
                resolve({songname:songname,artist:artist,album:album,duration:duration});
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function updateDatabaseRecord(songname,album,artist,duration,docsid) {
    return new Promise((resolve,reject) => {
        db.update({ _id: docsid }, { $set: { songname:songname,album:album,artist:artist,duration:duration } }, {}, function (err) {
            if(err!=null) {
                reject(err);
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