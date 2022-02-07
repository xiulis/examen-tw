import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

function FormShip({ close , click, refresh}) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [displacement, setDisplacement] = useState("")
    const [message, setMessage] = useState(false);
    
    const [visibility, setVisibility] = useState(false);


    const addShip = () => {
        if (name !== "" && displacement >= 50) {
            axios.post("http://localhost:8080/app/ships", { name: name, displacement: displacement })
                .then(() => {
                    navigate('/');
                    setName("")
                    setDisplacement("");
                    setMessage("")
                    refresh();
                })
        } else {
            setMessage("Incorect data")
        }
    }

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleDisplacement = (event) => {
        setDisplacement(event.target.value);
    }
    return (
        <>
            <h3>Form add new ship:</h3>
            <input type="text" placeholder="Name" onChange={handleName} value={name}></input>
            <input type="number" placeholder="Displacement" onChange={handleDisplacement} value={displacement}></input>
            {message}
            <button type="submit" onClick={() => addShip()}>Create</button>
        </>
    ) 
}

export default FormShip;