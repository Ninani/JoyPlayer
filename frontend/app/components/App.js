import React, { Component } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import authorize from 'oauth2-implicit';
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
import head_bandage from 'react-svg-emojione/dist/head_bandage';

import Spotify from './Spotify';

const emotions = {
  no_head: {
    icon: ':head_bandage:',
    component: head_bandage(),
  },
  neutral: {
    icon: ':no_mouth:',
    component: no_mouth(),
  },
  anger: {
    icon: ':angry:',
    component: angry(),
  },
  disgust: {
    icon: ':confused:',
    component: confused(),
  },
  happy: {
    icon: ':slight_smile:',
    component: slight_smile(),
  },
  sadness: {
    icon: ':frowning2:',
    component: frowning2(),
  },
  surprise: {
    icon: ':astonished:',
    component: astonished(),
  },
};


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window: [],
    };
  }
  handleSend = () => {
    const screenshot = this.webcam.getScreenshot();
    axios.post('http://localhost:8081/data.json', {
      image: screenshot,
    }, {
      port: 8081,
    })
    .then((response) => {
      this.setState({
        emotion: response.data,
        window: (new Array(response.data)).concat(this.state.window.slice(0, 30)),
      });
      this.spotify.tick();
    },
    )
    .catch(error =>
      console.log(error),
    );
  }

  winningEmotion = () => _.maxBy(_.transform(_.countBy(this.state.window), (res, v, k) => { res.push({ emotion: k, score: v }); }, []), 'score')

  emoticon = (emotion) => {
    if (!emotion) {
      return null;
    }
    return [
      <div style={style.emoji} key="emoticon">
        {emotions[emotion].component}
      </div>,
      <div style={style.emoji} key="desc">{emotion}</div>,
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
            <div style={style.paperRightContainer}>
              <div style={style.emojiContainer}>now{this.emoticon(this.state.emotion)}</div>
              {this.winningEmotion() ? <div style={style.emojiContainer}><div>dominating <br />over last 30s</div>{this.emoticon(this.winningEmotion().emotion)}</div> : null }
            </div>
          </Paper>
          <ReactInterval
            timeout={1000}
            enabled
            callback={() => this.handleSend()}
          />
        </div>
        <div style={style.row}>
          <Spotify
            ref={(c) => { this.spotify = c; }}
            window={this.state.window}
            winningEmotion={this.winningEmotion}
          />
        </div>
      </div>
    );
  }
}

const style = {
  container: {
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
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
    flexWrap: 'wrap',
  },
  paperRightContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  emojiContainer: {
    display: 'flex',
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  emoji: {
    width: 100,
  },
};
