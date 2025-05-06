import { Route, Routes } from "react-router";
import {NavComponent} from "./NavComponent";
import Contacto from "../../pages/Contacto";
import PeliculaDetalle from "../../pages/pelicula-detalle";
import Footer from "./footer/Footer";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./scrollToTop";
import { TmdbApiCall } from "./TmdbAPICall";
import Logout from "./Logout";
import Login from "../pages/Login";
import Dashboard from "../dashboard/Dashboard";
import Registro from "../../pages/Registro";
import ProtectedRoutes from "./ProtectedRoutes";
import Ciclos from "../../pages/Ciclos";
import { CicloDetalle } from "../../pages/CicloDetalle";

function CineclubRoutes(){
    return(
       
        <BrowserRouter>
            <NavComponent />
            <Routes>

                <Route path="/" element= {<TmdbApiCall />} />
                <Route path="/peliculas" element={ <TmdbApiCall />} />
                <Route path="/ciclos" element={ <Ciclos />} />
                <Route path="/contacto" element={<Contacto /> } />
                <Route path="/peliculas-detalle/:slug" element={ <PeliculaDetalle /> } />
                <Route path="/ciclos/:slug" element={ <CicloDetalle /> } />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/login" element={ <Login /> } />
                    <Route path="/registro" element={ <Registro /> } />
                </Route>
                
                <Route path="/login" element={ <Login /> } />
                <Route path="/Logout" element={ <Logout /> } />
                <Route path="/admin" element={ <Dashboard /> } /> 
                <Route path="/profile" element={ <Logout /> } />
                <Route path="*" element={<p className="container">Not Found 404</p>} />

            </Routes>
            <Footer />
            <ScrollToTop />
        </ BrowserRouter>

    )
}
export default CineclubRoutes;