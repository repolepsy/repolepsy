const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');

let _ignoredRepos = window.localStorage.getItem("ignoredRepos") ? JSON.parse(window.localStorage.getItem("ignoredRepos")) : [];

function assureNumber(num) {
  if(typeof num !== 'number') {
    throw new Error("Expected a number");
  }
}

// Facebook style store creation.
let IgnoredReposStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      ignoredRepos: _ignoredRepos
    };
  },

  isIgnoredRepo(repo) {
    assureNumber(repo.id);
    if(_ignoredRepos.indexOf(repo.id) === -1) {
      return false;
    }
    return true;
  },

  addToIgnoredRepos(repo) {
    assureNumber(repo.id);
    if(!IgnoredReposStore.isIgnoredRepo(repo)) {
      _ignoredRepos.push(repo.id);
      IgnoredReposStore.saveToLocalStorage();
    }
  },

  removeFromIgnoredRepos(repo) {
    assureNumber(repo.id);
    if(IgnoredReposStore.isIgnoredRepo(repo)) {
      let index = _ignoredRepos.indexOf(repo.id);
      if(index > -1) {
        _ignoredRepos.splice(index, 1);
      }
      IgnoredReposStore.saveToLocalStorage();
    }
  },

  saveToLocalStorage() {
    window.localStorage.setItem("ignoredRepos", JSON.stringify(_ignoredRepos));
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;
    let repo = action.repo;

    switch (action.type) {
      case Constants.ActionTypes.TOGGLE_IGNORE_REPO:
        if(IgnoredReposStore.isIgnoredRepo(repo)) {
          IgnoredReposStore.removeFromIgnoredRepos(repo);
        }
        else {
          IgnoredReposStore.addToIgnoredRepos(repo);
        }

        IgnoredReposStore.emitChange();
        break;
    }
  })

});

module.exports = IgnoredReposStore;
