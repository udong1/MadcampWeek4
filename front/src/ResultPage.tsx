import { useNavigate } from "react-router-dom";

function ResultPage(){
    const navigate = useNavigate()
    function moveToMain(){
        navigate('/main')
    }
    return (
        <div>
            <button onClick={moveToMain}>restart</button>
        </div>
    )
}

export default ResultPage