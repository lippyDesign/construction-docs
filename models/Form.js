const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('Form', new Schema({
  formDate: { type: Date, required: true },
  numberOfWorkers: Number,
  numberOfUnitsOfEquipment: Number,
  notes: String,
  imageUrls: [String],
  dueOn: { type: Date, required: true },
  submittedOn: { type: Date, default: Date.now },
  modifiedOn: [{ type: Date }],
  formTypeId: { type: String, ref: 'FormType', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
}));