module.exports = Object.assign({}, {
    port: 3000,
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : "development",
    storageLocation: '../uploads',
    zipsLocation: '../zips',
    publicLocation: '../VRTourFront/dist',
    adminLocation: '../VRTourAdmin/dist/vrtouradmin',
    title: "VR-Tour",
    description: "Visit us for more great stuff.",
    firebase: {
      apiKey: "AIzaSyDXKzso_ggPDSk3C4AIBovCxJQND7SAD5w",
      authDomain: "vrtour-42ece.firebaseapp.com",
      databaseURL: "https://vrtour-42ece.firebaseio.com",
      projectId: "vrtour-42ece",
      storageBucket: "vrtour-42ece.appspot.com",
      messagingSenderId: "709265075578"
    }
}, process.env)