const { Op } = require('sequelize');
const { Post, Comment, Friend, User } = require('../models');

exports.createComment = async (req, res, next) => {
  try {
    const { title, postId } = req.body;

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(400).json({ message: 'post not found' });
    }

    let canComment = req.user.id === post.userId;
    if (!canComment) {
      // WHERE status = 'ACCEPTED' AND
      // ((requestToId = req.user.id AND requestFromId = post.userId) OR (requestToId = post.userId AND requestFromId = req.user.id))
      const friend = await Friend.findOne({
        where: {
          status: 'ACCEPTED',
          [Op.or]: [
            {
              requestToId: req.user.id,
              requestFromId: post.userId
            },
            {
              requestToId: post.userId,
              requestFromId: req.user.id
            }
          ]
        }
      });

      if (!friend) {
        return res.status(403).json({ message: 'cannot comment this post' });
      }
    }

    const newComment = await Comment.create({
      title,
      postId,
      userId: req.user.id
    });

    const comment = await Comment.findOne({
      where: {
        id: newComment.id
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'profileImg']
      }
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });

    if (!comment) {
      return res.status(400).json({ message: 'comment not found' });
    }

    if (req.user.id !== comment.userId) {
      return res.status(403).json({ message: 'cannot delete this comment' });
    }

    await comment.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
