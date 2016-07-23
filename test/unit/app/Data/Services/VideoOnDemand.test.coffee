describe "Data Service // VideoOnDemand service", ->

  beforeEach module "Data"

  beforeEach module ( $provide ) ->
    $provide.value "poller", window.Mocks.EmguoPoller
    $provide.value "Transport", window.Mocks.Transport
    $provide.value "Data", window.Mocks.Data

    null

  beforeEach ->
    @checkSource = ( source ) ->
      expect( source.getVideo ).toBeDefined()
      expect( source.getFrames ).toBeDefined()

      window.Mocks.Data.getOnDemandVideo.and.callFake ( cameraId, videoFormat, callback ) ->
        expect( cameraId ).toBeDefined()
        expect( videoFormat ).toEqual 'mp4'
        callback( content: 'data' )

      window.Mocks.Data.getOnDemandFrames.and.callFake ( cameraId, callback ) ->
        expect( cameraId ).toBeDefined()
        callback( content: 'data' )

      source
        .getVideo( 'mp4' )
        .then ( response ) -> expect( response ).toEqual( 'data' )

      source
        .getFrames()
        .then (response) -> expect( response ).toEqual( 'data' )

  it "provides source of already created video", inject ( VideoOnDemand, $rootScope ) ->
    CAMERA_ID = 10
    fallback = jasmine.createSpy()

    window.Mocks.Data.isVideoPresent.and.callFake ( cameraId, callback ) =>
      callback content: true

    VideoOnDemand( CAMERA_ID )
      .receive()
      .then @checkSource
      .catch fallback

    $rootScope.$apply()
    expect( fallback ).not.toHaveBeenCalled()

  it "rejects when no video", inject ( VideoOnDemand, $rootScope ) ->
    fallback = jasmine.createSpy()
    callback = jasmine.createSpy()

    window.Mocks.Data.isVideoPresent.and.callFake ( cameraId, callback ) =>
      callback content: false

    VideoOnDemand( null )
    .receive()
    .then callback
    .catch fallback

    $rootScope.$apply()

    expect( callback ).not.toHaveBeenCalled()
    expect( fallback ).toHaveBeenCalled()

  it "fails when null received", inject ( VideoOnDemand, $rootScope ) ->
    fallback = jasmine.createSpy()
    callback = jasmine.createSpy()

    VideoOnDemand( null )
      .receive()
      .then callback
      .catch fallback

    $rootScope.$apply()
    expect( fallback ).toHaveBeenCalled()
    expect( callback ).not.toHaveBeenCalled()

  it "requests new video on demand", inject ( VideoOnDemand, $rootScope ) ->
    fallback = jasmine.createSpy()
    callback = jasmine.createSpy().and.callFake @checkSource

    window.Mocks.Data.makeVideo.and.callFake ( cameraId, _callback ) ->
      _callback()

    window.Mocks.EmguoPoller.get.and.callFake (res, options) ->
      expect( options.argumentsArray[0].camera_id ).toEqual( 10 )

      stop = jasmine.createSpy()

      stop: stop
      promise:
        then: ( a, b, _callback ) ->
          _callback content: true
          expect( stop ).toHaveBeenCalled()

    VideoOnDemand( 10 )
      .request()
      .then callback
      .catch fallback

    $rootScope.$apply()

    expect( fallback ).not.toHaveBeenCalled()
    expect( callback ).toHaveBeenCalled()

  it "fails on request with null", inject ( VideoOnDemand, $rootScope ) ->
    fallback = jasmine.createSpy()
    callback = jasmine.createSpy()

    VideoOnDemand( null )
      .request()
      .then callback
      .catch fallback

    $rootScope.$apply()

    expect( callback ).not.toHaveBeenCalled()
    expect( fallback ).toHaveBeenCalled()