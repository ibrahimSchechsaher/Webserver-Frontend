import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import * as tf from '@tensorflow/tfjs';

// Important Link https://stackoverflow.com/questions/50878885/unknown-layer-lambda-in-tensorflowjs-on-browser

async function load_model() {
  let m = await tf.loadLayersModel('tfModeljs/model.json');
  return m;
}

let model = load_model();
let imageData;

model.then(
  function (res) {
    console.log("prediction");
    imageData = new ImageData(256, 256);
    let img = tf.browser.fromPixels(imageData);
    // img = img.reshape([1, 256, 256, 1]);
    img = tf.cast(img, 'float32');
    const output = res.predict(img);
    let prediction = Array.from(output.dataSync());
    console.log(prediction);


    
  },
  function (err) {
    console.log(err);
  }
);

// ---------------------------------------------------------------------------

let strDownloadMime = 'heightmap.jpg';
document.getElementById('downloud').addEventListener('blur', () => {
  console.log('im here');
  let imgData;

  try {
    let strMime = 'heightmap.jpg';
    imgData = renderer.domElement.toDataURL(strMime);

    saveFile(imgData.replace(strMime), 'test.jpg');
    // saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
  } catch (e) {
    console.log(e);
    return;
  }
});
let saveFile = function (strData, filename) {
  let link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  }
};


import { HeightMap } from './index.js';

// Texture loader
const loader = new THREE.TextureLoader();
let height = loader.load('new1.jpg');

const texture = loader.load('orginal.jpg');

// --- API CALL ------------------------------------------

let getJSON = function (url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let jsonResponse = xhr.response;
    console.log(jsonResponse['image']);
    // https://jsfiddle.net/2pha/p03wfrw4/
    let image = new Image();
    image.src = 'data:image/png;base64,' + jsonResponse['image'];

    let imageElement = document.createElement('img');
    imageElement.src = 'data:image/png;base64,' + jsonResponse['image'];
    imageElement.onload = function (e) {
      height = new THREE.Texture(this);
      height.needsUpdate = true;
      // TODO:: alte heightmap mit der neuen umtauschen
    };
    //document.body.appendChild(imageElement);
  };
  xhr.send();
};

getJSON('http://127.0.0.1:8000/getHeightMap/');

// ------------------------------------------------------------

// const alpha = loader.load ('/alpha.png)
//console.log(height.toString());



// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.PlaneBufferGeometry(2.5, 2.5, 256, 256);

// Materials
const material = new THREE.MeshStandardMaterial({
  color: 'grey',
  map: texture,
  displacementMap: height,
  //  displacmentScale :.6
});

material.castShadow = true;
material.receiveShadow = true;
const plane = new THREE.Mesh(geometry, material);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = 181;
//gui.add(plane.rotation,'x').min(0).max(600)
// Mesh

// Lights

const pointLight = new THREE.PointLight('0xffffff', 1);
pointLight.position.x = 2;
pointLight.position.y = 10;
pointLight.position.z = 4.4;

pointLight.castShadow = true;

//pointLight.shadow.mapSize.set(2048, 2048);
//pointLight.shadow.radius = 1.75;

scene.add(pointLight);

/*
gui.add(pointLight.position, 'x')
gui.add(pointLight.position, 'y')
gui.add(pointLight.position, 'z')
*/
// Shadow

//Color
const col = { color: '#ffffff' };
/*gui.addColor(col,'color').onChange(() => {
    pointLight.color.set(col.color)
})*/

//  Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 3;
scene.add(camera);

//gui.add(camera.position, 'x')
//gui.add(camera.position, 'y')
//gui.add(camera.position, 'z')

// Controls
//const controls = new OrbitControls(camera, renderer.domElement)
const controls = new TrackballControls(camera, canvas);

//controls.screenSpacePanning = true
//controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  preserveDrawingBuffer: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//renderer.shadowMap.enabled = true
//save File
const strMime = '../static/jpeg';
renderer.domElement.toDataURL(strMime);
/**
 * Animate
 */

document.addEventListener('mousemove', animateTerrain);

let mouseY = 0;

function animateTerrain(event) {
  mouseY = event.clientY;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // sphere.rotation.y = .5 * elapsedTime

  //plane.rotation.z =  .5 *  elapsedTime
  // plane.material.displacementScale  =  .3  +  mouseY * 0.0008

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame

  window.requestAnimationFrame(tick);

};

tick();

///////////////////////////////// Hnormal map to height map


let heightMap = document.createElement( 'img' );
heightMap.addEventListener( 'load', onLoad, false );
heightMap.src = '\\new1.jpg';
document.body.appendChild( heightMap );

const normalMap = document.createElement( 'canvas' );
document.body.appendChild( normalMap );



function onLoad() {

  normalMap.width = heightMap.width;
  normalMap.height = heightMap.height;

  normalMap.getContext( '2d' ).drawImage( heightMap, 0, 0 );

  height2normal( normalMap );

}

function height2normal( canvas ) {

  var context = canvas.getContext( '2d' );

  var width = canvas.width;
  var height = canvas.height;

  var src = context.getImageData( 0, 0, width, height );
  var dst = context.createImageData( width, height );

  for ( var i = 0, l = width * height * 4; i < l; i += 4 ) {

    var x1, x2, y1, y2;

    if ( i % ( width * 4 ) == 0 ) {

      // left edge

      x1 = src.data[ i ];
      x2 = src.data[ i + 4 ];

    } else if ( i % ( width * 4 ) == ( width - 1 ) * 4 ) {

      // right edge

      x1 = src.data[ i - 4 ];
      x2 = src.data[ i ];

    } else {

      x1 = src.data[ i - 4 ];
      x2 = src.data[ i + 4 ];

    }

    if ( i < width * 4 ) {

      // top edge

      y1 = src.data[ i ];
      y2 = src.data[ i + width * 4 ];

    } else if ( i > width * ( height - 1 ) * 4) {

      // bottom edge

      y1 = src.data[ i - width * 4 ];
      y2 = src.data[ i ];

    } else {

      y1 = src.data[ i - width * 4 ];
      y2 = src.data[ i + width * 4 ];

    }

    dst.data[ i ] = ( x1 - x2 ) + 127;
    dst.data[ i + 1 ] = ( y1 - y2 ) + 127;
    dst.data[ i + 2 ] = 255;
    dst.data[ i + 3 ] = 255;


  }

  context.putImageData( dst, 0, 0 );

}

onLoad();