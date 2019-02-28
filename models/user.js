// this is the model file, this file contains details of the schema , in this case it is user registration schema
// We use mongoose for mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// this is the user Schema
//these values will be inserted in the table or collection in case of mongodb
const userSchema = new Schema({
	email: String,
	username: String,
	password: String,
	secretToken: String,
	active: Boolean,
	usertype: String,
	profilecomplete: Boolean
}, {
	   timestamps: { // this will give us the detail when the account is created
    createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

// exporting the user so that it can be used wherever required
const User = mongoose.model('user', userSchema);
module.exports = User;
module.exports.hashPassword =  async(password) => {
	try {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
	} catch(error) {
    throw new Error('Hashing failed', error);
	}
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {

	try{
		console.log('comparing passwords');
    return await bcrypt.compare(inputPassword, hashedPassword );
  } catch(error){
      throw new Error('Comparing failed', error);
    }
};
