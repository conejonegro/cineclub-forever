import { getAuth, signOut } from "firebase/auth";
import "../css/profile.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

function Logout({}) {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const navigate = useNavigate();

  // Intento de actualizar la navegacion para que desaparezca un item
  // useEffect(() => {
  //     if(!userData) {
  //         navItemsLogin[2].user=false;
  //         console.log(navItemsLogin);
  //     }
  // },[]);
  // Intento de actualizar la navegacion para que

  function logOutFromCineclub() {
    localStorage.removeItem("userData");
    //console.log("loggin out")
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        // console.log(auth)
      })
      .catch((error) => {
        // An error happened.
      });
    // Redirigir a Home una vez DESLOGUEADO
    navigate("/");
    window.location.reload();
  }

  if (!userData) {
    return (
      <div className="container my-4">
        <h1>Esta ruta deberia estar escondida si no hay datos de usuario</h1>
      </div>
    );
  } else {
    return (
      <div className="container firebase-profile-cont">
        <Helmet>
          <meta
            name="description"
            content={
              "Descubre el perfil de usuario en Cineclub Forever: tu espacio personal para ver tus películas favoritas, explorar ciclos vistos, y conectar con otros amantes del cine en Guadalajara. ¡Únete y comparte tu pasión por el cine!"
            }
          />
          <title>Cineclub Forever | True Love Design</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <h1>Perfil:</h1>
        {userData.photoURL ? (
          <img src={userData.photoURL} alt={`${userData.displayName} Photo`} />
        ) : (
          ""
        )}
        {userData.displayName ? (
          <p>
            <b>Nombre</b>: {userData.displayName}
          </p>
        ) : (
          ""
        )}
        <p>
          <b>Email:</b> {userData.email}
        </p>

        <button type="button" onClick={logOutFromCineclub}>
          Logout from google
        </button>
      </div>
    );
  }
}

export default Logout;
