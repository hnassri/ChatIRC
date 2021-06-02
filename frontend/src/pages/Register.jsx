
import axios from 'axios'
import React, { Component } from "react"


class Register extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          username: '',
          password: '',
          confirmpassword: '',
          greeting:'',
 
        };
      }
      
    
      handleInputChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
        
      };
    
      handleSubmit = async e => {
        e.preventDefault();
        const {username,password,confirmpassword ,greeting} = this.state;
    
      const user={
          username,
          password,
          confirmpassword
      }
    
      //const response = await fetch('http://localhost:4242/register', requestOptions);
      //const data =this.setState(await response.json());
   

    axios.post(`http://127.0.0.1:4242/register`, user)
    .then(res => {
      console.log(res);
      console.log(res.data);
    })

  
    
    console.log(this.state.greeting);
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
                <div style={{ width: '30%' }} className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="confirmpassword"
                    placeholder="confirmpassword"
                    onChange={this.handleInputChange}
                  />
                </div>
                <br />
                <div style={{ width: '30%' }}>
                  <button className="btn btn-success" type="submit">
                    REGISTER
                  </button>
                </div>
              </form>

            </div>
          </div>
        );
      }
    
      
   
}
export default Register