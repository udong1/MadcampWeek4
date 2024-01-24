import Burger from "./Burger";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import ResultPage from "./ResultPage";
import {RecoilRoot} from 'recoil';

function App() {
  

  return (
  <div>
    <BrowserRouter>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<div><Burger /></div> }></Route>
          <Route path="/main" element={<MainPage />}></Route>
          <Route path="/result" element={<ResultPage />}></Route>
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  </div>
  )
  
}

export default App;
