import {BrowserRouter, Route, Routes} from "react-router-dom"
import HomePage from "./scenes/Home"
import LoginPage from "./scenes/Login"
import MainPage from "./scenes/Main"
import Layout from "./components/Layout"
import MatchPage from "./scenes/Match"
import SuccessPage from "./scenes/Success"
import RegisterPage from "./scenes/Register"

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Main page without Layout wrapper */}
          <Route path="/" element={<MainPage />} />
          
          {/* Other pages with Layout wrapper */}
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/match" element={<MatchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
