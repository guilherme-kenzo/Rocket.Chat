RocketChat.MessageTypes.registerType({
	id: 'livechat_video_call',
	system: true,
	message: 'New_videocall_request'
});

RocketChat.actionLinks.register('createLivechatCall', function(/*message, params*/) {
	if (Meteor.isClient) {
		RocketChat.TabBar.setTemplate('videoFlexTab');

		// calling openFlex should set the width instead of having to do this.
		$('.flex-tab').css('max-width', '790px');

		RocketChat.TabBar.openFlex();
	}
});

RocketChat.actionLinks.register('denyLivechatCall', function(message/*, params*/) {
	if (Meteor.isServer) {
		const user = Meteor.user();

		RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('command', message.rid, 'endCall', user);
		RocketChat.Notifications.notifyRoom(message.rid, 'deleteMessage', { _id: message._id });

		const language = user.language || RocketChat.settings.get('language') || 'en';

		RocketChat.Livechat.closeRoom({
			user,
			room: RocketChat.models.Rooms.findOneById(message.rid),
			comment: TAPi18n.__('Videocall_declined', { lng: language })
		});
		Meteor.defer(() => {
			RocketChat.models.Messages.setHiddenById(message._id);
		});
	}
});
