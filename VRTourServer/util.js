const config = require('./config')
const multer = require('multer');
const fs = require('fs');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = config.storageLocation; //'./uploads';
        const directory = `${dir}/${req.body.path}/`
        const pathType = `${dir}/${req.body.path}/${req.body.type}/`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        if (!fs.existsSync(pathType)) {
          fs.mkdirSync(pathType);
        } else {
          // fs.readdir(pathType, (err, files) => {
          //   if (err) throw err;
          //   for (const file of files) {
          //     fs.unlink(path.join(pathType, file), err => {
          //       if (err) throw err;
          //     });
          //   }
          // });
        }
      cb(null, pathType)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
var upload = multer({ storage: storage })

function basicCORSHeaders(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

function getFileName(url) {
  let filename = url.substring(path.dirname(url).length + 1);
  let type = filename.substring(filename.lastIndexOf('.')+1).toLowerCase();
  return {
    filename,
    type
  }
}

async function generateLine(dir) {
  return new Promise(async function(resolve, reject) {
    try {
      let htmlStarter = `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>VR</title>
            <base href="/">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
        <body style="background-color: black; width: 100vw;height: 100vh;overflow: hidden;margin: 0;padding: 0;">
          <app-root> </app-root>`;
      let htmlEnder = `
          </body> 
        </html>`;
      let buffer = [];
      walkDir(dir, async(filePath) => {
        let info = getFileName(filePath);
        if ((info.type === "js" || info.type === "css") && filePath.toString().indexOf('firebase') === -1) {
          buffer.push({
            filePath,
            info
          })
        }
      });
      // special order
      for (let i = 0; i < buffer.length; i++) {
        let value = buffer[i];
        if (value.filePath.indexOf("three.min.js") !== -1) {
          let temp = buffer[0];
          buffer[0] = value;
          buffer[i] = temp;
        }
      }

      for (let i = 0; i < buffer.length; i++) {
        const filePath = buffer[i].filePath;
        const info = buffer[i].info;
        await new Promise(function(resolve, reject) {
          fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) reject();
            let header = "";
            let ender = "";
            if (info.type === "js") {
              header = `\n<script>\n`;
              ender = `\n<\/script>\n`;
            } else if (info.type === "css") {
              header = `\n<style>\n`;
              ender = `\n<\/style>\n`;
            }
            htmlStarter += (header + data + ender);
            resolve();
          })
        });
      }
      resolve(htmlStarter + htmlEnder)
    } catch (error) {
      reject(error)
    }
  })
}

function randomString() {
  const timestamp = Date.now();
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return `${text}-${timestamp}`
}

module.exports = {storage, upload, basicCORSHeaders, walkDir, getFileName, randomString, generateLine}