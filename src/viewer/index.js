import React from 'react';
import ReactDOM from 'react-dom';

import Viewer from 'viewer/Viewer';

const mainElement = document.getElementById("twitch-extension-viewer");


ReactDOM.render(<Viewer />, mainElement);
