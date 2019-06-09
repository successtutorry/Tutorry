const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requirementSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
	location: String,
	class: String,
  message: String,
  student: String,
  tutor: String
}, {

	timestamps: { // this will give us the detail when the form was send.
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});


const requirementForm = mongoose.model('requirement', requirementSchema);
module.exports = requirementForm;
