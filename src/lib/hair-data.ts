// HairBloom data: recipes, products, auras, 30-day plan, tips

export type Recipe = {
  id: number;
  title: string;
  benefit: string;
  category: string[];
  duration: string;
  frequency: string;
  cover: string;
  ingredients: { name: string; photo: string }[];
  steps: string[];
  warning?: string;
};

const ING = {
  avocado: "photo-1523049673857-eb18f1d7b578",
  honey: "photo-1558642452-9d2a7deb7f62",
  aloe: "photo-1596040033229-a9821ebd058d",
  argan: "photo-1474979266404-7eaacbcd87c5",
  castor: "photo-1620756235880-d4ae44c2cc42",
  egg: "photo-1582722872445-44dc5f7e3c8f",
  coconut: "photo-1535591273851-f04d0c8e9e43",
  banana: "photo-1571771894821-ce9b6c11b08e",
  rosemary: "photo-1618375569909-3c8616cf7733",
  onion: "photo-1508747703725-719777637510",
  lemon: "photo-1582476697867-b736079d0af8",
  yogurt: "photo-1488477181946-6428a0291777",
  olive: "photo-1474979266404-7eaacbcd87c5",
  ginger: "photo-1615485290382-441e4d049cb5",
  fenugreek: "photo-1506368249639-73a05d6f6488",
};

export const unsplash = (id: string, w = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop&auto=format`;

const ing = (name: string, key: keyof typeof ING) => ({ name, photo: unsplash(ING[key], 120) });

export const recipes: Recipe[] = [
  { id: 1, title: "Masque Avocat, Miel & Aloe Vera", benefit: "Hydratation", category: ["Hydratation"], duration: "30 min", frequency: "1x/sem", cover: "photo-1556228720-195a672e8a03",
    ingredients: [ing("Avocat", "avocado"), ing("Miel", "honey"), ing("Aloe Vera", "aloe")],
    steps: ["Écrasez l'avocat mûr en purée fine.", "Ajoutez 2 c. à soupe de miel et 3 c. à soupe d'aloe vera.", "Appliquez longueurs et pointes, laissez 30 min.", "Rincez à l'eau tiède puis shampooing doux."] },
  { id: 2, title: "Masque Banane, Miel & Lait de Coco", benefit: "Anti-frisottis", category: ["Hydratation"], duration: "20 min", frequency: "1x/sem", cover: "photo-1571781926291-c477ebfd024b",
    ingredients: [ing("Banane", "banana"), ing("Miel", "honey"), ing("Coco", "coconut")],
    steps: ["Mixez la banane jusqu'à éliminer les grumeaux.", "Ajoutez miel et lait de coco.", "Appliquez sur cheveux humides.", "Laissez 20 min puis rincez."] },
  { id: 3, title: "Soin profond Aloe, Karité & Coco", benefit: "Hydratation 4c", category: ["Hydratation"], duration: "45 min", frequency: "1x/sem", cover: "photo-1598440947619-2c35fc9aa908",
    ingredients: [ing("Aloe", "aloe"), ing("Coco", "coconut"), ing("Argan", "argan")],
    steps: ["Mélangez 3 c. aloe, 2 c. karité fondu, 2 c. lait de coco.", "Sectionnez les cheveux.", "Massez racines et longueurs.", "Bonnet chaud 45 min, rincez."] },
  { id: 4, title: "Yaourt, Miel & Huile d'olive", benefit: "Cheveux secs", category: ["Hydratation"], duration: "20 min", frequency: "1x/sem", cover: "photo-1488477181946-6428a0291777",
    ingredients: [ing("Yaourt", "yogurt"), ing("Miel", "honey"), ing("Olive", "olive")],
    steps: ["Battez 1 yaourt nature avec miel et huile.", "Appliquez sur longueurs sèches.", "20 min sous serviette chaude.", "Shampooing doux."] },
  { id: 5, title: "Coco + Avocat + Argan", benefit: "Sécheresse extrême", category: ["Hydratation"], duration: "1h", frequency: "2x/mois", cover: "photo-1556228720-195a672e8a03",
    ingredients: [ing("Coco", "coconut"), ing("Avocat", "avocado"), ing("Argan", "argan")],
    steps: ["Faites fondre l'huile de coco.", "Ajoutez avocat et argan.", "Massez et laissez 1h sous bonnet.", "Double shampooing léger."] },
  { id: 6, title: "Jaune d'œuf, Olive & Miel", benefit: "Protéine cheveux fins", category: ["Protéine"], duration: "30 min", frequency: "1x/mois", cover: "photo-1582722872445-44dc5f7e3c8f",
    ingredients: [ing("Œuf", "egg"), ing("Olive", "olive"), ing("Miel", "honey")],
    steps: ["Battez 2 jaunes avec 1 c. miel et 2 c. huile.", "Appliquez sur cheveux humides.", "Laissez 30 min.", "Rincez à l'EAU FROIDE uniquement."],
    warning: "Rinçage à l'eau froide impératif pour éviter la cuisson de l'œuf." },
  { id: 7, title: "Œuf, Yaourt & Citron", benefit: "Force cheveux fins", category: ["Protéine"], duration: "25 min", frequency: "1x/mois", cover: "photo-1488477181946-6428a0291777",
    ingredients: [ing("Œuf", "egg"), ing("Yaourt", "yogurt"), ing("Citron", "lemon")],
    steps: ["Mélangez 1 œuf, 3 c. yaourt, jus d'½ citron.", "Appliquez racine aux pointes.", "25 min sous charlotte.", "Rincez à l'eau tiède."] },
  { id: 8, title: "Œuf, Coco & Rhum", benefit: "Fortifiant", category: ["Protéine"], duration: "30 min", frequency: "1x/mois", cover: "photo-1535591273851-f04d0c8e9e43",
    ingredients: [ing("Œuf", "egg"), ing("Coco", "coconut")],
    steps: ["Mélangez 1 œuf, 2 c. coco, 1 c. rhum.", "Appliquez longueurs.", "30 min.", "Rinçage tiède."] },
  { id: 9, title: "Mayonnaise, Avocat & Œuf", benefit: "Protéine profonde", category: ["Protéine"], duration: "45 min", frequency: "1x/mois", cover: "photo-1523049673857-eb18f1d7b578",
    ingredients: [ing("Avocat", "avocado"), ing("Œuf", "egg")],
    steps: ["3 c. mayo + 1 avocat + 1 œuf.", "Mixez en crème.", "45 min sous bonnet.", "Shampooing."] },
  { id: 10, title: "Eau de lentilles & Aloe", benefit: "Protéine sans rinçage", category: ["Protéine"], duration: "Leave-in", frequency: "2x/sem", cover: "photo-1596040033229-a9821ebd058d",
    ingredients: [ing("Aloe", "aloe")],
    steps: ["Faites bouillir 1 tasse lentilles 30 min.", "Filtrez et refroidissez.", "Ajoutez 2 c. aloe.", "Vaporisez quotidiennement."] },
  { id: 11, title: "Ricin, Nigelle & Menthe", benefit: "Croissance nuit", category: ["Croissance", "Cuir chevelu"], duration: "Nuit", frequency: "2x/sem", cover: "photo-1620756235880-d4ae44c2cc42",
    ingredients: [ing("Ricin", "castor"), ing("Romarin", "rosemary")],
    steps: ["Mélangez ricin + nigelle + 2 gouttes menthe.", "Massez le cuir chevelu 5 min.", "Laissez agir toute la nuit.", "Shampooing au matin."] },
  { id: 12, title: "Jus d'oignon, Olive & Miel", benefit: "Anti-chute", category: ["Croissance", "Cuir chevelu"], duration: "30 min", frequency: "2x/sem", cover: "photo-1508747703725-719777637510",
    ingredients: [ing("Oignon", "onion"), ing("Olive", "olive"), ing("Miel", "honey")],
    steps: ["Pressez le jus d'1 oignon.", "Ajoutez 1 c. olive + 1 c. miel.", "Massez cuir chevelu 30 min.", "Shampooing parfumé pour neutraliser."] },
  { id: 13, title: "Eau de romarin & Aloe", benefit: "Croissance leave-in", category: ["Croissance"], duration: "Leave-in", frequency: "Quotidien", cover: "photo-1618375569909-3c8616cf7733",
    ingredients: [ing("Romarin", "rosemary"), ing("Aloe", "aloe")],
    steps: ["Infusez 1 branche de romarin 20 min.", "Refroidissez et filtrez.", "Mélangez 1:1 avec aloe.", "Vaporisez sur cuir chevelu."] },
  { id: 14, title: "Gingembre, Coco & Citron", benefit: "Anti-pellicules", category: ["Cuir chevelu"], duration: "20 min", frequency: "1x/sem", cover: "photo-1615485290382-441e4d049cb5",
    ingredients: [ing("Gingembre", "ginger"), ing("Coco", "coconut"), ing("Citron", "lemon")],
    steps: ["Râpez 1 c. gingembre frais.", "Mélangez coco fondu + jus citron.", "Massez cuir chevelu 20 min.", "Rincez et shampooing."] },
  { id: 15, title: "Argile verte, Rose & Tea tree", benefit: "Cuir gras", category: ["Cuir chevelu"], duration: "15 min", frequency: "1x/sem", cover: "photo-1596040033229-a9821ebd058d",
    ingredients: [ing("Aloe", "aloe")],
    steps: ["3 c. argile + eau de rose en pâte.", "2 gouttes tea tree.", "Appliquez racines, 15 min.", "Rincez abondamment."] },
  { id: 16, title: "Fenugrec & Yaourt", benefit: "Croissance", category: ["Croissance"], duration: "30 min", frequency: "1x/sem", cover: "photo-1506368249639-73a05d6f6488",
    ingredients: [ing("Fenugrec", "fenugreek"), ing("Yaourt", "yogurt")],
    steps: ["Trempez 2 c. graines fenugrec nuit.", "Mixez avec 3 c. yaourt.", "Appliquez racines + longueurs 30 min.", "Rincez."] },
  { id: 17, title: "Vinaigre de cidre", benefit: "Clarifiant", category: ["Brillance"], duration: "5 min", frequency: "1x/mois", cover: "photo-1582476697867-b736079d0af8",
    ingredients: [ing("Citron", "lemon")],
    steps: ["1 part vinaigre pour 3 parts eau.", "Versez après shampooing.", "Massez 2 min.", "Rincez à l'eau fraîche."] },
  { id: 18, title: "Jaune, Citron & Huile", benefit: "Brillance", category: ["Brillance"], duration: "20 min", frequency: "1x/mois", cover: "photo-1582722872445-44dc5f7e3c8f",
    ingredients: [ing("Œuf", "egg"), ing("Citron", "lemon"), ing("Olive", "olive")],
    steps: ["Battez 1 jaune + 1 c. citron + 1 c. olive.", "Appliquez longueurs.", "20 min.", "Rinçage froid."] },
  { id: 19, title: "Aloe, Jojoba & Vitamine E", benefit: "Pointes fourchues", category: ["Brillance"], duration: "30 min", frequency: "1x/sem", cover: "photo-1596040033229-a9821ebd058d",
    ingredients: [ing("Aloe", "aloe"), ing("Argan", "argan")],
    steps: ["2 c. aloe + 1 c. jojoba + 1 capsule vit E.", "Appliquez sur pointes.", "30 min.", "Shampooing doux."] },
  { id: 20, title: "Thé noir", benefit: "Anti-chute rinse", category: ["Croissance"], duration: "Rinçage", frequency: "1x/sem", cover: "photo-1618375569909-3c8616cf7733",
    ingredients: [],
    steps: ["Infusez 3 sachets thé noir.", "Refroidissez.", "Versez après shampooing.", "Ne rincez pas."] },
  { id: 21, title: "Eau de riz", benefit: "Rétention longueur", category: ["Croissance"], duration: "Leave-in", frequency: "2x/sem", cover: "photo-1488477181946-6428a0291777",
    ingredients: [],
    steps: ["Rincez ½ tasse de riz.", "Trempez dans 2 tasses d'eau 30 min.", "Filtrez (laissez fermenter 24h optionnel).", "Vaporisez ou rincez."] },
  { id: 22, title: "Avocat, Banane & Coco — Enfants", benefit: "Démêlant doux", category: ["Enfants"], duration: "15 min", frequency: "1x/sem", cover: "photo-1571771894821-ce9b6c11b08e",
    ingredients: [ing("Avocat", "avocado"), ing("Banane", "banana"), ing("Coco", "coconut")],
    steps: ["Mixez tous les ingrédients en crème lisse.", "Appliquez sur cheveux humides.", "15 min en jouant.", "Rinçage tiède, démêlez."] },
  { id: 23, title: "Aloe, Miel & Eau — Enfants", benefit: "Cuir chevelu doux", category: ["Enfants", "Cuir chevelu"], duration: "Spray", frequency: "Quotidien", cover: "photo-1596040033229-a9821ebd058d",
    ingredients: [ing("Aloe", "aloe"), ing("Miel", "honey")],
    steps: ["1 c. aloe + ½ c. miel + ½ tasse eau.", "Vaporisateur.", "Spray racines et longueurs.", "Brossez doucement."] },
  { id: 24, title: "Menthe, Romarin & Ricin — Hommes", benefit: "Croissance scalp", category: ["Hommes", "Croissance"], duration: "Nuit", frequency: "2x/sem", cover: "photo-1620756235880-d4ae44c2cc42",
    ingredients: [ing("Romarin", "rosemary"), ing("Ricin", "castor")],
    steps: ["1 c. ricin + 2 gouttes menthe + 2 gouttes romarin.", "Massage cuir chevelu 5 min.", "Toute la nuit.", "Shampooing matin."] },
  { id: 25, title: "Thé vert & Aloe — Hommes", benefit: "Anti-pellicules", category: ["Hommes", "Cuir chevelu"], duration: "10 min", frequency: "2x/sem", cover: "photo-1615485290382-441e4d049cb5",
    ingredients: [ing("Aloe", "aloe")],
    steps: ["Infusez 2 sachets thé vert.", "Mélangez avec aloe vera.", "Massez cuir chevelu 10 min.", "Rincez."] },
];

export const recipeCategories = ["Tous", "Hydratation", "Protéine", "Croissance", "Cuir chevelu", "Brillance", "Enfants", "Hommes"];

export type Product = {
  id: number;
  name: string;
  brand: string;
  benefit: string;
  url: string;
  price: "€" | "€€" | "€€€";
  rating: number;
  photo: string;
  hairType: string[];
  problem: string[];
};

export const products: Product[] = [
  { id: 1, name: "No.4 Bond Shampoo", brand: "Olaplex", benefit: "Anti-casse", url: "olaplex.com", price: "€€€", rating: 4.9, photo: "photo-1608248597279-f99d160bfcbc", hairType: ["Bouclés"], problem: ["Abîmés"] },
  { id: 2, name: "Curl Manifesto Crème", brand: "Kérastase", benefit: "Anti-sécheresse", url: "kerastase.com", price: "€€€", rating: 4.8, photo: "photo-1585751119414-ef2636f8aede", hairType: ["Bouclés"], problem: ["Sécheresse"] },
  { id: 3, name: "Don't Despair Repair Mask", brand: "Briogeo", benefit: "Hydratation", url: "briogeohair.com", price: "€€", rating: 4.8, photo: "photo-1629198688000-71f23e745b6e", hairType: ["Bouclés"], problem: ["Sécheresse"] },
  { id: 4, name: "Bond Curl Rehab", brand: "Curlsmith", benefit: "Boucles abîmées", url: "curlsmith.com", price: "€€", rating: 4.7, photo: "photo-1571781926291-c477ebfd024b", hairType: ["Bouclés"], problem: ["Abîmés"] },
  { id: 5, name: "Coconut Curl Shampoo", brand: "Shea Moisture", benefit: "Boucles naturelles", url: "sheamoisture.com", price: "€", rating: 4.6, photo: "photo-1556228720-195a672e8a03", hairType: ["Bouclés"], problem: ["Sécheresse"] },
  { id: 6, name: "Shea Butter Leave-In", brand: "Cantu", benefit: "Démêlage crépus", url: "cantubeauty.com", price: "€", rating: 4.7, photo: "photo-1598440947619-2c35fc9aa908", hairType: ["Crépus"], problem: ["Sécheresse"] },
  { id: 7, name: "Rosemary Mint Scalp Oil", brand: "Mielle", benefit: "Croissance", url: "mielleorganics.com", price: "€€", rating: 4.9, photo: "photo-1614707267537-b85aaf00c4b7", hairType: ["Crépus"], problem: ["Chute"] },
  { id: 8, name: "Coconut CoWash", brand: "As I Am", benefit: "Sans sulfates", url: "asiambeauty.com", price: "€", rating: 4.6, photo: "photo-1608248597279-f99d160bfcbc", hairType: ["Crépus"], problem: ["Sécheresse"] },
  { id: 9, name: "Hydrating Shampoo", brand: "Pattern Beauty", benefit: "Aloe vera", url: "patternbeauty.com", price: "€€", rating: 4.8, photo: "photo-1585751119414-ef2636f8aede", hairType: ["Crépus"], problem: ["Sécheresse"] },
  { id: 10, name: "Curl Conditioner", brand: "Fenty Hair", benefit: "Coconut water", url: "fentyhair.com", price: "€€", rating: 4.9, photo: "photo-1629198688000-71f23e745b6e", hairType: ["Crépus"], problem: ["Sécheresse"] },
  { id: 11, name: "Treatment Original", brand: "Moroccanoil", benefit: "Anti-frisottis", url: "moroccanoil.com", price: "€€€", rating: 4.8, photo: "photo-1571781926291-c477ebfd024b", hairType: ["Ondulés"], problem: ["Sécheresse"] },
  { id: 12, name: "Act Right Serum", brand: "The Doux", benefit: "Anti-humidité", url: "thedoux.com", price: "€€", rating: 4.7, photo: "photo-1556228720-195a672e8a03", hairType: ["Ondulés"], problem: ["Sécheresse"] },
  { id: 13, name: "Be Curly Coil Definer", brand: "Aveda", benefit: "Définition", url: "aveda.com", price: "€€", rating: 4.6, photo: "photo-1598440947619-2c35fc9aa908", hairType: ["Ondulés"], problem: ["Sécheresse"] },
  { id: 14, name: "Perfect Hair Day", brand: "Living Proof", benefit: "Volume", url: "livingproof.com", price: "€€€", rating: 4.7, photo: "photo-1614707267537-b85aaf00c4b7", hairType: ["Raides"], problem: ["Chute"] },
  { id: 15, name: "Elvive Extraordinary Oil", brand: "L'Oréal", benefit: "Brillance", url: "loreal-paris.com", price: "€", rating: 4.5, photo: "photo-1608248597279-f99d160bfcbc", hairType: ["Raides"], problem: ["Sécheresse"] },
  { id: 16, name: "Gold Series Moisture", brand: "Pantene", benefit: "Cheveux épais", url: "pantene.com", price: "€", rating: 4.4, photo: "photo-1585751119414-ef2636f8aede", hairType: ["Raides"], problem: ["Sécheresse"] },
  { id: 17, name: "No.3 Hair Perfector", brand: "Olaplex", benefit: "Réparation", url: "olaplex.com", price: "€€€", rating: 5.0, photo: "photo-1629198688000-71f23e745b6e", hairType: ["Tous"], problem: ["Abîmés"] },
  { id: 18, name: "Acidic Bonding Balm", brand: "Redken", benefit: "Pointes fourchues", url: "redken.com", price: "€€", rating: 4.7, photo: "photo-1571781926291-c477ebfd024b", hairType: ["Tous"], problem: ["Abîmés"] },
  { id: 19, name: "Resistance Masquintense", brand: "Kérastase", benefit: "Très abîmés", url: "kerastase.com", price: "€€€", rating: 4.8, photo: "photo-1556228720-195a672e8a03", hairType: ["Tous"], problem: ["Abîmés"] },
  { id: 20, name: "Rosemary Leave-In", brand: "Nécessaire", benefit: "Réparation vegan", url: "necessaire.com", price: "€€", rating: 4.7, photo: "photo-1598440947619-2c35fc9aa908", hairType: ["Tous"], problem: ["Abîmés"] },
  { id: 21, name: "Anti-Dandruff Shampoo", brand: "Nizoral", benefit: "Pellicules grasses", url: "nizoral.com", price: "€€", rating: 4.8, photo: "photo-1614707267537-b85aaf00c4b7", hairType: ["Tous"], problem: ["Pellicules"] },
  { id: 22, name: "Kelual DS", brand: "Ducray", benefit: "Dermite séborrhéique", url: "ducray.com", price: "€€", rating: 4.7, photo: "photo-1608248597279-f99d160bfcbc", hairType: ["Tous"], problem: ["Pellicules"] },
  { id: 23, name: "Detox Water Scalp", brand: "Dr.Groot", benefit: "AHA buildup", url: "drgrootofficial.com", price: "€€", rating: 4.8, photo: "photo-1585751119414-ef2636f8aede", hairType: ["Tous"], problem: ["Pellicules"] },
  { id: 24, name: "Clinical", brand: "Head & Shoulders", benefit: "Pellicules sévères", url: "headandshoulders.com", price: "€", rating: 4.5, photo: "photo-1629198688000-71f23e745b6e", hairType: ["Tous"], problem: ["Pellicules"] },
  { id: 25, name: "Quinine Shampoo", brand: "Klorane", benefit: "Anti-chute", url: "klorane.com", price: "€€", rating: 4.6, photo: "photo-1556228720-195a672e8a03", hairType: ["Tous"], problem: ["Chute"] },
  { id: 26, name: "Density Drops", brand: "Philip Kingsley", benefit: "Chute diffuse", url: "philipkingsley.com", price: "€€€", rating: 4.7, photo: "photo-1598440947619-2c35fc9aa908", hairType: ["Tous"], problem: ["Chute"] },
  { id: 27, name: "Multi-Peptide Serum", brand: "The Ordinary", benefit: "Densité croissance", url: "theordinary.com", price: "€", rating: 4.7, photo: "photo-1614707267537-b85aaf00c4b7", hairType: ["Tous"], problem: ["Chute"] },
  { id: 28, name: "Niacinamide Root Serum", brand: "Pantene", benefit: "Chute oxydative", url: "pantene.com", price: "€€", rating: 4.6, photo: "photo-1608248597279-f99d160bfcbc", hairType: ["Tous"], problem: ["Chute"] },
  { id: 29, name: "Rosemary Mint Oil", brand: "Mielle", benefit: "Follicules", url: "mielleorganics.com", price: "€€", rating: 4.9, photo: "photo-1585751119414-ef2636f8aede", hairType: ["Tous"], problem: ["Chute"] },
  { id: 30, name: "Fiber", brand: "American Crew", benefit: "Tenue", url: "americancrew.com", price: "€€", rating: 4.6, photo: "photo-1629198688000-71f23e745b6e", hairType: ["Tous"], problem: ["Hommes"] },
  { id: 31, name: "True Volume Shampoo", brand: "Jack Black", benefit: "Volume hommes", url: "getjackblack.com", price: "€€", rating: 4.5, photo: "photo-1571781926291-c477ebfd024b", hairType: ["Tous"], problem: ["Hommes"] },
  { id: 32, name: "System 1", brand: "Nioxin", benefit: "Anti-chute hommes", url: "nioxin.com", price: "€€", rating: 4.6, photo: "photo-1556228720-195a672e8a03", hairType: ["Tous"], problem: ["Hommes", "Chute"] },
  { id: 33, name: "Kids Detangler", brand: "SheaMoisture", benefit: "Démêlage enfants", url: "sheamoisture.com", price: "€", rating: 4.8, photo: "photo-1598440947619-2c35fc9aa908", hairType: ["Tous"], problem: ["Enfants"] },
  { id: 34, name: "Care for Kids Shampoo", brand: "Cantu", benefit: "Boucles enfants", url: "cantubeauty.com", price: "€", rating: 4.7, photo: "photo-1614707267537-b85aaf00c4b7", hairType: ["Bouclés"], problem: ["Enfants"] },
  { id: 35, name: "Kids Leave-In", brand: "Mixed Chicks", benefit: "Enfants mixtes", url: "mixedchicks.net", price: "€€", rating: 4.7, photo: "photo-1608248597279-f99d160bfcbc", hairType: ["Bouclés"], problem: ["Enfants"] },
];

export const productHairTypes = ["Tous", "Raides", "Ondulés", "Bouclés", "Crépus"];
export const productProblems = ["Tous", "Sécheresse", "Chute", "Pellicules", "Abîmés", "Hommes", "Enfants"];

export const hairTypePhotos: Record<string, string> = {
  "1a": "photo-1519699047748-de8e457a634e", "1b": "photo-1519699047748-de8e457a634e", "1c": "photo-1519699047748-de8e457a634e",
  "2a": "photo-1492106087820-71f1a00d2b11", "2b": "photo-1492106087820-71f1a00d2b11", "2c": "photo-1492106087820-71f1a00d2b11",
  "3a": "photo-1522337360788-8b13dee7a37e", "3b": "photo-1522337360788-8b13dee7a37e", "3c": "photo-1522337360788-8b13dee7a37e",
  "4a": "photo-1594897030264-ab7d87efc473", "4b": "photo-1594897030264-ab7d87efc473", "4c": "photo-1594897030264-ab7d87efc473",
};

export type Aura = { type: string; name: string; emoji: string; color: string; description: string; affirmations: string[] };

export const auras: Record<string, Aura> = {
  "1a": { type: "1a", name: "Fil de Soie", emoji: "🕊️", color: "#E8E4DC", description: "Une cascade lumineuse, fluide comme un fil de lune. Vos cheveux capturent la douceur du jour et la liberté du vent. Une élégance silencieuse, sans effort.", affirmations: ["Je suis légèreté.", "Ma beauté est pure simplicité.", "Je rayonne en restant moi-même."] },
  "1b": { type: "1b", name: "Lumière Dorée", emoji: "✨", color: "#E8C77A", description: "Un éclat solaire à chaque mouvement. Vos cheveux dansent avec la lumière dorée du matin, doux et confiants.", affirmations: ["Je brille à ma façon.", "Ma chaleur attire l'abondance.", "Je suis lumière."] },
  "1c": { type: "1c", name: "Obsidienne Lisse", emoji: "🖤", color: "#2A2A2A", description: "Un noir profond comme la nuit, lisse et puissant. Une force tranquille qui inspire le respect.", affirmations: ["Je suis profondeur.", "Ma présence est mémorable.", "Je suis intense et serein."] },
  "2a": { type: "2a", name: "Vague de Perle", emoji: "🌊", color: "#F0E8D8", description: "Des ondes tendres comme un coquillage nacré. Une beauté changeante, mystérieuse comme la marée.", affirmations: ["Je suis fluide.", "Mes ondulations sont uniques.", "Je m'adapte avec grâce."] },
  "2b": { type: "2b", name: "Brise Dorée", emoji: "🌾", color: "#D4B97A", description: "Un champ de blé caressé par le vent. Naturel, doré, libre.", affirmations: ["Je grandis librement.", "Je suis enracinée et légère.", "Ma nature est mon pouvoir."] },
  "2c": { type: "2c", name: "Tempête Dorée", emoji: "🌪️", color: "#C9956A", description: "Des vagues sauvages, ambrées, indomptables. Une énergie qui ne se contient pas.", affirmations: ["Je suis puissance.", "Je trouve la beauté dans le chaos.", "Mon énergie inspire."] },
  "3a": { type: "3a", name: "Rose Nacré", emoji: "🌸", color: "#F4C7CB", description: "Des boucles douces comme des pétales. Une féminité tendre, romantique, lumineuse.", affirmations: ["Je suis douceur.", "Ma délicatesse est ma force.", "Je m'aime tendrement."] },
  "3b": { type: "3b", name: "Fleur Sauvage", emoji: "🌺", color: "#E8949A", description: "Vos boucles éclatent comme une fleur tropicale. Joyeuse, exubérante, vibrante.", affirmations: ["Je m'épanouis.", "Mes boucles racontent mon histoire.", "Je vis pleinement."] },
  "3c": { type: "3c", name: "Velours Profond", emoji: "🌹", color: "#B85565", description: "Des spirales denses comme un velours rose foncé. Une beauté somptueuse, intense.", affirmations: ["Je suis luxe.", "Mes boucles sont mon trône.", "Je rayonne d'amour-propre."] },
  "4a": { type: "4a", name: "Couronne d'Ébène", emoji: "👑", color: "#5C3A6E", description: "Une couronne royale, dense et sacrée. Vos cheveux racontent une lignée de force et de fierté.", affirmations: ["Je suis souveraine.", "Ma couronne m'appartient.", "Je suis l'héritière de ma beauté."] },
  "4b": { type: "4b", name: "Âme de Feu", emoji: "🔥", color: "#A0522D", description: "Des coils en zigzag comme une flamme ambrée. Une force ancestrale, brûlante de vie.", affirmations: ["Je suis feu.", "Mes coils sont sagesse.", "Je transforme tout en lumière."] },
  "4c": { type: "4c", name: "Couronne de Velours", emoji: "💜", color: "#4B2E5C", description: "Une densité profonde, riche, mystique. La beauté la plus brute, la plus puissante.", affirmations: ["Je suis racine.", "Ma densité est ma magie.", "Je suis pure royauté."] },
};

export const planDays = [
  // SEMAINE 1
  { day: 1, week: 1, phase: "Bilan & Reset", task: "Shampoing clarifiant pour repartir à zéro", link: { type: "recipe", id: 17 } },
  { day: 2, week: 1, phase: "Bilan & Reset", task: "Photos avant et mesure de longueur" },
  { day: 3, week: 1, phase: "Bilan & Reset", task: "Évaluation cuir chevelu — observez démangeaisons" },
  { day: 4, week: 1, phase: "Bilan & Reset", task: "Bain d'huile coco tiède 30 min" },
  { day: 5, week: 1, phase: "Bilan & Reset", task: "Massage cuir chevelu 5 min" },
  { day: 6, week: 1, phase: "Bilan & Reset", task: "Démarrer le tracker quotidien" },
  { day: 7, week: 1, phase: "Bilan & Reset", task: "Shampoing doux + leave-in léger" },
  // SEMAINE 2
  { day: 8, week: 2, phase: "Hydratation Intense", task: "Masque DIY avocat-miel-aloe (45 min)", link: { type: "recipe", id: 1 } },
  { day: 9, week: 2, phase: "Hydratation Intense", task: "Méthode LOC (Liquide-Huile-Crème)" },
  { day: 10, week: 2, phase: "Hydratation Intense", task: "No-heat day — coiffure protectrice" },
  { day: 11, week: 2, phase: "Hydratation Intense", task: "Spritz hydratant matin + soir", link: { type: "recipe", id: 13 } },
  { day: 12, week: 2, phase: "Hydratation Intense", task: "Deep mask hydratant 30 min" },
  { day: 13, week: 2, phase: "Hydratation Intense", task: "Co-wash doux (sans sulfates)" },
  { day: 14, week: 2, phase: "Hydratation Intense", task: "Pineapple method pour la nuit" },
  // SEMAINE 3
  { day: 15, week: 3, phase: "Force & Croissance", task: "Traitement protéine œuf-yaourt", link: { type: "recipe", id: 6 } },
  { day: 16, week: 3, phase: "Force & Croissance", task: "Massage huile de ricin 10 min", link: { type: "recipe", id: 11 } },
  { day: 17, week: 3, phase: "Force & Croissance", task: "Rinçage romarin après shampooing", link: { type: "recipe", id: 13 } },
  { day: 18, week: 3, phase: "Force & Croissance", task: "Mesure longueur intermédiaire" },
  { day: 19, week: 3, phase: "Force & Croissance", task: "Eau de riz fermentée en rinçage", link: { type: "recipe", id: 21 } },
  { day: 20, week: 3, phase: "Force & Croissance", task: "Coiffure protectrice 24h" },
  { day: 21, week: 3, phase: "Force & Croissance", task: "Hydratation post-protéine" },
  // SEMAINE 4
  { day: 22, week: 4, phase: "Brillance & Maintenance", task: "Rinçage vinaigre de cidre", link: { type: "recipe", id: 17 } },
  { day: 23, week: 4, phase: "Brillance & Maintenance", task: "Sérum brillance pointes", link: { type: "product", id: 15 } },
  { day: 24, week: 4, phase: "Brillance & Maintenance", task: "Trim léger des fourches" },
  { day: 25, week: 4, phase: "Brillance & Maintenance", task: "Routine LOC finale" },
  { day: 26, week: 4, phase: "Brillance & Maintenance", task: "Massage final 10 min" },
  { day: 27, week: 4, phase: "Brillance & Maintenance", task: "Masque hydratant léger" },
  { day: 28, week: 4, phase: "Brillance & Maintenance", task: "Photo après — comparez à J1" },
  { day: 29, week: 4, phase: "Brillance & Maintenance", task: "Notez vos 3 plus belles victoires" },
  { day: 30, week: 4, phase: "Brillance & Maintenance", task: "🎉 Célébration ! Partagez votre transformation." },
];

export const tipsDont = [
  "Brosser cheveux bouclés à sec — utilisez peigne large sur cheveux humides + conditioner.",
  "Eau très chaude sous la douche — préférez tiède, finissez à l'eau fraîche.",
  "Frotter avec serviette rugueuse — tamponnez avec t-shirt en coton ou serviette microfibre.",
  "Dormir cheveux mouillés sur coton — taie en satin ou bonnet en soie.",
  "Élastiques caoutchouc directement — utilisez scrunchies en satin.",
  "Chaleur sans protecteur thermique — toujours appliquer un spray avant fer/sèche-cheveux.",
  "Même shampoing tous les jours — alternez selon vos besoins.",
  "Jamais de clarifiant — 1x/mois pour éliminer les résidus.",
  "Conditionneur sur racines — uniquement longueurs et pointes.",
  "Laver trop souvent cuir chevelu gras — cela stimule encore plus de sébum.",
  "Sulfates sur bouclés/colorés — préférez shampoings doux sans sulfates.",
  "Silicones non hydrosolubles sans clarifiant — ils s'accumulent.",
  "Huile minérale sur cheveux naturels — préférez huiles végétales.",
  "Trop de protéines sans hydratation — équilibre essentiel.",
  "Trop d'hydratation sans protéines — cheveux mous et cassants.",
  "Huiles essentielles pures sur cuir chevelu — toujours diluer dans huile végétale.",
  "Jus de citron pur en masque — dessèche et photosensibilise.",
  "Bicarbonate comme shampoing — pH trop alcalin, abîme la fibre.",
];

export const tipsDo = {
  Matin: [
    "Rafraîchissez vos boucles avec spritz eau + leave-in.",
    "Taie d'oreiller satin = -43% de frisottis.",
    "Pineapple method la nuit pour préserver les boucles.",
  ],
  Semaine: [
    "Deep condition 1x/semaine.",
    "Clarifiant 1x/mois.",
    "Traitement protéine 1x/mois.",
    "Coupe des pointes toutes les 8-12 semaines.",
  ],
  Nutrition: [
    "Fer : épinards, lentilles.",
    "Biotine : œufs, noix.",
    "Oméga-3 : saumon, lin.",
    "Zinc : graines de courge.",
    "Vitamine D : soleil, poisson gras.",
    "Silice : concombre.",
    "2 L d'eau / jour.",
    "Éviter excès sucre et alcool.",
  ],
  Saisons: [
    "Été : protection UV (chapeau, sérum UV).",
    "Hiver : anti-statique, plus d'huiles.",
    "Saison des pluies : sérum anti-humidité.",
  ],
};

export const dailyTips = [
  "Le massage du cuir chevelu 4 min/jour stimule la croissance de 20%.",
  "Buvez 2L d'eau pour des cheveux hydratés de l'intérieur.",
  "Coupez vos pointes toutes les 10 semaines.",
  "Dormez sur une taie en satin pour réduire la casse.",
  "L'huile de romarin = aussi efficace que le minoxidil 2% (étude 2015).",
  "Démêlez TOUJOURS avec conditioner et peigne à dents larges.",
  "Évitez l'eau chaude : ouvre les cuticules.",
];