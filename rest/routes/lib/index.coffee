exports.index = ( request, response ) ->
  response.render 'index', {
    title: 'Express',
    scripts: []
  }