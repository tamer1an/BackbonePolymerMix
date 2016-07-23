import CountryDirective from './country/country.directive.js';
import AnchorDirective from './ancor.directive.js';
import sidebarStyling from './sidebar-styling.directive';

const Directives = {
    CountryDirective, // add & edit clinet countries directive
    AnchorDirective,  // prevent href to lead without #
    sidebarStyling    // sidebar width and styling  depends on routing state
};

export default Directives;
