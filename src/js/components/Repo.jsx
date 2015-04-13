const React = require('react');
const Panel = require('react-bootstrap/lib/Panel');

let Repo = React.createClass({
  getInitialState() {
    return {
      repo: {
        name: ''
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
    return (
      <Panel header={this.renderTitle()}>
        Basic panel example
      </Panel>
    );
  }
});

module.exports = Repo;
