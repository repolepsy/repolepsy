const React = require('react');
const Repo = require('./Repo.jsx');
const Alert = require('react-bootstrap/lib/Alert');
const Grid = require('react-bootstrap/lib/Grid');
const Row = require('react-bootstrap/lib/Row');
const Col = require('react-bootstrap/lib/Col');

let RepoList = React.createClass({
  getInitialState() {
    return {
      repos: []
    };
  },

  componentDidMount() {
  },

  render() {
    let {repos} = this.props;

    if (repos.length === 0) {
      return (
        <Alert bsStyle="warning">
          <strong>You have no repos</strong>
        </Alert>
      );
    }
    
    return (
      <Grid>
      <Row className='show-grid'>
        {repos.map(repo =>
          <Col md={3}><Repo repo={repo} /></Col>
        )}
      </Row>
      </Grid>
    );
  }
});

module.exports = RepoList;
