describe "Interactive client", ->
  baseURL = 'http://localhost:3001'
  menuList = null
  browser.executeScript('window.moveTo(0,0); window.resizeTo(screen.width, screen.height);')

#  browser.manage().logs().get('browser').then (browserLogs) ->
#    browserLogs.forEach (log)->
#      if (log.level.value > 900)
#      console.log('Browser console error!');
#      console.log(log.message);

  it "should have a title", ->
    browser.get(baseURL)
    expect(browser.getTitle()).toEqual('Interactive client');
    menuList = element.all(By.css('.mainNavItemLink'));

  describe "Navigation Section", ->

    it "have 3 menu items", ->
      expect(menuList.count()).toEqual(3)

    it "menu items have to change url hash", ->
      element(By.css('.mainNavBackBtn')).click()

      menuList.first().click()
      expect(browser.getLocationAbsUrl())
          .toBe('/alarms')

      menuList.get(1).click()
      expect(browser.getLocationAbsUrl())
          .toBe('/cameras')

      menuList.get(2).click()
      expect(browser.getLocationAbsUrl())
          .toBe('/alerts')

      element(By.css('.mainNavCloseBtn')).click()

  describe "Alarms Section", ->

    it "have items", ->

      element(By.css('.mainHeadMenu')).click()

      element(By.css('[ng-click="login()"]')).click()
      element(By.css('.rightNav [ng-click="close()"]')).click()
      element(By.css('.mainNavBackBtn')).click()
      menuList.first().click()

      element(By.css('.mainNavCloseBtn')).click()

      filters = element.all(By.css('.mainViewToolbarFilterLabel'));
      countFilters = filters.count();

      expect(countFilters).toBeGreaterThan(0)

#      filters.get(i).click() for i in [0..countFilters]

      filters.get(0).click()
      filters.get(1).click()
      filters.get(2).click()
      filters.get(3).click()

