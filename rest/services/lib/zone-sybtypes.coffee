class ZoneSubTypes extends require( "./core" )
  constructor: () ->
    @pool = [
        name: "CO"
      ,
        name: "CONTACT"
      ,
        name: "CONTACT_AUX"
      ,
        name: "CONTACT_V"
      ,
        name: "CURTAIN"
      ,
        name: "FLOOD"
      ,
        name: "FLOOD_PROBE"
      ,
        name: "GAS"
      ,
        name: "GLASS_BREAK"
      ,
        name: "HARDWIRE"
      ,
        name: "MOTION"
      ,
        name: "MOTION_CAMERA"
      ,
        name: "MOTION_ENERGY"
      ,
        name: "MOTION_DUAL"
      ,
        name: "MOTION_OUTDOOR"
      ,
        name: "MOTION_OUTDOOR_CAMERA"
      ,
        name: "MOTION_V_ANTIMASK"
      ,
        name: "SHOCK"
      ,
        name: "SHOCK_AUX"
      ,
        name: "SHOCK_CONTACT_AUX_ANTIMASK"
      ,
        name: "SHOCK_CONTACT_G2"
      ,
        name: "SHOCK_CONTACT_G3"
      ,
        name: "SMOKE"
      ,
        name: "SMOKE_HEAT"
      ,
        name: "SMOKE_OR_HEAT"
      ,
        name: "TEMPERATURE"
      ,
        name: "UNIVERSAL_TRANSMITTER_2_INPUTS"
      ,
        name: "BASIC_KEYFOB"
      ,
        name: "KEYFOB_ARM_LED"
      ,
        name: "KEYPAD"
      ,
        name: "LCD_KEYPAD"
      ,
        name: "LCD_PRG_KEYPAD"
      ,
        name: "PROXIMITY_KEYPAD"
      ,
        name: "AC_OUTDOOR"
      ,
        name: "INDOOR"
      ,
        name: "OUTDOOR"
      ,
        name: "BIG"
      ,
        name: "SMALL"
      ,
        name: "SINGLE_BUTTON"
      ,
        name: "TWO_BUTTON"
      ,
        name: "BASIC_REPEATER"
    ]

exports.ZoneSubTypes = new ZoneSubTypes()
