describe "Events.Dispatcher service", ->

    beforeEach module('Events')

    describe "observer invokes many times", ->

      beforeEach inject ( Dispatcher ) ->
        @Dispatcher = Dispatcher
        @callbacks = []
        @reset = ->
          callback.calls.reset() for name,callback of @callbacks

        subscribe = ( a = '_', b, c ) =>
          callbackName =  "a#{a}"
          callbackName += "b#{b}" if b?
          callbackName += "c#{c}" if c?

          callbackName = callbackName.replace(/[a-c]_/g, '_')
          @callbacks[callbackName] = _c = jasmine.createSpy callbackName

          eventName =  "a#{a}"
          eventName += ".b#{b}" if b?
          eventName += ".c#{c}" if c?
          eventName = eventName.replace(/[a-c]_/g, '*')
          Dispatcher.observe eventName, _c

        subscribe()

        names = [1,2,3,'_']
        for a in names
          subscribe a
          for b in names
            subscribe a,b
            for c in names
              subscribe a,b,c

      it "Dispatches events", ->
        expectations =
          'a1.b1.c1': [
            '___', 'a1__', '_b1_', '__c1', '_b1c1', 'a1_c1', 'a1b1_', 'a1b1c1'
          ]

          'a1.b1': [
            '__', 'a1_', '_b1', 'a1b1'
          ]

          'a2': [
            '_', 'a2'
          ]

        ( ( event, callbacks ) =>
          @reset()

          @Dispatcher.dispatch event, []

          ( (name, callback) =>
            if callbacks.indexOf(name) > -1
              expect( callback ).toHaveBeenCalled()
            else
              expect( callback ).not.toHaveBeenCalled()
          )(name, callback) for name, callback of @callbacks

        )( event, callbacks ) for event, callbacks of expectations

    describe "observer invoces expected count times", ->

      it "works", inject ( Dispatcher ) ->
        once = jasmine.createSpy()
        twice = jasmine.createSpy()
        observe = jasmine.createSpy()

        Dispatcher.once "some.event", once
        Dispatcher.exact(2).observe "some.event", twice
        Dispatcher.observe "some.event", observe

        Dispatcher.dispatch "some.event"
        Dispatcher.dispatch "some.event"
        Dispatcher.dispatch "some.event"
        Dispatcher.dispatch "some.event"

        expect( once.calls.count() ).toEqual 1
        expect( twice.calls.count() ).toEqual 2
        expect( observe.calls.count() ).toEqual 4

