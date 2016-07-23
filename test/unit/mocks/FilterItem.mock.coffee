window.Mocks = {} unless window.Mocks?

window.Mocks.FilterItem = ( @name ) ->
  @isSelected =
    jasmine.createSpy 'FilterItem.isSelected'
      .and.callFake -> @callbacks.isSelected arguments... if @callbacks.isSelected?

  @apply =
    jasmine.createSpy 'FilterItem.apply'
      .and.callFake -> @callbacks.apply arguments... if @callbacks.apply?

  @

angular.extend window.Mocks.FilterItem.prototype,
  callbacks: {}

  setCallbacks: ( @callbacks ) -> @

  setComparator:
    jasmine.createSpy 'FilterItem.setComparator'

  incCount:
    jasmine.createSpy 'FilterItem.incCount'

