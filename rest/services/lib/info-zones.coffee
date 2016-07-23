class InfoZone extends require( "./core" )
  constructor: () ->
    @pool = [
        name: "AC_FAILURE"
      ,
        name: "ALARM_IN_MEMORY"
      ,
        name: "BYPASS"
      ,
        name: "CLEAN_ME"
      ,
        name: "COLD_ALERT"
      ,
        name: "COMM_FAILURE"
      ,
        name: "EMERGENCY"
      ,
        name: "FIRE"
      ,
        name: "FREEZER_ALERT"
      ,
        name: "FREEZING_ALERT"
      ,
        name: "FUSE"
      ,
        name: "HEAT_MEMORY"
      ,
        name: "HEAT_OPEN"
      ,
        name: "HEAT_TROUBLE"
      ,
        name: "HOT_ALERT"
      ,
        name: "INACTIVE"
      ,
        name: "JAMMED"
      ,
        name: "LINE_FAILURE"
      ,
        name: "LOW_BATTERY"
      ,
        name: "MARK_FOR_SERVICE"
      ,
        name: "MASKING_TROUBLE"
      ,
        name: "NETWORK_TROUBLE"
      ,
        name: "NO_ACTIVE"
      ,
        name: "OPENED"
      ,
        name: "PANIC"
      ,
        name: "REPORTED_1_WAY"
      ,
        name: "RSSI_LOW"
      ,
        name: "RSSI_POOR_OR_LESS_24H"
      ,
        name: "RSSI_POOR_OR_LESS_NOW"
      ,
        name: "SIM_NOT_VERIFIED"
      ,
        name: "SMOKE_MEMORY"
      ,
        name: "SMOKE_OPEN"
      ,
        name: "SMOKE_TROUBLE"
      ,
        name: "SOAK_FAILED"
      ,
        name: "TAMPER"
      ,
        name: "TAMPER_MEMORY"
      ,
        name: "TROUBLE"
      ,
        name: "WENT_OFFLINE"
      ,
        name: "WORKING_1_WAY"
    ]

exports.InfoZone = new InfoZone()
