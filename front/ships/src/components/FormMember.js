import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

function FormMember({ refresh, operation, _name, _role, _idMember }) {
    const [name, setName] = useState(_name);
    const [role, setRole] = useState(_role);
    const { id } = useParams();

    const [message, setMessage] = useState(false);

    const [visibility, setVisibility] = useState(false);


    const addMember = () => {
        console.log(name, role)
        if (operation === "ADD") {
            if (name !== "" && role != "") {
                axios.post(`http://localhost:8080/app/ships/${id}/member`, { name: name, role: role })
                    .then(() => {
                        setName("")
                        setRole("");
                        setMessage("")
                        refresh();
                    })
            } else {
                setMessage("Incorect data")
            }
        }
        if (operation === "UPDATE") {
            if (name !== "" && role != "") {
                axios.put(`http://localhost:8080/app/ships/${id}/members/${_idMember}`, { name: name, role: role })
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

    const handleRole = (event) => {
        setRole(event.target.value);
    }
    if ( operation  === "ADD") {
        return (
            <>
                <h3>Form {operation} member to ship:</h3>
                <input type="text" placeholder="Name" onChange={handleName} ></input> <br />
                <select name="role" onChange={handleRole}>

                    <option value="CAPTAIN">Captain</option>
                    <option value="BOATSWAIN">Boatswain</option>
                </select>
                {message}
                <button type="submit" onClick={() => addMember()}>{operation}</button>
            </>
        )
    }
    else {
        return (
            <>
                <h3>Form {operation} member to ship:</h3>
                <h4>Old value: {_name}</h4> 
                <input type="text" placeholder="Name" onChange={handleName} ></input> <br />
                <h4>Old value: {_role}</h4>
                <select name="role" onChange={handleRole}>

                    <option value="CAPTAIN">Captain</option>
                    <option value="BOATSWAIN">Boatswain</option>
                </select>
                {message}
                <button type="submit" onClick={() => addMember()}>{operation}</button>
            </>
        )
    }
}

export default FormMember;