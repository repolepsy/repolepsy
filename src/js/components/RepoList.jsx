const React = require('react');
const Repo = require('./Repo.jsx');
const Alert = require('react-bootstrap/lib/Alert');

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
      <div className='repo-grid'>
        {repos.map(repo =>
          <div className='repo-grid-item' key={repo.id}><Repo repo={repo} /></div>
        )}
      </div>
    );
  }
});

module.exports = RepoList;
