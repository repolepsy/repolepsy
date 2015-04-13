const React = require('react');
const RepoStore = require('../stores/RepoStore');
const TodoStore = require('../stores/TodoStore');
const ActionCreator = require('../actions/TodoActionCreators');
const Button = require('react-bootstrap/lib/Button');
const Jumbotron = require('react-bootstrap/lib/Jumbotron');
const TaskList = require('./TaskList.jsx');
const RepoList = require('./RepoList.jsx');

let App = React.createClass({

  getInitialState() {
    var data = {
      repos: [],
      tasks: []
    }
    return data;
  },

  _onChange() {
    this.setState({
      repos: RepoStore.getAll(),
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
    let {tasks, repos} = this.state;

    return (
      <div className="container">
        <Jumbotron>
          <h1>Learning Flux</h1>
          <p>
            Below is a list of tasks you can implement to better grasp the patterns behind Flux.<br />
            Most features are left unimplemented with clues to guide you on the learning process.
          </p>
        </Jumbotron>

        <RepoList repos={repos}/>

        <TaskList tasks={tasks} />

        <Button onClick={this.handleAddNewClick} bsStyle="primary">Add New</Button>
        <Button onClick={this.handleClearListClick} bsStyle="danger">Clear List</Button>
      </div>
    );
  }

});

module.exports = App;
