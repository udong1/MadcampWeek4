
import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BurgerRecipe from './BurgerRecipe';
import './Burger.css'
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from './UserInfo';

interface Rotation{
    x : number,
    y : number,
    z : number,
}

const Burger: React.FC = () => {
    const navigate = useNavigate();
    // const burgerMesh = useRef<Three.Group | undefined>(undefined);
    const divRef = useRef<HTMLDivElement>(null)
    const burgerGroupRef = useRef<Three.Group>(new Three.Group())

    //scene
    const scene = new Three.Scene();
    scene.background = null

    //light
    const ambientLight = new Three.AmbientLight(0xFFC0C0, 2);
    scene.add(ambientLight)

    const targetObject = new Three.Object3D();
    targetObject.position.set(-20, -10, 0); // 원하는 방향으로 빛 방향 조절
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
    const camera = new Three.PerspectiveCamera(13, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(-5,1,-5)
    camera.lookAt(0,0.45,0);

    // renderer
    const renderer = new Three.WebGLRenderer({
        alpha: true,
        antialias:true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = Three.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    renderer.toneMapping = Three.ACESFilmicToneMapping;

    //animation
    let slowMotion : boolean = false
    const [openEnabled, setOpenEnabled] = useState(true)
    const [closeEnabled, setCloseEnabled] = useState(false)
    const [closeTransmitted, setCloseTransmitted] = useState(false) 
    const [openTransmitted, setOpenTransmitted] = useState(false)
    const [ingredientList, setIngredientList] = useState<Three.Object3D[]>([])
    const [positionAnimationList, setPositionAnimationList] = useState<gsap.core.Tween[]>([])
    const [rotationAnimationList, setRotationAnimationList] = useState<gsap.core.Tween[]>([])
    const [rotationList, setRotationList ] = useState<Rotation[]>([])
    const maxRotation = 0.2
    const bunBottomPosition : number = 0.2

    //nickname 설정
    const [isRegister, setIsRegister] = useState(false)
    const {userInfo, setNickname} = useUserInfo()

    useEffect(() => {
        //burger 생성
        const loader = new GLTFLoader();
        function loadBurger(){
            for (const ingredient of BurgerRecipe){
                    loader.load(process.env.PUBLIC_URL+`/stylized_burger/${ingredient}.glb`, (gltf)=>{
                        const temp = gltf.scene
                        temp.traverse(function(node) {
                            if (node instanceof Three.Mesh) {                             
                                node.castShadow = true;
                                node.receiveShadow = true;
                            }
                        })
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
            }
        }
    }, []);

    useEffect(()=>{
        if(closeEnabled && closeTransmitted){
            closeBurger()
        }
    },[closeEnabled, closeTransmitted])
    useEffect(()=>{
        if(openEnabled && openTransmitted){
            openBurger()
        }
    },[openEnabled, openTransmitted])





    const startAnimate = () =>{
        requestAnimationFrame(startAnimate)
        if(slowMotion){
            burgerGroupRef.current.rotation.y += 0.00005;
        }
        else{
            burgerGroupRef.current.rotation.y += 0.01;
        }
        renderer.render(scene, camera)
    }
    function openBurger(){
        console.log("openBurger")
        slowMotion = true
        openBurgerAnimate()
        setOpenEnabled(false)
    }
    function closeBurger(){
        console.log("closeBurger")
        slowMotion = false
        closeBurgerAnimate()
        setCloseEnabled(false)
    }
    function checkEnd(){
        setCloseTransmitted(true)
        setOpenTransmitted(false)
        console.log("Close 대기중")
    }
    function checkStart(){
        setOpenTransmitted(true)
        setCloseTransmitted(false)
        console.log("Open 대기중")
    }
    const openBurgerAnimate = () => {
        rotationAnimationList.forEach((item)=>{
            item.kill()
        })
        positionAnimationList.forEach((item)=>{
            item.kill()
        })
        const tempIngredientList : Three.Object3D[] = []
        BurgerRecipe.forEach((item) => {
            const temp = burgerGroupRef.current.getObjectByName(item)
            temp && tempIngredientList.push(temp)
            console.log("tempIngredientList", tempIngredientList)
        })
        const tempPositionAnimationList : gsap.core.Tween[] = []
        const tempRotationAnimationList : gsap.core.Tween[] = []
        const tempRotationList : Rotation[] = []
        tempIngredientList.forEach((item, index)=>{
            const animationItem = gsap.to(item!!.position,{
                duration : 1,
                y: bunBottomPosition+index*0.08,
                ease : "expo.out",
                onComplete : () => {
                    setCloseEnabled(true)
                }
            })
            const newRotation : Rotation = {x : getRandomNum(maxRotation, -maxRotation), 
                                            y : getRandomNum(maxRotation, -maxRotation), 
                                            z : getRandomNum(maxRotation, -maxRotation)}
            tempRotationList.push(newRotation)
            const animationItem2 = gsap.to(item!!.rotation,{
                duration : 0.7,
                x : `+=${newRotation.x}`,
                y : `+=${newRotation.y}`,
                z : `+=${newRotation.z}`,
                ease : "power2.out",
            })
            tempPositionAnimationList.push(animationItem)
            tempRotationAnimationList.push(animationItem2)
        })
        setIngredientList(tempIngredientList)
        setRotationList(tempRotationList)
        setRotationAnimationList(tempRotationAnimationList)
        setPositionAnimationList(tempPositionAnimationList)
    }
    const closeBurgerAnimate = () => {
        rotationAnimationList.forEach((item)=>{
            item.kill()
            console.log("killing animation")
        })
        positionAnimationList.forEach((item)=>{
            item.kill()
        })
        const tempPositionAnimationList : gsap.core.Tween[] = []
        const tempRotationAnimationList : gsap.core.Tween[] = []
        console.log("ingredientList", ingredientList)
        ingredientList!!.forEach((item, index)=>{
            const tempPosition = gsap.to(item!!.position,{
                duration: 0.3,
                y:0.0,
                ease: "expo.in",
                onComplete : () => {
                    setOpenEnabled(true)
                }
            })
            const tempRotation = gsap.to(item!!.rotation,{
                duration : 0.3,
                x : `-=${rotationList[index].x}`,
                y : `-=${rotationList[index].y}`,
                z : `-=${rotationList[index].z}`,
                ease : "power4.in",
            })
            tempPositionAnimationList.push(tempPosition)
            tempRotationAnimationList.push(tempRotation)
        })
        setPositionAnimationList(tempPositionAnimationList)
        setRotationAnimationList(tempRotationAnimationList)
    }
    function moveToMain(){
        navigate('/main')
    }
    function getRandomNum(max : number, min : number){
        return (Math.random()*(max-min))+min;
    }
    function handleKeyDown(event : KeyboardEvent<HTMLInputElement>){
        if(event.key === 'Enter'){
            setIsRegister(true)
            event.preventDefault()
            console.log(userInfo)
        }
    }
    function handleInputChange(event : React.ChangeEvent<HTMLInputElement>){
        setNickname(event.target.value)
    }

    return (
    <div className = "Burger_page" >
        <div className="Burger_Logo_container">
            <img className="Burger_mad" src={process.env.PUBLIC_URL+'/mad.png'} alt="donald"/>
            <img className="Burger_donald" src={process.env.PUBLIC_URL+'/donald.png'} alt="donald"/>
        </div>
        <div className="Burger" ref={divRef}>
            <div className="Bottom_container">
                {!isRegister && 
                    <input 
                        className="getUserNickname" 
                        type="text" 
                        placeholder="enter your nickname"
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}/>
                }
                {isRegister && 
                    <button className="Start" onMouseEnter={checkStart} onMouseLeave={checkEnd} onClick={moveToMain}>START</button>
                }
            </div>
        </div>
    </div>
    );
};

export default Burger;
