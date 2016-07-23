window.Stubs = {} unless window.Stubs?

window.Stubs.Alarms = [
  {
    "device" : "CONTROL_PANEL",
    "alarm_type" : "TAMPER_MEMORY",
    "datetime" : "2014-02-04 17:09:21",
    "has_video" : true,
    "evt_id" : 53,
    "zone" : null,
    "location" : null
  },
  {
    "device" : "ZONE",
    "alarm_type" : "ALARM_IN_MEMORY",
    "datetime" : "2014-02-04 17:05:03",
    "has_video" : false,
    "evt_id" : 52,
    "zone" : 3,
    "location":"Back door"
  },
  {
    "device" : "ZONE",
    "alarm_type" : "PANIC",
    "datetime" : "2014-02-04 17:05:03",
    "has_video" : true,
    "evt_id" : 51,
    "zone" : 5,
    "location":"Back door"
  }
]