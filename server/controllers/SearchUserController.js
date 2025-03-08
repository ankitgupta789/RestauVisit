const User = require('../models/User.js');

const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    console.log('Search keyword:', keyword.$or[0],keyword.$or[1],keyword.$or[2]);

    // Find users matching the search criteria, excluding the logged-in user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error while fetching the users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = allUsers;
