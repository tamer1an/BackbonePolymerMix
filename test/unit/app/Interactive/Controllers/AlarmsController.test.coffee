xdescribe "Module Interactive // Alarms Controller", ->

  scope = null
  deferred = null
  controller = null

  beforeEach module "Interactive"

  beforeEach inject ( $controller, $rootScope, $q ) ->
    scope = $rootScope.$new()

    deferred = $q.defer()

    subscription = window.Mocks.Subscription
    subscription.subscribe.and.callFake -> deferred.promise

    controller = $controller 'AlarmsController',
      $scope: scope
      FilterSimple: new window.Mocks.Filter()

      Subscription: subscription

      ScreenStandart: window.Mocks.ScreenStandart

    null

  it "inits", ->
    expect scope.filters
      .toBeDefined()

    expect scope.alarms
      .toEqual []

    expect window.Mocks.Subscription.subscribe
      .toHaveBeenCalledWith 'alarms'

  it "receives data from subscription", inject ($rootScope) ->
    deferred.notify content: window.Stubs.Alarms
    $rootScope.$apply()

    expect scope.alarms
      .toEqual window.Stubs.Alarms

    expect scope.filters.update
      .toHaveBeenCalledWith window.Stubs.Alarms