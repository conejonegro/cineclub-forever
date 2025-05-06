import { useEffect } from "react";
import {Outlet, useNavigate } from "react-router";

const userDataString = localStorage.getItem('userData');
const userData = JSON.parse(userDataString);

function ProtectedRoutes({redirectTo="/", isLogged}){

    const navigate = useNavigate();
    useEffect(()=>{
      if(userData){
        navigate("/");
        // window.location.reload();
      }
    },[])

      return <Outlet />
        
      }    

export default ProtectedRoutes;