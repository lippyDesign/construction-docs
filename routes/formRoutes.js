const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Form = mongoose.model('Form');
const FormType = mongoose.model('FormType');
const ProjectUser = mongoose.model('ProjectUser');

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
      const forms = await Form.find({ submittedBy: req.user.id }, '_id formTypeId submittedOn projectId')
        .populate('projectId', 'title')
        .populate('formTypeId', 'title shortName')
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
    const { formDate, numberOfWorkers, numberOfUnitsOfEquipment, notes, imageUrls, projectId, formTypeId, formId } = req.body;
    if (formId) {
      try {
        const updatedForm = await Form.findByIdAndUpdate(formId, {
          numberOfWorkers,
          numberOfUnitsOfEquipment,
          notes,
          formDate,
          projectId,
          imageUrls,
          submittedOn: Date.now(),
          submittedBy: req.user.id
        });
        res.send(updatedForm);
      } catch (err) {
        console.log(err);
        res.status(400).send('Unable to update form');
      }
    } else {
      const form = new Form({
        dueOn: formDate,
        formTypeId,
        formDate,
        numberOfWorkers,
        numberOfUnitsOfEquipment,
        notes,
        imageUrls,
        projectId,
        submittedBy: req.user.id,
        submittedOn: Date.now()
      });
      try {
        await form.save();
        res.send(form);
      } catch (err) {
        console.log(err);
        res.status(400).send('unable to create form');
      }
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
        projectId,
        // submittedOn: Date.now(),
        // submittedBy: req.user.id
      });
      res.send(updatedForm);
    } catch (err) {
      console.log(err);
      res.status(400).send('Unable to update form');
    }
  });

  /////// FORM TYPES ///////

  // GET all form types that user has access to
  app.get('/api/formtypes', requireLogin, async (req, res) => {
    try {
      const formtypes = await FormType.find({})
        .populate('infoToBeCollected')
        // TODO: create cache
      res.send(formtypes);
    } catch(e) {
      console.log(e);
      res.status(400).send('unable to fetch form types');
    }
  });

  /////// FORMS UPCOMING ///////

  // GET all forms that user must submit soon and forms that are past due
  app.get('/api/upcoming/forms', requireLogin, async (req, res) => {
    try {
      const upcomingForms = await Form.find({ shouldBeSubmittedBy: req.user.id, submittedBy: null })
        .sort({ dueOn: -1 })
        .populate('projectId')
        .populate('formTypeId');

      res.send(upcomingForms);
    } catch(e) {
      console.log(e);
      res.status(400).send('unable to fetch upcoming forms');
    }
  });

};
