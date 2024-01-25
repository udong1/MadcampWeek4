import { useEffect, useState, useRef } from "react"
import './MainPage.css'
import { useNavigate } from "react-router-dom"
import BurgerRecipe from "./BurgerRecipe"
import { CreateBunBottom } from "./CreateBunBottom"
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

import { useUserInfo } from "./UserInfo"
import { positional } from "yargs"
import { group } from "console"


const MainPage : React.FC = () => {
    const navigate = useNavigate()
    const {setScore} = useUserInfo()
    const [prompt, setPrompt] = useState<string[]>([])
    const [userRecipe, setUserRecipe] = useState<string[]>([]) 
    const [round, setRound] = useState<number>(0)
    const [totalScore, setTotalScore] = useState<number>(0)
    const maxTime = 30
    const [time, setTime] = useState<number>(maxTime)
    const [startTime, setStartTime] = useState<number>()
    const [randNum, setRandNum] = useState<number>()
    let timer : NodeJS.Timeout

    const divRef = useRef<HTMLDivElement>(null)
    const burgerGroupRef = useRef<Three.Group>(new Three.Group())

    //scene
    const scene = new Three.Scene();
    scene.background = new Three.Color('#FAFAFA')

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

    function moveToBurger(){
        navigate('/')
    }

    function generator(){
        const max=5
        const min=2
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        setRandNum(rand)
        const newPrompt : string[] = []
        const ingredient = ["patty","cheese","tomato","lettuce","pickle","onion"]
        for (let i=0; i < rand ; i++){
            const randContent = Math.floor(Math.random() * (6));
            newPrompt.push(ingredient[randContent])
        }
        console.log(prompt)
        if(!newPrompt.some(item => item === "patty")){
            newPrompt.splice(1,0,"patty")
        }
        newPrompt.push("bun_top")
        console.log("round : ", round ,"prompt : ", newPrompt)
        setPrompt(newPrompt)
    }
    function setGame(){
        console.log("startGame")
        setRound((prev)=>prev+1)
        generator()
        setStartTime(Date.now())
        //TODO : bun_bottom 만들기
        // BunBottom(true, scene, group);
        BunBottom(scene, burgerGroupRef.current)
        scene.add(burgerGroupRef.current)
    } 
    function endGame(){
        console.log("endGame")
        clearTimeout(timer)
        const result = {
            score : totalScore,
        }
        setScore(totalScore)
        navigate('/result',{state : result})
    }
    function timeCount(){
        setTime((prev)=>prev-1)
    }
    function makeBurger(ingredient : string){
        //애니메이션 추가해야함
        if(ingredient === "bun_top"){
            const endTime = Date.now()
            console.log("endTime", endTime)
            const timeDiff = endTime - startTime!!
            console.log("startTime", startTime)
            const score = Math.floor(randNum!!*randNum!!*randNum!!/timeDiff*10000)
            console.log("score", score)
            console.log("Timediff", timeDiff)
            if(isEqual([...userRecipe, "bun_top"], prompt)){
                console.log("성공!")
                setTotalScore((prev)=>prev+score)
            }
            else{
                console.log("실패!")
                setTotalScore((prev)=>prev-score)
            }
            newRound()
            setStartTime(Date.now())
        } else {
            // 사용자가 클릭한 재료 추가 
            AddIngredient(ingredient, scene, burgerGroupRef.current);
            setUserRecipe((prev)=>[...prev, ingredient])
        }
    }

    function isEqual(arr1 : string[], arr2 : string[]){
        console.log("arr1", arr1)
        console.log("arr2", arr2)
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])
    }

      async function newRound() {
        // 만들어야하는 리스트를 새로 생성 
        setRound((prev) => prev + 1);
        setUserRecipe([]);
        generator();
      
        // TODO: bun_bottom만 남기기
        BunTop(scene, burgerGroupRef.current);
      }
      

    function clearBurger(){
        setUserRecipe([])
        ResetBurger(scene, burgerGroupRef.current, divRef)
    }

    var [prevPosition, setPrevPosition] = useState<number[]>([]);
    const AddIngredient = (ingredient: string, scene: Three.Scene, group: Three.Group) => {
        const loader = new GLTFLoader();
        loader.load(`./stylized_burger/${ingredient}.glb`, (gltf) => {
            const temp = gltf.scene;
            temp.position.set(0, 1, 0);

            var newPosition = calculateNewPosition(ingredient);
            setPrevPosition((prev)=>[...prev, newPosition.newPosition])
            console.log("생성할 포지션", prevPosition)
            
    
            temp.rotation.set(0, Math.random() * Math.PI * 2, 0);

            gsap.to(temp.position, {
                duration: 0.5,
                ease: "bounce.out",
                y: prevPosition[prevPosition.length-1]+newPosition.originalPosition,
            });
    
            temp.traverse(function (node) {
                if (node instanceof Three.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            group.add(temp);
        });
    };

    // Function to calculate new position based on the ingredient
    const calculateNewPosition = (ingredient: string): { newPosition: number, originalPosition: number } => {
        let newPosition = prevPosition[prevPosition.length - 1];
        let originalPosition = 0.0;
    
        switch (ingredient) {
            case 'onion':
                newPosition += 0.04;
                originalPosition = 0.02;
                break;
            case 'pickle':
                newPosition += 0.10;
                originalPosition = 0.05;
                break;
            case 'lettuce':
                newPosition += 0.06;
                originalPosition = 0.03;
                break;
            case 'tomato':
                newPosition += 0.04;
                originalPosition = 0.02;
                break;
            case 'cheese':
                newPosition += 0.02;
                originalPosition = 0.01;
                break;
            case 'patty':
                newPosition += 0.10;
                originalPosition = 0.05;
                break;
            default:
                break;
        }
    
        return { newPosition, originalPosition };
    };
    


    const BunBottom = (scene: Three.Scene, group: Three.Group) => {
        setPrevPosition((prev)=>[...prev, 0.05])
        const loader = new GLTFLoader();
        loader.load(`./stylized_burger/bun_bottom.glb`, (gltf) => {
            const temp = gltf.scene
            temp.position.set(2,0,0)
            gsap.to(temp.position, {
                duration: 0.5,
                ease: "bounce.out",
                x: 0.0,
            });
            temp.traverse(function(node) {
                if (node instanceof Three.Mesh) {                         
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            group.add(temp)
        })   
    }

    const BunTop = (scene: Three.Scene, group: Three.Group) => {
        const loader = new GLTFLoader();
        loader.load(`./stylized_burger/bun_top.glb`, (gltf) => {
            const temp = gltf.scene
            temp.position.set(0,1,0)
            gsap.to(temp.position, {
                duration: 0.5,
                ease: "bounce.out",
                y: prevPosition[prevPosition.length-1]+0.1,
                onComplete: () => {
                    gsap.to(group.position, {
                        duration: 0.5, 
                        x: -2, 
                        onComplete: () => {
                          // 애니메이션이 완료된 후에 실행될 코드
                          // 예를 들어, 해당 그룹을 제거하거나 숨길 수 있음
                            clearBurger()
                            group.position.set(0,0,0)
                        },
                    });
                }
            });
            temp.traverse(function(node) {
                if (node instanceof Three.Mesh) {                         
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            group.add(temp)
        })   
    }

    const ResetBurger = (scene: Three.Scene, group: Three.Group, divRef: React.RefObject<HTMLDivElement>) => {
        for (let i = group.children.length - 1; i >= 0; i--) {
            const child = group.children[i];    
            group.remove(child);
            if (child instanceof Three.Mesh) {
                if (child.geometry) 
                    child.geometry.dispose();
                if (child.material) 
                    child.material.dispose();
            }
        }
        BunBottom(scene, group);
    };

    
    useEffect(()=>{
        setGame()
    },[])

    useEffect(()=>{
        console.log("time : ", time)
        if(time > 0){
            setTimeout(timeCount, 1000)
        }else{
            endGame()
        }
    },[time])

    useEffect(()=>{
        // BunBottom(scene, burgerGroupRef.current);
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
    },[])

    return (
        <div className="Page">
            <div className="Top_container">
                {time>0 && <div className="Timer_container">
                            <div className="Timer" style={{width : `${time/maxTime*100}%`,
                                                            height : "100%", 
                                                            backgroundColor :`${time<5? "#DA4930": "#FFA500"}`,
                                                            position : "relative",
                                                            borderTopRightRadius : `${time===maxTime? "10px":"0px"}`,
                                                            borderTopLeftRadius : `${time===maxTime? "10px":"10px"}`,
                                                            borderBottomRightRadius : `${time===maxTime? "10px":"0px"}`,
                                                            borderBottomLeftRadius : `${time===maxTime? "10px":"10px"}`,
                                                            }}></div> 
                        </div>}
                {time<=0 && <div className="Timer_container"></div>}
                <div className = "Prompt_container">
                    {prompt.map((item) => <div className="Prompt">
                                            <img className="Prompt_img" src={process.env.PUBLIC_URL+`/burger_img/${item}.png`} alt={item}/>
                                        </div>)}
                </div>
            </div>
            <div ref={divRef}></div>
            <div className="Ingredient_container">
                {BurgerRecipe.slice(2).map((item)=>(
                    <button className="Ingredient" onClick={()=>makeBurger(item)}>
                        <img className="Ingredient_button"src={process.env.PUBLIC_URL + `/burger_img/${item}.png`} alt={item}/>
                    </button>
                ))}
                <button className="Ingredient" onClick={()=>clearBurger()}>
                    <img className="Retry"src={process.env.PUBLIC_URL + `/trash.png`} alt="Retry"/>
                </button>
            </div>
            {/* <div>
                {userRecipe.map((item)=>item)}
            </div> */}
            <div className="Score_container">
                <div className="Score">score</div>
                <div className="Score_num">{totalScore.toString()}</div>
            </div>
            <div className="Logo_container">
                {/* <img className="Donald" src={process.env.PUBLIC_URL+"/donald.png"} alt="donald"/> */}
                <img className="Mad" src={process.env.PUBLIC_URL+"/mad.png"} alt="MAD" onClick={moveToBurger}/>
                <div className="Donald_text">donald</div>
            </div>
        </div>
    )
}

export default MainPage