const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

function ensureUniverseCopyExists() {
    const levelsDir = path.join(__dirname, 'levels');
    const originalFile = path.join(levelsDir, 'universe.json');
    const copyFile = path.join(levelsDir, 'universe_copy.json');

    if (!fs.existsSync(originalFile)) {
        // Create a default universe.json if it does not exist
        const defaultUniverseData = {
            objects: [
                // Add default objects here
            ]
        };
        fs.writeFileSync(originalFile, JSON.stringify(defaultUniverseData, null, 2), 'utf8');
        log.info('Default universe.json created');
    }

    if (!fs.existsSync(copyFile)) {
        fs.copyFileSync(originalFile, copyFile);
        log.info('universe_copy.json created from universe.json');
    } else {
        log.info('universe_copy.json already exists');
    }
}

function createWindow() {
    ensureUniverseCopyExists();

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('editor_index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
