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

  getCommentUrl() {
    let {evnt} = this.props;
    var str = evnt.payload.comment.url;
    //https://api.github.com/repos/Starcounter-Jack/JSON-Patch/issues/comments/91527097
    str = str.replace("https://api.github.com/repos", "https://github.com");
    return str;
  },

  getPullRequestUrl() {
    let {evnt} = this.props;
    var str = evnt.payload.pullRequest.url;
    //https://api.github.com/repos/Starcounter-Jack/JSON-Patch/pulls/70
    str = str.replace("https://api.github.com/repos", "https://github.com");
    return str;
  },

  getIssueUrl() {
    let {evnt} = this.props;
    var str = evnt.payload.issue.url;
    //https://api.github.com/repos/PuppetJs/templatebinding.org/issues/2
    str = str.replace("https://api.github.com/repos", "https://github.com");
    return str;
  },

  render() {
    let {evnt} = this.props;

    switch(evnt.type) {
      case "PushEvent":
        if(evnt.payload.commits && evnt.payload.commits.length) {
          return (
            <ListGroupItem>
              <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
              &nbsp;pushed&nbsp;
              <a href={this.getCommitUrl()}>{evnt.payload.commits[0].message}</a></div>
            </ListGroupItem>
          );
        }
        else {
          return (
            <ListGroupItem>
              <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
              &nbsp;pushed something</div>
            </ListGroupItem>
          );
        }
        break;

      case "IssueCommentEvent":
          return (
            <ListGroupItem>
              <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
              &nbsp;{evnt.payload.action} comment&nbsp;
              <a href={this.getCommentUrl()}>{evnt.payload.comment.body}</a></div>
            </ListGroupItem>
          );
        break;

      case "IssuesEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
            &nbsp;{evnt.payload.action} issue&nbsp;
            <a href={this.getIssueUrl()}>{evnt.payload.issue.title}</a></div>
          </ListGroupItem>
        );
        break;

      case "PullRequestEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
            &nbsp;{evnt.payload.action} PR&nbsp;
            <a href={this.getPullRequestUrl()}>{evnt.payload.pullRequest.title}</a></div>
          </ListGroupItem>
        );
        break;

      case "CreateEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
            &nbsp;created {evnt.payload.refType} <strong>{evnt.payload.ref}</strong></div>
          </ListGroupItem>
        );
        break;

      case "DeleteEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
            &nbsp;deleted {evnt.payload.refType} <strong>{evnt.payload.ref}</strong></div>
          </ListGroupItem>
        );
        break;

      case "ReleaseEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
            &nbsp;{evnt.payload.action} release {evnt.payload.release.tagName}</div>
          </ListGroupItem>
        );
        break;

      case "WatchEvent":
      case "ForkEvent":
        //ignore
        return false;
        break;

      default:
        return (
          <ListGroupItem>
            <div className="ellipsis"><a href={this.getActorUrl()}>{evnt.actor.login}</a>
            &nbsp;made {evnt.type}</div>
          </ListGroupItem>
        );
        break;
    }
  }
});

module.exports = RepoEvent;
