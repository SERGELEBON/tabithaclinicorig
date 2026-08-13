/* Clinical Warmth commerce: global cart trigger, delivery validation, exact total review, and WhatsApp confirmation. */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { deliveryCities, deliveryFees, pickupCentres } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_NUMBER = "233530387812";

export default function GlobalCart() {
  const { cart, cartItems, cartCount, updateCart, removeFromCart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [fulfillment, setFulfillment] = useState("delivery");
  const [city, setCity] = useState("");
  const [pickupCentre, setPickupCentre] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderRef, setOrderRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const openCart = () => setOpen(true);
    window.addEventListener("open-global-cart", openCart);
    return () => window.removeEventListener("open-global-cart", openCart);
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0), [cart, cartItems]);
  const deliveryFee = fulfillment === "delivery" && city ? deliveryFees[city] : 0;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const next: Record<string, string> = {};
    if (fulfillment === "delivery" && !city) next.city = "Choose a city to calculate delivery.";
    if (fulfillment === "delivery" && !address.trim()) next.address = "Enter the full delivery address.";
    if (fulfillment === "pickup" && !pickupCentre) next.pickupCentre = "Choose a clinic for pickup.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const openReview = () => {
    if (!cartItems.length) return;
    if (validate()) {
      const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
      setOrderRef(`TAB-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
      setConfirming(true);
    }
  };

  const copyReference = async () => {
    await navigator.clipboard?.writeText(orderRef);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const confirmWhatsApp = () => {
    const lines = cartItems.map((product) => `• ${product.name} × ${cart[product.id]} = GH₵ ${product.price * cart[product.id]}`).join("\n");
    const fulfilment = fulfillment === "delivery" ? `Delivery to ${city}\nAddress: ${address}\nLandmark: ${landmark || "Not provided"}\nDelivery fee: GH₵ ${deliveryFee}` : `Clinic pickup at ${pickupCentre}\nPickup fee: GH₵ 0`;
    const message = `Hello Tabitha Clinic, I would like to place this order.\n\nOrder reference: ${orderRef}\n\n${lines}\n\nSubtotal: GH₵ ${subtotal}\n${fulfilment}\nEstimated total: GH₵ ${total}\n\nPlease confirm availability and the final amount.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const popup = window.open("about:blank", "_blank");
    setSending(true);
    window.setTimeout(() => {
      if (popup) popup.location.href = url;
      else window.open(url, "_blank", "noopener,noreferrer");
      setSending(false);
      setConfirming(false);
      setOpen(false);
      clearCart();
    }, 650);
  };

  return <><button className="global-cart-trigger" onClick={() => setOpen(true)} aria-label={`Open cart with ${cartCount} items`}><ShoppingBag size={18} /><span>Cart</span><b>{cartCount}</b></button>{open && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="cart-modal global-cart-modal"><button onClick={() => setOpen(false)} className="modal-close" aria-label="Close cart"><X size={20} /></button><div className="eyebrow"><ShoppingBag size={15} /> Your cart</div><h2 className="mt-3 font-display text-3xl font-extrabold text-[#7A1F3D]">Review your order</h2>{!cartItems.length ? <div className="empty-cart"><p>Your cart is empty. Add a product to begin.</p><button onClick={() => setOpen(false)} className="cta-secondary mt-5">Continue shopping <ArrowRight size={15} /></button></div> : <><div className="mt-7 space-y-4">{cartItems.map((product) => <div className="cart-row" key={product.id}><div><strong>{product.name}</strong><span>GH₵ {product.price} each</span></div><div className="cart-controls"><button onClick={() => updateCart(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={14} /></button><b>{cart[product.id]}</b><button onClick={() => updateCart(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={14} /></button><button onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={15} /></button></div></div>)}</div><div className="global-cart-fields mt-7"><label><span>Fulfilment</span><select value={fulfillment} onChange={(event) => { setFulfillment(event.target.value); setErrors({}); }}><option value="delivery">Delivery to my address</option><option value="pickup">Pickup at a clinic</option></select></label>{fulfillment === "delivery" ? <><label><span>City</span><select className={errors.city ? "field-error" : ""} value={city} onChange={(event) => { setCity(event.target.value); setErrors((current) => ({ ...current, city: "" })); }}><option value="">Choose a city</option>{deliveryCities.map((item) => <option value={item} key={item}>{item} · GH₵ {deliveryFees[item]}</option>)}</select>{errors.city && <em>{errors.city}</em>}</label><label><span>Full delivery address</span><textarea className={errors.address ? "field-error" : ""} rows={2} value={address} onChange={(event) => { setAddress(event.target.value); setErrors((current) => ({ ...current, address: "" })); }} placeholder="House number, street, area" />{errors.address && <em>{errors.address}</em>}</label><label><span>Landmark</span><input value={landmark} onChange={(event) => setLandmark(event.target.value)} placeholder="Nearby landmark or point of reference" /></label></> : <label><span>Pickup centre</span><select className={errors.pickupCentre ? "field-error" : ""} value={pickupCentre} onChange={(event) => { setPickupCentre(event.target.value); setErrors((current) => ({ ...current, pickupCentre: "" })); }}><option value="">Choose a clinic</option>{pickupCentres.map((item) => <option value={item} key={item}>{item}</option>)}</select>{errors.pickupCentre && <em>{errors.pickupCentre}</em>}</label>}</div><div className="global-cart-total"><span>Subtotal · GH₵ {subtotal}</span><span>{fulfillment === "delivery" ? `Delivery · GH₵ ${deliveryFee}` : "Clinic pickup · GH₵ 0"}</span><strong>Estimated total · GH₵ {total}</strong></div><button onClick={openReview} className="cta-primary mt-6 w-full justify-center">Review before WhatsApp <ArrowRight size={16} /></button></>}</div></div>}{confirming && <div className="modal-backdrop confirmation-layer" role="dialog" aria-modal="true"><div className="confirmation-modal"><div className="confirmation-topline"><span>Tabitha Clinic · Order review</span><button onClick={() => setConfirming(false)} className="modal-close" aria-label="Close confirmation"><X size={20} /></button></div><div className="confirmation-icon"><Check size={24} /></div><div className="eyebrow">Final confirmation</div><h2 className="mt-3 font-display text-3xl font-extrabold text-[#7A1F3D]">Ready to continue?</h2><p className="mt-4 text-sm leading-6">Review your order before we open WhatsApp. The clinic team will confirm availability and the final amount.</p><div className="confirmation-reference"><span>Order reference</span><strong>{orderRef}</strong><button onClick={copyReference} className="copy-reference" aria-label="Copy order reference"><Copy size={15} /> {copied ? "Copied" : "Copy"}</button></div><div className="confirmation-summary"><div className="confirmation-items">{cartItems.map((product) => <div className="confirmation-item" key={product.id}><span>{product.name}</span><div className="confirmation-quantity"><button onClick={() => updateCart(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={13} /></button><strong>{cart[product.id]}</strong><button onClick={() => updateCart(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={13} /></button><b>GH₵ {product.price * cart[product.id]}</b></div></div>)}</div><div><span>Subtotal</span><strong>GH₵ {subtotal}</strong></div><div><span>{fulfillment === "delivery" ? `Delivery · ${city}` : `Pickup · ${pickupCentre}`}</span><strong>GH₵ {deliveryFee}</strong></div><div className="confirmation-total"><span>Estimated total</span><strong>GH₵ {total}</strong></div></div><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setConfirming(false)} className="cta-secondary">Edit order</button><button onClick={confirmWhatsApp} className="cta-primary" disabled={sending}>{sending ? <>Opening WhatsApp <span className="button-spinner" /></> : <>Confirm & open WhatsApp <ArrowRight size={16} /></>}</button></div></div></div>}</>;
}
