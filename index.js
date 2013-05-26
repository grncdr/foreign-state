module.exports = Tracker;

var deepCopy = require('deep-copy');

function Tracker(hiddenPropertyName) {
  // A unique sentinel value used to guard access to hidden state
  var key = function () {};
  
  hiddenPropertyName = hiddenPropertyName || '__getForeignState';
  
  this.track = function (object, initialState) {
    takeOwnership(object, key, hiddenPropertyName, initialState);
    return this.getState(object);
  }
  
  this.getState = function (object) {
    return object[hiddenPropertyName](key);
  }
}

function takeOwnership(object, key, property, initialState) {
  if (object.hasOwnProperty(property)) {
    // will throw an error if we aren't the manager for the object.
    object[property](key);
  } else {
    // add non-enumerable, non-configurable, non-writable property
    Object.defineProperty(object, property, {
      '__proto__': null,
      'value': initForeignState(key, initialState)
    });
  }
}

function initForeignState(ownerKey, initialState) {
  var foreignState = deepCopy(initialState || {});
  return function (key) {
    if (key !== ownerKey) {
      throw new Error("Only this objects owner may access it's foreign state");
    }
    return foreignState;
  }
}
