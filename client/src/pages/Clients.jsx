import React,{useState,useEffect} from 'react'
import Axios from 'axios'
import {useParams,useNavigate} from "react-router-dom"
import { Typeahead } from 'react-bootstrap-typeahead'; 
//var Typeahead = require('react-bootstrap-typeahead').Typeahead;
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../App.css'

function Clients() {
//let {agentId} = useParams();
let {p} = useParams();
const [clientList,setClientList]=useState([]);
const [options,setOptions]=useState([]);
const [singleClients, setSingleClients] = useState([]);

const pageId=1;
let navigate = useNavigate ();

  let agent = localStorage.getItem("user");
 let appointments;
 
const [NBR_Page,setNBR_Page] = useState(1)
const [page,setPage] = useState(2)
const [Precpage,setPrecpage] = useState(2)

useEffect(()=>{
Axios.get(`http://178.32.70.7:3001/api/get/${agent}/${p}`).then((data)=>{
setClientList(data.data);
});
Axios.get(`http://178.32.70.7:3001/api/get/${agent}/`).then((data)=>{
appointments = data.data; 
let i = 0;      
        for (i; i < appointments.length; i++) {
          appointments[i]=appointments[i].Numero;
		  
		}
        setNBR_Page(Math.ceil(appointments.length/49));
		
		console.log('NBR_Page',appointments.length);
		setOptions(appointments)
});
},[agent,p])
		console.log('NBR_Page',NBR_Page);
const PlusClients= (p) => {
	
	setNBR_Page(NBR_Page-1)
	setPage(page+1);
	setPrecpage(page-1);
	
    Axios.get(`http://178.32.70.7:3001/api/get/${agent}/${p}`).then((data)=>{
       setClientList(data.data);
	   //setPage(p+1);
    })
	 
}
const MoinsClients= (p) => {
	
	setNBR_Page(NBR_Page+1)
	setPage(Precpage+1);
	setPrecpage(Precpage-1);
	
    Axios.get(`http://178.32.70.7:3001/api/get/${agent}/${p}`).then((data)=>{
      setClientList(data.data);
	   //setPage(p+1);
    })
	 
}
const deleteClient = (id) => {
    Axios.delete(`http://178.32.70.7:3001/api/delete/${id}`).then((response)=>{
        
    })
}
const banClient = (id,stat) => {
    Axios.put(`http://178.32.70.7:3001/api/ban/${id}/${stat}`).then((response)=>{
    
    })
	 
}
/*const LikePost = (id) => {
Axios.post(`/api/like/${id}`).then((response)=>{
alert("you liked a post")
})
}*/

return (
    <div className="MainPage page-content p-5">
     <div className="container">
     <div className="ClientContainer">
			<h1><i className="fa fa-user"></i> Liste Clients</h1>
        <span className="ss_tit"> </span>
{ (Array.isArray(clientList) && clientList.length) ?
	<div className="input-group">
  <div className="form-outline">
      <Typeahead
          id="basic-typeahead-single"
          labelKey="name"
          onChange={setSingleClients}
          options={options}
          placeholder="Search..."
          selected={singleClients}
	/>
  </div>
  <button id="search-button" type="button" className="btn btn-primary"onClick={()=>(navigate(`/client/${singleClients}/all/1`))}>
    <i className="fa fa-search"></i>
  </button> 
</div>:'' }
       { (Array.isArray(clientList) && clientList.length) ? clientList.map((val,key)=>{
         return (
          <div className="Client" key={val.id}>
		   <h2 className="client-title text-dark font-italic" onClick={()=>(navigate(`/client/${val.Numero}/all/1`))}>Extension: {val.Extension}</h2>
           {agent==='admin'? 
		   <h3 className="client-title text-dark font-italic" >Agent: {val.username}</h3>
		   :''}
            <p className=" text-dark font-italic">
			Nom Prenom: {val.Nom_Prenom}<br/>
            Numero: {val.Numero}<br/>
			Cellulaire: {val.Cellulaire}
			</p>
           
            <i className="fa fa-edit" aria-hidden="true" onClick={()=>(navigate(`/editclient/${val.Numero}`))}></i>
            
			<i className="fa fa-trash" aria-hidden="true" onClick={(() => { if (window.confirm('Are you sure you wish to delete this client?')) {deleteClient(val.id);window.location.reload()}})}></i>
			 
				{val.statu===1? <i className="fas  fa-calendar-check" aria-hidden="true" onClick={(() => { if (window.confirm('Are you sure you wish to cancel this RDV?')) {banClient(val.id,0);window.location.reload()} })}></i> :
            <i className="fas  fa-calendar-times" aria-hidden="true" onClick={(() => { if (window.confirm('Are you sure you wish to valid this this RDV?')) {banClient(val.id,1);window.location.reload()} })}></i> }
			
			
			
			 </div>
           )  })  : <div className="Client">Aucun résultat trouvé!</div> }  
		 <div className="row">  
		{NBR_Page >= 2 ? <button className="btn btn-primary mb-2" onClick={()=>(PlusClients(page))}>Plus </button>:""}
		{page > 2 ? <button className="btn btn-primary mb-2" onClick={()=>(MoinsClients(Precpage))}>Moins </button>:""} 
           </div>
		  </div>
        </div>
        </div>
    )}

export default Clients;