window.Mocks = {} unless window.Mocks?

window.Mocks.Pollers = jasmine.createSpyObj [ 'run', 'stop', 'poller' ]
window.Mocks.Pollers.poller.and.callFake -> window.Mocks.Poller