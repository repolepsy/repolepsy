const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');

let _ignoredOrgs = window.localStorage.getItem("ignoredOrgs") ? JSON.parse(window.localStorage.getItem("ignoredOrgs")) : [];

function assureNumber(num) {
  if(typeof num !== 'number') {
    throw new Error("Expected a number");
  }
}

// Facebook style store creation.
let IgnoredOrgsStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      ignoredOrgs: _ignoredOrgs
    };
  },

  isIgnoredOrg(org) {
    assureNumber(org.id);
    if(_ignoredOrgs.indexOf(org.id) === -1) {
      return false;
    }
    return true;
  },

  addToIgnoredOrgs(org) {
    assureNumber(org.id);
    if(!IgnoredOrgsStore.isIgnoredOrg(org)) {
      _ignoredOrgs.push(org.id);
      IgnoredOrgsStore.saveToLocalStorage();
    }
  },

  removeFromIgnoredOrgs(org) {
    assureNumber(org.id);
    if(IgnoredOrgsStore.isIgnoredOrg(org)) {
      let index = _ignoredOrgs.indexOf(org.id);
      if(index > -1) {
        _ignoredOrgs.splice(index, 1);
      }
      IgnoredOrgsStore.saveToLocalStorage();
    }
  },

  saveToLocalStorage() {
    window.localStorage.setItem("ignoredOrgs", JSON.stringify(_ignoredOrgs));
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;
    let org = action.org;

    switch (action.type) {
      case Constants.ActionTypes.TOGGLE_IGNORE_ORG:
        if(IgnoredOrgsStore.isIgnoredOrg(org)) {
          IgnoredOrgsStore.removeFromIgnoredOrgs(org);
        }
        else {
          IgnoredOrgsStore.addToIgnoredOrgs(org);
        }

        IgnoredOrgsStore.emitChange();
        break;
    }
  })

});

module.exports = IgnoredOrgsStore;
