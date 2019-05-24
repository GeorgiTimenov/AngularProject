import * as firebase from 'firebase';
import { Component, OnInit, Self } from '@angular/core';
import { element } from '@angular/core/src/render3';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../assets/js/libs/jszip-utils/';

var config = {
  apiKey: "AIzaSyDXKzso_ggPDSk3C4AIBovCxJQND7SAD5w",
  authDomain: "vrtour-42ece.firebaseapp.com",
  databaseURL: "https://vrtour-42ece.firebaseio.com",
  projectId: "vrtour-42ece",
  storageBucket: "vrtour-42ece.appspot.com",
  messagingSenderId: "709265075578"
};
var app = firebase.initializeApp(config);

declare let THREE;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vrtouradmin';
  
  public items;
  public items_cache;
  public totalBuffer = [];
  public assetBlobURL = [];
  public showSortMenu;
  public showVersionMenu;
  public sortNameDir;
  public sortDateDir;
  public searchKey = '';
  public versionKey = '';
  public bNewSpace = true;
  public bNewVersion = false;
  public hostUrl = window.location.origin;
  public popupIndex = 0;
  public shareUrl = "";
  public deleteItem;

  public newItemData = {
    model: [],
    pano: [],
    csv: '',
    uuid: '',
    logo: '',
    path: '',
    resourcePath: '',
    date: '',
    info: {
      name: '',
      company: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country : '',
    },
    version: {
      name: '',
      key: '',
      created: '',
    },
  }

  public openModelIndex = 0;

  public imageSources = [];

  public renderElement;
  public slideShowSize;
  public camera;
  public scene;
  public renderer;
  public controls;
  public cameraDoll;
  public previewFlag;
  public previewImageFlag;
  public previewCSVFlag;
  public generatedPath;
  public assetsData = [];

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    let self = this;
    this.items = [];
    this.items_cache = [];
    this.showSortMenu = false;
    this.showVersionMenu = false;

    // this.hostUrl = "http://localhost:3000";

    firebase.database().ref('data/').on('value', async function(snapshot) {
      let version = await self.getLatestVersion();
      self.items = [];
      self.items_cache = [];
      self.totalBuffer = [];
      let buffer = snapshot.val();
      if (!buffer) return;
      Object.keys(buffer).forEach(function (key, index) {
        let data = buffer[key];
        self.totalBuffer.push(data);
        let updateFlag = false;
        if (data.version.created < version["created"]) {
          updateFlag = true;
        }
        let item = {
          uuid: data.uuid,
          index: index,
          showMenu: false,
          img: data.logo ? data.logo : 'url("./assets/images/upload.pn")',
          title: data.info.name,
          date: data.date,
          updateFlag,
          version
        }
        self.items.push(item);
        self.items_cache.push(item);
      });
      setTimeout(() => {
        document.getElementById("searchBtn").click();
      })
    });
   }

   getDataFromTimeStamp(str) {
    var d = new Date(parseInt(str));
    return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
   }

  getAssetDataFromZip(path, onProgress, onLoad) {
    let self = this;
    JSZipUtils.getBinaryContent(path, {
      done: function(data) {
        JSZip.loadAsync(data).then(function (zip) {
          let totalCount = Object.keys(zip.files).filter(key => zip.files[key].dir === false).length;
          let count = 0;
          let assetBuffer = [];
          Object.keys(zip.files).forEach(function (key, index) {
            let element = zip.files[key];
            if (!element.dir) {
              let type = element.name.split('.').pop();
              let name = element.name.split('/').pop();
              let path = element.name;
              if (type === "jpg") {
                element.async("blob").then(function (blob) {
                  let data = {
                    type: type,
                    name: name,
                    path: path,
                    data: URL.createObjectURL(blob),
                    dtype: "blob"
                  }
                  self.assetBlobURL.push(data.data);
                  assetBuffer.push(data);
                  count++;
                  onProgress(parseInt((count * 100 / totalCount).toFixed(0)));
                  if (count === totalCount) {
                    onLoad(self.getItemDataFromAssets(assetBuffer));
                  }
                });
              } else if (type === "csv" || type === "obj" || type === "mtl") {
                element.async("string").then(function (str) {
                  let data = {
                    type: type,
                    name: name,
                    path: path,
                    data: str,
                    dtype: "string"
                  }
                  assetBuffer.push(data);
                  count++;
                  onProgress(parseInt((count * 100 / totalCount).toFixed(0)));
                  if (count === totalCount) {
                    onLoad(self.getItemDataFromAssets(assetBuffer));
                  }
                });
              } else {
                count++; 
              }
            }
          })
        });
      },
      fail: function(err) {
          console.error(err);
      },
      progress: function(p) { /* new */
        onProgress(p.percent);
      }
    });
  } 
  
  getItemDataFromAssets(buffer) {
    let model = [];
    let csv = "";
    let pano = [];
    
    let objElement = buffer.filter(element => element.type === "obj")[0];
    let objKeyPath = objElement.path.replace(objElement.name, "");
    let csvElement = buffer.filter(element => element.type === "csv")[0];
    let csvKeyPath = csvElement.path.replace(csvElement.name, "");

    buffer.forEach(element => {
      if (element.path.indexOf(objKeyPath) !== -1) { /// obj
        let data = {
          extenstion: element.type,
          file_name: element.name,
          url: element.path,
          data: element.data,
        }
        model.push(data)
      } else if (element.path.indexOf(csvKeyPath) !== -1) {
        csv = element.data;
      } else {
        let data = {
          extenstion: element.type,
          file_name: element.name,
          url: element.path,
          data: element.data,
        }
        pano.push(data)
      } 
    });

    return {
      model: model,
      csv: csv,
      pano: pano,
    }
  }

  ngOnInit() {
    this.showLogic();
    // this.slideShowSize = document.getElementById('sliderElement').offsetWidth;
    
  }

  public getSpaceItems() {
    return this.items;
  }

  InitThree() {
    this.renderElement = document.getElementById('renderElement');
    let self = this;
    this.previewFlag = true;
    const WIDTH = this.renderElement.offsetWidth;
    const HEIGHT =  this.renderElement.offsetHeight;
    this.camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.2, 1000 );
    this.camera.position.set(1,20,30);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x222222 );
    this.createLight(this.scene);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( WIDTH, HEIGHT );
    this.renderer.domElement.style.position = 'absolute'
    // this.renderer.domElement.style.opacity = '0'
    // this.renderer.domElement.style.zIndex = '-9999'
    this.renderer.domElement.id = "preview";
    this.renderer.domElement.name = "preview";
    this.renderElement.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', self.onWindowResize.bind(this), false );
    this.scene.add( new THREE.GridHelper( 150, 150 ) );
    this.controls = new THREE.CustomOrbitControls( this.camera, this.renderer.domElement );
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 500;
    this.render();
  }

  public releaseMemory () {
    this.assetBlobURL.forEach(element => {
      URL.revokeObjectURL(element);
    })
    this.assetBlobURL = [];
    this.imageSources = [];
    this.newItemData.model = [];
    this.newItemData.pano = [];
  }

  private loadAsset(values) {
    let self = this;
    let obj_data = '';
    let mtl_data = '';
    let texture_info = [];
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value.extenstion === 'mtl') {
        mtl_data = value.data;
      } else if (value.extenstion === 'obj') {
        obj_data = value.data;
      } else {
        texture_info.push({
          name: value.file_name,
          obj_url: value.data,
        });
      }
    }
    // self.progressObjectBar('Loading Models', 1);
    let loading_manager = new THREE.LoadingManager();
    loading_manager.onLoad = function ( ) {
      // self.progressObjectBar('Loading Models', 100);
    };
    let loader = new THREE.MTLLoader();
    loader.setCrossOrigin( true );
    loader.setMaterialOptions( { ignoreZeroRGBs: false } );
    loader.setTexturePath( texture_info );
    loader.setAlpahTestOption(true);
    loader.loadText( mtl_data, function ( materials ) {
      let loader = new THREE.OBJLoader(loading_manager);
      loader.setMaterials( materials );
        loader.loadText( obj_data, function ( object ) {
          object.traverse( function ( child ) {
            if (child.type === "Mesh") {
              child.material.side = THREE.FrontSide;
            }
          });
          self.rotateAroundWorldAxis(object, new THREE.Vector3(1,0,0), Math.PI / 2 );
          self.rotateAroundWorldAxis(object, new THREE.Vector3(0,0,1), Math.PI);
          self.rotateAroundWorldAxis(object, new THREE.Vector3(0,1,0), Math.PI);
          object.scale.set(1,1,1);
          object.position.set(0,0,0);
          self.scene.add( object );
          self.renderElement.appendChild( self.renderer.domElement );
      });
    } );
  }

  private onWindowResize() {
    this.camera.aspect = this.renderElement.offsetWidth / this.renderElement.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.domElement.style.position = 'absolute'
    this.renderer.setSize( this.renderElement.offsetWidth, this.renderElement.offsetHeight );
    this.renderer.render( this.scene, this.camera );
  }

  public progressBar(text, value) {
    document.getElementById("progress-element").style.width = `${value}%`;
    document.getElementById("progress-status").innerHTML = text;
    if (value === 0) {
      document.getElementById("progress-bar").style.display ='none';
      document.getElementById("progress-element").style.display ='none';
      document.getElementById("progress-status").style.display ='none';
    } else {
      document.getElementById("progress-bar").style.display ='block';
      document.getElementById("progress-element").style.display ='block';
      document.getElementById("progress-status").style.display ='block';
    }
  }

  public progressObjectBar(text, value) {
    document.getElementById("progress-object-element").style.width = `${value}%`;
    document.getElementById("progress-object-status").innerHTML = text;
    if (value === 0) {
      document.getElementById("progress-object-bar").style.display ='none';
      document.getElementById("progress-object-element").style.display ='none';
      document.getElementById("progress-object-status").style.display ='none';
    } else {
      document.getElementById("progress-object-bar").style.display ='block';
      document.getElementById("progress-object-element").style.display ='block';
      document.getElementById("progress-object-status").style.display ='block';
    }
    if (value === 100) {
      document.getElementById("progress-object-status").innerHTML = "Complete";
      setTimeout(() => {
        document.getElementById("progress-object-bar").style.display ='none';
        document.getElementById("progress-object-element").style.display ='none';
        document.getElementById("progress-object-status").style.display ='none';
      }, 3000)
    }
  }

  private createLight(scene) {
    const ambient = new THREE.HemisphereLight(0xFFFFFf, 0xffffff, 0.65)
    
    ambient.position.set( -0.5, 0.75, -1 );
    scene.add( ambient );

    const ambient_2 = new THREE.HemisphereLight(0xFFFFFF, 0x0f0e0d, 0.65 );
    ambient_2.position.set( -0.5, 0.75, -1 );
    scene.add( ambient_2 );
  }

  public render() {
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.renderer.render( this.scene, this.camera );
    if (this.previewFlag) requestAnimationFrame( this.render.bind(this) );
  }

  clickMenu (item) {
    if (item.showMenu) {
      item.showMenu = false;
      return
    }
    this.items.forEach(element => {
      element.showMenu = false;
    });
    item.showMenu = true; 
  }

  randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  public generateLink() {
    let date = new Date();
    let timestamp = date.getTime(); 
    return `${this.randomString(32)}_${timestamp}`
  }

  public files: UploadFile[] = [];

  public sendUploadRequest(formData, onProgress, onError, onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', `${this.hostUrl}/api/uploads`, true);
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        onProgress(percentage);
      }
    };
    xhr.onerror = function(e) {
      onError('Error', e);
    };
    xhr.onload = function() {
      console.log(this.statusText);
      var data=xhr.responseText;
      onLoad(data);
    };
    xhr.send(formData);
  }
 
  public enablePreview() {
    let self = this;
    self.previewFlag = true;
    self.openModelIndex = 1;
    self.showLogic();
    setTimeout(() => {
      self.InitThree();
      self.loadAsset(self.newItemData.model);
    }, 300) 
    self.imageSources = [];
    self.newItemData.pano.forEach(element => {
      self.imageSources.push(element.data);
    });
  }

  public resetPreview() {
    this.previewFlag = false;
    if (this.scene) {
      for( var i = this.scene.children.length - 1; i >= 0; i--) {
        let obj = this.scene.children[i];
        this.scene.remove(obj);
       }
    }
    if (document.getElementById("preview")) {
      this.renderElement.removeChild(document.getElementById("preview"));
    }
  }

  public removeDirectory(udid) {
    const formData = new FormData()
    formData.append('path', udid);
    this.http.post(`${this.hostUrl}/api/rmdir`, {
      path: udid
    })
    .subscribe(data => {
      debugger;
    })
    this.releaseMemory();
  }

  public droppedLogo(event: UploadEvent) {
    let self = this;
    this.files = event.files;
    for (const droppedFile of event.files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          
          var reader  = new FileReader();
          // it's onload event and you forgot (parameters)
          reader.onload = function(e)  {
              var image = document.createElement("img");
              // the result image data
              // image.src = reader.result;
              document.body.appendChild(image);
          }
          
          // you have to declare the file loading
          reader.readAsDataURL(file);
         
          // You could upload it like this:
          const formData = new FormData()
          formData.append('path', self.generatedPath);
          formData.append('type', 'logo');
          formData.append('files', file, droppedFile.relativePath)
 
          this.http.post(`${this.hostUrl}/api/uploads`, formData)
          .subscribe(data => {
            let testTarget = document.getElementsByClassName('file-drop-zone-content')[0] as HTMLElement;
            testTarget.style.backgroundImage = `url('${data[0]['path']}')`;
            self.newItemData.logo = data[0]['path'];
          })
 
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public droppedZip (event: UploadEvent) {
    let self = this;
    this.resetPreview();
    this.files = event.files;
    const formDataZip = new FormData()
    for (const droppedFile of event.files) {
      formDataZip.append('path', self.generatedPath);
      formDataZip.append('type', 'zip');
      for (const droppedFile of event.files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            formDataZip.append('files', file, droppedFile.relativePath);
            self.sendUploadRequest(formDataZip,
              (percentage) => {// Uploading
               self.progressBar("Uploading Objects...", percentage);
              }, (error) => {// Error
               self.progressBar("Error", 100);
              }, (data) =>{
                var array = JSON.parse(data);
                let path = array[0]["path"];
                self.newItemData.path = path;
                self.getAssetDataFromZip(path,
                  (percentage) =>{
                    self.progressBar("Uploading Streaming...", percentage);
                  },(data) =>{
                    self.newItemData.csv = data.csv;
                    self.newItemData.model = data.model;
                    self.newItemData.pano = data.pano;
                    document.getElementById("progress-status").innerHTML = "Complete";
                    setTimeout(() => {
                      document.getElementById("progress-bar").style.display ='none';
                      document.getElementById("progress-element").style.display ='none';
                      document.getElementById("progress-status").style.display ='none';
                      self.enablePreview();
                    }, 3000)
                  })
              })
          })
        }
      }
    }
  }

  // public dropped(event: UploadEvent) {
  //   let self = this;
  //   this.resetPreview();
  //   this.files = event.files;
  //   let length = this.files.length;
  //   let count = 0;
  //   const formDataObj = new FormData()
  //   formDataObj.append('path', self.generatedPath);
  //   formDataObj.append('type', 'object');

  //   const formDataCSV = new FormData()
  //   formDataCSV.append('path', self.generatedPath);
  //   formDataCSV.append('type', 'csv');
    
  //   const formDataImage = new FormData()
  //   formDataImage.append('path', self.generatedPath);
  //   formDataImage.append('type', 'image');
    
  //   for (const droppedFile of event.files) {
  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //       fileEntry.file((file: File) => {
  //         if (droppedFile.relativePath.indexOf('AssetsOBJ/') !== -1) {
  //           formDataObj.append('files', file, droppedFile.relativePath)
  //         } else if (droppedFile.relativePath.indexOf('AssetsIMG/') !== -1) {
  //           formDataImage.append('files', file, droppedFile.relativePath)
  //         } else if (droppedFile.relativePath.indexOf('AssetsCSV/') !== -1) {
  //           formDataCSV.append('files', file, droppedFile.relativePath)
  //         }
          
  //         count ++;
  //         if (length === count) {
  //             self.sendUploadRequest(formDataObj,
  //                (percentage) => {// Uploading
  //                 self.progressBar("Uploading Objects...", percentage);
  //             }, (error) => {// Error
  //                 self.progressBar("Error", 100);
  //             }, (data) =>{// loaded
  //                console.log(data);
  //                var array = JSON.parse(data);
  //               self.assetsData = []
  //               array.forEach(element => {
  //               let data = {
  //                 extenstion: (/[.]/.exec(element.name)) ? /[^.]+$/.exec(element.name)[0] : undefined,
  //                 file_name: element.name,
  //                 url: element.path
  //               }
  //               self.newItemData.model.push(data);
  //               })
  //                /// image loader
  //                self.sendUploadRequest(formDataImage,
  //                 (percentage) => {// Uploading
  //                   self.progressBar("Uploading Images...", percentage);
  //                 }, (error) => {// Error
  //                   self.progressBar("Error", 100);
  //                 }, (data) =>{// loaded
  //                     console.log(data);
  //                     var array = JSON.parse(data);
  //                     array.forEach(element => {
  //                       self.imageSources.push(element.path);
  //                     })
  //                     self.newItemData.pano = self.imageSources;
  //                     self.sendUploadRequest(formDataCSV,
  //                       (percentage) => {// Uploading
  //                         self.progressBar("Uploading CSV...", percentage);
  //                         if (percentage === 100) {
  //                           document.getElementById("progress-status").innerHTML = "Complete";
  //                           setTimeout(() => {
  //                             document.getElementById("progress-bar").style.display ='none';
  //                             document.getElementById("progress-element").style.display ='none';
  //                             document.getElementById("progress-status").style.display ='none';
  //                             self.enablePreview();
  //                           }, 3000)
  //                         }
  //                     }, (error) => {// Error
  //                         self.progressBar("Error", 100);
  //                     }, (data) =>{// loaded
  //                         console.log(data);
  //                         var array = JSON.parse(data);
  //                         self.newItemData.csv = array[0]["path"];
  //                     })
  //                 })
  //             })  
  //         }
  //       });
  //     } else {
  //       const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  //       console.log(droppedFile.relativePath, fileEntry);
  //     }
  //   }
  // }

  private rotateAroundWorldAxis(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  public clickDropzone() {
    if(this.previewFlag) return;
    let element: HTMLElement = document.getElementById('assetsUpload').getElementsByTagName("INPUT")[0] as HTMLElement;
    element.click();
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

  clickSortMenu() {
    this.showSortMenu = !this.showSortMenu;
  }

  clickSortDate() {
    if (this.sortDateDir) {
      this.items.sort(function (a, b) {
        var textA = a.date.toUpperCase();
        var textB = b.date.toUpperCase();
        return textA.localeCompare(textB);
      });
    } else {
      this.items.sort(function (a, b) {
        var textA = a.date.toUpperCase();
        var textB = b.date.toUpperCase();
        return textB.localeCompare(textA);
      });
    }
    this.items_cache = [];
    this.items_cache = this.items;
    this.sortDateDir = !this.sortDateDir;
  }
  clickSortName() {
    if (this.sortNameDir) {
      this.items.sort(function (a, b) {
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();
        return textA.localeCompare(textB);
      });
    } else {
      this.items.sort(function (a, b) {
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();
        return textB.localeCompare(textA);
      });
    }
    this.items_cache = [];
    this.items_cache = this.items;
    this.sortNameDir = !this.sortNameDir;
  }
  searchMenu() {
    console.log(this.searchKey);
    this.items = [];
    this.items_cache.forEach(element => {
      this.items.push(element);
    });
    if (this.searchKey) {
      this.items = this.items.filter(element => element.title.toUpperCase().indexOf(this.searchKey.toUpperCase()) !== -1 || element.date.toUpperCase().indexOf(this.searchKey.toUpperCase()) !== -1)
    }
  }
  clickEdit (item) {
    let self = this;
    let index = item.index;
    item.showMenu = false;
    this.bNewSpace = false;
    this.generatedPath = this.items_cache[index].uuid;
    this.newItemData = this.totalBuffer.filter(element => element.uuid === this.generatedPath)[0];
    document.getElementById('modal').style.display = 'block';
    this.openModelIndex = 0;
    this.resetPreview();
    this.showLogic();
    self.getAssetDataFromZip(this.newItemData.path,
      (percentage) =>{
        self.progressBar("Fetching Streaming...", percentage);
      },(data) =>{
        self.newItemData.csv = data.csv;
        self.newItemData.model = data.model;
        self.newItemData.pano = data.pano;
        self.newItemData.pano.forEach(element => {
          self.imageSources.push(element.data);
        });
        document.getElementById("progress-status").innerHTML = "Complete";
        setTimeout(() => {
          document.getElementById("progress-bar").style.display ='none';
          document.getElementById("progress-element").style.display ='none';
          document.getElementById("progress-status").style.display ='none';
          self.enablePreview();
        }, 3000)
      })
      this.newItemData.logo = this.newItemData.logo ? this.newItemData.logo : `url('./assets/images/upload.png')` 
    let testTarget = document.getElementsByClassName('file-drop-zone-content')[0] as HTMLElement;
    testTarget.style.backgroundImage = `url('${this.newItemData.logo}')`;
  }

  clickDelete (item) {
    this.popupIndex = 2;
    item.showMenu = false;
    this.deleteItem = item;
  }

  async updateVersion(uuid, versionId) {
    let version;
    if (!versionId) {
      version = await this.getLatestVersion();
    }
    let uploadData = {
      key: version['key'],
      name: version['name'],
      created: version['created'],
    }
    var updates = {};
    updates[`/data/${uuid}/version`] = uploadData;
    return await firebase.database().ref().update(updates);
  }

  async clickUpdateButton (item) {
    let index = item.index;
    let uuid = this.items_cache[index].uuid;
    let element = this.totalBuffer.filter((element) => element.uuid === uuid)[0];
    await this.generateResource(element);
  }

  async generateResource (item) {
    let self = this;
    let uuid = item.uuid;
    let path = item.path.toString().split('zip/')[1];
    let logo = item.logo.toString().split('logo/')[1];
    const version = await this.getLatestVersion();
    await this.updateVersion(uuid, null);
    let resourcePath = "";
    await new Promise(function(resolve, reject) {
      self.http.post(`${self.hostUrl}/api/resource`, {
        path,
        uuid,
        logo,
        info: item.info,
        date: item.date,
        version: version,
      })
      .subscribe(data => {
        if (data['success'] === 'success') {
          resourcePath = data['path'];
          resolve();
        } else {
          alert(data["error"])
          reject();
        }
      })
    })
    return resourcePath;
  }

  async clickDownload (item) {
    item.showMenu = false;
    let index = item.index;
    let uuid = this.items_cache[index].uuid;
    let element = this.totalBuffer.filter((element) => element.uuid === uuid)[0];
    let path = element.path.toString().split('zip/')[1];
    let logo = element.logo.toString().split('logo/')[1];
    const version = await this.getLatestVersion();
    await this.updateVersion(uuid, null);
    this.http.post(`${this.hostUrl}/api/download`, {
      path,
      uuid,
      logo,
      info: element.info,
      date: element.date,
      version: version,
    })
    .subscribe(data => {
      if (data['success'] === 'success') {
        let path = data['path'];
        let index = item.index;
        let uuid = this.items_cache[index].uuid;
        let info = this.totalBuffer.filter((element) => element.uuid === uuid)[0].info;
        var element = document.createElement('a');
        element.href = path;
        element.setAttribute('download', `${info.name}.zip`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        alert(data["success"])
      }
    })
  }
  
  async popupAction (index) {
    if (index === 1) {
      this.copyToClipboard(this.shareUrl);
      alert("copied clip board");
      return
    }
    if (index === 2) {
      debugger
      let item = this.deleteItem;
      let index = item.index;
      let uuid = this.items_cache[index].uuid;
      this.removeDirectory(uuid);
      this.items_cache.splice(index,1);
      this.recalculateIndex(this.items_cache);
      this.items = [];
      this.items_cache.forEach(element => {
        this.items.push(element);
      });
      await firebase.database().ref('data/' + uuid).remove();
      alert('Item deleted.')
    }
    this.popupIndex = 0;
  }

  clickShare (item) {
    this.shareUrl = `${this.hostUrl}/?id=${item.uuid}`
    item.showMenu = false;
    this.popupIndex = 1;
  }

  copyToClipboard (str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };
  createVersion() {
    this.showVersionMenu = false;
    this.http.post(`${this.hostUrl}/api/version`, {
      name: this.versionKey ? this.versionKey : 'v0.0'
    })
    .subscribe(data => {
      if (data['success'] === 'success') {
        let path = data['path']
        var element = document.createElement('a');
        element.href = path;
        element.setAttribute('download', `version.zip`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        alert("New version created")
      } else {
        alert(data["success"])
      }
    })
    this.versionKey = "";
  }
  cancelVersion() {
    this.versionKey = "";
    this.showVersionMenu = false;
  }
  clickVersion() {
    this.showVersionMenu = true;
  }
  createSpace() {
    this.bNewSpace = true;
    this.generatedPath = this.generateLink();
    document.getElementById('modal').style.display = 'block';
    this.newItemData = {
      model: [],
      pano: [],
      csv: '',
      uuid: this.generatedPath,
      logo: '',
      path: '',
      resourcePath: '',
      date: '',
      info: {
        name: '',
        company: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country : '',
      },
      version: {
        name: '',
        key: '',
        created: '',
      },
    }
    let testTarget = document.getElementsByClassName('file-drop-zone-content')[0] as HTMLElement;
    testTarget.style.backgroundImage = `url('./assets/images/upload.png')`;
  }
  async getLatestVersion() {
    return new Promise(function(resolve, reject) {
      let created = 0;
      let name = '';
      let key = '';
      firebase.database().ref('versions/').on('value', function(snapshot) {
        let buffer = snapshot.val();
        if (!buffer) return;
        Object.keys(buffer).forEach(function (vkey, index) {
          let data = buffer[vkey];
          if (created < data.created) {
            created = data.created;
            name = data.version;
            key =vkey;
          }
        });
        resolve({
          name,
          key,
          created
        });
      });
    });    
  }
  async saveSpace() {
    this.bNewSpace = false;
    let data = await this.getLatestVersion();
    this.newItemData.version.key = data['key'];
    this.newItemData.version.name = data['name'];
    this.newItemData.version.created = data['created'];
    console.log(this.newItemData);
    let date = new Date();
    this.newItemData.date = date.getTime().toString(); 
    let uploadData =  this.newItemData;
    uploadData.resourcePath = await this.generateResource(uploadData);
    uploadData.model = [];
    uploadData.pano = [];
    uploadData.csv = "";
    uploadData.logo = uploadData.logo ? uploadData.logo : `url('./assets/images/upload.png')`;
    var updates = {};
    updates[`/data/${this.newItemData.uuid}`] = uploadData;
    this.hideModal();
    return firebase.database().ref().update(updates);
  }
  hideModal() {
    this.openModelIndex = 0;
    this.resetPreview();
    if (this.bNewSpace) {
      this.removeDirectory(this.generatedPath);
    }
    this.showLogic();
    document.getElementById('modal').style.display = 'none'
  }
  showLogic() {
    document.getElementById('modal-content-1').style.display = 'none';
    document.getElementById('modal-part-1').style.display = 'none';
    document.getElementById('modal-part-2').style.display = 'none';
    document.getElementById('edit-part').style.display = 'none';
    if (this.openModelIndex === 0) {
      document.getElementById('modal-content-1').style.display = 'block';
    }
    if (this.openModelIndex === 1) {
      document.getElementById('modal-part-1').style.display = 'inline-block';
      document.getElementById('modal-part-2').style.display = 'inline-block';
    }
    if (this.openModelIndex === 2) {
      document.getElementById('edit-part').style.display = 'block';
    }
  }
  nextModal(index) {
    this.openModelIndex++;
    if (this.openModelIndex === 1) {
      debugger
      this.resetPreview();
    }
    this.showLogic();
  }
  resetBtn() {
    this.openModelIndex--;
    if ( this.openModelIndex == 0) {
      this.resetPreview();
      this.releaseMemory();
      this.removeDirectory(this.generatedPath);
    }
    this.showLogic();
  }
  recalculateIndex (array) {
    for (let i = 0; i < array.length; i ++) {
      array[i].index = i;
    }
    return array;
  }

  openNewWindow () {
    window.open(window.location.href, '_blank');
  }
}
