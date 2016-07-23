class EventDescriptions extends require( "./core" )
  constructor: () ->
    @pool = [
      id: 1
      name: "Arm Away"
    ,
      id: 2
      name: "Arm Away Instant"
    ,
      id: 3
      name: "Disarm"
    ,
      id: 4
      name: "Arm Home"
    ,
      id: 5
      name: "Penis is too large"
    ]

exports.EventDescriptions = new EventDescriptions()
