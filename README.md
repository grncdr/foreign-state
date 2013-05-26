foreign-state
=============

Attach hidden state to arbitrary objects in JavaScript (like jQuery.data() without the jQuery)

[![browser support](https://ci.testling.com/USER/PROJECT.png)](https://ci.testling.com/grncdr/foreign-state)

## Motivation

One thing that can be quite annoying with JavaScript is that objects can only be keyed on
strings. While this will be mostly addressed by Harmony WeakMaps, this gist shows a method
for tracking hidden object state that can be used on all browsers today.†

The basic idea is that the "tracker" object adds a guarded, non-enumerable getter to the
object that will be tracked. This state getter function is created with sentinel object
(a "key"), and requires this exact key to be passed as an argument to access the hidden
state. Because this key is encapsulated in the tracker, the only way to view or change
the hidden state is through the tracker object that created it.

[example.js](https://github.com/grncdr/foreign-state/blob/master/example.js) demonstrates
using a tracker to create an object store that is completely invisible to the objects being
stored.

*† - May require a polyfill for Object.addProperty and Object.hasOwnProperty.*

## API

### module.exports = Tracker (hiddenPropertyName = '__getForeignState')

This module exports a single function that will create a new tracker object, it is a good
idea to define a unique hidden property name for each tracker, so that multiple trackers
do not conflict with each other.

### tracker.track(object, initialState = {}) -> hiddenState

Initialize, take ownership of, and return the hidden state for this object. If the optional
initial state is given, it will be deep-copied.

### tracker.getState(object) -> hiddenState

Get the hidden state for this object.

## License

BSD
