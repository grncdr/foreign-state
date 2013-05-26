/**
 * Example usage, an object store with an LRU-cache identity map that does not
 * expose any of it's internal tracking data to other objects.
 *
 * The implementation uses synchronous localStorage to keep it simple, changing
 * it return promises from a remote backend is left as an excercise for the
 * reader.
 */
var Tracker = require('./')
  , lruCache = require('lru-cache');

function ObjectStore(name, serializer, cacheSize, backend) {
  var tracker     = new Tracker(name + 'StorageState')
    , identityMap = lruCache(cacheSize);
  
  this.put = function (object) {
    var state = tracker.track(object);
    if (!state.id) {
      state.id = nextId();
    }
    identityMap.set(state.id, object);
    return backend.setItem(name + '!' + state.id, serializer.stringify(object))
  }
  
  this.get = function (person) {
    return this.getById(tracker.getState(person).id, true)
  }
  
  this.getById = function (id, skipIdMap) {
    var object;
    if (!skipIdMap && (object = identityMap.get(id))) {
      return object;
    }
    var serialized = backend.getItem(name + '!' + id);
    if (serialized) {
      object = serializer.parse(serialized);
      tracker.track(object).id = id;
      identityMap.set(id, object)
    }
    return object;
  }
  
  this.remove = function (object) {
    var id = tracker.getState(object).id;
    identityMap.del(id);
    backend.removeItem(name + '!' + id)
  }

  this.getId = function (object) {
    return tracker.getState(object).id;
  };

  this.clearIdentityMap = function () {
    identityMap.reset();
  };

  function nextId() {
    var id = parseInt(backend.getItem(name + '!nextId'), 10);
    if (isNaN(id)) id = 1;
    backend.setItem(name + '!nextId', id + 1);
    return id;
  }
}

var store = new ObjectStore('person', JSON, 5, require('localStorage'));

for (var i = 1; i < 20; i++) {
  var person = {name: 'Person #' + i}
  store.put(person)
  console.log(person, store.getId(person));
}

store.clearIdentityMap();

console.log(store.getById(3))
