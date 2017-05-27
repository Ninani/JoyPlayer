import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import logo from '../assets/spotify.svg';
import Toggle from 'react-toggle';
import axios from 'axios';
import authorize from 'oauth2-implicit'
import spotify from 'spotify-web-api-js';

const credentialsParams = {
  auth_uri: 'https://accounts.spotify.com/authorize',
  client_id: '1bd9ce6008794d0d81b61dc5c100ef86',
  redirect_uri: 'http://localhost:8080',
  scope: ['user-read-private', 'user-read-email', 'user-modify-playback-state', 'playlist-read-private', 'playlist-modify-private'],
};
const playlistName = "JoyPlayer queue";
export default class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleChecked: false, //localStorage.getItem('spotifyEnabled') == 'true',
      userData: null,
      playStarted: false
    };
  }
  componentDidMount = () => {
    this.spotifyClient = new spotify();

    if(window.location.href.includes('access_token')) {
      this.handleAuthorize()
    } 
    // else if(localStorage.getItem('spotifyEnabled')) {
    //   this.ensureCredentials()
    // }
  }

  enableSpotify = () => {
    localStorage.setItem('spotifyEnabled', true);
    this.setState({toggleChecked: true})
    this.handleAuthorize()
  }

  disableSpotify = () => {
    this.setState({toggleChecked: false})
    localStorage.setItem('spotifyEnabled', false);
  }

  ensurePlaylist = (ok) => {
    this.spotifyClient.getUserPlaylists(this.state.userData.id, {limit: 50}).then((data) => {
      const playlist = data.items.find((playlist) => playlist.name == playlistName)
      if(playlist) {
        this.setState({playlist: playlist});
        ok();
      } else {
        this.spotifyClient.createPlaylist(this.state.userData.id, {name: playlistName, public: false}).then(ok);
      }
    },
    () => {
      this.disableSpotify()
    })
  }

  addToPlaylist = (uris, ok, err) => {
    this.spotifyClient.addTracksToPlaylist(this.state.userData.id, this.state.playlist.id, uris).then(ok, err)
  }

  replaceInPlaylist = (uris, ok, err) => {
    this.spotifyClient.replaceTracksInPlaylist(this.state.userData.id, this.state.playlist.id, uris).then(ok, err)
  }

  playPlaylist = (ok, err) => {
    if(this.state.playStarted) { return; }
    this.spotifyClient.play({context_uri: this.state.playlist.uri}).then(() => {
      this.setState({playStarted: true})
      ok();
    }, err);
  }

  // setShuffle

  ensureCredentials = () => {
    this.checkCredentials(()=>{}, this.handleAuthorize)
  }

  checkCredentials = (ok, err) => {
    this.spotifyClient.getMe().then(ok, err);
  }

  onToggle = (e) => {
    if(e.target.checked) {
      this.enableSpotify();
    } else {
      this.disableSpotify();
    }
  }

  handleAuthorize = () => {
    const credentials = authorize(credentialsParams);
    if(credentials) {
      this.setState({toggleChecked: true})
      sessionStorage.setItem('spotifyAccessToken', credentials.accessToken);
      this.spotifyClient.setAccessToken(credentials.accessToken);
      this.spotifyClient.getMe().then((data) => {
        console.log(data)
        this.setState({userData: data})
        this.ensurePlaylist(()=>this.replaceInPlaylist(['spotify:track:2dJVX40gxhBSPfoPP8nmRo'], this.playPlaylist));
      }, (err) => {
        console.error(err);
      });
      // this.spotifyClient.playTracks({ uris: ['spotify:track:2dJVX40gxhBSPfoPP8nmRo'] }).then(function(data) {
      //   console.log(data);
      // }, function(err) {
      //   console.error(err);
      // });
    }
  }

  render() {
    return (
      <Paper style={style.paperSpotify} zDepth={4}>
        <img src={logo} style={style.logo} />
        <div>
          <Toggle onChange={this.onToggle} checked={this.state.toggleChecked} />
          sterowanie odtwarzaniem
        </div>
        {this.state.userData && this.state.toggleChecked ? 
          <div>Jesteś zalogowany jako {this.state.userData.display_name}</div>
        : null}
      </Paper>
    );
  }
}

const style = {
  logo: {
    width: 200
  },
  paperSpotify: {
    height: 240,
    width: 320,
    margin: 20,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    // flexDirection: 'column',
    flexWrap: 'wrap'
  }
};
