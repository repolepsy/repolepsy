const React = require('react');
const Repo = require('./Repo.jsx');
const Alert = require('react-bootstrap/lib/Alert');

function sortByName(a, b) {
  var aname = (a.name || a.login).toLowerCase();
  var bname = (b.name || b.login).toLowerCase();
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
    return !this.outdatedReposFilter(repo) && !this.ignoredReposFilter(repo) && !this.ignoredOrgsFilter(repo.owner);
  },

  outdatedReposFilter(repo) {
    return repo._tooOld && !this.ignoredReposFilter(repo) && !this.ignoredOrgsFilter(repo.owner);
  },

  ignoredReposFilter(repo) {
    let {ignoredRepos} = this.props;
    return (ignoredRepos.indexOf(repo.id) > -1);
  },

  ignoredOrgsFilter(org) {
    let {ignoredOrgs} = this.props;
    return (ignoredOrgs.indexOf(org.id) > -1);
  },

  render() {
    let {repos, orgs} = this.props;

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

        <h3 className='subsection'>Ignored repos &amp; orgs</h3>

        <div className='repo-grid'>
          {repos.filter(this.ignoredReposFilter).concat(orgs.filter(this.ignoredOrgsFilter)).sort(sortByName).map(repo =>
              <div className='repo-grid-item' key={repo.id}><Repo repo={repo} empty /></div>
          )}
        </div>
      </div>
    );
  }
});

module.exports = RepoList;
