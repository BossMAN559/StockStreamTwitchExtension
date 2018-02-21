import React from 'react';
import { connect, PromiseState } from 'react-refetch'
import Election from './Election.js';
import SpeedElection from './SpeedElection.js';
import TradingElection from './TradingElection.js';

require("./Elections.css");

let Config = require('Config')


class Elections extends React.Component {
	constructor(props) {
        super(props)

		this.state = {
			user: {}
		};

		this.default_election = {
			expiration_date: 0,
			topic: "",
			poll_list: [],
		}

		this.topicToElection = {
			"!speed" : new Election(),
			"!trading" : new Election(),
		};
	}

	updateElections(newElections) {
		for (var j = 0; j < newElections.length; j++) {
			var newElection = newElections[j];
			var existingElection = this.topicToElection.hasOwnProperty(newElection.topic) ? this.topicToElection[newElection.topic] : new Election();
			existingElection.updateElectionObject(newElection);
			this.topicToElection[existingElection.topic] = existingElection;
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			user: nextProps.user
		});
	}

	render() {
		const componentInstance = this;
		const { elections } = this.props;

		if (elections.fulfilled) {
			this.updateElections(elections.value);
		}

		return (
			<div className={"Elections"}>
				<center><hr/></center>
				<SpeedElection className={"SpeedElection"} election={ this.topicToElection["!speed"] } user={ this.state.user } />
				<TradingElection className={"TradingElection"} election={ this.topicToElection["!trading"] } user={ this.state.user } />
			</div>
		);
	}
}

export default connect((props, context) => {
	return {
		elections: { 
			url: `${Config.ssAPIEndpoint}/v1/elections`,
			refreshInterval: 1000,
		},
	}
})(Elections)
