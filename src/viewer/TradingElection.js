import React from 'react';
import { connect, PromiseState } from 'react-refetch'
import ToggleButton from 'react-toggle-button'
import ProgressButton from './ProgressButton.js';
import Election from './Election.js';
import ReactTooltip from 'react-tooltip'


let classNames = require( 'classnames' );
let Config = require('Config')

require("./TradingElection.css");


class TradingElection extends React.Component {
	constructor(props) {
		super(props)

		this.current_expiration = 0;

		this.state = {
			symbolInput: "",
			buy_toggled: false,
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

	updateInputValue(event) {
		this.setState({
			symbolInput: event.target.value
		});
	}

	handleTradeClick(event, side) {
		event.preventDefault();

		const mainComponent = this;
		console.log(side + " " + this.state.symbolInput);

		const tradeVote = {
			parameter: mainComponent.state.symbolInput.toUpperCase(),
			action: side.toUpperCase(),
			label: side.toUpperCase() + " " + mainComponent.state.symbolInput.toUpperCase()
		}

		fetch(`${Config.ssAPIEndpoint}/v1/vote/trading`, {
			method: "POST",
			body: JSON.stringify({
				user: mainComponent.state.user,
				electionId: mainComponent.state.election.topic + ":" + mainComponent.current_expiration,
				vote: tradeVote
			})
		}).then(function(response) {
			return response.json();
		}).then(function(response) {
			console.log(JSON.stringify(response));
			mainComponent.setState({
				symbolInput: "",
				orderResponse: response.status,
				vote: tradeVote
			});

			ReactTooltip.show(mainComponent.refs.orderresponse);
			setTimeout(function(){ ReactTooltip.hide(mainComponent.refs.orderresponse); }, 5000);
		});

	}

	handleVoteClick(event, label) {
		const mainComponent = this;
		const candidate = this.state.election.findCandidate(label);

		event.preventDefault();

		fetch(`${Config.ssAPIEndpoint}/v1/vote/trading`, {
			method: "POST",
			body: JSON.stringify({
				user: mainComponent.state.user,
				electionId: mainComponent.state.election.topic + ":" + mainComponent.current_expiration,
				vote: candidate
			})
		});

		this.setState({
			vote: candidate
		});
	}

	render() {
		const mainComponent = this;

		const electionExpired = new Date().getTime() > this.state.election.expiration_date;

		var totalVotes = this.state.election.getTotalVotes();

		return (
			<div className={this.props.className}>
								
				<ReactTooltip id='orderResponse'
							  globalEventOff='click'
							  getContent={[() => {return mainComponent.state.orderResponse}, 1000]} />

				<center><hr/></center>
				<form className="VoteFactory">
					<input disabled={electionExpired} className="SymbolInput" value={this.state.symbolInput} onChange={evt => this.updateInputValue(evt)} maxLength="5"
						   ref='orderresponse' data-for='orderResponse' data-tip data-event></input>
					<button disabled={electionExpired} className="BuyButton" onClick={(e) => mainComponent.handleTradeClick(e, "BUY")}><span>BUY</span></button>
					<button disabled={electionExpired} className="SellButton" onClick={(e) => mainComponent.handleTradeClick(e, "SELL")}><span>SELL</span></button>
					<br/>
				</form>


				<center><hr/></center>

				<ul>
					{
						mainComponent.state.election.ordered_labels.map(function(label, index) {


							var isSelected = label === mainComponent.state.vote.label;

							var candidateVotes = mainComponent.state.election.findVotesByLabel(label);
							var progressPercent = totalVotes == 0 ? 0 : (candidateVotes/totalVotes) * 100;

							return (
								<li key={ index }>
									<ProgressButton disabled={electionExpired}
													label={label}
													count={candidateVotes}
													progress={progressPercent}
													className={classNames({ selected: isSelected })}
													onClick={(e) => mainComponent.handleVoteClick(e, label)}/>
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}

export default TradingElection;
