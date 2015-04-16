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
        if(evnt.payload.commits && evnt.payload.commits.length) {
          return (
            <ListGroupItem>
              <a href={this.getActorUrl()}>{evnt.actor.login}</a>
              &nbsp;pushed&nbsp;
              <a href={this.getCommitUrl()}>{evnt.payload.commits[0].message}</a>
            </ListGroupItem>
          );
        }
        else {
          return (
            <ListGroupItem>
              <a href={this.getActorUrl()}>{evnt.actor.login}</a>
              &nbsp;pushed something
            </ListGroupItem>
          );
        }

        break;

      default:
        return (
          <ListGroupItem>
            <a href={this.getActorUrl()}>{evnt.actor.login}</a>
            made &nbsp;{evnt.type}
          </ListGroupItem>
        );
        break;
    }
  }
});

module.exports = RepoEvent;
