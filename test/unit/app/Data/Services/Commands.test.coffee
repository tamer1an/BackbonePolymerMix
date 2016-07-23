describe "Data module//Commands service", ->

  beforeEach module 'Data'

  beforeEach module ($provide) =>
    $provide.value 'Dispatcher', window.Mocks.Dispatcher
    $provide.value 'Transport', window.Mocks.Transport

    null

  commands =
    away: 'away'
    awayInstant: 'away.instant'
    awayLatchkey: 'away.latchkey'

    home: 'home'
    homeInstant: 'home.instant'

    disarm: 'disarm'

  ( ( command, event ) ->
      it "provides #{command} command", inject ( Commands ) =>
        Commands[command]()

        expect window.Mocks.Transport[command]
          .toHaveBeenCalled()

        expect window.Mocks.Dispatcher.dispatch
          .toHaveBeenCalledWith "command.state.changing", event

  )( command, event ) for command, event of commands
