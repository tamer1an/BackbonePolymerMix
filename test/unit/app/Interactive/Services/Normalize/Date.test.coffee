describe "ModuleInteractive / Normalizers Services", ->

  beforeEach module "Interactive"

  it "adds fields", inject ( NormalizerConcreteDate ) ->
    normalizer =  new NormalizerConcreteDate( [ 'datetime' ] )
    normalizer.addField 'ctime'
    normalizer.addField 'mtime'

    expect( normalizer._fields ).toEqual ['datetime', 'ctime', 'mtime']


  it "normalizes data", inject ( NormalizerConcreteDate ) ->
    sample =
      datetime: '2015-02-07 03:10:50'

    normalizer = new NormalizerConcreteDate( [ 'datetime' ] )
    normalizer.normalize sample

#    console.log sample.datetime
    expect( angular.isDate sample.datetime ).toBe yes