const React = require('react');
const Panel = require('react-bootstrap/lib/Panel');
const ListGroup = require('react-bootstrap/lib/ListGroup');
const RepoEvent = require('./RepoEvent.jsx');

let Repo = React.createClass({
  getInitialState() {
    return {
      repo: {
        name: '',
        _events: []
      }
    };
  },

  componentDidMount() {
  },

  url() {
    let {repo} = this.props;
    return "https://github.com/" + repo.fullName;
  },

  renderTitle() {
    let {repo} = this.props;
    return <h3><a href={this.url()}>{repo.name}</a></h3>
  },

  render() {
    let {repo} = this.props;

    if(repo._tooOld) {
      return (
        <Panel header={this.renderTitle()}>
          No recent activity
        </Panel>
      );
    }
    else {
      return (
        <Panel header={this.renderTitle()}>


          <ListGroup fill>
            {repo._events.map(evnt =>
                <RepoEvent evnt={evnt} key={evnt.id} />
            )}
          </ListGroup>
        </Panel>
      );
    }
  }
});

module.exports = Repo;
