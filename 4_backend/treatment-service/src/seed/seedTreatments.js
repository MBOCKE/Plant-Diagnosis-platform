require('dotenv').config();
const mongoose = require('mongoose');
const Treatment = require('../models/Treatment');

const treatments = [
  // ============================================
  // TOMATO - EARLY BLIGHT
  // ============================================
  {
    cropType: 'tomato',
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani',
    urgency: 'treat_soon',
    urgencyLabel: {
      en: 'Treat Soon (within 3 days)',
      fr: 'Traiter bientôt (dans les 3 jours)',
    },
    cultural: {
      en: [
        'Remove all leaves with brown spots and burn them far from the field',
        'Space tomato plants at least 2 arm lengths apart so air can pass',
        'Water the soil directly, never wet the leaves',
        'Spread dry grass or straw on the soil to stop soil from splashing onto leaves',
        'After harvest, burn all old tomato plants before planting again',
      ],
      fr: [
        'Retirez toutes les feuilles avec des taches brunes et brûlez-les loin du champ',
        'Espacez les plants de tomates d\'au moins 2 longueurs de bras pour que l\'air circule',
        'Arrosez directement le sol, ne mouillez jamais les feuilles',
        'Étalez de l\'herbe sèche ou de la paille sur le sol pour éviter les éclaboussures sur les feuilles',
        'Après la récolte, brûlez tous les vieux plants de tomates avant de replanter',
      ],
    },
    biological: {
      en: [
        'Crush 2 handfuls of neem leaves in 5 liters of water, leave overnight, strain and spray every 5 days',
        'Mix wood ash with water (1 cup ash in 5 liters), spray on leaves early morning',
      ],
      fr: [
        'Écrasez 2 poignées de feuilles de neem dans 5 litres d\'eau, laissez reposer une nuit, filtrez et pulvérisez tous les 5 jours',
        'Mélangez de la cendre de bois avec de l\'eau (1 tasse de cendre dans 5 litres), pulvérisez sur les feuilles tôt le matin',
      ],
    },
    chemical: {
      en: [
        'Buy "Mancozeb" (yellow-white powder) from agro-dealer. Mix 1 bottle cap in 15 liters of water. Spray every 7 days',
        'Buy "Copper fungicide" (blue powder). Mix 1 small spoon in 15 liters of water. Spray every 7-10 days',
        'ALTERNATE between Mancozeb and Copper - do not use same one every time',
      ],
      fr: [
        'Achetez "Mancozeb" (poudre jaune-blanche) chez le revendeur agricole. Mélangez 1 bouchon dans 15 litres d\'eau. Pulvérisez tous les 7 jours',
        'Achetez "Fongicide au cuivre" (poudre bleue). Mélangez 1 petite cuillère dans 15 litres d\'eau. Pulvérisez tous les 7-10 jours',
        'ALTERNEZ entre Mancozeb et Cuivre - n\'utilisez pas le même à chaque fois',
      ],
    },
    precautions: {
      en: [
        'Wear long sleeves, gloves, and cover your nose/mouth when mixing or spraying',
        'Do not harvest tomatoes for 7 days after spraying any chemical',
        'Spray early morning before sun is hot or late evening when bees have gone',
        'Keep all chemicals locked away from children',
      ],
      fr: [
        'Portez des manches longues, des gants, et couvrez votre nez/bouche lors du mélange ou de la pulvérisation',
        'Ne récoltez pas les tomates pendant 7 jours après avoir pulvérisé un produit chimique',
        'Pulvérisez tôt le matin avant que le soleil ne chauffe ou tard le soir quand les abeilles sont parties',
        'Gardez tous les produits chimiques sous clé, loin des enfants',
      ],
    },
  },

  // ============================================
  // TOMATO - LATE BLIGHT
  // ============================================
  {
    cropType: 'tomato',
    diseaseName: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    urgency: 'treat_immediately',
    urgencyLabel: {
      en: 'Treat IMMEDIATELY (today!)',
      fr: 'Traiter IMMÉDIATEMENT (aujourd\'hui !)',
    },
    cultural: {
      en: [
        'This disease KILLS FAST. Remove ALL sick plants NOW and burn them far away',
        'NEVER put infected plants in your compost pile',
        'Make drainage channels so water does not sit in the field',
        'Plant tomatoes where wind can pass freely - avoid planting near walls or thick bushes',
        'Tell your neighbors to check their tomatoes too - this disease spreads very fast',
      ],
      fr: [
        'Cette maladie TUE VITE. Retirez TOUTES les plantes malades MAINTENANT et brûlez-les loin',
        'Ne mettez JAMAIS les plantes infectées dans votre compost',
        'Faites des canaux de drainage pour que l\'eau ne stagne pas dans le champ',
        'Plantez les tomates là où le vent passe librement - évitez de planter près des murs ou des buissons épais',
        'Dites à vos voisins de vérifier leurs tomates aussi - cette maladie se propage très vite',
      ],
    },
    biological: {
      en: [
        'Spray a mixture of 1 liter sour milk/buttermilk in 10 liters water every 5 days as prevention',
        'Garlic spray: crush 5 whole garlic bulbs, soak in 2 liters water overnight, strain, add 8 more liters water, spray weekly',
      ],
      fr: [
        'Pulvérisez un mélange de 1 litre de lait caillé dans 10 litres d\'eau tous les 5 jours en prévention',
        'Spray à l\'ail : écrasez 5 bulbes d\'ail entiers, faites tremper dans 2 litres d\'eau une nuit, filtrez, ajoutez 8 litres d\'eau, pulvérisez chaque semaine',
      ],
    },
    chemical: {
      en: [
        'Buy "Ridomil Gold" (blue sachet) from agro-dealer. Mix 1 sachet in 15 liters water. This is the strongest medicine',
        'Buy "Chlorothalonil" - mix 1 bottle cap in 15 liters water, spray every 5-7 days when weather is wet',
        'Start spraying BEFORE you see symptoms if rain is frequent',
      ],
      fr: [
        'Achetez "Ridomil Gold" (sachet bleu) chez le revendeur agricole. Mélangez 1 sachet dans 15 litres d\'eau. C\'est le médicament le plus fort',
        'Achetez "Chlorothalonil" - mélangez 1 bouchon dans 15 litres d\'eau, pulvérisez tous les 5-7 jours par temps humide',
        'Commencez à pulvériser AVANT de voir les symptômes si la pluie est fréquente',
      ],
    },
    precautions: {
      en: [
        'THIS DISEASE CAN DESTROY YOUR WHOLE FIELD IN 3 DAYS - act immediately',
        'Wear full protection: gloves, mask, long clothes, shoes',
        'Do not harvest for 14 days after spraying',
        'Wash hands and clothes thoroughly after spraying',
        'Mark the date you sprayed so you know when it is safe to harvest',
      ],
      fr: [
        'CETTE MALADIE PEUT DÉTRUIRE VOTRE CHAMP ENTIER EN 3 JOURS - agissez immédiatement',
        'Portez une protection complète : gants, masque, vêtements longs, chaussures',
        'Ne récoltez pas pendant 14 jours après la pulvérisation',
        'Lavez-vous soigneusement les mains et les vêtements après la pulvérisation',
        'Marquez la date de pulvérisation pour savoir quand la récolte est sans danger',
      ],
    },
  },

  // ============================================
  // TOMATO - TYLCV
  // ============================================
  {
    cropType: 'tomato',
    diseaseName: 'TYLCV',
    scientificName: 'Tomato Yellow Leaf Curl Virus',
    urgency: 'treat_immediately',
    urgencyLabel: {
      en: 'Treat IMMEDIATELY - Remove infected plants!',
      fr: 'Traiter IMMÉDIATEMENT - Retirez les plantes infectées !',
    },
    cultural: {
      en: [
        '⚠️ THIS IS A VIRUS - NO CHEMICAL CAN CURE IT ⚠️',
        'REMOVE the sick plant completely and BURN it far away immediately',
        'The disease is spread by tiny white flies. Control the flies to protect other plants',
        'Plant marigold flowers near tomatoes - they push away white flies',
        'Use yellow sticky traps (paint a board yellow, spread grease on it, place near plants)',
        'Cover young plants with fine netting or old curtain material to keep flies away',
        'For next season, buy seeds labeled "TYLCV resistant" or "tolerant"',
      ],
      fr: [
        '⚠️ C\'EST UN VIRUS - AUCUN PRODUIT CHIMIQUE NE PEUT LE GUÉRIR ⚠️',
        'RETIREZ la plante malade complètement et BRÛLEZ-la loin immédiatement',
        'La maladie est propagée par de petites mouches blanches. Contrôlez les mouches pour protéger les autres plantes',
        'Plantez des fleurs de souci près des tomates - elles repoussent les mouches blanches',
        'Utilisez des pièges jaunes collants (peignez une planche en jaune, étalez de la graisse dessus, placez près des plantes)',
        'Couvrez les jeunes plants avec une moustiquaire fine ou un vieux rideau pour éloigner les mouches',
        'Pour la prochaine saison, achetez des semences étiquetées "résistant au TYLCV" ou "tolérant"',
      ],
    },
    biological: {
      en: [
        'Spray neem oil solution every 4 days on the underside of leaves where flies hide',
        'Plant basil, mint, or coriander between tomato rows - these herbs push away white flies',
      ],
      fr: [
        'Pulvérisez une solution d\'huile de neem tous les 4 jours sous les feuilles où les mouches se cachent',
        'Plantez du basilic, de la menthe ou de la coriandre entre les rangs de tomates - ces herbes repoussent les mouches blanches',
      ],
    },
    chemical: {
      en: [
        '⚠️ NO CHEMICAL CAN CURE TYLCV - the virus is inside the plant ⚠️',
        'To control white flies: Buy "Acetamiprid" or "Imidacloprid" from agro-dealer. Mix 1 small spoon in 15 liters water',
        'Spray UNDER the leaves where white flies hide, not on top',
        'Spray early morning when flies are slow',
      ],
      fr: [
        '⚠️ AUCUN PRODUIT CHIMIQUE NE PEUT GUÉRIR LE TYLCV - le virus est à l\'intérieur de la plante ⚠️',
        'Pour contrôler les mouches blanches : Achetez "Acetamiprid" ou "Imidacloprid" chez le revendeur. Mélangez 1 petite cuillère dans 15 litres d\'eau',
        'Pulvérisez SOUS les feuilles où les mouches blanches se cachent, pas dessus',
        'Pulvérisez tôt le matin quand les mouches sont lentes',
      ],
    },
    precautions: {
      en: [
        'NEVER compost or feed infected plants to animals - BURN THEM',
        'Clean your tools with bleach or fire after touching sick plants',
        'Wash hands before touching healthy plants',
        'Check your field EVERY DAY for 2 weeks after removing sick plants',
        'If you see white flies, act fast before they spread the virus',
      ],
      fr: [
        'NE JAMAIS composter ou donner les plantes infectées aux animaux - BRÛLEZ-LES',
        'Nettoyez vos outils avec de l\'eau de javel ou du feu après avoir touché des plantes malades',
        'Lavez-vous les mains avant de toucher des plantes saines',
        'Vérifiez votre champ CHAQUE JOUR pendant 2 semaines après avoir retiré les plantes malades',
        'Si vous voyez des mouches blanches, agissez vite avant qu\'elles ne propagent le virus',
      ],
    },
  },

  // ============================================
  // TOMATO - BACTERIAL SPOT
  // ============================================
  {
    cropType: 'tomato',
    diseaseName: 'Bacterial Spot',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    urgency: 'treat_soon',
    urgencyLabel: {
      en: 'Treat Soon (within 5 days)',
      fr: 'Traiter bientôt (dans les 5 jours)',
    },
    cultural: {
      en: [
        'Remove leaves with many spots and burn them',
        'Do NOT work in the field when plants are wet - you will spread the bacteria',
        'Water at the base of plants, never splash water on leaves',
        'After this season, plant maize or beans in this field, not tomatoes or peppers',
        'Remove all plant leftovers after harvest and burn them',
      ],
      fr: [
        'Retirez les feuilles avec beaucoup de taches et brûlez-les',
        'Ne travaillez PAS dans le champ quand les plantes sont mouillées - vous propagerez les bactéries',
        'Arrosez à la base des plantes, ne projetez jamais d\'eau sur les feuilles',
        'Après cette saison, plantez du maïs ou des haricots dans ce champ, pas de tomates ni de poivrons',
        'Retirez tous les restes de plantes après la récolte et brûlez-les',
      ],
    },
    biological: {
      en: [
        'Spray a mixture of wood ash and water (2 cups ash in 10 liters water) every 5 days',
        'Copper soap spray: dissolve 1 small piece of traditional black soap + 1 spoon copper powder in 10 liters water',
      ],
      fr: [
        'Pulvérisez un mélange de cendre de bois et d\'eau (2 tasses de cendre dans 10 litres d\'eau) tous les 5 jours',
        'Spray au savon de cuivre : dissolvez 1 petit morceau de savon noir traditionnel + 1 cuillère de poudre de cuivre dans 10 litres d\'eau',
      ],
    },
    chemical: {
      en: [
        'Buy "Copper hydroxide" (blue powder) from agro-dealer. Mix 1 small spoon in 15 liters water. Spray every 5 days',
        'Buy "Mancozeb" (yellow-white powder). Mix 1 bottle cap + 1 small spoon copper in 15 liters water',
        'Spray early morning, and always after heavy rain',
      ],
      fr: [
        'Achetez "Hydroxyde de cuivre" (poudre bleue) chez le revendeur. Mélangez 1 petite cuillère dans 15 litres d\'eau. Pulvérisez tous les 5 jours',
        'Achetez "Mancozeb" (poudre jaune-blanche). Mélangez 1 bouchon + 1 petite cuillère de cuivre dans 15 litres d\'eau',
        'Pulvérisez tôt le matin, et toujours après une forte pluie',
      ],
    },
    precautions: {
      en: [
        'Bacteria spread by touch and water - be careful when handling plants',
        'Clean tools with fire or bleach between plants',
        'Do not harvest for 7 days after spraying',
        'Wash hands after working in the field',
      ],
      fr: [
        'Les bactéries se propagent par le toucher et l\'eau - soyez prudent en manipulant les plantes',
        'Nettoyez les outils avec du feu ou de l\'eau de javel entre les plantes',
        'Ne récoltez pas pendant 7 jours après la pulvérisation',
        'Lavez-vous les mains après avoir travaillé dans le champ',
      ],
    },
  },

  // ============================================
  // TOMATO - HEALTHY
  // ============================================
  {
    cropType: 'tomato',
    diseaseName: 'Healthy',
    scientificName: 'N/A',
    urgency: 'monitor',
    urgencyLabel: {
      en: 'No action needed - Monitor',
      fr: 'Aucune action nécessaire - Surveiller',
    },
    cultural: {
      en: [
        'Your plant looks healthy! Keep doing what you are doing',
        'Check your plants every 3-4 days for any changes',
        'Remove weeds that grow near your tomatoes',
        'Water regularly but not too much - the soil should be moist, not wet',
      ],
      fr: [
        'Votre plante semble en bonne santé ! Continuez ce que vous faites',
        'Vérifiez vos plantes tous les 3-4 jours pour tout changement',
        'Retirez les mauvaises herbes qui poussent près de vos tomates',
        'Arrosez régulièrement mais pas trop - le sol doit être humide, pas détrempé',
      ],
    },
    biological: { en: [], fr: [] },
    chemical: { en: [], fr: [] },
    precautions: {
      en: [
        'Prevention is easier than cure - check your field regularly',
        'If you see any spots or color changes, take a photo and diagnose again',
      ],
      fr: [
        'La prévention est plus facile que la guérison - vérifiez votre champ régulièrement',
        'Si vous voyez des taches ou des changements de couleur, prenez une photo et diagnostiquez à nouveau',
      ],
    },
  },

  // ============================================
  // BANANA - BLACK SIGATOKA
  // ============================================
  {
    cropType: 'banana_plantain',
    diseaseName: 'Black Sigatoka',
    scientificName: 'Mycosphaerella fijiensis',
    urgency: 'treat_soon',
    urgencyLabel: {
      en: 'Treat Soon (within 5 days)',
      fr: 'Traiter bientôt (dans les 5 jours)',
    },
    cultural: {
      en: [
        'Cut off leaves that have many dark streaks and burn them far from the field',
        'Remove extra suckers (small plants) so air can flow between plants',
        'Make sure water drains well - banana roots should not sit in water',
        'Plant bananas with enough space - at least 3 big steps between each plant',
        'Do not plant new bananas right next to old infected ones',
      ],
      fr: [
        'Coupez les feuilles qui ont beaucoup de stries sombres et brûlez-les loin du champ',
        'Retirez les rejets supplémentaires (petits plants) pour que l\'air circule entre les plantes',
        'Assurez-vous que l\'eau draine bien - les racines de bananier ne doivent pas tremper dans l\'eau',
        'Plantez les bananiers avec assez d\'espace - au moins 3 grands pas entre chaque plant',
        'Ne plantez pas de nouveaux bananiers juste à côté des anciens infectés',
      ],
    },
    biological: {
      en: [
        'Mix compost or animal manure tea: soak 1 bucket of compost in 5 buckets water for 3 days, strain, spray on leaves',
        'Spread ash from cooking fire around the base of banana plants to strengthen them',
      ],
      fr: [
        'Thé de compost ou de fumier : faites tremper 1 seau de compost dans 5 seaux d\'eau pendant 3 jours, filtrez, pulvérisez sur les feuilles',
        'Répandez de la cendre de cuisine autour de la base des bananiers pour les renforcer',
      ],
    },
    chemical: {
      en: [
        'Buy "Propiconazole" (Tilt) or "Tebuconazole" (Folicur) from agro-dealer. Mix 1 small spoon in 15 liters water',
        'Buy "Azoxystrobin" - mix 1 bottle cap in 15 liters water',
        'IMPORTANT: Change chemical each time. Do not use same one twice in a row',
        'Spray every 14-21 days during rainy season, less often in dry season',
      ],
      fr: [
        'Achetez "Propiconazole" (Tilt) ou "Tebuconazole" (Folicur) chez le revendeur. Mélangez 1 petite cuillère dans 15 litres d\'eau',
        'Achetez "Azoxystrobine" - mélangez 1 bouchon dans 15 litres d\'eau',
        'IMPORTANT : Changez de produit chimique à chaque fois. N\'utilisez pas le même deux fois de suite',
        'Pulvérisez tous les 14-21 jours pendant la saison des pluies, moins souvent en saison sèche',
      ],
    },
    precautions: {
      en: [
        'Change chemical types - using same one every time makes the disease stronger',
        'Wear gloves, mask, and cover your body when spraying',
        'Do not harvest for 14 days after spraying',
        'Do not spray if rain is expected within 6 hours',
        'Keep children and animals away from sprayed area for 1 day',
      ],
      fr: [
        'Changez de type de produit chimique - utiliser le même à chaque fois rend la maladie plus forte',
        'Portez des gants, un masque et couvrez votre corps lors de la pulvérisation',
        'Ne récoltez pas pendant 14 jours après la pulvérisation',
        'Ne pulvérisez pas si la pluie est prévue dans les 6 heures',
        'Éloignez les enfants et les animaux de la zone traitée pendant 1 jour',
      ],
    },
  },

  // ============================================
  // BANANA - BBTV
  // ============================================
  {
    cropType: 'banana_plantain',
    diseaseName: 'BBTV',
    scientificName: 'Banana Bunchy Top Virus',
    urgency: 'treat_immediately',
    urgencyLabel: {
      en: 'Treat IMMEDIATELY - Remove infected plants!',
      fr: 'Traiter IMMÉDIATEMENT - Retirez les plantes infectées !',
    },
    cultural: {
      en: [
        '⚠️ THIS IS A VIRUS - NO CHEMICAL CAN CURE IT ⚠️',
        'REMOVE the sick plant NOW - dig it out with roots and BURN everything',
        'The disease is spread by tiny black banana aphids on the leaves',
        'SPRAY for aphids FIRST, wait 2 days, THEN remove the sick plant - this stops aphids from flying to healthy plants',
        'When getting new suckers for planting, ONLY take from plants you know are healthy',
        'NEVER take suckers from a plant that looks strange or has small bunched leaves',
        'Mark the spot where you removed the sick plant - do not plant banana there for 1 year',
      ],
      fr: [
        '⚠️ C\'EST UN VIRUS - AUCUN PRODUIT CHIMIQUE NE PEUT LE GUÉRIR ⚠️',
        'RETIREZ la plante malade MAINTENANT - déterrez-la avec les racines et BRÛLEZ tout',
        'La maladie est propagée par de minuscules pucerons noirs du bananier sur les feuilles',
        'PULVÉRISEZ d\'abord pour les pucerons, attendez 2 jours, PUIS retirez la plante malade - cela empêche les pucerons de voler vers les plantes saines',
        'Lorsque vous prenez de nouveaux rejets pour planter, prenez-les UNIQUEMENT de plantes que vous savez saines',
        'Ne prenez JAMAIS de rejets d\'une plante qui semble étrange ou qui a de petites feuilles groupées',
        'Marquez l\'endroit où vous avez retiré la plante malade - n\'y plantez pas de bananier pendant 1 an',
      ],
    },
    biological: {
      en: [
        'Spray neem oil or crushed neem leaf solution every 4 days to control aphids',
        'Encourage ladybugs in your field - they eat aphids. Plant flowers like sunflowers nearby',
      ],
      fr: [
        'Pulvérisez de l\'huile de neem ou une solution de feuilles de neem écrasées tous les 4 jours pour contrôler les pucerons',
        'Encouragez les coccinelles dans votre champ - elles mangent les pucerons. Plantez des fleurs comme des tournesols à proximité',
      ],
    },
    chemical: {
      en: [
        '⚠️ NO CHEMICAL CAN CURE BBTV - the virus is inside the plant ⚠️',
        'To kill aphids BEFORE removing plant: Buy "Imidacloprid" from agro-dealer, mix 1 small spoon in 15 liters water, spray on infected plant',
        'For healthy plants nearby: spray with insecticidal soap (or dissolve 1 spoon of liquid soap in 10 liters water)',
      ],
      fr: [
        '⚠️ AUCUN PRODUIT CHIMIQUE NE PEUT GUÉRIR LE BBTV - le virus est à l\'intérieur de la plante ⚠️',
        'Pour tuer les pucerons AVANT de retirer la plante : Achetez "Imidaclopride" chez le revendeur, mélangez 1 petite cuillère dans 15 litres d\'eau, pulvérisez sur la plante infectée',
        'Pour les plantes saines à proximité : pulvérisez avec du savon insecticide (ou dissolvez 1 cuillère de savon liquide dans 10 litres d\'eau)',
      ],
    },
    precautions: {
      en: [
        'KILL THE APHIDS FIRST, then remove the plant - this order is very important',
        'Burn all parts of the infected plant - do not feed to animals',
        'Clean your machete and tools with fire or bleach after use',
        'Tell agricultural extension officers if you see many plants with this problem',
        'Always use clean planting material from trusted sources',
      ],
      fr: [
        'TUEZ D\'ABORD LES PUCERONS, puis retirez la plante - cet ordre est très important',
        'Brûlez toutes les parties de la plante infectée - ne donnez pas aux animaux',
        'Nettoyez votre machette et vos outils avec du feu ou de l\'eau de javel après utilisation',
        'Informez les agents de vulgarisation agricole si vous voyez beaucoup de plantes avec ce problème',
        'Utilisez toujours du matériel de plantation propre provenant de sources fiables',
      ],
    },
  },

  // ============================================
  // BANANA - FUSARIUM WILT
  // ============================================
  {
    cropType: 'banana_plantain',
    diseaseName: 'Fusarium Wilt',
    scientificName: 'Fusarium oxysporum f. sp. cubense',
    urgency: 'treat_immediately',
    urgencyLabel: {
      en: 'Treat IMMEDIATELY',
      fr: 'Traiter IMMÉDIATEMENT',
    },
    cultural: {
      en: [
        'This fungus lives in the soil for MANY YEARS. Remove sick plant with ALL roots and soil around it',
        'BURN the removed plant and soil together - do NOT leave on the ground',
        'MARK the spot clearly - never plant banana there again',
        'Do NOT move soil from this area to other parts of your farm',
        'Clean your boots and tools completely before going to other banana fields',
        'If possible, plant a different crop (maize, cassava) in that spot for 3-4 years',
      ],
      fr: [
        'Ce champignon vit dans le sol pendant DE NOMBREUSES ANNÉES. Retirez la plante malade avec TOUTES les racines et la terre autour',
        'BRÛLEZ la plante retirée et la terre ensemble - ne laissez PAS par terre',
        'MARQUEZ clairement l\'endroit - n\'y replantez jamais de bananier',
        'Ne déplacez PAS de terre de cette zone vers d\'autres parties de votre ferme',
        'Nettoyez complètement vos bottes et outils avant d\'aller dans d\'autres champs de bananes',
        'Si possible, plantez une culture différente (maïs, manioc) à cet endroit pendant 3-4 ans',
      ],
    },
    biological: {
      en: [
        'Mix wood ash heavily into the soil around healthy plants to slow the fungus',
        'Add plenty of compost or animal manure to soil - healthy soil fights fungus better',
        'Plant marigold flowers - their roots release substances that reduce soil fungus',
      ],
      fr: [
        'Incorporez abondamment de la cendre de bois dans le sol autour des plantes saines pour ralentir le champignon',
        'Ajoutez beaucoup de compost ou de fumier animal au sol - un sol sain combat mieux le champignon',
        'Plantez des fleurs de souci - leurs racines libèrent des substances qui réduisent les champignons du sol',
      ],
    },
    chemical: {
      en: [
        '⚠️ Limited chemical options for soil fungus ⚠️',
        'Buy "Carbendazim" from agro-dealer. Mix 1 small spoon in 10 liters water. Pour around base of HEALTHY plants nearby as protection',
        'There is NO cure for already infected plants - removal is the only option',
      ],
      fr: [
        '⚠️ Options chimiques limitées pour les champignons du sol ⚠️',
        'Achetez "Carbendazime" chez le revendeur. Mélangez 1 petite cuillère dans 10 litres d\'eau. Versez autour de la base des plantes SAINES à proximité comme protection',
        'Il n\'y a PAS de remède pour les plantes déjà infectées - l\'élimination est la seule option',
      ],
    },
    precautions: {
      en: [
        'This fungus stays in soil for DECADES - prevention is everything',
        'NEVER move soil from infected area to healthy fields',
        'Clean shoes and tools with bleach water (1 cup bleach in 10 cups water)',
        'Consider planting resistant banana varieties in future - ask agro-dealer for "Fusarium resistant" types',
        'Do not share tools with neighboring farms without cleaning them first',
      ],
      fr: [
        'Ce champignon reste dans le sol pendant des DÉCENNIES - la prévention est essentielle',
        'Ne déplacez JAMAIS de terre d\'une zone infectée vers des champs sains',
        'Nettoyez les chaussures et les outils avec de l\'eau de javel (1 tasse de javel dans 10 tasses d\'eau)',
        'Envisagez de planter des variétés de bananes résistantes à l\'avenir - demandez au revendeur des types "résistants au Fusarium"',
        'Ne partagez pas d\'outils avec les fermes voisines sans les nettoyer d\'abord',
      ],
    },
  },

  // ============================================
  // BANANA - HEALTHY
  // ============================================
  {
    cropType: 'banana_plantain',
    diseaseName: 'Healthy',
    scientificName: 'N/A',
    urgency: 'monitor',
    urgencyLabel: {
      en: 'No action needed - Monitor',
      fr: 'Aucune action nécessaire - Surveiller',
    },
    cultural: {
      en: [
        'Your banana/plantain looks healthy! Keep up the good work',
        'Check plants every week for any spots or leaf changes',
        'Keep field clean - remove dead leaves regularly',
        'Make sure water can drain well after heavy rain',
      ],
      fr: [
        'Votre bananier/plantain semble en bonne santé ! Continuez votre bon travail',
        'Vérifiez les plantes chaque semaine pour tout signe de taches ou de changement des feuilles',
        'Gardez le champ propre - retirez régulièrement les feuilles mortes',
        'Assurez-vous que l\'eau peut bien drainer après les fortes pluies',
      ],
    },
    biological: { en: [], fr: [] },
    chemical: { en: [], fr: [] },
    precautions: {
      en: [
        'Prevention is better than cure - inspect your field every week',
        'If you see any changes in leaf color or growth, take a photo and check again',
        'Use clean suckers from healthy plants when starting new banana fields',
      ],
      fr: [
        'La prévention est meilleure que la guérison - inspectez votre champ chaque semaine',
        'Si vous voyez des changements de couleur ou de croissance des feuilles, prenez une photo et vérifiez à nouveau',
        'Utilisez des rejets propres de plantes saines lorsque vous démarrez de nouveaux champs de bananes',
      ],
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/treatment_db');
    console.log('✅ Connected to treatment_db');

    await Treatment.deleteMany({});
    console.log('🗑️  Cleared existing treatments');

    await Treatment.insertMany(treatments);
    console.log(`✅ Seeded ${treatments.length} treatment protocols (EN/FR localized for Cameroon)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();