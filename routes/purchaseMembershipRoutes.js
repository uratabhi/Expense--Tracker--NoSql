const express = require("express");

const purchaseMembershipController = require("../controllers/purchaseMembershipControl");

const Authentication = require("../middleware/auth");

const router = express.Router();

router.get(
  "/premiumMembership",
  Authentication,
  purchaseMembershipController.purchasePremium
);

router.post(
  "/updateTransactionStatus",
  Authentication,
  purchaseMembershipController.updateTransactionStatus
);

module.exports = router;