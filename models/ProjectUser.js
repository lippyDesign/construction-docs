const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('ProjectUser', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  formTypesToMustSubmit: [{ type: Schema.Types.ObjectId, ref: 'FormType' }],
  formTypesToMustReview: [{ type: Schema.Types.ObjectId, ref: 'FormType' }]
}));