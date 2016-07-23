module.exports =
  random: ( min = 0, max ) ->
    unless max?
      max = min
      min = 0

    min + Math.floor( Math.random() * ( max - min ) )

  bool: ( probability = .5 ) -> Math.random() > probability

  date: ( days = 1, format="yyyy-mm-dd hh:MM:ss", now ) ->
    now = new Date() unless now

    current = now.getTime()
    date = new Date @random( current - days*86400000, current )

    if format
      @formatDate date, format
    else
      date

  formatDate: ( date, format="yyyy-mm-dd hh:MM:ss" ) -> require('dateformat') date, format