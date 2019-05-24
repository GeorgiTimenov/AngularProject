const router = require('express').Router();
const config = require('./config')
const {upload, walkDir, getFileName, randomString, generateLine} = require("./util");
const rimraf = require("rimraf");
const fs = require('fs');
const JSZip = require('jszip');
const admin = require("firebase-admin");
const serviceAccount = require("./vrtour-42ece-444e9b186bf7.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "vrtour-42ece.appspot.com",
    databaseURL: 'vrtour-42ece.firebaseio.com'
});
const bucket = admin.storage().bucket();
const database = admin.database();

router.post('/upload', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    let json = {
        name: file.filename,
        path: `http://${req.headers.host}/gets/${req.body.path}/${req.body.type}/${file.filename}`,
        type: file.mimetype,
        originalname: file.originalname,
        size: file.size,
    }
      res.send(json);    
});

router.post('/uploads', upload.array('files', 2000), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    let arrays = [];
    files.forEach((file) =>{
        let json = {
            name: file.filename,
            path: `http://${req.headers.host}/gets/${req.body.path}/${req.body.type}/${file.filename}`,
            type: file.mimetype,
            originalname: file.originalname,
            size: file.size,
        }
        arrays.push(json);
    });
    res.send(arrays);
})

router.post('/rmdir', (req, res, next) => {
    var dir = config.storageLocation; //'./uploads';
    const directory = `${dir}/${req.body.path}/`
    if (fs.existsSync(dir)) {
        rimraf(directory, function () { console.log("directory removed"); });
        let json = {
            success: "success"
        }
        res.send(json);
    } else {
        let json = {
            success: "path not found"
        }
        res.send(json);
    }
});

router.post('/version', async (req, res, next) => {
    var dir = config.publicLocation; //'./uploads';
    var storagePath = config.storageLocation; //'./uploads';
    var versionLocation = `${storagePath}/version`
    const version = req.body.name;
    if (fs.existsSync(dir)) {
        if (!fs.existsSync(versionLocation)) {
            fs.mkdirSync(versionLocation);
        }
        try {
          let uuid = randomString();
          const htmlData = await generateLine(dir); 
          var finalZip = new JSZip();
          finalZip.file('index.html', htmlData);
          await new Promise(function(resolve, reject) {
            finalZip.generateNodeStream({streamFiles:true})
            .pipe(fs.createWriteStream(`${versionLocation}/${uuid}.zip`))
            .on('finish', function () {
                resolve();
            });
          });
          
          const toFilePath = `static/versions/${version}/${uuid}.zip`;
          const upload = await bucket.upload(`${versionLocation}/${uuid}.zip`, {destination: toFilePath});
          const signedUrl = await upload[0].getSignedUrl({ action: 'read', expires: '03-09-2491' });
          var updates = {};
          updates[`/versions/${uuid}/path`] = signedUrl[0];
          updates[`/versions/${uuid}/path2`] = `http://${req.headers.host}/gets/version/${uuid}.zip`,
          updates[`/versions/${uuid}/version`] = version;
          updates[`/versions/${uuid}/created`] = Date.now();
          await database.ref().update(updates);
          let json = {
              success: "success",
              path: signedUrl[0],
              path2: `http://${req.headers.host}/gets/version/${uuid}.zip`,
          }
          res.send(json);
        } catch (error) {
          let json = {
              success: "error"
          }
          res.send(json);
        }
    } else {
        let json = {
            success: "path not found"
        }
        res.send(json);
    }
});

router.post('/resource', async (req, res, next) => {
    var dir = config.publicLocation; //'./vr';
    var storagePath = config.storageLocation; //'./uploads';
    const modelPath = `${storagePath}/${req.body.uuid}/zip/${req.body.path}`
    const logoPath = `${storagePath}/${req.body.uuid}/logo/${req.body.logo}`
    const date = req.body.date;
    const info = req.body.info;
    const version = req.body.version;
    const uuid = req.body.uuid;
    const resourcePath = `${storagePath}/${req.body.uuid}/resource/`
    
    if (fs.existsSync(dir)) {
      if (!fs.existsSync(resourcePath)) {
          fs.mkdirSync(resourcePath);
      }
          try {
  
            const htmlData = await generateLine(dir); 
  
            let buffer = [];
  
            walkDir(dir, async(filePath) => {
              let info = getFileName(filePath);
              if (info.type !== "js" && info.type !== "css" && info.type !== "txt" && info.type !== "ico" && info.type !== "html" && info.type !== "htm") {
                buffer.push({
                  filePath,
                  info
                });
              }
            });
            var zip = new JSZip();
            for (let i = 0; i < buffer.length; i++) {
              let url = buffer[i].filePath;
              let name = url.replace(/\\/g,"/").replace(dir + '/','');
              await new Promise(function(resolve, reject) {
                fs.readFile(url, function(err, data) {
                  if (err) reject();
                  zip.file(name, data, {binary: true})
                  resolve();
                })
              });
            }
            await new Promise(function(resolve, reject) {
              fs.readFile(modelPath, function(err, data) {
                if (err) reject();
                zip.file('assets/model/model.zip', data, {binary: true})
                resolve();
              })
            });
            await new Promise(function(resolve, reject) {
              fs.readFile(logoPath, function(err, data) {
                if (err) reject();
                zip.file('assets/logo/logo', data, {binary: true})
                resolve();
              })
            });
            let json = {
              date,
              info,
              version,
              uuid,
            }
            const content = JSON.stringify(json);
            zip.file('assets/data/data', content);
            await new Promise(function(resolve, reject) {
              zip.generateNodeStream({streamFiles:true})
              .pipe(fs.createWriteStream(`${resourcePath}/${info.name}.zip`))
              .on('finish', function () {
                  resolve();
                  let json = {
                    success: 'success',
                    path: `http://${req.headers.host}/gets/${req.body.uuid}/resource/${info.name}.zip`,
                  }
                  res.send(json);
                  resolve();
              });
            });
  
          } catch (error) {
            let json = {
                success: "error"
            }
            res.send(json);
          }
      } else {
          let json = {
              success: "path not found"
          }
          res.send(json);
      }
  });

router.post('/download', async (req, res, next) => {
  var dir = config.publicLocation; //'./vr';
  var storagePath = config.storageLocation; //'./uploads';
  const modelPath = `${storagePath}/${req.body.uuid}/zip/${req.body.path}`
  const logoPath = `${storagePath}/${req.body.uuid}/logo/${req.body.logo}`
  const date = req.body.date;
  const info = req.body.info;
  const version = req.body.version;
  const uuid = req.body.uuid;
  const downloadPath = `${storagePath}/${req.body.uuid}/download/`
  
  if (fs.existsSync(dir)) {
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }
        try {

          const htmlData = await generateLine(dir); 

          let buffer = [];

          walkDir(dir, async(filePath) => {
            let info = getFileName(filePath);
            if (info.type !== "js" && info.type !== "css" && info.type !== "txt" && info.type !== "ico" && info.type !== "html" && info.type !== "htm") {
              buffer.push({
                filePath,
                info
              });
            }
          });
          var zip = new JSZip();
          for (let i = 0; i < buffer.length; i++) {
            let url = buffer[i].filePath;
            let name = url.replace(/\\/g,"/").replace(dir + '/','');
            await new Promise(function(resolve, reject) {
              fs.readFile(url, function(err, data) {
                if (err) reject();
                zip.file(name, data, {binary: true})
                resolve();
              })
            });
          }
          await new Promise(function(resolve, reject) {
            fs.readFile(modelPath, function(err, data) {
              if (err) reject();
              zip.file('assets/model/model.zip', data, {binary: true})
              resolve();
            })
          });
          await new Promise(function(resolve, reject) {
            fs.readFile(logoPath, function(err, data) {
              if (err) reject();
              zip.file('assets/logo/logo', data, {binary: true})
              resolve();
            })
          });
          let json = {
            date,
            info,
            version,
            uuid,
          }
          const content = JSON.stringify(json);
          zip.file('assets/data/data', content);
          await new Promise(function(resolve, reject) {
            zip.generateNodeStream({streamFiles:true})
            .pipe(fs.createWriteStream(`${downloadPath}/temp.zip`))
            .on('finish', function () {
                resolve();
            });
          });
          // generating Production
          var finalZip = new JSZip();
          await new Promise(function(resolve, reject) {
            fs.readFile(`${downloadPath}/temp.zip`, function(err, data) {
              if (err) reject();
              finalZip.file('resource.zip', data, {binary: true})
              // finalZip.file('assets/resource.zip', data, {binary: true})
              fs.unlinkSync(`${downloadPath}/temp.zip`)
              resolve();
            })
          });
          await new Promise(function(resolve, reject) {
            finalZip.file('index.html', htmlData)
            resolve();
          });

          await new Promise(function(resolve, reject) {
            finalZip.generateNodeStream({streamFiles:true})
            .pipe(fs.createWriteStream(`${downloadPath}/${info.name}.zip`))
            .on('finish', function () {
                let json = {
                  success: 'success',
                  path: `http://${req.headers.host}/gets/${req.body.uuid}/download/${info.name}.zip`,
                }
                res.send(json);
                resolve();
            });
          });

        } catch (error) {
          let json = {
              success: "error"
          }
          res.send(json);
        }
    } else {
        let json = {
            success: "path not found"
        }
        res.send(json);
    }
});
module.exports = router;