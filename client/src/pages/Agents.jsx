import React,{useState,useEffect} from 'react'
import Axios from 'axios'
import {useNavigate } from 'react-router-dom'
import { Typeahead } from 'react-bootstrap-typeahead'; 
//var Typeahead = require('react-bootstrap-typeahead').Typeahead;
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../App.css'

function Agents() {
//let {agentId} = useParams();

const [AgentList,setAgentList]=useState([]);

const pageId=1;
let navigate = useNavigate ();



useEffect(()=>{
Axios.get('http://178.32.70.7:3001/api/getagent').then((data)=>{
setAgentList(data.data);
});
});

const deleteAgentt = (id) => {
    Axios.delete(`http://178.32.70.7:3001/api/deleteagent/${id}`).then((response)=>{
        
    })
}

	 


return (
    <div className="MainPage page-content p-5">
     <div className="container">
     <div className="ClientContainer">
			<h1><i className="fa fa-user"></i> Liste Agents</h1>
        <span className="ss_tit"> </span>

       { (Array.isArray(AgentList) && AgentList.length) ? AgentList.map((val,key)=>{
         return (
          <div className="Client" key={val.id}>
           <h2 className="client-title text-dark font-italic" >Username: {val.username}</h2>
            <p className=" text-dark font-italic">
			Password: {val.password}
			</p>
           
            
			<i className="fa fa-trash" aria-hidden="true" onClick={(() => { if (window.confirm('Are you sure you wish to delete this agent?')) {deleteAgentt(val.id);window.location.reload()}})}></i>
			 
				
			
			
			 </div>
           )  })  : <div className="Client">Aucun résultat trouvé!</div> }  
          </div>
        </div>
        </div>
    )}

export default Agents;