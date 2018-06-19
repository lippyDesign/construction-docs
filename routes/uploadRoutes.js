const uuid = require('uuid/v1');
const path = require('path');
const Storage = require('@google-cloud/storage');

const keys = require('../config/keys')

const requireLogin = require('../middlewares/requireLogin');

const googleProjectId = keys.googleProjectId;
const bucketName = keys.googleBucketName;

module.exports = app => {
  app.post('/api/upload', requireLogin, async (req, res) => {
    const { projectId, type, formDate, fileType } = req.body;
    const userId = req.user.id;

    // Creates a client
    const storage = new Storage({
      projectId: googleProjectId,
      keyFilename: path.join(path.dirname(require.main.filename), keys.googleConfigFileName)
    });

    const filename = `${projectId}-${type}-${formDate}-${uuid()}.${fileType}`;

    // These options will allow temporary read access to the file
    const options = {
      action: 'write',
      contentType: `image/${fileType}`,
      expires: '03-17-2025',
    };

    // Get a signed URL for the file
    storage
      .bucket(bucketName)
      .file(filename)
      .getSignedUrl(options)
      .then(results => {
        const url = results[0];
        res.send(url)
      })
      .catch(err => {
        console.log('ERROR +++++++++++++++++++++++')
        console.dir(err);
        res.status(500).send('error adding image')
      });
  });
}