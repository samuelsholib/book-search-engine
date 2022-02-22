const { User, Book } = require('../models');
const { AuthenticationError } = require('../utils/auth');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
        // get a user by username
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate('books')
                return userData;
            }
            throw new AuthenticationError('You are not logged In')
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { user, token };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect signIn information');
            }
            const passwordAuth = await user.isCorrectPassword(password);

            if (!passwordAuth) {
                throw new AuthenticationError('Incorrect Password');
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const userUpdate = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true }
                );
                return userUpdate;
            }
            throw new AuthenticationError('LogIn to update users!!!');
        },

        removeABook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('LogIn before attempting to remove a book!!!')
        }

    }



};
module.exports = resolvers;