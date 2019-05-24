import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { element, text } from '@angular/core/src/render3';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import 'zone.js'
declare let THREE: any;
declare let TWEEN: any ;
declare let JSZipUtils: any;
declare let CustomOrbitControls: any;
declare let OBJLoader: any;
declare let MTLLoader: any;
import * as JSZip from 'jszip';

import * as firebase from 'firebase';
var config = {
  apiKey: "AIzaSyDXKzso_ggPDSk3C4AIBovCxJQND7SAD5w",
  authDomain: "vrtour-42ece.firebaseapp.com",
  databaseURL: "https://vrtour-42ece.firebaseio.com",
  projectId: "vrtour-42ece",
  storageBucket: "vrtour-42ece.appspot.com",
  messagingSenderId: "709265075578"
};

var app = firebase.initializeApp(config);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'VR';

  // scene
  public scene: any;
  public screenModeIndex: any;
  public renderer: any;
  // camera control
  private camera: any;
  private cameraDoll: any;
  private cameraFloor: any;
  public controlsFvp: any;
  public cameraDollControl: any;
  public cameraFloorControl: any;
  public cameraFovMAX: any;
  public cameraFovMIN: any;
  // mouse control
  public mouseDownFlag: any;
  public mouseMoveFlag: any;
  public mouseMovedFlag: any;
  public mouse2DVector: any;
  public touchtime: any;
  public touchStart = {
    x: 0,
    y: 0,
  };
  // puck
  public puckOpacityValue: any;
  public puckNearDistanceValue: any;
  public previousPuckIndex: any;
  // skybox
  public skyBox: any;
  // pointer
  public cameraPitchObject: any;
  public cameraYawObject: any;
  public pointerRaycaster: any;
  public pointer: any;
  // hotspot
  public hotspotDisplayFlag: any;
  public hotspoNearDistanceValue: any;
  public hotspotObject: any;
  public hotspotColorArray: any = [];
  public hotspotColorIndex: any;
  public hotspotSelectedIndex: any;
  public hotspot_title: any;
  public hotspot_content: any;
  
  // measurement
  public measurementFlag: any;  
  public measurementLine: any; 
  public measurementText: any; 
  public measurementThirdPoint = new THREE.Vector3();    
  public measurementFont: any;
  // loader
  public loaderAlphaTest: any;
  public loaderDollObject: any;
  public loaderMaterialArray: any = [];
  public loaderTextureUrlArray: any = [];
  // effect
  public composer: any;
  // data
  public matterDataArray: any = [];
  public panoDataArray: any = [];
  public floorDataArray: any = [];
  public hotspotDataArray: any = [];
  public puckObjectArray: any = [];
  public hotspotObjectArray: any = [];
  // UI
  public showWindow = false;
  public infoViewShow = true;
  public titleIndex: any;
  public PrevtitleIndex: any;
  public functionIndex: any;
  public highLightArray: any = [];
  public loadingScreen: any;
  public showFloorPanel = false;
  public previousFloorIndex: any;
  public ControlPanelShow = false;
  public UIEventFired = false;
  public totalProgressValue: any;
  public currentProgressValue: any;
  public spaceVersion = "DS";
  // Misc
  public screenChangeFlag = false;
  //Share
  public shareableURL: any;
  public deepLinkURL: any;
  // unused
  public target_camera_rotation_y = 0;
  public target_camera_rotation_x = 0;

  public spaceInfo: any;
  public logoUrl = "";
  public logoUrlForMark: any;
  public spaceName = "Download Assets...";
  public spaceCompany: any;
  public resourceID: any;
  public spaceID: any;
  public deepLinkId: any;
  public deepLinkCamera = {
    yaw: {
      x: 0,
      y: 0,
      z: 0,
    },
    pit: {
      x: 0,
      y: 0,
      z: 0,
    },
    fov: 0,
  }
  public isWorkingLocal = false;
  public frontImageArray: any = [];
  public fontJSONUrl = "";

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private sanitizer:DomSanitizer) {
    let self = this;
    // window.onload = function() {
      // document.getElementById('readyForRun').addEventListener('click', (event) => {
        self.showWindow = true;
        
        setTimeout( async () => {
          self.loaderAlphaTest = false;
          self.functionIndex = 0;
          self.screenModeIndex = 3;
          self.cameraFovMAX = 100;
          self.cameraFovMIN = 25;
  
          self.pointerRaycaster = new THREE.Raycaster();
          self.mouse2DVector = new THREE.Vector2();
          self.puckNearDistanceValue = 5;
          self.hotspoNearDistanceValue = 0.3;
          self.puckOpacityValue = 0.5;
          self.previousPuckIndex = -1;
          self.totalProgressValue = 0;
          self.currentProgressValue = 0;
  
          self.hotspotColorArray.push("#ffffff");
          self.hotspotColorArray.push("#000000");
          self.hotspotColorArray.push("#ff0000");
          self.hotspotColorArray.push("#00ff00");
          self.hotspotColorArray.push("#ffff00");
          self.hotspotColorArray.push("#00ffff");
        
          for (let i = 0; i < 20; i++) {
            let highlight = {
              index: i,
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCwnZJXT22z005dHulmKNyNCDiz4FEpjRovNRMx8OBQvUVSBwF'
            }
            self.highLightArray.push(highlight);
          }
          
          self.init();
          self.cameraInit(self.scene)
          self.cameraDollInit(self.scene);
          self.cameraFloorInit(self.scene);
          self.createLight(self.scene);
          
          self.createLoadingUI();
          self.displayLoadingUI();
          self.pointerInit(self.scene);
          self.render();
          
          self.spaceID = self.getParamFromUrl("id");
          if (self.getParamFromUrl("did")) {
            self.deepLinkId = parseInt(self.getParamFromUrl("did"));
          } else {
            self.deepLinkId = 0;
          }
          if (self.deepLinkId !== 0) {
            self.deepLinkCamera = {
              yaw: {
                x: parseFloat(self.getParamFromUrl("yawx")),
                y: parseFloat(self.getParamFromUrl("yawy")),
                z: parseFloat(self.getParamFromUrl("yawz")),
              },
              pit: {
                x: parseFloat(self.getParamFromUrl("pitx")),
                y: parseFloat(self.getParamFromUrl("pity")),
                z: parseFloat(self.getParamFromUrl("pitz")),
              },
              fov: parseFloat(self.getParamFromUrl("fov")),
            }
          }
          if (self.deepLinkId) self.previousPuckIndex = self.deepLinkId;

          let resourceAssets: any = [];
          let resourceUrl: any = "";
          if (self.spaceID) {
            await new Promise(function(resolve, reject) {
              firebase.database().ref(`data/${self.spaceID}`).once('value', async function(snapshot) {
                let buffer = snapshot.val();
                resourceUrl = buffer.resourcePath;
                resolve();
              });
            })
          } else {
            self.isWorkingLocal = true;
            self.resourceID = self.getParamFromUrl("mid");
            if (!self.resourceID) {
              self.resourceID = 'resource'
            }
            // resourceUrl = `../assets/${self.resourceID}.zip`;
            resourceUrl = `../${self.resourceID}.zip`;
          }
          resourceAssets = await self.getresourceFromZip(resourceUrl,
          (percentage: any) =>{
            self.progress("stream");
            self.totalProgressValue = 100;
            self.currentProgressValue = percentage;
          });
          let data = resourceAssets.filter((asset: any) => asset.type === "data")[0];
          self.logoUrl = resourceAssets.filter((asset: any) => asset.type === "logo")[0].original;
          self.logoUrlForMark = resourceAssets.filter((asset: any) => asset.type === "logo")[0].data;
          self.fontJSONUrl = resourceAssets.filter((asset: any) => asset.type === "json")[0].original;
          self.spaceInfo = data.data;
          self.spaceID = self.spaceInfo.uuid;
          self.spaceName = self.spaceInfo.info.name;
          self.spaceCompany = self.spaceInfo.info.company;
          self.spaceVersion = self.spaceInfo.version.name;

          let images = resourceAssets.filter((asset: any) => asset.type === "image");
          
          let path = images.filter((image: any) => image.name.indexOf('Measurement') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('Tag') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('Share') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('POV') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('3D') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('Floorplan') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('Level') !== -1)[0].data;
          self.frontImageArray.push(path);

          path = images.filter((image: any) => image.name.indexOf('Cross_Hair') !== -1)[0].original;
          self.frontImageArray.push(path);

          document.getElementById('logo-image').style.backgroundImage =  `url(${self.logoUrl})`
          document.getElementById('space-name').innerText = self.spaceName;

          let modelUrl = resourceAssets.filter((asset: any) => asset.type === "model")[0].original;
          self.getAssetDataFromZip(modelUrl,
            (percentage: any) =>{
              self.progress("stream");
              self.totalProgressValue = 100;
              self.currentProgressValue = percentage;
            },(data: any) =>{
              self.currentProgressValue = 0;
              self.loadAsset(data.model);
              self.panoDataArray = data.pano;
              self.getData(data.csv).then((res) => {
                // self.changeSkybox(0, false);
              });
          });
        }, 500)
       
      // });  
    // }
  }

  ngOnInit() {
    document.getElementById('content').style.display = 'none';
  }

  dataFileExists(url: any){

      var http = new XMLHttpRequest();

      http.open('GET', url, false);
      http.send();

      return http.status !== 404;

  }

  // async getLatestVersion() {
  //   return new Promise(function(resolve, reject) {
  //     let created = 0;
  //     let name = '';
  //     let key = '';
  //     firebase.database().ref('versions/').once('value').then( function(snapshot) {
  //       let buffer = snapshot.val();
  //       if (!buffer) return;
  //       Object.keys(buffer).forEach(function (vkey, index) {
  //         let data = buffer[vkey];
  //         if (created < data.created) {
  //           created = data.created;
  //           name = data.version;
  //           key =vkey;
  //         }
  //       });
  //       resolve({
  //         name,
  //         key
  //       });
  //     });
  //   });    
  // }

  getParamFromUrl( name: any )
  {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
    return results[1];
  }

  getresourceFromZip(path: any, onProgress: any,) {
    let self = this;
    return new Promise(async function(resolve, reject) {
      let assetBuffer: any = [];
        JSZipUtils.getBinaryContent(path, {
          done: function(data: any) {
            JSZip.loadAsync(data).then(async function (zip) {
              for (let i = 0; i < Object.keys(zip.files).length; i++) {
                let key = Object.keys(zip.files)[i];
                let file = zip.files[key];
                let name = file.name;
                if (!file.dir) {
                  let type = "";
                  let serial = "";
                  if (name.indexOf('/data/') !== -1) {
                    type = "data"
                    serial = "text"
                  } else if (name.indexOf('/logo/') !== -1) {
                    type = "logo"
                    serial = "blob"
                  } else if (name.indexOf('/json/') !== -1) {
                    type = "json"
                    serial = "blob"
                  } else if (name.indexOf('/images/') !== -1) {
                    type = "image"
                    serial = "blob"
                  } else if (name.indexOf('/model/') !== -1) {
                    type = "model"
                    serial = "blob"
                  }
                  if (serial === "text") {
                    await new Promise(function(resolve, reject) {
                      file.async("text").then(function (str) {
                        assetBuffer.push({
                          type,
                          name,
                          data: JSON.parse(str),
                        })
                        resolve();
                      });
                    });
                  } else if (serial === "blob") {
                    await new Promise(function(resolve, reject) {
                      file.async("blob").then(function (blob) {
                        assetBuffer.push({
                          type,
                          name,
                          original: URL.createObjectURL(blob),
                          data: self.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)),
                        })
                        resolve();
                      });
                    });
                  }
                }
              }
              resolve(assetBuffer);
            });
          },
          fail: function(err: any) {
              console.error(err);
              reject(err);
          },
          progress: function(p: any) {
            onProgress(parseInt((p.percent).toFixed(0)));
          }
        });
      })
  }

  getAssetDataFromZip(path: any, onProgress: any, onLoad: any) {
    let self = this;
    JSZipUtils.getBinaryContent(path, {
      done: function(data: any) {
        JSZip.loadAsync(data).then(function (zip) {
          let totalCount = Object.keys(zip.files).filter(key => zip.files[key].dir === false).length;
          let count = 0;
          let assetBuffer: any = [];
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
                  // self.assetBlobURL.push(data.data);
                  assetBuffer.push(data);
                  count++;
                  onProgress(parseInt((count * 100 / totalCount).toFixed(0)));
                  if (count === totalCount) {
                    onLoad(self.getItemDataFromAssets(assetBuffer));
                  }
                });
              } else if (type === "csv" || type === "obj" || type === "mtl") {
                element.async("text").then(function (str) {
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
      fail: function(err: any) {
          console.error(err);
      },
      progress: function(p: any) { /* new */
        onProgress(p.percent);
      }
    });
    } 
  
  getItemDataFromAssets(buffer: any) {
    let model: any = [];
    let csv = "";
    let pano: any = [];
    
    let objElement = buffer.filter((element: any) => element.type === "obj")[0];
    let objKeyPath = objElement.path.replace(objElement.name, "");
    let csvElement = buffer.filter((element: any) => element.type === "csv")[0];
    let csvKeyPath = csvElement.path.replace(csvElement.name, "");

    buffer.forEach((element: any) => {
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

  private init() {
    let self = this;
    const WIDTH = document.body.offsetWidth;
    const HEIGHT =  document.body.offsetHeight;

    this.camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.2, 1000 );
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.position.set(1,20,30);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x222222 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( WIDTH, HEIGHT );
    this.renderer.setClearColor ( 0xffffff, 1 );
    document.body.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', self.onWindowResize.bind(this), false );

    this.skyBox = new THREE.Group();
    
    // this.composer = new THREE.EffectComposer( this.renderer );
    // this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
    // let afterimagePass = new THREE.AfterimagePass();
    // afterimagePass.renderToScreen = true;
    // afterimagePass.uniforms.damp.value= 0.5;
    // this.composer.addPass( afterimagePass );

    this.scene.add( this.skyBox );
    
    return this.scene;
  }

  private render() {
    TWEEN.update();
    if (this.screenModeIndex === 1) {
      this.camera.updateProjectionMatrix();
      this.renderer.render( this.scene, this.camera );
    } else if (this.screenModeIndex === 2) {
      this.cameraDollControl.update()
      this.renderer.render( this.scene, this.cameraDoll );
    }
    else if (this.screenModeIndex === 3) {
      this.cameraFloorControl.update()
      this.renderer.render( this.scene, this.cameraFloor );
    }
    requestAnimationFrame( this.render.bind(this) );
  }

  private onWindowResize() {
    if (this.screenModeIndex === 1) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    } else if (this.screenModeIndex === 2) {
      this.cameraDoll.aspect = window.innerWidth / window.innerHeight;
      this.cameraDoll.updateProjectionMatrix();
    } else if (this.screenModeIndex === 3) {
      this.cameraFloor.aspect = window.innerWidth / window.innerHeight;
      this.cameraFloor.updateProjectionMatrix();
    }
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.composer.setSize( window.innerWidth, window.innerHeight );
  }

  private cameraInit(scene: any) {
    this.camera.position.set(0,0,0);
  }

  private cameraDollInit(scene: any) {
    this.cameraDoll = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.0001, 1000 );
    this.cameraDoll.position.set( 10, 10, 0 );
    if(!THREE.CustomOrbitControls) THREE.CustomOrbitControls = CustomOrbitControls;
    this.cameraDollControl = new THREE.CustomOrbitControls( this.cameraDoll, this.renderer.domElement );
    this.cameraDollControl.screenSpacePanning = false;
    this.cameraDollControl.minDistance = 1;
    this.cameraDollControl.maxDistance = 500;
    // this.cameraDollControl.rotateSpeed = -1;
    this.cameraDollControl.maxPolarAngle = Math.PI / 2;
  }

  private cameraFloorInit(scene: any) {
    this.cameraFloor = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 500);
    this.cameraFloor.position.set( 10, 1, 0 );
    this.cameraFloorControl = new THREE.CustomOrbitControls( this.cameraFloor, this.renderer.domElement );
    this.cameraFloorControl.minDistance = 1;
    this.cameraFloorControl.maxDistance = 500;
    // this.cameraFloorControl.rotateSpeed = -1;
    this.cameraFloorControl.maxPolarAngle = 0;
  }

  private skyboxInit() {
      let textureUrls = [
        this.logoUrl,
        this.logoUrl,
        this.logoUrl,
        this.logoUrl,
        this.logoUrl,
        this.logoUrl
      ];
  
      let materialArray = [];
      for (var i = 0; i < 6; i++) 
      {
        let texture = new THREE.TextureLoader().load(textureUrls[i]); //, function(texture){}
        var material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 1.0,
          side: THREE.BackSide,
          depthTest: false,
        });
       materialArray.push(material);
      }
      
      this.setPlane("y",  Math.PI * 0.5, materialArray[0]); //px
      this.setPlane("y", -Math.PI * 0.5, materialArray[1]); //nx
      this.setPlane("x",  Math.PI * 0.5, materialArray[2]); //ny
      this.setPlane("x",  -Math.PI * 0.5, materialArray[3]); //py
      this.setPlane("y",  0, materialArray[4]); //pz
      this.setPlane("y",  Math.PI, materialArray[5]);// nz
  
      this.skyBox.children[2].rotation.set(0, Math.PI / 2, 0);
      this.skyBox.children[3].rotation.set(0, Math.PI / 2, 0);

      this.skyBox.scale.set(500,500,-500);
      this.skyBox.renderOrder = 1;
      this.scene.add( this.skyBox );
  }

  private changeSceneMode(mode: any) {
    let self = this;
    if (this.screenChangeFlag) return;
    this.screenChangeFlag = true;
    if (!this.loaderDollObject) return;
    let previousModeIndex = this.screenModeIndex;
    this.screenModeIndex = mode;
    if (mode === 1) {
      if (previousModeIndex !== 1) {
        if (this.previousPuckIndex === -1) {
          this.previousPuckIndex = 0;
        }
        if (previousModeIndex === 2) {
          this.cameraYawObject.position.set(this.cameraDoll.position.x, this.cameraDoll.position.y, this.cameraDoll.position.z );
        }
        if (previousModeIndex === 3) {
          this.cameraYawObject.position.set(this.cameraFloor.position.x, this.cameraFloor.position.y, this.cameraFloor.position.z );
        }
        let nextPuck = this.matterDataArray[this.previousPuckIndex];
        this.cameraYawObject.rotation.set(0, 0, 0);
        this.cameraPitchObject.rotation.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
        this.camera.lookAt(new THREE.Vector3(parseFloat(nextPuck.posx), parseFloat(nextPuck.posz), parseFloat(nextPuck.posy)));
        this.cameraDollControl.reset();
        this.cameraFloorControl.reset();
        this.cameraDollControl.enabled = false;
        this.cameraFloorControl.enabled = false;
      }
      let lookNext = (previousModeIndex === 2 || previousModeIndex === 3);
      this.changeSkybox(this.previousPuckIndex, lookNext);
    } else if (mode === 2) {
      this.cameraDollControl.enabled = true;
      this.cameraFloorControl.enabled = false;
      this.cameraFloorControl.reset();
      this.skyBox.visible = false;
      this.cameraDollControl.target = this.getGroupCenterPoint(this.loaderDollObject);
    } else if (mode === 3) {
      this.skyBox.visible = false;
      this.cameraFloorControl.reset();
      this.cameraDollControl.enabled = false;
      this.cameraFloorControl.enabled = true;
      this.cameraFloorControl.target = this.getGroupCenterPoint(this.loaderDollObject);
      // this.cameraFloor.position.set(this.getGroupCenterPoint(this.loaderDollObject).x, this.getGroupCenterPoint(this.loaderDollObject).y + 20, this.getGroupCenterPoint(this.loaderDollObject).z);
      this.cameraFloor.position.set(this.cameraYawObject.position.x, this.cameraYawObject.position.y, this.cameraYawObject.position.z)
      this.cameraFloor.zoom = 50;
      this.cameraFloor.updateProjectionMatrix();
    }
    setTimeout(() => {
      this.screenChangeFlag = false;
    }, 1000)
  } 

  private createLight(scene: any) {
    const ambient = new THREE.HemisphereLight(0xFFFFFf, 0xffffff, 0.65)
    
    ambient.position.set( -0.5, 0.75, -1 );
    scene.add( ambient );

    const ambient_2 = new THREE.HemisphereLight(0xFFFFFF, 0x0f0e0d, 0.65 );
    ambient_2.position.set( -0.5, 0.75, -1 );
    scene.add( ambient_2 );
  }

  private pointerChangeShape(index: any) {
    let geometry;
    let material;
    if (index === 1) {
      geometry = new THREE.PlaneGeometry(0.25, 0.25, 0.25, 0.25);
      let texture = new THREE.TextureLoader().load(this.frontImageArray[7]); //, function(texture){}
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1.0,
        color: 0xffffff,
        side: THREE.DoubleSide,
        depthTest: false,
      });
    } else if (index === 2) {
    geometry = new THREE.TorusGeometry( 0.08, 0.018, 16, 100 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    }
    material.depthWrite = false;
    material.transparent = true;

     return {
       geometry: geometry,
       material:material
     };
  }

  private pointerInit(scene: any) {

    let data = this.pointerChangeShape(2);
    this.pointer = new THREE.Mesh(data.geometry, data.material);

    this.pointer.renderOrder = 999;
    this.pointer.needsUpdate = true;
    this.cameraPitchObject = new THREE.Object3D();
    this.cameraPitchObject.add(this.camera);
    this.cameraPitchObject.position.set(0,0,0);
    this.cameraYawObject = new THREE.Object3D();
    this.cameraYawObject.add( this.cameraPitchObject );
    this.cameraYawObject.position.set(0,0,0);
    
    document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
    document.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
    document.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
    document.addEventListener( 'touchstart', this.onMouseDown.bind(this), false );
    document.addEventListener( 'touchmove', this.onMouseMove.bind(this), false );
    document.addEventListener( 'touchend', this.onMouseUp.bind(this), false );
    document.addEventListener( 'click', this.onMouseClick.bind(this), false );
    document.addEventListener( 'wheel', this.onMouseWheel.bind(this), false );
    document.addEventListener( 'DOMMouseScroll', this.onMouseWheel.bind(this), false );
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);
    this.pointer.renderOrder = 999;

    scene.add(this.cameraYawObject);
    scene.add( this.pointer );
  }

  private onMouseWheel( event: any ) {
    if (event.target.localName !== "canvas") {
      this.mouseDownFlag = false;
      return;
    }
    this.camera.fov -= event.wheelDeltaY * 0.05;
    this.camera.fov = Math.max( Math.min( this.camera.fov, this.cameraFovMAX ), this.cameraFovMIN );
    this.camera.projectionMatrix = new THREE.Matrix4().makePerspective(this.camera.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far);
  }

  private onMouseClick(event: any) {
    if (event.target.localName !== "canvas") {
      this.mouseDownFlag = false;
      return;
    }
    if (this.functionIndex === 1) {
      this.calculateMeasurement();
    } else if (this.functionIndex === 2) {
      if (this.hotspotObject) {
        this.functionIndex = 0;
        return;
      }
      let position = new THREE.Vector3();
      position.copy(this.pointer.position);
      let directionPoint = new THREE.Vector3(); // create once and reuse it!
      this.pointer.getWorldDirection( directionPoint );
      let positionA = new THREE.Vector3(parseFloat(position.x + 0 * directionPoint.x), parseFloat(position.y + 0 * directionPoint.y), parseFloat(position.z + 0 * directionPoint.z));
      let positionB = new THREE.Vector3(parseFloat(position.x + 0.15 * directionPoint.x), parseFloat(position.y + 0.15 * directionPoint.y), parseFloat(position.z + 0.15 * directionPoint.z));
      let element = {
        positionA,
        positionB,
        rotation: this.pointer.rotation,
      }
      this.createHotSpot(element);
      this.showHotPanel(this.hotspotDataArray.length - 1, true);
      this.functionIndex = 0;
    }
  }

  private onMouseDown(event: any) {
    if (event.target.localName !== "canvas") {
      this.mouseDownFlag = false;
      return;
    }
    if (event.type === "touchstart") {
      this.touchStart.x = event.touches[0].clientX;
      this.touchStart.y = event.touches[0].clientY;
    }
    if (event.button === 2) {
      if (this.functionIndex === 1) 
      {
        this.scene.remove(this.measurementText);
        this.scene.remove(this.measurementLine);
        this.measurementFlag = false;
        let data = this.pointerChangeShape(2);
        this.pointer.geometry = data.geometry;
        this.pointer.material = data.material;
        this.pointer.material.needsUpdate = true;
        this.pointer.renderOrder = 999;
      } else if (this.functionIndex === 2) {
        this.hotspotDisplayFlag = false;
        this.hotspotObjectArray.pop();
        this.hotspotDataArray.pop();
        this.scene.remove(this.hotspotObject);
        this.hotspotObject = null;
        document.getElementById('hotspot').style.display = "none";
      } else if (this.functionIndex === 3) {
        document.getElementById('share').style.display = "none";
      }
      this.functionIndex = 0;
      this.mouseMoveFlag = 0;
      this.mouseMovedFlag = 0;
      return;
    }
    this.mouseMoveFlag = 1;
    this.mouseMovedFlag = 1;
    this.mouseDownFlag = true;
    if (event.type === "touchstart") {
      this.onMouseMove(event);
      this.mouseMoveFlag = 1;
      this.mouseMovedFlag = 1;
    }
  }

  private onMouseUp(event: any) {
    if (event.target.localName !== "canvas") {
      this.mouseDownFlag = false;
      return;
    }
    this.mouseDownFlag = false;
    if (this.mouseMoveFlag === 1 && this.functionIndex === 0) {
      let showhot = this.getNearHotspot(this.pointer.position);
      if (!showhot) {
        this.getNearPuck(this.pointer.position, true);
      }
    }
    this.mouseMoveFlag = 0;
  }

  private onMouseMove(event: any) {
    if (this.mouseMoveFlag === 1) {
      if (event.type === "mousemove") {
        if (event.movementX !== 0 && event.movementY !== 0) {
          this.mouseMoveFlag = 2;
        }
      } else {
        this.mouseMoveFlag = 2;
      }
    }
    if (this.mouseMovedFlag === 1) {
      if (event.type === "mousemove") {
        if (event.movementX !== 0 && event.movementY !== 0) {
          this.mouseMovedFlag = 2;
        }
      } else {
        this.mouseMovedFlag = 2;
      }
    }
    
    if (event.target.localName !== "canvas") {
      return;
    }
    let self = this;
    let camera;
    if (this.screenModeIndex === 1) {
      camera = self.camera;
    } else if (this.screenModeIndex === 2 ) {
      camera = self.cameraDoll;
    } else if (this.screenModeIndex === 3) {
      camera = self.cameraFloor;
    }

    if (event.type !== 'touchmove' && event.type !== 'touchstart') {
      self.mouse2DVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      self.mouse2DVector.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    } else {
      self.mouse2DVector.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
      self.mouse2DVector.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
    }

    self.pointerRaycaster.setFromCamera(self.mouse2DVector, camera );

    let intersects = self.pointerRaycaster.intersectObjects( self.scene.children, true);
    let intersect = intersects.filter((element: any) => element.object.type === "Mesh" && element.object.mid && element.object.mid === "wall" || element.object.name === "hotspot")[0];
    if (intersect && intersect.object.name != "point") {
      self.pointer.position.set( 0, 0, 0 );
      let normalMatrix = new THREE.Matrix3().getNormalMatrix( intersect.object.matrixWorld );
      let worldNormal = intersect.face.normal.clone().applyMatrix3( normalMatrix ).normalize();
      self.pointer.lookAt( worldNormal );
      self.pointer.position.copy( intersect.point );
      self.getNearPuck(self.pointer.position, false);
      self.highlightNearHotspot(self.pointer.position);
      if (this.measurementFlag && this.measurementLine) {
        let direction = new THREE.Vector3(); // create once and reuse it!
        this.pointer.getWorldDirection( direction );
        let thirdPos = new THREE.Vector3(intersect.point.x  + 0.1 * direction.x, intersect.point.y + 0.1 * direction.y, intersect.point.z + 0.1 * direction.z );
        this.measurementLine.geometry.vertices[2] = thirdPos;
        this.measurementLine.geometry.verticesNeedUpdate = true;
        let distance = this.measurementLine.geometry.vertices[3].distanceTo( this.measurementLine.geometry.vertices[0] ) * 3.2808333;
        var dir = new THREE.Vector3(); // create once an reuse it
        dir.subVectors( this.measurementLine.geometry.vertices[0], this.measurementLine.geometry.vertices[3] ).normalize();
        this.createText(`${distance.toFixed(2).toString()} ft`, this.measurementLine.geometry.vertices[0], this.measurementLine.geometry.vertices[3]);
      }
    }
    if (!this.mouseDownFlag) return;
    if (event.type === "touchmove") {
      let movementX = (this.touchStart.x - event.changedTouches[0].clientX) || 0;
      let movementY = (this.touchStart.y - event.changedTouches[0].clientY) || 0;
      self.cameraYawObject.rotation.y -= movementX * 0.0001;
      self.cameraPitchObject.rotation.x -= movementY * 0.0001;
    } else {
      let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
      self.cameraYawObject.rotation.y += movementX * 0.002;
      self.cameraPitchObject.rotation.x += movementY * 0.002;
    }
    
    // let PI_2 = Math.PI / 2;
    // self.target_camera_rotation_y += movementX * 0.002;
    // new TWEEN.Tween(self.cameraYawObject.rotation) // Create a new tween that modifies 'coords'.
    // .to({y: self.target_camera_rotation_y}, 600) // Move to (300, 200) in 1 second.
    // .onComplete(function(){
    //   self.camera_rotation_y = true;
    // })
    // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    
    // .start(); // Start the tween immediately.
    // self.target_camera_rotation_x += movementY * 0.002;
    // self.target_camera_rotation_x = Math.max( - PI_2, Math.min( PI_2, self.target_camera_rotation_x ) );
    // new TWEEN.Tween(self.cameraPitchObject.rotation) // Create a new tween that modifies 'coords'.
    // .to({x: self.target_camera_rotation_x}, 600) // Move to (300, 200) in 1 second.
    // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    // .start(); // Start the tween immediately.
  }

  private createText (text: any, pointA: any, pointB: any) {
    if (this.measurementText) {
      this.scene.remove(this.measurementText);
    }
    var mytext = text;
    var text3d = new THREE.TextGeometry(mytext, {
        font: this.measurementFont,
        size: 0.15,
        height: 0.005,
    });
    text3d.text = mytext; // storing this for later use...
    text3d.computeBoundingBox();
    text3d.center();
    var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
    let textMesh = new THREE.Mesh( text3d, textMaterial );
    textMesh.renderOrder = 0.5;
    let pos = this.getPointInBetweenByPerc(pointA, pointB, 0.5);
    let directionPoint = new THREE.Vector3(); // create once and reuse it!
    this.pointer.getWorldDirection( directionPoint );
    let direction = new THREE.Vector3(); // create once an reuse it
    direction.subVectors( new THREE.Vector3(pointA.x, pointA.y, pointA.z), new THREE.Vector3(pointB.x, pointB.y, pointB.z) ).normalize();
    this.measurementText = new THREE.Group();
    let screenPointA = this.Vector3D2ScreenPosition(pointA, this.camera, this.renderer).x;
    let screenPointB = this.Vector3D2ScreenPosition(pointB, this.camera, this.renderer).x;
    if (screenPointA > screenPointB) {
      textMesh.rotation.set(0, -Math.PI / 2, 0);
    } else {
      textMesh.rotation.set(0, Math.PI / 2, 0);
    }
    this.measurementText.add(textMesh);
    this.measurementText.position.set(pos.x, pos.y, pos.z);
    this.measurementText.lookAt(new THREE.Vector3(pos.x + 0.5 * direction.x, pos.y + 0.5 * direction.y, pos.z + 0.5 * direction.z));
    this.measurementText.position.set(pos.x + 0.3 * directionPoint.x, pos.y + 0.3 * directionPoint.y, pos.z + 0.3 * directionPoint.z);
    this.scene.add(this.measurementText);
  }

  private calculateMeasurement () {
    
    if (this.measurementFlag && this.mouseMovedFlag === 2) return
    if (this.measurementFlag) {
      let fourthPos = new THREE.Vector3();
      fourthPos.copy(this.pointer.position);
      this.measurementLine.geometry.vertices[3] = fourthPos;
      this.measurementLine.geometry.verticesNeedUpdate = true;
      this.measurementLine = null;
      this.measurementText = null;
      this.measurementFlag = false;
      this.functionIndex = 0;
      let data = this.pointerChangeShape(2);
      this.pointer.geometry = data.geometry;
      this.pointer.material = data.material;
      this.pointer.material.needsUpdate = true;
      this.pointer.renderOrder = 999;
      return;
    }
    // if (this.screenModeIndex === 1) {
    if (!this.measurementFlag && this.mouseMovedFlag === 1) {  
      let data = this.pointerChangeShape(1);
      this.pointer.geometry = data.geometry;
      this.pointer.material = data.material;
      this.pointer.material.needsUpdate = true;
      this.pointer.renderOrder = 999;
      this.measurementFlag = true;
      let initPos = new THREE.Vector3();
      initPos.copy(this.pointer.position);
      var lineGeom = new THREE.Geometry();
      let direction = new THREE.Vector3(); // create once and reuse it!
      this.pointer.getWorldDirection( direction );
      let secondPos = new THREE.Vector3(initPos.x  + 0.1 * direction.x, initPos.y + 0.1 * direction.y, initPos.z + 0.1 * direction.z );
      let thirdPos = new THREE.Vector3(this.pointer.position.x  + 0.1 * direction.x, this.pointer.position.y + 0.1 * direction.y, this.pointer.position.z + 0.1 * direction.z );
      lineGeom.vertices.push(initPos);
      lineGeom.vertices.push(secondPos);
      lineGeom.vertices.push(thirdPos);
      lineGeom.vertices.push(this.pointer.position);
      var lineMat = new THREE.LineBasicMaterial({
        color: "white",
        transparent: true,
        depthWrite: false,
      });
      this.measurementLine = new THREE.Line(lineGeom, lineMat);
      this.measurementLine.renderOrder = 0.5;
      this.scene.add(this.measurementLine);
    }
  }

  private changeSkybox(index: any, lookNext: any) {
    let self = this;
    if (!self.loaderDollObject) return;

    //first load
    // if (self.deepLinkId !== "" && index !== self.deepLinkId) return;
    // self.deepLinkId = "";

    let puck = this.matterDataArray[index];
    this.previousFloorIndex = (parseInt(puck.floor.toString()) + 1).toString();;
    
    let textures = self.panoDataArray.filter((element: any) => element.file_name.indexOf(puck.uuid) !== -1);

    textures.sort((a: any,b: any) => (a.file_name > b.file_name) ? 1 : ((b.file_name > a.file_name) ? -1 : 0)); 

    let textureUrls = [
      textures[1].data,
      textures[3].data,
      textures[5].data,
      textures[0].data,
      textures[4].data,
      textures[2].data,
    ];

    document.getElementById('mask').style.display = "block";
    self.loadMaterialTexture(textureUrls, false).then(textures => {
      self.skyBox.visible = false;
      for (let i = 0; i < 6; i++) {
        let texture = textures[i];
        texture.needsUpdate = true
        let child = self.skyBox.children[i];
        child.material.map = texture;
        child.material.needsUpdate = true;
        child.material.needsUpdate = true;
        // texture.magFilter = THREE.LinearFilter;
        // texture.minFilter = THREE.LinearFilter;
        // texture.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
        // let child = this.skyBox.children[i];
        // child.material.uniforms.dispFactor.value = 1;
        // child.material.uniforms.texture2.value = texture;
        // child.material.uniforms.texture.value = texture;
        // new TweenMax.to(child.material.uniforms.dispFactor, 0.3, {
        //   value: 1,
        //   ease: Power0.easeNone,
        //   onComplete: function(){
        //     child.material.uniforms.texture.value = texture;
        //   }
        // });
      }
      new TWEEN.Tween(self.cameraYawObject.position) // Create a new tween that modifies 'coords'.
      .to({x: parseFloat(puck.posx), y: parseFloat(puck.posz), z: parseFloat(puck.posy)}, 500) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
      .onComplete(function() {
        self.skyBox.visible = true;
        document.getElementById('mask').style.display = "none";
        // self.loaderDollObject.traverse( function ( child ) {
        //   if (child.type === "Mesh") {
        //     child.material.colorWrite = false; // <================= new
        //     child.renderOrder = 2;
        //     self.loaderMaterialArray.push(child.material);
        //   }
        // });
        if ((self.deepLinkCamera.yaw.x + self.deepLinkCamera.yaw.y + self.deepLinkCamera.yaw.z 
          + self.deepLinkCamera.pit.x + self.deepLinkCamera.pit.y + self.deepLinkCamera.pit.z + self.deepLinkCamera.fov) !== 0) {
            self.cameraYawObject.rotation.set(self.deepLinkCamera.yaw.x, self.deepLinkCamera.yaw.y, self.deepLinkCamera.yaw.z);
            self.cameraPitchObject.rotation.set(self.deepLinkCamera.pit.x, self.deepLinkCamera.pit.y, self.deepLinkCamera.pit.z);
            self.camera.fov = self.deepLinkCamera.fov;
            self.camera.projectionMatrix = new THREE.Matrix4().makePerspective(self.camera.fov, window.innerWidth / window.innerHeight, self.camera.near, self.camera.far);
            self.deepLinkCamera.yaw = self.deepLinkCamera.pit = {x: 0, y: 0, z: 0}
            self.deepLinkCamera.fov = 0;
            self.camera.rotation.set(0, 0, 0);
        } else if (lookNext) {
          self.cameraYawObject.rotation.set(0, 0, 0);
          self.cameraPitchObject.rotation.set(0, 0, 0);
          var vector = new THREE.Vector3();
          self.camera.getWorldDirection( vector );
          let y =  -Math.atan2(vector.z, vector.x) - Math.PI/2;
          self.cameraYawObject.rotation.set(self.cameraYawObject.rotation.x, y, self.cameraYawObject.rotation.z);
          self.camera.rotation.set(0, 0, 0);
        }
      })
      .start();
      this.skyBox.position.set(parseFloat(puck.posx), parseFloat(puck.posz), parseFloat(puck.posy));
      this.skyBox.quaternion.set(parseFloat(puck.quatx), parseFloat(puck.quatz), parseFloat(puck.quaty), parseFloat(puck.quatw));
    })
  }

  private loadMaterialTexture(textureUrls: any, flag: any) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises: any = [];;
       textureUrls.forEach((element: any) => {
        let promise = new Promise(function(resolve, reject) {
          new THREE.TextureLoader().load(element, (texture: any) => {
            if (flag) {
              texture.dispose();
            }
            self.currentProgressValue++;
            console.log(self.currentProgressValue);
            self.progress("texture");
            resolve(texture);  
          })
        });
        promises.push(promise);
      });
      
      return Promise.all(promises).then(function(value) {
        resolve(value);
      });
    });
    
  }

  private setPlane(axis: any, angle: any, material: any) {
    let planeGeom = new THREE.PlaneGeometry(1, 1, 1, 1);
    planeGeom.translate(0, 0, 0.5);
    switch (axis) {
      case 'y':
        planeGeom.rotateY(angle);
        break;
      default:
        planeGeom.rotateX(angle);
    }
    let plane = new THREE.Mesh(planeGeom, material);
    this.skyBox.add(plane);
  }

  private createHotSpot(element: any) {
    if (this.hotspotObject) return;
    let geometry = new THREE.SphereGeometry( 0.06, 120, 120 );
    let material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, opacity: 0.5 } );
    material.transparent = true;
    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(element.positionB.x, element.positionB.y, element.positionB.z);
    mesh.name = "hotspot"
    mesh.renderOrder = 5;
    let outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0xff00ff, side: THREE.BackSide } );
    outlineMaterial1.transparent = true;
    let outlineMesh1 = new THREE.Mesh( geometry, outlineMaterial1 );
    outlineMesh1.position.copy(mesh.position);
    outlineMesh1.renderOrder = 5;
    outlineMesh1.scale.multiplyScalar(1.1);
    let lineGeometry = new THREE.BufferGeometry();
    let points = [];
    points.push(element.positionA.x, element.positionA.y, element.positionA.z);
    points.push(element.positionB.x, element.positionB.y, element.positionB.z);
    lineGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( points, 3 ) );
    let line_material = new THREE.LineBasicMaterial( {
      color: 0xffffff,
      linewidth: 10,
      transparent: true,
      opacity: 0.3,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin:  'round' //ignored by WebGLRenderer
    } );
    let object = new THREE.Line( lineGeometry, line_material);
    object.renderOrder = 5;
    // let geometryBottom = new THREE.RingGeometry( 0.06, 0.15, 120 );
    // let materialBottom = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, opacity: 0.6 } );
    // let meshBottom = new THREE.Mesh( geometryBottom, materialBottom );
    // meshBottom.position.set(element.positionA.x, element.positionA.y, element.positionA.z);
    // meshBottom.rotation.copy(element.rotation)
    // meshBottom.material.transparent = true;
    // meshBottom.renderOrder = 5;
    // meshBottom.opacity = this.puckOpacityValue;
    let group = new THREE.Group();
    // group.add(object);
    group.add(mesh);
    group.add(outlineMesh1);
    // group.add(meshBottom);
    this.hotspotObject = group;
    this.hotspotObjectArray.push(group);
    let data = {
      position: element.positionB,
      rotation: element.rotation,
      title: "Title",
      content: "Content",
      isNew: true,
      colorIndex: 0,
    }
    this.hotspotDataArray.push(data);
    this.scene.add(group);
  }

  private createPuck(element: any) {
    let geometry = new THREE.RingGeometry( 0.1, 0.15, 32 );
    let material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(parseFloat(element.puckx), parseFloat(element.puckz) + 0.05, parseFloat(element.pucky));
    this.rotateAroundWorldAxis(mesh, new THREE.Vector3(1,0,0), Math.PI / 2);
    mesh.name = "puck";
    mesh.material.transparent = true;
    mesh.material.opacity = this.puckOpacityValue;
    mesh.renderOrder = 3;
    this.puckObjectArray.push(mesh);
    this.scene.add(mesh);
  }

  private getNearHotspot(point: any) {
    let min = 1000;
    let near_element = -1;
    let distance = 0;
    for (let i = 0; i < this.hotspotDataArray.length; i++) {
      distance = point.distanceTo(new THREE.Vector3(parseFloat(this.hotspotDataArray[i].position.x),parseFloat(this.hotspotDataArray[i].position.y),parseFloat(this.hotspotDataArray[i].position.z) ));
      if (distance < min) {
        min = distance;
        near_element = i;
      }
    }
    if (min < this.hotspoNearDistanceValue && near_element != -1 && !this.hotspotObject) {
      this.showHotPanel(near_element, true);
      return true;
    }
    return false;
  }

  private cameraLookAt(position: any) {
      this.cameraYawObject.rotation.set(0, 0, 0);
      this.cameraPitchObject.rotation.set(0, 0, 0);
      this.camera.rotation.set(0, 0, 0);
      this.camera.lookAt(position);
      var vector = new THREE.Vector3();
      this.camera.getWorldDirection( vector );
      let y =  -Math.atan2(vector.z, vector.x) - Math.PI/2;
      this.cameraYawObject.rotation.set(this.cameraYawObject.rotation.x, y, this.cameraYawObject.rotation.z);
      this.camera.rotation.set(0, 0, 0);
  }

  private highlightNearHotspot(point: any) {
    this.hotspotObjectArray.forEach((element: any) => {
      let distance = point.distanceTo(new THREE.Vector3(element.children[0].position.x, element.children[0].position.y, element.children[0].position.z));
      if (distance < 0.06) {
        element.children.filter((element: any) => element.name === "hotspot")[0].material.opacity = 1;
      } else {
        element.children.filter((element: any) => element.name === "hotspot")[0].material.opacity = 0.5;
      }
    })
    
  }
  
  private getNearPuck(point: any, flag: any) {
    let min = 1000;
    let near_element = -1;
    let distance = 0;
    for (let i = 0; i < this.matterDataArray.length; i++) {
      distance = point.distanceTo(new THREE.Vector3(parseFloat(this.matterDataArray[i].puckx),parseFloat(this.matterDataArray[i].puckz),parseFloat(this.matterDataArray[i].pucky) ));
      if (distance < min) {
        min = distance;
        near_element = i;
      }
    }

    this.puckObjectArray.filter((puck: any) => puck.material.opacity === 1).forEach((puck: any) => {
      puck.material.opacity = this.puckOpacityValue;
    })

    if (min < this.puckNearDistanceValue && near_element != -1) {
      this.puckObjectArray[near_element].material.opacity = 1;
      if (flag) {
        if (this.previousPuckIndex === near_element && this.screenModeIndex === 1) return;
        this.previousPuckIndex = near_element;
        if (this.screenModeIndex === 2 || this.screenModeIndex === 3) {
          this.changeSceneMode(1); 
        } else {
          this.changeSkybox(this.previousPuckIndex, false);
        }
      }
    }
  }

  private getData(data: any) {
    let self = this;
    return new Promise((resolve, reject) => {
        const keys: string[] = [];
        data.split('\n').forEach(function (line: string, lineNumber: number) {
          if (line.trim().length === 0) {
              return;
          }
          const element: any = {};
          line.split(',').forEach(function (entry: string, idx: number) {
              let trimmedEntry = entry.trim();
              if (lineNumber === 0) {
                  keys[idx] = trimmedEntry.toLowerCase();
              } else {
                element[keys[idx]] = trimmedEntry;
              }
          });
          if (lineNumber !== 0) {
            element.posy = (-parseFloat(element.posy)).toString();
            element.pucky = (-parseFloat(element.pucky)).toString();
            if (self.floorDataArray.indexOf((parseInt(element.floor) + 1).toString()) === -1) {
              self.floorDataArray.push((parseInt(element.floor) + 1).toString());
            }
            self.matterDataArray.push(element);
          }
          if ((lineNumber !== 0) && (element.alignment !== '2')) {
            self.createPuck(element);
          }
        });
        resolve(self.matterDataArray);
        console.log(self.matterDataArray);
        self.skyboxInit();
    });
  }

  private showHotPanel(index: any, flag: any) {
    if (flag) {
      let element = this.hotspotDataArray[index];
      this.hotspot_title = element.title;
      this.hotspot_content = element.content;
      this.hotspotSelectedIndex = index;
      this.hotspotColorIndex = element.colorIndex;
      document.getElementById('hotspot').style.display = "block";
      this.hotspotDisplayFlag = true;
    } else {
      document.getElementById('hotspot').style.display = "none";
      this.hotspotSelectedIndex = -1;
      this.hotspotDisplayFlag = false;
      return;
    }
  }

  private rotateAroundWorldAxis(object: any, axis: any, radians: any) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  private getPointInBetweenByPerc(pointA: any, pointB: any, percentage: any) {
    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len*percentage);
    return pointA.clone().add(dir);
  }

  private Vector3D2ScreenPosition(pos3D: any, camera: any, renderer: any) {
    var vector = new THREE.Vector3(pos3D.x, pos3D.y, pos3D.z);
    var widthHalf = 0.5* renderer.context.canvas.clientWidth;
    var heightHalf = 0.5* renderer.context.canvas.clientHeight;
    vector.project(camera);
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;
    return { 
        x: vector.x,
        y: vector.y
    };
  }

  private toScreenPosition(renderer: any, obj: any, camera: any)
  {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5* renderer.context.canvas.clientWidth;
    var heightHalf = 0.5* renderer.context.canvas.clientHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };
  };

  private getGroupCenterPoint(group: any) {
    let boundingBox = new THREE.Box3().setFromObject( group );
    var middle = new THREE.Vector3();
    middle.x = (boundingBox.max.x + boundingBox.min.x) / 2;
    middle.y = (boundingBox.max.y + boundingBox.min.y) / 2;
    middle.z = (boundingBox.max.z + boundingBox.min.z) / 2;
    return middle;
  }

  private loadAsset(values: any) {

    let self = this;
    let obj_data = '';
    let mtl_data = '';
    let texture_info = [];

    self.progress("init");

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

    let loaderFont = new THREE.FontLoader();

    loaderFont.load( self.fontJSONUrl, function ( font: any ) {
      self.measurementFont = font;
    } );

    let loading_manager = new THREE.LoadingManager();

    loading_manager.onLoad = function ( ) {
      self.progress("loadend");
      setTimeout(() => {
        // self.spinner.hide();
        self.hideLoadingUI();
      }, 5000)
      setTimeout(() => {
        self.progress("done");
      }, 4000)
    };
    if (!THREE.MTLLoader) THREE.MTLLoader = MTLLoader;
    let loader = new THREE.MTLLoader();
    loader.setCrossOrigin( true );
    loader.setMaterialOptions( { ignoreZeroRGBs: false } );
    loader.setTexturePath( texture_info );
    if (this.loaderAlphaTest != undefined) {
      loader.setAlpahTestOption(true);
    }
    loader.loadText( mtl_data, function ( materials: any ) {
      if (!THREE.OBJLoader) THREE.OBJLoader = OBJLoader;

      let loader = new THREE.OBJLoader(loading_manager);

      materials.baseUrl.forEach((element: any) => {
        self.loaderTextureUrlArray.push(element.obj_url);
      });

      console.log(self.loaderTextureUrlArray.length);
      self.totalProgressValue = self.loaderTextureUrlArray.length;

      self.loadMaterialTexture(self.loaderTextureUrlArray, true).then((textures) => {
        console.log(textures);
        loader.setMaterials( materials );
        self.progress("obj");
        loader.loadText( obj_data, function ( object: any ) {
        object.traverse( function ( child: any ) {
          if (child.type === "Mesh") {
            child.material.colorWrite = true; // <================= new
            child.material.side = THREE.FrontSide;
            child.renderOrder = 2;
            child.mid = "wall";
            self.loaderMaterialArray.push(child.material);
          }
        });
        self.rotateAroundWorldAxis(object, new THREE.Vector3(1,0,0), Math.PI / 2 );
        self.rotateAroundWorldAxis(object, new THREE.Vector3(0,0,1), Math.PI);
        self.rotateAroundWorldAxis(object, new THREE.Vector3(0,1,0), Math.PI);
        object.scale.set(1,1,1);
        object.position.set(0,0,0);
        self.loaderDollObject = object;
        self.scene.add( object );
        if (self.deepLinkId === 0) {
          self.changeSceneMode(2);
        }
        self.progress("loadend");
        setTimeout(() => {
          // self.spinner.hide();
          self.hideLoadingUI();
          if (self.deepLinkId !== 0) {
            self.changeSceneMode(1);
            // self.changeSkybox(self.deepLinkId, false);
          }
        }, 5000)
        setTimeout(() => {
          self.progress("done");
        }, 4000)
      } );
      });
    } );
  }

  private generateShareURL() {
    console.log(this.cameraYawObject)
    console.log(this.cameraPitchObject)
    let yaw = this.cameraYawObject.rotation;
    let pit = this.cameraPitchObject.rotation;
    let fov = this.camera.fov;
    let spaceID = `id=${this.spaceID}`;
    if (this.isWorkingLocal) spaceID = "";
    this.shareableURL = `${window.location.origin}/?${spaceID}`;
    this.deepLinkURL = `${window.location.origin}/?${spaceID}&did=${this.previousPuckIndex}&yawx=${yaw._x}&yawy=${yaw._y}&yawz=${yaw._z}&pitx=${pit._x}&pity=${pit._y}&pitz=${pit._z}&fov=${fov}`;
  }

  private progress(state: any) {
    if (this.totalProgressValue) {
      let text = "";
      if (state === "init") {
        text = "Analysis Data...";
      }
      if (state === "prestream") {
        text = "Starting Downloading...";
      }
      if (state === "stream") {
        text = "Downloading Assets...";
        let progress = `${this.currentProgressValue/this.totalProgressValue*100}%`
        document.getElementById('progress_value').style.width = progress;
      }
      if (state === "texture") {
        text = "Loading Textures...";
        let progress = `${this.currentProgressValue/this.totalProgressValue*100}%`
        document.getElementById('progress_value').style.width = progress;
      }
      if (state === "obj") {
        text = "Building Models...";
        var coords_model = { x: 0 }; // Start at (0, 0)
        new TWEEN.Tween(coords_model) // Create a new tween that modifies 'coords'.
        .to({ x: 100}, 5000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
          let progress = `${coords_model.x}%`
          document.getElementById('progress_value').style.width = progress;
        })
        .start(); // Start the tween immediately.
      }
      if (state === "loadend") {
        text = "Preparing Scene...";
        var coords = { x: 0 }; // Start at (0, 0)
        new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: 100}, 3000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
          let progress = `${coords.x}%`
          document.getElementById('progress_value').style.width = progress;
        })
        .start(); // Start the tween immediately.
      }
      if (state === "done") {
        text = "Complete";
      }
      document.getElementById('progress_text').innerHTML = text;
    }
  }
  
  toggleMeasurment(event: any) {
  }
  toggleInfoViewShow (event: any) {
    this.infoViewShow = !this.infoViewShow;
  }
  toggleTitleIndex (event: any, index: any) {
    this.titleIndex =this.PrevtitleIndex= index;
    this.ControlPanelShow = true;
    this.functionIndex = 0;
  }
  toggleSceneModeIndex(index: any) {
    this.changeSceneMode(index);
  }
  toggleHighLightIndex(index: any) {
    this.previousPuckIndex = index;
    this.changeSceneMode(1);
  }
  toggleFuctionsIndex(index: any) {
    if (this.measurementFlag === true) {
      this.calculateMeasurement();
    }
    if (index === 3) {
      this.generateShareURL();
      document.getElementById('share').style.display = "block";
    } else {
      document.getElementById('share').style.display = "none";
    }
    if (this.functionIndex === index) {
      this.functionIndex = 0;
      document.getElementById('share').style.display = "none";
      document.getElementById('hotspot').style.display = "none";
      return;
    }
    this.functionIndex = index;
  }
  hotSpotColorSelect(index: any) {
    this.hotspotColorIndex = index;
    this.hotspotDataArray[this.hotspotSelectedIndex].colorIndex = this.hotspotColorIndex;
    this.hotspotObjectArray[this.hotspotSelectedIndex].children.filter((element: any) => element.name === "hotspot")[0].material.color.set(this.hotspotColorArray[this.hotspotColorIndex]);
  }
  hotSpotSave() {
    this.hotspotDataArray[this.hotspotSelectedIndex].title = this.hotspot_title;
    this.hotspotDataArray[this.hotspotSelectedIndex].content = this.hotspot_content;
    this.hotspotDataArray[this.hotspotSelectedIndex].isNew = false;
    this.hotspotObject = null;
    this.showHotPanel(-1, false);
    this.functionIndex = 0;
  }
  hotSpotCancel() {
    if (this.hotspotDataArray[this.hotspotSelectedIndex].isNew) {
      this.hotspotObjectArray.pop();
      this.hotspotDataArray.pop();
      this.scene.remove(this.hotspotObject);
    }
    this.hotspotObject = null;
    this.showHotPanel(-1, false);
    this.functionIndex = 0;
  }
  createLoadingUI() {
    this.loadingScreen = document.createElement('div');
    this.loadingScreen.className = 'loading-screen';
    this.loadingScreen.style.position = 'absolute';
    this.loadingScreen.style.top = 0;
    this.loadingScreen.style.bottom = 0;
    this.loadingScreen.style.left = 0;
    this.loadingScreen.style.right = 0;

    const logoImage = document.createElement('div');
    logoImage.id = "logo-image";
    logoImage.className = 'logo background';
    // logoImage.style.backgroundImage =  `url(${this.logoUrl})`;
    logoImage.style.display= 'inline-block';
    logoImage.style.backgroundSize = 'contain';
    logoImage.style.backgroundColor = 'black';
    logoImage.style.opacity = '0.2';
    logoImage.style.backgroundRepeat = 'no-repeat';
    logoImage.style.backgroundPosition = "center center";
    logoImage.style.position = "absolute";
    logoImage.style.width = "50%";
    logoImage.style.height = "50%";
    logoImage.style.top = "18%";
    logoImage.style.left = "25%";
    this.loadingScreen.appendChild(logoImage);

    const logoTitle = document.createElement('div');
    logoTitle.id = "space-name";
    logoTitle.style.position =  'absolute';
    logoTitle.style.fontSize = '60px';
    logoTitle.style.textAlign = 'center';
    logoTitle.style.color = 'white';
    logoTitle.style.width= '100%';
    logoTitle.style.top = '35%';
    // logoTitle.innerText = this.spaceName;
    this.loadingScreen.appendChild(logoTitle);

    const logoCompany = document.createElement('div');
    logoCompany.style.position =  'absolute';
    logoCompany.style.fontSize = '48px';
    logoCompany.style.textAlign = 'center';
    logoCompany.style.color = 'white';
    logoCompany.style.width= '100%';
    logoCompany.style.top = '50%';
    logoCompany.innerText = "Geopro Consultants";
    this.loadingScreen.appendChild(logoCompany);


    const logoProgress = document.createElement('div');
    logoProgress.className = 'logo progress';
    logoProgress.style.position =  `absolute`;
    logoProgress.style.width= '30vw';
    logoProgress.style.height= '10px';
    logoProgress.style.left = '35vw';
    logoProgress.style.bottom = '20vh';
    logoProgress.style.background = "brown";

    const logoProgressValue = document.createElement('div');
    logoProgressValue.id = 'progress_value';
    logoProgressValue.className = 'logo progress';
    logoProgressValue.style.width= '0%';
    logoProgressValue.style.height= '10px';
    logoProgressValue.style.background = "wheat";

    logoProgress.appendChild(logoProgressValue);
    this.loadingScreen.appendChild(logoProgress);

    const logoProgressText = document.createElement('div');
    logoProgressText.id = 'progress_text';
    logoProgressText.className = 'logo progress';
    logoProgressText.style.position =  `absolute`;
    logoProgressText.style.width= '30vw';
    logoProgressText.style.height= '20px';
    logoProgressText.style.left = '35vw';
    logoProgressText.style.bottom = '25vh';
    logoProgressText.style.color = 'wheat';

    this.loadingScreen.appendChild(logoProgressText);
  }
  displayLoadingUI() {
    document.getElementById('content').style.display = 'block';
    this.loadingScreen.style.backgroundColor = "#000000";
    document.getElementById('content').appendChild(this.loadingScreen);
  }
  hideLoadingUI() {
    this.totalProgressValue = 0;
    document.getElementById('content').removeChild(this.loadingScreen);
  }
  copyToClipboard (str: any) {
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
  shareableCopy() {
    this.titleIndex = 0;
    this.functionIndex = 0;
    this.copyToClipboard(this.shareableURL)
    alert("copied")
    document.getElementById('share').style.display = "none";
  }
  deepLinkCopy() {
    this.titleIndex = 0;
    this.functionIndex = 0;
    this.copyToClipboard(this.deepLinkURL)
    alert("copied")
    document.getElementById('share').style.display = "none";
  }
  toggleFloorPanel() {
    this.showFloorPanel = !this.showFloorPanel;
    if (this.showFloorPanel) {
      let length = this.floorDataArray.length;
      // document.getElementById('floor_list').style.top = `${length * 30 + 20}px`;
    }
  }
  toggleControlPanelShow () {
    this.ControlPanelShow = !this.ControlPanelShow;
    if (this.ControlPanelShow) {
      if (!this.PrevtitleIndex) this.PrevtitleIndex = 1;
      this.titleIndex = this.PrevtitleIndex;
    } else {
      this.titleIndex = 0;
    }
  }
  gotoFloor(index: any) {
    let value = (parseInt(index) - 1).toString();
    let element = this.matterDataArray.filter((element: any) => element.floor === value)[0];
    let indexFloor = this.matterDataArray.indexOf(element);
    if (this.screenModeIndex !== 1) {
      this.previousPuckIndex = indexFloor;
      this.changeSceneMode(1);
    } else {
      this.changeSkybox(this.matterDataArray.indexOf(element), true);
    }
    this.previousPuckIndex
  }
}
