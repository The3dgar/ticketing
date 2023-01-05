import mongoose from 'mongoose';
import { OrderService } from '../services/order-service';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  // ---
  // version: number;
}

// describe the props from a single record
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// describe the interface to model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      require: true,
      type: String,
    },
    price: {
      require: true,
      type: Number,
      min: 0,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// add checkin
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, ...otherAttrs } = attrs;

  return new Ticket({
    _id: id,
    ...otherAttrs,
  });
};

ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  // this === the tkt doc that we just called 'isResereved'
  const existingOrder = await OrderService.getActiveOrder(this as TicketDoc);
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
