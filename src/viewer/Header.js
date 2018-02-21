import React, { Component, PropTypes } from 'react';
import { connect, PromiseState } from 'react-refetch'

import Countdown, {zeroPad} from './Countdown.js'

require("./Header.css");

let Config = require('Config')


class Header extends React.Component {

	formatEventType(gameState) {
		var nextEventName = "";

		var timeStampNow = Math.floor(Date.now());
		var timeDelta = gameState.next_event - timeStampNow;

		if (timeStampNow > gameState.next_event) {
			nextEventName = "Placing Trades";
		} else if (gameState.next_event_type == "GAME_TICK") {
			nextEventName = "Next Round";
		} else {
			nextEventName = "Market Closed";
		}

		return nextEventName;
	}

	formatCountdownProps(props) {
		var textDisplay = "";

		if (props.total <= 0) {
			return "$ $ $";
		}

		if (props.days > 0) {
			textDisplay += props.days + ":";
		}
		if (props.days > 0 || props.hours > 0) {
			textDisplay += zeroPad(props.hours, 2) + ":";
		}

		if (props.days > 0 || props.hours > 0 || props.minutes > 0) {
			textDisplay += zeroPad(props.minutes, 2) + ":";
		}

		textDisplay += zeroPad(props.seconds, 2) + ":";
		textDisplay += zeroPad(Math.trunc(props.milliseconds/10), 2) ;

		return textDisplay;
	}

	render() {
		const { dataFetch } = this.props;

		var gameState = {
			next_event: 0,
			next_event_type: '',
		};

		if (dataFetch.fulfilled) {
			gameState = {
				next_event: dataFetch.value.nextEvent,
				next_event_type: dataFetch.value.nextEventType,
			};
		}

		return (
			<div className="Header">
				<div className="EventName">{this.formatEventType(gameState)}</div>
				<hr/>
				<Countdown
					date={new Date(gameState.next_event)}
					intervalDelay={0}
					zeroPadLength={2}
					precision={3}
					renderer={subp =>
						<div className="Countdown">
							{this.formatCountdownProps(subp)}
						</div>
					} />
			</div>
		);
	}
}

export default connect((props, context) => {
	return {
		dataFetch: { url: `${Config.ssAPIEndpoint}/v1/game/state`, refreshInterval: 2000 },
	}
})(Header)

