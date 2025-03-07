"use strict";

const { CommentSch } = require("../models/comment.model");
const { findById } = require("../models/discount.model");
const { findProduct } = require("../models/repository/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

/*
    Key feature : comment Services
    -add comment [User,Shop]
    -get a list of comments [User,Shop]
    -deletes comments [User,Shop,Admin]
*/
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parrentCommentId = null,
  }) {
    const comment = new CommentSch({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parrentCommentId,
    });

    let rightValue = 1; // Mặc định giá trị là 1 nếu không tìm thấy giá trị cũ
    if (parrentCommentId) {
      const parentComment = await CommentSch.findById(parrentCommentId);
      if (!parentComment) {
        throw new Error("Parent comment not found.");
      }
      rightValue = parentComment.comment_right;

      // update comment
      await CommentSch.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await CommentSch.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      // tim max trong commnner
      const maxRightValue = await CommentSch.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue && typeof maxRightValue.comment_right === "number") {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentByParent({
    productId,
    parentCommentId = null,
    limit = 50,
  }) {
    console.log(productId, parentCommentId, limit);

    if (parentCommentId) {
      // Tìm bình luận cha theo parentCommentId
      const parentComment = await CommentSch.findById(parentCommentId);
      if (!parentComment) {
        console.log("Bình luận cha không tồn tại");
        return [];
      }

      // Tìm các bình luận con của bình luận cha
      const comments = await CommentSch.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lt: parentComment.comment_right },
      })
        .select({
          comment_userId: 1,
          comment_content: 1,
          comment_right: 1,
          comment_left: 1,
        })
        .sort({
          comment_left: 1, // Sắp xếp theo comment_left
        })
        .limit(limit); // Giới hạn số lượng bình luận trả về

      return comments;
    }

    // Trường hợp không có parentCommentId (tìm các bình luận gốc)
    const comments = await CommentSch.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId, // Điều kiện là parentCommentId = null
    })
      .select({
        comment_userId: 1,
        comment_content: 1,
        comment_right: 1,
        comment_left: 1,
      })
      .sort({
        comment_left: 1, // Sắp xếp theo comment_left
      })
      .limit(limit); // Giới hạn số lượng bình luận trả về

    return comments;
  }
  static async deleteComment(productId, commentId) {
    console.log(productId.commentId);
    console.log(productId.productId);

    // kiem tra san pham co ton tai trong db hay khong
    const product = await findProduct(productId.productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại.");
    }
    console.log("product: " + product);

    const comment = await CommentSch.findById(productId.commentId);
    if (!comment) {
      throw new Error("Bình luận không tồn tại.");
    }
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    const width = rightValue - leftValue + 1;
    // xoa taa ca cac comment id con co cai so thu tu ben trai lon hon hoac bang gia tri left value, va nho hon gia tri right value
    await CommentSch.deleteMany({
      comment_productId: productId.productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    // cap nhat gia tri right tru do 6 tuc la (right - left) + 1
    await CommentSch.updateMany(
      {
        comment_productId: productId.productId,
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );
    // cap nhat gia tri cua left tru di chieu dai cua no
    await CommentSch.updateMany(
      {
        comment_productId: productId.productId,
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );
    return true;
  }
}

module.exports = CommentService;

// tuyet voi
