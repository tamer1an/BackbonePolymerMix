class Locations extends require( "./core" )
  constructor: () ->
    @pool = [
        id: 1
        name: "Garage Door"
      ,
        id: 2
        name: "Bathroom"
      ,
        id: 3
        name: "Kitchen"
      ,
        id: 4
        name: "Bedroom"
    ]

exports.Locations = new Locations()
