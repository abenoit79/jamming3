//import necessary files and components
import React from 'react';
import './Track.css';

//create Track component
class Track extends React.Component{
  //class constructor
  constructor(props){
    super(props);

    this.renderAction = this.renderAction.bind(this);
    this.addTrack = this.addTrack.bind(this);
  }

  //methods for Track class
  renderAction(){
    if (this.props.isRemoval){
      return <a className="Track-action" onClick={this.removeTrack}>'-'</a>;
    }
    else {
      return <a className="Track-action" onClick={this.addTrack}>'+'</a>;
    }
  }

  addTrack(){
    this.props.onAdd(this.props.track);
  }

  removeTrack(){
    this.props.onRemove(this.props.track);
  }

  render(){
    return(
      <div className="Track">
        <div className="Track-information">
          <h3>Song: {this.props.track.name}</h3>
          <p>Artist: {this.props.track.artist}| Album: {this.props.track.album}</p>
        </div>
        <a className="#Track-action">{this.renderAction} </a>
      </div>
    );
  }
}

export default Track;
