const React = require('react');
const Repo = require('./Repo.jsx');
const Alert = require('react-bootstrap/lib/Alert');

function sortByName(a, b) {
  var aname = a.name.toLowerCase();
  var bname = b.name.toLowerCase();
  if(aname < bname) return -1;
  if(aname > bname) return 1;
  return 0;
}

let RepoList = React.createClass({
  getInitialState() {
    return {
      repos: []
    };
  },

  componentDidMount() {
  },

  currentReposFilter(repo) {
    return !this.outdatedReposFilter(repo) && !this.ignoredReposFilter(repo);
  },

  outdatedReposFilter(repo) {
    return repo._tooOld && !this.ignoredReposFilter(repo);
  },

  ignoredReposFilter(repo) {
    let {ignoredRepos} = this.props;
    return (ignoredRepos.indexOf(repo.id) > -1);
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
          {repos.filter(this.currentReposFilter).map(repo =>
              <div className='repo-grid-item' key={repo.id} style={repo._style}><Repo repo={repo} /></div>
          )}
        </div>

        <h3 className='subsection'>Outdated repos</h3>

        <div className='repo-grid'>
          {repos.filter(this.outdatedReposFilter).sort(sortByName).map(repo =>
              <div className='repo-grid-item' key={repo.id}><Repo repo={repo} empty /></div>
          )}
        </div>

        <h3 className='subsection'>Ignored repos</h3>

        <div className='repo-grid'>
          {repos.filter(this.ignoredReposFilter).sort(sortByName).map(repo =>
              <div className='repo-grid-item' key={repo.id}><Repo repo={repo} empty /></div>
          )}
        </div>
      </div>
    );
  }
});

module.exports = RepoList;
