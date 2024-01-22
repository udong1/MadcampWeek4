
import { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const BunBottom = (scene: Three.Scene, group: Three.Group) => {
        const loader = new GLTFLoader();
        loader.load(`./stylized_burger/bun_bottom.glb`, (gltf)=>{
            const temp = gltf.scene
            temp.traverse(function(node) {
                if (node instanceof Three.Mesh) {                         
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })            
            group.add(temp)
            scene.add(group)
        })   
}

var G_ingredient=""
export const AddIngredient = (ingredient: string, scene: Three.Scene, group: Three.Group) => {
        const loader = new GLTFLoader();
        G_ingredient = ingredient;
    
        loader.load(`./stylized_burger/${ingredient}.glb`, (gltf)=>{
            const temp = gltf.scene
            temp.position.set(0,1,0)
            temp.traverse(function(node) {
                if (node instanceof Three.Mesh) {                         
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            group.add(temp)
            scene.add(group)
        })
}

const MainBurger: React.FC = () => {
    const divRef = useRef<HTMLDivElement>(null)
    const burgerGroupRef = useRef<Three.Group>(new Three.Group())

    //scene
    const [scene, setScene] = useState<Three.Scene>(new Three.Scene());
    scene.background = new Three.Color('white')

    //light
    const ambientLight = new Three.AmbientLight(0xFFC0C0, 2);
    scene.add(ambientLight)

    const targetObject = new Three.Object3D();
    targetObject.position.set(20, 0, 0); // 원하는 방향으로 빛 방향 조절
    scene.add(targetObject);

    const directionalLight = new Three.DirectionalLight(0xffffff,4)
    directionalLight.position.set(10,20,0)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.bottom = -5;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.mapSize.width = 4096;  // 그림자 맵의 너비
    directionalLight.shadow.mapSize.height = 4096; // 그림자 맵의 높이
    scene.add(directionalLight)

    //floor
    const floorGeo = new Three.PlaneGeometry(10,10)
    const floorMat = new Three.MeshStandardMaterial({ color : 0xeeeeee, roughness:0.8, metalness:0.1})
    const floor = new Three.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0,-2,0)
    floor.receiveShadow = true;
    scene.add(floor)

    //camera
    const camera = new Three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,2,5)
    camera.lookAt(0,0.5,0);

    // renderer
    const renderer = new Three.WebGLRenderer({
        antialias:true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = Three.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    renderer.toneMapping = Three.ACESFilmicToneMapping;

    const startAnimate = () =>{
        requestAnimationFrame(startAnimate)
        renderer.render(scene, camera)
    }
    
    useEffect(() => {
    //burger 생성
    scene.children.length = 0;

    const newScene = new Three.Scene();
    newScene.background = new Three.Color('white');
    setScene(newScene);

    BunBottom(scene, burgerGroupRef.current);
    AddIngredient(G_ingredient, scene, burgerGroupRef.current);

    if (divRef.current) {   
        divRef.current.appendChild(renderer.domElement)

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(newWidth, newHeight);
        };

        handleResize();
        startAnimate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        }}
    }, [G_ingredient]);

    return (
        <div ref={divRef}>
        </div>
    );
};

export default MainBurger;
