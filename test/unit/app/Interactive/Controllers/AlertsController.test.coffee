describe "Module Interactive // Alerts Controller", ->

  scope = null
  deferred = null
  controller = null

  beforeEach module "Interactive"

  beforeEach inject ( $controller, $rootScope, $q ) =>
    scope = $rootScope.$new()
    deferred = $q.defer()

    subscription = window.Mocks.Subscription
    subscription.subscribe.and.callFake -> deferred.promise

    controller = $controller 'AlertsController',
      $scope: scope

      NormalizerFactory:
        dateTime: jasmine.createSpy().and.callFake ->
          window.Mocks.Normalizer.setCallbacks
            normalize: ( data ) -> data

      Subscription: subscription


    null

  it "inits correctly", ->
    expect scope.alerts
      .toBeDefined()

    expect window.Mocks.Subscription.subscribe
      .toHaveBeenCalledWith 'alerts'

  it "handles DataSubscription invokations",  inject ( $rootScope ) ->
    deferred.notify content: window.Stubs.Alerts
    $rootScope.$apply()

    expect( scope.alerts ).toEqual window.Stubs.Alerts


