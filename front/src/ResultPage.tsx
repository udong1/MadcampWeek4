import { useLocation, useNavigate } from "react-router-dom";
import './ResultPage.css';
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';

function ResultPage(){
    const navigate = useNavigate()
    const location = useLocation()
    const score = location.state.score
    const [degree, setDegree] = useState<number>(0)
    const degreeList = ["저세상 요리사", "그냥저냥", "MadBurger KING", "MadBurger GOD"]

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
            const response = await axios.get('');
            console.log('Data:', response.data);
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
    async function sendResult(){
        try {
            const response = await axios.post('');
            console.log('Data:', response.data);
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
        degreeDiscriminator()
        sendResult()
        fetchRanking()
    },[])
    



    return (
        <div className="ResultPage">
            <div className="Others">
                <div className="Rank">
                    <div className="Rank_title">Ranking</div>
                    <div className="Rank_container">
                    
                    </div>
                </div>
            </div>
            <div className="My_result_container">
                <div>
                    {/* <img className="Degree_img" src={process.env.PUBLIC_URL+`${}`} alt=""/> */}
                    <div className="Degree">{degreeList[degree]}</div>
                </div>
                <div className="My_result">{score}</div>
                <button className="Re_button" onClick={moveToMain}>RESTART</button>
            </div>
            <div className="Logo_container">
                {/* <img className="Donald" src={process.env.PUBLIC_URL+"/donald.png"} alt="donald"/> */}
                <div className="Donald_text">donald</div>
                <img className="Mad" src={process.env.PUBLIC_URL+"/mad.png"} alt="MAD" onClick={moveToBurger}/>
            </div>
            
        </div>
    )
}

export default ResultPage

