
class Election {

	constructor() {
		this.candidates = {};
		this.expiration_date = 0;
		this.topic = "";
		this.polls = {};
		this.ordered_labels = [];
	}

	updateElectionObject(newElection) {
		var latest_expiration = newElection.expirationDate;

		if (latest_expiration != this.expiration_date) {
			this.ordered_labels = [];
			this.candidates = {};
		}

		var existing_labels = new Set();
		for (var j = 0; j < this.ordered_labels.length; j++) {
			existing_labels.add(this.ordered_labels[j]);
		}

		for (var candidate in newElection.polls) {
			if (newElection.polls.hasOwnProperty(candidate)) {
				var candidateObject = JSON.parse(candidate);
				this.candidates[candidateObject.label] = candidateObject;
				if (!existing_labels.has(candidateObject.label)) {
					this.ordered_labels.push(candidateObject.label);
					existing_labels.add(candidateObject.label);
				}
			}
		}

		for (candidate of newElection.candidates) {
			var candidateObject = JSON.parse(candidate);
			this.candidates[candidateObject.label] = candidateObject;
			if (!existing_labels.has(candidateObject.label)) {
				this.ordered_labels.push(candidateObject.label);
				existing_labels.add(candidateObject.label);
			}
		}

		this.polls = {}
		for (var candidate in newElection.polls) {
			var candidateObject = JSON.parse(candidate);
			if (!this.polls.hasOwnProperty(candidateObject.label)) {
				this.polls[candidateObject.label] = 0;
			}
			this.polls[candidateObject.label] = this.polls[candidateObject.label] + newElection.polls[candidate];
		}

		this.topic = newElection.topic;
		this.expiration_date = latest_expiration;
	}

	findVotesByLabel(label) {
		if (this.polls.hasOwnProperty(label)) {
			return this.polls[label];
		}
		return 0;
	}

	findCandidate(label) {
		var foundCandidate = { label: label };

		if (this.candidates.hasOwnProperty(label)) {
			return this.candidates[label];
		}

		return foundCandidate;
	}

	getTotalVotes() {
		var totalVotes = 0;

		for (var poll in this.polls) {
			if (this.polls.hasOwnProperty(poll)) {
				totalVotes += this.polls[poll];
			}
		}

		return totalVotes;
	}

}

export default Election;
