'use strict';

import React, { PropTypes, Component } from 'react';

import { connect } from 'react-redux';

import { socket } from '../services/io';

import {
    joinConversation,
    receiveConversationMessage,
    sendConversationMessage
} from '../actions';

import Loader from '../components/loader';
import Header from '../components/header';
import Messages from '../components/messages';
import Entry from '../components/entry';

export default class Conversation extends Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
    };
    componentWillMount() {

        const { dispatch } = this.props;

        socket.on('messages:new', function(message) {
            dispatch(receiveConversationMessage(message));
        });

        dispatch(joinConversation(this.props.params.id));

    };
    sendMessage(message) {
        this.props.dispatch(sendConversationMessage({
            room: this.props.params.id,
            ...message
        }));
    };
    render() {
        if (this.props.isFetching) {
            return (
                <div className="lcb-conversation">
                    <Loader className="lcb-conversation-loader" fadeIn />
                </div>
            );
        }
        return (
            <div className="lcb-conversation">
                <Header
                    title={`#${this.props.slug}`}
                    description={this.props.description} />
                <Messages
                    isFetching={this.props.isFetchingMessages}
                    messages={this.props.messages} />
                <Entry
                    isSendingMessage={this.props.isSendingMessage}
                    sendMessage={this.sendMessage} />
            </div>
        );
    };
};

Conversation.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isFetchingMessages: PropTypes.bool.isRequired,
    isSendingMessage: PropTypes.bool.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    messages: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
    return state.conversation;
};

export default connect(mapStateToProps)(Conversation);