class States extends require( "./core" )
  constructor: () ->
    @pool = [
        id: 1
        name: "Disarm"
      ,
        id: 2
        name: "Away"
      ,
        id: 3
        name: "ExitDelayAway"
      ,
        id: 4
        name: "ExitDelayHome"
      ,
        id: 5
        name: "Unknown"
    ]

exports.States = new States()
