//Import required files for the App
import React, { Component } from 'react';
import './App.css';
import SearchBar from './Components/SearchBar/SearchBar.js';
import SearchResults from './Components/SearchResults/SearchResults.js';
import Playlist from './Components/Playlist/Playlist.js';
import Spotify from './util/Spotify.js';

//hard coded values for playlist
const playlistName = 'Test List';
const playlistTracks = [];

class App extends Component {
  //App constructor
  constructor(props){
    super(props);
    this.state={
      searchResults: [{'name': '', 'artist': '', 'album': '', 'id': ''}],

      playlistName: playlistName,
      playlistTracks: playlistTracks
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName= this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  //methods for App
  addTrack(track) {
      let inList = false;
      this.state.playlistTracks.find(listTrack => {
        if (listTrack.id === track.id) {
          inList = true;
          return;
        }
      })
      if (inList === false){
        const newPlaylistTracks = this.state.playlistTracks.push(track);
        this.setState(playlistTracks: newPlaylistTracks);
      }
    }

  removeTrack(track) {
    const newPlaylistTracks = this.playlistTracks.filter(listTrack => {
      listTrack.id !== track.id});
      this.setState(playlistTracks: newPlaylistTracks);
  }

  updatePlaylistName(name) {
      this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = [];
    this.state.playlistTracks.forEach(track => {trackURIs.push(track.uri);
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({playlistTracks: [], playlistName: 'New Playlist'});
    });
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
              <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
            </div>
        </div>
      </div>
    );
  }
}

export default App;
