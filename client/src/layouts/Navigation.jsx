import React,{useState,useEffect} from 'react'
import Axios from 'axios'
import { NavLink } from "react-router-dom";

function Navigation() {
	
	const logoutOnClick = () => {
      
        localStorage.clear()
    }
	let agent = localStorage.getItem("user");
	console.log("agent",agent)
 const [agent_name,setAgentName] = useState("")

//const [Extension,setExtension] = useState("");

useEffect(()=>{
Axios.get(`http://178.32.70.7:3001/api/getAgent/${agent}`).then((data)=>{
	
	if(agent==='admin') 
		 setAgentName("Admin");
	 else    
          setAgentName(data.data[0].username)
  })
})
  return (
     
<div>  

  <div className="navbar navbar-light bg-light">
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
  </div>
<div className="navigation vertical-nav bg-white" id="sidebar">
 <div className="navbar navbar-light bg-light">
    <button className="navbar-toggler navbar-toggler-right py-2" type="button" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
      <span>X</span>
    </button>
  </div>
  <div className="py-4 px-3 mb-4 bg-light">
    <div className="media d-flex align-items-center">
      <div className="media-body">
        <h4 className="m-0">Dashboard</h4>
        <p className="font-weight-light text-muted mb-0">Gestion Client / { agent_name.toUpperCase()}</p>
      </div>
    </div>
  </div>

  <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Menu</p>

  <ul className="nav flex-column bg-white mb-0">
  <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-calendar mr-4 text-primary fa-fw"></i>
                  RDV Clients
                  <span className="sr-only">(current)</span>
                </NavLink>
    </li>   
	
  <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/historique"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-history mr-4 text-primary fa-fw"></i>
                  Historique
                  <span className="sr-only">(current)</span>
                </NavLink>
    </li>  
   <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/clients"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-th-large mr-4 text-primary fa-fw"></i>
                  Liste Clients
                  <span className="sr-only">(current)</span>
                </NavLink>
    </li>
	 
   <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/sourdine"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-pause text-primary fa-fw"></i>
                <i className="fa fa-user mr-2 text-primary fa-fw"></i>
                  Clients en Soudrine
                  <span className="sr-only">(current)</span>
                </NavLink>
    </li>
	
   
    {(agent_name==="Admin") ?
	     <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/createagent"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-address-card mr-4 text-primary fa-fw"></i>
                  Nouveau Agent
                </NavLink> 
		  </li>
         
		: 
		 <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/createclient"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-address-card mr-4 text-primary fa-fw"></i>
                  Nouveau Client
                </NavLink>
		 </li>
      }
	   {(agent_name==="Admin") ? <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/agents"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-th-large mr-4 text-primary fa-fw"></i>
                  Liste Agents
                  <span className="sr-only">(current)</span>
                </NavLink>
            </li>
	   :''}
    
 
  </ul>

  <p className="text-gray font-weight-bold text-uppercase px-3 small py-4 mb-0">Compte</p>

  <ul className="nav flex-column bg-white mb-0">
    <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic" to="/compte"  data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar">
                <i className="fa fa-pie-chart mr-4 text-primary fa-fw"></i>
                Mon compte
                </NavLink>
    </li>
    <li className="nav-item">
			<NavLink className="nav-link text-dark font-italic"  to="/" onClick={(() =>{logoutOnClick();Window.location.reload();})}>
                <i className="fa fa-sign-out-alt mr-4 text-primary fa-fw"></i>
                  logout
                </NavLink>
    </li>
  </ul>
</div>

</div>
  );
}

export default Navigation;