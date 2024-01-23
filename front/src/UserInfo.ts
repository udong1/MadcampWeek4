import { atom, useRecoilState } from 'recoil';

export type Info =  {
    nickname : string,
    score : number,
    date : string
}
const defaultInfo : Info = {
    nickname : "",
    score : 0,
    date : new Date().toString()
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
        setUserInfo((prevUserInfo)=>({...prevUserInfo, date : new Date().toString()}))
    }

    return {userInfo, setNickname, setScore, setDate}
}
