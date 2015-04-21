const React = require('react');
const Panel = require('react-bootstrap/lib/Panel');
const ListGroup = require('react-bootstrap/lib/ListGroup');
const DropdownButton = require('react-bootstrap/lib/DropdownButton');
const MenuItem = require('react-bootstrap/lib/MenuItem');
const RepoEvent = require('./RepoEvent.jsx');
const ActionCreator = require('../actions/RepoActionCreators');

let Repo = React.createClass({
  getInitialState() {
    return {
      repo: {
        name: '',
        _events: []
      }
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if(nextProps.repo && nextProps.repo._events && nextProps.repo._events[0] && nextProps.repo._events[0].createdAt) {
      if(this.props.repo && this.props.repo._events && this.props.repo._events[0] && this.props.repo._events[0].createdAt) {
        if(nextProps.repo._events[0].createdAt == this.props.repo._events[0].createdAt) {
          return false;
        }
      }
    }
    return true;
  },

  componentDidMount() {
  },

  url() {
    let {repo} = this.props;
    return "https://github.com/" + repo.fullName;
  },

  renderTitle() {
    let {repo} = this.props;

    var title = repo.name;
    if(repo._loading) {
      title += " (Loading...)";
    }

    /*return (<h3><a href={this.url()}>{title}</a>

      <DropdownButton title='' bsSize='xsmall' pullRight>
        <MenuItem onClick={this.ignoreRepo} eventKey='1'>Ignore {repo.fullName}</MenuItem>
        <MenuItem onClick={this.ignoreOrg} eventKey='2'>Ignore organization</MenuItem>
      </DropdownButton>

    </h3>)*/

    return <h3><a href={this.url()}>{title}</a></h3>;
  },

  ignoreRepo() {
    ActionCreator.ignoreRepo(this.props.repo);
    return false;
  },

  ignoreOrg() {
    ActionCreator.ignoreOrg(this.props.repo);
    return false;
  },

  render() {
    let {repo} = this.props;
    let title = this.renderTitle();

    if(repo._tooOld) {
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
