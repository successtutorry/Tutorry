const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  //user: {type: Schema.Types.ObjectId, ref: 'User'},
	name: String,
	email: String,
  phone: String,
  subject: String,
	message: String,

}, {

	timestamps: { // this will give us the detail when the form was send.

		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});


const messageForm = mongoose.model('message', messageSchema);
module.exports = messageForm;
