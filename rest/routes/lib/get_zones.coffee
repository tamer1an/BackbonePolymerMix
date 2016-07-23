exports.get_zones = ( request, response ) ->
  response.send
    content: require( "rest-services" ).Zones.all()