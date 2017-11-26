import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { post } from 'axios';
import { Line } from 'rc-progress';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

class FileUpload extends React.Component {
  constructor() {
    super();
    this.state = { getfilemode:true, progressbarmode:false, displayfilemode:false, percent:0, files:[] };
  }

onDrop(argfiles)
{
  let data = new FormData();
  this.setState({
    percent: 0,
    getfilemode : false,
    progressbarmode: true,
    files:argfiles
    })
  argfiles.forEach(file => {
    data.append('files[]', file, file.name);
  });

   const url = 'http://localhost:3000';

   const config = {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: function(progressEvent) {
      var percent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
      if (percent >= 100) {
        this.setState({
          percent: 100,
          progressbarmode: false,
          displayfilemode: true
        });

      } else {
        this.setState({ percent });
        }
      }.bind(this)
    };

  const that = this;
  post(url, data, config)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
      that.setState({ percent: 0 });
    });
}

showTitle(){
  if(this.state.getfilemode){
    return (
      <p> Drag and Drop </p>
    )
  }
}

displayProgressBar(){
  if(this.state.progressbarmode){
    return (
      <Line percent={this.state.percent} strokeWidth='5' strokeColor='#2db7f5' strokeLinecap='square' />
    )
  }
}

showfiles(){
  if(this.state.displayfilemode){
    return(
      <div>
      <h2>Dropped files</h2>
      <ul>
        { this.state.files.map(f => <li>{f.name} - {f.size} bytes</li>) }
      </ul>
      </div>
    )
  }
}


render(){
  const dropboxStyle = {
  background: 'rgba(211,211,211,1)',
  textAlign: 'center',
  borderRadius:'4px',
  width:'300px',
  height:'500px',
};


return (
  <div className="dropzone">
    <Dropzone style={{position: "relative"}} onDrop={this.onDrop.bind(this)}>
      <div style={dropboxStyle}>
        {this.showTitle()}
        {this.displayProgressBar()}
      </div>
    </Dropzone>
    {this.showfiles()}
  </div>
  )
}
}

ReactDOM.render(<FileUpload />, document.getElementById('root'));
registerServiceWorker();
