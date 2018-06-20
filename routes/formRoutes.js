const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Form = mongoose.model('Form');

module.exports = app => {
  // GET a form with a particular id
  app.get('/api/forms/:id', requireLogin, async (req, res) => {
    try {
      const form = await Form.findOne({ submittedBy: req.user.id, _id: req.params.id });
      res.send(form);
    } catch(e) {
      console.log(e);
      res.status(400).send('unable to fetch form');
    }
  });

  // GET all forms that user has access to
  app.get('/api/forms', requireLogin, async (req, res) => {
    try {
      const forms = await Form.find({ submittedBy: req.user.id }, '_id type formDate projectId')
        .populate('projectId', 'title')
        // .cache({ key: req.user.id });
        // TODO: fix cache
      res.send(forms);
    } catch(e) {
      console.log(e);
      res.status(400).send('unable to fetch forms');
    }
  });

  // POST submit a new form
  app.post('/api/forms', requireLogin, cleanCache, async (req, res) => {
    const { type, formDate, numberOfWorkers, numberOfUnitsOfEquipment, notes, imageUrls, projectId, formTypeId } = req.body;
    const form = new Form({
      formTypeId,
      type, 
      formDate,
      numberOfWorkers,
      numberOfUnitsOfEquipment,
      notes,
      imageUrls,
      projectId,
      submittedBy: req.user.id
    });
    try {
      await form.save();
      res.send(form);
    } catch (err) {
      console.log(err);
      res.status(400).send('unable to create form');
    }
  });

  // PUT update details of a particular form
  app.put('/api/forms/:id', requireLogin, cleanCache, async (req, res) => {
    const { numberOfWorkers, numberOfUnitsOfEquipment, notes, formDate, projectId } = req.body;
    try {
      const updatedForm = await Form.findByIdAndUpdate(req.params.id, {
        numberOfWorkers,
        numberOfUnitsOfEquipment,
        notes,
        formDate,
        projectId
      });
      res.send(updatedForm);
    } catch (err) {
      console.log(err);
      res.status(400).send('Unable to update form');
    }
  });

};
