import React,{useEffect, useRef,useState} from 'react'
import {useParams,useNavigate} from "react-router-dom"
import moment from 'moment';
import Axios from 'axios'
import '../App.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import useToken from '../useToken';

export default function Client() {
let navigate = useNavigate ();

let {clientId} = useParams();
let {date} = useParams();
let {p} = useParams();


//let {extension} = useParams();
const [client,setClient] = useState({})
const [DernPassClient,setDernPassClient] = useState()
const [DernRappClient,setDernRappClient] = useState()
const [PSGClient,setPSGClient] = useState([])
const [ConsomClient,setConsomClient] = useState([])
const [ConsomClientTotal,setConsomClientTotal] = useState()
const [NBR_Passage,setNBR_Passage] = useState("")
const [NBR_Page,setNBR_Page] = useState(1)
const [page,setPage] = useState(2)
const [Precpage,setPrecpage] = useState(2)
const [NumeroPassg,setNumeroPassg] = useState(1)
const [Tentative_du_Rappel,setTentative_du_Rappel] = useState("")

//const [Extension,setExtension] = useState("");

useEffect(()=>{
Axios.get(`http://178.32.70.7:3001/api/getFromId/${clientId}`).then((data)=>{
     setClient({
	       
		 Extension : data.data[0].Extension,
		 Numero : data.data[0].Numero,
		 Cellulaire : data.data[0].Cellulaire,
		 Nom_Prenom : data.data[0].Nom_Prenom,	
		 Adresse : data.data[0].Adresse,
		 Situation_familiale : data.data[0].Situation_familiale,
		 Situation_sociale : data.data[0].Situation_sociale,
		 Date_RDV : data.data[0].Date_RDV,
		 Commentaire_du_Rappel : data.data[0].Commentaire_du_Rappel,
         id:data.data[0].id
        });
 });
 Axios.get(`http://178.32.70.7:3001/api/Dernier_Passage/${clientId}/${date}`).then((data)=>{
     setDernPassClient(data.data[0].calldate);
 });
  Axios.get(`http://178.32.70.7:3001/api/Dernier_Date_Rappel/${clientId}/${date}`).then((data)=>{
     setDernRappClient(data.data[0].calldate);
 });
  Axios.get(`http://178.32.70.7:3001/api/nbr_passage/${clientId}/${date}`).then((data)=>{
     setNBR_Passage(data.data[0].NBR_Passage);
     setNBR_Page(Math.ceil(data.data[0].NBR_Passage/5));
 });
  Axios.get(`http://178.32.70.7:3001/api/tent_rapp/${clientId}/${date}`).then((data)=>{
      setTentative_du_Rappel(data.data[0].Tentative_du_Rappel);
 });
 Axios.get(`http://178.32.70.7:3001/api/getpassage/${clientId}/${date}/${p}`).then((data)=>{
     setPSGClient(data.data)
 });

 Axios.get(`http://178.32.70.7:3001/api/ConsomClientTotal/${clientId}/${date}`).then((data)=>{
      setConsomClientTotal(data.data[0].ConsomClientTotal);
 });
for (let i = 1; i < 13; i++) {
Axios.get(`http://178.32.70.7:3001/api/getConsomM/${clientId}/${i}`).then((data)=>{
	//console.log(data.data[0].ConsomM);
      setConsomClient(ConsomClient=>[...ConsomClient,data.data[0].ConsomM]);
	  });
}
},[clientId,date]);
const PlusPassg= (id,p) => {
	
	setNBR_Page(NBR_Page-1)
	setPage(page+1);
	setPrecpage(page-1);
	setNumeroPassg(NumeroPassg+5)
	
    Axios.get(`http://178.32.70.7:3001/api/getpassage/${clientId}/${date}/${p}`).then((data)=>{
       setPSGClient(data.data);
	   //setPage(p+1);
    })
	 
}
const MoinsPassg= (id,p) => {
	
	setNBR_Page(NBR_Page+1)
	setPage(Precpage+1);
	setPrecpage(Precpage-1);
	setNumeroPassg(NumeroPassg-5)
	
    Axios.get(`http://178.32.70.7:3001/api/getpassage/${clientId}/${date}/${p}`).then((data)=>{
       setPSGClient(data.data);
	   //setPage(p+1);
    })
	 
}
  const [startDate, setStartDate] = useState(new Date());



//console.log('ConsomClient',setConsomClient);
    return (
	<div className="MainPage page-content p-5">
		
     <div className="container">
	 <div className="row">
        <h1 ><i className="fa fa-user"></i> Détails Client</h1>
        <span className="ss_tit"> </span>
	</div>
	<div className="row relative">
	 <DatePicker
      selected={startDate}
	  onChange={(date)=>setStartDate(date)}
      isClearable
      placeholderText="I have been cleared!"
	  className="form-control"
	  maxDate={new Date()}
    />
	 <button id="search-button2" type="button" className="btn btn-primary" onClick={()=>(setTimeout(navigate(`/client/${client.Numero}/${moment.utc(startDate).format("YYYY-MM-DD")}/1`),500))}>
    <i className="fa fa-search"></i>
	 </button>
	 <button id="search-button3" type="button" className="btn btn-primary" onClick={()=>(setTimeout(navigate(`/client/${client.Numero}/all/1`),500))}>
    <i className="fa fa-close"></i>
  </button>
	</div>
	<div className="row">
        <div className="col-sm col_stats bg-primary"> <i className="fa fa-money" aria-hidden="true"></i>  <h4>{ConsomClientTotal} </h4> <h5> Total Consommation</h5></div>
        <div className="col-sm col_stats bg-success"> <i className="fa fa-phone" aria-hidden="true"></i>   <h4>{NBR_Passage} </h4><h5>Nombre Passages</h5> </div>
        <div className="col-sm col_stats bg-warning"> <i className='fa fa-volume-control-phone' aria-hidden="true"></i> <h4>{Tentative_du_Rappel} </h4> <h5> Nombre Tentative Rappel</h5></div>
	</div>
	<div className="row">
     <div className="Client_detail">
          <table className="table"><thead>
    <tr>
      <th scope="col"># Extension :</th>
      <th scope="col">{client.Extension}</th>
    </tr>
  </thead>
		   <tbody>
           <tr>
            <td  className="tit">Nom Prenom </td><td> {client.Nom_Prenom}</td>  
            </tr>
			
           <tr>			
		    <td  className="tit">Numero : </td><td>{client.Numero}</td> 
            </tr>
          <tr>			
		    <td  className="tit">Cellulaire : </td><td>{client.Cellulaire}</td> 
            </tr>
           <tr>			          
		  <td  className="tit">Adresse </td><td> {client.Adresse}</td> 
            </tr>
           <tr>			          
		  <td  className="tit">Situation_familiale </td><td> {client.Situation_familiale}</td> 
            </tr>
           <tr>			          
		  <td  className="tit">Situation_sociale </td><td> {client.Situation_sociale}</td> 
            </tr>
           <tr>			          
		  <td  className="tit">Date_RDV </td><td> {String(client.Date_RDV).substring(0,10)}</td>  
            </tr>
           <tr>			         
		  <td  className="tit">NBR_Passage </td><td> {NBR_Passage}</td> 
            </tr>
           <tr>			          
		  <td  className="tit">Dernier_Passage </td><td> {String(DernPassClient).substring(0,10)}</td>  
            </tr>	
           <tr>		         
		  <td  className="tit">Dernier_Date_Rappel </td><td> {String(DernRappClient).substring(0,10)}</td>  
            </tr>
           <tr>			         
		  <td  className="tit">Tentative_du_Rappel </td><td> {Tentative_du_Rappel}</td> 
            </tr>
           <tr>			          
		  <td  className="tit">Commentaire_du_Rappel </td><td> </td> 
            </tr>
           <tr>			          
		  <td   colSpan="2"> {client.Commentaire_du_Rappel}</td> 
            </tr>			
            </tbody>			 
            </table>			          

	  </div>
	  <div className="passage_detail">
	 

		   {(Array.isArray(PSGClient) && PSGClient.length) ? PSGClient.map((val,key)=>{
			return(
		<div className="clt_tab" key={key}>
	   <table className="table">
	     <thead>
          <tr>
           <th scope="col"> Date passage N°{key+NumeroPassg}</th>
           <th scope="col">Extension</th>
           <th scope="col">Cont consult</th>
         </tr>
        </thead>
		   <tbody>
           <tr>
            <td >{val.calldate}</td>
			<td> {client.Extension}</td>  
			<td> {val.FromNumber}</td>  
            </tr>
		  </tbody>
		</table>
		</div>
		
		)
	}): <div className="text-warning mt-20 p-3 text-center">Zéro Passage !</div>}
		{NBR_Page >= 2 ? <button className="btn btn-primary mb-2" onClick={()=>(PlusPassg(client.Numero,page))}>Plus </button>:""}
		{page > 2 ? <button className="btn btn-primary mb-2" onClick={()=>(MoinsPassg(client.Numero,Precpage))}>Moins </button>:""}
	  </div>
	  </div>
	  
	 
	 </div>
	 </div>
    )
}