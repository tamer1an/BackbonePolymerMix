export default function (RestangularProvider, appConfig) {
    RestangularProvider.addElementTransformer(
        appConfig.restEntities.bids, true, (element) => {
            const startDate = moment(element.startDate);
            const endDate = moment(element.endDate);
            element.duration = endDate.diff(startDate, 'months');

            element.creationDateAsDate = moment(element.creationDate);
            element.strVersion = !Object.is(element.version, null) ? `v.${element.version}` : '';
            element.roles = !Object.is(element.roles, null) ? element.roles : '';
            element.selected = false;
            return element;
        });
}
