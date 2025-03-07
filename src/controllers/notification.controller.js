"use strict";
const NoticationService = require("../services/notification.service");

class NotificationController {
  listNotiByUser = async (req, res) => {
    try {
      const checkoutReview = await NoticationService.listNotiByUser({
        ...req.query,
      });
      res.status(200).json(checkoutReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  createNotification = async (req, res) => {
    try {
      const checkoutReview = await NoticationService.pushNotiToSystem();
      res.status(200).json(checkoutReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}

module.exports = new NotificationController();
