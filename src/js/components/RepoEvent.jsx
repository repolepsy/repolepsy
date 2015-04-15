const React = require('react');
const ListGroupItem = require('react-bootstrap/lib/ListGroupItem');

let RepoEvent = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
  },

  getActorUrl() {
    let {evnt} = this.props;
    var str = evnt.actor.url;
    str = str.replace("https://api.github.com/users", "https://github.com");
    return str;
  },

  getCommitUrl() {
    let {evnt} = this.props;
    var str = evnt.payload.commits[0].url;
    str = str.replace("https://api.github.com/repos", "https://github.com");
    str = str.replace("/commits/", "/commit/");
    return str;
  },

  render() {
    let {evnt} = this.props;

    switch(evnt.type) {
      case "PushEvent":
        return (
          <ListGroupItem>
            <a href={this.getActorUrl()}>{evnt.payload.commits[0].author.name}</a>
            &nbsp;pushed&nbsp;
            <a href={this.getCommitUrl()}>{evnt.payload.commits[0].message}</a>
          </ListGroupItem>
        );
        break;

      default:
        return (
          <ListGroupItem href='#link1'>{evnt.type}</ListGroupItem>
        );
        break;
    }
  }
});

module.exports = RepoEvent;
