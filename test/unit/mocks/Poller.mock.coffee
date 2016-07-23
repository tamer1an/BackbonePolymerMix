window.Mocks = {} unless window.Mocks?

window.Mocks.Poller = jasmine.createSpyObj [ 'run', 'promise', 'stop', 'changeInterval', 'restart' ]

window.Mocks.Poller.promise.and.callFake -> then: jasmine.createSpy()
window.Mocks.Poller.stop.and.callFake -> @
window.Mocks.Poller.changeInterval.and.callFake -> @