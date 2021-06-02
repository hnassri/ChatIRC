import React, { Component } from "react"
import { Redirect } from "react-router-dom";
import axios from 'axios';

class  Login extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          username: '',
          password: '',
            redirect: null
        };
      }
      
    
      handleInputChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
        
      };
    
      handleSubmit = async e => {
        e.preventDefault();
        this.setState(this.state);
        const { username,  password} = this.state;
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ username,password})
      };
      const user={
        username,
        password
      }
    
      ///const response = await fetch('http://localhost:4242/login', requestOptions);
     // const data =this.setState(await response.json());
   
               
    axios.post(`http://127.0.0.1:4242/login`, user)
    .then(res => {
      console.log(res);
      console.log(res.data);
    })

  
    
  
      };
    
 
      render() 
      {
    
        return (
          <div>
            <br />
            <div className="container">
              <form onSubmit={this.handleSubmit}>
                <div style={{ width: '30%' }} className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="username"
                    onChange={this.handleInputChange}
                  />
                </div>
               
                <br />
                <div style={{ width: '30%' }} className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="password"
                    onChange={this.handleInputChange}
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
    
      
   
}
export default Login