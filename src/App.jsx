import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"

function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body></Body>} >
            <Route path="/login" element={<Login></Login>} />
            <Route path="/signup" element={<div>profule page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
