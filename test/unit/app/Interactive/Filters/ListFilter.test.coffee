describe 'Interactive Module / ListFilter Filter', ->
  beforeEach module 'Interactive'

  it "filters by given filter item", inject ( listFilterFilter ) ->

    filterItem = new window.Mocks.FilterItem 'Zone'
    filterItem.setCallbacks
      isSelected: -> yes
      apply: ( value ) -> value is "ZONE"

    targetField = 'device'
    filtered = listFilterFilter window.Stubs.Alarms, filterItem, targetField

    expect filtered
      .toEqual [ window.Stubs.Alarms[1], window.Stubs.Alarms[2] ]

    expect filterItem.apply.calls.count()
      .toBe window.Stubs.Alarms.length