import React from 'react';
import PropTypes from 'prop-types';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logSignerOut, fetchUserSignatures } from '../redux/actions/signature';

function MyCampaignNavItem(props) {
  return (
    <NavItem eventKey={4}>
      <Link to={`/campaign/${props.campaignId}`}>My Campaign</Link>
    </NavItem>
  );
}

// RENDERS UserAuthNav ITEM WITH LOGIN / LOGOUT BASED ON AUTH STATUS
function UserAuthNav(props) {
  // checks if user is not currently authed with google or facebook
  if (props.auth && (!props.auth.googleID && !props.auth.facebookID)) {
    return (
      // if not logged in > show sign in options
      <NavDropdown id="tools-dropdown" eventKey={5} title="Login">
        <MenuItem eventKey={5.1} href="/auth/facebook">
          Sign in With Facebook
        </MenuItem>
        <MenuItem eventKey={5.2} href="/auth/google">
          Sign in With Google
        </MenuItem>
      </NavDropdown>
    );
  }
  const { auth: { name } } = props;
  const firstName = name.substr(0, name.indexOf(' '));
  const logOutUser = props.logOutUser;
  // if logged in > show sign out options
  return (
    <NavItem eventKey={5} onClick={logOutUser}>
      Sign Out, {firstName}
    </NavItem>
  );
}

class NavBar extends React.Component {
  componentWillReceiveProps = nextProps => {
    if (this.props.auth._id !== nextProps.auth._id) {
      this.props.fetchUserSignatures(nextProps.auth._id);
    }
  };

  render() {
    // used "!!" to cast variable to boolean. Used to avoid the behavior of undefined in
    // conditional logic. In brief !undefined = true > !true = false
    const userIsLoggedIn =
      this.props.auth && (!!this.props.auth.googleID || !!this.props.auth.facebookID);
    const userHasSignedCampaign = userIsLoggedIn && this.props.userSignatures._campaignID;

    let homeText;
    this.props.location.pathname === '/' ? (homeText = 'RE:IMAGINE DENVER') : (homeText = 'HOME');
    return (
      <Navbar bsStyle="remove-default" collapseOnSelect fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">{homeText}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1}>
              <Link to="/denver-learn-more">Why</Link>
            </NavItem>
            <NavDropdown id="tools-dropdown" eventKey={2} title="Tools">
              <MenuItem eventKey={2.1}>
                <Link to="/manager-resources">Property Manager Resources</Link>
              </MenuItem>
              <MenuItem eventKey={2.2}>
                <Link to="/tips-for-requesting">Tips for Requesting</Link>
              </MenuItem>
            </NavDropdown>
            <NavItem eventKey={3}>
              <Link to="/who-are-we">Who Are We</Link>
            </NavItem>
            {/*  RENDERS MyCampaignNavItem BASED ON AUTH STATUS */}
            {userHasSignedCampaign && (
              <MyCampaignNavItem campaignId={this.props.userSignatures._campaignID} />
            )}
            {/* UserAuthNav (Login/Logout) */}
            <UserAuthNav auth={this.props.auth} logOutUser={this.props.logSignerOut} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

MyCampaignNavItem.propTypes = {
  campaignId: PropTypes.string.isRequired
};

UserAuthNav.propTypes = {
  logOutUser: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    name: PropTypes.string,
    googleID: PropTypes.string,
    facebookID: PropTypes.string
  }).isRequired
};

NavBar.propTypes = {
  logSignerOut: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    googleID: PropTypes.string,
    facebookID: PropTypes.string
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  userSignatures: PropTypes.shape({
    _campaignID: PropTypes.string
  }).isRequired,
  fetchUserSignatures: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  userSignatures: {
    ...state.signature.userSignatures
  }
});

export default connect(mapStateToProps, {
  logSignerOut,
  fetchUserSignatures
})(NavBar);
