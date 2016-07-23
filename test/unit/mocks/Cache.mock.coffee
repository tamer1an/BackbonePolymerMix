window.Mocks = {} unless window.Mocks?

window.Mocks.Cache =
  callbacks: {}

  setCallbacks: ( @callbacks ) -> @

  get:
    jasmine.createSpy('Cache.get')
      .and.callFake ()-> @callbacks.get arguments... if @callbacks.get?