const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

// set up mongoose and connect to mongo
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

// models
require('./models/User');
require('./models/Form');
require('./models/Project');
require('./models/FormField');
require('./models/FormType');
require('./models/ProjectUser');

//services
require('./services/passport');
require('./services/cache');
require('./services/setUpFieldsAndForms')();

// set up express and instruct it to use bodyParser,
// express will use cookie sessions and passport for authentication
const app = express();
app.use(bodyParser.json());
app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey]}));
app.use(passport.initialize());
app.use(passport.session());

// server routes
require('./routes/authRoutes')(app);
require('./routes/formRoutes')(app);
require('./routes/uploadRoutes')(app);
require('./routes/projectRoutes')(app);
require('./routes/chargeRoutes')(app);
require('./routes/dueRoutes')(app);
require('./routes/userRoutes')(app);

// if we are in production or ci, we want to serve the client using express
if (['production', 'ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

// set up port the server will listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port`, PORT));