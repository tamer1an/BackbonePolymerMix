describe "ModuleInteractive/FilterAggregator Service", ->

  beforeEach module "Interactive"

  beforeEach module ($provide)->
    $provide.value 'FilterItem', window.Mocks.FilterItem

    null

  it "have to filter alarms", inject ( FilterAggregator ) ->
    comparator =
      compare: jasmine.createSpy('comparator').and.callFake (value) -> value

    response = FilterAggregator window.Stubs.Alarms, 'alarm_type', comparator

    expect( comparator.compare ).toHaveBeenCalled()
    expect( comparator.compare.calls.count() ).toBe 3

    expect( response.length ).toBe 4

