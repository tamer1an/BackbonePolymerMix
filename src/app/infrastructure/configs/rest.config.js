/**
 * Represents a book.
 * @constructor
 * @param {object} RestangularProvider - The title of the book.
 */
export default function (RestangularProvider, appConfig) {
    const baseUrl = appConfig.apiBaseUrl;
    RestangularProvider.setBaseUrl(baseUrl);
}
