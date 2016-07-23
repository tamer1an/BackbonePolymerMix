window.Mocks = {} unless window.Mocks?

window.Mocks.Translate = jasmine.createSpy('translate').and.callFake ->
  then: jasmine.createSpy "translate.promise"