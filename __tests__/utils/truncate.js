import User from '../../src/models/User';
import '../../src/database'; // initializes models

export default async function truncate() {
  await User.sequelize.sync({ force: true });
}
