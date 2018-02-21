import React from 'react';
import Progress from 'react-progressbar';
import classnames from 'classnames';

require("./ProgressButton.css");

class ProgressButton extends React.Component {

	render() {
		return (
			<button disabled={this.props.disabled}
					className={classnames('ProgressButton', this.props.className)}
					onClick={this.props.onClick}>
				<Progress className="ProgressBar"
						  color="cyan"
						  height={4}
						  completed={this.props.progress} />
				<span className="ProgressButtonText">{this.props.label}</span>
				<span className="ProgressButtonCount">{this.props.count}</span>
			</button>
		);
	}
}

export default ProgressButton;
