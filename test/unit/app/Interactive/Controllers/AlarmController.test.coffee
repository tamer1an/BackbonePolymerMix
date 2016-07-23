describe "Module Interactive // Alarm Controller", ->

  scope = null
  controller = null

  beforeEach module "Interactive"

  beforeEach inject ( $controller, $rootScope ) ->
    scope = $rootScope.$new()
    controller = $controller 'AlarmController',
      $scope: scope
      Zone: window.Mocks.Zone
      '$translate': window.Mocks.Translate

    null