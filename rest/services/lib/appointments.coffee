class Appointments extends require( "./core" )
  constructor: () ->
    @pool = [
      id: 1
      name: "User 1"
    ,
      id: 2
      name: "User 2"
    ,
      id: 3
      name: "User 3"
    ,
      id: 4
      name: "System"
    ]

exports.Appointments = new Appointments()
