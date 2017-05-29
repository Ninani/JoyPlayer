import React, { Component } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import authorize from 'oauth2-implicit'
import spotify from 'spotify-web-api-js';
import ReactInterval from 'react-interval';
import Emojify from 'react-emojione';
import Paper from 'material-ui/Paper';
import no_mouth from 'react-svg-emojione/dist/no_mouth';
import angry from 'react-svg-emojione/dist/angry';
import confused from 'react-svg-emojione/dist/confused';
import slight_smile from 'react-svg-emojione/dist/slight_smile';
import frowning2 from 'react-svg-emojione/dist/frowning2';
import astonished from 'react-svg-emojione/dist/astonished';

import Spotify from './Spotify';

const emotions = {
  'neutral': {
    icon: ':no_mouth:',
    component: no_mouth()
  },
  'anger': {
    icon: ':angry:',
    component: angry()
  },
  'disgust': {
    icon: ':confused:',
    component: confused()
  },
  'happy': {
    icon: ':slight_smile:',
    component: slight_smile()
  },
  'sadness': {
    icon: ':frowning2:',
    component: frowning2()
  },
  'surprise': {
    icon: ':astonished:',
    component: astonished()
  },
};


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window: []
    };
  }
  handleSend = () => {
    const screenshot = this.webcam.getScreenshot();
    axios.post('http://localhost:8081/data.json', {
      image: screenshot,
    }, {
      port: 8081
    })
    .then(response => {
      console.log(this.state.window)
        this.setState({
          emotion: response.data,
          window: (new Array(response.data)).concat(this.state.window.slice(0, 10))
        });
      }
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

  emoticon = () => {
    if(!this.state.emotion) {
      return null;
    }
    return [
      <div style={style.emoji} key="emoticon">
        {emotions[this.state.emotion].component}
      </div>,
      <div style={style.emoji} key="desc">{this.state.emotion}</div>
    ];
  }

  render() {
    return (
      <div style={style.container}>
        <div style={style.row}>
          <Paper style={style.paperCamera} zDepth={4}>
            <Webcam
              ref={(c) => { this.webcam = c; }}
              audio={false}
              screenshotFormat="image/jpeg"
              width={style.paperCamera.width}
              height={style.paperCamera.height}
            />
          </Paper>
          <Paper style={style.paperRight} zDepth={4}>
            <div style={style.emojiContainer}>{this.emoticon()}</div>
          </Paper>
          <ReactInterval
            timeout={1000}
            enabled={true}
            callback={() => this.handleSend()}
          />
        </div>
        <div style={style.row}>
          <Spotify window={this.state.window}/>
        </div>
      </div>
    );
  }
}

const style = {
  container: {
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1
  },
  paperCamera: {
    height: 240,
    width: 320,
    margin: 20,
    textAlign: 'center',
  },
  paperRight: {
    height: 240,
    width: 320,
    margin: 20,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    // flexDirection: 'column',
    flexWrap: 'wrap'
  },
  emojiContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  emoji: {
    width: 100
  }
};
