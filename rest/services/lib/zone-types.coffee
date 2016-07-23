class ZoneTypes extends require( "./core" )
  constructor: () ->
    @pool = [
        name: "NON_ALARM"
      ,
        name: "PIR"
      ,
        name: "PUSH_BUTTON"
      ,
        name: "MAGNET"
      ,
        name: "SMOKE"
      ,
        name: "GAS"
      ,
        name: "FLOOD"
      ,
        name: "TOWER_32"
      ,
        name: "TOWER_20"
      ,
        name: "SMOKE_OR_HEAT"
      ,
        name: "NOT_SECURITY"
      ,
        name: "EMERGENCY"
      ,
        name: "FLOOD"
      ,
        name: "GAS"
      ,
        name: "DELAY_1"
      ,
        name: "DELAY_2"
      ,
        name: "INTERIOR_FOLLOW"
      ,
        name: "PERIMETER"
      ,
        name: "PERIMETER_FOLLOW"
      ,
        name: "24H_SILENT"
      ,
        name: "24H_AUDIBLE"
      ,
        name: "FIRE"
      ,
        name: "INTERIOR"
      ,
        name: "HOME_DELAY"
      ,
        name: "TEMPERATURE"
      ,
        name: "ARMING_KEY"
      ,
        name: "GUARD_KEYBOX"
      ,
        name: "OUTDOOR"
      ,
        name: "CO"
      ,
        name: "SHOCK"
      ,
        name: "SHOCK_AUX"
      ,
        name: "SHOCK_CONTACT_G2"
      ,
        name: "SHOCK_CONTACT_G3"
      ,
        name: "SHOCK_CONTACT_AUX_AMASK"
      ,
        name: "KEYFOB"
      ,
        name: "WL_COMMANDER"
    ]

exports.ZoneTypes = new ZoneTypes()
