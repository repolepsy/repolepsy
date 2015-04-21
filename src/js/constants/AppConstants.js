const keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    ADD_TASK: null,
    COMPLETE_TASK: null,
    INCOMPLETE_TASK: null,
    SET_TOKEN: null,
    IGNORE_REPO: null,
    IGNORE_ORG: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
