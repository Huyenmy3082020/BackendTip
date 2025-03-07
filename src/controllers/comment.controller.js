"use strict";
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    try {
      const comment = await CommentService.createComment(req.body);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };
  getComent = async (req, res, next) => {
    try {
      const comments = await CommentService.getCommentByParent({
        ...req.query,
      });
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };
  deleteComment = async (req, res, next) => {
    try {
      console.log("alo", { ...req.body });

      await CommentService.deleteComment(req.body);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CommentController();
