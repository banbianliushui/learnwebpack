var THREE = require('three');
var scene = new THREE.Scene(); //场景
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //透视摄像机（视野角度，长宽比，远剪切面，近剪切面）
var renderer = new THREE.WebGLRenderer(); //渲染器
renderer.setSize(window.innerWidth, window.innerHeight); //渲染器宽高设置为浏览器宽高
document.body.appendChild(renderer.domElement); //将renderer渲染器元素添加到html文档

var geometry = new THREE.BoxGeometry(1, 1, 1); //BoxGeometry（立方体）对象,这个对象包含了一个立方体中所有的顶点（vertices）和面（faces）。
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
}); //给立方体对象添加材质使其有颜色。
var cube = new THREE.Mesh(geometry, material); //网格，网格是包含有一个几何体以及应用在此几何体上的材质的对象，我们可以直接将网格对象放入到我们的场景中，并让它在场景中自由移动。
scene.add(cube); //调用scene.add()，物体将会被添加到坐标为(0,0,0)的位置
camera.position.z = 5;

var tag = 1; //右侧
function animate() {
  //调用一个render“渲染”或者“动画循环”,使其真正渲染
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  if (tag == 1) {
    cube.position.x += 0.02;
    if (cube.position.x >= 9) {
      tag = 0;
    }
  } else {
    cube.position.x -= 0.02;
    if (cube.position.x < -9) {
      tag = 1;
    }
  }

  renderer.render(scene, camera);
}
//animate();

module.exports = animate;