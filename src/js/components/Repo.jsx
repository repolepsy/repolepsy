const React = require('react');
const Panel = require('react-bootstrap/lib/Panel');
const ListGroup = require('react-bootstrap/lib/ListGroup');
const ListGroupItem = require('react-bootstrap/lib/ListGroupItem');

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

    return (
      <Panel header={this.renderTitle()}>
        Aha 

        <ListGroup fill>
          {repo._events.map(evnt =>
            <ListGroupItem href='#link1'>{evnt.type}</ListGroupItem>
          )}
        </ListGroup>
      </Panel>
    );
  }
});

module.exports = Repo;
