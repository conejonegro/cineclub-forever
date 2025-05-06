import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { UserContext } from "../UserProvider";
import { useContext, useEffect } from "react";

export default function DarkModeBTN(){

   const { darkMode, setDarkMode } = useContext(UserContext);

   function toggleDarkLight() {
      if (darkMode) {
        localStorage.setItem("darkmode", false);
        setDarkMode(false);
      } else {
        localStorage.setItem("darkmode", true);
        setDarkMode(true);
      }
    }



   return(
      <div
            id="darkModeBTN"
            className="d-flex text-center flex-column ms-2 rounded-4 border p-2 border-dark row-gap-2 align-items-center justify-content-center mt-4"
            onClick={toggleDarkLight}
          >
            {darkMode ? <MdDarkMode /> : <MdOutlineLightMode />}
            <div>{darkMode ? "Dark Mode" : "Light Mode"}</div>
          </div>
   )
}