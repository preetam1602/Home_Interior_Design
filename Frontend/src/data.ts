import { Product } from './types';

export const products: Product[] = [
  // Colors (ID 1-8)
  {
    id: 1,
    name: "Warm White",
    price: 320,
    unit: "/ litre",
    description: "Clean, timeless base color that brightens any space.",
    image: "https://hips.hearstapps.com/hmg-prod/images/clx060124wellshearer-007-2-664272e2a91c0.jpg?crop=0.724xw:0.966xh;0.128xw,0.0235xh&resize=1120:*",
    category: "color"
  },
  {
    id: 2,
    name: "Sage Green",
    price: 520,
    unit: "/ litre",
    description: "Calm, nature-inspired green perfect for living rooms.",
    image: "https://tse4.mm.bing.net/th/id/OIP.0aOyxMiO9Wt_XeEUT9l1gwHaH8?pid=Api",
    category: "color"
  },
  {
    id: 3,
    name: "Charcoal Gray",
    price: 420,
    unit: "/ litre",
    description: "Deep, elegant blue that adds richness and depth.",
    image: "https://www.bananahome.com.au/cdn/shop/articles/Grey_Living_Room_Ideas_1296x.jpg?v=1674710175",
    category: "color"
  },
  {
    id: 4,
    name: "Navy Blue",
    price: 650,
    unit: "/ litre",
    description: "Modern, bold neutral for accent walls and luxury spaces.",
    image: "https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/0ea7f919-9e62-440d-801d-5b6715041b68/16.jfif",
    category: "color"
  },
  {
    id: 5,
    name: "Terracotta",
    price: 380,
    unit: "/ litre",
    description: "Earthy clay shade that adds warmth and character.",
    image: "https://todobien.nl/wp-content/uploads/2024/02/ontwerp-zonder-titel-2024-02-26t110157.871.png",
    category: "color"
  },
  {
    id: 6,
    name: "Pastel Peach",
    price: 450,
    unit: "/ litre",
    description: "Soft, welcoming tone perfect for bedrooms.",
    image: "https://www.asianpaints.com/content/dam/asian_paints/colours/room-shots/reds-oranges-colour-shade-asian-paints-8000.jpg",
    category: "color"
  },
  {
    id: 7,
    name: "Olive Green",
    price: 550,
    unit: "/ litre",
    description: "Muted green with an earthy, sophisticated feel.",
    image: "https://cdn.mos.cms.futurecdn.net/v2/t%3A0%2Cl%3A700%2Ccw%3A1800%2Cch%3A1800%2Cq%3A80%2Cw%3A1800/y8XnZ862rAy3uQ5QqdHyQ8.jpg",
    category: "color"
  },
  {
    id: 8,
    name: "Dusty Blue",
    price: 550,
    unit: "/ litre",
    description: "Subtle blue shade for a relaxed, airy atmosphere.",
    image: "https://www.fleetwood.ie/wp-content/uploads/2024/03/Guest20bedroom_DUSTY20BLUE.png",
    category: "color"
  },

  // Materials (ID 9-16)
  {
    id: 9,
    name: "Marble",
    price: 450,
    unit: "/sq.ft",
    description: "Natural stone with clean veining for luxurious floors & walls.",
    image: "https://wp.wallsandfloors.co.uk/wp-content/uploads/2021/06/marble-blog.jpg",
    category: "material"
  },
  {
    id: 10,
    name: "Oak Wood",
    price: 300,
    unit: "/sq.ft",
    description: "Warm classic wood for flooring and cabinetry.",
    image: "https://www.elitewoodenfloors.com.au/cdn/shop/files/Glacier_1200x1800.jpg?v=1725943336",
    category: "material"
  },
  {
    id: 11,
    name: "Granite",
    price: 700,
    unit: "/sq.ft",
    description: "Durable stone perfect for countertops & accent surfaces.",
    image: "https://home360mkecabinets.com/wp-content/uploads/2025/03/granite-ktichen-countertop.jpg",
    category: "material"
  },
  {
    id: 12,
    name: "Porcelain Tile",
    price: 180,
    unit: "/sq.ft",
    description: "Strong, low-maintenance tile ideal for floors & walls.",
    image: "https://lgsgranite.com/wp-content/uploads/2024/05/msi-bianco-imperial-grey-granite-kitchen-slab.jpg",
    category: "material"
  },
  {
    id: 13,
    name: "Walnut Wood",
    price: 500,
    unit: "/sq.ft",
    description: "Rich dark wood veneer for furniture and panels.",
    image: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2015/11/10/1/NKBA_Kitchen2015-White-Cabinets-_Judith-Wright-Sentz_3.jpg.rend.hgtvcom.1280.1280.85.suffix/1447190664817.webp",
    category: "material"
  },
  {
    id: 14,
    name: "Slate Tile",
    price: 280,
    unit: "/sq.ft",
    description: "Textured natural stone for modern flooring.",
    image: "https://www.bhg.com/thmb/PQipcp9Gy1FuwLcv7Sz53b4te9c%3D/1366x0/filters%3Ano_upscale%28%29%3Astrip_icc%28%29/integrated-granite-countertop-sink-86Dj7DGc45X82UTw-8O9BX-b7e3b40f50514321a91741622795d5e9.jpg",
    category: "material"
  },
  {
    id: 15,
    name: "Travertine",
    price: 250,
    unit: "/sq.ft",
    description: "Earthy stone with soft tones and natural textures.",
    image: "https://images.squarespace-cdn.com/content/v1/55cb6a03e4b08dc9aca94598/1604330488281-1ZEAVUQP91WQLQRSI9QQ/Brown-Dated-Busy-Granite-Antique-White-Cabinets.jpg",
    category: "material"
  },
  {
    id: 16,
    name: "Polished Concrete",
    price: 200,
    unit: "/sq.ft",
    description: "Sleek industrial finish for contemporary interiors.",
    image: "https://cdn.prod.website-files.com/639cb8e17c6c0c893bbfaf16/651316cd94b028ab2d0d63a5_Kitchen%20Granite%20Countertops%201280px.webp",
    category: "material"
  },

  // Furniture (ID 101-108 & 117-134)
  {
    id: 101,
    name: "Modern Sofa",
    price: 45000,
    description: "Designed for comfort and style, our sofas elevate everyday living.",
    image: "https://www.decorpot.com/images/blogimage1542282264l-shaped-sofas.jpg",
    category: "furniture",
    room: "living"
  },
  {
    id: 102,
    name: "Accent Chair",
    price: 18000,
    description: "Adds character and elegance to any corner of your home.",
    image: "https://m.media-amazon.com/images/I/91zKkOvDm8L._AC_SL1500_.jpg",
    category: "furniture",
    room: "living"
  },
  {
    id: 103,
    name: "Coffee Table",
    price: 12000,
    description: "A perfect centerpiece that blends function with modern design.",
    image: "https://i.etsystatic.com/25926317/r/il/36ef32/6376850725/il_fullxfull.6376850725_kanz.jpg",
    category: "furniture",
    room: "living"
  },
  {
    id: 104,
    name: "Dining Table Set",
    price: 40000,
    description: "Crafted for memorable meals and meaningful family moments.",
    image: "https://images.thdstatic.com/productImages/4e77d0e5-a937-414d-a158-045577156313/svn/natural-coffee-tables-bl-205-31_600.jpg",
    category: "furniture",
    room: "dining"
  },
  {
    id: 105,
    name: "Bed Frame",
    price: 45000,
    description: "Strong, stylish bed frames designed for lasting comfort.",
    image: "https://graceoaksdesigns.com/wp-content/uploads/2022/03/IMG_8993.jpg",
    category: "furniture",
    room: "bedroom"
  },
  {
    id: 106,
    name: "Bookshelf Unit",
    price: 25000,
    description: "Smart storage that keeps your space organized and elegant.",
    image: "https://wwmake.com/cdn/shop/files/Copy_of_IMG_5233_800x.jpg?v=1739466977",
    category: "furniture",
    room: "office"
  },
  {
    id: 107,
    name: "TV Unit",
    price: 30000,
    description: "Designed to organize entertainment with a clean, modern look.",
    image: "https://kasecustom.com/cdn/shop/files/provincialcoffeelivingroomwebhoriz.jpg?v=1729231507&width=2400",
    category: "furniture",
    room: "living"
  },
  {
    id: 108,
    name: "Ottoman Stool",
    price: 10000,
    description: "Multi-purpose seating that adds comfort and convenience.",
    image: "https://mobileimages.lowes.com/productimages/765ce794-6590-4bcc-be41-6b94ad576830/66361495.jpeg?size=pdhz",
    category: "furniture",
    room: "living"
  },
  {
    id: 117,
    name: "Leather Recliner",
    price: 52000,
    description: "Premium top-grain leather recliner designed for maximum comfort and styling.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "living"
  },
  {
    id: 118,
    name: "Luxury Wardrobe",
    price: 65000,
    description: "Spacious modular wardrobe with premium glass doors and interior LED lighting.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "bedroom"
  },
  {
    id: 119,
    name: "Nightstand Table",
    price: 9500,
    description: "Sleek double-drawer nightstand with gold accents and solid oak feet.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Jqz7j3Gj4JhsOCJ1XSEhXwOvfcHOAymMKBNf5GcqXw&s=10",
    category: "furniture",
    room: "bedroom"
  },
  {
    id: 120,
    name: "Dressing Mirror Console",
    price: 28000,
    description: "Contemporary vanity set with a large circular mirror and velvet-cushioned stool.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "bedroom"
  },
  {
    id: 121,
    name: "Velvet Accent Bench",
    price: 15000,
    description: "Luxury tufted bench upholstered in soft velvet, perfect for the bed end.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    room: "bedroom"
  },
  {
    id: 122,
    name: "Marble Dining Table",
    price: 75000,
    description: "Stunning solid Carrara marble top with a sculptural geometric base.",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "dining"
  },
  {
    id: 123,
    name: "Premium Sideboard",
    price: 38000,
    description: "Elegant storage credenza with brass handles and rich wood veneer.",
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "dining"
  },
  {
    id: 124,
    name: "Velvet Dining Chairs",
    price: 24000,
    description: "Set of 4 ergonomic dining chairs upholstered in rich stain-resistant velvet.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "dining"
  },
  {
    id: 125,
    name: "Luxury Bar Cabinet",
    price: 42000,
    description: "Compact wood and metal home bar cabinet with stemware racks and bottle grids.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "dining"
  },
  {
    id: 126,
    name: "Ergonomic Office Chair",
    price: 19500,
    description: "Fully adjustable high-back mesh chair providing optimal lumbar support.",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "office"
  },
  {
    id: 127,
    name: "Minimalist Oak Desk",
    price: 26000,
    description: "Spacious solid oak writing desk with integrated cable routing channels.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "office"
  },
  {
    id: 128,
    name: "Metal Bookcase",
    price: 18000,
    description: "Industrial steel frame shelf with rustic walnut wooden display inserts.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "office"
  },
  {
    id: 129,
    name: "Smart LED Task Lamp",
    price: 5500,
    description: "Dimmable desk light with adjustable color temperatures and wireless charger.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    room: "office"
  },
  {
    id: 130,
    name: "Kitchen Island Counter",
    price: 58000,
    description: "Bespoke prep station with quartz countertop and deep utility drawers.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "kitchen"
  },
  {
    id: 131,
    name: "Modular Kitchen Pantry",
    price: 48000,
    description: "Slide-out pantry tower organizer with soft-closing pull-out metal baskets.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "kitchen"
  },
  {
    id: 132,
    name: "High-back Counter Stools",
    price: 16000,
    description: "Set of 2 modern counter height stools upholstered in PU leather with iron frames.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "kitchen"
  },
  {
    id: 133,
    name: "Brass Pendant Lights",
    price: 9000,
    description: "Set of 3 mid-century modern dome pendant lights with brushed brass finishes.",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "kitchen"
  },
  {
    id: 134,
    name: "Kitchen Baker's Rack",
    price: 13500,
    description: "Multi-tier utility storage shelf with power outlets and hanging hooks.",
    image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80",
    category: "furniture",
    room: "kitchen"
  },

  // Decor (ID 109-116)
  {
    id: 109,
    name: "Wall Art",
    price: 12000,
    description: "Thoughtfully curated artwork that adds personality and visual focus.",
    image: "https://m.media-amazon.com/images/I/71xLddPJdTL.jpg",
    category: "decor",
    room: "decor"
  },
  {
    id: 110,
    name: "Rugs & Carpets",
    price: 25000,
    description: "Premium rugs that define spaces while adding warmth and comfort.",
    image: "https://m.media-amazon.com/images/I/81fp4lbeFmL.jpg",
    category: "decor",
    room: "decor"
  },
  {
    id: 111,
    name: "Indoor Plants",
    price: 6000,
    description: "Natural greenery that brings freshness and balance to interiors.",
    image: "https://nurserylive.com/cdn/shop/articles/House_Calls_Herman_Pelosi_Brooklyn_living_room_Gabriella_Herman.0-566811_7c7b41ab-5d98-4892-a573-c6070304d011-614715.jpg?v=1739431626",
    category: "decor",
    room: "decor"
  },
  {
    id: 112,
    name: "Decor Lighting",
    price: 20000,
    description: "Layered lighting solutions that enhance mood and ambiance.",
    image: "https://mobileimages.lowes.com/productimages/887084f2-6ddd-418f-b1b3-05a5e985fa8e/66627295.jpeg?size=pdhz",
    category: "decor",
    room: "decor"
  },
  {
    id: 113,
    name: "Decor Mirrors",
    price: 15000,
    description: "Stylish mirrors that enhance light and create visual depth.",
    image: "https://www.brabbu.com/en/inspiration-and-ideas/wp-content/uploads/2021/08/Modern-Round-Mirrors-for-Hallways-and-Entryways-Brass-Wood-Gold-Silver-1.jpg",
    category: "decor",
    room: "decor"
  },
  {
    id: 114,
    name: "Cushions & Throws",
    price: 6000,
    description: "Soft furnishings that add comfort, texture, and color balance.",
    image: "https://i.pinimg.com/736x/2d/f3/e8/2df3e8e4ecd3e7670542f9fda58d045d.jpg",
    category: "decor",
    room: "decor"
  },
  {
    id: 115,
    name: "Decor Vases",
    price: 5000,
    description: "Minimal and artistic vases that elevate shelves and corners.",
    image: "https://img.lazcdn.com/g/ff/kf/Sb24a4d50068249e5bca488f372de5ea8u.jpg_720x720q80.jpg",
    category: "decor",
    room: "decor"
  },
  {
    id: 116,
    name: "Decor Accessories",
    price: 4000,
    description: "Carefully chosen accents that complete the overall design.",
    image: "https://m.media-amazon.com/images/I/81qQsfVKeGL.jpg",
    category: "decor",
    room: "decor"
  }
];

export function findProduct(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getDiscountRate(id: number): number {
  if (id >= 109 && id <= 116) {
    return 0.05; // 5% discount on decor
  }
  if ((id >= 101 && id <= 108) || (id >= 117 && id <= 134)) {
    return 0.10; // 10% discount on furniture
  }
  return 0; // no discount
}
