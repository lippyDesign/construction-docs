// import axios from 'axios';

const stripePublishableKey =
  process.env.NODE_ENV === 'production' ?
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY :
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST;
  window.Stripe.setPublishableKey(stripePublishableKey);

export const SAVE_PAYMENT_INFO_START = 'save_payment_info_start';
export const SAVE_PAYMENT_INFO_SUCCESS = 'save_payment_info_success';
export const SAVE_PAYMENT_INFO_ERROR = 'save_payment_info_error';
export const savePaymentInfo = (info, amount) => dispatch => {
  dispatch({ type: SAVE_PAYMENT_INFO_START });

  window.Stripe.card.createToken(info, async (status, response) => {
    if (response.error) {
      return dispatch({ type: SAVE_PAYMENT_INFO_ERROR });
    } else {
      console.log(response);
      try {
        // const { data } = await axios.post(`${process.env.REACT_APP_PAYMENT_SERVICE_URL}/charge-stripe`, {
        //   amount: 50, stripeToken: response, currency: 'usd', description: 'user 123 payment for abc'
        // });
      } catch(e) {
        console.log(e);
        return dispatch({ type: SAVE_PAYMENT_INFO_ERROR });
      }
      // return dispatch({ type: SAVE_PAYMENT_INFO_SUCCESS, payload: response });
    }
  });
};