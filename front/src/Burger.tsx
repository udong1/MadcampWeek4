
import { useEffect, useRef } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BurgerRecipe from './BurgerRecipe';
import './Burger.css'
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';


const Burger: React.FC = () => {
    const navigate = useNavigate();
    // const burgerMesh = useRef<Three.Group | undefined>(undefined);
    const divRef = useRef<HTMLDivElement>(null)
    const burgerGroupRef = useRef<Three.Group>(new Three.Group())

    //scene
    const scene = new Three.Scene();
    scene.background = null

    //light
    const ambientLight = new Three.AmbientLight(0xffffff, 1);
    scene.add(ambientLight)

    const targetObject = new Three.Object3D();
    targetObject.position.set(20, 0, 0); // 원하는 방향으로 빛 방향 조절
    scene.add(targetObject);

    const directionalLight = new Three.DirectionalLight(0xffffff,1)
    directionalLight.position.set(10,20,0)
    directionalLight.castShadow = true
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
    camera.position.set(-5,1,-5)
    camera.lookAt(0,0.5,0);

    // renderer
    const renderer = new Three.WebGLRenderer({
        alpha: true,
        antialias:true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = Three.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = Three.ACESFilmicToneMapping;

  useEffect(() => {
    //burger 생성
    const loader = new GLTFLoader();
    function loadBurger(){
        for (const ingredient of BurgerRecipe){
                loader.load(process.env.PUBLIC_URL+`/stylized_burger/${ingredient}.glb`, (gltf)=>{
                    const temp = gltf.scene
                    temp.traverse(function(node) {
                        if (node instanceof Three.Mesh) {       
                            console.log("메쉬다", node)                                  
                            node.castShadow = true;
                        }
                    })
                    temp.receiveShadow = true;
                    switch (ingredient) {
                        case 'bun_top':
                            temp.position.set(0, 0.36, 0);
                            break;
                        case 'onion':
                            temp.position.set(0, 0.26, 0); 
                            break;
                        case 'pickle':
                            temp.position.set(0, 0.26, 0); 
                            break;
                        case 'lettuce' :
                            temp.position.set(0, 0.23, 0); 
                            break;
                        case 'tomato' :
                            temp.position.set(0, 0.20, 0); 
                            break;
                        case 'cheese' :
                            temp.position.set(0, 0.18, 0); 
                            break;
                        case 'patty' :
                            temp.position.set(0, 0.12, 0); 
                            break;
                        case 'bun_cheese' :
                            temp.position.set(0, 0.06, 0); 
                            break;
                        case 'bun_bottom' :
                            temp.position.set(0, 0, 0); 
                            break;
                        default:
                            break;
                    }
                    burgerGroupRef.current.add(temp)
            })   
        }
        scene.add(burgerGroupRef.current)
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
        burgerGroupRef.current.rotation.y += 0.1;
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
        const duration = 0.3
        const bunTop = burgerGroupRef.current.getObjectByName("bun_top")
        const onion = burgerGroupRef.current.getObjectByName("onion")
        const pickle = burgerGroupRef.current.getObjectByName("pickle")
        const lettuce = burgerGroupRef.current.getObjectByName("lettuce")
        const tomato = burgerGroupRef.current.getObjectByName("tomato")
        const cheese = burgerGroupRef.current.getObjectByName("cheese")
        const patty = burgerGroupRef.current.getObjectByName("patty")
        const bunCheese = burgerGroupRef.current.getObjectByName("bun_cheese")
        const bunBottom = burgerGroupRef.current.getObjectByName("bun_bottom")
        gsap.to(bunTop!!.position,{
            duration: 0.3,
            y:0.30,
        })
        gsap.to(onion!!.position,{
            duration: 0.3,
            y:0.24,
        })
        gsap.to(pickle!!.position,{
            duration: 0.3,
            y:0.18,
        })
        gsap.to(lettuce!!.position,{
            duration: 0.3,
            y:0.12,
        })
        gsap.to(tomato!!.position,{
            duration: 0.3,
            y:0.06,
        })
        gsap.to(cheese!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(patty!!.position,{
            duration: 0.3,
            y:-0.06,
        })
        gsap.to(bunCheese!!.position, {
            duration: 0.3,
            y:-0.12,
        })
        gsap.to(bunBottom!!.position,{
            duration: 0.3,
            y:-0.18,
        })
    }
    const closeBurgerAnimate = () => {
        const bunTop = burgerGroupRef.current.getObjectByName("bun_top")
        const onion = burgerGroupRef.current.getObjectByName("onion")
        const pickle = burgerGroupRef.current.getObjectByName("pickle")
        const lettuce = burgerGroupRef.current.getObjectByName("lettuce")
        const tomato = burgerGroupRef.current.getObjectByName("tomato")
        const cheese = burgerGroupRef.current.getObjectByName("cheese")
        const patty = burgerGroupRef.current.getObjectByName("patty")
        const bunCheese = burgerGroupRef.current.getObjectByName("bun_cheese")
        const bunBottom = burgerGroupRef.current.getObjectByName("bun_bottom")
        gsap.to(bunTop!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(onion!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(pickle!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(lettuce!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(tomato!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(cheese!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(patty!!.position,{
            duration: 0.3,
            y:0.00,
        })
        gsap.to(bunCheese!!.position, {
            duration: 0.3,
            y:0.00,
        })
        gsap.to(bunBottom!!.position,{
            duration: 0.3,
            y:0.00,
        })
    }
    function moveToMain(){
        navigate('/main')
    }

    return (
    <div className = "Burger_page" ref={divRef}>
        <div className="Button_container">
            <button className="Start" onMouseEnter={openBurger} onMouseLeave={closeBurger} onClick={moveToMain}>START</button>
        </div>
    </div>
    );
};

export default Burger;
