describe "Module Interactive / Comparators Services", ->

  beforeEach module "Interactive"

  describe "ComparatorSimple", ->
    it "compares", inject ( ComparatorSimple ) ->
      comparator = new ComparatorSimple();

      ( (sample) -> expect( comparator.compare( sample ) ).toEqual(sample) )( sample ) for sample in [ 'some1', 'some2', 'some3' ]


  describe "ComparatorDate", ->

    it "compares", inject ( ComparatorDate ) ->
      samples =
        [
          {
            name: "TODAY"
            samples: [
              new Date( 2015, 1, 12, 10, 59, 16 )
              new Date( 2015, 1, 12, 2, 0, 1 )
              new Date( 2015, 1, 12, 12, 30, 16 )
              new Date( 2015, 1, 12, 22, 30, 16 )
            ]
          }

          {
            name: "THIS WEEK"
            samples: [
              new Date( 2015, 1, 9, 10, 59, 16 )
              new Date( 2015, 1, 10, 10, 59, 16 )
              new Date( 2015, 1, 11, 10, 59, 16 )
            ]
          }

          {
            name: "THIS MONTH"
            samples: [
              new Date( 2015, 1, 7, 10, 59, 16 )
              new Date( 2015, 1, 6, 10, 59, 16 )
              new Date( 2015, 1, 5, 10, 59, 16 )
              new Date( 2015, 1, 4, 10, 59, 16 )
            ]
          }
        ]

      comparator = new ComparatorDate new Date( 2015, 1, 12, 10, 30, 30 )

      for set in samples
        for sample in set.samples
          expect( comparator.compare( sample ) ).toEqual set.name


