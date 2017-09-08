const { dialog } = require('electron')
const path = require('path')

// example looks: https://github.com/dengyaolong/electron-downloader/tree/master/example
module.exports = function download(win, url, opts = {}) {
    win.webContents.session.once('will-download', function onDownload (e, item) {
            if(opts.saveAs) {
                console.log('YEAH');
                let defaultFilename = item.getFilename()

                // show dialog custom
                let filename = dialog.showSaveDialog(win, {
                    defaultPath: path.basename(defaultFilename)
                })
                if(!filename) {
                    item.cancel()
                } else {
                    // set extname if not exist
                    const savePathObject = path.parse(filename)
                    savePathObject.base = null
                    savePathObject.ext = savePathObject.ext || path.extname(defaultFilename)
                    item.setSavePath(path.format(savePathObject))
                }
            } else {
               item.setSavePath(path.resolve(opts.dir, item.getFilename()))
            }
    })
    win.webContents.downloadURL(url)
}
