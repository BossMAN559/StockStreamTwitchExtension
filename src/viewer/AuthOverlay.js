import React from 'react';

require("./AuthOverlay.css");

class AuthOverlay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="AuthOverlay">
				<div className="overlayData">
					<center>
						<h2>Access Required</h2>
						<p>
							To play StockStream you must grant access first.
						</p>
						<p>
							First click the puzzle piece at the bottom of the video.
						</p>
						<img alt='logo' className="puzzleLogoImg" src={require('./img/puzzle.png')} />
						<p>
							Next click the <span className="purple">Manage Access</span> button.
						</p>
						<img alt='logo' className="accessMenuImg" src={require('./img/access_menu.png')} />
						<p>
							And finally, click the <img alt='logo' className="accessButtonImg" src={require('./img/access_button.png')} /> button.
						</p>
						
						<br/>
						<img alt='logo' className="arrowImg" src={require('./img/arrow.png')} />
					</center>
				</div>
			</div>
		);
	}
}

export default AuthOverlay;
