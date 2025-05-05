export const STRIPE_PRODUCTS = {
  'Basic Plan': {
    priceId: 'price_1RHixQFx1sMvQJ6LZZfCeyTH',
    name: 'Basic Plan',
    description: 'Up to 5 product types',
    mode: 'subscription',
  },
  'Starter Plan': {
    priceId: 'price_1RHj3qFx1sMvQJ6LieirKuU9',
    name: 'Starter Plan',
    description: 'Up to 20 product types',
    mode: 'subscription',
  },
  'Growth Plan': {
    priceId: 'price_1RHj4HFx1sMvQJ6Ls1GwtGjz',
    name: 'Growth Plan',
    description: 'Up to 50 product types',
    mode: 'subscription',
  },
  'Professional Plan': {
    priceId: 'price_1RHj55Fx1sMvQJ6L7wEnH3nB',
    name: 'Professional Plan',
    description: 'Up to 100 product types',
    mode: 'subscription',
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PRODUCTS;