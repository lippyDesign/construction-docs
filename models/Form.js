const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('Form', new Schema({
  type: { type: String, required: true },
  formDate: { type: Date, required: true },
  numberOfWorkers: Number,
  numberOfUnitsOfEquipment: Number,
  notes: String,
  imageUrls: [String],
  createdAt: { type: Date, default: Date.now },
  formTypeId: { type: String, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
}));