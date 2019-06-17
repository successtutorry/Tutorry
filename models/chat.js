const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  //user: {type: Schema.Types.ObjectId, ref: 'User'},

	message: String,
	studentemail: String,
	tutoremail: String,
	sendby: String,
	sendbyemail: String

}, {

	timestamps: { // this will give us the detail when the form was send.
		createdAt: 'createdAt',
	}
});


const chatForm = mongoose.model('chat', chatSchema);
module.exports = chatForm;
