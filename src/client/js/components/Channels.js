import React, { Component, PropTypes } from 'react';
import ChannelListItem from './ChannelListItem';
import { Modal, Glyphicon } from 'react-bootstrap';
const socket = io();
import * as UserAPIUtils from '../utils/UserAPIUtils';

export default class Channels extends Component {

  static propTypes = {
    channels: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      modal: false,
      channelName: ''
    };
  }

  handleChangeChannel(channel) {
    this.props.onClick(channel);
  }

  openModal() {
    event.preventDefault();
    this.setState({modal: true});
  }

  closeModal() {
    event.preventDefault();
    this.setState({modal: false});
  }

  handleModalChange(event) {
    this.setState({channelName: event.target.value});
  }

  handleModalSubmit(event) {
    event.preventDefault();

    if (this.state.channelName.length < 1) {
      this.refs.channelName.focus();
    }
    if (this.state.channelName.length) {
      const newChannel = {
        name: this.state.channelName.trim(),
        id: Date.now()
      };

      UserAPIUtils.createChannel(newChannel);
      this.props.actions.addChannel(newChannel);
      socket.emit('new channel', newChannel);
      this.setState({channelName: ''});
      this.closeModal();
    }
  }

  render() {
    const { channels, actions } = this.props;
    const filteredChannels = channels;

    const glyphStyle = {'background': 'Transparent', 'backgroundRepeat': 'noRepeat', 'border': 'none', 'cursor': 'pointer', 'overflow': 'hidden', 'outline': 'none'};

    const newChannelModal = (
      <div>
        <Modal key={1} show={this.state.modal} onHide={::this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Channel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={::this.handleModalSubmit}>
          <input
            className="channel-composer"
            name="channelName"
            autoFocus="true"
            placeholder="Enter the channel name"
            value={this.state.channelName}
            onChange={::this.handleModalChange}
            onSubmit={::this.handleModalSubmit}
          />
          </form>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={::this.closeModal}>Cancel</button>
            <button onSubmit={::this.handleModalSubmit} type="submit">
              Create Channel
            </button>
          </Modal.Footer>
          </Modal>
      </div>
    );

    return (
      <section>
        <div className="channel-header">
          <strong style={{'marginRight': '10rem'}}>Channels</strong>
          <button onClick={::this.openModal} style={glyphStyle}>
            <Glyphicon glyph="plus" />
          </button>
        </div>
          {newChannelModal}
        <div>
          <ul className="channel-list">
            {filteredChannels.map(channel =>
              <ChannelListItem channel={channel} key={channel.id} {...actions} onShow={::this.handleChangeChannel} />
              )}
          </ul>
          <a onClick={::this.openModal} style={{'cursor': 'pointer', 'color': '#85BBE9'}}>
            Create a channel
          </a>
        </div>
      </section>
    );
  }
}
