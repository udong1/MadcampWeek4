import { atom, useRecoilState } from 'recoil';

type Info =  {
    nickname : string,
    score : number,
    date : Date
}
const defaultInfo : Info = {
    nickname : "",
    score : 0,
    date : new Date()
}
export const UserInfo = atom<Info>({
    key: 'UserInfo',
    default: defaultInfo
})
export function useUserInfo(){
    const [userInfo, setUserInfo] = useRecoilState(UserInfo)

    function setNickname(updateNickname : string){
        setUserInfo((prevUserInfo)=>({...prevUserInfo, nickname: updateNickname}))
    }
    function setScore(updateScore : number){
        setUserInfo((prevUserInfo)=>({...prevUserInfo, score : updateScore}))
    }
    function setDate(){
        setUserInfo((prevUserInfo)=>({...prevUserInfo, date : new Date()}))
    }

    return {userInfo, setNickname, setScore, setDate}
}
