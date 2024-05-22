import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mpp_database', 'root', 'password123', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Comment out or remove the sync method to avoid dropping and recreating tables
    // await sequelize.sync({ force: false });

    console.log('Database connection successful, no sync performed.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;