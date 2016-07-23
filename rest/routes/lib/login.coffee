exports.login = (request,response) ->
  webName = "aaa3"
  code = "1111"

  unless request.body.panel_web_name is webName
    response.status(445)
    response.send
      status_string: '445 Unknown panel web name'
      content: null
    response.end()
    return no

  unless request.body.user_code is code
    response.status(444)
    response.send
      status_string: '444 Wrong user code'
      content: null
    response.end()
    return no

  response.send
    status_string:"200 OK"
    content : 'fdsfsdg@#$5qof'