http = require 'http'
path = require 'path'
bodyParser = require 'body-parser'
express  = require 'express'
needle = require 'needle'
commander = require 'commander'
routes = require 'rest-routes'

app = express()
app.set 'port', process.env.PORT || 3001
app.set 'views', 'src/jade'
app.set 'view engine', 'jade'

app.use express.static 'static'
app.use express.static 'src'
app.use express.static 'rest/routes/static'
app.use bodyParser.json()
app.use bodyParser.urlencoded extended: yes

commander
  .option '-s, --server [ip]', 'Choose your destiny'
  .parse process.argv

if commander.server
  commander.server = "10.51.110.23" if commander.server == yes

  app.use '/public', ( request, response, next ) ->
    needle.request request.method,
      "https://#{commander.server}#{request.originalUrl}",
      null,
      { rejectUnauthorized: no, parse_response: no },
      ( err, remoteResponse ) ->
        return response.end "Proxy error: " + err if err
        response.status remoteResponse.statusCode
        for key in [ "Content-Type", "ETag", "Expires", "Last-Modified" ]
          header = remoteResponse.headers[key.toLowerCase()]
          response.setHeader key, header if header
        response.end remoteResponse.body

  app.use '/rest_api', ( request, response, next ) ->
    options =
      rejectUnauthorized: no
      parse_response: no
      json: true

    options.headers = "Session-Token" : request.headers["session-token"] if request.headers["session-token"]

    body = request.body
    body = null unless Object.keys(request.body).length

    needle.request request.method,
      "https://#{commander.server}#{request.originalUrl}",
      body,
      options,
      ( err, remoteResponse ) ->
        return response.end "Proxy error: " + err if err
        response.status remoteResponse.statusCode
        response.end remoteResponse.body


app.get '/', routes.index

version = "2.0"

app.use "/rest_api/#{version}", ( request, response, next ) ->
  return next() if request.url is "/login" or request.get 'Session-Token'

  response.status 440
  response.send
    status_string: '440 Session token not found'
    content: null

  response.end()

app.get "/rest_api/#{version}/alarms", routes.get_alarms
app.get "/rest_api/#{version}/alarm_previews", routes.get_alarm_previews
app.get "/rest_api/#{version}/alarm_video", routes.get_alarm_video
app.get "/rest_api/#{version}/alarm_video_frames", routes.get_alarm_video_frames

app.get "/rest_api/#{version}/status", routes.get_status
app.get "/rest_api/#{version}/zones", routes.get_zones
app.get "/rest_api/#{version}/alerts", routes.get_alerts
app.get "/rest_api/#{version}/all_devices", routes.get_all_devices

app.get "/rest_api/#{version}/cameras", routes.get_cameras
app.post "/rest_api/#{version}/make_video", routes.make_video
app.get "/rest_api/#{version}/is_video_present", routes.is_video_present
app.get "/rest_api/#{version}/on_demand_video", routes.get_on_demand_video
app.get "/rest_api/#{version}/on_demand_video_frames", routes.get_on_demand_video_frames

app.get "/rest_api/#{version}/events", routes.get_events

app.post "/rest_api/#{version}/login", routes.login

app.post "/rest_api/#{version}/arm_away", routes.away
app.post "/rest_api/#{version}/arm_away_instant", routes.away_instant
app.post "/rest_api/#{version}/arm_away_latchkey", routes.away_latchkey
app.post "/rest_api/#{version}/arm_home", routes.home
app.post "/rest_api/#{version}/arm_home_instant", routes.home_instant
app.post "/rest_api/#{version}/disarm", routes.disarm

app.post "/rest_api/#{version}/set_bypass_zone", routes.set_bypass_zone

http.createServer(app).listen app.get('port'), ->
  console.log('Express server listening on port ' + app.get 'port' )
