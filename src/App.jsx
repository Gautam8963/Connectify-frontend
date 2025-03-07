import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./components/Body"

function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body></Body>} >
            <Route path="/login" element={<div>login page</div>} />
            <Route path="/signup" element={<div>profule page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
