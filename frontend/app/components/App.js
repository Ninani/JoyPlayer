import React, { Component } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import authorize from 'oauth2-implicit'
import spotify from 'spotify-web-api-js';

export default class App extends Component {
  handleSend = () => {
    const screenshot = this.webcam.getScreenshot();
    axios.post('http://localhost:8081/data.json', {
      image: screenshot,
    }, {
      port: 8081
    })
    .then(response =>
      console.log(response)
    )
    .catch(error =>
      console.log(error)
    );
  }

  componentDidMount = () => {
    this.spotifyClient = new spotify();

    if(window.location.href.includes('access_token')) {
      this.handleAuthorize()
    }
  }

  handleAuthorize = () => {
    const credentials = authorize({
      auth_uri: 'https://accounts.spotify.com/authorize',
      client_id: '1bd9ce6008794d0d81b61dc5c100ef86',
      redirect_uri: 'http://localhost:8080',
      scope: ['user-read-private', 'user-read-email', 'user-modify-playback-state'],
    })
    if(credentials) {
      this.spotifyClient.setAccessToken(credentials.accessToken)
      this.spotifyClient.getMe().then(function(data) {
        console.log('Me: ', data);
      }, function(err) {
        console.error(err);
      });
      this.spotifyClient.playTracks({ uris: ['spotify:track:2dJVX40gxhBSPfoPP8nmRo'] }).then(function(data) {
        console.log(data);
      }, function(err) {
        console.error(err);
      });

    }
  }

  render() {
    return (
      <div>
        <Webcam ref={(c) => { this.webcam = c; }} audio={false} />
        <button onClick={this.handleSend}>Send</button>
        <button onClick={this.handleAuthorize}>Play something nice</button>
      </div>
    );
  }
}

