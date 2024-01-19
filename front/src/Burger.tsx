import { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const Burger : React.FC=()=>{
    const burgerRef = useRef<HTMLDivElement>(null)

    
    useEffect(()=>{
        console.log("useEffect")
        if(burgerRef.current){

            burgerRef.current.innerHTML=""
            console.log("start")

            const scene = new Three.Scene();
            scene.background = new Three.Color('white')

            const camera = new Three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0,-0.5,5);

            const renderer = new Three.WebGLRenderer({
                antialias:true
            });
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = Three.PCFSoftShadowMap;
            renderer.shadowMap.autoUpdate = false;
            renderer.toneMapping = Three.ACESFilmicToneMapping;

            const directionalLight = new Three.DirectionalLight(0xffffff, 0.5)
            directionalLight.position.set(-2,2,2)

            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 50;
            directionalLight.shadow.camera.top = 5;
            directionalLight.shadow.camera.bottom = -5;
            directionalLight.shadow.camera.left = -5;
            directionalLight.shadow.camera.right = 5;

            scene.add(directionalLight)
            directionalLight.castShadow = true

            burgerRef.current.appendChild(renderer.domElement)

            const loader = new GLTFLoader();

            loader.load(process.env.PUBLIC_URL+"/stylized_burger/scene.gltf", (gltf)=>{
                const burger = gltf.scene
                burger.position.set(0,0.3,0)
                burger.receiveShadow = true;
                scene.add(burger)
            })
            

            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(newWidth, newHeight);
            };

            
            const animate = () =>{
                requestAnimationFrame(animate)
                scene.rotation.y += 0.001;
                renderer.render(scene, camera)
            }
            handleResize();
            animate();

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                renderer.dispose()
            };
        }
    }, [])
    
    
    return (
        <div 
            ref={burgerRef}>
        </div>
    )

}

export default Burger;