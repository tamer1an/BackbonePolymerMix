describe "Data module//Zone Service", ->

  deferred = null
  scope = null

  beforeEach module 'Data'

  beforeEach inject ( $q, Subscription, $rootScope ) ->
    scope = $rootScope.$new()

    spyOn( Subscription, "subscribe" ).and.callFake ->
      deferred = $q.defer()
      deferred.promise

  it "inits", inject ( Zone, Subscription ) ->
    expect( Subscription.subscribe ).toHaveBeenCalledWith 'zones'

  it "provides method getZoneById",  inject ( Zone, $rootScope ) ->
      angular.forEach window.Stubs.Zones, ( zone ) ->
        Zone.getZoneById( zone.zone ).then ( _zone ) -> expect( _zone ).toEqual zone

      Zone.getZoneById(99).then ( _zone ) -> expect( _zone ).toEqual no

      deferred.notify window.Stubs.Zones
      $rootScope.$apply()
