var Tracker = require('./index')
  , test = require('tape');

test('basic stuff', function (t) {
  var tracker = new Tracker();
  var object = {what: 'ok'};
  var state = tracker.track(object);
  t.plan(4);

  t.equal(typeof state, 'object', 'state is an object');
  t.deepEqual(Object.keys(object), ['what'], "no keys added to object");
  t.strictEqual(state, tracker.getState(object), 'retrieved state is identical');

  t.throws(function () {
    object.__getForeignState(function () {});
  }, null, "can't access state without key")
});

test('optional params', function (t) {
  var object = {};
  var tracker = new Tracker('customStateGetterName');
  var initState = {'this will': 'be copied'}
  var state = tracker.track(object, initState);
  t.plan(3)
  t.ok(object.hasOwnProperty('customStateGetterName'), 'custom getter name');
  t.deepEqual(state, initState, 'track() sets initial state');
  t.notStrictEqual(state, initState, 'initial state is copied');
});
