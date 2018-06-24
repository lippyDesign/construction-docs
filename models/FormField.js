const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('FormField', new Schema({
  title: { type: String, required: true },
  mustBeFilledOut: { type: Boolean, default: false },
  inputType: { type: String, default: 'text' },
  multiline: { type: Boolean, default: false }
}));