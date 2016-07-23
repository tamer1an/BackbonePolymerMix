describe "Service Interactive // Service Filter", ->

  beforeEach module "Interactive"

  it "updates values by update method", inject ( Filter ) ->
    comparator =
      compare: jasmine.createSpy('comparator').and.callFake (value) -> value

    filter = new Filter comparator
    filter.setTargetField 'alarm_type'

    filter.update window.Stubs.Alarms
    expect( filter.length ).toBe 4

    filter.update window.Stubs.Alarms
    expect( filter.length ).toBe 4