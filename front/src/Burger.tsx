import { useEffect, useRef} from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BurgerRecipe from './BurgerRecipe';


const Burger : React.FC=()=>{
    const divRef = useRef<HTMLDivElement>(null)
    const burgerGroupRef = useRef<Three.Group>(new Three.Group())
    //scene
    const scene = new Three.Scene();
    scene.background = new Three.Color('white')
    //light
    const light = new Three.DirectionalLight(0xffffff,1)
    light.position.set(-30,40,10)
    light.castShadow = true
    scene.add(light)
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


    
    useEffect(()=>{
        console.log("useEffect")
        //burger 생성
        const loader = new GLTFLoader();
        function loadBurger(){
            for (const ingredient of BurgerRecipe){
                console.log(ingredient)
                    loader.load(process.env.PUBLIC_URL+`/stylized_burger/${ingredient}.glb`, (gltf)=>{
                        const temp = gltf.scene
                        temp.position.set(0,-1,0)
                        temp.receiveShadow=true
                        temp.castShadow=true
                        burgerGroupRef.current.add(temp)
                })   
            }
            scene.add(burgerGroupRef.current)
            console.log("scene add")
        }
        
        loadBurger()

        if(divRef.current){

            const renderer = new Three.WebGLRenderer({
                antialias:true
            });
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = Three.PCFSoftShadowMap;
            renderer.shadowMap.autoUpdate = false;
            renderer.toneMapping = Three.ACESFilmicToneMapping;


            divRef.current.appendChild(renderer.domElement)

    
            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(newWidth, newHeight);
            };

            
            const animate = () =>{
                requestAnimationFrame(animate)
                burgerGroupRef.current.rotation.y += 0.001;
                const bunBottom = burgerGroupRef.current.getObjectByName("bun_bottom_5")
                if(bunBottom){
                    bunBottom.position.y = -0.8
                } else{
                    console.log("nothing")
                }
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
    },[])
    
    
    return (
        <div 
            ref={divRef}>
        </div>
    )

}

export default Burger;