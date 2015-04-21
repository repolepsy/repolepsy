var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  setToken: function(text) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.SET_TOKEN,
      text: text
    });
  },

  refreshRepos: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REFRESH_REPOS
    });
  },

  ignoreRepo: function(repo) {
    console.log("ignoreRepo", repo);
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.IGNORE_REPO,
      repo: repo
    });
  },

  ignoreOrg: function(repo) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.IGNORE_ORG,
      repo: repo
    });
  }

};
