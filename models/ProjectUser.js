const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('ProjectUser', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  roles: [{ type: String, required: true }],
  formTypesMustSubmit: [{ type: Schema.Types.ObjectId, ref: 'FormType' }],
  formTypesMustReview: [{ type: Schema.Types.ObjectId, ref: 'FormType' }],
  datePutOnTheProject: { type: Date, default: Date.now },
  dateTookOffTheProject: { type: Date }
}));