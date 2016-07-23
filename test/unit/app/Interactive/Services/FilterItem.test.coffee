describe "ModuleInteractive/FilterItem Service", ->

  beforeEach module "Interactive"

  it "works using comparator callback", ->
    inject ( FilterItem ) ->
      name = "SOME"

      comparatorStub =
        compare: jasmine.createSpy('comparator').and.returnValue name

      filterItem = new FilterItem name, 1, no
      filterItem.setComparator comparatorStub

      value = 'stub'
      expect( filterItem.apply( value ) ).toBe yes
      expect( comparatorStub.compare ).toHaveBeenCalledWith value
