const React = require('react');
const ActionCreator = require('../actions/TodoActionCreators');
const ListGroupItem = require('react-bootstrap/lib/ListGroupItem');
const Input = require('react-bootstrap/lib/Input');

let Task = React.createClass({
  getDefaultProps() {
    return {
      task: {
        title: '',
        completed: false
      }
    };
  },

  handleToggle(task) {
    if (this.refs.checkbox.getChecked()) {
      ActionCreator.completeTask(task);
    }
    else {
      ActionCreator.incompleteTask(task);
    }
  },

  render() {
    let {task} = this.props;
    return (
      <ListGroupItem>
        <Input type="checkbox" ref="checkbox" checked={task.completed}
          onChange={this.handleToggle.bind(this, task)} label={task.title} />
      </ListGroupItem>
    );
  }
});

module.exports = Task;
