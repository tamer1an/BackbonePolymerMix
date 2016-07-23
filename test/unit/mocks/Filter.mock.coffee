window.Mocks = {} unless window.Mocks?

window.Mocks.Filter = ( @comparator ) ->

angular.extend window.Mocks.Filter.prototype,
  setComparator: jasmine.createSpy 'Filter.setComparator'
  update: jasmine.createSpy 'Filter.update'
  activate: jasmine.createSpy 'Filter.activate'
  setTargetField:
    jasmine.createSpy 'Filter.setTargetField'
      .and.callFake -> @
