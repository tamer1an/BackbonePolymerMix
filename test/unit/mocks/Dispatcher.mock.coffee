window.Mocks = {} unless window.Mocks?

window.Mocks.Dispatcher =
  callbacks: {}
  setCallbacks: ( @callbacks ) -> @

  dispatch: jasmine.createSpy('Dispatcher.dispatch')

  observe: jasmine.createSpy('Dispatcher.observe').and.callFake ()->
    @callbacks.observe( arguments... ) if @callbacks.observe?