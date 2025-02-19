const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema=mongoose.Schema;

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Create TTL(Time To Live ) index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// creating an index on the expiresAt field. The 1 indicates ascending order.
//  {expireAfterSeconds: 0 } means that the documents will be removed immediately when the expiresAt field's value is reached or passed.


otpSchema.pre('save', async function(next) {
    if (this.isModified('otp')) {
      this.otp = await bcrypt.hash(this.otp, 12);
    }
    next();
  });
module.exports = mongoose.model('Otp', otpSchema);