describe "Interactive module // CamerasPreviews module ", ->

  beforeEach module "Interactive"

  subscriptionDeferred = null
  alarmsVideoProviderDeferred = []

  beforeEach inject ( $q, Subscription, AlarmsVideoProvider, VideoPreview ) ->
    spyOn( Subscription, "subscribe" ).and.callFake ->
      subscriptionDeferred = $q.defer()
      subscriptionDeferred.promise

    spyOn( AlarmsVideoProvider, "getPreviews" ).and.callFake ->
      deferred = $q.defer()
      alarmsVideoProviderDeferred.push deferred
      deferred.promise

  beforeEach inject ( CamerasPreviewsSubscription, $rootScope ) ->
    subscriptionDeferred.notify content: window.Stubs.Alarms
    $rootScope.$apply()

    angular.forEach alarmsVideoProviderDeferred, ( deferred ) ->
      deferred.resolve([
        {
          camera_id: 1
          location: "some location"
          preview_path: "some path"
          timestamp: "time"
        },
        {
          camera_id: 2
          location: "some location"
          preview_path: "some path"
          timestamp: "time"
        }
      ])

    $rootScope.$apply()

  checkPreview = ( preview ) ->
    expect( preview.name ).toBeDefined()
    expect( preview.path ).toBeDefined()
    expect( preview.time ).toBeDefined()
    expect( preview.provider ).toBeDefined()

    expect( preview.provider.getVideo ).toEqual( jasmine.any( Function ) )
    expect( preview.provider.getFrames ).toEqual( jasmine.any( Function ) )

    expect( preview.provider.getVideo().then ).toEqual( jasmine.any( Function ) )
    expect( preview.provider.getFrames().then ).toEqual( jasmine.any( Function ) )

  it "able to subscript by event ID", inject ( CamerasPreviewsSubscription ) ->
    alarm = window.Stubs.Alarms[0]

    CamerasPreviewsSubscription.subscribeByEventId alarm.evt_id, ( data ) ->
      expect( data.length ).toBe 2

      angular.forEach data, checkPreview

  it "able to subscript by camera ID",  inject ( CamerasPreviewsSubscription, $rootScope ) ->

    CamerasPreviewsSubscription.subscribeByCameraId 1, (data) ->
      expect( data.length ).toBe 2
      angular.forEach data, checkPreview

    CamerasPreviewsSubscription.subscribeByCameraId 2, (data) ->
      expect( data.length ).toBe 2
      angular.forEach data, checkPreview