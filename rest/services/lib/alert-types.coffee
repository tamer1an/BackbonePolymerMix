class AlertTypes extends require( "./core" )
  constructor: () ->
    @pool = [
        id: 1
        name: "AC_FAILURE"
      ,
        id: 2
        name: "ALARM_IN_MEMORY"
      ,
        id: 3
        name: "BYPASS"
      ,
        id: 4
        name: "CLEAN_ME"
      ,
        id: 5
        name: "COLD_ALERT"
      ,
        id: 6
        name: "COMM_FAILURE"
      ,
        id: 7
        name: "EMERGENCY"
      ,
        id: 8
        name: "FIRE"
      ,
        id: 9
        name: "FREEZER_ALERT"
      ,
        id: 10
        name: "FREEZING_ALERT"
      ,
        id: 11
        name: "FUSE"
      ,
        id: 12
        name: "HEAT_MEMORY"
      ,
        id: 13
        name: "HEAT_OPEN"
      ,
        id: 14
        name: "HEAT_TROUBLE"
      ,
        id: 15
        name: "HOT_ALERT"
      ,
        id: 16
        name: "INACTIVE"
      ,
        id: 17
        name: "JAMMED"
      ,
        id: 18
        name: "LINE_FAILURE"
      ,
        id: 19
        name: "LOW_BATTERY"
      ,
        id: 20
        name: "MARK_FOR_SERVICE"
      ,
        id: 21
        name: "MASKING_TROUBLE"
      ,
        id: 22
        name: "NETWORK_TROUBLE"
      ,
        id: 23
        name: "NO_ACTIVE"
      ,
        id: 24
        name: "OPENED"
      ,
        id: 25
        name: "PANIC"
      ,
        id: 26
        name: "REPORTED_1_WAY"
      ,
        id: 27
        name: "RSSI_LOW"
      ,
        id: 28
        name: "RSSI_POOR_OR_LESS_24H"
      ,
        id: 29
        name: "RSSI_POOR_OR_LESS_NOW"
      ,
        id: 30
        name: "SIM_NOT_VERIFIED"
      ,
        id: 31
        name: "SMOKE_MEMORY"
      ,
        id: 32
        name: "SMOKE_OPEN"
      ,
        id: 33
        name: "SMOKE_TROUBLE"
      ,
        id: 34
        name: "SOAK_FAILED"
      ,
        id: 35
        name: "TAMPER"
      ,
        id: 36
        name: "TAMPER_MEMORY"
      ,
        id: 37
        name: "TROUBLE"
      ,
        id: 38
        name: "WENT_OFFLINE"
      ,
        id: 39
        name: "WORKING_1_WAY"
    ]

exports.AlertTypes = new AlertTypes()
