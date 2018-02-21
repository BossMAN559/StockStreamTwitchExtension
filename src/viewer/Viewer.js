import React from 'react';
import Header from './Header.js';
import Elections from './Elections.js';
import AuthOverlay from './AuthOverlay.js';

require("./Viewer.css");

class Viewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				auth: {}
			},
		};
	}

	componentDidMount() {
		const componentInstance = this;

		window.Twitch.ext.onAuthorized(auth => {
			var parts = auth.token.split(".");
			var payload = JSON.parse(window.atob(parts[1]));

			if (payload.user_id) {
				// User has granted permissions.
				// NOTE: User needs to grant permissions in order to submit requests.
				auth = {
					channel_id: payload.channel_id,
					client_id: auth.clientId,
					opaque_user_id: payload.opaque_user_id,
					token: auth.token,
					user_id: payload.user_id
				}

				var requestHeaders = new Headers();
				requestHeaders.append('Client-ID', auth.client_id);

				fetch('https://api.twitch.tv/helix/users?id=' + payload.user_id, {
					method: "GET",
					headers: requestHeaders
				}).then(function(response) {
					return response.json();
				}).then(function(jsonObject) {
					console.log(JSON.stringify(jsonObject));
					componentInstance.setState({
						user: {
							channel: jsonObject.data,
							auth: auth,
							username: jsonObject.data[0].login,
							platform: "twitch"
						}
					});
				});
			}

		});
	}

	render() {
		return (
			<div className="ViewContainer">
				<div className="Viewer">
					<Header />
					<Elections user={this.state.user} />
				</div>
				{!this.state.user.auth.token &&
					<AuthOverlay />
				}
			</div>
		);
	}
}

export default Viewer;
