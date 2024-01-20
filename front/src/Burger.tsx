
import { useEffect, useRef } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BurgerRecipe from './BurgerRecipe';
import './App.css'

const Burger: React.FC = () => {
  const burgerRef = useRef<HTMLDivElement>(null);
  const burgerMesh = useRef<Three.Group | undefined>(undefined);
  const exampleMesh = useRef<Three.Mesh | undefined>(undefined);
  useEffect(() => {
    if (burgerRef.current) {

        const clock = new Three.Clock();
        const scene = new Three.Scene();
        scene.background = new Three.Color('green');

        const camera = new Three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 8);
        camera.lookAt(0, 0, 0);

        const renderer = new Three.WebGLRenderer({
            antialias: true,
            });

        const ambientLight = new Three.AmbientLight(0xffffff, 1);
        scene.add(ambientLight)

        const directionalLight = new Three.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 0);
        const targetObject = new Three.Object3D();
        targetObject.position.set(0, 0, 0); // 원하는 방향으로 조절
        scene.add(targetObject);
        directionalLight.target = targetObject;
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = Three.PCFSoftShadowMap;

        burgerRef.current.appendChild(renderer.domElement);

        const loader = new GLTFLoader();

        loader.load('./stylized_burger/colorTest.glb', (gltf) => {
            const burger = gltf.scene;
            burger.position.set(0, 1.5, 0);
            burger.receiveShadow = true;
            burger.traverse(function(node) {
                if (node instanceof Three.Mesh) {
                    const originalMaterial = node.material;

                    const color = originalMaterial.color;
                    console.log('Color:', color);

                    const standardMaterial = new Three.MeshStandardMaterial({ color });

                    node.material = standardMaterial;
                    
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            burgerMesh.current = burger;
            scene.add(burger);
        });

        // const ex = new Three.BoxGeometry(1, 1, 1);
        // const exMaterial = new Three.MeshStandardMaterial({ color: 0x00ff00 });
        // const example = new Three.Mesh(ex, exMaterial);
        // example.position.set(1, 0, 0);
        // exampleMesh.current = example;
        // example.receiveShadow = true; 
        // example.castShadow = true; 
        // scene.add(example);

        const planeGeometry = new Three.PlaneGeometry(20, 20, 1, 1);
        const planeMaterial = new Three.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.2,
        });
        const plane = new Three.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 0;
        plane.receiveShadow = true; 
        scene.add(plane);

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(newWidth, newHeight);
        };

        const rotationSpeed = 0.5;
        const animate = () => {
            const delta = clock.getDelta();
            requestAnimationFrame(animate);
        
            if (burgerMesh.current) {
            burgerMesh.current.rotation.y += rotationSpeed * delta;
            }
            if (exampleMesh.current) {
                exampleMesh.current.rotation.y += rotationSpeed * delta;
            }      
            renderer.render(scene, camera);
        };

        handleResize();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }
  }, []);

  return <div ref={burgerRef}></div>;
};

export default Burger;
