//import React,{useState, useEffect} from 'react';
import React,{useEffect,useState} from 'react';
import {useParams,useNavigate} from "react-router-dom"
import Axios from 'axios';
import '../App.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

import moment from 'moment';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

function CreateAgent() {
let navigate=useNavigate();
let agentId=useParams();
const [Username ,setUsername] = useState("");
const [Password ,setPassword] = useState("");	

const [agent ,setAgent] = useState({});
//const [agent ,setagent] = useState(1);
//const agent=1;
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const submitAgent = () => {
async function makeGetRequest() {
	
	
 let payload=
{
	Username:Username,
	Password:Password,
}

    let res = await Axios.post('http://178.32.70.7:3001/api/createAgent', payload);

  
    console.log("agent cree",agent);
	
}

makeGetRequest();
	//}).then(response => element.innerHTML = response.data.id);
}

var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};
    return (
        <div className="CreateClient page-content p-5">
            <div className="uploadClient">
			<h1><i className="fa fa-user"></i> Create New Agent</h1>
        <span className="ss_tit"> </span>
			<div className="response"></div>
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Username"  type="text" onChange={(e)=> {
                    setUsername(e.target.value)
                }}/>
				</div>
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Password" type="text" onChange={(e)=>{
                    setPassword (e.target.value)}}/>
				</div>
				</div>
		
				
			  
				<button className="btn btn-primary mb-2" onClick={(() =>{submitAgent();setTimeout(window.open(`/agents/`,'_self'),500)})}>Submit Agent</button>
         </div>
        </div>
    )}

export default CreateAgent