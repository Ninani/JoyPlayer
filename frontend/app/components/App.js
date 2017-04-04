import React, { Component } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

export default class App extends Component {
  handleSend = () => {
    const screenshot = this.webcam.getScreenshot();
    axios.post('/data.json', {
      image: screenshot,
    })
    .then(response =>
      console.log(response)
    )
    .catch(error =>
      console.log(error)
    );
  }

  render() {
    return (
      <div>
        <Webcam ref={(c) => { this.webcam = c; }} audio={false} />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}

