window.Mocks = {} unless window.Mocks?

window.Mocks.Commands =
  callbacks: {}
  setCallbacks: ( @callbacks ) -> @

commands =
  away: 'away'
  awayInstant: 'away.instant'
  awayLatchkey: 'away.latchkey'

  home: 'home'
  homeInstant: 'home.instant'

  disarm: 'disarm'

( ( command ) ->
  window.Mocks.Commands[command] = jasmine.createSpy "Commands.#{command}"
)( command ) for command, event of commands