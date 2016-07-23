h = require('rest-helpers')

module.exports = class
  pool: []

  getRandomId: () -> h.random @pool.length - 1

  get: ( id ) ->
    id = @getRandomId() unless id?
    @pool[id]

  all: -> @pool

  list: (count) ->
    list = []
    list.push( @pool[@getRandomId()] ) for i in [0..count]
    list