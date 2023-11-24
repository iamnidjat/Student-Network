const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { createTables } = require('./database/dbSetup');
const authRoute = require('./routes/authorization');
const chatRoute = require('./routes/chat');
const eventRoute = require('./routes/events');
const groupsRoute = require('./routes/groups');
const newsRoute = require('./routes/news');
const opportunitiesRoute = require('./routes/opportunities');
const profileDRoute = require('./routes/profileDashboard');
const tasksRoute = require('./routes/tasks');
const ratingRoute = require('./routes/rating');
const managingUsersRoute = require('./routes/adminPanel/ManagingUser');
const managingGroupsRoute = require('./routes/adminPanel/ManagingGroups');
const managingOpportunitiesRoute = require('./routes/adminPanel/ManagingContents/ManagingOpportunities');
const managingNewsRoute = require('./routes/adminPanel/ManagingContents/ManagingNews');
const app = express();
let HOST = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: false,
    })
);

createTables();

app.use('/auth', authRoute);
app.use('/chat', chatRoute);
app.use('/event', eventRoute);
app.use('/groups', groupsRoute);
app.use('/opportunities', opportunitiesRoute);
app.use('/profileD', profileDRoute);
app.use('/rating', ratingRoute);
app.use('/news', newsRoute);
app.use('/tasks', tasksRoute);
app.use('/managingUsers', managingUsersRoute);
app.use('/managingGroups', managingGroupsRoute);
app.use('/managingNews', managingNewsRoute);
app.use('/managingOpportunities', managingOpportunitiesRoute);

app.listen(HOST, () => {
  console.log(`Server is running on port ${HOST}`);
});
