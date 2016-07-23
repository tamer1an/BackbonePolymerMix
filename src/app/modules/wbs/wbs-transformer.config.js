export default function (RestangularProvider, appConfig) {
    RestangularProvider.addElementTransformer(
        appConfig.restEntities.clientCountries, (element) => {
            element.name = element.clientCountryName;
            return element;
        });
}
