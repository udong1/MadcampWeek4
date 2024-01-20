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

            const light = new Three.DirectionalLight(0xffffff,1)
            light.position.set(-30,40,10)
            light.castShadow = true
            scene.add(light)

            const floorGeo = new Three.PlaneGeometry(10,10)
            const floorMat = new Three.MeshStandardMaterial({ color : 0xeeeeee, roughness:0.8, metalness:0.1})
            const floor = new Three.Mesh(floorGeo, floorMat)
            floor.rotation.x = -Math.PI / 2
            floor.position.set(0,-2,0)
            floor.receiveShadow = true
            scene.add(floor)

            const camera = new Three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0,0,5)
            camera.lookAt(0,-1,1);

            const renderer = new Three.WebGLRenderer({
                antialias:true
            });
            renderer.toneMapping = Three.ACESFilmicToneMapping;
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = Three.PCFShadowMap


            burgerRef.current.appendChild(renderer.domElement)

            const loader = new GLTFLoader();

            loader.load(process.env.PUBLIC_URL+"/stylized_burger/scene.gltf", (gltf)=>{
                const burger = gltf.scene
                burger.position.x=0
                burger.position.y=-0.5
                burger.position.z=0
                console.log("burger", burger.position)
                burger.receiveShadow=true
                burger.castShadow=true 
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