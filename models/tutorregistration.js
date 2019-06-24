// this is the model file, this file contains details of the schema , in this case it is tutor registration schema
// We use mongoose for mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//these values will be inserted in the table or collection in case of mongodb
const tutorSchema = new Schema({
image:String,
firstname: String,
lastname: String,
email: String,
dob: String,
gender: String,
contact: String,
address1: String,
address2: String,
zipcode: String,
schoolname: String,
collegename: String,
degreecollegename: String,
postdegreecollegename: String,
schoolexp: String,
collegeexp: String,
instituteexp: String,
privateexp: String,
qualification: String,
experience: String,
homevisit: String,
demo: String,
rating:String,
boards: [{type: String}],
availablearea:  [{ type: String  }],
subjects:  [{ type: String  }],
time:  [{ type: String  }],
days:  [{ type: String  }],
class:  [{ type: String  }],
rateperhour:  [{ type: String  }],
typeofstudent:  [{ type: String  }],
languages:  [{ type: String  }]
}, {
	   timestamps: { // this will give us the detail when the account is created
    createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

// exporting the user so that it can be used wherever required
const tutor = mongoose.model('tutorregistration', tutorSchema);
module.exports = tutor;
