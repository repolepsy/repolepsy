const React = require('react');
const Panel = require('react-bootstrap/lib/Panel');
const IgnoredReposStore = require('../stores/IgnoredReposStore');
const IgnoredOrgsStore = require('../stores/IgnoredOrgsStore');
const ListGroup = require('react-bootstrap/lib/ListGroup');
const DropdownButton = require('react-bootstrap/lib/DropdownButton');
const MenuItem = require('react-bootstrap/lib/MenuItem');
const RepoEvent = require('./RepoEvent.jsx');
const ActionCreator = require('../actions/RepoActionCreators');

let Repo = React.createClass({
  getInitialState() {
    return {
      lastUpdatedAt: "",
      lastLoading: undefined,
      repo: {
        name: '',
        _events: []
      }
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.state.lastUpdatedAt != nextProps.repo.updatedAt || this.state.lastLoading != nextProps.repo._loading);
  },

  componentDidUpdate() {
    this.setState({
      lastUpdatedAt: this.props.repo.updatedAt,
      lastLoading: this.props.repo._loading
    });
  },

  componentDidMount() {
  },

  url() {
    let {repo} = this.props;
    return "https://github.com/" + repo.fullName;
  },

  renderIgnoreRepoLabel(repo) {
    if(IgnoredReposStore.isIgnoredRepo(repo)) {
      return "Unignore " + repo.fullName;
    }
    else {
      return "Ignore "  + repo.fullName;
    }
  },

  renderIgnoreOrgLabel(org) {
    if(IgnoredOrgsStore.isIgnoredOrg(org)) {
      return "Unignore " + org.login;
    }
    else {
      return "Ignore "  + org.login;
    }
  },

  renderMenu() {
    let {repo} = this.props;
    if(!repo.owner) { //org, not repo!
      return (
        <DropdownButton title='' bsSize='xsmall' pullRight>
          <MenuItem onClick={this.toggleIgnoreOrg} eventKey='1'>{this.renderIgnoreOrgLabel(repo)}</MenuItem>
        </DropdownButton>
      );
    }
    else {
      return (
        <DropdownButton title='' bsSize='xsmall' pullRight>
          <MenuItem onClick={this.toggleIgnoreRepo} eventKey='1'>{this.renderIgnoreRepoLabel(repo)}</MenuItem>
          <MenuItem onClick={this.toggleIgnoreOrg} eventKey='1'>{this.renderIgnoreOrgLabel(repo.owner)}</MenuItem>
        </DropdownButton>
      );
    }


  },

  renderTitle() {
    let {repo} = this.props;

    var title = repo.name || repo.login;
    if(repo._loading) {
      title += " (Loading...)";
    }

    return (<h3><a href={this.url()}>{title}</a>
      {this.renderMenu()}
    </h3>);
  },

  toggleIgnoreRepo() {
    ActionCreator.toggleIgnoreRepo(this.props.repo);
    return false;
  },

  toggleIgnoreOrg() {
    ActionCreator.toggleIgnoreOrg(this.props.repo.owner ? this.props.repo.owner : this.props.repo);
    return false;
  },

  render() {
    let {repo, empty} = this.props;
    let title = this.renderTitle();

    if(empty) {
      return (
        <Panel header={title}>
          <ListGroup fill>
          </ListGroup>
        </Panel>
      );
    }
    else {
      return (
        <Panel header={title}>
          <ListGroup fill>
            {repo._events.map(evnt =>
                <RepoEvent repo={repo} evnt={evnt} key={evnt.id} />
            )}
          </ListGroup>
        </Panel>
      );
    }
  }
});

module.exports = Repo;
