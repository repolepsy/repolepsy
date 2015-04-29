const React = require('react');
const Button = require('react-bootstrap/lib/Button');
const Modal = require('react-bootstrap/lib/Modal');
const Input = require('react-bootstrap/lib/Input');
const ActionCreator = require('../actions/RepoActionCreators');

let RepoError = React.createClass({
  getInitialState() {
    return {
      token: this.props.repostore.token
    };
  },

  componentWillReceiveProps() {
    //if(this.props.repostore.token) {
    //  this.state.token = this.props.repostore.token;
    //}
  },

  handleHide() {

  },

  handleChange() {
    var token = this.refs.input.getValue();

    this.setState({
      token: token
    });
    if(token.length >= 40) {
      ActionCreator.setToken(token);
    }
  },

  render() {

    return (
      <div className='static-modal'>
        <Modal title='GitHub token needed'
          bsStyle='primary'
          backdrop={false}
          animation={false}
          onRequestHide={this.handleHide}>
          <div className='modal-body'>
            <p>
              To display your GitHub repositiories you need to generate a
              new <a target="_blank" href="https://github.com/settings/tokens">Personal Access Token</a> and provide it below.
            </p>

            <p>Permissions needed: <strong>repo</strong>, <strong>user</strong></p>

            <Input
              type='text'
              value={this.state.token}
              placeholder='Paste token here'
              hasFeedback
              ref='input'
              groupClassName='group-class'
              wrapperClassName='wrapper-class'
              labelClassName='label-class'
              onChange={this.handleChange} />

          </div>
          <div className='modal-footer'>
            <Button>Close</Button>
          </div>
        </Modal>
      </div>
    );
  }
});

module.exports = RepoError;
