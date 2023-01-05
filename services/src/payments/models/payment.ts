import mongoose from 'mongoose';
// just for future
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// describe the props from a single record
export interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

// describe the interface to model
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// paymentSchema.set('versionKey', 'version');
// paymentSchema.plugin(updateIfCurrentPlugin);

// add checkin
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
