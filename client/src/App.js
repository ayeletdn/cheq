import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {url: ""};
  }

  // componentDidMount() {
  //   fetch("/echo" + document.location.search)
  //   .then(response => {
  //     response.json()
  //     .then(j => {
  //       console.log(j);
  //       this.setState({url: j.u});
  //     })
  //     .catch(reason => {
  //       console.log("Could not read response JSON: " + reason);
  //     });
  //   })
  //   .catch(reason => {
  //     console.log("error calling echo: " + reason);
  //   });
  // }

  render () {
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.<br>
          </br>
          {this.state.url}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    )
  }
}

export default App;
