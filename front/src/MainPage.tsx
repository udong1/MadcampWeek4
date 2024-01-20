import { useEffect, useState } from "react"
import './MainPage.css'
import { useNavigate } from "react-router-dom"

function MainPage(){
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState<string[]>([])
    const [userRecipe, setUserRecipe] = useState<string[]>([]) 
    const [round, setRound] = useState<number>(0)
    const [success, setSuccess] = useState<number>(0)
    const [time, setTime] = useState<number>(30)
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
                if(time < 3){
                    endGame()
                }
                else{
                    setTime((prev)=>prev-3)
                }
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
    }
    function clearBurger(){
        setUserRecipe([])
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
            <div className="Prompt_container">
                <div className="Prompt">
                    {prompt.map((item) => item)}
                </div>
            </div>
            <div className="Round">{round}</div>
            <button className="Ingredient" onClick={()=>makeBurger("lettuce")}>양상추</button>
            <button className="Ingredient" onClick={()=>makeBurger("patty")}>패티</button>
            <button className="Ingredient" onClick={()=>makeBurger("cheese")}>치즈</button>
            <button className="Ingredient" onClick={()=>makeBurger("pickle")}>피클</button>
            <button className="Ingredient" onClick={()=>makeBurger("tomato")}>토마토</button>
            <button className="Ingredient" onClick={()=>makeBurger("onion")}>양파</button>
            <button className="Ingredient" onClick={()=>makeBurger("bun_top")}>빵</button>
            <button className="Reload" onClick={clearBurger}>다시 만들기</button>
            <div>
                {userRecipe.map((item)=>item)}
            </div>
            {time>0 && <div className="Timer">현재시간 : {time}</div>}
            {time<=0 && <div className="Timer">현재시간 : 0</div>}
            <div className="Success">성공 : {success}</div>
            {/* 다시 만들기로 다시 만듦 top_bun 클릭 시 newRound 시작*/}
        </div>
    )
}

export default MainPage