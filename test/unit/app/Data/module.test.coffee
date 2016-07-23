describe "Data module // Init service", ->
  beforeEach module 'Data'

  beforeEach module ($provide) =>
    $provide.value 'Dispatcher', window.Mocks.Dispatcher
    $provide.value 'Commands', window.Mocks.Commands
    $provide.value 'Data', window.Mocks.Data
    $provide.value 'Pollers', window.Mocks.Pollers

    null

  describe 'handles dispatched change state commands', ->
    beforeEach inject (Init) =>
      Init()
      @observer = window.Mocks.Dispatcher.callbacks.listeners['command.state.change']

    it 'observes changing states', ->
      expect window.Mocks.Dispatcher.observe
        .toHaveBeenCalledWith "command.state.change", jasmine.any Function

    states =
      'away': 'away'
      'away.latchkey': 'awayLatchkey'
      'away.instant': 'awayInstant'
      'home': 'home'
      'home.instant': 'homeInstant'
      'disarm': 'disarm'

    ( ( state, command ) =>
      it "handles changing state to state", =>
        @observer "command.state.change", state
        expect( window.Mocks.Commands[command] ).toHaveBeenCalled()
    )( state, command ) for state, command of states

  describe 'handles event', ->

    beforeEach inject (Init) =>
      Init()

    it "auth.signIn", ->
      expect window.Mocks.Dispatcher.observe
        .toHaveBeenCalledWith "auth.signIn", jasmine.any Function

      observer = window.Mocks.Dispatcher.callbacks.listeners["auth.signIn"]
      observer "auth.signIn",
        webName: 'name'
        code: 'code'

      expect( window.Mocks.Data.signIn ).toHaveBeenCalledWith 'name', 'code'

    it "auth.signOut", ->
      expect window.Mocks.Dispatcher.observe
        .toHaveBeenCalledWith "auth.signOut", jasmine.any Function

      observer = window.Mocks.Dispatcher.callbacks.listeners["auth.signOut"]
      observer()

      expect( window.Mocks.Data.signOut ).toHaveBeenCalled()

    it "auth.signedOut", ->
      expect window.Mocks.Dispatcher.observe
        .toHaveBeenCalledWith "auth.signedOut", jasmine.any Function

      observer = window.Mocks.Dispatcher.callbacks.listeners["auth.signedOut"]
      observer()

      expect( window.Mocks.Pollers.stop ).toHaveBeenCalled()

    it "auth.signedIn", ->
      expect window.Mocks.Dispatcher.observe
        .toHaveBeenCalledWith "auth.signedIn", jasmine.any Function

      observer = window.Mocks.Dispatcher.callbacks.listeners["auth.signedIn"]
      observer()

      expect( window.Mocks.Pollers.run ).toHaveBeenCalled()



