"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ngx_spinner_1 = require("ngx-spinner");
var platform_browser_1 = require("@angular/platform-browser");
require("zone.js");
var JSZip = require("jszip");
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDXKzso_ggPDSk3C4AIBovCxJQND7SAD5w",
    authDomain: "vrtour-42ece.firebaseapp.com",
    databaseURL: "https://vrtour-42ece.firebaseio.com",
    projectId: "vrtour-42ece",
    storageBucket: "vrtour-42ece.appspot.com",
    messagingSenderId: "709265075578"
};
var app = firebase.initializeApp(config);
var AppComponent = /** @class */ (function () {
    function AppComponent(http, spinner, sanitizer) {
        var _this = this;
        this.http = http;
        this.spinner = spinner;
        this.sanitizer = sanitizer;
        this.title = 'VR';
        this.touchStart = {
            x: 0,
            y: 0,
        };
        this.hotspotColorArray = [];
        this.measurementThirdPoint = new THREE.Vector3();
        this.loaderMaterialArray = [];
        this.loaderTextureUrlArray = [];
        // data
        this.matterDataArray = [];
        this.panoDataArray = [];
        this.floorDataArray = [];
        this.hotspotDataArray = [];
        this.puckObjectArray = [];
        this.hotspotObjectArray = [];
        // UI
        this.showWindow = false;
        this.infoViewShow = true;
        this.highLightArray = [];
        this.showFloorPanel = false;
        this.ControlPanelShow = false;
        this.UIEventFired = false;
        this.spaceVersion = "DS";
        // Misc
        this.screenChangeFlag = false;
        // unused
        this.target_camera_rotation_y = 0;
        this.target_camera_rotation_x = 0;
        this.logoUrl = "";
        this.spaceName = "Download Assets...";
        this.deepLinkCamera = {
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
        };
        this.isWorkingLocal = false;
        this.frontImageArray = [];
        this.fontJSONUrl = "";
        var self = this;
        // window.onload = function() {
        // document.getElementById('readyForRun').addEventListener('click', (event) => {
        self.showWindow = true;
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var i, highlight, resourceAssets, resourceUrl, data, images, path, modelUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        for (i = 0; i < 20; i++) {
                            highlight = {
                                index: i,
                                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCwnZJXT22z005dHulmKNyNCDiz4FEpjRovNRMx8OBQvUVSBwF'
                            };
                            self.highLightArray.push(highlight);
                        }
                        self.init();
                        self.cameraInit(self.scene);
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
                        }
                        else {
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
                            };
                        }
                        if (self.deepLinkId)
                            self.previousPuckIndex = self.deepLinkId;
                        resourceAssets = [];
                        resourceUrl = "";
                        if (!self.spaceID) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                firebase.database().ref("data/" + self.spaceID).once('value', function (snapshot) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var buffer;
                                        return __generator(this, function (_a) {
                                            buffer = snapshot.val();
                                            resourceUrl = buffer.resourcePath;
                                            resolve();
                                            return [2 /*return*/];
                                        });
                                    });
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        self.isWorkingLocal = true;
                        self.resourceID = self.getParamFromUrl("mid");
                        if (!self.resourceID) {
                            self.resourceID = 'resource';
                        }
                        // resourceUrl = `../assets/${self.resourceID}.zip`;
                        resourceUrl = "../" + self.resourceID + ".zip";
                        _a.label = 3;
                    case 3: return [4 /*yield*/, self.getresourceFromZip(resourceUrl, function (percentage) {
                            self.progress("stream");
                            self.totalProgressValue = 100;
                            self.currentProgressValue = percentage;
                        })];
                    case 4:
                        resourceAssets = _a.sent();
                        data = resourceAssets.filter(function (asset) { return asset.type === "data"; })[0];
                        self.logoUrl = resourceAssets.filter(function (asset) { return asset.type === "logo"; })[0].original;
                        self.logoUrlForMark = resourceAssets.filter(function (asset) { return asset.type === "logo"; })[0].data;
                        self.fontJSONUrl = resourceAssets.filter(function (asset) { return asset.type === "json"; })[0].original;
                        self.spaceInfo = data.data;
                        self.spaceID = self.spaceInfo.uuid;
                        self.spaceName = self.spaceInfo.info.name;
                        self.spaceCompany = self.spaceInfo.info.company;
                        self.spaceVersion = self.spaceInfo.version.name;
                        images = resourceAssets.filter(function (asset) { return asset.type === "image"; });
                        path = images.filter(function (image) { return image.name.indexOf('Measurement') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('Tag') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('Share') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('POV') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('3D') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('Floorplan') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('Level') !== -1; })[0].data;
                        self.frontImageArray.push(path);
                        path = images.filter(function (image) { return image.name.indexOf('Cross_Hair') !== -1; })[0].original;
                        self.frontImageArray.push(path);
                        document.getElementById('logo-image').style.backgroundImage = "url(" + self.logoUrl + ")";
                        document.getElementById('space-name').innerText = self.spaceName;
                        modelUrl = resourceAssets.filter(function (asset) { return asset.type === "model"; })[0].original;
                        self.getAssetDataFromZip(modelUrl, function (percentage) {
                            self.progress("stream");
                            self.totalProgressValue = 100;
                            self.currentProgressValue = percentage;
                        }, function (data) {
                            self.currentProgressValue = 0;
                            self.loadAsset(data.model);
                            self.panoDataArray = data.pano;
                            self.getData(data.csv).then(function (res) {
                                // self.changeSkybox(0, false);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        }); }, 500);
        // });  
        // }
    }
    AppComponent.prototype.ngOnInit = function () {
        document.getElementById('content').style.display = 'none';
    };
    AppComponent.prototype.dataFileExists = function (url) {
        var http = new XMLHttpRequest();
        http.open('GET', url, false);
        http.send();
        return http.status !== 404;
    };
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
    AppComponent.prototype.getParamFromUrl = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return "";
        else
            return results[1];
    };
    AppComponent.prototype.getresourceFromZip = function (path, onProgress) {
        var self = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var assetBuffer;
                return __generator(this, function (_a) {
                    assetBuffer = [];
                    JSZipUtils.getBinaryContent(path, {
                        done: function (data) {
                            JSZip.loadAsync(data).then(function (zip) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _loop_1, i;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _loop_1 = function (i) {
                                                    var key, file, name_1, type_1, serial;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                key = Object.keys(zip.files)[i];
                                                                file = zip.files[key];
                                                                name_1 = file.name;
                                                                if (!!file.dir) return [3 /*break*/, 4];
                                                                type_1 = "";
                                                                serial = "";
                                                                if (name_1.indexOf('/data/') !== -1) {
                                                                    type_1 = "data";
                                                                    serial = "text";
                                                                }
                                                                else if (name_1.indexOf('/logo/') !== -1) {
                                                                    type_1 = "logo";
                                                                    serial = "blob";
                                                                }
                                                                else if (name_1.indexOf('/json/') !== -1) {
                                                                    type_1 = "json";
                                                                    serial = "blob";
                                                                }
                                                                else if (name_1.indexOf('/images/') !== -1) {
                                                                    type_1 = "image";
                                                                    serial = "blob";
                                                                }
                                                                else if (name_1.indexOf('/model/') !== -1) {
                                                                    type_1 = "model";
                                                                    serial = "blob";
                                                                }
                                                                if (!(serial === "text")) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                                        file.async("text").then(function (str) {
                                                                            assetBuffer.push({
                                                                                type: type_1,
                                                                                name: name_1,
                                                                                data: JSON.parse(str),
                                                                            });
                                                                            resolve();
                                                                        });
                                                                    })];
                                                            case 1:
                                                                _a.sent();
                                                                return [3 /*break*/, 4];
                                                            case 2:
                                                                if (!(serial === "blob")) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                                        file.async("blob").then(function (blob) {
                                                                            assetBuffer.push({
                                                                                type: type_1,
                                                                                name: name_1,
                                                                                original: URL.createObjectURL(blob),
                                                                                data: self.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)),
                                                                            });
                                                                            resolve();
                                                                        });
                                                                    })];
                                                            case 3:
                                                                _a.sent();
                                                                _a.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                };
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < Object.keys(zip.files).length)) return [3 /*break*/, 4];
                                                return [5 /*yield**/, _loop_1(i)];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 4:
                                                resolve(assetBuffer);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        },
                        fail: function (err) {
                            console.error(err);
                            reject(err);
                        },
                        progress: function (p) {
                            onProgress(parseInt((p.percent).toFixed(0)));
                        }
                    });
                    return [2 /*return*/];
                });
            });
        });
    };
    AppComponent.prototype.getAssetDataFromZip = function (path, onProgress, onLoad) {
        var self = this;
        JSZipUtils.getBinaryContent(path, {
            done: function (data) {
                JSZip.loadAsync(data).then(function (zip) {
                    var totalCount = Object.keys(zip.files).filter(function (key) { return zip.files[key].dir === false; }).length;
                    var count = 0;
                    var assetBuffer = [];
                    Object.keys(zip.files).forEach(function (key, index) {
                        var element = zip.files[key];
                        if (!element.dir) {
                            var type_2 = element.name.split('.').pop();
                            var name_2 = element.name.split('/').pop();
                            var path_1 = element.name;
                            if (type_2 === "jpg") {
                                element.async("blob").then(function (blob) {
                                    var data = {
                                        type: type_2,
                                        name: name_2,
                                        path: path_1,
                                        data: URL.createObjectURL(blob),
                                        dtype: "blob"
                                    };
                                    // self.assetBlobURL.push(data.data);
                                    assetBuffer.push(data);
                                    count++;
                                    onProgress(parseInt((count * 100 / totalCount).toFixed(0)));
                                    if (count === totalCount) {
                                        onLoad(self.getItemDataFromAssets(assetBuffer));
                                    }
                                });
                            }
                            else if (type_2 === "csv" || type_2 === "obj" || type_2 === "mtl") {
                                element.async("text").then(function (str) {
                                    var data = {
                                        type: type_2,
                                        name: name_2,
                                        path: path_1,
                                        data: str,
                                        dtype: "string"
                                    };
                                    assetBuffer.push(data);
                                    count++;
                                    onProgress(parseInt((count * 100 / totalCount).toFixed(0)));
                                    if (count === totalCount) {
                                        onLoad(self.getItemDataFromAssets(assetBuffer));
                                    }
                                });
                            }
                            else {
                                count++;
                            }
                        }
                    });
                });
            },
            fail: function (err) {
                console.error(err);
            },
            progress: function (p) {
                onProgress(p.percent);
            }
        });
    };
    AppComponent.prototype.getItemDataFromAssets = function (buffer) {
        var model = [];
        var csv = "";
        var pano = [];
        var objElement = buffer.filter(function (element) { return element.type === "obj"; })[0];
        var objKeyPath = objElement.path.replace(objElement.name, "");
        var csvElement = buffer.filter(function (element) { return element.type === "csv"; })[0];
        var csvKeyPath = csvElement.path.replace(csvElement.name, "");
        buffer.forEach(function (element) {
            if (element.path.indexOf(objKeyPath) !== -1) { /// obj
                var data = {
                    extenstion: element.type,
                    file_name: element.name,
                    url: element.path,
                    data: element.data,
                };
                model.push(data);
            }
            else if (element.path.indexOf(csvKeyPath) !== -1) {
                csv = element.data;
            }
            else {
                var data = {
                    extenstion: element.type,
                    file_name: element.name,
                    url: element.path,
                    data: element.data,
                };
                pano.push(data);
            }
        });
        return {
            model: model,
            csv: csv,
            pano: pano,
        };
    };
    AppComponent.prototype.init = function () {
        var self = this;
        var WIDTH = document.body.offsetWidth;
        var HEIGHT = document.body.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.2, 1000);
        this.camera.aspect = WIDTH / HEIGHT;
        this.camera.position.set(1, 20, 30);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(WIDTH, HEIGHT);
        this.renderer.setClearColor(0xffffff, 1);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', self.onWindowResize.bind(this), false);
        this.skyBox = new THREE.Group();
        // this.composer = new THREE.EffectComposer( this.renderer );
        // this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        // let afterimagePass = new THREE.AfterimagePass();
        // afterimagePass.renderToScreen = true;
        // afterimagePass.uniforms.damp.value= 0.5;
        // this.composer.addPass( afterimagePass );
        this.scene.add(this.skyBox);
        return this.scene;
    };
    AppComponent.prototype.render = function () {
        TWEEN.update();
        if (this.screenModeIndex === 1) {
            this.camera.updateProjectionMatrix();
            this.renderer.render(this.scene, this.camera);
        }
        else if (this.screenModeIndex === 2) {
            this.cameraDollControl.update();
            this.renderer.render(this.scene, this.cameraDoll);
        }
        else if (this.screenModeIndex === 3) {
            this.cameraFloorControl.update();
            this.renderer.render(this.scene, this.cameraFloor);
        }
        requestAnimationFrame(this.render.bind(this));
    };
    AppComponent.prototype.onWindowResize = function () {
        if (this.screenModeIndex === 1) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        else if (this.screenModeIndex === 2) {
            this.cameraDoll.aspect = window.innerWidth / window.innerHeight;
            this.cameraDoll.updateProjectionMatrix();
        }
        else if (this.screenModeIndex === 3) {
            this.cameraFloor.aspect = window.innerWidth / window.innerHeight;
            this.cameraFloor.updateProjectionMatrix();
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.composer.setSize( window.innerWidth, window.innerHeight );
    };
    AppComponent.prototype.cameraInit = function (scene) {
        this.camera.position.set(0, 0, 0);
    };
    AppComponent.prototype.cameraDollInit = function (scene) {
        this.cameraDoll = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0001, 1000);
        this.cameraDoll.position.set(10, 10, 0);
        if (!THREE.CustomOrbitControls)
            THREE.CustomOrbitControls = CustomOrbitControls;
        this.cameraDollControl = new THREE.CustomOrbitControls(this.cameraDoll, this.renderer.domElement);
        this.cameraDollControl.screenSpacePanning = false;
        this.cameraDollControl.minDistance = 1;
        this.cameraDollControl.maxDistance = 500;
        // this.cameraDollControl.rotateSpeed = -1;
        this.cameraDollControl.maxPolarAngle = Math.PI / 2;
    };
    AppComponent.prototype.cameraFloorInit = function (scene) {
        this.cameraFloor = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 500);
        this.cameraFloor.position.set(10, 1, 0);
        this.cameraFloorControl = new THREE.CustomOrbitControls(this.cameraFloor, this.renderer.domElement);
        this.cameraFloorControl.minDistance = 1;
        this.cameraFloorControl.maxDistance = 500;
        // this.cameraFloorControl.rotateSpeed = -1;
        this.cameraFloorControl.maxPolarAngle = 0;
    };
    AppComponent.prototype.skyboxInit = function () {
        var textureUrls = [
            this.logoUrl,
            this.logoUrl,
            this.logoUrl,
            this.logoUrl,
            this.logoUrl,
            this.logoUrl
        ];
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            var texture = new THREE.TextureLoader().load(textureUrls[i]); //, function(texture){}
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 1.0,
                side: THREE.BackSide,
                depthTest: false,
            });
            materialArray.push(material);
        }
        this.setPlane("y", Math.PI * 0.5, materialArray[0]); //px
        this.setPlane("y", -Math.PI * 0.5, materialArray[1]); //nx
        this.setPlane("x", Math.PI * 0.5, materialArray[2]); //ny
        this.setPlane("x", -Math.PI * 0.5, materialArray[3]); //py
        this.setPlane("y", 0, materialArray[4]); //pz
        this.setPlane("y", Math.PI, materialArray[5]); // nz
        this.skyBox.children[2].rotation.set(0, Math.PI / 2, 0);
        this.skyBox.children[3].rotation.set(0, Math.PI / 2, 0);
        this.skyBox.scale.set(500, 500, -500);
        this.skyBox.renderOrder = 1;
        this.scene.add(this.skyBox);
    };
    AppComponent.prototype.changeSceneMode = function (mode) {
        var _this = this;
        var self = this;
        if (this.screenChangeFlag)
            return;
        this.screenChangeFlag = true;
        if (!this.loaderDollObject)
            return;
        var previousModeIndex = this.screenModeIndex;
        this.screenModeIndex = mode;
        if (mode === 1) {
            if (previousModeIndex !== 1) {
                if (this.previousPuckIndex === -1) {
                    this.previousPuckIndex = 0;
                }
                if (previousModeIndex === 2) {
                    this.cameraYawObject.position.set(this.cameraDoll.position.x, this.cameraDoll.position.y, this.cameraDoll.position.z);
                }
                if (previousModeIndex === 3) {
                    this.cameraYawObject.position.set(this.cameraFloor.position.x, this.cameraFloor.position.y, this.cameraFloor.position.z);
                }
                var nextPuck = this.matterDataArray[this.previousPuckIndex];
                this.cameraYawObject.rotation.set(0, 0, 0);
                this.cameraPitchObject.rotation.set(0, 0, 0);
                this.camera.rotation.set(0, 0, 0);
                this.camera.lookAt(new THREE.Vector3(parseFloat(nextPuck.posx), parseFloat(nextPuck.posz), parseFloat(nextPuck.posy)));
                this.cameraDollControl.reset();
                this.cameraFloorControl.reset();
                this.cameraDollControl.enabled = false;
                this.cameraFloorControl.enabled = false;
            }
            var lookNext = (previousModeIndex === 2 || previousModeIndex === 3);
            this.changeSkybox(this.previousPuckIndex, lookNext);
        }
        else if (mode === 2) {
            this.cameraDollControl.enabled = true;
            this.cameraFloorControl.enabled = false;
            this.cameraFloorControl.reset();
            this.skyBox.visible = false;
            this.cameraDollControl.target = this.getGroupCenterPoint(this.loaderDollObject);
        }
        else if (mode === 3) {
            this.skyBox.visible = false;
            this.cameraFloorControl.reset();
            this.cameraDollControl.enabled = false;
            this.cameraFloorControl.enabled = true;
            this.cameraFloorControl.target = this.getGroupCenterPoint(this.loaderDollObject);
            // this.cameraFloor.position.set(this.getGroupCenterPoint(this.loaderDollObject).x, this.getGroupCenterPoint(this.loaderDollObject).y + 20, this.getGroupCenterPoint(this.loaderDollObject).z);
            this.cameraFloor.position.set(this.cameraYawObject.position.x, this.cameraYawObject.position.y, this.cameraYawObject.position.z);
            this.cameraFloor.zoom = 50;
            this.cameraFloor.updateProjectionMatrix();
        }
        setTimeout(function () {
            _this.screenChangeFlag = false;
        }, 1000);
    };
    AppComponent.prototype.createLight = function (scene) {
        var ambient = new THREE.HemisphereLight(0xFFFFFf, 0xffffff, 0.65);
        ambient.position.set(-0.5, 0.75, -1);
        scene.add(ambient);
        var ambient_2 = new THREE.HemisphereLight(0xFFFFFF, 0x0f0e0d, 0.65);
        ambient_2.position.set(-0.5, 0.75, -1);
        scene.add(ambient_2);
    };
    AppComponent.prototype.pointerChangeShape = function (index) {
        var geometry;
        var material;
        if (index === 1) {
            geometry = new THREE.PlaneGeometry(0.25, 0.25, 0.25, 0.25);
            var texture = new THREE.TextureLoader().load(this.frontImageArray[7]); //, function(texture){}
            material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 1.0,
                color: 0xffffff,
                side: THREE.DoubleSide,
                depthTest: false,
            });
        }
        else if (index === 2) {
            geometry = new THREE.TorusGeometry(0.08, 0.018, 16, 100);
            material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        }
        material.depthWrite = false;
        material.transparent = true;
        return {
            geometry: geometry,
            material: material
        };
    };
    AppComponent.prototype.pointerInit = function (scene) {
        var data = this.pointerChangeShape(2);
        this.pointer = new THREE.Mesh(data.geometry, data.material);
        this.pointer.renderOrder = 999;
        this.pointer.needsUpdate = true;
        this.cameraPitchObject = new THREE.Object3D();
        this.cameraPitchObject.add(this.camera);
        this.cameraPitchObject.position.set(0, 0, 0);
        this.cameraYawObject = new THREE.Object3D();
        this.cameraYawObject.add(this.cameraPitchObject);
        this.cameraYawObject.position.set(0, 0, 0);
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        document.addEventListener('touchstart', this.onMouseDown.bind(this), false);
        document.addEventListener('touchmove', this.onMouseMove.bind(this), false);
        document.addEventListener('touchend', this.onMouseUp.bind(this), false);
        document.addEventListener('click', this.onMouseClick.bind(this), false);
        document.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        document.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false);
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false);
        this.pointer.renderOrder = 999;
        scene.add(this.cameraYawObject);
        scene.add(this.pointer);
    };
    AppComponent.prototype.onMouseWheel = function (event) {
        if (event.target.localName !== "canvas") {
            this.mouseDownFlag = false;
            return;
        }
        this.camera.fov -= event.wheelDeltaY * 0.05;
        this.camera.fov = Math.max(Math.min(this.camera.fov, this.cameraFovMAX), this.cameraFovMIN);
        this.camera.projectionMatrix = new THREE.Matrix4().makePerspective(this.camera.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far);
    };
    AppComponent.prototype.onMouseClick = function (event) {
        if (event.target.localName !== "canvas") {
            this.mouseDownFlag = false;
            return;
        }
        if (this.functionIndex === 1) {
            this.calculateMeasurement();
        }
        else if (this.functionIndex === 2) {
            if (this.hotspotObject) {
                this.functionIndex = 0;
                return;
            }
            var position = new THREE.Vector3();
            position.copy(this.pointer.position);
            var directionPoint = new THREE.Vector3(); // create once and reuse it!
            this.pointer.getWorldDirection(directionPoint);
            var positionA = new THREE.Vector3(parseFloat(position.x + 0 * directionPoint.x), parseFloat(position.y + 0 * directionPoint.y), parseFloat(position.z + 0 * directionPoint.z));
            var positionB = new THREE.Vector3(parseFloat(position.x + 0.15 * directionPoint.x), parseFloat(position.y + 0.15 * directionPoint.y), parseFloat(position.z + 0.15 * directionPoint.z));
            var element_1 = {
                positionA: positionA,
                positionB: positionB,
                rotation: this.pointer.rotation,
            };
            this.createHotSpot(element_1);
            this.showHotPanel(this.hotspotDataArray.length - 1, true);
            this.functionIndex = 0;
        }
    };
    AppComponent.prototype.onMouseDown = function (event) {
        if (event.target.localName !== "canvas") {
            this.mouseDownFlag = false;
            return;
        }
        if (event.type === "touchstart") {
            this.touchStart.x = event.touches[0].clientX;
            this.touchStart.y = event.touches[0].clientY;
        }
        if (event.button === 2) {
            if (this.functionIndex === 1) {
                this.scene.remove(this.measurementText);
                this.scene.remove(this.measurementLine);
                this.measurementFlag = false;
                var data = this.pointerChangeShape(2);
                this.pointer.geometry = data.geometry;
                this.pointer.material = data.material;
                this.pointer.material.needsUpdate = true;
                this.pointer.renderOrder = 999;
            }
            else if (this.functionIndex === 2) {
                this.hotspotDisplayFlag = false;
                this.hotspotObjectArray.pop();
                this.hotspotDataArray.pop();
                this.scene.remove(this.hotspotObject);
                this.hotspotObject = null;
                document.getElementById('hotspot').style.display = "none";
            }
            else if (this.functionIndex === 3) {
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
    };
    AppComponent.prototype.onMouseUp = function (event) {
        if (event.target.localName !== "canvas") {
            this.mouseDownFlag = false;
            return;
        }
        this.mouseDownFlag = false;
        if (this.mouseMoveFlag === 1 && this.functionIndex === 0) {
            var showhot = this.getNearHotspot(this.pointer.position);
            if (!showhot) {
                this.getNearPuck(this.pointer.position, true);
            }
        }
        this.mouseMoveFlag = 0;
    };
    AppComponent.prototype.onMouseMove = function (event) {
        if (this.mouseMoveFlag === 1) {
            if (event.type === "mousemove") {
                if (event.movementX !== 0 && event.movementY !== 0) {
                    this.mouseMoveFlag = 2;
                }
            }
            else {
                this.mouseMoveFlag = 2;
            }
        }
        if (this.mouseMovedFlag === 1) {
            if (event.type === "mousemove") {
                if (event.movementX !== 0 && event.movementY !== 0) {
                    this.mouseMovedFlag = 2;
                }
            }
            else {
                this.mouseMovedFlag = 2;
            }
        }
        if (event.target.localName !== "canvas") {
            return;
        }
        var self = this;
        var camera;
        if (this.screenModeIndex === 1) {
            camera = self.camera;
        }
        else if (this.screenModeIndex === 2) {
            camera = self.cameraDoll;
        }
        else if (this.screenModeIndex === 3) {
            camera = self.cameraFloor;
        }
        if (event.type !== 'touchmove' && event.type !== 'touchstart') {
            self.mouse2DVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            self.mouse2DVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        else {
            self.mouse2DVector.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            self.mouse2DVector.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
        self.pointerRaycaster.setFromCamera(self.mouse2DVector, camera);
        var intersects = self.pointerRaycaster.intersectObjects(self.scene.children, true);
        var intersect = intersects.filter(function (element) { return element.object.type === "Mesh" && element.object.mid && element.object.mid === "wall" || element.object.name === "hotspot"; })[0];
        if (intersect && intersect.object.name != "point") {
            self.pointer.position.set(0, 0, 0);
            var normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
            var worldNormal = intersect.face.normal.clone().applyMatrix3(normalMatrix).normalize();
            self.pointer.lookAt(worldNormal);
            self.pointer.position.copy(intersect.point);
            self.getNearPuck(self.pointer.position, false);
            self.highlightNearHotspot(self.pointer.position);
            if (this.measurementFlag && this.measurementLine) {
                var direction = new THREE.Vector3(); // create once and reuse it!
                this.pointer.getWorldDirection(direction);
                var thirdPos = new THREE.Vector3(intersect.point.x + 0.1 * direction.x, intersect.point.y + 0.1 * direction.y, intersect.point.z + 0.1 * direction.z);
                this.measurementLine.geometry.vertices[2] = thirdPos;
                this.measurementLine.geometry.verticesNeedUpdate = true;
                var distance = this.measurementLine.geometry.vertices[3].distanceTo(this.measurementLine.geometry.vertices[0]) * 3.2808333;
                var dir = new THREE.Vector3(); // create once an reuse it
                dir.subVectors(this.measurementLine.geometry.vertices[0], this.measurementLine.geometry.vertices[3]).normalize();
                this.createText(distance.toFixed(2).toString() + " ft", this.measurementLine.geometry.vertices[0], this.measurementLine.geometry.vertices[3]);
            }
        }
        if (!this.mouseDownFlag)
            return;
        if (event.type === "touchmove") {
            var movementX = (this.touchStart.x - event.changedTouches[0].clientX) || 0;
            var movementY = (this.touchStart.y - event.changedTouches[0].clientY) || 0;
            self.cameraYawObject.rotation.y -= movementX * 0.0001;
            self.cameraPitchObject.rotation.x -= movementY * 0.0001;
        }
        else {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
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
    };
    AppComponent.prototype.createText = function (text, pointA, pointB) {
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
        var textMesh = new THREE.Mesh(text3d, textMaterial);
        textMesh.renderOrder = 0.5;
        var pos = this.getPointInBetweenByPerc(pointA, pointB, 0.5);
        var directionPoint = new THREE.Vector3(); // create once and reuse it!
        this.pointer.getWorldDirection(directionPoint);
        var direction = new THREE.Vector3(); // create once an reuse it
        direction.subVectors(new THREE.Vector3(pointA.x, pointA.y, pointA.z), new THREE.Vector3(pointB.x, pointB.y, pointB.z)).normalize();
        this.measurementText = new THREE.Group();
        var screenPointA = this.Vector3D2ScreenPosition(pointA, this.camera, this.renderer).x;
        var screenPointB = this.Vector3D2ScreenPosition(pointB, this.camera, this.renderer).x;
        if (screenPointA > screenPointB) {
            textMesh.rotation.set(0, -Math.PI / 2, 0);
        }
        else {
            textMesh.rotation.set(0, Math.PI / 2, 0);
        }
        this.measurementText.add(textMesh);
        this.measurementText.position.set(pos.x, pos.y, pos.z);
        this.measurementText.lookAt(new THREE.Vector3(pos.x + 0.5 * direction.x, pos.y + 0.5 * direction.y, pos.z + 0.5 * direction.z));
        this.measurementText.position.set(pos.x + 0.3 * directionPoint.x, pos.y + 0.3 * directionPoint.y, pos.z + 0.3 * directionPoint.z);
        this.scene.add(this.measurementText);
    };
    AppComponent.prototype.calculateMeasurement = function () {
        if (this.measurementFlag && this.mouseMovedFlag === 2)
            return;
        if (this.measurementFlag) {
            var fourthPos = new THREE.Vector3();
            fourthPos.copy(this.pointer.position);
            this.measurementLine.geometry.vertices[3] = fourthPos;
            this.measurementLine.geometry.verticesNeedUpdate = true;
            this.measurementLine = null;
            this.measurementText = null;
            this.measurementFlag = false;
            this.functionIndex = 0;
            var data = this.pointerChangeShape(2);
            this.pointer.geometry = data.geometry;
            this.pointer.material = data.material;
            this.pointer.material.needsUpdate = true;
            this.pointer.renderOrder = 999;
            return;
        }
        // if (this.screenModeIndex === 1) {
        if (!this.measurementFlag && this.mouseMovedFlag === 1) {
            var data = this.pointerChangeShape(1);
            this.pointer.geometry = data.geometry;
            this.pointer.material = data.material;
            this.pointer.material.needsUpdate = true;
            this.pointer.renderOrder = 999;
            this.measurementFlag = true;
            var initPos = new THREE.Vector3();
            initPos.copy(this.pointer.position);
            var lineGeom = new THREE.Geometry();
            var direction = new THREE.Vector3(); // create once and reuse it!
            this.pointer.getWorldDirection(direction);
            var secondPos = new THREE.Vector3(initPos.x + 0.1 * direction.x, initPos.y + 0.1 * direction.y, initPos.z + 0.1 * direction.z);
            var thirdPos = new THREE.Vector3(this.pointer.position.x + 0.1 * direction.x, this.pointer.position.y + 0.1 * direction.y, this.pointer.position.z + 0.1 * direction.z);
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
    };
    AppComponent.prototype.changeSkybox = function (index, lookNext) {
        var _this = this;
        var self = this;
        if (!self.loaderDollObject)
            return;
        //first load
        // if (self.deepLinkId !== "" && index !== self.deepLinkId) return;
        // self.deepLinkId = "";
        var puck = this.matterDataArray[index];
        this.previousFloorIndex = (parseInt(puck.floor.toString()) + 1).toString();
        ;
        var textures = self.panoDataArray.filter(function (element) { return element.file_name.indexOf(puck.uuid) !== -1; });
        textures.sort(function (a, b) { return (a.file_name > b.file_name) ? 1 : ((b.file_name > a.file_name) ? -1 : 0); });
        var textureUrls = [
            textures[1].data,
            textures[3].data,
            textures[5].data,
            textures[0].data,
            textures[4].data,
            textures[2].data,
        ];
        document.getElementById('mask').style.display = "block";
        self.loadMaterialTexture(textureUrls, false).then(function (textures) {
            self.skyBox.visible = false;
            for (var i = 0; i < 6; i++) {
                var texture = textures[i];
                texture.needsUpdate = true;
                var child = self.skyBox.children[i];
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
                .to({ x: parseFloat(puck.posx), y: parseFloat(puck.posz), z: parseFloat(puck.posy) }, 500) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
                .onComplete(function () {
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
                    self.deepLinkCamera.yaw = self.deepLinkCamera.pit = { x: 0, y: 0, z: 0 };
                    self.deepLinkCamera.fov = 0;
                    self.camera.rotation.set(0, 0, 0);
                }
                else if (lookNext) {
                    self.cameraYawObject.rotation.set(0, 0, 0);
                    self.cameraPitchObject.rotation.set(0, 0, 0);
                    var vector = new THREE.Vector3();
                    self.camera.getWorldDirection(vector);
                    var y = -Math.atan2(vector.z, vector.x) - Math.PI / 2;
                    self.cameraYawObject.rotation.set(self.cameraYawObject.rotation.x, y, self.cameraYawObject.rotation.z);
                    self.camera.rotation.set(0, 0, 0);
                }
            })
                .start();
            _this.skyBox.position.set(parseFloat(puck.posx), parseFloat(puck.posz), parseFloat(puck.posy));
            _this.skyBox.quaternion.set(parseFloat(puck.quatx), parseFloat(puck.quatz), parseFloat(puck.quaty), parseFloat(puck.quatw));
        });
    };
    AppComponent.prototype.loadMaterialTexture = function (textureUrls, flag) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            ;
            textureUrls.forEach(function (element) {
                var promise = new Promise(function (resolve, reject) {
                    new THREE.TextureLoader().load(element, function (texture) {
                        if (flag) {
                            texture.dispose();
                        }
                        self.currentProgressValue++;
                        console.log(self.currentProgressValue);
                        self.progress("texture");
                        resolve(texture);
                    });
                });
                promises.push(promise);
            });
            return Promise.all(promises).then(function (value) {
                resolve(value);
            });
        });
    };
    AppComponent.prototype.setPlane = function (axis, angle, material) {
        var planeGeom = new THREE.PlaneGeometry(1, 1, 1, 1);
        planeGeom.translate(0, 0, 0.5);
        switch (axis) {
            case 'y':
                planeGeom.rotateY(angle);
                break;
            default:
                planeGeom.rotateX(angle);
        }
        var plane = new THREE.Mesh(planeGeom, material);
        this.skyBox.add(plane);
    };
    AppComponent.prototype.createHotSpot = function (element) {
        if (this.hotspotObject)
            return;
        var geometry = new THREE.SphereGeometry(0.06, 120, 120);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.5 });
        material.transparent = true;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(element.positionB.x, element.positionB.y, element.positionB.z);
        mesh.name = "hotspot";
        mesh.renderOrder = 5;
        var outlineMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.BackSide });
        outlineMaterial1.transparent = true;
        var outlineMesh1 = new THREE.Mesh(geometry, outlineMaterial1);
        outlineMesh1.position.copy(mesh.position);
        outlineMesh1.renderOrder = 5;
        outlineMesh1.scale.multiplyScalar(1.1);
        var lineGeometry = new THREE.BufferGeometry();
        var points = [];
        points.push(element.positionA.x, element.positionA.y, element.positionA.z);
        points.push(element.positionB.x, element.positionB.y, element.positionB.z);
        lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        var line_material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 10,
            transparent: true,
            opacity: 0.3,
            linecap: 'round',
            linejoin: 'round' //ignored by WebGLRenderer
        });
        var object = new THREE.Line(lineGeometry, line_material);
        object.renderOrder = 5;
        // let geometryBottom = new THREE.RingGeometry( 0.06, 0.15, 120 );
        // let materialBottom = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, opacity: 0.6 } );
        // let meshBottom = new THREE.Mesh( geometryBottom, materialBottom );
        // meshBottom.position.set(element.positionA.x, element.positionA.y, element.positionA.z);
        // meshBottom.rotation.copy(element.rotation)
        // meshBottom.material.transparent = true;
        // meshBottom.renderOrder = 5;
        // meshBottom.opacity = this.puckOpacityValue;
        var group = new THREE.Group();
        // group.add(object);
        group.add(mesh);
        group.add(outlineMesh1);
        // group.add(meshBottom);
        this.hotspotObject = group;
        this.hotspotObjectArray.push(group);
        var data = {
            position: element.positionB,
            rotation: element.rotation,
            title: "Title",
            content: "Content",
            isNew: true,
            colorIndex: 0,
        };
        this.hotspotDataArray.push(data);
        this.scene.add(group);
    };
    AppComponent.prototype.createPuck = function (element) {
        var geometry = new THREE.RingGeometry(0.1, 0.15, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(parseFloat(element.puckx), parseFloat(element.puckz) + 0.05, parseFloat(element.pucky));
        this.rotateAroundWorldAxis(mesh, new THREE.Vector3(1, 0, 0), Math.PI / 2);
        mesh.name = "puck";
        mesh.material.transparent = true;
        mesh.material.opacity = this.puckOpacityValue;
        mesh.renderOrder = 3;
        this.puckObjectArray.push(mesh);
        this.scene.add(mesh);
    };
    AppComponent.prototype.getNearHotspot = function (point) {
        var min = 1000;
        var near_element = -1;
        var distance = 0;
        for (var i = 0; i < this.hotspotDataArray.length; i++) {
            distance = point.distanceTo(new THREE.Vector3(parseFloat(this.hotspotDataArray[i].position.x), parseFloat(this.hotspotDataArray[i].position.y), parseFloat(this.hotspotDataArray[i].position.z)));
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
    };
    AppComponent.prototype.cameraLookAt = function (position) {
        this.cameraYawObject.rotation.set(0, 0, 0);
        this.cameraPitchObject.rotation.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
        this.camera.lookAt(position);
        var vector = new THREE.Vector3();
        this.camera.getWorldDirection(vector);
        var y = -Math.atan2(vector.z, vector.x) - Math.PI / 2;
        this.cameraYawObject.rotation.set(this.cameraYawObject.rotation.x, y, this.cameraYawObject.rotation.z);
        this.camera.rotation.set(0, 0, 0);
    };
    AppComponent.prototype.highlightNearHotspot = function (point) {
        this.hotspotObjectArray.forEach(function (element) {
            var distance = point.distanceTo(new THREE.Vector3(element.children[0].position.x, element.children[0].position.y, element.children[0].position.z));
            if (distance < 0.06) {
                element.children.filter(function (element) { return element.name === "hotspot"; })[0].material.opacity = 1;
            }
            else {
                element.children.filter(function (element) { return element.name === "hotspot"; })[0].material.opacity = 0.5;
            }
        });
    };
    AppComponent.prototype.getNearPuck = function (point, flag) {
        var _this = this;
        var min = 1000;
        var near_element = -1;
        var distance = 0;
        for (var i = 0; i < this.matterDataArray.length; i++) {
            distance = point.distanceTo(new THREE.Vector3(parseFloat(this.matterDataArray[i].puckx), parseFloat(this.matterDataArray[i].puckz), parseFloat(this.matterDataArray[i].pucky)));
            if (distance < min) {
                min = distance;
                near_element = i;
            }
        }
        this.puckObjectArray.filter(function (puck) { return puck.material.opacity === 1; }).forEach(function (puck) {
            puck.material.opacity = _this.puckOpacityValue;
        });
        if (min < this.puckNearDistanceValue && near_element != -1) {
            this.puckObjectArray[near_element].material.opacity = 1;
            if (flag) {
                if (this.previousPuckIndex === near_element && this.screenModeIndex === 1)
                    return;
                this.previousPuckIndex = near_element;
                if (this.screenModeIndex === 2 || this.screenModeIndex === 3) {
                    this.changeSceneMode(1);
                }
                else {
                    this.changeSkybox(this.previousPuckIndex, false);
                }
            }
        }
    };
    AppComponent.prototype.getData = function (data) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var keys = [];
            data.split('\n').forEach(function (line, lineNumber) {
                if (line.trim().length === 0) {
                    return;
                }
                var element = {};
                line.split(',').forEach(function (entry, idx) {
                    var trimmedEntry = entry.trim();
                    if (lineNumber === 0) {
                        keys[idx] = trimmedEntry.toLowerCase();
                    }
                    else {
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
    };
    AppComponent.prototype.showHotPanel = function (index, flag) {
        if (flag) {
            var element_2 = this.hotspotDataArray[index];
            this.hotspot_title = element_2.title;
            this.hotspot_content = element_2.content;
            this.hotspotSelectedIndex = index;
            this.hotspotColorIndex = element_2.colorIndex;
            document.getElementById('hotspot').style.display = "block";
            this.hotspotDisplayFlag = true;
        }
        else {
            document.getElementById('hotspot').style.display = "none";
            this.hotspotSelectedIndex = -1;
            this.hotspotDisplayFlag = false;
            return;
        }
    };
    AppComponent.prototype.rotateAroundWorldAxis = function (object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix); // pre-multiply
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    };
    AppComponent.prototype.getPointInBetweenByPerc = function (pointA, pointB, percentage) {
        var dir = pointB.clone().sub(pointA);
        var len = dir.length();
        dir = dir.normalize().multiplyScalar(len * percentage);
        return pointA.clone().add(dir);
    };
    AppComponent.prototype.Vector3D2ScreenPosition = function (pos3D, camera, renderer) {
        var vector = new THREE.Vector3(pos3D.x, pos3D.y, pos3D.z);
        var widthHalf = 0.5 * renderer.context.canvas.clientWidth;
        var heightHalf = 0.5 * renderer.context.canvas.clientHeight;
        vector.project(camera);
        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;
        return {
            x: vector.x,
            y: vector.y
        };
    };
    AppComponent.prototype.toScreenPosition = function (renderer, obj, camera) {
        var vector = new THREE.Vector3();
        var widthHalf = 0.5 * renderer.context.canvas.clientWidth;
        var heightHalf = 0.5 * renderer.context.canvas.clientHeight;
        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);
        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;
        return {
            x: vector.x,
            y: vector.y
        };
    };
    ;
    AppComponent.prototype.getGroupCenterPoint = function (group) {
        var boundingBox = new THREE.Box3().setFromObject(group);
        var middle = new THREE.Vector3();
        middle.x = (boundingBox.max.x + boundingBox.min.x) / 2;
        middle.y = (boundingBox.max.y + boundingBox.min.y) / 2;
        middle.z = (boundingBox.max.z + boundingBox.min.z) / 2;
        return middle;
    };
    AppComponent.prototype.loadAsset = function (values) {
        var self = this;
        var obj_data = '';
        var mtl_data = '';
        var texture_info = [];
        self.progress("init");
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            if (value.extenstion === 'mtl') {
                mtl_data = value.data;
            }
            else if (value.extenstion === 'obj') {
                obj_data = value.data;
            }
            else {
                texture_info.push({
                    name: value.file_name,
                    obj_url: value.data,
                });
            }
        }
        var loaderFont = new THREE.FontLoader();
        loaderFont.load(self.fontJSONUrl, function (font) {
            self.measurementFont = font;
        });
        var loading_manager = new THREE.LoadingManager();
        loading_manager.onLoad = function () {
            self.progress("loadend");
            setTimeout(function () {
                // self.spinner.hide();
                self.hideLoadingUI();
            }, 5000);
            setTimeout(function () {
                self.progress("done");
            }, 4000);
        };
        if (!THREE.MTLLoader)
            THREE.MTLLoader = MTLLoader;
        var loader = new THREE.MTLLoader();
        loader.setCrossOrigin(true);
        loader.setMaterialOptions({ ignoreZeroRGBs: false });
        loader.setTexturePath(texture_info);
        if (this.loaderAlphaTest != undefined) {
            loader.setAlpahTestOption(true);
        }
        loader.loadText(mtl_data, function (materials) {
            if (!THREE.OBJLoader)
                THREE.OBJLoader = OBJLoader;
            var loader = new THREE.OBJLoader(loading_manager);
            materials.baseUrl.forEach(function (element) {
                self.loaderTextureUrlArray.push(element.obj_url);
            });
            console.log(self.loaderTextureUrlArray.length);
            self.totalProgressValue = self.loaderTextureUrlArray.length;
            self.loadMaterialTexture(self.loaderTextureUrlArray, true).then(function (textures) {
                console.log(textures);
                loader.setMaterials(materials);
                self.progress("obj");
                loader.loadText(obj_data, function (object) {
                    object.traverse(function (child) {
                        if (child.type === "Mesh") {
                            child.material.colorWrite = true; // <================= new
                            child.material.side = THREE.FrontSide;
                            child.renderOrder = 2;
                            child.mid = "wall";
                            self.loaderMaterialArray.push(child.material);
                        }
                    });
                    self.rotateAroundWorldAxis(object, new THREE.Vector3(1, 0, 0), Math.PI / 2);
                    self.rotateAroundWorldAxis(object, new THREE.Vector3(0, 0, 1), Math.PI);
                    self.rotateAroundWorldAxis(object, new THREE.Vector3(0, 1, 0), Math.PI);
                    object.scale.set(1, 1, 1);
                    object.position.set(0, 0, 0);
                    self.loaderDollObject = object;
                    self.scene.add(object);
                    if (self.deepLinkId === 0) {
                        self.changeSceneMode(2);
                    }
                    self.progress("loadend");
                    setTimeout(function () {
                        // self.spinner.hide();
                        self.hideLoadingUI();
                        if (self.deepLinkId !== 0) {
                            self.changeSceneMode(1);
                            // self.changeSkybox(self.deepLinkId, false);
                        }
                    }, 5000);
                    setTimeout(function () {
                        self.progress("done");
                    }, 4000);
                });
            });
        });
    };
    AppComponent.prototype.generateShareURL = function () {
        console.log(this.cameraYawObject);
        console.log(this.cameraPitchObject);
        var yaw = this.cameraYawObject.rotation;
        var pit = this.cameraPitchObject.rotation;
        var fov = this.camera.fov;
        var spaceID = "id=" + this.spaceID;
        if (this.isWorkingLocal)
            spaceID = "";
        this.shareableURL = window.location.origin + "/?" + spaceID;
        this.deepLinkURL = window.location.origin + "/?" + spaceID + "&did=" + this.previousPuckIndex + "&yawx=" + yaw._x + "&yawy=" + yaw._y + "&yawz=" + yaw._z + "&pitx=" + pit._x + "&pity=" + pit._y + "&pitz=" + pit._z + "&fov=" + fov;
    };
    AppComponent.prototype.progress = function (state) {
        if (this.totalProgressValue) {
            var text_1 = "";
            if (state === "init") {
                text_1 = "Analysis Data...";
            }
            if (state === "prestream") {
                text_1 = "Starting Downloading...";
            }
            if (state === "stream") {
                text_1 = "Downloading Assets...";
                var progress = this.currentProgressValue / this.totalProgressValue * 100 + "%";
                document.getElementById('progress_value').style.width = progress;
            }
            if (state === "texture") {
                text_1 = "Loading Textures...";
                var progress = this.currentProgressValue / this.totalProgressValue * 100 + "%";
                document.getElementById('progress_value').style.width = progress;
            }
            if (state === "obj") {
                text_1 = "Building Models...";
                var coords_model = { x: 0 }; // Start at (0, 0)
                new TWEEN.Tween(coords_model) // Create a new tween that modifies 'coords'.
                    .to({ x: 100 }, 5000) // Move to (300, 200) in 1 second.
                    .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
                    .onUpdate(function () {
                    var progress = coords_model.x + "%";
                    document.getElementById('progress_value').style.width = progress;
                })
                    .start(); // Start the tween immediately.
            }
            if (state === "loadend") {
                text_1 = "Preparing Scene...";
                var coords = { x: 0 }; // Start at (0, 0)
                new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                    .to({ x: 100 }, 3000) // Move to (300, 200) in 1 second.
                    .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
                    .onUpdate(function () {
                    var progress = coords.x + "%";
                    document.getElementById('progress_value').style.width = progress;
                })
                    .start(); // Start the tween immediately.
            }
            if (state === "done") {
                text_1 = "Complete";
            }
            document.getElementById('progress_text').innerHTML = text_1;
        }
    };
    AppComponent.prototype.toggleMeasurment = function (event) {
    };
    AppComponent.prototype.toggleInfoViewShow = function (event) {
        this.infoViewShow = !this.infoViewShow;
    };
    AppComponent.prototype.toggleTitleIndex = function (event, index) {
        this.titleIndex = this.PrevtitleIndex = index;
        this.ControlPanelShow = true;
        this.functionIndex = 0;
    };
    AppComponent.prototype.toggleSceneModeIndex = function (index) {
        this.changeSceneMode(index);
    };
    AppComponent.prototype.toggleHighLightIndex = function (index) {
        this.previousPuckIndex = index;
        this.changeSceneMode(1);
    };
    AppComponent.prototype.toggleFuctionsIndex = function (index) {
        if (this.measurementFlag === true) {
            this.calculateMeasurement();
        }
        if (index === 3) {
            this.generateShareURL();
            document.getElementById('share').style.display = "block";
        }
        else {
            document.getElementById('share').style.display = "none";
        }
        if (this.functionIndex === index) {
            this.functionIndex = 0;
            document.getElementById('share').style.display = "none";
            document.getElementById('hotspot').style.display = "none";
            return;
        }
        this.functionIndex = index;
    };
    AppComponent.prototype.hotSpotColorSelect = function (index) {
        this.hotspotColorIndex = index;
        this.hotspotDataArray[this.hotspotSelectedIndex].colorIndex = this.hotspotColorIndex;
        this.hotspotObjectArray[this.hotspotSelectedIndex].children.filter(function (element) { return element.name === "hotspot"; })[0].material.color.set(this.hotspotColorArray[this.hotspotColorIndex]);
    };
    AppComponent.prototype.hotSpotSave = function () {
        this.hotspotDataArray[this.hotspotSelectedIndex].title = this.hotspot_title;
        this.hotspotDataArray[this.hotspotSelectedIndex].content = this.hotspot_content;
        this.hotspotDataArray[this.hotspotSelectedIndex].isNew = false;
        this.hotspotObject = null;
        this.showHotPanel(-1, false);
        this.functionIndex = 0;
    };
    AppComponent.prototype.hotSpotCancel = function () {
        if (this.hotspotDataArray[this.hotspotSelectedIndex].isNew) {
            this.hotspotObjectArray.pop();
            this.hotspotDataArray.pop();
            this.scene.remove(this.hotspotObject);
        }
        this.hotspotObject = null;
        this.showHotPanel(-1, false);
        this.functionIndex = 0;
    };
    AppComponent.prototype.createLoadingUI = function () {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.style.position = 'absolute';
        this.loadingScreen.style.top = 0;
        this.loadingScreen.style.bottom = 0;
        this.loadingScreen.style.left = 0;
        this.loadingScreen.style.right = 0;
        var logoImage = document.createElement('div');
        logoImage.id = "logo-image";
        logoImage.className = 'logo background';
        // logoImage.style.backgroundImage =  `url(${this.logoUrl})`;
        logoImage.style.display = 'inline-block';
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
        var logoTitle = document.createElement('div');
        logoTitle.id = "space-name";
        logoTitle.style.position = 'absolute';
        logoTitle.style.fontSize = '60px';
        logoTitle.style.textAlign = 'center';
        logoTitle.style.color = 'white';
        logoTitle.style.width = '100%';
        logoTitle.style.top = '35%';
        // logoTitle.innerText = this.spaceName;
        this.loadingScreen.appendChild(logoTitle);
        var logoCompany = document.createElement('div');
        logoCompany.style.position = 'absolute';
        logoCompany.style.fontSize = '48px';
        logoCompany.style.textAlign = 'center';
        logoCompany.style.color = 'white';
        logoCompany.style.width = '100%';
        logoCompany.style.top = '50%';
        logoCompany.innerText = "Geopro Consultants";
        this.loadingScreen.appendChild(logoCompany);
        var logoProgress = document.createElement('div');
        logoProgress.className = 'logo progress';
        logoProgress.style.position = "absolute";
        logoProgress.style.width = '30vw';
        logoProgress.style.height = '10px';
        logoProgress.style.left = '35vw';
        logoProgress.style.bottom = '20vh';
        logoProgress.style.background = "brown";
        var logoProgressValue = document.createElement('div');
        logoProgressValue.id = 'progress_value';
        logoProgressValue.className = 'logo progress';
        logoProgressValue.style.width = '0%';
        logoProgressValue.style.height = '10px';
        logoProgressValue.style.background = "wheat";
        logoProgress.appendChild(logoProgressValue);
        this.loadingScreen.appendChild(logoProgress);
        var logoProgressText = document.createElement('div');
        logoProgressText.id = 'progress_text';
        logoProgressText.className = 'logo progress';
        logoProgressText.style.position = "absolute";
        logoProgressText.style.width = '30vw';
        logoProgressText.style.height = '20px';
        logoProgressText.style.left = '35vw';
        logoProgressText.style.bottom = '25vh';
        logoProgressText.style.color = 'wheat';
        this.loadingScreen.appendChild(logoProgressText);
    };
    AppComponent.prototype.displayLoadingUI = function () {
        document.getElementById('content').style.display = 'block';
        this.loadingScreen.style.backgroundColor = "#000000";
        document.getElementById('content').appendChild(this.loadingScreen);
    };
    AppComponent.prototype.hideLoadingUI = function () {
        this.totalProgressValue = 0;
        document.getElementById('content').removeChild(this.loadingScreen);
    };
    AppComponent.prototype.copyToClipboard = function (str) {
        var el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    ;
    AppComponent.prototype.shareableCopy = function () {
        this.titleIndex = 0;
        this.functionIndex = 0;
        this.copyToClipboard(this.shareableURL);
        alert("copied");
        document.getElementById('share').style.display = "none";
    };
    AppComponent.prototype.deepLinkCopy = function () {
        this.titleIndex = 0;
        this.functionIndex = 0;
        this.copyToClipboard(this.deepLinkURL);
        alert("copied");
        document.getElementById('share').style.display = "none";
    };
    AppComponent.prototype.toggleFloorPanel = function () {
        this.showFloorPanel = !this.showFloorPanel;
        if (this.showFloorPanel) {
            var length_1 = this.floorDataArray.length;
            // document.getElementById('floor_list').style.top = `${length * 30 + 20}px`;
        }
    };
    AppComponent.prototype.toggleControlPanelShow = function () {
        this.ControlPanelShow = !this.ControlPanelShow;
        if (this.ControlPanelShow) {
            if (!this.PrevtitleIndex)
                this.PrevtitleIndex = 1;
            this.titleIndex = this.PrevtitleIndex;
        }
        else {
            this.titleIndex = 0;
        }
    };
    AppComponent.prototype.gotoFloor = function (index) {
        var value = (parseInt(index) - 1).toString();
        var element = this.matterDataArray.filter(function (element) { return element.floor === value; })[0];
        var indexFloor = this.matterDataArray.indexOf(element);
        if (this.screenModeIndex !== 1) {
            this.previousPuckIndex = indexFloor;
            this.changeSceneMode(1);
        }
        else {
            this.changeSkybox(this.matterDataArray.indexOf(element), true);
        }
        this.previousPuckIndex;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, ngx_spinner_1.NgxSpinnerService, platform_browser_1.DomSanitizer])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map