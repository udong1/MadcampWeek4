import { useLocation, useNavigate } from "react-router-dom";
import './ResultPage.css';
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';
import { Info, useUserInfo } from "./UserInfo";

function ResultPage(){
    const navigate = useNavigate()
    const location = useLocation()
    const score = location.state.score
    const [degree, setDegree] = useState<number>(0)
    const {userInfo, setDate} = useUserInfo()
    const degreeList = ["저세상 요리사", "그냥저냥", "MadBurger KING", "MadBurger GOD"]
    const [ranking, setRanking] = useState<Info[]>([])


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
                break;
            case score<1000:
                setDegree(1)
                break;
            case score<2000:
                setDegree(2)
                break;
            case score>=2000:
                setDegree(3)
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

    useEffect(()=>{
        setDate()
        degreeDiscriminator()
        fetchRanking()
    },[])
    



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
                <div>
                    <img className="Degree_img" src={process.env.PUBLIC_URL+`/degree/degree${degree}.png`} alt="img"/>
                    <div className="Degree">{degreeList[degree]}</div>
                </div>
                <div className="My_result">{score}</div>
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

