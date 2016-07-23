const allTestFiles = [];
const TEST_REGEXP = /(_spec|_test)\.js$/i;
for (const file in window.__karma__.files) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
}
