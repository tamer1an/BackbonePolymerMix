class DeviceTypes extends require( "./core" )
  constructor: () ->
    @pool = [
        name: "CONTROL_PANEL"
      ,
        name: "ZONE"
      ,
        name: "KEYFOB"
      ,
        name: "USER"
      ,
        name: "WIRELESS_COMMANDER"
      ,
        name: "WL_SIREN"
      ,
        name: "2_WAY_WIRELESS_KEYPAD"
      ,
        name: "X10"
      ,
        name: "GSM"
      ,
        name: "POWER_LINK"
      ,
        name: "PGM"
      ,
        name: "CAMERA"
      ,
        name: "PROXY_TAG"
      ,
        name: "PENDANT"
      ,
        name: "GUARD_KEY"
      ,
        name: "REPEATER"
      ,
        name: "IPMP_SERVER"
    ]

exports.DeviceTypes = new DeviceTypes()
