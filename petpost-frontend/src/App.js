import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    image: null,
  });
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/pets`)
      .then((res) => res.json())
      .then(setPets);
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    const response = await fetch(`${API_URL}/api/pets`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setForm({ name: "", breed: "", age: "", image: null });
      e.target.reset();
      fetch(`${API_URL}/api/pets`)
        .then((res) => res.json())
        .then(setPets);
    }
  };

  const handleDelete = async (petId) => {
    const response = await fetch(`${API_URL}/api/pets/${petId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetch(`${API_URL}/api/pets`)
        .then((res) => res.json())
        .then(setPets);
    }
  };

  return (
    <div>
      <h1>PetPost</h1>

      <form onSubmit={handleSubmit}>
        <h2>Add Pet</h2>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Breed"
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
          required
        />
        <input
          placeholder="Age"
          type="number"
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          required
        />
        <button>Add Pet</button>
      </form>

      <h2>Available Pets</h2>
      <div className="pets">
        {pets.map((pet) => (
          <div key={pet.id} className="pet">
            <img src={pet.imageUrl} alt={pet.name} />
            <h3>{pet.name}</h3>
            <p>
              {pet.breed}, {pet.age} years
            </p>
            <button onClick={() => handleDelete(pet.id)}>Delete</button>
          </div>
        ))}
        {pets.length === 0 && <p>No pets yet.</p>}
      </div>
    </div>
  );
}

export default App;
