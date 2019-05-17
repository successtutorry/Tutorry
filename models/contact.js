// this is the model file, this file contains details of the schema , in this case it is user contact schema
// We use mongoose for mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// this is the contact Schema
//these values will be inserted in the table or collection in case of mongodb
const contactSchema = new Schema({
	 email: String,
   contact: String,
   textarea: String
}, {
	   timestamps: { // this will give us the detail when the account is created
    createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

// exporting the user so that it can be used wherever required
const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;
