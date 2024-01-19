import { request } from 'http';
import { useEffect, useRef } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface BurgerProps{
    path : string;
}

const Burger : React.FC<BurgerProps>=({path})=>{
    const burgerRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(burgerRef.current){

            console.log("start")

            const scene = new Three.Scene();
            scene.background = new Three.Color('white')

            const camera = new Three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.z=5;

            const renderer = new Three.WebGLRenderer({
                antialias:true
            });
            renderer.toneMapping = Three.ACESFilmicToneMapping;


            burgerRef.current.appendChild(renderer.domElement)

            const loader = new GLTFLoader();
            loader.load(process.env.PUBLIC_URL+path, (gltf)=>{
                scene.add(gltf.scene)
            })

            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(newWidth, newHeight);
            };

            window.addEventListener('resize', handleResize);
            
            const animate = () =>{
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
            }
            
            animate();

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [path])
    

    return <div ref={burgerRef}/>

}

export default Burger;