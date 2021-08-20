import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

let strDownloadMime = '../static/heightmap.jpg';
document.getElementById('downloud').addEventListener('blur', () => {
  console.log('im here');
  let imgData;

  try {
    let strMime = '../static/heightmap.jpg';
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
const height = loader.load('new1.jpg');
const texture = loader.load('orginal.jpg');
// const alpha = loader.load ('/alpha.png)
console.log(height.toString());

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.PlaneBufferGeometry(2.5, 2.5, 64, 64);

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
