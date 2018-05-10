/*jshint esversion: 6 */
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');
const shell = require('electron').shell;
const ipc = require('electron').ipcMain;
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

    let menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'About bbAMP',
                    click() {
                        shell.openExternal('https://github.com/jasonkwh');
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Open an Audio File',
                    click() {
                        AV.Player.fromFile('output.wav').play();
                    }
                },
                {
                    label: 'Quit',
                    click() {
                        app.quit();
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
}

ipc.on('addToPlaylist', function (event, arg) {
    const {dialog} = require('electron');
    let selectedfiles = dialog.showOpenDialog({
        filters: [
            {name: 'Audio Files', extensions: ['wav','flac','ogg','opus']}
            ],
        properties: ['openFile', 'multiSelections']
    });
    for(let i=0;i<selectedfiles.length;i++) {
        selectedfiles[i] = { filelocation:selectedfiles[i], isRead:0 };
    }
    db.insert(selectedfiles, function (err, newDocs) {
        if(err!=null) {
            dialog.showMessageBox({ message: err });
        } else {

        }
    });
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