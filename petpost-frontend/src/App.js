import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: "", breed: "", age: "", image: null });

  useEffect(() => {
    fetch("http://localhost:3001/api/pets")
      .then(res => res.json())
      .then(setPets);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    
    const response = await fetch("http://localhost:3001/api/pets", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      setForm({ name: "", breed: "", age: "", image: null });
      e.target.reset();
      fetch("http://localhost:3001/api/pets").then(res => res.json()).then(setPets);
    }
  };

  return (
    <div>
      <h1>PetPost</h1>
      
      <form onSubmit={handleSubmit}>
        <h2>Add Pet</h2>
        <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Breed" onChange={e => setForm({...form, breed: e.target.value})} required />
        <input placeholder="Age" type="number" onChange={e => setForm({...form, age: e.target.value})} required />
        <input type="file" onChange={e => setForm({...form, image: e.target.files[0]})} required />
        <button>Add Pet</button>
      </form>

      <h2>Available Pets</h2>
      <div className="pets">
        {pets.map(pet => (
          <div key={pet.id} className="pet">
            <img src={pet.imageUrl} alt={pet.name} />
            <h3>{pet.name}</h3>
            <p>{pet.breed}, {pet.age} years</p>
          </div>
        ))}
        {pets.length === 0 && <p>No pets yet.</p>}
      </div>
    </div>
  );
}

export default App;
