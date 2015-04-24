const React = require('react');
const RepoStore = require('../stores/RepoStore');
const IgnoredReposStore = require('../stores/IgnoredReposStore');
const IgnoredOrgsStore = require('../stores/IgnoredOrgsStore');
const ActionCreator = require('../actions/RepoActionCreators');
const Button = require('react-bootstrap/lib/Button');
const Jumbotron = require('react-bootstrap/lib/Jumbotron');
const TaskList = require('./TaskList.jsx');
const RepoList = require('./RepoList.jsx');
const RepoError = require('./RepoError.jsx');

let App = React.createClass({

  getInitialState() {
    var data = {
      refreshText: "5 minutes",
      RepoStore: RepoStore.getAll(),
      IgnoredReposStore: IgnoredReposStore.getAll(),
      IgnoredOrgsStore: IgnoredOrgsStore.getAll()
    };
    return data;
  },

  _onChange() {
    this.setState({
      RepoStore: RepoStore.getAll(),
      IgnoredReposStore: IgnoredReposStore.getAll(),
      IgnoredOrgsStore: IgnoredOrgsStore.getAll()
    });
  },

  componentDidMount() {
    RepoStore.addChangeListener(this._onChange);
    IgnoredReposStore.addChangeListener(this._onChange);
    IgnoredOrgsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    RepoStore.removeChangeListener(this._onChange);
    IgnoredReposStore.removeChangeListener(this._onChange);
    IgnoredOrgsStore.removeChangeListener(this._onChange);
  },

  handleRefreshClick(e) {
    ActionCreator.refreshRepos();
    e.preventDefault();
    e.target.blur();
  },

  handleRefreshOver(e) {
    this.setState({
      refreshText: "refresh now"
    });
  },

  handleRefreshOut(e) {
    this.setState({
      refreshText: "5 minutes"
    });
  },

  render() {
    let {RepoStore,IgnoredReposStore,IgnoredOrgsStore} = this.state;

    if(RepoStore.err) {
      if(RepoStore.err.message = "Bad credentials") {
        return (<RepoError repostore={RepoStore} />)
      }
      else {
        alert("Unknown GH error occured");
      }
    }

    return (
      <div className="container">
        <Jumbotron>
          <h1>Repolepsy</h1>
          <p>
            Recent changes in all your repos, refreshed every&nbsp;
            <a href="/" className="refresh-repos" onMouseEnter={this.handleRefreshOver} onMouseLeave={this.handleRefreshOut} onClick={this.handleRefreshClick}>
              {this.state.refreshText}
            </a>
          </p>
        </Jumbotron>

        <RepoList repos={RepoStore.repos} orgs={RepoStore.orgs} ignoredRepos={IgnoredReposStore.ignoredRepos} ignoredOrgs={IgnoredOrgsStore.ignoredOrgs}/>
      </div>
    );
  }

});

module.exports = App;
