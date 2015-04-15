var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  setToken: function(text) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.SET_TOKEN,
      text: text
    });
  }

};
