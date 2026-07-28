const localProducts = [
  {
    id: 1,
    title: "Naruto Sage Mode Oversized Tee",
    category: "Oversized T-Shirts",
    price: 399.0,
    discountPrice: 349.0,
    badge: "sale",
    rating: 4.8,
    reviews: 142,
    featured: true,
    trending: true,
    description: "Unleash your inner shinobi with our Naruto Sage Mode Oversized Tee. Made from 100% premium heavy cotton (240 GSM), featuring an eye-catching graphic print of Naruto in Sage Mode on the back and minimalist symbols on the front. Extremely durable, comfortable, and perfect for streetwear.",
    images: [
      "/images/naruto_sage_tee.png"
    ],
    colors: ["Black", "White", "Orange"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    title: "One Piece Gear 5 Hoodie",
    category: "Hoodies",
    price: 1100.0,
    badge: "new",
    rating: 4.9,
    reviews: 98,
    featured: true,
    trending: true,
    description: "Reach the peak of Luffy's power with the Gear 5 Joyboy Hoodie. Crafted with double-brushed fleece lining, 400 GSM heavy-weight fabric, and a high-definition puff-print of Monkey D. Luffy's ultimate form. Features custom drawstrings and a relaxed drop-shoulder fit.",
    images: [
      "/images/luffy_gear5_hoodie.png"
    ],
    colors: ["Black", "Purple", "Gray"],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    title: "Akatsuki Cloud Hoodie",
    category: "Hoodies",
    price: 1100.0,
    discountPrice: 949.0,
    badge: "sale",
    rating: 4.7,
    reviews: 215,
    featured: true,
    trending: false,
    description: "Join the rogue ninja organization. The iconic Akatsuki Cloud design is embroidered onto a premium-weight hoodie. Features side pockets, rib-knit cuffs, and premium embroidery that won't fade or wear out.",
    images: [
      "/images/akatsuki_cloud_hoodie.png"
    ],
    colors: ["Black", "Red"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    title: "Jujutsu Kaisen Gojo Eyes Graphic Tee",
    category: "Graphic Tees",
    price: 399.0,
    rating: 4.9,
    reviews: 187,
    featured: true,
    trending: true,
    description: "Showcase the Honored One's legendary Six Eyes. Featuring a high-quality screen-printed graphic of Satoru Gojo across the chest on a comfortable relaxed-fit t-shirt. Breathable cotton blend, perfect for hot summer days.",
    images: [
      "/images/gojo_eyes_tee.png"
    ],
    colors: ["Black", "Navy", "White"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    title: "Demon Slayer Tanjiro Haori Cargo Pants",
    category: "Cargo Pants",
    price: 1299.0,
    discountPrice: 999.0,
    badge: "limited",
    rating: 4.6,
    reviews: 54,
    featured: false,
    trending: true,
    description: "Functional streetwear meets Demon Slayer aesthetics. These black cargo pants feature subtle green-and-black checkerboard patterned accents on the pocket straps, inspired by Tanjiro's haori. Multiple utility pockets, adjustable drawcords at ankles.",
    images: [
      "/images/tanjiro_cargo_pants.png"
    ],
    colors: ["Black", "Olive"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 6,
    title: "Attack on Titan Scout Regiment Cap",
    category: "Caps",
    price: 299.0,
    rating: 4.7,
    reviews: 62,
    featured: false,
    trending: false,
    description: "Wear the Wings of Freedom. A high-quality adjustable dad hat featuring the embroidered Scout Regiment emblem on the front. 100% washed cotton, curved brim, brass buckle enclosure.",
    images: [
      "/images/scout_regiment_cap.png"
    ],
    colors: ["Forest Green", "Black", "Beige"],
    sizes: ["One Size"]
  },
  {
    id: 7,
    title: "Hunter x Hunter Kurapika Chains Bracelet",
    category: "Accessories",
    price: 199.0,
    badge: "sale",
    discountPrice: 149.0,
    rating: 4.5,
    reviews: 39,
    featured: false,
    trending: false,
    description: "Recreated Kurapika's iconic judgment chain and conjured rings. Beautifully crafted from high-quality stainless steel alloy. An excellent accessory for cosplay, conventions, or everyday display of your resolve.",
    images: [
      "/images/kurapika_chains_bracelet.png"
    ],
    colors: ["Silver"],
    sizes: ["One Size"]
  },
  {
    id: 8,
    title: "Dragon Ball Z Capsule Corp Joggers",
    category: "Joggers",
    price: 699.0,
    rating: 4.8,
    reviews: 112,
    featured: true,
    trending: true,
    description: "Stay active or lounge in style with Capsule Corp joggers. Made of super-soft fleece with the iconic Capsule Corporation logo printed on the thigh. Elastic waistband with drawstring and ribbed ankle cuffs.",
    images: [
      "/images/capsule_corp_joggers.png"
    ],
    colors: ["Navy", "Heather Gray", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 9,
    title: "Zoro Textured Hoodie",
    category: "Hoodies",
    price: 1299.0,
    badge: "new",
    rating: 5.0,
    reviews: 1,
    featured: true,
    trending: true,
    description: "Experience the ultimate in streetwear luxury. The Zoro Textured Hoodie is crafted from medium weight 250 GSM textured cotton with a relaxed oversized silhouette. Features subtle dark neutral detailing and anime-inspired embroidery, designed for those who appreciate premium quality and bold fashion.",
    images: [
      "/images/zoro_textured_hoodie.png"
    ],
    colors: ["Black", "Dark Green"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: 10,
    title: "AOT Scout Regiment Track Pants",
    category: "Track Pants",
    price: 799.0,
    badge: "new",
    rating: 4.8,
    reviews: 73,
    featured: true,
    trending: true,
    description: "Elite scouting training gear. High-performance forest green track pants featuring the Scout Regiment wings graphic on the thigh. Quick-dry, breathable material perfect for intense training or premium streetwear fashion.",
    images: [
      "/images/scout_regiment_track_pants.png"
    ],
    colors: ["Forest Green", "Black"],
    sizes: ["S", "M", "L", "XL"]
  }
];

export default localProducts;
