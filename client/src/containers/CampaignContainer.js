import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import fetchCampaignById from '../redux/actions/activeCampaign';
import { firebasePopulateCampaignById } from '../redux/actions/firebaseActiveCampaign';
import { fetchApartmentsRequest } from '../redux/actions/initialSearch';
import { fetchUserSignatures } from '../redux/actions/signature';
import { signInGoogle, signInFacebook, signOut } from '../redux/actions/firebaseAuth';
// COMPONENTS
import CampaignPage from '../components/ViewCampaign/CampaignPage';
import Loader from '../components/FullScreenLoader';
import NotFound from '../components/NotFound';

class CampaignContainer extends Component {
  componentDidMount() {
    this.props.firebasePopulateCampaignById(this.props.params.id);
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.params.id !== nextProps.params.id) {
      nextProps.fetchCampaignById(nextProps.params.id);
    }
  }

  render() {
    const { activeCampaign } = this.props;
    const { loading, loaded, error, campaignId } = activeCampaign;
    const hrefIsLocalhost = window.location.href.toLowerCase().includes('localhost');
    return (
      <div>
        {loading && <Loader />}
        {loaded && activeCampaign && error && <NotFound />}
        {loaded &&
          activeCampaign &&
          !error && (
            <CampaignPage
              activeCampaign={activeCampaign}
              hrefIsLocalhost={hrefIsLocalhost}
              campaignId={campaignId}
            />
          )}
      </div>
    );
  }
}

CampaignPage.defaultProps = {
  activeCampaign: PropTypes.shape({
    address: null,
    error: null,
    modifiedAt: null,
    createdAt: null,
    latLng: null
  })
};

CampaignContainer.propTypes = {
  firebasePopulateCampaignById: PropTypes.func.isRequired,
  activeCampaign: PropTypes.shape({
    address: PropTypes.string,
    modifiedAt: PropTypes.string,
    createdAt: PropTypes.string,
    latLng: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool,
    loaded: PropTypes.bool
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default connect(
  ({ activeCampaign, initialSearch, signature }) => ({
    activeCampaign,
    initialSearch,
    userSignatures: {
      ...signature.userSignatures
    }
  }),
  {
    signInGoogle,
    signInFacebook,
    firebasePopulateCampaignById,
    signOut,
    fetchUserSignatures,
    fetchApartmentsRequest
  }
)(withRouter(CampaignContainer));
