import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import TMDBApiCall from "../utils/TMBDApiCall";
import { Subtitles } from "../utils/subtitles";
import "../css/home-page.css";
import "../css/pelicula.css";

//  const baseURL = `https://api.themoviedb.org/3/movie/346698/keywords?api_key=${API_KEY}`;
// const baseURL = `https://api.themoviedb.org/3/search/movie?query=${nameQuery}&api_key=${API_KEY}`;
function TmdbApiCall() {
  // Hooks, and variables needed
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname;
  const moviesData = Subtitles();
  const IMG_PATH = process.env.REACT_APP_IMG_PATH;

  useEffect(() => {
    async function fetchData() {
      const tmdbdata = await TMDBApiCall(moviesData);
      setPosts(tmdbdata);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <h5 className="container">Cargando...</h5>;
  }

  let myPosts = posts?.map((post) => {
    post.title.toLowerCase();
    return {
      title: post.title,
      slug: post.title.toLowerCase().replace(/\s+/g, "-"),
      id: post.id,
      poster: post.poster_path,
      sinopsis: post.overview,
      release_date: post.release_date,
    };
  });

  const peliculasDataArraySliced = myPosts.slice(0, 4);

  if (isHomePage === "/") {
    return (
      <div id="peliculasCont" className="container">
        <Helmet>
          <meta name="description" content={"Join Cineclub Forever in Guadalajara, Jalisco, Mexico, for a unique cinematic experience! Discover classic and indie films with fellow movie lovers. Watch, discuss, and enjoy film screenings every week!"} />
          <title>Cineclub Forever | True Love Design</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>

        <h1 className="my-4">Ultimas peliculas.</h1>

        <Row className="justify-content-start todas-peliculas-imdb">
          {myPosts.map((post) => {
            return (
              <div className="movie-container" key={post.id}>
                <Link to={"/peliculas-detalle/" + post.slug}>
                  <img
                    src={IMG_PATH + post.poster}
                    alt={post.nombre}
                    className="poster "
                  />
                  <h2>{post.title}</h2>
                  <p>{post.sinopsis.substring(0, 80) + "..."}</p>
                </Link>
              </div>
            );
          })}
        </Row>
      </div>
    );
  } else {
    return (
      <div id="peliculasCont" className="container my-4">
        <Helmet>
          <meta name="description" content={"Join Cineclub Forever in Guadalajara, Jalisco, Mexico, for a unique cinematic experience! Discover classic and indie films with fellow movie lovers. Watch, discuss, and enjoy film screenings every week!"} />
          <title>Todas Las Peliculas | Cineclub Forever</title>
        </Helmet>
        <h1 className="my-4">Ultimas peliculas.</h1>
        <Row className="justify-content-center todas-peliculas-imdb">
          {myPosts.map((post) => {
            return (
              <div className="movie-container" key={post.id}>
                <Link to={"/peliculas-detalle/" + post.slug}>
                  <img
                    src={IMG_PATH + post.poster}
                    alt={post.nombre}
                    className="poster "
                  />
                  <h2>{post.title}</h2>
                  <p>{post.sinopsis.substring(0, 80) + "..."}</p>
                </Link>
              </div>
            );
          })}
        </Row>
      </div>
    );
  }
}

export { TmdbApiCall };
