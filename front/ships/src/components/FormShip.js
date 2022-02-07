import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

function FormShip({ close, click, refresh, _name, _depla, operation }) {
    const navigate = useNavigate();
    const [name, setName] = useState(_name);
    const { id } = useParams();
    const [displacement, setDisplacement] = useState(_depla)
    const [message, setMessage] = useState(false);

    const [visibility, setVisibility] = useState(false);


    const action = () => {
        if (operation === "ADD") {
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
        if (operation === "UPDATE") {
            if (name !== "" && displacement !== "") {
                axios.put(`http://localhost:8080/app/ships/${id}`, { name: name, displacement: displacement })
                    .then((response) => {
                        console.log(response.data);
                        setMessage("")
                        refresh();
                    })
            }
        }
    }

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleDisplacement = (event) => {
        setDisplacement(event.target.value);
    }
    if (operation === "ADD") {
        return (
            <>
                <h3>Form {operation} ship:</h3>
                <input type="text" placeholder="Name" onChange={handleName} value={name}></input>
                <input type="number" placeholder="Displacement" onChange={handleDisplacement} value={displacement}></input>
                {message}
                <button type="submit" onClick={() => action()}>{operation}</button>
            </>
        )
    }
    else {
        return (
            <>
                <h3>Form {operation} ship:</h3>
                <h4>Old value: {_name}</h4>
                <input type="text" placeholder="Name" onChange={handleName} value={name}></input>
                <h4>Old value: {_depla}</h4>
                <input type="number" placeholder="Displacement" onChange={handleDisplacement} value={displacement}></input>
                {message}
                <button type="submit" onClick={() => action()}>{operation}</button>
            </>
        )
    }
}

export default FormShip;