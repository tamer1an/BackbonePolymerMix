describe "Interactive service // Data NormalizerComposite service", ->

  beforeEach module "Interactive"

  it "adds normalizers", inject ( NormalizerComposite ) ->

    normalizers = []
    normalizers.push
      normalize: () ->

    normalizers.push
      normalize: () ->

    normalizer = new NormalizerComposite normalizers
    expect( normalizer._normalizers.length ).toBe 2

    normalizer.addNormalizer
      normalize: () ->

    expect( normalizer._normalizers.length ).toBe 3

    normalizer.addNormalizer () ->
    expect( normalizer._normalizers.length ).toBe 3


    normalizer = new NormalizerComposite
      normalize: () ->

    expect( normalizer._normalizers.length ).toBe 1


  it "normalizes data", inject ( NormalizerComposite ) ->
    data =
      field1: 0
      field2: 0
      field3: 0

    normalizer = new NormalizerComposite()


    normalizer.addNormalizer
      normalize: jasmine.createSpy('normalizer').and.callFake (_data) ->
        _data.field1 = 1
        _data

    normalizer.addNormalizer
      normalize: jasmine.createSpy('normalizer').and.callFake (_data) ->
        _data.field2 = 3
        _data

    normalizer.addNormalizer
      normalize: jasmine.createSpy('normalizer').and.callFake (_data) ->
        _data.field3 = 5
        _data

    result = normalizer.normalize data

    expect( result ).toEqual
      field1: 1
      field2: 3
      field3: 5

