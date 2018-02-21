import React from 'react';
import ReactDOM from 'react-dom';

import LiveConfig from 'liveconfig/LiveConfig';

const mainElement = document.getElementById("twitch-extension-live-config");

ReactDOM.render(<Viewer />, mainElement);
