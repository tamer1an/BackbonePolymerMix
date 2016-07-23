class ReadyStatuses extends require( "./core" )
  constructor: () ->
    @pool = [
        id: 1
        name: "Ready"
      ,
        id: 2
        name: "Not Ready"
      ,
        id: 3
        name: "Unknown"
    ]

exports.ReadyStatuses = new ReadyStatuses()
