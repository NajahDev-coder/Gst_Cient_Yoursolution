//import React,{useState, useEffect} from 'react';
import React,{useEffect,useState} from 'react';
import moment from 'moment';
import {useParams,useNavigate} from "react-router-dom"
import Axios from 'axios';
import '../App.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
function EditClient() {

  let agent = localStorage.getItem("user");
let {clientId}=useParams();
let navigate=useNavigate();
const [Extension ,setExtension] = useState("");
const [Numero ,setNumero] = useState("");	
const [Cellulaire ,setCellulaire] = useState("");	
const [Nom_Prenom ,setNom_Prenom] = useState("");	
const [Adresse ,setAdresse] = useState("");	
const [Situation_familiale ,setSituation_familiale] = useState("");	
const [Situation_sociale ,setSituation_sociale] = useState("");
const [Date_RDV ,setDate_RDV] = useState("");	
const [Commentaire_du_Rappel ,setCommentaire_du_Rappel] = useState("");
const [client ,setClient] = useState({});
//const [agent ,setagent] = useState(1);


const [startDate, setStartDate] = useState(new Date());

useEffect(()=>{
	
Axios.get(`http://178.32.70.7:3001/api/getFromId/${clientId}`).then((data)=>{
	     console.log("data edit",data);
     setClient({
		 Extension : data.data[0].Extension,
		 Numero : data.data[0].Numero,
		 Cellulaire : data.data[0].Cellulaire,
		 Nom_Prenom : data.data[0].Nom_Prenom,	
		 Adresse : data.data[0].Adresse,
		 Situation_familiale : data.data[0].Situation_familiale,
		 Situation_sociale : data.data[0].Situation_sociale,
		 Date_RDV : moment.utc(data.data[0].Date_RDV).format("YYYY-MM-DD hh:mm:ss"),
		 Commentaire_du_Rappel : data.data[0].Commentaire_du_Rappel,
         id:data.data[0].id
        });
		setExtension( data.data[0].Extension)
		 setNumero(data.data[0].Numero)
		 setCellulaire(data.data[0].Cellulaire)
		 setNom_Prenom(data.data[0].Nom_Prenom)	
		 setAdresse( data.data[0].Adresse)
		 setSituation_familiale ( data.data[0].Situation_familiale)
		 setSituation_sociale(data.data[0].Situation_sociale)
		 setDate_RDV (moment.utc(data.data[0].Date_RDV).format("YYYY-MM-DD hh:mm:ss"))
	
		 setCommentaire_du_Rappel (data.data[0].Commentaire_du_Rappel)
		
  
		 
 });
 
},[clientId])

const submitClient = () => {
async function makeGetRequest() {
	const element = document.querySelector('.response');

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
	Commentaire_du_Rappel:Commentaire_du_Rappel
}
console.log("payload",payload);
    let res = await Axios.post('http://178.32.70.7:3001/api/edit', payload);

    let data = res.status;
    console.log("payload Date_RDV",Date_RDV);
	element.innerHTML = data
	navigate(`/client/${Numero}/all/1`)
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
			<h1><i className="fa fa-user"></i> Edit Client</h1>
        <span className="ss_tit"> </span>
			<div className="response"></div>
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Extension || ''} placeholder="Extension"  type="text" onChange={(e)=> {
                    setExtension(e.target.value)
                }}/>
				</div>
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Numero || ''} placeholder="Numero" type="text" onChange={(e)=>{
                    setNumero (e.target.value)}}/>
				</div>
				</div>
				
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Cellulaire || ''} placeholder="Cellulaire" type="text" onChange={(e)=>{
                    setCellulaire (e.target.value)}}/>
				</div>
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Nom_Prenom || ''} placeholder="Nom & Prenom" type="text" onChange={(e)=>{
                    setNom_Prenom (e.target.value)}}/>
                </div>
				
				</div>
				
			  <div className="row">
                <div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Situation_familiale || ''} placeholder="Situation familiale" type="text" onChange={(e)=>{
                    setSituation_familiale (e.target.value)}}/>
                </div>
				<div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Situation_sociale || ''} placeholder="Situation sociale" type="text" onChange={(e)=>{
                    setSituation_sociale (e.target.value)}}/>
				</div>
				</div>
			  <div className="row">
                <div className="col relative">
				 <input className="form-control form-control-sm" validations={[required]} defaultValue={Date_RDV || ''}  type="text" />
				 
                <i className="fa fa-calendar fa-cal_icone  fa-fw"></i>
					 <Datetime 
					 dateFormat="YYYY-MM-DD H:mm:ss"
					 value={startDate}
	  onChange={((date)=>{setStartDate(date);setDate_RDV(moment(date).format("YYYY-MM-DD H:mm:ss"))})}
  
	  isValidDate={valid}
	  className="cal_icone"
    />
                </div>
				<div className="col">
                <input className="form-control form-control-sm" validations={[required]} defaultValue={client.Adresse || ''} placeholder="Adresse" type="text" onChange={(e)=>{
                    setAdresse (e.target.value)}}/>
				</div>
				</div>
                <div className="row">
                <textarea className="form-control form-control-sm" validations={[required]} defaultValue={client.Commentaire_du_Rappel || ''} placeholder="Description client"  onChange={(e)=>{
                    setCommentaire_du_Rappel (e.target.value)}}/>
				
				</div> 
				<button className="btn btn-primary mb-2" onClick={(() =>{submitClient();setTimeout(window.open(`/client/${Numero}/all/1`,'_self'),500)})}>Submit Client</button>
         </div>
        </div>
    )}

export default EditClient