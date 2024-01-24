import { useLocation, useNavigate } from "react-router-dom";
import './ResultPage.css';
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';
import { Info, useUserInfo } from "./UserInfo";
import gsap from 'gsap';

function ResultPage(){
    const navigate = useNavigate()
    const location = useLocation()
    // const score = location.state.score
    const score = 2200
    const [degree, setDegree] = useState<number>(-1)
    const {userInfo, setDate} = useUserInfo()
    const degreeList = ["< 저세상 요리사 >", "< 그럭저럭 >", "< MadBurger KING >", "< MadBurger GOD >"]
    const [ranking, setRanking] = useState<Info[]>([])
    const [descriptionColor,setDescriptionColor] = useState<string>()


    function moveToMain(){
        navigate('/main')
    }
    function moveToBurger(){
        navigate('/')
    }
    function degreeDiscriminator(){
        switch(true){
            case score<0 :
                setDegree(0)
                setDescriptionColor("#FF5A5A")
                break;
            case score<1000:
                setDegree(1)
                setDescriptionColor("#8C8C8C")
                break;
            case score<2000:
                setDegree(2)
                setDescriptionColor("#FFA550")
                break;
            case score>=2000:
                console.log("3")
                setDegree(3)
                setDescriptionColor("#FFA550")
                break;
            default:
                break;
        }
    }
    async function fetchRanking(){
        try {
            const info = userInfo
            const tempInfo : Info[] = []
            let processedNickname = info.nickname
            if(processedNickname === ""){
                processedNickname = localStorage.getItem("UserNickname")? localStorage.getItem("UserNickname")!! : "Mad Donald"
            }
            const request = {userId : processedNickname, userScore : info.score, scoreDate : info.date.toString()}
            console.log("request :", request)
            const response = await axios.post('http://143.248.225.12:3001/searchRanking', request);
            console.log('Data:', response.data);
            response.data.data.forEach((item: { user_id: string; user_score: number; score_date: string; })=>{
                const processDate = item.score_date.split(" ")[1]+"/"+item.score_date.split(" ")[2]+"/"+item.score_date.split(" ")[3]
                const info : Info = {nickname : item.user_id,
                                    score : item.user_score,
                                    date : processDate}
                tempInfo.push(info)
                console.log("info 넣기", info)
            })
            setRanking(tempInfo)
          } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                  console.error("Error submitting form : ", error.response?.data);
                } else {
                  console.error("Unexpected error : ", error);
                }
              } else {
                console.error("Non-Axios error : ", error);
              }
          }
    }
    function degree0Animate(){
        const ani = gsap.to("#Degree_symbol", {
            duration : 2,
            ease : "none",
            repeat : -1,
            yoyo : true,
            rotation : -10,
            transformOrigin : "center bottom",
        })
        return () => 
        {
            ani.kill()
        }
    }
    function degree1Animate(){
        let toLeft = true
        const ani = gsap.to("#Degree_symbol", {
            duration : 0.7,
            ease : "none",
            repeat : -1,
            yoyo : true,
            x : toLeft? -10 : 10,
            onComplete : () => {
                if(toLeft){
                    toLeft = false
                } else {
                    toLeft = true
                }
            }
        })
        return () => 
        {
            ani.kill()
        }
    }
    function degree2Animate(){
        const ani = gsap.to("#Degree_symbol", {
            duration : 1.2,
            ease : "none",
            repeat : -1,
            yoyo : true,
            height : "40%",
        })
        return () => 
        {
            ani.kill()
        }
    }
    function degree3Animate(){
        const ani1 = gsap.to("#Degree_symbol_left", {
            duration : 1.3,
            ease : "none",
            repeat : -1,
            yoyo : true,
            rotation: 20,
            transformOrigin : "100% 0%", 
        })
        const ani2 = gsap.to("#Degree_symbol_right", {
            duration : 1.3,
            ease : "none",
            repeat : -1,
            yoyo : true,
            rotation: -20,
            transformOrigin : "0 0",
        })
        return () => 
        {
            ani1.kill()
            ani2.kill()
        }
    }


    useEffect(()=>{
        setDate()
        degreeDiscriminator()
        fetchRanking()
    },[])
    useEffect(()=>{
        switch(degree){
            case 3 :
                console.log("start degree3 animation")
                degree3Animate()
                break
            case 2 :
                console.log("start degree2 animation")
                degree2Animate()
                break
            case 1 : 
                console.log("start degree1 animation")
                degree1Animate()
                break
            case 0 :
                console.log("start degree0 animation")
                degree0Animate()
                break
            default :
                break
        }
    },[degree])
    // 


    return (
        <div className="ResultPage">
            <div className="Others">
                <div className="Rank">
                    <div className="Rank_title">Ranking</div>
                    <div className="Rank_container">
                        {ranking.map((item, index)=>(
                            <div className="Single_rank" key={index}>
                                <div className="Rank_Num" style={{color : index<3 ? '#FFA550' : '#FFDD95'}}>{index+1}</div>
                                <div className="Rank_Nickname">{item.nickname}</div>
                                <div className="Rank_Date">{item.date}</div>
                                <div className="Rank_Score" style={{color : index<3 ? '#FFA550' : '#FFDD95'}}>{item.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="My_result_container">
                <div className="Empty"></div>
                <div className="My_result">
                    <img className="Degree_hat" src={process.env.PUBLIC_URL+`/result/hat${degree}.png`} alt=""
                        style={{height : degree===0||degree===3? "20%" : "30%", top : degree===0||degree===3? "-11%":"-23%"}}/>
                    <img className="Result_background" src={process.env.PUBLIC_URL+`/result/degree${degree}.png`} alt="img"/>
                    <div className="Degree" style={{color:descriptionColor}}>{degreeList[degree]}</div>
                    <div className="My_score" style={{color:descriptionColor}}>{score}</div>
                    {degree<3 && <img id="Degree_symbol" className="Degree_symbol" src={process.env.PUBLIC_URL+`/result/symbol${degree}.png`} alt=""
                        style={{transform : degree===0? "rotate(5deg)" : "", 
                                bottom : degree===1? "10%": "5%",
                                height : degree===0||degree===2? "35%": "25%"}}/>}
                    {degree===3 && 
                        <>
                            <img id="Degree_symbol_left" className="Degree_symbol_left" src={process.env.PUBLIC_URL+`/result/symbol${degree}_left.png`} alt=""/>
                            <img id="Degree_symbol_right" className="Degree_symbol_right" src={process.env.PUBLIC_URL+`/result/symbol${degree}_right.png`} alt=""/>
                        </>
                                    }
                </div>
                <button className="Re_button" onClick={moveToMain}>RESTART</button>
            </div>
            <div className="Logo_container">
                {/* <img className="Donald" src={process.env.PUBLIC_URL+"/donald.png"} alt="donald"/> */}
                <img className="Mad" src={process.env.PUBLIC_URL+"/mad.png"} alt="MAD" onClick={moveToBurger}/>
                <div className="Donald_text">donald</div>
            </div>
            
        </div>
    )
}

export default ResultPage

// width : degree===0? "70%":"40%"