//necessary imports
import React from 'react';

//variables for Spotify access
let accessToken = '';
let expiresIn = '';
const client_id = '23506449f1aa491c9950cfbdeb640077';
const redirect_uri = 'http://localhost:3000/';
//create Spotify module
class Spotify extends React.Component{
  //methods
  getAccessToken(){
    if (accessToken) {
      return accessToken;
    }
    //gets information needed when token doesn't already exist
    else {
      const url = window.location.href;
      const newToken = url.match(/access_token=([^&]*)/);
      const newExpire = url.match(/expires_in=([^&]*)/);

      if(newToken && newExpire){
        accessToken = newToken[1];
        expiresIn = newExpire[1];
        //clear token and expiration
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      }
      //token empty and not in URL
      else {
        const urlstring = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
        window.location=urlstring;
      }
    }
    return accessToken;
  }

  search(searchTerm) {
    this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
        throw new Error('Request failed!');
    },
      networkError => {
        console.log(networkError.message);
      }).then(jsonResponse => {
        //return empty array if no tracks
        if(!jsonResponse.tracks) {
          return [];
        }
        //map values for tracks
        else {
          return jsonResponse.tracks.itmes.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
    });
  }

  savePlaylist(playlistName, trackURIs) {
    const headers = {Authorization: `Bearer ${accessToken}`};
    let user_id = '';

    //return if there are values saved to playlistName and trackURIs
    if (!playlistName && !trackURIs){
      return;
    } else {
      return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(response => {
        return response.json();
      }).then(jsonResponse =>{
        user_id = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
            method: 'POST',
            body: JSON.stringify({name: playlistName})
          }).then(response => {
            return response.json();
          }).then(jsonResponse => {
            let playlist_id = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
            {
              headers: {Authorization: `Bearer ${accessToken}`, "Content-Type": 'applicaiton/json'},
              method: 'POST',
              body: JSON.stringify({uris: trackURIs})
            });
          });
      });
    }
  }
}

export default Spotify;
