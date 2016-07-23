describe "Data module//Cache service", ->

  beforeEach module 'Data'

  it "caches data", inject ( Cache, Dispatcher ) =>
    Dispatcher.dispatch 'alarms.updated', window.Stubs.Alarms
    Dispatcher.dispatch 'alerts.updated', window.Stubs.Alerts
    Dispatcher.dispatch 'zones.updated',  window.Stubs.Zones

    expect Cache.get 'alerts'
      .toEqual window.Stubs.Alerts

    expect Cache.get 'alarms'
      .toEqual window.Stubs.Alarms

    expect Cache.get 'zones'
      .toEqual window.Stubs.Zones

    Dispatcher.dispatch 'zones.updated',  window.Stubs.Alerts

    expect Cache.get 'zones'
      .toEqual window.Stubs.Alerts