
import { AutoComplete } from './components/AutoComplete';
import { Ready } from './components/Utils';


function start() {
  if (countriesCovered != null) {
    AutoComplete(document.getElementById('allowedCountries'), countriesCovered);
  }
}

Ready(start);
