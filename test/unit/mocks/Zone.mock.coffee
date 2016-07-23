window.Mocks = {} unless window.Mocks?

window.Mocks.Zone =
  init: jasmine.createSpy('Zone.init')
  onZonesReceived: jasmine.createSpy('Zone.onZonesReceived')
  getZoneById: jasmine.createSpy('Zone.getZoneById')