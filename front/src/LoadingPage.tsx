import { useNavigate } from "react-router-dom"
import './LoadingPage.css'
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'


function LoadingPage(){
    const navigate = useNavigate()
    const [userNickname, setUserNickname] = useState<string>("")

    function moveToMain(){
        navigate('/main')
    }
    function moveToBurger(){
        navigate('/')
    }
    function getNickname(){
        const temp = localStorage.getItem("UserNickname")
        if(temp!==null){
            setUserNickname(temp)
        }

    }
    useEffect(()=>{
        getNickname()
    })

    return (
        <div className="Loading_page">
            <div className="Loading_top_container">
                {userNickname===""? "welcome!" : `welcome, ${userNickname}!`}
            </div>
            <div className="Loading_bottom_container">
                <button className="Loading_start" onClick={moveToMain}>START</button>
            </div>
            <div className="Onboarding">
                <Swiper
                    centeredSlides={true}
                    spaceBetween={50}
                    navigation
                    pagination = {{ clickable : true}}
                    modules={[Navigation, Pagination]}
                    onSwiper={(swiper : any)=> console.log(swiper)}>
                    <SwiperSlide >
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding1.png"} alt=""/>
                            {/* <div className="Onboarding_description">hihihi</div> */}
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding2.png"} alt=""/>
                            {/* <div className="Onboarding_description">hihihi</div> */}
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding3.png"} alt=""/>
                            
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding4.png"} alt=""/>
                            {/* <div className="Onboarding_description">hihihi</div> */}
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="Logo_container">
                {/* <img className="Donald" src={process.env.PUBLIC_URL+"/donald.png"} alt="donald"/> */}
                <img className="Mad" src={process.env.PUBLIC_URL+"/mad.png"} alt="MAD" onClick={moveToBurger}/>
                <div className="Donald_text">donald</div>
            </div>
        </div>
    )
}
export default LoadingPage