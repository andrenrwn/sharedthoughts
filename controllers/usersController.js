const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {

    // get all users
    async getUsers(req, res) {
        console.log("========= GET /api/users/ ROUTE ===========")
        try {
            let users = await User.find()
                .populate({ path: 'friends', select: 'username' })
                .populate({ path: 'thoughts', select: 'thoughtText' })
                .sort({ username: 1 });
            res.json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: `getUsers: ERROR: ${err}` });
        }
    },

    // get a single user
    async getOneUser(req, res) {
        console.log("========= GET /api/users/:id ROUTE ===========")
        try {
            const user = await User.findOne({ _id: req.params.id })
                .select('-__v')
                .populate({ path: 'friends', select: 'username' })
                .populate({ path: 'thoughts', select: 'thoughtText' });

            if (!user) {
                return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json({ message: `getOneUser: ERROR: ${err}` });
        }
    },

    // create a new user
    async createUser(req, res) {
        console.log("========= POST /api/users ROUTE ===========")
        try {
            const createdUser = await User.create(req.body);
            // await createdUser.save();
            res.json(createdUser);
        } catch (err) {
            res.status(500).json({ message: `createUser: ERROR: ${err}` });
        }
    },

    // Update a user
    async updateUser(req, res) {
        console.log("========= PUT /api/users/:id ROUTE ===========")
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: `User with ID ${req.params.id} not found` })
            };

            // const course = await Course.findOneAndUpdate(
            //     { students: req.params.studentId },
            //     { $pull: { students: req.params.studentId } },
            //     { new: true }
            // );

            // if (!course) {
            //     return res.status(404).json({
            //         message: 'Student deleted, but no courses found',
            //     });
            // }

            res.json({ message: `User ${updatedUser} successfully updated` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `updateUser: ERROR: ${err}` });
        }
    },


    // Delete a user
    async deleteUser(req, res) {
        console.log("========= DELETE /api/users/:id ROUTE ===========")
        try {
            const userToDelete = await User.findById(req.params.id);
            if (!userToDelete) {
                return res.status(404).json({ message: `User with ID ${req.params.id} not found` })
            };

            // BONUS: Delete the user's thoughts before deleting the user.
            for (let i = 0; i < userToDelete.thoughts.length; i++) {
                let thoughtToDelete = await Thought.findById(userToDelete.thoughts[i]);
            };

            const deletedThoughts = await Thought.deleteMany({ _id: { $in: userToDelete.thoughts } });
            console.log(deletedThoughts);

            const deletedUser = await User.findByIdAndDelete(req.params.id);

            // Note: reactions with the already-deleted username will still remain in other people's thoughts.
            //   Not implemented due to not being specified in specification.
            //   One implementation idea is to scan all Thoughts for the user's reactions, 
            //   another is to create a separate collection for a user's reactions, 
            //   although without cascade delete in mongodb, that will still risk referential integrity

            res.json({ message: `User ${userToDelete} acknowledged ${deletedThoughts.acknowledged} deleted with ${deletedThoughts.deletedCount} thought objects` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `deleteUser: ERROR: ${err}` });
        }
    },


    // Add a friend to a user
    async addFriend(req, res) {
        console.log("========= POST /api/users/:id/friends/:friendId ROUTE ===========")
        try {
            const friendUser = await User.findById(req.params.friendId);

            console.log(friendUser);

            if (!friendUser) {
                return res.status(404).json({ message: `Friend with ID ${req.params.id} not found` })
            };

            const currentUser = await User.findByIdAndUpdate(req.params.id,
                { $addToSet: { friends: friendUser._id } });

            let change = currentUser.friendcount;
            const afterUpdateUser = await User.findById(req.params.id);
            change = afterUpdateUser.friendcount - change;
            console.log(`${change} records changed`);

            res.json({ message: `Friend ${friendUser.username} (${friendUser._id}) added as a friend to ${currentUser.username} (${currentUser._id}). ${change} friends records changed` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `addFriend: ERROR: ${err}` });
        }
    },


    // Delete a friend from a user
    async deleteFriend(req, res) {
        console.log("========= DELETE /api/users/:id/friends/:friendId ROUTE ===========")
        try {
            const friendUser = await User.findById(req.params.friendId);

            console.log(friendUser);

            if (!friendUser) {
                return res.status(404).json({ message: `Friend with ID ${req.params.id} not found` })
            };

            const currentUser = await User.findByIdAndUpdate(req.params.id, { $pull: { friends: friendUser._id } }, { multi: true });

            let change = currentUser.friendcount;
            const afterUpdateUser = await User.findById(req.params.id);
            change = afterUpdateUser.friendcount - change;
            console.log(`${change} records changed`);

            res.json({ message: `DELETED ${friendUser.username} (${friendUser._id}) from the friend list of user ${currentUser.username} (${currentUser._id}). ${change} friends records changed` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `addFriend: ERROR: ${err}` });
        }
    },
};
