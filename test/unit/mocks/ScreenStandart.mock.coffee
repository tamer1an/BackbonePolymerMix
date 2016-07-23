window.Mocks = {} unless window.Mocks?

window.Mocks.ScreenStandart =
  setScope: jasmine.createSpy('ScreenStandart.setScope').and.callFake -> @
  setCallback: jasmine.createSpy('ScreenStandart.setCallback').and.callFake -> @
  init: jasmine.createSpy('ScreenStandart.init')
  place: jasmine.createSpy('ScreenStandart.place')