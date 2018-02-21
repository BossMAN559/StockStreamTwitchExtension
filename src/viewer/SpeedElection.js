import React from 'react';
import { connect, PromiseState } from 'react-refetch'
import ProgressButton from './ProgressButton.js';
import Election from './Election.js';

let classNames = require( 'classnames' );
let Config = require('Config')

require("./SpeedElection.css");

class SpeedElection extends React.Component {
	constructor(props) {
		super(props)

		this.current_expiration = 0; 

		this.state = {
			user: {},
			election: new Election(),
			vote: {}
		};

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.election.expiration_date != this.current_expiration) {
			this.setState({
				vote: {}
			});
		}

		this.current_expiration = nextProps.election.expiration_date;

		this.setState({
			user: nextProps.user,
			election: nextProps.election,
		});
	}

	handleClick(event, user, candidate) {
		const mainComponent = this;

		event.preventDefault();

		fetch(`${Config.ssAPIEndpoint}/v1/vote/speed`, {
			method: "POST",
			body: JSON.stringify({
				user: user,
				electionId: mainComponent.state.election.topic + ":" + mainComponent.current_expiration,
				vote: candidate
			})
		});

		this.setState({
			vote: candidate
		});
	}

	render() {
		const componentInstance = this;
		const electionExpired = new Date().getTime() > this.state.election.expiration_date;

		var election = this.state.election;

		var fasterCandidate = this.state.election.findCandidate("Faster");
		var slowerCandidate = this.state.election.findCandidate("Slower");

		return (
			<div className={this.props.className}>
				{
					[slowerCandidate, fasterCandidate].map(function(candidateObject, index) {
						var isSelected = JSON.stringify(candidateObject) === JSON.stringify(componentInstance.state.vote);

						var candidateVotes = election.findVotesByLabel(candidateObject.label);
						var totalVotes = election.getTotalVotes();
						var progressPercent = totalVotes == 0 ? 0 : (candidateVotes/totalVotes) * 100;

						return (
							<ProgressButton key={ index }
											disabled={electionExpired}
											label={candidateObject.label}
											progress={progressPercent}
											className={classNames("SpeedButton", { selected: isSelected })}
											onClick={(e) => componentInstance.handleClick(e, componentInstance.state.user, candidateObject)}/>
						);
					})
				}
			</div>
		);
	}
}

export default SpeedElection;
