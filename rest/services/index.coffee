util = require 'util'
path = require('path')

lib = path.join __dirname, 'lib'

require('fs').readdirSync( lib ).forEach ( file ) ->
  util._extend exports, require path.join lib, file