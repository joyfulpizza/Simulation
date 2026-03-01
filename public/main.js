const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// Controls (basic positioning)
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

// Block geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

// Simple height function
function getHeight(x, z) {
  return Math.floor(
    3 + Math.sin(x * 0.3) * 2 + Math.cos(z * 0.3) * 2
  );
}

// Generate terrain
const size = 20;

for (let x = 0; x < size; x++) {
  for (let z = 0; z < size; z++) {
    const height = getHeight(x, z);

    for (let y = 0; y < height; y++) {
      const material = y === height - 1 ? grassMaterial : stoneMaterial;
      const cube = new THREE.Mesh(geometry, material);

      cube.position.set(x, y, z);
      scene.add(cube);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
