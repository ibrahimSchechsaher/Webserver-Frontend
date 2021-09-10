import './style.css';
import * as THREE from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';


// -------------------------------------------------------

// --- API CALL ------------------------------------------

let getJSON = function (url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
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
        };
        //document.body.appendChild(imageElement);
    };
    xhr.send();
};

getJSON('http://127.0.0.1:8000/getHeightMap/');

// ------------------------------------------------------------


// Texture loader
const loader = new THREE.TextureLoader();
let height = loader.load('heightmap.jpg');

// Debug

// Canvas
let canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.PlaneBufferGeometry(2.5, 2.5, 256, 256);

let heightMap = document.createElement('img');
heightMap.addEventListener('load', onLoad, false);
heightMap.src = '\\heightmap.jpg';
//document.body.appendChild( heightMap );

const normalMap = document.createElement('canvas');

//document.body.appendChild(normalMap);

const normalMapImage = new Image();
normalMapImage.src = normalMap.toDataURL('image/jpeg', 1.0);

function onLoad() {

    normalMap.width = heightMap.width;
    normalMap.height = heightMap.height;

//save heightmap image on device

    normalMap.getContext('2d').drawImage(heightMap, 0, 0);

    height2normal(normalMap);
    let normalmapTexture = new THREE.CanvasTexture(normalMap);

// Materials
    const material = new THREE.MeshStandardMaterial({
        color: '#b8b09b',
        displacementMap: height,
        normalMap: normalmapTexture

    });

// Mesh
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = 181;
// Lights

    const light = new THREE.DirectionalLight('0xffffff', 2);
    light.position.x = 1;
    light.position.y = 0.12;
    light.position.z = 1;

    light.castShadow = true;
    scene.add(light);


//  Sizes

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

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


// Controls

    const controls = new TrackballControls(camera, canvas);


    /**
     * Renderer
     */

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        preserveDrawingBuffer: true
        //normalMap : normalMapImage
        // normalMap : normalmapTexture
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//renderer.shadowMap.enabled = true
    /**
     * Animate
     */

    const tick = () => {


        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame

        window.requestAnimationFrame(tick);

    };

    tick();

    document.getElementById('downloud').addEventListener("click", () => {
        let imgData;
        try {
            let heightMapImg = 'heightmap.jpg';
            imgData = renderer.domElement.toDataURL(heightMapImg);

            saveFile(imgData, 'terrain.jpg');

        } catch (e) {
            console.log(e);
            return;
        }
    });
    let saveFile = function (strData, filename) {
        let link = document.createElement('a');

        link.download = filename;
        link.href = strData;
        link.click();


    };


}

// Normal Map

function height2normal(canvas) {

    var context = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    var src = context.getImageData(0, 0, width, height);
    var dst = context.createImageData(width, height);

    for (var i = 0, l = width * height * 4; i < l; i += 4) {

        var x1, x2, y1, y2;

        if (i % (width * 4) == 0) {

            // left edge

            x1 = src.data[i];
            x2 = src.data[i + 4];

        } else if (i % (width * 4) == (width - 1) * 4) {

            // right edge

            x1 = src.data[i - 4];
            x2 = src.data[i];

        } else {

            x1 = src.data[i - 4];
            x2 = src.data[i + 4];

        }

        if (i < width * 4) {

            // top edge

            y1 = src.data[i];
            y2 = src.data[i + width * 4];

        } else if (i > width * (height - 1) * 4) {

            // bottom edge

            y1 = src.data[i - width * 4];
            y2 = src.data[i];

        } else {

            y1 = src.data[i - width * 4];
            y2 = src.data[i + width * 4];

        }

        dst.data[i] = (x1 - x2) + 127;
        dst.data[i + 1] = (y1 - y2) + 127;
        dst.data[i + 2] = 255;
        dst.data[i + 3] = 255;


    }

    context.putImageData(dst, 0, 0);

}

//onLoad();