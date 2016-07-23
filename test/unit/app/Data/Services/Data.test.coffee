describe "Data module//Data service", ->

  beforeEach module 'Data'

  beforeEach ->
    this.WEB_NAME = "901292"
    this.PANEL_CODE = "1111"

  beforeEach module ($provide)->
    $provide.value 'Dispatcher',  window.Mocks.Dispatcher
    $provide.value 'Transport', window.Mocks.Transport

    null

  describe "on init", ->

    it "will observe auth.signIn event", ->
      inject ( Data ) ->
        expect( window.Mocks.Dispatcher.observe ).toHaveBeenCalledWith 'auth.signIn', jasmine.any( Function )
        expect( window.Mocks.Dispatcher.observe ).toHaveBeenCalledWith 'auth.signedIn', jasmine.any( Function )
        expect( window.Mocks.Dispatcher.observe ).toHaveBeenCalledWith 'auth.signOut', jasmine.any( Function )
        expect( window.Mocks.Dispatcher.observe ).toHaveBeenCalledWith 'auth.signedOut', jasmine.any( Function )

  it "provides signIn method", inject ( Data )->
      Data.signIn this.WEB_NAME, this.PANEL_CODE

      expect( window.Mocks.Transport.signIn ).toHaveBeenCalledWith this.WEB_NAME, this.PANEL_CODE
      expect( window.Mocks.Dispatcher.dispatch ).toHaveBeenCalledWith 'auth.signedIn'

  it "provides signOut method", inject (Data) ->
    Data.signOut()

    expect( window.Mocks.Transport.signOut ).toHaveBeenCalled()
    expect( window.Mocks.Dispatcher.dispatch ).toHaveBeenCalledWith 'auth.signedOut'