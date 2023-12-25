const { ObjectId } = require('mongoose').Types;
const { Thought, User, reactionSchema } = require('../models');

module.exports = {

    // get all thoughts
    async getThoughts(req, res) {
        console.log("========= GET /api/thoughts/ ROUTE ===========")
        try {
            let thoughts = await Thought.find()
                .populate({ path: 'reactions' })
                .sort({ username: 1 });
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: `getThoughts: ERROR: ${err}` });
        }
    },

    async getOneThought(req, res) {
        console.log("========= GET /api/thoughts/:id ROUTE ===========")
        try {
            const thought = await Thought.findOne({ _id: req.params.id })
                .select('-__v')
                .populate({ path: 'reactions' });

            if (!thought) {
                return res.status(404).json({ message: `Thought with ID ${req.params.id} not found` });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ message: `getOneThought: ERROR: ${err}` });
        }
    },

    // create a new thought
    async createThought(req, res) {
        console.log("========= POST /api/thoughts/ ROUTE ===========")
        if (!req.body.hasOwnProperty('username')) {
            return res.status(404).json({ message: `"username": not found in POST body request` });
        };

        try {
            const username = await User.findOne({ username: req.body.username.toLowerCase() });

            if (!username) {
                return res.status(404).json({ message: `${req.body.username} not found` });
            }
            console.log("FOUND USERNAME:", username);
            const createdThought = await Thought.create(req.body);
            // await createdThought.save();
            const updatedUser = await User.findByIdAndUpdate(username._id,
                { $addToSet: { thoughts: createdThought._id } },
                { runValidators: true, new: true });

            res.json({ createdThought, updatedUser });
        } catch (err) {
            res.status(500).json({ message: `createThought: ERROR: ${err}` });
        }
    },

    // Update a thought
    async updateThought(req, res) {
        console.log("========= PUT /api/thoughts/:id ROUTE ===========")

        try {
            // Check if the optional username is specified by the PUT body
            let specifiedusername = null;

            if (req.body.hasOwnProperty('username')) {
                specifiedusername = req.body.username.toLowerCase().trim();
            };

            if (specifiedusername) {
                const username = await User.findOne({ username: req.body.username.toLowerCase() });
                if (!username) {
                    return res.status(404).json({ message: `"username": in body request not found` });
                };
                // If the username specified is different than the existing one, prevent it from being changed (users need to delete instead)
                if ((await Thought.findById(req.params.id)).username === username.username) {
                    return res.status(401).json({ message: `"username": in body request is different from the Thought's current user. Please delete the thought and create it with a new user instead` });
                };
            };

            const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

            if (!updatedThought) {
                return res.status(404).json({ message: `Thought with ID ${req.params.id} not found` })
            };

            res.json({ message: `Thought ${updatedThought} successfully updated` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `updateThought: ERROR: ${err}` });
        }
    },


    // Delete a thought
    async deleteThought(req, res) {
        console.log("========= DELETE /api/thoughts/:id ROUTE ===========")
        try {
            const previousThought = await Thought.findById(req.params.id);
            if (!previousThought) {
                return res.status(404).json({ message: `Thought with ID ${req.params.id} not found` })
            };

            // check to see if the username exists in the User collection.
            let changed;
            const previousThoughtUser = await User.findOne({ username: previousThought.username });

            // If the username doesn't exist, just skip to deleting the Thought
            if (!previousThoughtUser) {
                // return res.status(404).json({ message: `User ID ${previousThought.username} not found` })
            } else {

                // if the username exists in the User collection, pull the thought out from the user
                deletedThoughtUser = await User.findOneAndUpdate({ _id: previousThoughtUser._id },
                    { $pull: { thoughts: previousThought._id } }, { multi: true, new: true });

                changed = deletedThoughtUser.thoughts.length - previousThoughtUser.thoughts.length;
                console.log("Changed record in user while deleting a Thought:", changed);
            };

            // Finally, delete the thought object from the database
            const deletedThought = await Thought.findByIdAndDelete(req.params.id, { multi: true, new: true });

            // cater for possible race conditions?
            if (!deletedThought) {
                return res.status(404).json({ message: `Thought with ID ${req.params.id} not found` })
            };

            res.json({ message: `Thought ${previousThought} successfully deleted`, updatedUser: deletedThoughtUser });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `deleteThought: ERROR: ${err}` });
        }
    },


    // Add a new reaction to a user's thought
    async addReaction(req, res) {
        console.log("========= POST /api/thoughts/:thoughtId/reactions ROUTE ===========")
        // check if username exists in the User collection. 
        if (!req.body.hasOwnProperty('username')) {
            return res.status(404).json({ message: `"username": not found in POST body request` });
        };

        try {
            const username = await User.findOne({ username: req.body.username.toLowerCase() });
            if (!username) {
                return res.status(404).json({ message: `User ${req.body.username} not found` });
            };

            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true });

            // null means thoughtId does not exist in the database
            if (!updatedThought) {
                return res.status(404).json({ message: `thoughtId ${req.params.thoughtId} not found` });
            };

            // res.json({ updatedThought });
            res.status(200).json({ message: "Reaction added", updatedThought: updatedThought });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `addReaction: ERROR: ${err}` });
        };
    },

    // Delete a reaction
    async deleteReaction(req, res) {
        console.log("========= DELETE /api/thoughts/:thoughtId/reactions/:reactionId ROUTE ===========")
        try {
            const previousThought = await Thought.findById(req.params.thoughtId);
            if (!previousThought) {
                return res.status(404).json({ message: `Thought with ID ${req.params.thoughtId} not found` })
            };

            // console.log("DEL THOUGHT:", previousThought);

            // Pull out the reaction specified by the reactionId parameter from the thought's reactions array
            let resultThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!resultThought) {
                return res.status(404).json({ message: `No thought found with id ${req.params.thoughtId}` });
            };

            res.status(200).json({
                message: `deleted reaction ${req.params.reactionId} from thought ${req.params.thoughtId}`, resultThought: resultThought
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `deleteReaction: ERROR: ${err}` });
        }
    }
};
