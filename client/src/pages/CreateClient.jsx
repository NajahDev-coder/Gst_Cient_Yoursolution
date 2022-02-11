//import React,{useState, useEffect} from 'react';
import React,{useEffect,useState} from 'react';
import {useParams,useNavigate} from "react-router-dom"
import Axios from 'axios';
import '../App.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import validator from 'validator';
import CheckButton from "react-validation/build/button";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

import moment from 'moment';

const required = value => {
  if (!value.toString().trim().length){
    return 'require';
  }
};

function CreateClient() {
let navigate=useNavigate();
let clientId=useParams();
const [Extension ,setExtension] = useState("");
const [Numero ,setNumero] = useState("");	
const [Cellulaire ,setCellulaire] = useState("");	
const [Nom_Prenom ,setNom_Prenom] = useState("");	
const [Adresse ,setAdresse] = useState("");	
const [Situation_familiale ,setSituation_familiale] = useState("");	
const [Situation_sociale ,setSituation_sociale] = useState("");
const [Date_RDV ,setDate_RDV] = useState("");	
const [Commentaire_du_Rappel ,setCommentaire_du_Rappel] = useState("");

 
const [startDate, setStartDate] = useState(new Date());
const [client ,setClient] = useState({});
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
const submitClient = () => {
	//alert('Date obligatoire');
	if(Date_RDV==='') alert('Date obligatoire');
	else 
	{	
	   makeGetRequest();
	   setTimeout(window.location.href=`/client/${Numero}/all/1`,500)
	}
async function makeGetRequest() {
	
	 let agent = localStorage.getItem("user");
 let payload=
{
	Extension:Extension,
	Numero:Numero,
	Cellulaire:Cellulaire,
	Nom_Prenom:Nom_Prenom,
	Adresse:Adresse,
	Situation_familiale:Situation_familiale,
	Situation_sociale:Situation_sociale,
	Date_RDV:Date_RDV,
	Commentaire_du_Rappel:Commentaire_du_Rappel,
	agent:agent
}

    let res = await Axios.post('http://178.32.70.7:3001/api/create', payload);

  
    console.log("agent cree",agent);
	
}


	//}).then(response => element.innerHTML = response.data.id);
}

var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};
    return (
        <div className="CreateClient page-content p-5">
            <div className="uploadClient">
			<h1><i className="fa fa-user"></i> Create New Client</h1>
        <span className="ss_tit"> </span>
			<div className="response"></div>
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Extension"  type="text" onChange={(e)=> {
                    setExtension(e.target.value)
                }}/>
				</div>
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Numero" type="text" onChange={(e)=>{
                    setNumero (e.target.value)}}/>
				</div>
				</div>
				
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Cellulaire" type="text" onChange={(e)=>{
                    setCellulaire (e.target.value)}}/>
				</div>
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Nom & Prenom" type="text" onChange={(e)=>{
                    setNom_Prenom (e.target.value)}}/>
                </div>
				
				</div>
				
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Situation familiale" type="text" onChange={(e)=>{
                    setSituation_familiale (e.target.value)}}/>
                </div>
				<div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Situation sociale" type="text" onChange={(e)=>{
                    setSituation_sociale (e.target.value)}}/>
				</div>
				</div>
				
			  <div className="row">
                <div className="col">
               
					 <Datetime 
					 dateFormat="YYYY-MM-DD  H:mm:ss"
					 value={startDate}
	  onChange={((date)=>{setStartDate(date);setDate_RDV(moment(date).format("YYYY-MM-DD  H:mm:ss"))})}
  
	  isValidDate={valid}
	  className=""
    />
                <i className="fa fa-calendar fa-cal_icone  fa-fw"></i>
                </div>
				<div className="col">
                <input className="form-control form-control-sm" validations={[required]}  placeholder="Adresse" type="text" onChange={(e)=>{
                    setAdresse (e.target.value)}}/>
				</div>
				</div>
                <div className="row">
                <textarea className="form-control form-control-sm" validations={[required]}  placeholder="Description client"  onChange={(e)=>{
                    setCommentaire_du_Rappel (e.target.value)}}/>
				
				</div> 
				<button className="btn btn-primary mb-2" onClick={(() =>{submitClient();})}>Submit Client</button>
         </div>
        </div>
    )}

export default CreateClient