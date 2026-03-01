const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(100, 200, 100);
scene.add(light);

// CAMERA START
camera.position.set(0, 10, 0);

// === TOUCH LOOK ===
let touchX = 0;
let touchY = 0;

document.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].pageX;
  touchY = e.touches[0].pageY;
});

document.addEventListener("touchmove", (e) => {
  const deltaX = e.touches[0].pageX - touchX;
  const deltaY = e.touches[0].pageY - touchY;

  camera.rotation.y -= deltaX * 0.005;
  camera.rotation.x -= deltaY * 0.005;

  camera.rotation.x = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, camera.rotation.x)
  );

  touchX = e.touches[0].pageX;
  touchY = e.touches[0].pageY;
});

// === JOYSTICK UI ===
const joystick = document.createElement("div");
joystick.style.position = "absolute";
joystick.style.bottom = "40px";
joystick.style.left = "40px";
joystick.style.width = "100px";
joystick.style.height = "100px";
joystick.style.background = "rgba(0,0,0,0.3)";
joystick.style.borderRadius = "50%";
document.body.appendChild(joystick);

let moveX = 0;
let moveZ = 0;

joystick.addEventListener("touchmove", (e) => {
  const rect = joystick.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left - 50;
  const y = e.touches[0].clientY - rect.top - 50;

  moveX = x / 50;
  moveZ = y / 50;
});

joystick.addEventListener("touchend", () => {
  moveX = 0;
  moveZ = 0;
});

// === BLOCK SETUP ===
const geometry = new THREE.BoxGeometry(1, 1, 1);
const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

function getHeight(x, z) {
  return Math.floor(
    5 + Math.sin(x * 0.1) * 4 + Math.cos(z * 0.1) * 4
  );
}

// === CHUNKS ===
const chunkSize = 16;
const renderDistance = 2;
const loadedChunks = {};

function generateChunk(chunkX, chunkZ) {
  const key = `${chunkX},${chunkZ}`;
  if (loadedChunks[key]) return;

  for (let x = 0; x < chunkSize; x++) {
    for (let z = 0; z < chunkSize; z++) {
      const worldX = chunkX * chunkSize + x;
      const worldZ = chunkZ * chunkSize + z;
      const height = getHeight(worldX, worldZ);

      for (let y = 0; y < height; y++) {
        const material =
          y === height - 1 ? grassMaterial : stoneMaterial;

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(worldX, y, worldZ);
        scene.add(cube);
      }
    }
  }

  loadedChunks[key] = true;
}

function updateChunks() {
  const playerX = Math.floor(camera.position.x / chunkSize);
  const playerZ = Math.floor(camera.position.z / chunkSize);

  for (let x = -renderDistance; x <= renderDistance; x++) {
    for (let z = -renderDistance; z <= renderDistance; z++) {
      generateChunk(playerX + x, playerZ + z);
    }
  }
}

// === GAME LOOP ===
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;

  camera.position.x -= Math.sin(camera.rotation.y) * moveZ * speed;
  camera.position.z -= Math.cos(camera.rotation.y) * moveZ * speed;

  camera.position.x -= Math.cos(camera.rotation.y) * moveX * speed;
  camera.position.z += Math.sin(camera.rotation.y) * moveX * speed;

  updateChunks();
  renderer.render(scene, camera);
}

animate();
