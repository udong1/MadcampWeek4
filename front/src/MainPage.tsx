import { useEffect, useState } from "react"
import './MainPage.css'
import { useNavigate } from "react-router-dom"
import BurgerRecipe from "./BurgerRecipe"

function MainPage(){
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState<string[]>([])
    const [userRecipe, setUserRecipe] = useState<string[]>([]) 
    const [round, setRound] = useState<number>(0)
    const [success, setSuccess] = useState<number>(0)
    const maxTime = 1000000000
    const [time, setTime] = useState<number>(maxTime)
    let timer : NodeJS.Timeout


    function generator(){
        const max=5
        const min=2
        const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
        const newPrompt : string[] = []
        const ingredient = ["patty","cheese","tomato","lettuce","pickle","onion"]
        for (let i=0; i < randNum ; i++){
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
        //TODO : bun_bottom 만들기
    } 
    function endGame(){
        console.log("endGame")
        clearTimeout(timer)
        navigate('/result')
    }
    function timeCount(){
        setTime((prev)=>prev-1)
    }
    function makeBurger(ingredient : string){
        //애니메이션 추가해야함
        if(ingredient === "bun_top"){
            if(isEqual([...userRecipe, "bun_top"], prompt)){
                console.log("성공!")
                setSuccess((prev)=>prev+1)
            }
            else{
                console.log("실패!")
                //점수 낮추기
            }
            newRound()
        } else {
            setUserRecipe((prev)=>[...prev, ingredient])
        }
    }
    function isEqual(arr1 : string[], arr2 : string[]){
        console.log("arr1", arr1)
        console.log("arr2", arr2)
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])
    }
    function newRound(){
        //만들어야하는 리스트를 새로 생성 
        setRound((prev)=>prev+1)
        setUserRecipe([])
        generator()
        //TODO : bun_bottom만 남기기
    }
    function clearBurger(){
        setUserRecipe([])
        //TODO : bun_bottom만 남기기
    }


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
    
    
    

    return (
        <div className="Page">
            <div className="Top_container">
                {time>0 && <div className="Timer_container">
                            <div className="Timer" style={{width : `${time/maxTime*100}%`,
                                                            height : "100%", 
                                                            backgroundColor :`${time<5? "#D75926": "#FFA500"}`,
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
                <div className="Score_num">{success}</div>
            </div>
            {/* 다시 만들기로 다시 만듦 top_bun 클릭 시 newRound 시작*/}
        </div>
    )
}

export default MainPage