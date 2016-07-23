describe "Interactive Module // Collection Devices Service", ->

  beforeEach module "Interactive"

  $sample = new Array { zone: 1, a:10, b:20, c:30 }, { zone: 2, a:20, b:40, c:50 }
  $new    = new Array                                { zone: 2, a:20, b:60, c:50 }, { zone: 3, a:10, b:20, c:30 }

  it "initializes", inject ( CollectionCameras ) ->
    expect( CollectionCameras.length ).toEqual 0

    CollectionCameras.merge( $sample )
    expect( CollectionCameras ).toEqual $sample

    CollectionCameras.merge( $new )
    expect( CollectionCameras ).toEqual $new