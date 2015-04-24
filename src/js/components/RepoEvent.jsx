const React = require('react');
const ReactEmoji = require('react-emoji');
const ListGroupItem = require('react-bootstrap/lib/ListGroupItem');

let RepoEvent = React.createClass({
  getInitialState() {
    return {};
  },

  mixins: [
    ReactEmoji
  ],

  componentDidMount() {
  },

  getBranchName(str) {
    str = str.replace("refs/heads/", "");
    return str;
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
    str = str.replace("comments/", evnt.payload.issue.number + "#issuecomment-");
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

  getWikiUrl() {
    let {evnt} = this.props;
    return this.getRepoUrl() + "/wiki/" + evnt.payload.pages[0].pageName;
  },

  getRepoUrl() {
    let {repo} = this.props;
    return "https://github.com/" + repo.fullName;
  },

  getAvatar(actor) {
    let url = "https://avatars2.githubusercontent.com/u/" + actor.id;
    return <a title={actor.login} href={this.getActorUrl()}><img className="avatar" src={url}></img></a>;
  },

  escapeChars(txt) {
    return txt.replace(/\:\//, ":\u202F/");
  },

  render() {
    let {evnt} = this.props;
    let avatar = this.getAvatar(evnt.actor);

    switch(evnt.type) {
      case "PushEvent":
        if(evnt.payload.commits && evnt.payload.commits.length) {
          return (
            <ListGroupItem>
              <div className="ellipsis">{avatar}
              &nbsp;pushed to <strong>{this.getBranchName(evnt.payload.ref)}</strong>:&nbsp;
              <a href={this.getCommitUrl()}>{evnt.payload.commits[0].message}</a></div>
            </ListGroupItem>
          );
        }
        else {
          return (
            <ListGroupItem>
              <div className="ellipsis">{avatar}
              &nbsp;pushed something</div>
            </ListGroupItem>
          );
        }
        break;

      case "IssueCommentEvent":
          return (
            <ListGroupItem>
              <div className="ellipsis">{avatar}
              &nbsp;{evnt.payload.action} comment&nbsp;
              <a href={this.getCommentUrl()}>{this.emojify(this.escapeChars(evnt.payload.comment.body), {"emojiType": "emojione"})}</a></div>
            </ListGroupItem>
          );
        break;

      case "IssuesEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;{evnt.payload.action} issue&nbsp;
            <a href={this.getIssueUrl()}>{evnt.payload.issue.title}</a></div>
          </ListGroupItem>
        );
        break;

      case "PullRequestEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;{evnt.payload.action} PR&nbsp;
            <a href={this.getPullRequestUrl()}>{evnt.payload.pullRequest.title}</a></div>
          </ListGroupItem>
        );
        break;

      case "CreateEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;created {evnt.payload.refType} <strong>{evnt.payload.ref}</strong></div>
          </ListGroupItem>
        );
        break;

      case "DeleteEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;deleted {evnt.payload.refType} <strong>{evnt.payload.ref}</strong></div>
          </ListGroupItem>
        );
        break;

      case "ReleaseEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;{evnt.payload.action} release {evnt.payload.release.tagName}</div>
          </ListGroupItem>
        );
        break;

      case "GollumEvent":
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;{evnt.payload.pages[0].action} wiki&nbsp;
              <a href={this.getWikiUrl()}>{evnt.payload.pages[0].title}</a></div>
          </ListGroupItem>
        );
        break;

      default:
        return (
          <ListGroupItem>
            <div className="ellipsis">{avatar}
            &nbsp;made {evnt.type}</div>
          </ListGroupItem>
        );
        break;
    }
  }
});

module.exports = RepoEvent;
