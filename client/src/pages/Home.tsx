/* Clinical Warmth: healthcare editorial layout, Tabitha Burgundy authority, green action cues, calm asymmetry. */
import { useState } from "react";
import { products } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";
import { MapView } from "@/components/Map";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Building2,
  Clock3,
  Cross,
  HeartPulse,
  MapPin,
  Menu,
  Navigation,
  Plus,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  X,
} from "lucide-react";

const services = [
  { icon: Stethoscope, title: "General Consultation", copy: "A considered first step when you need clarity." },
  { icon: HeartPulse, title: "Diabetes Care", copy: "Practical support for better everyday health." },
  { icon: ShieldCheck, title: "Prostate Care", copy: "Clear, discreet care for men at every stage." },
  { icon: Stethoscope, title: "Infections Treatment", copy: "Prompt assessment and treatment plans." },
  { icon: HeartPulse, title: "Diet Therapy", copy: "Sustainable guidance built around real life." },
  { icon: ShieldCheck, title: "Massage", copy: "Restorative support for comfort and wellbeing." },
  { icon: Cross, title: "Laboratory", copy: "Essential tests with clear next steps." },
  { icon: Cross, title: "Scan", copy: "Diagnostic coordination close to home." },
  { icon: HeartPulse, title: "Home Care", copy: "Support that meets you where you are." },
];

const WHATSAPP_NUMBER = "233530387812";

const centerProfiles = [
  { city: "Accra–Madina", region: "Greater Accra", address: "Firestone Footbridge, Madina Main Road", near: "Near Firestone Footbridge", hours: "Mon–Sat · 8AM–8PM", schedule: { open: 8, close: 20 }, phone: "0530 38 78 12", lat: 5.684, lng: -0.169, images: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1100&q=82"] },
  { city: "Kumasi", region: "Ashanti Region", address: "Adum High Street, Kumasi", near: "Near Komfo Anokye", hours: "Mon–Sat · 8AM–8PM", schedule: { open: 8, close: 20 }, phone: "0530 38 78 12", lat: 6.688, lng: -1.624, images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1100&q=82"] },
  { city: "Sunyani", region: "Bono Region", address: "Hospital Road, Sunyani", near: "Near Sunyani Regional Hospital", hours: "Mon–Sat · 8AM–7PM", schedule: { open: 8, close: 19 }, phone: "0530 38 78 12", lat: 7.334, lng: -2.326, images: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1100&q=82"] },
  { city: "Kasoa", region: "Central Region", address: "New Market Road, Kasoa", near: "Near Kasoa New Market", hours: "Mon–Sat · 8AM–8PM", schedule: { open: 8, close: 20 }, phone: "0530 38 78 12", lat: 5.534, lng: -0.418, images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1100&q=82", "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1100&q=82"] },
];

const getCentreStatus = (center: typeof centerProfiles[number]) => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const weekday = parts.find((part) => part.type === "weekday")?.value || "Sun";
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(weekday);
  const currentTime = hour + minute / 60;
  return isWeekday && currentTime >= center.schedule.open && currentTime < center.schedule.close;
};

const locations = centerProfiles.map((center) => [center.city, center.region] as [string, string]);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(centerProfiles[0]);
  const [centreImageIndex, setCentreImageIndex] = useState(0);
  const { cartCount } = useCart();
  const selectCenter = (center: typeof centerProfiles[number]) => { setSelectedCenter(center); setCentreImageIndex(0); };

  const openAppointment = () => {
    setAppointmentOpen(true);
    setSubmitted(false);
  };

  const submitAppointment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const centre = String(formData.get("centre") || "").trim();
    const care = String(formData.get("care") || "").trim();
    const message = [
      "Hello Tabitha Clinic, I would like to request an appointment.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Preferred centre: ${centre}`,
      `Care needed: ${care}`,
    ].join("\\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    toast.success("WhatsApp is opening with your appointment request.");
  };

  return (
    <div className="min-h-screen bg-white text-[#4A4A4A]">
      <div className="topbar bg-[#7A1F3D] text-white">
        <div className="container flex items-center justify-between gap-4 py-2.5 text-[11px] font-semibold tracking-[.08em]">
          <div className="flex items-center gap-2"><Phone size={13} /> <a href="tel:0530387812">0530-38-78-12</a></div>
          <div className="hidden items-center gap-5 md:flex"><span>ACCRA · KUMASI · SUNYANI · KASOA</span><span className="text-white/60">MON–SAT · 8AM–6PM</span></div>
          <button onClick={openAppointment} className="uppercase text-[#c9e7b5] transition hover:text-white">Book appointment <ArrowRight className="ml-1 inline" size={13} /></button>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-[#7A1F3D]/10 bg-white/95 backdrop-blur">
        <div className="container flex h-[82px] items-center justify-between">
          <a href="#home" className="flex items-center" aria-label="Tabitha Clinic home">
            <img src="/manus-storage/tabitha-clinic-logo-transparent_c4108a9e.png" alt="Tabitha Clinic" className="user-brand-logo header-brand-logo" />
          </a>
          <nav className="hidden items-center gap-7 text-[12px] font-bold uppercase tracking-[.07em] text-[#7A1F3D] lg:flex">
            <a href="#home" className="nav-link">Home</a><a href="#about" className="nav-link">About</a>
            <a href="#services" className="nav-link">Services <ChevronDown size={13} className="inline" /></a>
            <a href="#locations" className="nav-link">Locations <ChevronDown size={13} className="inline" /></a>
            <a href="#care" className="nav-link">Health Tips</a><a href="#contact" className="nav-link">Contact</a>
          </nav>
          <button onClick={openAppointment} className="hidden rounded-[3px] bg-[#4C9A2A] px-5 py-3 text-[11px] font-extrabold uppercase tracking-[.1em] text-white shadow-[0_7px_20px_rgba(76,154,42,.18)] transition hover:-translate-y-0.5 hover:bg-[#39771f] lg:block">Book now</button>
          <button className="text-[#7A1F3D] lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-[#7A1F3D]/10 bg-white px-6 py-5 lg:hidden"><div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-[#7A1F3D]"><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#locations" onClick={() => setMenuOpen(false)}>Locations</a><a href="#care" onClick={() => setMenuOpen(false)}>Health Tips</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a><button onClick={openAppointment} className="mt-2 w-fit bg-[#4C9A2A] px-5 py-3 text-white">Book now</button></div></div>}
      </header>

      <main id="home">
        <section className="hero-section relative overflow-hidden">
          <div className="container grid min-h-[630px] items-center gap-10 py-16 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
            <div className="relative z-10 max-w-[540px] animate-rise"><div className="eyebrow"><span className="eyebrow-dot" /> Care that comes closer</div><h1 className="mt-5 font-display text-[42px] font-extrabold leading-[1.08] tracking-[-.045em] text-[#7A1F3D] sm:text-[53px]">Specialist care,<br /><span className="text-[#B23A6B]">close to home.</span></h1><p className="mt-6 max-w-[470px] text-[17px] leading-8 text-[#4A4A4A]/85">Tabitha Clinic brings trusted support for diabetes, prostate health and infections to communities across Ghana.</p><div className="mt-9 flex flex-wrap items-center gap-4"><button onClick={openAppointment} className="cta-primary">Book appointment <ArrowRight size={16} /></button><a href="#services" className="cta-secondary">Explore our care <ArrowRight size={16} /></a></div><div className="mt-11 flex items-center gap-3 text-sm text-[#7A1F3D]"><div className="flex -space-x-2"><span className="avatar bg-[#d9acbc]">A</span><span className="avatar bg-[#b9d4a7]">K</span><span className="avatar bg-[#edc4b4]">S</span></div><span><strong>Here when it matters.</strong><br /><span className="text-xs text-[#4A4A4A]/70">Four centres. One standard of care.</span></span></div></div>
            <div className="relative lg:justify-self-end"><div className="hero-photo-wrap"><img src="/manus-storage/tabitha-clinic-hero_2f85f659.jpg" alt="Clinician in a bright consultation room" className="hero-photo" /><div className="hero-stamp"><Cross size={22} strokeWidth={2.3} /><span>HEALTH<br />WITH HEART</span></div></div><div className="hero-note"><MapPin size={15} /><span><strong>4 centres</strong><br />across Ghana</span></div></div>
          </div>
          <div className="hero-curve" />
        </section>

        <section id="about" className="relative bg-white py-20 lg:py-28"><div className="container grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div className="relative pl-8 lg:pl-16"><div className="vertical-label">WHY TABITHA</div><div className="about-photo"><img src="/manus-storage/tabitha-clinic-care_d70396ad.jpg" alt="Clinician caring for a patient" /><div className="about-badge"><Check size={17} /><span>Compassionate<br />by design</span></div></div></div><div className="max-w-[620px]"><div className="eyebrow"><span className="eyebrow-dot" /> A better kind of clinic</div><h2 className="section-title mt-4">Care that listens<br /><em>before it treats.</em></h2><p className="mt-6 text-[17px] leading-8">Your health is more than a test result. We take time to understand your story, explain your options and make the next step feel clear.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="feature-line"><Check /><div><strong>Specialist focus</strong><p>Diabetes, prostate & infections</p></div></div><div className="feature-line"><Check /><div><strong>Easy access</strong><p>Four centres across Ghana</p></div></div><div className="feature-line"><Check /><div><strong>Practical guidance</strong><p>Care plans made for real life</p></div></div><div className="feature-line"><Check /><div><strong>Clear next steps</strong><p>From consultation to follow-up</p></div></div></div><a href="#contact" className="text-link mt-9">Meet Tabitha Clinic <ArrowRight size={16} /></a></div></div></section>

        <section id="services" className="services-section py-20 lg:py-24"><div className="container"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="eyebrow"><span className="eyebrow-dot" /> Our areas of care</div><h2 className="section-title mt-4">The right care,<br /><em>at the right time.</em></h2></div><p className="max-w-[340px] text-[15px] leading-7">From first consultation to diagnostics and home support, our team helps you move forward with confidence.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map(({ icon: Icon, title, copy }, index) => <article key={title} className="service-card" style={{ animationDelay: `${index * 50}ms` }}><div className="service-icon"><Icon size={25} strokeWidth={1.8} /></div><div className="mt-8 text-[11px] font-extrabold uppercase tracking-[.13em] text-[#B23A6B]">0{index + 1}</div><h3 className="mt-2 font-display text-[22px] font-bold text-[#7A1F3D]"><a href={`/services/${title.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-[#B23A6B]">{title}</a></h3><p className="mt-3 text-[14px] leading-6">{copy}</p><a href={`/services/${title.toLowerCase().replaceAll(" ", "-")}`} className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4C9A2A]">Learn more <ArrowRight size={14} /></a></article>)}</div></div></section>

        <section id="shop" className="shop-section py-20 lg:py-24"><div className="container"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="eyebrow"><span className="eyebrow-dot" /> Tabitha essentials</div><h2 className="section-title mt-4">A little support<br /><em>for the days between.</em></h2></div><button onClick={() => window.dispatchEvent(new CustomEvent("open-global-cart"))} className="cart-trigger"><ShoppingBag size={17} /> Cart <span>{cartCount}</span></button></div><p className="mt-5 max-w-[540px] text-[15px] leading-7">Explore practical wellness and patient-support essentials. Add what you need, then continue on WhatsApp to confirm availability and arrange payment or collection.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <article className="product-card" key={product.id}><a href={`/shop/${product.id}`} className="block"><div className="product-art"><img src={product.image} alt={product.name} /></div><div className="mt-5 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#B23A6B]">{product.tag}</div><h3 className="mt-2 font-display text-[21px] font-bold text-[#7A1F3D]">{product.name}</h3><p className="mt-2 text-sm leading-6">{product.copy}</p><div className="product-meta"><strong>GH₵ {product.price}</strong><span>{product.stock} available</span></div></a><a href={`/shop/${product.id}`} className="product-add">Add to cart <Plus size={15} /></a></article>)}</div></div></section>

        <section id="care" className="care-section py-20 lg:py-24"><div className="container grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><div className="eyebrow text-white"><span className="eyebrow-dot bg-[#c9e7b5]" /> Our approach</div><h2 className="mt-4 max-w-[610px] font-display text-[37px] font-extrabold leading-tight text-white sm:text-[47px]">Small steps can change<br /><span className="text-[#c9e7b5]">the whole picture.</span></h2><p className="mt-6 max-w-[520px] text-[16px] leading-8 text-white/75">Whether you are managing a long-term condition or looking for answers, we turn complex health information into practical, supportive care.</p><button onClick={openAppointment} className="mt-8 rounded-[3px] bg-white px-6 py-4 text-xs font-extrabold uppercase tracking-[.1em] text-[#7A1F3D] transition hover:-translate-y-0.5">Talk to our team <ArrowRight className="ml-2 inline" size={15} /></button></div><div className="approach-visual"><img src="/manus-storage/tabitha-clinic-team_3aa34689.jpg" alt="Tabitha Clinic care team" /><div className="approach-card"><div className="approach-number">01 — UNDERSTAND</div><h3 className="font-display text-2xl font-bold text-[#7A1F3D]">Listen first.</h3><p className="mt-3 text-sm leading-6">We assess carefully and explain what we find in a way that makes sense.</p><div className="my-5 h-px bg-[#7A1F3D]/10" /><div className="approach-number">02 — SUPPORT</div><h3 className="font-display text-2xl font-bold text-[#7A1F3D]">Stay close.</h3><p className="mt-3 text-sm leading-6">A realistic plan, with our team beside you as your goals evolve.</p></div></div></div></section>

        <section id="locations" className="centres-section py-20 lg:py-24"><div className="container"><div className="centres-heading"><div className="eyebrow justify-center"><span className="eyebrow-dot" /> Our centres</div><h2 className="section-title mt-3">4 centres, one standard of care</h2><p>Find a Tabitha Clinic near you across Greater Accra, Ashanti, Bono and Central regions.</p></div><div className="centre-tabs" role="tablist" aria-label="Choose a Tabitha Clinic centre">{centerProfiles.map((center) => <button key={center.city} role="tab" aria-selected={selectedCenter.city === center.city} className={selectedCenter.city === center.city ? "centre-tab active" : "centre-tab"} onClick={() => selectCenter(center)}><Building2 size={15} /> {center.city}</button>)}</div><div className="centre-feature"><div className="centre-map"><MapView key={selectedCenter.city} initialCenter={{ lat: selectedCenter.lat, lng: selectedCenter.lng }} initialZoom={14} /><div className="map-label"><MapPin size={14} /> {selectedCenter.city}<Navigation size={13} /></div><a className="map-directions-link" href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`} target="_blank" rel="noreferrer" aria-label={`Open directions to ${selectedCenter.city} in Google Maps`}><Navigation size={14} /> Open in Google Maps</a></div><div className="centre-details"><div className={getCentreStatus(selectedCenter) ? "centre-status" : "centre-status closed"}><span /> {getCentreStatus(selectedCenter) ? "Open now" : "Closed now"}</div><h3>{selectedCenter.city}</h3><p className="centre-region">{selectedCenter.region}</p><div className="centre-detail-line"><MapPin size={18} /><div><span>Address</span><strong>{selectedCenter.address}</strong><small>{selectedCenter.near}</small></div></div><div className="centre-detail-line"><Clock3 size={18} /><div><span>Opening hours</span><strong>{selectedCenter.hours}</strong></div></div><div className="centre-detail-line"><Phone size={18} /><div><span>Phone</span><strong>{selectedCenter.phone}</strong></div></div><div className="centre-actions"><button onClick={openAppointment} className="cta-primary">Book now <ArrowRight size={15} /></button><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedCenter.address}, Ghana`)}`} target="_blank" rel="noreferrer" className="cta-secondary"><Navigation size={15} /> Get directions</a></div></div></div><div className="centre-gallery"><div className="centre-gallery-image"><img src={selectedCenter.images[centreImageIndex]} alt={`${selectedCenter.city} clinic facilities`} /><div className="centre-gallery-overlay"><span>Inside {selectedCenter.city}</span><small>Clinic facilities preview</small></div><button className="gallery-arrow gallery-prev" onClick={() => setCentreImageIndex((index) => (index - 1 + selectedCenter.images.length) % selectedCenter.images.length)} aria-label="Previous centre image"><ArrowRight size={16} /></button><button className="gallery-arrow gallery-next" onClick={() => setCentreImageIndex((index) => (index + 1) % selectedCenter.images.length)} aria-label="Next centre image"><ArrowRight size={16} /></button></div><div className="gallery-dots">{selectedCenter.images.map((_, index) => <button key={index} className={index === centreImageIndex ? "gallery-dot active" : "gallery-dot"} onClick={() => setCentreImageIndex(index)} aria-label={`Show centre image ${index + 1}`} />)}</div></div><div className="centre-cards">{centerProfiles.map((center) => <button key={center.city} onClick={() => selectCenter(center)} className={selectedCenter.city === center.city ? "centre-card active" : "centre-card"}><div className="centre-card-image"><img src={center.images[0]} alt={`${center.city} centre`} /><span>{center.city}</span></div><div className="centre-card-body"><strong>{center.region}</strong><span><Clock3 size={12} /> {center.hours}</span></div></button>)}</div></div></section>

        <section id="contact" className="contact-section py-16"><div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><div className="eyebrow text-white"><span className="eyebrow-dot bg-[#c9e7b5]" /> Ready when you are</div><h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Your next step starts here.</h2></div><button onClick={openAppointment} className="cta-white">Book an appointment <ArrowRight size={16} /></button></div></section>
      </main>

      <footer className="footer"><div className="container grid gap-12 py-14 md:grid-cols-[1.2fr_.8fr_.8fr_1fr]"><div><div className="flex items-center"><img src="/manus-storage/tabitha-clinic-logo-transparent_c4108a9e.png" alt="Tabitha Clinic" className="user-brand-logo footer-brand-logo" /></div><p className="mt-5 max-w-[250px] text-sm leading-6 text-white/60">Specialist care for diabetes, prostate health and infections — close to home.</p></div><div><h4>Explore</h4><div className="footer-links"><a href="#about">About us</a><a href="#services">Our services</a><a href="#care">Health tips</a><a href="#contact">Contact</a></div></div><div><h4>Our centres</h4><div className="footer-links"><a href="#locations">Accra – Madina</a><a href="#locations">Kumasi</a><a href="#locations">Sunyani</a><a href="#locations">Kasoa</a></div></div><div><h4>Get in touch</h4><a className="footer-phone" href="tel:0530387812"><Phone size={15} /> 0530-38-78-12</a><div className="mt-5 flex gap-2 text-white/60"><Clock3 size={15} /><span className="text-sm">Mon–Sat · 8AM–6PM</span></div></div></div><div className="container flex flex-col justify-between gap-3 border-t border-white/10 py-5 text-[11px] text-white/45 sm:flex-row"><span>© 2026 Tabitha Clinic. Care with purpose.</span><span>Accra · Kumasi · Sunyani · Kasoa</span></div></footer>

      {appointmentOpen && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="appointment-modal"><button onClick={() => setAppointmentOpen(false)} className="modal-close" aria-label="Close"><X size={20} /></button>{submitted ? <div className="py-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f2df] text-[#4C9A2A]"><Check size={30} /></div><h3 className="mt-6 font-display text-2xl font-bold text-[#7A1F3D]">Thank you.</h3><p className="mt-3 text-sm leading-6">A member of the Tabitha team will contact you to confirm your appointment.</p><button onClick={() => setAppointmentOpen(false)} className="cta-primary mx-auto mt-7">Close</button></div> : <><div className="eyebrow"><span className="eyebrow-dot" /> Start your care journey</div><h3 className="mt-3 font-display text-3xl font-extrabold text-[#7A1F3D]">Book an appointment</h3><p className="mt-3 text-sm leading-6">Tell us a little about what you need. Our team will call to confirm your visit.</p><form onSubmit={submitAppointment} className="mt-7 space-y-4"><input required name="name" placeholder="Your name" className="form-input" /><input required name="phone" type="tel" placeholder="Phone number" className="form-input" /><select required name="centre" className="form-input"><option value="">Choose a centre</option>{locations.map(([city]) => <option key={city}>{city}</option>)}</select><select required name="care" className="form-input"><option value="">What can we help with?</option><option>Diabetes care</option><option>Prostate care</option><option>Infections treatment</option><option>General consultation</option></select><button type="submit" className="cta-primary w-full justify-center">Continue on WhatsApp <ArrowRight size={16} /></button></form></>}</div></div>}
    </div>
  );
}
