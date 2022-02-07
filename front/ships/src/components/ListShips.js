import React, { useEffect, useState } from "react"
import axios from "axios"
import FormShip from "./FormShip"
import { useParams, useNavigate } from "react-router-dom"

function ListShips() {
    const [ship, setShip] = useState([]);
    const [click, setClick] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [id, setId] = useState(0)
    const [name, setName]= useState("");
    const [deplacement, setDeplacement]= useState("")
    const [operation, setOperation] = useState("")
    const navigate = useNavigate();

    const getShips = () => {
        axios.get("http://localhost:8080/app/ships")
            .then((response) => {
                setShip(response.data)
            })
            .catch((response) => {
                console.log(response);
            })

    }

    const deleteReq = (id) => {
        axios.delete(`http://localhost:8080/app/ships/${id}`)
            .then((response) => {
                console.log(response)
                handleRefresh();
            })
            .catch((response) => {
                console.log(response);
            })
    }

    const handleClick = () => {
        setClick(click ? false : true);
    };

    const handleRefresh = () => {
        setRefresh(refresh ? false : true);
    };
    
    useEffect(() => {
        getShips();
    }, [])

    //modificari ships - refresh rerender 
    useEffect(() => {
        getShips();
    }, [refresh])

    const redirect = (id) => {
        navigate(`/ship/${id}`)
    }

    const deleteShip = (id) => {
       deleteReq(id)

    }
    const updateShip = (id, name, deplacement) => {
        console.log("update"+ id + name + deplacement)
        setName(name)
        setDeplacement(deplacement);
        setOperation("UDPATE")
    }

    const addShip = () => {
        setName("")
        setDeplacement("");
        setOperation("ADD")
        setClick(true);
    }

    return (
        <div className="page">
            <h1>Homepage - lista de ambarcatiuni</h1>
            <h4>Examen Tehnologii Web - Mieita Iulia Antonia - 7.02.2022 </h4>
            <div className="table">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Displacement</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {ship.map((item, key) => (
                    <tr key={key}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.displacement}</td>
                        <td>
                            <button onClick={() =>redirect(item.id)}>details</button>
                            <button onClick={() => deleteShip(item.id)}>delete</button>
                            <button onClick={() =>updateShip(item.id, item.name, item.displacement)}>update</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="controls">
                <button id="Add" onClick={() =>addShip()}>Add ship</button>
            </div>
            <div className="form-ship">
                {click ? <FormShip  close={handleClick} click={click} refresh={handleRefresh} _name={name} _depla={deplacement} operation={operation}/> : null}
            </div>
        </div>
    );
}

export default ListShips;