import { Subtitles } from "@/lib/subtitles";

const descripciones = {
  Snob: "Un grupo de gente de Chihuahua con más cultura que humildad se reúne a recomendarse películas entre sí. No hay reglas de género ni década: puede ser una dosmilera under o una obra maestra que quieran presumir haber visto. Cada quien trae lo suyo y el resto decide qué tanto trae.",
  Libre: "Aquí no hay tema ni pretexto: cada quien propone lo que se le antoja, sin importar género, año o qué tan rara sea la recomendación. Es el ciclo de \"me late esta, ni sé por qué, solo véanla\".",
  Teens: "Películas de crecer, de andar perdido, de esa edad en la que todo se siente exagerado. Coming of age, nostalgia y algo de incomodidad adolescente, vista con ojos de adulto.",
};

function slugify(str) {
  if (!str) return "";

  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Deriva la lista de ciclos existentes a partir del catálogo real,
// en el orden en que aparecen por primera vez en Subtitles().
export function getCiclos() {
  const movies = Subtitles();
  const nombres = [];
  movies.forEach((m) => {
    if (m.ciclo && !nombres.includes(m.ciclo)) nombres.push(m.ciclo);
  });

  return nombres.map((nombre) => ({
    nombre,
    slug: slugify(nombre),
    descripcion: descripciones[nombre] ?? "",
    totalPeliculas: movies.filter((m) => m.ciclo === nombre).length,
  }));
}
