import React, { Component,useState } from "react"
import { Link,Redirect,useHistory  } from "react-router-dom";
import axios from 'axios';
const Login =props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory()   
    

    
      const handleSubmit = async e => {
        
        e.preventDefault();
  
        /*setState();
        const { username,  password} = setState();
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ username,password})
      };*/
      const user={
        username,
        password
      }
     
      ///const response = await fetch('http://localhost:4242/login', requestOptions);
     // const data =this.setState(await response.json());
   
               
    axios.post(`http://127.0.0.1:4242/login`, user)
    .then(res => {
      console.log(res.data.greeting);
  
      if(res.data.greeting='Vous êtes connectés'){
        localStorage.setItem("auth", JSON.stringify(user));
        history.push({
          pathname: '/chat',
        })
      }
    })
   

  
    
  
      };
    
 
      
    
        return (
          <div>
            <br />
            <div className="container">
              <form onSubmit={handleSubmit}>
                <div style={{ width: '30%' }} className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="username"
                    onChange={event => setUsername(event.target.value)}
                  />
                </div>
               
                <br />
                <div style={{ width: '30%' }} className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="password"
                    onChange={event => setPassword(event.target.value)}
                  />
                </div>
                <br />
                <div style={{ width: '30%' }}>
                  <button className="btn btn-success" type="submit">
                    Connecter
                  </button>
                </div>
              </form>

            </div>
          </div>
        );
      
    
      
   
}
export default Login