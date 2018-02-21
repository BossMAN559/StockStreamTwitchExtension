import React from 'react';
import ReactDOM from 'react-dom';

import Config from 'config/Config';

const mainElement = document.getElementById("twitch-extension-config");

ReactDOM.render(<Config />, mainElement);
