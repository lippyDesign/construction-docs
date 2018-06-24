// This file is meant to inject some form fields and form types if they are not in db yet
const mongoose = require('mongoose');

const keys = require('../config/keys');

const FormField = mongoose.model('FormField');
const FormType = mongoose.model('FormType');

const data = [
  {
    id: 'p-t-p',
    title: 'Daily Planning',
    shortName: 'PTP',
    infoToBeCollected: [
      { title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },
      { title: 'Number of workers', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Number of units of equipment', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Notes', mustBeFilledOut: false, inputType:'text', multiline: true }
    ]
  },
  { id: 's-d-r', title: 'Superintendent Daily Report', shortName: 'SDR', infoToBeCollected: [{ title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },{ title: 'Number of workers', mustBeFilledOut: true, inputType:'text' }, { title: 'Number of units of equipment', mustBeFilledOut: true, inputType: 'text' }, { title: 'Notes', mustBeFilledOut: false, inputType: 'text', multiline: true }]},
  { id: 'safety-inspection', title: 'Safety Inspection', shortName: '', infoToBeCollected: [{ title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },{ title: 'Notes', mustBeFilledOut: false, inputType:'text', multiline: true }]},
  { id: 'tools-and-equipment-inspection', title: 'Tools and Equipment Inspection', shortName: '', infoToBeCollected: [{ title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },{ title: 'Notes', mustBeFilledOut: false, inputType:'text', multiline: true }]},
]

module.exports = () => {
  const conn = mongoose.createConnection(keys.mongoURI);
  conn.on('open', function () {
    conn.db.listCollections({ name: 'formfields' }).toArray(function (err, collectionNames) {
      if (err) {
        console.log(err);
        return;
      }

      if (collectionNames.length > 0 ) return;
      
      const f1 = new FormField({
        title: 'Date on the form',
        mustBeFilledOut: true,
        inputType: 'date',
        multiline: false
      });

      const f2 = new FormField({
        title: 'Number of workers',
        mustBeFilledOut: true,
        inputType: 'text',
        multiline: false
      });

      const f3 = new FormField({
        title: 'Number of units of equipment',
        mustBeFilledOut: true,
        inputType: 'text',
        multiline: false
      });

      const f4 = new FormField({
        title: 'Notes',
        mustBeFilledOut: false,
        inputType: 'text',
        multiline: true
      });

      // save form fields
      Promise.all([f1, f2, f3, f4].map(obj => obj.save()))
        .then(savedFormFields => {
          // save forms
          Promise.all(data.map(f => {
            return new FormType({
              title: f.title,
              shortName: f.shortName || '',
              infoToBeCollected: f.infoToBeCollected.map(ic => {
                const savedField = savedFormFields.find(s => s.title === ic.title);
                return savedField._id
              })
            }).save()
          }))
        }).catch(function(err) {
          console.log(err);
        });
      
      conn.close();
    });
  });
}