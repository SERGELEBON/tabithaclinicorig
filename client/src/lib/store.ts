/* Clinical Warmth commerce data: keep product and fulfilment values centralized for cards, product pages, and the global cart. */
export type Product = {
  id: string;
  name: string;
  copy: string;
  tag: string;
  image: string;
  price: number;
  stock: number;
};

export const products: Product[] = [
  { id: "planner", name: "Healthy Living Planner", copy: "A practical weekly guide for routines, notes and care goals.", tag: "Wellness essential", image: "/manus-storage/tabitha-product-planner_929e0dd5.jpg", price: 85, stock: 18 },
  { id: "care-kit", name: "Home Care Kit", copy: "A thoughtfully assembled kit for everyday home support.", tag: "Home support", image: "/manus-storage/tabitha-product-care-kit_4c013368.jpg", price: 145, stock: 9 },
  { id: "guide", name: "Diabetes Care Guide", copy: "A clear, easy-to-read guide for conversations with your care team.", tag: "Patient education", image: "/manus-storage/tabitha-product-diabetes-guide_02d64816.jpg", price: 65, stock: 24 },
  { id: "wellness-bundle", name: "Wellness Care Bundle", copy: "A gentle collection for everyday comfort and thoughtful routines.", tag: "Care bundle", image: "/manus-storage/tabitha-product-wellness-bundle_bdadf41b.jpg", price: 120, stock: 12 },
];

export const deliveryFees: Record<string, number> = { "Accra – Madina": 25, Kumasi: 30, Sunyani: 35, Kasoa: 20 };
export const deliveryCities = Object.keys(deliveryFees);
export const pickupCentres = ["Accra – Madina", "Kumasi", "Sunyani", "Kasoa"];
