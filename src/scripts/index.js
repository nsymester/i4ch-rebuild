import { Goodbye, World } from './components/GoodbyeWorld';
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
import { PolicySummary } from './components/PolicySummary';

console.log(`${Goodbye()} ${World} Index file`);

let countriesCovered = null;

function start() {
  CountrySelector();
  VehicleSelector();
  ToggleNavigation();
  DropdownMenu();
  ScrollToTop();
  FixedNavigation();
  Accordion();
  WindowWidth();
  ScrollTo();
  if (countriesCovered != null) {
    AutoComplete(document.getElementById('myInput'), countriesCovered);
  }
  LoadFAQs();
  // RevealDocs();
  CoverOptions();
  PolicySummary();
  SelectTrip();
  RevealCurrency();
}

Ready(start);
