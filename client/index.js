import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import axios from 'axios';

class MainPage extends Component {
  state = {
    userName: '',
    password: '',
    isLoggedIn: false,
    logInError: false,
  }
  componentDidMount() {
    axios.get('/whoami')
      .then(res => {
        this.setState({
          isLoggedIn: true,
        })
        console.log(this.state)
      })
      .catch(e => {
        this.setState({
          isLoggedIn: false,
        })
        console.error(e)
      })
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.isLoggedIn !== this.state.isLoggedIn) 
  // }
  handleChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
      logInError: false,
    })
  }
  handleSubmit = () => {
    axios.post('/login', this.state)
      .then(res => {
        this.setState({
          isLoggedIn: true,
        })
        console.log(this.state);
      })
      .catch(e => {
        this.setState({
          logInError: true,
        })
      })
  }
  logOut = () => {
    axios.get('/logout')
      .then(() => {
        this.setState({
          isLoggedIn: false,
        })
      })
  }
  render () {
    return (
      <div>
        <label>Username:</label>
        <input type="text" name="userName" onChange={this.handleChange} />
        <label>Password:</label>
        <input type="text" name="password" onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Log in!</button>
        {
          this.state.isLoggedIn ? (
            <button onClick={this.logOut}>Log Out</button>
          ) : ''
        }
      </div>
    )
  }
}


ReactDOM.render(
  <MainPage />,
  document.querySelector('#app'),
  () => {
    console.log('Application rendered!');
  },
);
