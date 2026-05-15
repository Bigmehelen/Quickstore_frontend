import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl } from '../utils/image';

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const shippingFee = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = 'Required';
    if (!shipping.lastName.trim()) e.lastName = 'Required';
    if (!shipping.address.trim()) e.address = 'Required';
    if (!shipping.city.trim()) e.city = 'Required';
    if (!shipping.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!payment.cardName.trim()) e.cardName = 'Required';
    if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY';
    if (payment.cvv.length < 3) e.cvv = 'Enter a valid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateShipping()) return;
    if (step === 2 && !validatePayment()) return;
    setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1500));
    clearCart();
    setStep(3);
    setPlacing(false);
  };

  const formatCard = val => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };
  const formatExpiry = val => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  return (
    <div className="page checkout-page">

      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="step-circle">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">

          {step === 0 && (
            <div className="checkout-step" id="step-review">
              <h2>Review Your Order</h2>
              {items.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={getImageUrl(item.images[0])} alt={item.name} />
                  <div>
                    <p className="co-item-name">{item.name}</p>
                    <p className="co-item-qty">Qty: {item.qty}</p>
                  </div>
                  <span className="co-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <button className="btn-primary btn-lg" onClick={handleNext} id="step-0-next">
                Continue to Shipping →
              </button>
            </div>
          )}


          {step === 1 && (
            <div className="checkout-step" id="step-shipping">
              <h2>Shipping Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    id="ship-firstname"
                    value={shipping.firstName}
                    onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))}
                    className={errors.firstName ? 'input-error' : ''}
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    id="ship-lastname"
                    value={shipping.lastName}
                    onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))}
                    className={errors.lastName ? 'input-error' : ''}
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  id="ship-address"
                  value={shipping.address}
                  placeholder="123 Main St"
                  onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    id="ship-city"
                    value={shipping.city}
                    onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    id="ship-zip"
                    value={shipping.zip}
                    onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))}
                    className={errors.zip ? 'input-error' : ''}
                  />
                  {errors.zip && <span className="field-error">{errors.zip}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State / Province</label>
                  <input
                    id="ship-state"
                    value={shipping.state}
                    onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    id="ship-country"
                    value={shipping.country}
                    onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="NG">Nigeria</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              <div className="step-actions">
                <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary btn-lg" onClick={handleNext} id="step-1-next">
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}


          {step === 2 && (
            <div className="checkout-step" id="step-payment">
              <h2>Payment Details</h2>
              <div className="payment-icons">
                <span>💳 VISA</span><span>💳 MasterCard</span><span>💳 Amex</span>
              </div>
              <div className="form-group">
                <label>Name on Card</label>
                <input
                  id="pay-name"
                  value={payment.cardName}
                  placeholder="Jane Doe"
                  onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))}
                  className={errors.cardName ? 'input-error' : ''}
                />
                {errors.cardName && <span className="field-error">{errors.cardName}</span>}
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  id="pay-number"
                  value={payment.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  onChange={e => setPayment(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                  className={errors.cardNumber ? 'input-error' : ''}
                  maxLength={19}
                />
                {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    id="pay-expiry"
                    value={payment.expiry}
                    placeholder="MM/YY"
                    onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    className={errors.expiry ? 'input-error' : ''}
                    maxLength={5}
                  />
                  {errors.expiry && <span className="field-error">{errors.expiry}</span>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    id="pay-cvv"
                    value={payment.cvv}
                    placeholder="•••"
                    type="password"
                    onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className={errors.cvv ? 'input-error' : ''}
                    maxLength={4}
                  />
                  {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                </div>
              </div>
              <div className="step-actions">
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="btn-primary btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  id="place-order-btn"
                >
                  {placing ? <span className="spinner" /> : `Place Order · $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}


          {step === 3 && (
            <div className="checkout-step confirmation" id="step-confirmation">
              <div className="confirm-icon">🎉</div>
              <h2>Order Confirmed!</h2>
              <p>Thank you, <strong>{user?.name}</strong>! Your order has been placed successfully.</p>
              <p className="confirm-eta">Estimated delivery: <strong>3–5 business days</strong></p>
              <div className="confirm-address">
                <p>Shipping to: <strong>{shipping.firstName} {shipping.lastName}, {shipping.city}</strong></p>
              </div>
              <button className="btn-primary btn-lg" onClick={() => navigate('/')} id="back-to-shop-btn">
                Continue Shopping
              </button>
            </div>
          )}
        </div>
        
        {step < 3 && (
          <div className="checkout-sidebar">
            <h3>Order Summary</h3>
            {items.map(item => (
              <div key={item.id} className="sidebar-item">
                <span className="sidebar-qty">{item.qty}×</span>
                <span className="sidebar-name">{item.name}</span>
                <span className="sidebar-price">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-line"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span></div>
            <div className="summary-line"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <hr />
            <div className="summary-line total-line"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <div className="secure-badges">
              <span>🔒 256-bit SSL encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
