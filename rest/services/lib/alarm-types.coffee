class AlarmTypes extends require( "./core" )
  constructor: () ->
    @pool = [
        id: 1
        name: 'ALARM_IN_MEMORY'
      ,
        id: 2
        name: 'EMERGENCY'
      ,
        id: 3
        name: 'FIRE'
      ,
        id: 4
        name: 'PANIC'
      ,
        id: 5
        name: 'HEAT_MEMORY'
      ,
        id: 6
        name: 'SMOKE_MEMORY'
      ,
        id: 7
        name: 'TAMPER_MEMORY'
    ]

exports.AlarmTypes = new AlarmTypes()
