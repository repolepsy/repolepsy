const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const Octokat = require('octokat');
const moment = require('moment');
const debounce = require('debounce');



Object.values = obj => Object.keys(obj).map(key => obj[key]);

// private data
let _storedRepos = window.localStorage.getItem("repos3");
let _repos = _storedRepos ? JSON.parse(_storedRepos) : {};

Object.values(_repos).forEach(function(repo) {
  repo._loading = false;
});

let _orgs = [];
let _err = null;
let _token = window.localStorage.getItem("gh_token") || "";
let _login = "warpech";
let _ignoredRepos = window.localStorage.getItem("ignoredRepos") || [];
let _lastToken = null;
let refreshTimeout;
let _now;

// auth user
var octo;

//settings
const REPOS_PER_PAGE = 100; //can be safely changed to 100
const ORGS_PER_PAGE = 100; //can be safely changed to 100
const EVENTS_PER_PAGE = 20;
const USER_EVENTS_PER_PAGE = 300;
const MAX_EVENTS = 5; //max events to display
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; //5 minutes


function assureString(str) {
  if(typeof str !== 'string') {
    throw new Error("Expected a string");
  }
}



//Phase 1 - refresh repos information
function getAllRepos(res) {

  _err = null;

  res.forEach(function(repo) {
    var found = _repos[repo.fullName];
    assureString(repo.name);

    if(repo.name == "Barcodes") {
     // debugger;
    }

    if(!found) {
      found = repo;
      found._events = [];
      _repos[found.fullName] = found;
    }

    repo.updatedAt = repo.updatedAt.toISOString();
    repo.pushedAt = repo.pushedAt.toISOString();

    if(repo.pushedAt > repo.updatedAt) {
      repo.updatedAt = repo.pushedAt;
    }

    if(repo.updatedAt > found.updatedAt) {
      found.updatedAt = repo.updatedAt;
    }

    updateRepoEvents(found);
  });

  if (res.nextPage) {
    res.nextPage().then(getAllRepos);
  } else {
    updateAllRepoEvents();
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
    updateAllRepoEvents();
  }
}

function getAllEvents(res) {
  res.forEach(function(evnt) {
    evnt.createdAt = evnt.createdAt.toISOString();

    var repo = _repos[evnt.repo.name];

    if (!repo) {
      return;
    }

    assureString(repo.name);
    if(repo.updatedAt == undefined) {
      repo.updatedAt = evnt.createdAt; //hack?
    }
    assureString(repo.updatedAt);

    if(evnt.createdAt > repo.updatedAt) {
      repo.updatedAt = evnt.createdAt;
    }

    updateRepoEvents(repo);
  });
}



//Phase 2 - refresh repo events
function updateAllRepoEvents() {
  completeAllData();
}

function updateRepoEvents(repo) {
  assureString(repo.updatedAt);

  if(repo._loading) {
    return;
  }
  if(repo.lastUpdatedAt) {
    assureString(repo.lastUpdatedAt);
    if(repo.lastUpdatedAt >= repo.updatedAt) {
      return; //no need to refresh
    }
  }

  var _updatedAt = moment(repo.updatedAt);
  repo._style = {
    order: 1735689600 - _updatedAt.unix()
  };

  var days = _now.diff(_updatedAt, 'days');
  if(days > 7) {
    repo._tooOld = true;
    return;
  }
  repo._tooOld = false;
  repo._loading = true;

  octo.repos(repo.fullName).events.fetch({
    per_page: EVENTS_PER_PAGE
  }).then(function(events) {
    repo._events.length = 0;

    events.forEach(function (evnt) {
      evnt.createdAt = evnt.createdAt.toISOString();
      if(repo._events.length == MAX_EVENTS) {
        return;
      }
      if(evnt.type !== "ForkEvent" && evnt.type !== "WatchEvent") {
        repo._events.push(evnt);
      }
    });

    repo.lastUpdatedAt = repo.updatedAt;
    repo._loading = false;

    completeAllData();
  });
}

//Phase 3 - sort data and render
var lastSize = 0;
var completeAllData = debounce(refreshUI, 1000);

function refreshUI() {
  console.log("refreshUI");
  var str = JSON.stringify(_repos);
  window.localStorage.setItem("repos3", str);
  RepoStore.emitChange();

  var size = parseInt(str.length / 1024, 10);
  if(size != lastSize) {
    console.warn("total data size", size, "KB");
    lastSize = size;
  }
}

function loadData() {
  console.info("Loading data");
  _now = moment();

  if(_lastToken != _token) {
    octo = new Octokat({
      token: _token
    });
    _lastToken = _token;
  }

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
  
  octo.users(_login).receivedEvents.fetch({
    per_page: USER_EVENTS_PER_PAGE
  })
    .then(getAllEvents);

  octo.users(_login).events.fetch({
    per_page: USER_EVENTS_PER_PAGE
  })
    .then(getAllEvents);

  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(loadData, REFRESH_INTERVAL_MS);
}
loadData();

// Facebook style store creation.
let RepoStore = assign({}, BaseStore, {


  // public methods used by Controller-View to operate on data
  getAll() {
    if(_lastToken !== _token) {
      loadData();
    }

    return {
      token: _token,
      repos: Object.values(_repos),
      orgs: Object.values(_orgs),
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
          if(window.localStorage.getItem("gh_token") !== _token) {
            window.localStorage.setItem("gh_token", _token);
          }
          RepoStore.emitChange();
        }
        break;

      case Constants.ActionTypes.REFRESH_REPOS:
        loadData();
        break;
    }
  })

});

module.exports = RepoStore;
