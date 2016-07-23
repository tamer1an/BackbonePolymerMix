window.Mocks = {} unless window.Mocks?

window.Mocks.Data = jasmine.createSpyObj ['signIn', 'signOut', 'updateZones', 'runPollers', 'runPoller', 'stopPollers',
                                          'stopPoller', 'getAlarmVideoPreviews', 'getAlarmVideo', 'getAlarmVideoFrames',
                                          'makeVideo', 'isVideoPresent', 'getOnDemandVideo', 'getOnDemandFrames' ]
