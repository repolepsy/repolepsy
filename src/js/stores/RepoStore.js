const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const Octokat = require('octokat');

// data storage
let _repos = [];
let _orgs = [];
let _err = null;
let _token = window.localStorage.getItem("gh_token");
let _lastToken = null;

// auth user
var octo;


//get user's repos

var REPOS_PER_PAGE = 100; //can be safely changed to 100
var ORGS_PER_PAGE = 100; //can be safely changed to 100
var EVENTS_PER_PAGE = 5; //can be safely changed to 100

var that = this;

function compare(a, b) {
  if (a.updatedAt > b.updatedAt)
    return -1;
  if (a.updatedAt < b.updatedAt)
    return 1;
  return 0;
}

function getAllRepos(res) {
  if(window.localStorage.getItem("gh_token") !== _token) {
    window.localStorage.setItem("gh_token", _token);
  }

  _err = null;

  res.forEach(function(repo) {
    repo._events = [];
    repo.events.fetch({
      per_page: EVENTS_PER_PAGE
    }).then(function(events) {
      repo._events = events;
      RepoStore.emitChange();
    });
  });

  _repos = _repos.concat(res);

  if (res.nextPage) {
    res.nextPage().then(getAllRepos);
  } else {
    _repos.sort(compare);
    RepoStore.emitChange();
  }
}

function getAllOrgs(res) {
  res.forEach(function(org) {
    org.repos.fetch({
      per_page: REPOS_PER_PAGE
    }).then(getAllRepos);
  });
  _orgs = _orgs.concat(res);

  if (res.nextPage) {
    res.nextPage().then(getAllOrgs);
  } else {


    _repos.sort(compare);
    RepoStore.emitChange();
  }
}


function loadData() {
  console.log("check", _lastToken, _token);


  octo = new Octokat({
    token: _token
  });
  _lastToken = _token;

  octo.user.repos.fetch({
    per_page: REPOS_PER_PAGE
  })
    .then(getAllRepos).catch(function(err){
      _err = err;
      RepoStore.emitChange();
    });

  /*
   var userOrgs = octo.user.orgs.fetch({
   per_page: ORGS_PER_PAGE
   });
   userOrgs.then(getAllOrgs);
   */



}
loadData();

// Facebook style store creation.
let RepoStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    if(_lastToken !== _token) {
      console.info("reloading data");
      loadData();
    }

    return {
      token: _token,
      repos: _repos,
      err: _err
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch (action.type) {
      case Constants.ActionTypes.SET_TOKEN:
        let text = action.text.trim();
        if (text !== '') {
          _token = text;
          console.log("_t", _token);
          RepoStore.emitChange();
        }
        break;
    }
  })

});

module.exports = RepoStore;
