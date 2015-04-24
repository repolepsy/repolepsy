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

  toggleIgnoreRepo: function(repo) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.TOGGLE_IGNORE_REPO,
      repo: repo
    });
  },

  toggleIgnoreOrg: function(org) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.TOGGLE_IGNORE_ORG,
      org: org
    });
  }

};
