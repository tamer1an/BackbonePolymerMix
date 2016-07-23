describe "Module Interactive // SettingsForm Controller", ->

  scope = null
  rootScope = null
  controller = null

  deferred = false
  data = jasmine.createSpyObj ['getAvailableLanguages']

  translate = jasmine.createSpyObj ['use', 'preferredLanguage']
  storage = jasmine.createSpyObj ['get', 'set', 'remove']

  $languages = [
    code: "ru"
    name: "Russian"
  ,
    code: "en"
    name: "English"
  ]

  $languages.plain = -> @

  beforeEach module "Interactive"

  beforeEach inject ( $controller, $rootScope, $q ) ->
    rootScope = $rootScope
    scope = $rootScope.$new()

    deferred = $q.defer()

    storage.get.and.callFake (key) ->
      return 'ru' if key is 'language'
      return 42   if key is 'idleTimer'

    data.getAvailableLanguages.and.callFake ->
      deferred.promise

    controller = $controller 'SettingsFormController',
      $scope: scope
      Data: data
      $translate: translate
      Storage: storage


    null

  beforeEach ->
    translate.use.and.callFake -> 'ru'
    translate.preferredLanguage.and.callFake -> 'ru'

    deferred.resolve $languages
    rootScope.$apply()

    scope.settingsForm = $valid: true

  it "inits", inject ( defaultIdleTimer ) ->
    expect( data.getAvailableLanguages ).toHaveBeenCalled()
    expect( storage.get ).toHaveBeenCalledWith "language", 'ru'
    expect( storage.get ).toHaveBeenCalledWith "idleTimer", defaultIdleTimer

    expect( scope.languages ).toEqual $languages
    expect( scope.language ).toEqual(
      code: "ru"
      name: "Russian"
    )

    expect( scope.idleTimer ).toEqual 42


  it "changes timer", ->
    scope.idleTimer = 400
    spyOn scope, '$emit'

    scope.$apply()

    expect( storage.set ).toHaveBeenCalledWith 'idleTimer', 400
    expect( scope.$emit ).toHaveBeenCalledWith "timer.saved"

  it "changes language", ->
    scope.language =
      code: "en"
      name: "English"

    spyOn scope, '$emit'

    scope.$apply()

    expect( translate.use ).toHaveBeenCalledWith 'en'
    expect( storage.set ).toHaveBeenCalledWith 'language', 'en'
    expect( scope.$emit ).toHaveBeenCalledWith "language.saved"




