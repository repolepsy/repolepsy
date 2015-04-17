const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const Octokat = require('octokat');
const moment = require('moment');

// data storage
let _storedRepos = window.localStorage.getItem("repos");
let _repos = _storedRepos ? JSON.parse(_storedRepos) : [];
let _orgs = [];
let _err = null;
let _token = window.localStorage.getItem("gh_token");
let _lastToken = null;

// auth user
var octo;


//get user's repos
var REPOS_PER_PAGE = 100; //can be safely changed to 100
var ORGS_PER_PAGE = 100; //can be safely changed to 100
var EVENTS_PER_PAGE = 20;
var MAX_EVENTS = 5; //max events to display

function compare(a, b) {
  var adate = a._events.length ? a._events[0].createdAt : a.updatedAt;
  var bdate = b._events.length ? b._events[0].createdAt : b.updatedAt;

  if(adate > bdate) {
    return -1;
  }
  else if (adate < bdate) {
    return 1;
  }
  return 0;
}

function getAllRepos(res) {
  var now = moment();

  if(window.localStorage.getItem("gh_token") !== _token) {
    window.localStorage.setItem("gh_token", _token);
  }

  _err = null;

  res.forEach(function(repo) {
    repo.updatedAt = repo.updatedAt.toISOString();
    var _updatedAt = moment(repo.updatedAt);

    var found;
    for(var i=0; i<_repos.length; i++) {
      if(_repos[i].id === repo.id) {
        found = _repos[i];
        break;
      }
    }

    var days = now.diff(_updatedAt, 'days');
    if(days > 7) {
      repo._tooOld = true;
      return;
    }

    if(!repo._events) {
      repo._events = [];
    }

    if(found) {
      if(repo.updatedAt == found.updatedAt && found._events && found._events.length > 0 /*&& found._events[0].createdAt === repo.updatedAt*/) {
        return;
      }
      else {
        _repos[i] = repo;
      }
    }
    else {
      _repos.push(repo);
    }

    repo.events.fetch({
      per_page: EVENTS_PER_PAGE
    }).then(function(events) {

      repo._events.length = 0;
      events.forEach(function (evnt) {
        if(repo._events.length == MAX_EVENTS) {
          return;
        }
        if(evnt.type !== "ForkEvent" && evnt.type !== "WatchEvent") {
          repo._events.push(evnt);
        }
      });

      completeAllData();
    });
  });

  if (res.nextPage) {
    res.nextPage().then(getAllRepos);
  } else {
    completeAllRepos();
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
    completeAllRepos();
  }
}

function completeAllRepos() {
  _repos.sort(compare);
  completeAllData();
}

var lastSize = 0;
function completeAllData() {
  var str = JSON.stringify(_repos)
  window.localStorage.setItem("repos", str);
  RepoStore.emitChange();

  var size = parseInt(str.length / 1024, 10);
  if(size != lastSize) {
    console.warn("total data size", size, "KB");
    lastSize = size;
  }
}

function loadData() {
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

  octo.user.orgs.fetch({
    per_page: ORGS_PER_PAGE
  })
    .then(getAllOrgs);
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
          RepoStore.emitChange();
        }
        break;
    }
  })

});

module.exports = RepoStore;
