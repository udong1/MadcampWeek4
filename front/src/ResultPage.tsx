import { useLocation, useNavigate } from "react-router-dom";
import './ResultPage.css';
import { useEffect, useState } from "react";

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

    useEffect(()=>{
        degreeDiscriminator()
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

