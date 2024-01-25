import { useNavigate } from "react-router-dom"
import './LoadingPage.css'
import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import gsap from 'gsap'
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'


function LoadingPage(){
    const navigate = useNavigate()
    const [userNickname, setUserNickname] = useState<string>("")
    const hambergerRef = useRef<HTMLImageElement | null>(null)

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
    useEffect(()=>{
        if(hambergerRef.current){
            console.log("start animation")
            gsap.to(hambergerRef.current, {
                duration : 1,
                repeat : -1,
                yoyo : true,
                rotation : 10,
                ease : "none",
            })
        }
    },[hambergerRef])
    

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
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding1.png"} alt=""/>
                            <p className="Onboarding_description">
                                로고를 클릭하면<br/>
                                초기화면으로 돌아가요
                            </p>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding2.png"} alt=""/>
                            <p className="Onboarding_description">
                                점수를 확인하세요
                            </p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding3.png"} alt=""/>
                            <p className="Onboarding_description">
                                남은 시간을 확인하고<br/>
                                순서대로 재료를 쌓아요
                            </p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding4.png"} alt=""/>
                            <p className="Onboarding_description">
                                잘못 만든 버거는 꼭 휴지통을 눌러 버려주세요!
                            </p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img className="Onboarding_img"src={process.env.PUBLIC_URL+"/onboarding/onboarding5.png"} alt=""/>
                            <p className="Onboarding_description">
                                START를 눌러 시작!
                            </p>
                            <img ref={hambergerRef} className="Onboarding_hamburger"src={process.env.PUBLIC_URL+"/onboarding/hamburger.png"} alt=""/>
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