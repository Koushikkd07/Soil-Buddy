import { LearningLesson, LearningCategory, LearningBadge, FunFact } from "@/types/learning";

export const learningCategories: LearningCategory[] = [
  {
    id: 'plant-biology',
    name: 'Plant Biology',
    description: 'Learn how plants work and grow!',
    emoji: '🌱',
    color: 'bg-green-500',
    lessons: ['roots-101', 'stems-and-leaves', 'photosynthesis-magic', 'plant-lifecycle'],
    totalLessons: 4,
    completedLessons: 0
  },
  {
    id: 'soil-science',
    name: 'Soil Science',
    description: 'Discover the secrets of soil!',
    emoji: '🪨',
    color: 'bg-amber-600',
    lessons: ['soil-composition', 'ph-basics', 'nutrients-explained', 'water-cycle'],
    totalLessons: 4,
    completedLessons: 0
  },
  {
    id: 'gardening-basics',
    name: 'Gardening Basics',
    description: 'Learn to be a super gardener!',
    emoji: '🌿',
    color: 'bg-emerald-500',
    lessons: ['watering-wisdom', 'planting-perfect', 'plant-care', 'tool-time'],
    totalLessons: 4,
    completedLessons: 0
  },
  {
    id: 'seasonal-tips',
    name: 'Seasonal Gardening',
    description: 'Garden through the seasons!',
    emoji: '🍂',
    color: 'bg-orange-500',
    lessons: ['spring-planting', 'summer-care', 'fall-harvest', 'winter-prep'],
    totalLessons: 4,
    completedLessons: 0
  }
];

export const learningLessons: LearningLesson[] = [
  // Plant Biology Lessons
  {
    id: 'roots-101',
    title: 'Amazing Roots!',
    category: 'plant-biology',
    difficulty: 'beginner',
    estimatedTime: 5,
    description: 'Discover how plant roots work like underground superheroes!',
    mascot: 'soily',
    content: [
      {
        type: 'text',
        title: 'Meet the Root Team!',
        content: 'Hi there! I\'m Soily the Worm, and I live underground with the amazing plant roots! Let me show you how roots are like underground superheroes! 🦸‍♂️'
      },
      {
        type: 'fact',
        content: 'Did you know? Some tree roots can grow as deep as the tree is tall! That\'s like a 3-story building underground! 🏢'
      },
      {
        type: 'text',
        title: 'What Do Roots Do?',
        content: 'Roots have three super important jobs:\n\n🥤 **Drink Water**: Like using a straw to drink your favorite juice!\n🍎 **Get Food**: They absorb nutrients from the soil like vitamins for plants!\n⚓ **Hold Tight**: They anchor the plant so it doesn\'t fall over in the wind!'
      },
      {
        type: 'connection',
        content: 'Your soil moisture is perfect for roots to drink water easily!',
        soilDataConnection: {
          metric: 'moisture',
          explanation: 'When soil has good moisture like yours, roots can easily absorb water and nutrients!'
        }
      },
      {
        type: 'interactive',
        title: 'Root Detective Game!',
        content: 'Help Soily match each root job with what it does!',
        interactive: {
          type: 'matching',
          data: {
            items: [
              { id: 'drink', text: 'Drink Water', match: 'straw' },
              { id: 'food', text: 'Get Nutrients', match: 'vitamins' },
              { id: 'anchor', text: 'Hold Plant', match: 'anchor' }
            ],
            matches: [
              { id: 'straw', text: 'Like a straw! 🥤' },
              { id: 'vitamins', text: 'Like vitamins! 💊' },
              { id: 'anchor', text: 'Like an anchor! ⚓' }
            ]
          },
          feedback: {
            correct: 'Great job! You understand how roots work! 🌟',
            incorrect: 'Almost there! Try again, little scientist! 🔬'
          }
        }
      }
    ],
    quiz: {
      id: 'roots-quiz',
      questions: [
        {
          id: 'q1',
          question: 'What do roots use to drink water?',
          type: 'multiple-choice',
          options: ['Their leaves', 'Tiny root hairs', 'Their flowers', 'The stem'],
          correctAnswer: 'Tiny root hairs',
          explanation: 'Roots have tiny hairs that help them absorb water, just like how a sponge soaks up water!',
          points: 10
        },
        {
          id: 'q2',
          question: 'Roots help plants stay upright in windy weather.',
          type: 'true-false',
          correctAnswer: 'true',
          explanation: 'Yes! Roots anchor plants in the ground like tent stakes hold down a tent!',
          points: 10
        }
      ],
      passingScore: 70
    },
    rewards: {
      points: 50,
      badges: ['root-explorer']
    }
  },
  {
    id: 'photosynthesis-magic',
    title: 'Photosynthesis Magic!',
    category: 'plant-biology',
    difficulty: 'beginner',
    estimatedTime: 7,
    description: 'Learn how plants make their own food using sunlight!',
    mascot: 'dewey',
    content: [
      {
        type: 'text',
        title: 'The Amazing Food Factory!',
        content: 'Hi! I\'m Dewey the Drop! 💧 Did you know plants have their own food factory? It\'s called photosynthesis, and it\'s like magic! ✨'
      },
      {
        type: 'text',
        title: 'The Recipe for Plant Food',
        content: 'Plants need three ingredients to make food:\n\n☀️ **Sunlight**: Energy from the sun\n💧 **Water**: That I help deliver!\n🌬️ **Carbon Dioxide**: A gas from the air\n\nMix them all together in the leaves, and TADA! Plant food! 🍽️'
      },
      {
        type: 'fact',
        content: 'Amazing fact: One large tree can make enough oxygen for two people to breathe for a whole day! 🌳💨'
      },
      {
        type: 'interactive',
        title: 'Photosynthesis Factory Game!',
        content: 'Help Dewey put the ingredients in the right order!',
        interactive: {
          type: 'drag-drop',
          data: {
            ingredients: ['Sunlight ☀️', 'Water 💧', 'Carbon Dioxide 🌬️'],
            result: 'Plant Food + Oxygen! 🍃'
          },
          feedback: {
            correct: 'Perfect! You\'ve made plant food! The plant is so happy! 😊',
            incorrect: 'Oops! Try putting the ingredients together again! 🔄'
          }
        }
      }
    ],
    quiz: {
      id: 'photosynthesis-quiz',
      questions: [
        {
          id: 'q1',
          question: 'What do plants need to make their own food?',
          type: 'multiple-choice',
          options: ['Sunlight, water, and soil', 'Sunlight, water, and carbon dioxide', 'Water, fertilizer, and air', 'Sunlight, fertilizer, and carbon dioxide'],
          correctAnswer: 'Sunlight, water, and carbon dioxide',
          explanation: 'Plants use sunlight, water, and carbon dioxide to make food through photosynthesis!',
          points: 15
        }
      ],
      passingScore: 70
    },
    rewards: {
      points: 75,
      badges: ['photosynthesis-wizard']
    }
  },
  // Soil Science Lessons
  {
    id: 'ph-basics',
    title: 'pH: The Soil\'s Mood!',
    category: 'soil-science',
    difficulty: 'beginner',
    estimatedTime: 6,
    description: 'Learn about pH and how it affects your plants!',
    mascot: 'soily',
    content: [
      {
        type: 'text',
        title: 'What is pH?',
        content: 'Hey there! Soily here! 🪱 pH is like the soil\'s mood - it tells us if the soil is happy, grumpy, or just right for plants!'
      },
      {
        type: 'text',
        title: 'The pH Scale',
        content: 'pH is measured on a scale from 0 to 14:\n\n😠 **0-6**: Acidic (Sour like a lemon!) 🍋\n😊 **7**: Neutral (Just right!) ⚖️\n😤 **8-14**: Basic (Bitter like soap!) 🧼\n\nMost plants love pH between 6-7!'
      },
      {
        type: 'connection',
        content: 'Your soil pH is just right for happy plants!',
        soilDataConnection: {
          metric: 'ph',
          explanation: 'Your current pH level means your plants can easily absorb all the nutrients they need!',
          idealRange: { min: 6.0, max: 7.0 }
        }
      },
      {
        type: 'interactive',
        title: 'pH Mood Meter!',
        content: 'Help Soily identify the soil\'s mood!',
        interactive: {
          type: 'slider',
          data: {
            min: 0,
            max: 14,
            optimal: [6, 7],
            labels: {
              0: '😠 Very Sour',
              7: '😊 Perfect',
              14: '😤 Very Bitter'
            }
          },
          feedback: {
            correct: 'Great! You found the happy zone for plants! 🌱',
            incorrect: 'Try moving closer to the middle - that\'s where plants are happiest! 😊'
          }
        }
      }
    ],
    quiz: {
      id: 'ph-quiz',
      questions: [
        {
          id: 'q1',
          question: 'What pH range do most plants prefer?',
          type: 'multiple-choice',
          options: ['3-4', '6-7', '9-10', '12-13'],
          correctAnswer: '6-7',
          explanation: 'Most plants love slightly acidic to neutral soil with pH 6-7!',
          points: 15
        }
      ],
      passingScore: 70
    },
    rewards: {
      points: 60,
      badges: ['ph-expert']
    }
  },
  // Gardening Basics Lessons
  {
    id: 'watering-wisdom',
    title: 'Watering Wisdom!',
    category: 'gardening-basics',
    difficulty: 'beginner',
    estimatedTime: 5,
    description: 'Learn the best ways to water your plants!',
    mascot: 'dewey',
    content: [
      {
        type: 'text',
        title: 'Hi from Dewey! 💧',
        content: 'I\'m Dewey the Drop, and I know ALL about watering! Let me teach you how to be a watering wizard! ✨'
      },
      {
        type: 'text',
        title: 'When to Water',
        content: 'Plants are like people - they get thirsty! Here\'s how to know when to water:\n\n🌅 **Best Time**: Early morning (6-8 AM)\n👆 **Finger Test**: Stick your finger in the soil - if it\'s dry, time to water!\n🌱 **Plant Signals**: Droopy leaves mean "I\'m thirsty!"'
      },
      {
        type: 'connection',
        content: 'Your soil moisture is perfect right now!',
        soilDataConnection: {
          metric: 'moisture',
          explanation: 'This is exactly the right amount of water for happy plants!'
        }
      },
      {
        type: 'fact',
        content: 'Did you know? Plants drink water through tiny straws in their roots called xylem! 🥤'
      }
    ],
    quiz: {
      id: 'watering-quiz',
      questions: [
        {
          id: 'q1',
          question: 'What\'s the best time to water plants?',
          type: 'multiple-choice',
          options: ['Early morning', 'Noon when it\'s hot', 'Late at night', 'Anytime'],
          correctAnswer: 'Early morning',
          explanation: 'Early morning is best because plants can drink all day and less water evaporates!',
          points: 10
        }
      ],
      passingScore: 70
    },
    rewards: {
      points: 50,
      badges: ['watering-wizard']
    }
  },
  // Seasonal Tips Lessons
  {
    id: 'spring-planting',
    title: 'Spring Planting Party!',
    category: 'seasonal-tips',
    difficulty: 'beginner',
    estimatedTime: 6,
    description: 'Discover the magic of spring planting!',
    mascot: 'both',
    content: [
      {
        type: 'text',
        title: 'Spring is Here! 🌸',
        content: 'Hi! We\'re Dewey and Soily! Spring is the BEST time to start new plants. Everything is waking up and ready to grow! 🌱'
      },
      {
        type: 'text',
        title: 'What to Plant in Spring',
        content: 'Spring is perfect for:\n\n🥕 **Cool Weather Crops**: Carrots, lettuce, peas\n🌻 **Flower Seeds**: Sunflowers, marigolds, zinnias\n🌿 **Herbs**: Basil, parsley, cilantro\n🍅 **After Last Frost**: Tomatoes, peppers (wait until it\'s warm!)'
      },
      {
        type: 'fact',
        content: 'Amazing fact: Some seeds can sleep in the ground all winter and wake up in spring! 😴➡️🌱'
      }
    ],
    rewards: {
      points: 60,
      badges: ['spring-planter']
    }
  }
];

export const learningBadges: LearningBadge[] = [
  {
    id: 'root-explorer',
    name: 'Root Explorer',
    description: 'Discovered the secrets of plant roots!',
    emoji: '🌱',
    category: 'plant-biology',
    earnedDate: new Date(),
    rarity: 'common'
  },
  {
    id: 'photosynthesis-wizard',
    name: 'Photosynthesis Wizard',
    description: 'Mastered the magic of plant food making!',
    emoji: '✨',
    category: 'plant-biology',
    earnedDate: new Date(),
    rarity: 'rare'
  },
  {
    id: 'ph-expert',
    name: 'pH Expert',
    description: 'Understands soil mood perfectly!',
    emoji: '🧪',
    category: 'soil-science',
    earnedDate: new Date(),
    rarity: 'common'
  },
  {
    id: 'watering-wizard',
    name: 'Watering Wizard',
    description: 'Mastered the art of plant watering!',
    emoji: '💧',
    category: 'gardening-basics',
    earnedDate: new Date(),
    rarity: 'common'
  },
  {
    id: 'spring-planter',
    name: 'Spring Planter',
    description: 'Knows all about spring planting!',
    emoji: '🌸',
    category: 'seasonal-tips',
    earnedDate: new Date(),
    rarity: 'common'
  },
  {
    id: 'garden-master',
    name: 'Garden Master',
    description: 'Completed all basic lessons!',
    emoji: '🏆',
    category: 'achievement',
    earnedDate: new Date(),
    rarity: 'legendary'
  }
];

export const funFacts: FunFact[] = [
  {
    id: 'fact-1',
    category: 'plant-biology',
    fact: 'A single sunflower can have up to 2,000 seeds! 🌻',
    emoji: '🌻',
    relatedLesson: 'plant-lifecycle'
  },
  {
    id: 'fact-2',
    category: 'soil-science',
    fact: 'One teaspoon of soil contains more living organisms than there are people on Earth! 🦠',
    emoji: '🪨',
    relatedLesson: 'soil-composition'
  },
  {
    id: 'fact-3',
    category: 'gardening-basics',
    fact: 'Plants can communicate with each other through their roots! 📡',
    emoji: '🌿',
    relatedLesson: 'roots-101'
  },
  {
    id: 'fact-4',
    category: 'seasonal-tips',
    fact: 'Some plants can predict the weather better than meteorologists! 🌦️',
    emoji: '🍂',
    relatedLesson: 'seasonal-tips'
  }
];
