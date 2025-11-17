// Test script to check subscription structure
import { stripe } from '../lib/stripe';

async function testSubscription() {
  try {
    const subscription = await stripe.subscriptions.retrieve('sub_1SUTPmPdJKMOLsutZ5VA1l9p');

    console.log('Subscription fields:');
    console.log('- id:', subscription.id);
    console.log('- status:', subscription.status);
    console.log('- customer:', subscription.customer);
    console.log('- current_period_end:', subscription.current_period_end);
    console.log('- current_period_start:', subscription.current_period_start);

    if (subscription.current_period_end) {
      const date = new Date(subscription.current_period_end * 1000);
      console.log('- current_period_end as Date:', date);
    } else {
      console.log('❌ current_period_end is missing!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSubscription();
