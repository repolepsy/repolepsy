const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const Octokat = require('octokat');

// data storage
let _repos = [];

// auth user

var octo = new Octokat({
  token: "0f7669b10b651e486ed6a848e6741b9e8c1a37c7"
});


//get user's repos

var REPOS_PER_PAGE = 100; //can be safely changed to 100

var that = this;

function compare(a, b) {
  if (a.updatedAt > b.updatedAt)
    return -1;
  if (a.updatedAt < b.updatedAt)
    return 1;
  return 0;
}

function getAllRepos(res) {
  console.warn("page", _repos.length);
  res.forEach(function(repo) {
    console.log("..", repo);
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

var fetch = octo.user.repos.fetch({
  per_page: REPOS_PER_PAGE
})
fetch.then(getAllRepos);

// Facebook style store creation.
let RepoStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return _repos;
  }

});

module.exports = RepoStore;