import Stripe from 'stripe';
import { config } from '../config/config';

export const stripe = new Stripe(config.STRIPE_API_KEY, {
  apiVersion: '2022-11-15',
});
