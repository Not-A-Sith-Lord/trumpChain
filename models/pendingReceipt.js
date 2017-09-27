const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingReceiptSchema = new Schema({
  originalContent: Object,
  receiptId: String
});

//actual model
const pendingReceipt = mongoose.model('pendingReceipt', pendingReceiptSchema);


module.exports = pendingReceipt;