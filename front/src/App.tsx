import Burger from "./Burger";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import ResultPage from "./ResultPage";

function App() {
  
  
  return (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div><Burger /></div> }></Route>
        <Route path="/main" element={<MainPage />}></Route>
        <Route path="/result" element={<ResultPage />}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
  
}

export default App;
