window.Mocks = {} unless window.Mocks?

resourcesList = [ 'signIn'
                  'signOut'

                  'getStatus'

                  'away'
                  'awayInstant'
                  'awayLatchkey'
                  'home'
                  'homeInstant'
                  'disarm'

                  'getAlarms'
                  'getAlarmVideoPreviews'
                  'getAlarmVideo'
                  'getAlarmVideoFrames'

                  'getAlerts'

                  'updateZones' ]

methodsList = [ 'signIn'
                'signOut'

                'getStatus'

                'away'
                'awayInstant'
                'awayLatchkey'
                'home'
                'homeInstant'
                'disarm'

                'getAlarms'
                'getAlarmVideoPreviews'
                'getAlarmVideo'
                'getAlarmVideoFrames'

                'getAlerts'

                'updateZones' ]


window.Mocks.Transport =
  resources: jasmine.createSpyObj resourcesList

  responses:
    signIn:
      content: "aaaaa"

( ( method ) ->
  window.Mocks.Transport[method] = jasmine.createSpy("Transport.#{method}").and.callFake ->
    then: jasmine.createSpy("Transport.#{method}.promise").and.callFake (callback) ->
      if window.Mocks.Transport.responses[method]?
        callback window.Mocks.Transport.responses[method]
      else
        callback()
)( method )for method in methodsList