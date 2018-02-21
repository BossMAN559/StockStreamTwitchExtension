import React, { Component, PropTypes } from 'react';
import Websocket from 'react-websocket';

let Config = require('Config')

class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          count: 90
        };
    }
   
    handleData(data) {
        console.log(data)
    }
   
    render() {
        return (
            <div>
            Count: <strong>{this.state.count}</strong>

            <Websocket url={`wss://${Config.ssAPIEndpoint}/v1/commands`}
                       onMessage={this.handleData.bind(this)}/>
            </div>
        );
    }
}

export default Footer;
