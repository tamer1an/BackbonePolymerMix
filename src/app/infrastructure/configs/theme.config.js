export default function ($mdThemingProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue', {
            'default': '800'
        })
        .accentPalette('teal');
}
