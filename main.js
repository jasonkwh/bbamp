const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc = require('electron').ipcMain

//Audio Decoders
var AV = require('av')
require('flac.js')
require('ogg.js')
require('opus.js')
require('vorbis.js')

let win
let winwidth = 300
let winheight = 75

function createWindow () {
    win = new BrowserWindow({
        frame:false,
        width:winwidth,
        height:winheight,
        resizable:false,
        maximizable:false,
        alwaysOnTop:true,
        backgroundColor:'#262626'
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
        app.quit()
    })

    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'About bbAMP',
                    click() {
                        shell.openExternal('https://github.com/jasonkwh')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Open an Audio File',
                    click() {
                        AV.Player.fromFile('output.wav').play()
                    }
                },
                {
                    label: 'Quit',
                    click() {
                        app.quit()
                    }
                }
            ]
        }
    ])

    Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})