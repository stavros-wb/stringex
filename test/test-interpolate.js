var vows        = require('vows'),
    assert      = require('assert'),
    interpolate = require('../lib/interpolate');

vows.describe('String Interpolation').addBatch({

  "when interpolating a string with a single string parameter": {
    topic: function() { return interpolate('Hello #{0}!', 'Paul'); },

    'the string returned will be the source interpolated with the provided parameter': function(topic) {
      assert.equal(topic, 'Hello Paul!');
    }
  },

  "when interpolating a string with more parameters than variables": {
    topic: function() { return interpolate('Hello #{0}, #{1}.', 'Paul', 'Nice to meet you', 'See you later!'); },

    'the extra parameters are ignored': function(topic) {
      assert.equal(topic, 'Hello Paul, Nice to meet you.');
    }
  },

  "when interpolating a string with fewer parameters than variables": {
    topic: function() { return interpolate('The result of #{0} / 1 is #{1}', 2); },

    'the remaining variables are interpolated with the last parameter': function(topic) {
      assert.equal(topic, 'The result of 2 / 1 is 2');

    }
  },

  "when interpolating a string with fewer params than variables, but with an object parameter provided": {
    topic: function() {
      return interpolate('My name is #{name}. My email is #{email}', {
        name: 'Paul',
        email: 'paulschoenfelder@gmail.com'
      });
    },

    'the keys of the object will be used to do named replacements in the string': function(topic) {
      assert.equal(topic, 'My name is Paul. My email is paulschoenfelder@gmail.com');
    }
  },

  "when interpolating with a regular expression object": {
    topic: function() { return interpolate(/^#{0}$/g, 'Testing'); },

    'the result is a RegExp object instead of a string': function(topic) {
      assert.ok(topic.constructor === RegExp);
      assert.equal(topic.toString(), '/^Testing$/g');
    }
  },

  "when interpolating in mixed-mode (named and numbered params)": {
    topic: function() {
      return interpolate('My #{0} is #{name}. My #{1} is #{email}', 'name', 'email', {
        name: 'Paul',
        email: 'paulschoenfelder@gmail.com'
      });
    },

    'the interpolation will replace named variables from the object param, and numbered params in their provided order': function(topic) {
      assert.equal(topic, 'My name is Paul. My email is paulschoenfelder@gmail.com');
    },

    'the interpolation still works if the object param comes first': function() {
      assert.equal(interpolate('My #{0} is #{name}', {
        name: 'Paul'
      }, 'name'), 'My name is Paul');
    }
  }

}).export(module);