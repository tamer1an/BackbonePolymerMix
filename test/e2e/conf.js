  exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['app/*.scenarios.coffee'],
    framework: 'jasmine',
  };