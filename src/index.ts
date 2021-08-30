import joplin from 'api';
import { SettingItemType, ToolbarButtonLocation } from 'api/types';
const MetaWeblog = require('metaweblog-api');
const fs = require('fs');
const plantumlEncoder = require('plantuml-encoder')


async function uploadToCnblog(url: string, appid: string, username: string, passwd: string, isPublish: boolean) {
	const metaWeblog = new MetaWeblog(url);

	var blogInfos = await metaWeblog.getUsersBlogs(appid, username, passwd);
	var blogid = blogInfos[0].blogid;

	const note = await joplin.workspace.selectedNote();
	const resources = await joplin.data.get(['notes', note.id, 'resources']);

	var noteUpload = note.body;

	// replace all image path
	if (resources.items) {
		for (var item in resources.items) {
			var id = resources.items[item].id;
			var imageData = await joplin.data.get(['resources', id, 'file']);
			var media = {
				name: imageData.attachmentFilename,
				type: imageData.contentType,
				bits: new Buffer(imageData.body, 'binary')
			};
			// upload image to cnblog
			var urlData = await metaWeblog.newMediaObject(blogid, username, passwd, media);
			noteUpload = noteUpload.replace(new RegExp('\:\/' + id, 'g'), urlData.url);
		}
	}

	// replace all plantuml
	var uml_text = noteUpload.match(/```plantuml([\s\S]*?)```/g);
	if (uml_text != null) {
		for (var i in uml_text) {
			var plant_uml = uml_text[i].replace("```plantuml", "").replace("```", "");
			var encoded_uml = plantumlEncoder.encode(plant_uml);
			var encode_url = 'http://www.plantuml.com/plantuml/svg/' + encoded_uml;
			noteUpload = noteUpload.replace(uml_text[i], '![](' + encode_url + ')');
		}
	}

	var post = {
		title: note.title,
		description: noteUpload,
		categories: ["[Markdown]"]
	};

	//upload note to cnblog
	var newPostId = await metaWeblog.newPost(blogid, username, passwd, post, isPublish);
	console.log(newPostId)
	return newPostId;
}

joplin.plugins.register({
	onStart: async function() {
		await joplin.settings.registerSection('cnblogConfig', {
			label: 'cnblog',
			iconName: 'fas fa-arrow-circle-up',
		});

		await joplin.settings.registerSettings({
			'isPublishBlog': {
				value: false,
				type: SettingItemType.Bool,
				section: 'cnblogConfig',
				public: true,
				label: 'Enable publish',
			},

			'cnblogUrl': {
				value: '',
				type: SettingItemType.String,
				section: 'cnblogConfig',
				public: true,
				label: 'cnblog metaweblog url',
				description: 'copy from cnblog settings',
			},

			'cnblogAppid': {
				value: '',
				type: SettingItemType.String,
				section: 'cnblogConfig',
				public: true,
				label: 'cnblog appid',
				description: 'Usually at the end of the MetaWeblog url'
			},

			'cnblogUsername': {
				value: '',
				type: SettingItemType.String,
				section: 'cnblogConfig',
				public: true,
				label: 'cnblog username',
			},

			'cnblogPasswd': {
				value: '',
				type: SettingItemType.String,
				section: 'cnblogConfig',
				public: true,
				secure: true,
				label: 'cnblog password',
			},
		});

		await joplin.commands.register({
			name: 'uploadblog',
			label: 'upload to cnblog',
			iconName: 'fas fa-arrow-circle-up',
			execute: async () => {
				const url = await joplin.settings.value('cnblogUrl');
				const appid = await joplin.settings.value('cnblogAppid');
				const username = await joplin.settings.value('cnblogUsername');
				const passwd = await joplin.settings.value('cnblogPasswd');
				const isPublish = await joplin.settings.value('isPublishBlog');

				const dialogs = joplin.views.dialogs;
				var res = await dialogs.showMessageBox("upload to cnblog?");
				if (res == 0) {
					var postId = await uploadToCnblog(url, appid, username, passwd, isPublish);
					const handle = await dialogs.create('resultDialog');
					if (postId) {
						await dialogs.showMessageBox("Congratulations, upload succeeded! PostId: " + postId);
					}
				}
			},
		});

		await joplin.views.toolbarButtons.create('uploadToCnblogButton', 'uploadblog', ToolbarButtonLocation.NoteToolbar);
	},
});
