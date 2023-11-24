const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'mydatabase', 
    password: 'admin', 
    port: 5432, 
  });

async function createTables() {
    const users = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        _name varchar(50),
        surname varchar(50),
        email varchar(50) UNIQUE NOT NULL,
        username varchar(50) UNIQUE NOT NULL,
        _password text NOT NULL,
        role varchar(50) NOT NULL,
        aboutMyself varchar(255),
        groupNumber varchar(50),
        phoneNumber varchar(50) UNIQUE,
        interests text,
        skills text,
        acadAchievments text,
        birthday date,
        userAvatar bytea
    );`;

    const _groups = `
    CREATE TABLE IF NOT EXISTS _groups (
        id SERIAL PRIMARY KEY,
        groupName varchar(255) NOT NULL,
        description text,
        createdBy int,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id)
    );`;

    const groupMembers = `
    CREATE TABLE IF NOT EXISTS groupMembers (
        groupId int,
        userId int,
        PRIMARY KEY (groupId, userId),
        FOREIGN KEY (groupId) REFERENCES _groups(id),
        FOREIGN KEY (userId) REFERENCES users(id)
    );`;

    const forums = `
    CREATE TABLE IF NOT EXISTS forums(
        id SERIAL PRIMARY KEY,
        groupId int,
        userId int,
        content text,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (groupId) REFERENCES _groups(id),
        FOREIGN KEY (userId) REFERENCES users(id)
    );`;

    const tasks = `
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        description text NOT NULL,
        teacherId int,
        groupId int,
        deadline date CHECK (deadline > CURRENT_DATE),
        FOREIGN KEY (teacherId) REFERENCES users(id),
        FOREIGN KEY (groupId) REFERENCES _groups(id)
    );`;

    const uploadedTasks = `
    CREATE TABLE IF NOT EXISTS uploadedTasks (
        id SERIAL PRIMARY KEY,
        hw text NOT NULL,
        studentId int,
        groupId int,
        uploadedDate timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (groupId) REFERENCES _groups(id)
    );`;

    const grades = `
    CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        studentId int,
        teacherId int,
        taskId int,
        grade int NOT NULL,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (teacherId) REFERENCES users(id),
        FOREIGN KEY (taskId) REFERENCES tasks(id)
    );`;

    const events = `
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title varchar(255) NOT NULL,
        description text,
        startDate timestamp DEFAULT CURRENT_TIMESTAMP,
        endDate timestamp CHECK (endDate::date != CURRENT_DATE),
        creatorId int,
        FOREIGN KEY (creatorId) REFERENCES users(id)
    );`;

    const eventParticipants = `
    CREATE TABLE IF NOT EXISTS eventParticipants (
        eventId int,
        userId int,
        PRIMARY KEY (eventId, userId),
        FOREIGN KEY (eventId) REFERENCES events(id),
        FOREIGN KEY (userId) REFERENCES users(id)
    );`;

    const news = `
    CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title varchar(255) NOT NULL,
        content text NOT NULL,
        authorId int,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES users(id)
    );`;

    const opportunities = `
    CREATE TABLE IF NOT EXISTS opportunities (
        id SERIAL PRIMARY KEY,
        title varchar(255) NOT NULL,
        description text NOT NULL,
        typeOfOpportunity varchar(50) NOT NULL, -- Например, 'вакансия', 'стажировка', 'проект'
        deadline timestamp CHECK (deadline::date != CURRENT_DATE) NOT NULL,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP
    );`;

    const achievments = `
    CREATE TABLE IF NOT EXISTS achievments (
        id SERIAL PRIMARY KEY,
        studentId int,
        badgeName varchar(255) NOT NULL,
        description text NOT NULL,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id)
    );
    `;

    const privateMessages = `
    CREATE TABLE IF NOT EXISTS privateMessages (
        id SERIAL PRIMARY KEY,
        senderId INT,
        receiverId INT,
        content TEXT,
        time timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(id),
        FOREIGN KEY (receiverId) REFERENCES users(id)
    );`;

    const groupMessages = `
    CREATE TABLE IF NOT EXISTS groupMessages (
        id SERIAL PRIMARY KEY,
        senderId INT,
        groupId INT,
        content TEXT,
        time timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(id),
        FOREIGN KEY (groupId) REFERENCES _groups(id)
    );`;

    const createTable = async (query, tableName) => {
        try {
          const result = await pool.query(query);
          
          console.log(`${tableName} table created or already exists`);
        } 
        catch (err) {
          console.error(`Error creating ${tableName} table:`, err);
        }
      };
      
      (async () => {
        await createTable(users, 'users');
        await createTable(_groups, '_groups');
        await createTable(groupMembers, 'groupMembers');
        await createTable(forums, 'forums');
        await createTable(tasks, 'tasks');
        await createTable(uploadedTasks, 'uploadedTasks');
        await createTable(grades, 'grades');
        await createTable(events, 'events');
        await createTable(eventParticipants, 'eventParticipants');
        await createTable(news, 'news');
        await createTable(opportunities, 'opportunities');
        await createTable(achievments, 'achievments');
        await createTable(privateMessages, 'privateMessages');
        await createTable(groupMessages, 'groupMessages');
      })();
}

module.exports = {
    createTables, pool
  };