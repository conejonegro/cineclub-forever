"use client";

import React, { useState } from "react";
import { db } from "@/components/FirebaseSettings";
import { fetchReviewBySlug, toSlug } from "@/lib/getReviews/reviews";
import { deleteDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function SubirReviewDashboard() {
  const [activeTab, setActiveTab] = useState("crear"); // o 'editar'

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Reseñas</h1>

      {/* Tabs */}
      <div className="flex mb-6 space-x-4 border-b">
        <button
          className={`pb-2 font-semibold ${
            activeTab === "crear"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("crear")}
        >
          ➕ Subir nueva
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "editar"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("editar")}
        >
          ✏️ Editar existente
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      {activeTab === "crear" && <FormularioCrear />}
      {activeTab === "editar" && <FormularioEditar />}
    </main>
  );
}

function FormularioCrear() {
  const [form, setForm] = useState({
    slug: "",
    titulo: "",
    descripcion: "",
    contenido: "",
    imagenUrl: "",
    autor: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const id = toSlug(form.slug || form.titulo);
      if (!id) throw new Error("Slug o título inválido");
      const ref = doc(db, "reviews", id);
      await setDoc(ref, {
        ...form,
        slug: id,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccess("✅ Reseña subida con éxito");
      setForm({
        slug: "",
        titulo: "",
        descripcion: "",
        contenido: "",
        imagenUrl: "",
        autor: "",
      });
    } catch (err) {
      console.error(err);
      setError("❌ Error al subir la reseña");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Crear reseña nueva</h2>

      <CamposFormulario form={form} handleChange={handleChange} />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
      >
        Subir reseña
      </button>

      {success && <p className="mt-4 text-green-600 font-medium">{success}</p>}
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </form>
  );
}

function FormularioEditar() {
  const [slugInput, setSlugInput] = useState("");
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchReview = async () => {
    setStatus("loading");
    const data = await fetchReviewBySlug(slugInput);
    if (data) {
      setForm(data);
      setStatus("loaded");
    } else {
      setStatus("notfound");
      setForm(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form) return;

    try {
      const id = toSlug(form.id || form.slug || form.titulo);
      if (!id) throw new Error("ID/slug/título inválido");
      const ref = doc(db, "reviews", id);
      await updateDoc(ref, {
        ...form,
        slug: id,
        updatedAt: serverTimestamp(),
      });
      setStatus("updated");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      const id = toSlug(form.id || form.slug || form.titulo);
      if (!id) throw new Error("ID/slug/título inválido");
      const ref = doc(db, "reviews", id);
      await deleteDoc(ref);
      setStatus("deleted");
      setForm(null);
      setSlugInput("");
    } catch (err) {
      console.error(err);
      setStatus("delete-error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block font-medium mb-1">Slug de la reseña</label>
        <input
          type="text"
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={fetchReview}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cargar reseña
        </button>
      </div>

      {status === "notfound" && (
        <p className="text-red-500">No se encontró ninguna reseña con ese slug.</p>
      )}

      {form && (
        <form onSubmit={handleUpdate} className="space-y-4">
          <CamposFormulario form={form} handleChange={handleChange} />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
            >
              Eliminar reseña
            </button>
          </div>

          {status === "updated" && (
            <p className="text-green-600 font-medium">✅ Cambios guardados</p>
          )}
          {status === "error" && (
            <p className="text-red-600 font-medium">❌ Error al actualizar</p>
          )}
          {status === "deleted" && (
            <p className="text-red-500 font-medium">🗑️ Reseña eliminada con éxito</p>
          )}
          {status === "delete-error" && (
            <p className="text-red-600 font-medium">❌ Error al eliminar la reseña</p>
          )}
        </form>
      )}
    </div>
  );
}

function CamposFormulario({ form, handleChange }) {
  return (
    <>
      {[
        ["slug", "Slug (no editable en edición)", true],
        ["titulo", "Título"],
        ["descripcion", "Descripción corta"],
        ["imagenUrl", "URL de la imagen"],
        ["autor", "Autor"],
      ].map(([name, label, disabled]) => (
        <div key={name}>
          <label className="block font-medium mb-1">{label}</label>
          <input
            type="text"
            name={name}
            value={form[name] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            disabled={disabled}
          />
        </div>
      ))}

      <div>
        <label className="block font-medium mb-1">Contenido (HTML o texto largo)</label>
        <textarea
          name="contenido"
          value={form.contenido || ""}
          onChange={handleChange}
          rows={6}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
    </>
  );
}
