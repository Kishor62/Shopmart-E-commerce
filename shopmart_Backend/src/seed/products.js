// Demo images picsum.photos se aati hain (har product ki 3 images).
// Real project mein admin panel se Cloudinary par upload karo.
const img = (seed) =>
  [1, 2, 3].map((n) => `https://picsum.photos/seed/${seed}-${n}/800/800`);

const products = [
  {
    title: "iPhone 14",
    category: "smartphones",
    brand: "Apple",
    description:
      "A big step up, with a 12MP camera that captures brighter photos and all-day battery life.",
    price: 66999,
    originalPrice: 79900,
    images: img("iphone14"),
    colors: [
      { name: "Midnight", hex: "#3a3d42" },
      { name: "Starlight", hex: "#e8dfd0" },
      { name: "Blue", hex: "#5b7a9d" },
      { name: "Product Red", hex: "#a42639" },
    ],
    optionsLabel: "Storage",
    options: [
      { label: "128 GB", price: 66999 },
      { label: "256 GB", price: 76999 },
      { label: "512 GB", price: 96999 },
    ],
    specs: {
      Display: "6.1-inch Super Retina XDR",
      Chip: "A15 Bionic",
      Camera: "Dual 12MP",
      Battery: "Up to 20 hours video",
    },
    stock: 25,
    rating: { rate: 4.8, count: 2341 },
    featured: true,
  },
  {
    title: "iPhone 14 Pro",
    category: "smartphones",
    brand: "Apple",
    description:
      "Dynamic Island, Always-On display, and a 48MP main camera for pro-level detail.",
    price: 119900,
    originalPrice: 129900,
    images: img("iphone14pro"),
    colors: [
      { name: "Space Black", hex: "#242426" },
      { name: "Silver", hex: "#e5e4e0" },
      { name: "Deep Purple", hex: "#5a5266" },
    ],
    optionsLabel: "Storage",
    options: [
      { label: "128 GB", price: 119900 },
      { label: "256 GB", price: 129900 },
    ],
    specs: {
      Display: "6.1-inch Always-On XDR",
      Chip: "A16 Bionic",
      Camera: "Triple 48MP",
      Battery: "Up to 23 hours video",
    },
    stock: 15,
    rating: { rate: 4.9, count: 3980 },
    isNew: true,
    featured: true,
  },
  {
    title: "MacBook Air M2",
    category: "laptops",
    brand: "Apple",
    description:
      "Strikingly thin design, fanless silence, and up to 18 hours of battery life.",
    price: 99900,
    originalPrice: 119900,
    images: img("macbookair"),
    colors: [
      { name: "Midnight", hex: "#3a3d42" },
      { name: "Starlight", hex: "#e8dfd0" },
      { name: "Space Gray", hex: "#6e6f73" },
    ],
    optionsLabel: "Storage",
    options: [
      { label: "256 GB", price: 99900 },
      { label: "512 GB", price: 119900 },
    ],
    specs: {
      Display: "13.6-inch Liquid Retina",
      Chip: "Apple M2",
      Memory: "8GB unified memory",
      Battery: "Up to 18 hours",
    },
    stock: 10,
    rating: { rate: 4.9, count: 1876 },
    featured: true,
  },
  {
    title: "Apple Watch SE",
    category: "wearables",
    brand: "Apple",
    description:
      "The essentials, in a durable, affordable design that tracks your health all day.",
    price: 29900,
    images: img("watchse"),
    colors: [
      { name: "Midnight", hex: "#3a3d42" },
      { name: "Starlight", hex: "#e8dfd0" },
    ],
    optionsLabel: "Case size",
    options: [
      { label: "40mm", price: 29900 },
      { label: "44mm", price: 32900 },
    ],
    specs: { Display: "Retina LTPO OLED", Chip: "S8 SiP", Battery: "Up to 18 hours" },
    stock: 40,
    rating: { rate: 4.7, count: 1420 },
  },
  {
    title: "AirPods Pro (2nd gen)",
    category: "audio",
    brand: "Apple",
    description:
      "Active Noise Cancellation, Adaptive Audio, and up to 6 hours of listening time.",
    price: 24900,
    originalPrice: 26900,
    images: img("airpodspro"),
    colors: [{ name: "White", hex: "#f2f1ee" }],
    optionsLabel: "Ear tips",
    options: [
      { label: "Small", price: 24900 },
      { label: "Medium", price: 24900 },
      { label: "Large", price: 24900 },
    ],
    specs: { Chip: "Apple H2", Noise: "Active Noise Cancellation", Battery: "6 hrs (30 hrs with case)" },
    stock: 60,
    rating: { rate: 4.8, count: 5210 },
    isNew: true,
  },
  {
    title: "iPad Air",
    category: "tablets",
    brand: "Apple",
    description: "Serious performance in a thin, light design, now with the M1 chip.",
    price: 54900,
    images: img("ipadair"),
    colors: [
      { name: "Space Gray", hex: "#6e6f73" },
      { name: "Blue", hex: "#5b7a9d" },
    ],
    optionsLabel: "Storage",
    options: [
      { label: "64 GB", price: 54900 },
      { label: "256 GB", price: 69900 },
    ],
    specs: { Display: "10.9-inch Liquid Retina", Chip: "Apple M1", Battery: "Up to 10 hours" },
    stock: 20,
    rating: { rate: 4.8, count: 980 },
  },
];

export default products;
