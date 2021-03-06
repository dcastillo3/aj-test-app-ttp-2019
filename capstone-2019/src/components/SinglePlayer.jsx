import React, {Component} from 'react';
import axios from 'axios';
import {teamObject} from './teams';
import NavBar from './NavBar';
import {addFavoriteThunk, deleteFavoriteThunk} from '../actions/FavoritesActions';
import {connect} from 'react-redux';


const mapState = (state) => {

	return {
		user: state.loginReducer.user
	};
}

const mapDispatch = (dispatch) => {

	return {
		addFavorite: (playerId, userId) => {
			dispatch(addFavoriteThunk(playerId, userId));
		},
		deleteFavorite: (playerId, userId) => {
			dispatch(deleteFavoriteThunk(playerId, userId));
		}
	};

} // end of mapDispatch


//passes in ID through react-routing, which will be used as a state and passes as a parameter

class SinglePlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id, //no longer dummy data
			stats: [], //state for player game info per game
			info:[], //player info
			gameID: "48760", //dummy gameID
			favorite: false,
		}
	}

	//function for fetching statistics from API
	fetchSinglePlayerStats = () => {

	const url = "https://www.balldontlie.io/api/v1/stats";
	const query = "?seasons[]=2018&player_ids[]=";

	//routing passed id for a single specific player
	//let id = this.props.player
	axios.get(url + query + this.state.id)
		.then(response => {
			// console.log("game info", response.data.data)
			const result = response.data.data.map(gameInfo => {
				const visitorId = gameInfo.game.visitor_team_id
				const homeTeam = teamObject.data.find(elem => elem.id === gameInfo.game.home_team_id)
				const teamInfo = teamObject.data.find(elem => elem.id === visitorId)
				gameInfo.game.visitorInfo = teamInfo
				gameInfo.game.homeInfo = homeTeam
				return gameInfo;
			})

			const gameIDs = result.map(gameStats => gameStats.game.id) //specifies location of data to set

			console.log(result, "result")

			//sorts the objects by date
			const playerInfo = result.sort((a, b) => {

                   return new Date(b.game.date) - new Date(a.game.date);
               });

			this.setState({stats: playerInfo}); //sets the state for result and gameIDs (gameIDs takes the mapped)

		})
		.catch(err => console.log(err));

	};

	fetchPlayerInformation = () => {
		const url = "https://www.balldontlie.io/api/v1/players/"

		axios.get(url + this.state.id)
			.then(response => {
				//console.log(response)
				let result = response.data
				this.setState({info: [result]});
			})
			.catch(err => console.log(err));

	}

	//instead of double axios call to get game info from player stat
	//have a seperate state that stores all the teams with there approriate team ID


	favorite = (id) => {

		this.setState({favorite: true})
		this.props.addFavorite(id, this.props.user.id);
	}

	unFavorite = (id) => {

		this.setState({favorite: false})
		this.props.deleteFavorite(id, this.props.user.id);
	}

	componentDidMount = () => {
		this.fetchSinglePlayerStats()/* fetches player stats for games*/
		this.fetchPlayerInformation() /* fetches general player information */
	}


	render() {

		// console.log("this is the state", this.state)

		return (

			<div>

				<NavBar />

				{!this.state.favorite ? (
					<button onClick={() => this.favorite(this.state.id)}> Favorite </button>
				) : (
					<button onClick={() => this.unFavorite(this.state.id)}> Unfavorite </button>
					)
				}

				{this.state.info.map(pass =>
					<div>

						{pass.first_name} {pass.last_name} <br></br>
						Height: {pass.height_feet}' {pass.height_inches}" <br></br>
						Weight: {pass.weight_pounds} <br></br>
						<br></br>
						Team: {pass.team.full_name} | {pass.team.conference} Conference <br></br>
						Position: {pass.position} <br></br>

					</div>
				)}

				{this.state.stats.map(pass =>
					(<div>

						<br></br>
						Game Date: {pass.game.date} <br></br>
						{pass.game.homeInfo.full_name}:	{pass.game.home_team_score} <br></br>
						{pass.game.visitorInfo.full_name}: {pass.game.visitor_team_score} <br></br>
						Points: {pass.pts}<br></br>
						Rebounds: {pass.dreb}<br></br>
						Assists: {pass.ast}<br></br>
						Field Goal %: {pass.fg_pct}<br></br>
						Blocks: {pass.blk}<br></br>
						Free Throw %: {pass.ft_pct} <br></br>

					</div>)
				)}
			</div>
		)
	}
}

export default connect(mapState, mapDispatch)(SinglePlayer);
