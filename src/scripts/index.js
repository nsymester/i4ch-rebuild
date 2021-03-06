import { ScrollToTop, WindowWidth } from './components/Screen';
import { Accordion } from './components/Accordion';
import { CountrySelector } from './components/CountrySelector';
import { VehicleSelector } from './components/VehicleSelector';
import {
  ToggleNavigation,
  DropdownMenu,
  FixedNavigation,
  SelectTrip,
  RevealCurrency
} from './components/Navigation';
import { ScrollTo } from './components/ScrollTo';
import { AutoComplete } from './components/AutoComplete';
import { LoadFAQs } from './components/faqs';
import { RevealDocs } from './components/RevealDocs';
import { CoverOptions } from './components/CoverOptions';
import { Ready } from './components/Utils';
import {
  PolicySummaryDeviceResize,
  PolicySummaryMobile,
  PolicySummaryDesktop
} from './components/PolicySummary';
import { log } from 'util';

let countriesCovered = null;

function start() {
  // CountrySelector();
  VehicleSelector();
  ToggleNavigation();
  DropdownMenu();
  ScrollToTop();
  FixedNavigation();
  Accordion();
  WindowWidth();
  ScrollTo();

  // console.log(`countriesCovered: ${countriesCovered}`);
  // if (countriesCovered != null) {
  //   AutoComplete(document.getElementById('myInput'), countriesCovered);
  // }

  // LoadFAQs();
  RevealDocs();
  CoverOptions();
  // PolicySummaryMobile();
  // PolicySummaryDesktop();
  PolicySummaryDeviceResize();
  SelectTrip();
  RevealCurrency();
  // LazyLoad();
}

Ready(start);
