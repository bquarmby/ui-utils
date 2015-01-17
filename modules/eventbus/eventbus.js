angular
  .module('ui.eventBus', [])
  .factory('eventBus', ['$rootScope', function eventBusFactory($rootScope) {
    'use strict';

    function EventBus(options) {
      var self = this,
        target = options.target,
        eventNames = options.eventNames;

      if (!angular.isObject(target)) {
        throw new Error('A target object is required.');
      }

      if (!(angular.isArray(eventNames) && eventNames.length)) {
        throw new Error('An array of event names is required.');
      }

      self.$$listeners = {};
      self.$$listenerCount = {};

      self.target = target;
      self.eventNames = eventNames;
      self.listenName = options.listenName || 'on';
    }

    EventBus.prototype = {
      constructor: EventBus,

      $on: $rootScope.$on,

      $broadcast: $rootScope.$broadcast,

      handle: function (handler, eventData, data) {
        handler({
          sender: this.target,
          data: data
        });
      },

      listen: function (eventName, listener) {
        var self = this,
          handle = self.handle.bind(self, listener);

        self.assertValidEvent(eventName);

        return self.$on(eventName, handle);
      },

      fire: function (eventName, data) {
        this.assertValidEvent(eventName);

        this.$broadcast(eventName, data);
      },

      attachListenMethod: function () {
        var self = this,
          target = self.target,
          listenName = self.listenName;

        if (target[listenName] !== undefined) {
          throw new Error('Cannot attach "' + listenName + '" to target because the property is already defined.');
        }

        target[listenName] = self.listen.bind(self);
      },

      assertValidEvent: function (eventName) {
        if (this.eventNames.indexOf(eventName) < 0) {
          throw new Error('Unrecognized event name "' + eventName + '".');
        }
      }
    };

    return function createEventBus(options) {
      var bus = new EventBus(options);

      bus.attachListenMethod();

      return bus.fire.bind(bus);
    };
  }]);
