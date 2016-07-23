describe "Data module // Storage Service", ->

  beforeEach module "Data"

  driver = {}

  beforeEach module ( $provide ) =>
    driver = jasmine.createSpyObj [ 'set', 'get', 'remove' ]
    $provide.value 'StorageDriverCookie', driver

    null

  it "set", inject ( Storage ) ->
    Storage.set "a", "2"
    expect( driver.set ).toHaveBeenCalledWith( "a", "2" )

    Storage.set "key", 2
    expect( driver.set ).toHaveBeenCalledWith( "key", 2 )


  it "get", inject ( Storage ) ->
    driver.get.and.callFake -> no

    expect( Storage.get( "key" ) ).toEqual no
    expect( driver.get ).toHaveBeenCalledWith( "key" )


    expect( Storage.get( "key", "some" ) ).toEqual "some"
    expect( driver.get ).toHaveBeenCalledWith( "key" )


    driver.get.and.callFake -> "stored"
    expect( Storage.get( "key", "some" ) ).toEqual "stored"
    expect( driver.get ).toHaveBeenCalledWith( "key" )


  it "remove", inject ( Storage ) ->
    Storage.remove "a"
    expect( driver.remove ).toHaveBeenCalledWith( "a" )



