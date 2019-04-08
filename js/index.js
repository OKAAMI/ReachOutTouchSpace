var scene, camera, renderer;

var videoSphere;

//var controls;

var intro; // mesh for intro panoramic

var mouse = new THREE.Vector2(),
    INTERSECTED;
var raycaster = new THREE.Raycaster();

var hotspots = [];
var initialised = false;

init();
animate();

function init() {

    setTheScene();

    //createHotspots();
    createLights();

    createPanorama();
    enableVR();

}

function setTheScene() {

    //set up scene
    scene = new THREE.Scene();

    //create camera
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);

    //create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

     // add control
    // controls = new THREE.OrbitControls( camera, renderer.domElement );

    // interscept mousemovements
    raycaster = new THREE.Raycaster();
    document.addEventListener('click', onClick, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);

}


function createHotspots() {

    // audio
    var audioLoader = new THREE.AudioLoader();
    var listener = new THREE.AudioListener();
    camera.add(listener);

    var boxGeom = new THREE.CubeGeometry(60, 100, 60);

    audioLoader.load('assets/audio/beach/waves.mp3', function (buffer) { //
        let hotspot = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            wireframe: true,
            transparent: true,
            opacity:0
        }));
        hotspot.position.copy(new THREE.Vector3(0, -10, -70)); //0, -10, -70
        hotspot.rotation.copy(Math.PI / 6);

        let audio = new THREE.PositionalAudio(listener);
        audio.setBuffer(buffer);
        audio.setLoop( true );
        audio.setVolume( 1 );
        audio.play();
        hotspot.add(audio);

        scene.add(hotspot);
        hotspots.push(hotspot)
    });

    
    audioLoader.load('assets/audio/beach/seagulls.mp3', function (buffer) {
        let hotspot = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            wireframe: true,
            transparent: true,
            opacity:0
        }));
        hotspot.position.copy(new THREE.Vector3(70, 30, -20));
        hotspot.rotation.copy(Math.PI / 6);

        let audio = new THREE.PositionalAudio(listener);
        audio.setBuffer(buffer);
        audio.setLoop( true );
        audio.setVolume( 1 );
        audio.play();
        hotspot.add(audio);

        scene.add(hotspot);
        hotspots.push(hotspot)
    }); 

    
   audioLoader.load('assets/audio/beach/icecreamvan2.mp3', function (buffer) {
        let hotspot = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity:0
        }));
        hotspot.position.copy(new THREE.Vector3(50, -10, 70));
        hotspot.rotation.copy(Math.PI / 6);

        let audio = new THREE.PositionalAudio(listener);
        audio.setBuffer(buffer);
        audio.setLoop( true );
        audio.setVolume( 1 );
        audio.play();
        hotspot.add(audio);
        scene.add(hotspot);

        hotspots.push(hotspot)
    }); 
    
   /* audioLoader.load('assets/audio/beach/foghorn.mp3', function (buffer) {
        let hotspot = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity:0
        }));
        hotspot.position.copy(new THREE.Vector3(-100, -10, 70));
        hotspot.rotation.copy(Math.PI / 6);

        let audio = new THREE.PositionalAudio(listener);
        audio.setBuffer(buffer);
        audio.setLoop( true );
        audio.setVolume( 1 );
        audio.play();
        hotspot.add(audio);
        scene.add(hotspot);

        hotspots.push(hotspot)
    }); */

    audioLoader.load('assets/audio/beach/childrenPlaying.mp3', function (buffer) {
        let hotspot = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            wireframe: true,
            transparent: true,
            opacity:0
        }));
        hotspot.position.copy(new THREE.Vector3(-70, -10, -10));
        hotspot.rotation.copy(Math.PI / 6);

        let audio = new THREE.PositionalAudio(listener);
        audio.setBuffer(buffer);
        audio.setLoop( true );
        audio.setVolume( 1 );
        audio.play();
        hotspot.add(audio);

        scene.add(hotspot);
        hotspots.push(hotspot)
    });

}


function createLights() {

    var directionalLight = new THREE.DirectionalLight(0xfffff, 1);
    directionalLight.position.set(-100, 100, 50);
    scene.add(directionalLight);

    /*var light = new THREE.SpotLight( 0xffffff, 0.5);
    light.position.set( 50, -20, -20 );
    scene.add( light );

    var hemisphereLight = new THREE.HemisphereLight( 0x00aaff, 0xff43ff, 1 );
    hemisphereLight.position.set( 0, 100, 0 );
    scene.add( hemisphereLight );*/

}


function createPanorama() {

    var video = document.createElement('video');
    video.width = window.innerWidth;
    video.height = window.innerHeight;
    video.loop = true;
    video.muted = true;
    video.src = '/assets/video/video.mp4';
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.play();

    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    var material = new THREE.MeshBasicMaterial({
        map: texture
       // transparent: true,
       // opacity:0
    });

    videoSphere = new THREE.Mesh(geometry, material);
    videoSphere.rotation.y = -Math.PI / 2;
    scene.add(videoSphere);


   /* var material = new THREE.MeshBasicMaterial( {
         map: new THREE.TextureLoader().load( '/assets/textures/south_bank_skate_park_small.jpg' ),
         transparent: true
         //opacity:0.5
    } );

    var introGeo = new THREE.SphereBufferGeometry(490, 60, 40);
    introGeo.scale(-1, 1, 1);

    intro = new THREE.Mesh( geometry, material );
    intro.matrixAutoUpdate = false;
    scene.add( intro );

    */
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function onClick(event) {
    if(!initialised){
        createHotspots();
        initialised = true;
       // TweenLite.to(intro.material, 5, {opacity: 0, onComplete:fadeInVideo});
    }
}

/* function fadeInVideo(){
    TweenLite.to(videoSphere.material, 5, {opacity: 1});
} */

function onDocumentMouseMove(event) {

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

   
}




function enableVR() {

    document.body.appendChild(WEBVR.createButton(renderer));
    //enable the renderer
    renderer.vr.enabled = true;
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {

    //if(!renderer.vr.enabled) controls.update();

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(hotspots); //sceneGl.children

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                let audio = INTERSECTED.children[ 0 ];
                // audio.setVolume(0.2);
                audio.gain.gain.linearRampToValueAtTime(0.2, audio.context.currentTime + 1);
            }
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
            let audio = INTERSECTED.children[ 0 ];
            audio.gain.gain.linearRampToValueAtTime(15, audio.context.currentTime + 0.5);
            //audio.setVolume(5);
          
        }
    
    } else {
        if (INTERSECTED){
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            let audio = INTERSECTED.children[ 0 ];
           // audio.setVolume(0.2);
            audio.gain.gain.linearRampToValueAtTime(0.2, audio.context.currentTime + 1);
        } 
        INTERSECTED = null;
     
    }

    renderer.render(scene, camera);
}