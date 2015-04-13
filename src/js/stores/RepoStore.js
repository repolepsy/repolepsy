const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const Octokat = require('octokat');

// data storage
let _repos = [];
let _orgs = [];

// auth user

var octo = new Octokat({
  token: "0f7669b10b651e486ed6a848e6741b9e8c1a37c7"
});


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
  // console.warn("page", _repos.length);
  res.forEach(function(repo) {
    // console.log("..", repo);
    repo._events = [];
    repo.events.fetch({
      per_page: EVENTS_PER_PAGE
    }).then(function(events) {
      repo._events = events;
      console.info(events);
      RepoStore.emitChange();
    });


  });
  _repos = _repos.concat(res);

  if (res.nextPage) {
    res.nextPage().then(getAllRepos);
  } else {
    var dataJSON = JSON.stringify(_repos);
    console.warn("finished", dataJSON);
    console.log("size", dataJSON.length / 1024, "KB");

    _repos.sort(compare);
    RepoStore.emitChange();
  }
}

function getAllOrgs(res) {
  console.warn("page", _orgs.length);
  res.forEach(function(org) {
    console.log("..", org);
    org.repos.fetch({
      per_page: REPOS_PER_PAGE
    }).then(getAllRepos);
  });
  _orgs = _orgs.concat(res);

  if (res.nextPage) {
    res.nextPage().then(getAllOrgs);
  } else {
    var dataJSON = JSON.stringify(_orgs);
    console.warn("finished", dataJSON);
    console.log("size", dataJSON.length / 1024, "KB");

    _repos.sort(compare);
    RepoStore.emitChange();
  }
}

var userRepos = octo.user.repos.fetch({
  per_page: REPOS_PER_PAGE
})
userRepos.then(getAllRepos);

/*
var userOrgs = octo.user.orgs.fetch({
  per_page: ORGS_PER_PAGE
});
userOrgs.then(getAllOrgs);
*/

// Facebook style store creation.
let RepoStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return _repos;
  }

});

module.exports = RepoStore;