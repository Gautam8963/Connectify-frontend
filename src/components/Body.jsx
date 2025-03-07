import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"
import Footer from "./Footer";

const Body = () => {

    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>

    )
}
export default Body;