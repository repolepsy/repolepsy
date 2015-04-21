const React = require('react');
const Repo = require('./Repo.jsx');
const Alert = require('react-bootstrap/lib/Alert');

function currentRepos(repo) {
  return !(repo._tooOld || repo._ignoredRepo);
}
function outdatedRepos(repo) {
  return repo._tooOld;
}

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
          <strong>Loading repos</strong>
        </Alert>
      );
    }

    return (
      <div>
        <div className='repo-grid'>
          {repos.filter(currentRepos).map(repo =>
              <div className='repo-grid-item' key={repo.id} style={repo._style}><Repo repo={repo} /></div>
          )}
        </div>

        <h3 className='subsection'>Outdated repos</h3>

        <div className='repo-grid'>
          {repos.filter(outdatedRepos).map(repo =>
              <div className='repo-grid-item' key={repo.id} style={repo._style}><Repo repo={repo} /></div>
          )}
        </div>
      </div>
    );
  }
});

module.exports = RepoList;
