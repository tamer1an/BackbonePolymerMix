describe "Data module//Poller service", ->

  beforeEach module 'Data'

  beforeEach module ( $provide ) =>
    $provide.value 'poller', window.Mocks.EmguoPoller
    $provide.value 'md5',  jasmine.createSpyObj ['createHash']

    null

  it "", inject ( Poller ) ->
    _p =
      stop: jasmine.createSpy()
      promise:
        then: jasmine.createSpy()

    window.Mocks.EmguoPoller.get.and.callFake -> _p

    p = Poller window.Mocks.Transport.resources.getAlarms

    p.run()

    expect( window.Mocks.EmguoPoller.get ).toHaveBeenCalledWith window.Mocks.Transport.resources.getAlarms, jasmine.any Object
    expect( _p.promise.then ).toHaveBeenCalledWith null, null, jasmine.any Function


    describe "restarting poller", inject ( Poller ) ->
      p = Poller window.Mocks.Transport.resources.getAlarms

      spyOn p, 'run'
      spyOn p, 'stop'
      spyOn p, 'restart'

      it "when not launched", ->
        p.restart()

        expect( p.stop ).not.toHaveBeenCalled()
        expect( p.run ).not.toHaveBeenCalled()

      it "when launched", ->
        p.run()
        p.restart()

        expect( p.stop ).toHaveBeenCalled()
        expect( p.run ).toHaveBeenCalled()

      it "on channging interval", ->
        p.changeInterval 200

        expect( p.stop ).not.toHaveBeenCalled()
        expect( p.run ).not.toHaveBeenCalled()

      it "on channging interval on launched", ->
        p.run()
        p.changeInterval 200

        expect( p.stop ).toHaveBeenCalled()
        expect( p.run ).toHaveBeenCalled()

