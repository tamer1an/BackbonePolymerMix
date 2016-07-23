window.Mocks = {} unless window.Mocks?

window.Mocks.Normalizer =
  callbacks: {}
  setCallbacks: ( @callbacks ) -> @

  normalize: jasmine.createSpy('Normalizer.normalize').and.callFake ->
    @callbacks.normalize( arguments... ) if @callbacks.normalize?