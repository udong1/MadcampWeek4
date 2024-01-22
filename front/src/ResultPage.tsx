import { useLocation, useNavigate } from "react-router-dom";
import './ResultPage.css'

function ResultPage(){
    const navigate = useNavigate()
    function moveToMain(){
        navigate('/main')
    }
    const location = useLocation()
    const score = location.state.score
    return (
        <div className="Page">
            <div>{score}</div>
            <button className="Re_button" onClick={moveToMain}>RESTART</button>
        </div>
    )
}

export default ResultPage