const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('Form', new Schema({
  formDate: { type: Date },
  numberOfWorkers: Number,
  numberOfUnitsOfEquipment: Number,
  notes: String,
  imageUrls: [String],
  dueOn: { type: Date, required: true },
  submittedOn: { type: Date },
  modifiedOn: [{ type: Date }],
  formTypeId: { type: String, ref: 'FormType', required: true },
  shouldBeSubmittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
}));