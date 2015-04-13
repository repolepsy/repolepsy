var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  addItem: function(text) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.ADD_TASK,
      text: text
    });
  },

  clearList: function() {
    console.warn('clearList action not yet implemented...');
  },

  completeTask: function(task) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.COMPLETE_TASK,
      task: task
    });
  },

  incompleteTask: function(task) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.INCOMPLETE_TASK,
      task: task
    });
  }

};
