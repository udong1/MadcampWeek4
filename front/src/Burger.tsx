
import { useEffect, useRef } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BurgerRecipe from './BurgerRecipe';
import './App.css'
import gsap from 'gsap';

const Burger: React.FC = () => {
    // const burgerMesh = useRef<Three.Group | undefined>(undefined);
    const divRef = useRef<HTMLDivElement>(null)
    const burgerGroupRef = useRef<Three.Group>(new Three.Group())
    //scene
    const scene = new Three.Scene();
    scene.background = new Three.Color('white')
    //light
    const ambientLight = new Three.AmbientLight(0xffffff, 1);
    scene.add(ambientLight)
    const directionalLight = new Three.DirectionalLight(0xffffff,1)
    directionalLight.position.set(10,10,0)
    const targetObject = new Three.Object3D();
    scene.add(targetObject);
    targetObject.position.set(0, 0, 0); // 원하는 방향으로 조절
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight)
    //floor
    const floorGeo = new Three.PlaneGeometry(10,10)
    const floorMat = new Three.MeshStandardMaterial({ color : 0xeeeeee, roughness:0.8, metalness:0.1})
    const floor = new Three.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0,-2,0)
    floor.receiveShadow = true
    scene.add(floor)
    //camera
    const camera = new Three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,5)
    camera.lookAt(0,-1,1);
    camera.lookAt(0,-1,0);

    const renderer = new Three.WebGLRenderer({
        antialias:true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = Three.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = Three.ACESFilmicToneMapping;







  useEffect(() => {
    console.log("useEffect")
    //burger 생성
    const loader = new GLTFLoader();
    function loadBurger(){
        for (const ingredient of BurgerRecipe){
            console.log(ingredient)
                loader.load(process.env.PUBLIC_URL+`/stylized_burger/${ingredient}.glb`, (gltf)=>{
                    const temp = gltf.scene
                    temp.position.set(0,-1.5,0)
                    temp.receiveShadow=true
                    temp.castShadow=true
                    burgerGroupRef.current.add(temp)
            })   
        }
        scene.add(burgerGroupRef.current)
        console.log("scene add")
    }
    
    loadBurger()


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
    }, []);

    const startAnimate = () =>{
        requestAnimationFrame(startAnimate)
        burgerGroupRef.current.rotation.y += 0.001;
        renderer.render(scene, camera)
    }
    function openBurger(){
        console.log("openBurger")
        openBurgerAnimate()
    }
    function closeBurger(){
        console.log("closeBurger")
        closeBurgerAnimate()
    }

    const openBurgerAnimate = () =>{
        const bunBottom = burgerGroupRef.current.getObjectByName("bun_bottom")
        const bunCheese = burgerGroupRef.current.getObjectByName("bun_cheese")
        const onion = burgerGroupRef.current.getObjectByName("onion")
        gsap.to(bunBottom!!.position,{
            duration: 0.3,
            y:-0.25,
        })
        gsap.to(bunCheese!!.position, {
            duration: 0.3,
            y:-0.25,
        })
        gsap.to(onion!!.position,{
            duration: 0.3,
            y:-0.25,
        })
    }
    const closeBurgerAnimate = () => {
        const bunBottom = burgerGroupRef.current.getObjectByName("bun_bottom")
        gsap.to(bunBottom!!.position,{
            duration: 0.3,
            y:0.04,
        })
    }


    return (
    <div ref={divRef}>
        <div className="Button_container">
            <button className="Start" onMouseEnter={openBurger} onMouseLeave={closeBurger}>START</button>
        </div>
    </div>
    );
};

export default Burger;
