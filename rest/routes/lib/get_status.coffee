helpers = require "rest-helpers"
services = require "rest-services"

exports.get_status = (request, response) ->
  response.send
    content:
      is_connected: helpers.bool .7
      state: services.States.get().name
      ready_status: services.ReadyStatuses.get(0).name
      exit_delay: helpers.random 30
