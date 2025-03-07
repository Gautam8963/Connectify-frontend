import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"

function App() {
  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body></Body>} >
              <Route path="/" element={<Feed></Feed>} />
              <Route path="/login" element={<Login></Login>} />
              <Route path="/signup" element={<div>profule page</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
    </Provider>

    </>
  )
}

export default App
