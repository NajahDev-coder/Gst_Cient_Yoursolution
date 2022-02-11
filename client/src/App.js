import React,{useState} from 'react';
import ReactDOM from "react-dom";
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import './App.css';
import CreateClient from "./pages/CreateClient";
import CreateAgent from "./pages/CreateAgent";
import Agents from "./pages/Agents";
import EditClient from "./pages/EditClient";
import Login  from "./pages/Login";
import CalendarPage  from "./pages/home";
import HistoriquePage  from "./pages/historique";
import Clients  from "./pages/Clients";
import SourdineClients  from "./pages/SourdineClients";
import Client  from "./pages/Client";
import About  from "./pages/About";
import Navigation from "./layouts/Navigation"
import Footer from "./layouts/Footer";
import useToken from './useToken';

function App(){

   const [token, setToken] = useState();
  let agent = localStorage.getItem("user");
  if(!token && !agent) {
	
    return <Login path="/"  setToken={setToken} />
  }
return(
	
   <Router>
   <Navigation />
   <Routes>
    <Route path="/"  element={<CalendarPage />} /> 
    <Route path="/historique"  element={<HistoriquePage />} /> 
    <Route path="/clients"  element={<Clients />} />
    <Route path="/sourdine"  element={<SourdineClients />} />
	<Route path="/createagent" element={<CreateAgent />} />
	<Route path="/agents" element={<Agents />} />
    <Route path="/createclient" element={<CreateClient />} />
	<Route path="/editclient/:clientId" element={<EditClient />} />
    <Route path="/client/:clientId/:date/:pageId" element={ <Client />}/>
    <Route path="/about"   element={<About />} />
    </Routes>
    </Router>
 )
}
export default App;