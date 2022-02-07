import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

function FormMember({ close , click, refresh}) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("")
    const {id} = useParams();
    const [message, setMessage] = useState(false);
    
    const [visibility, setVisibility] = useState(false);


    const addMember = () => {
        if (name !== "" && role!="") {
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

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleRole = (event) => {
        setRole(event.target.value);
    }
    return (
        <>
            <h3>Form add new member to ship:</h3>
            <input type="text" placeholder="Name" onChange={handleName} value={name}></input>
            <select name="role" onChange={handleRole}>
                <option value="CAPTAIN">Captain</option>
                <option value="BOATSWAIN">Boatswain</option>
            </select>
            {message}
            <button type="submit" onClick={() => addMember()}>Create</button>
        </>
    ) 
}

export default FormMember;