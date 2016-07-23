window.Mocks = {} unless window.Mocks?

window.Mocks.Comparator = () ->

angular.extend window.Mocks.Comparator,
  compare: jasmine.createSpy('Comparator.compare')