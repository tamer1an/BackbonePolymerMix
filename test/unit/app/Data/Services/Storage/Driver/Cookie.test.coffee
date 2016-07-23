describe "Data module // Storage Service", ->

  beforeEach module "Data"

  $cookie = {}

  beforeEach module ( $provide ) =>
    $cookie = jasmine.createSpyObj [ 'put', 'putObject', 'getObject', 'get', 'remove' ]
    $provide.value '$cookies', $cookie

    null


  it "set primitives", inject ( StorageDriverCookie ) ->
    StorageDriverCookie.set( "a", 2 );

    expect( $cookie.putObject ).not.toHaveBeenCalled()
    expect( $cookie.put ).toHaveBeenCalledWith "a", 2

  it "set objects", inject ( StorageDriverCookie ) ->
    StorageDriverCookie.set( "a", { value: 2 } );

    expect( $cookie.putObject ).toHaveBeenCalledWith "a", { value: 2 }
    expect( $cookie.put ).not.toHaveBeenCalled()

  it "get primitives", inject ( StorageDriverCookie ) ->
    $cookie.getObject.and.callFake -> 2
    $cookie.get.and.callFake -> 2

    expect( StorageDriverCookie.get "a" ).toEqual 2

    expect( $cookie.getObject ).toHaveBeenCalledWith "a"
    expect( $cookie.get ).toHaveBeenCalledWith "a"

  it "get objects", inject ( StorageDriverCookie ) ->
    $cookie.getObject.and.callFake -> { some: 2 }
    $cookie.get.and.callFake -> "{ some: 2 }"

    expect( StorageDriverCookie.get "a" ).toEqual { some: 2 }

    expect( $cookie.getObject ).toHaveBeenCalledWith "a"
    expect( $cookie.get ).not.toHaveBeenCalled()

  it "remove",  inject ( StorageDriverCookie ) ->
    StorageDriverCookie.remove 'key'

    expect( $cookie.remove ).toHaveBeenCalledWith 'key'