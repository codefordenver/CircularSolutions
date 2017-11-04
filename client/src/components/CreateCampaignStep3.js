import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const CreateCampaignStep3 = (props) => {

	const { initialSearch: { searchedAddress, error } } = props;
	let formattedAddress = {};
	if (searchedAddress) {
		formattedAddress = searchedAddress.formatted_address;
	}

  return (<div className="add_address_wrapper">
		<h1>Activate!</h1>
		<Link to="/new-campaign/activate">Sign your petition</Link>
  </div>)
};

export default connect(({ initialSearch }) => ({ initialSearch }))(CreateCampaignStep3);

