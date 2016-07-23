window.Mocks = {} unless window.Mocks?

window.Mocks.EmguoPoller =
  get: jasmine.createSpy 'EmguoPoller.get'
  reset: jasmine.createSpy 'EmguoPoller.reset'
  restartAll: jasmine.createSpy 'EmguoPoller.restartAll'
  size: jasmine.createSpy 'EmguoPoller.size'
  stopAll: jasmine.createSpy 'EmguoPoller.stopAll'