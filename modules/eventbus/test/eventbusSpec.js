describe('ui.eventBus', function () {
  'use strict';

  var $rootScope,
    eventBus;

  beforeEach(module('ui.eventBus'));
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    eventBus = $injector.get('eventBus');
  }));

  it('should return a function', function () {
    var actual = eventBus({
      target: {},
      eventNames: ['save', 'load']
    });

    expect(actual).toEqual(jasmine.any(Function));
  });

  it('should attach an "on" method to the target by default', function () {
    var target = {};

    eventBus({
      target: target,
      eventNames: ['save', 'load']
    });

    expect(target.on).toEqual(jasmine.any(Function));
  });

  it('should attach a custom listen method to the target when specified', function () {
    var target = {};

    eventBus({
      target: target,
      eventNames: ['save', 'load'],
      listenName: 'custom'
    });

    expect(target.custom).toEqual(jasmine.any(Function));
  });

  it('should throw if the target is undefined', function () {
    expect(function () {
      eventBus({
        eventNames: ['save', 'load']
      });
    }).toThrow();
  });

  it('should throw if the event names are undefined', function () {
    expect(function () {
      eventBus({
        target: {}
      });
    }).toThrow();
  });

  it('should throw if the event names are empty', function () {
    expect(function () {
      eventBus({
        target: {},
        eventNames: []
      });
    }).toThrow();
  });

  it('should throw if the target listen name already exists', function () {
    expect(function () {
      eventBus({
        target: {
          custom: true
        },
        eventNames: ['save', 'load'],
        listenName: 'custom'
      });
    }).toThrow();
  });

  it('should not be affected by $rootScope broadcast', function () {
    var target = {},
      listener = jasmine.createSpy('listener');

    eventBus({
      target: target,
      eventNames: ['save', 'load']
    });

    target.on('save', listener);

    $rootScope.$broadcast('save');

    expect(listener).not.toHaveBeenCalled();
  });

  it('should call handler when event is fired', function () {
    var target = {},
      fire,
      listener = jasmine.createSpy('listener');

    fire = eventBus({
      target: target,
      eventNames: ['save', 'load']
    });

    target.on('save', listener);
    fire('save');

    expect(listener).toHaveBeenCalled();
  });

  it('should pass normalized data to handler', function () {
    var target = {},
      fire,
      listener = jasmine.createSpy('listener');

    fire = eventBus({
      target: target,
      eventNames: ['save', 'load']
    });

    target.on('save', listener);
    fire('save', 'data');

    expect(listener).toHaveBeenCalledWith({
      sender: target,
      data: 'data'
    });
  });

  it('should remove handler with listener callback', function () {
    var target = {},
      fire,
      off,
      listener = jasmine.createSpy('listener');

    fire = eventBus({
      target: target,
      eventNames: ['save', 'load']
    });

    off = target.on('save', listener);
    off();
    fire('save', 'data');

    expect(listener).not.toHaveBeenCalled();
  });
});
