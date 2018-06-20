const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('FormType', new Schema({
  title: { type: String, required: true },
  shortName: { type: String },
  infoToBeCollected: [{ type: Schema.Types.ObjectId, ref: 'FormField' }]
}));