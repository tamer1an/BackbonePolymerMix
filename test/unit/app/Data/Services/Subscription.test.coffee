describe "Data module//Subscription service", ->

  beforeEach module 'Data'

  beforeEach module ($provide) ->
    $provide.value 'Dispatcher', window.Mocks.Dispatcher.setCallbacks
      observe: (e,c)->
        @listeners = {} unless @listeners?
        @listeners[e] = c

    $provide.value 'Cache', window.Mocks.Cache.setCallbacks
      get: -> window.Stubs.Alarms

    null

  it "possible to subscribe for data type", inject ( Subscription, $rootScope ) ->
    subscriptionCallback = jasmine.createSpy 'subscription'
    Subscription
      .subscribe( 'test' )
      .then( null, null, subscriptionCallback )

    expect window.Mocks.Dispatcher.observe
      .toHaveBeenCalledWith 'test.updated', jasmine.any Function

    expect window.Mocks.Cache.get
      .toHaveBeenCalledWith 'test'

    $rootScope.$apply()

    expect subscriptionCallback
      .toHaveBeenCalledWith window.Stubs.Alarms

    # Try to invoke from Dispatcher
    window.Mocks.Dispatcher.callbacks.listeners['test.updated'] 'test.updated', window.Stubs.Alerts
    $rootScope.$apply()

    expect subscriptionCallback
      .toHaveBeenCalledWith window.Stubs.Alerts