'use strict';

// import all required modules
import logger from '../utils/logger.js';
import playlistStore from '../models/playlist-store.js';
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

// create dashboard object
const dashboard = {
  
  // index method - responsible for creating and rendering the view
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
    const viewData = {
      title: 'Playlist Dashboard',
      playlists: playlistStore.getUserPlaylists(loggedInUser.id),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    logger.info('about to render' + viewData.playlists);
    response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },
  
  deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect('/dashboard');
  },
  
  addPlaylist(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newPlayList = {
      id: uuidv4(),
      userid: loggedInUser.id,
      title: request.body.title,
      duration: request.body.duration,
      songs: [],
    };
    logger.debug('Creating a new Playlist' + newPlayList);
    playlistStore.addPlaylist(newPlayList);
    response.redirect('/dashboard');
  },
  
};

// export the dashboard module
export default dashboard;