/*jshint esversion: 6 */
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
const { exec } = require('child_process'); //normal exec
var Datastore = require('nedb')
    , db = new Datastore({ filename: './songs.db', autoload: true });

//Audio Decoders
let AV = require('av');
require('flac.js');
require('ogg.js');
require('opus.js');
require('vorbis.js');

let win;
const winwidth = 300;
const winheight = 75;
const projname = app.getName();

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
    const {dialog} = require('electron');
    let selectedfiles = dialog.showOpenDialog({
        filters: [
            {name: 'Audio Files', extensions: ['wav','flac','ogg','opus']}
            ],
        properties: ['openFile', 'multiSelections']
    });
    if(selectedfiles!=undefined) {
        for(let i=0;i<selectedfiles.length;i++) {
            selectedfiles[i] = { filelocation:selectedfiles[i], isRead:0 };
        }
        db.insert(selectedfiles, function (err, newDocs) {
            if(err!=null) {
                dialog.showMessageBox({ message: err });
            } else {
                for(let i=0;i<newDocs.length;i++) {
                    checkSongMetadata(newDocs[i].filelocation)
                        .then((result) => {
                            console.log(result);
                        })
                        .catch((e) => {
                            console.error('Failed to load audio file', e);
                        });
                    /*exec('mkdir -p ~/Documents/bbAMP/' + artist + '/');
                    exec('mkdir -p ~/Documents/bbAMP/' + artist + '/' + album + '/');
                    let newlocation = '~/Documents/bbAMP/' + artist + '/' + album + '/' + path.parse(filelocation).base;
                    copyMusicFile(filelocation,newlocation);*/
                }
            }
        });
    }
});

/*async function copyMusicFile(filelocation, newlocation) {
    const { stdout, stderr } = await exec('cp -r ' + filelocation + ' ' + newlocation);
}*/

function checkSongMetadata(filelocation) {
    return new Promise((resolve,reject) => {
        let fileext = path.extname(filelocation).toLowerCase();
        let songname = "Unknown";
        let artist = "Unknown";
        let album = "Unknown";
        let duration = 0;
        if((fileext==".flac") || (fileext==".ogg") || (fileext==".opus") || (fileext==".wav")) {
            checkSongDuration(filelocation,0)
                .then((result) => {
                    duration = result;
                    let asset = AV.Asset.fromFile(filelocation);
                    if(fileext==".wav") {
                        songname = path.parse(filelocation).base;
                        resolve({songname:songname,artist:artist,album:album,duration:duration});
                    } else {
                        asset.get('metadata', function(data) {
                            songname = data.title;
                            artist = data.artist;
                            album = data.album;
                            resolve({songname:songname,artist:artist,album:album,duration:duration});
                        });
                    }
                })
                .catch((e) => {
                    console.error('Failed to check duration', e);
                });
        } else if(fileext==".ape") {
            
        } else {
            reject('check failed');
        }
    });
}

function checkSongDuration(filelocation,checkmode) {
    return new Promise((resolve,reject) => {
        if(checkmode==0) {
            let asset = AV.Asset.fromFile(filelocation);
            asset.get('duration', function(data) {
                resolve(data)
            });
        } else if(checkmode==1) {

        } else {
            reject('check failed');
        }
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