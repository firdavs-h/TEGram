import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

/*
 * The authorization header is set for axios when you login but what happens when you come back or
 * the page is refreshed. When that happens you need to check for the token in local storage and if it
 * exists you should set the header so that it will be attached to each request
 */
const currentToken = localStorage.getItem('token')
const currentUser = JSON.parse(localStorage.getItem('user'));

if (currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export default new Vuex.Store({
  state: {
    token: currentToken || '',
    user: currentUser || {},
    photos: [],
    // favoritePhotos: [],
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGOUT(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = '';
      state.user = {};
      axios.defaults.headers.common = {};
    },
    SET_PHOTOS(state, data) {
      state.photos = data;
    },
    ADD_PHOTO(state, data) {
      state.photos.unshift(data);
    },
    ADD_COMMENT(state, comment) {
      state.photos.forEach(p => {
        if (p.pictureId == comment.pictureId) {
          p.comments.push(comment);
        }
      }
      );
    },
    REMOVE_COMMENT(state, comment) {
      state.photos.forEach(p => {
        if (p.pictureId == comment.pictureId) {
          p.comments = p.comments.filter(c => c.commentId != comment.commentId);
        }
      });
    },

    REMOVE_PHOTO(state, data) {
      let newPhotos = state.photos.filter(photo => photo.PictureId != data.id);
      this.commit("SET_PHOTOS", newPhotos);
      this.commit("SET_FILTERED_PHOTOS", state.user.id)
    },
    EDIT_FAVORITE(state, photo) {
      state.photos.forEach(p => {
        if (p.pictureId == photo.pictureId) {
          p = photo;
        }
      });
    },
    ADD_RATING(state, rating) {
      state.photos.forEach(p => {
        if (p.pictureId == rating.pictureId) {
          p.ratings.push(rating);
        }
      });
    },
    EDIT_RATING(state, rating) {
      state.photos.forEach(p => {
        if (p.pictureId == rating.pictureId) {
          p.ratings.forEach(rt => {
            if (rt.ratingId == rating.ratingId) {
              rt = rating;
            }
          });
        }
      });
    },
    ADD_LIKE(state, like) {
      state.photos.forEach(p => {
        if (p.pictureId == like.pictureId) {
          p.likes.push(like);
        }
      }
      );
    },
    REMOVE_LIKE(state, pictureId) {
      state.photos.forEach(p => {
        if (p.pictureId == pictureId) {
          p.likes = p.likes.filter(l => l.userId != state.user.id);
        }
      }
      );
    },
    FAVORITE_FILTER(state) {
      state.photos = state.photos.filter(p => p.favorite == true);

    },
    EDIT_PRIVATE(state, photo) {
      state.photos.forEach(p => {
        if (p.pictureId == photo.pictureId) {
          p = photo;
        }
      });
    },

  }
})
