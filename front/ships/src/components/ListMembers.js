import React, {useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import FormMember from "./FormMember"

//pt heroku later !! nu esti pe 8080 pe front, ci pe server
const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
function ListMembers(){
    const [members, setMembers] = useState([]);
    const [ship, setShip] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [click, setClick] = useState(false)
    let {id} = useParams();
    const navigate = useNavigate();

    const getMembers = () => {
        axios.get(`http://localhost:8080/app/ships/${id}/member`)
        .then((response) => {
            setMembers(response.data.Members)
            setShip(response.data.name, response.data.displacement)
        })
        .catch((response) => {
            console.log(response);
        })
    }

    useEffect(() => {
       getMembers();
    }, [refresh])

    const redirect = (id) => {
        navigate(`/`)
    }

    const handleRefresh = () => {
        setRefresh(refresh ? false : true);
    };

    const deleteMember = (id_member) => {
        console.log(id_member, id)
        axios.delete(`http://localhost:8080/app/ships/${id}/members/${id_member}`)
        .then((response) => {
            handleRefresh();
        })
        .catch((response) => {
            console.log(response);
        })
     }


     const updateMember = (id) => {
         setClick(true)
     }


    return(
        <>
        <h1>Details ship</h1>
        <h3>Ship name: {ship}</h3>
        <h4>Echipaj:</h4>
        <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {members.map((item, key) => (
                        <tr key={key}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.role}</td>
                            <td>
                            <button onClick={() => deleteMember(item.id)}>delete</button>
                            <button onClick={() =>updateMember(item.id)}>update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button id="back" onClick={() => redirect()}>back</button>
            <div className="form-member">
                {click ? <FormMember  refresh={handleRefresh}/> : null}
            </div>
        </>
    )
}

export default ListMembers;