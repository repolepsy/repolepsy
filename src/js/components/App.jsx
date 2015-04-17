const React = require('react');
const RepoStore = require('../stores/RepoStore');
const TodoStore = require('../stores/TodoStore');
const ActionCreator = require('../actions/TodoActionCreators');
const Button = require('react-bootstrap/lib/Button');
const Jumbotron = require('react-bootstrap/lib/Jumbotron');
const TaskList = require('./TaskList.jsx');
const RepoList = require('./RepoList.jsx');
const RepoError = require('./RepoError.jsx');

let App = React.createClass({

  getInitialState() {
    var data = {
      RepoStore: {
        token: "",
        repos: [],
        err: null
      },
      tasks: []
    };
    return data;
  },

  _onChange() {
    this.setState({
      RepoStore: RepoStore.getAll(),
      tasks: TodoStore.getAll()
    });
  },

  componentDidMount() {
    TodoStore.addChangeListener(this._onChange);
    RepoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    TodoStore.removeChangeListener(this._onChange);
    RepoStore.removeChangeListener(this._onChange);
  },

  handleAddNewClick(e) {
    let title = prompt('Enter task title:');
    if (title) {
      ActionCreator.addItem(title);
    }
  },

  handleClearListClick(e) {
    ActionCreator.clearList();
  },

  render() {
    let {tasks, RepoStore} = this.state;

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
          <p>Displaying recent events in all your repos</p>
        </Jumbotron>

        <RepoList repos={RepoStore.repos}/>
      </div>
    );
  }

});

module.exports = App;
