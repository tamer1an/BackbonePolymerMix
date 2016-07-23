describe "Namespace Helper", ->

  beforeEach module('Events')

  it "invokes callbacks", inject ( Namespace ) ->
    namespace = new Namespace()
    callbacks = jasmine.createSpyObj ['foo', 'bar', 'baz' ]

    namespace.addCallback callback for name, callback of callbacks
    namespace.invokeCallbacks( 'name', 'data' )

    ( ( callback ) ->
      expect( callback ).toHaveBeenCalledWith 'name', 'data'
    )( callback ) for name, callback of callbacks
