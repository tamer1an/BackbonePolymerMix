class ProcessStatuses extends require( "./core" )
  constructor: () ->
    @pool = [
      name: "FAILED"
    ,
      name: "HANDLED"
    ,
      name: "START"
    ,
      name: "SUCCEEDED"
    ]

exports.ProcessStatuses = new ProcessStatuses()
