import React,{useState,useEffect} from 'react'
import {useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';

import '../App.css'



async function loginUser(credentials) {
 return fetch('http://178.32.70.7:3001/api/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState("");

  const handleSubmit =  async (e) => {
    e.preventDefault();
    const res = await loginUser({
      username,
      password
    });
	console.log(res);
	if(res["token"]=='Veuillez vérifier vos données!')
	{
		setMessage(res["token"]);
	}
	else
	{
    setToken(res);
	localStorage.setItem("user", res["token"]);
		setTimeout(window.location.reload(),500);
	}
  }

return (
    <div className="LoginPage ">
     <div className="container">
     <div className="ClientContainer">
			<h1>Login</h1>
			{ message!=''? <div className="text-danger text-center">{message}</div>:''}
			
			
               <div className="row">
                <input className="form-control form-control-sm" placeholder="Username" type="text" onChange={(e)=> {
                    setUserName(e.target.value)
                }}/>
                <input className="form-control form-control-sm" placeholder="Password" type="text" onChange={(e)=>{
                    setPassword (e.target.value)}}/>
				
				<button className="btn btn-primary mb-2" onClick={handleSubmit}>Login</button>
				</div>
          </div>
        </div>
        </div>
    )}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}