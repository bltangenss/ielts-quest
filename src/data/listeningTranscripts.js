export const LISTENING_TRANSCRIPTS = [
  {
    id: "lt1",
    title: "University Enrollment Conversation",
    topic: "education",
    difficulty: 1,
    description: "A conversation between a student and a university enrollment officer",
    transcript: `Enrollment Officer: Good morning! Welcome to Greenfield University. How can I help you today?

Student: Hi, I'm interested in applying for the Environmental Science program. I just moved here from overseas.

Enrollment Officer: Wonderful! The Environmental Science program is one of our most popular. Are you thinking about undergraduate or postgraduate study?

Student: I'd like to do a master's degree. I already have a bachelor's in Biology from my home country.

Enrollment Officer: Perfect. For postgraduate entry, we typically require a minimum IELTS score of 6.5 overall, with no band below 6.0. The program starts in September and applications close on the 31st of March.

Student: That's good to know. What about scholarships? I'm on a tight budget.

Enrollment Officer: We offer two types of scholarships for international students. The Merit Scholarship covers 50% of tuition fees and requires a GPA of 3.5 or above. The Need-Based Scholarship covers 30% of fees and is assessed based on financial circumstances.

Student: How do I apply for those?

Enrollment Officer: You submit your scholarship application alongside your program application. You'll need to provide transcripts, two letters of recommendation, and a personal statement of 500 words explaining your interest in Environmental Science.

Student: And how long does the process take?

Enrollment Officer: Typically four to six weeks after your application is complete. You'll receive notification by email.`,
    questions: [
      {
        id: "q1", type: "mcq",
        question: "What level of study is the student interested in?",
        options: ["Undergraduate degree", "Master's degree", "PhD program", "Diploma course"],
        correct: 1,
        explanation: "The student says 'I'd like to do a master's degree.'"
      },
      {
        id: "q2", type: "mcq",
        question: "What is the minimum IELTS overall band score required?",
        options: ["6.0", "6.5", "7.0", "7.5"],
        correct: 1,
        explanation: "The officer states 'a minimum IELTS score of 6.5 overall.'"
      },
      {
        id: "q3", type: "mcq",
        question: "What is the application deadline?",
        options: ["31st January", "28th February", "31st March", "30th April"],
        correct: 2,
        explanation: "The officer says 'applications close on the 31st of March.'"
      },
      {
        id: "q4", type: "mcq",
        question: "How much does the Merit Scholarship cover?",
        options: ["30% of tuition fees", "40% of tuition fees", "50% of tuition fees", "100% of tuition fees"],
        correct: 2,
        explanation: "The Merit Scholarship 'covers 50% of tuition fees.'"
      },
      {
        id: "q5", type: "mcq",
        question: "How long is the personal statement required to be?",
        options: ["300 words", "400 words", "500 words", "600 words"],
        correct: 2,
        explanation: "The officer specifies 'a personal statement of 500 words.'"
      }
    ]
  },
  {
    id: "lt2",
    title: "Radio Program: Urban Farming",
    topic: "environment",
    difficulty: 2,
    description: "A radio interview with an urban farming expert",
    transcript: `Host: Welcome back to GreenWorld Radio. Today I'm joined by Dr. Sarah Chen, an expert in urban agriculture. Dr. Chen, why is urban farming becoming so popular?

Dr. Chen: Thank you for having me. Urban farming addresses several critical issues simultaneously. First, it reduces food miles — the distance food travels from farm to table. In most cities, food travels an average of 1,500 kilometers before reaching consumers. By growing food locally, we can slash that dramatically.

Host: What kinds of crops are most suitable for urban environments?

Dr. Chen: Leafy greens like lettuce, spinach, and kale are ideal because they grow quickly — usually within 4 to 6 weeks — and don't require much space. Herbs like basil and mint are also extremely popular. For more ambitious projects, tomatoes and peppers can thrive in rooftop gardens given adequate sunlight.

Host: What about water usage? Critics say urban farming wastes water.

Dr. Chen: That's actually a misconception. Modern urban farms use hydroponic or aeroponic systems that use up to 90% less water than traditional soil farming. The water is recirculated rather than absorbed into the ground or evaporated.

Host: Are there any challenges that urban farmers face?

Dr. Chen: Absolutely. Initial setup costs can be significant — a basic rooftop hydroponic system costs between $2,000 and $5,000. There are also zoning laws to navigate, and some buildings aren't structurally suited for rooftop gardens. But as the technology improves and costs fall, these barriers are becoming less significant.

Host: What's your vision for urban farming in the next decade?

Dr. Chen: I believe vertical farms integrated into apartment buildings will become standard in major cities. Residents will grow a meaningful percentage of their own produce right where they live. It's not just sustainable — it builds community.`,
    questions: [
      {
        id: "q1", type: "mcq",
        question: "According to Dr. Chen, how far does food travel on average before reaching consumers?",
        options: ["500 km", "1,000 km", "1,500 km", "2,000 km"],
        correct: 2,
        explanation: "Dr. Chen states 'food travels an average of 1,500 kilometers before reaching consumers.'"
      },
      {
        id: "q2", type: "mcq",
        question: "How long does it typically take leafy greens to grow?",
        options: ["1-2 weeks", "4-6 weeks", "8-10 weeks", "12-14 weeks"],
        correct: 1,
        explanation: "Dr. Chen says they 'grow quickly — usually within 4 to 6 weeks.'"
      },
      {
        id: "q3", type: "mcq",
        question: "How does modern urban farming compare to traditional farming in water use?",
        options: [
          "It uses twice as much water",
          "It uses the same amount of water",
          "It uses up to 90% less water",
          "It uses 50% less water"
        ],
        correct: 2,
        explanation: "Dr. Chen states hydroponic systems 'use up to 90% less water than traditional soil farming.'"
      },
      {
        id: "q4", type: "mcq",
        question: "What is the cost range for a basic rooftop hydroponic system?",
        options: ["$500-$1,000", "$1,000-$2,000", "$2,000-$5,000", "$5,000-$10,000"],
        correct: 2,
        explanation: "Dr. Chen mentions costs 'between $2,000 and $5,000.'"
      },
      {
        id: "q5", type: "mcq",
        question: "What does Dr. Chen predict will become standard in major cities?",
        options: [
          "Underground farms",
          "Vertical farms in apartment buildings",
          "Community allotments",
          "Automated greenhouse networks"
        ],
        correct: 1,
        explanation: "Dr. Chen says 'vertical farms integrated into apartment buildings will become standard.'"
      }
    ]
  },
  {
    id: "lt3",
    title: "Museum Audio Guide: Ancient Egypt",
    topic: "history",
    difficulty: 2,
    description: "An audio guide for an Ancient Egypt exhibition",
    transcript: `Welcome to the Ancient Egypt Gallery at the National Museum. This audio guide will accompany your visit through four thousand years of one of humanity's most remarkable civilizations.

You are now standing before the Gallery's centerpiece: a replica of the Rosetta Stone. The original, discovered in 1799 by French soldiers near the town of Rosetta in northern Egypt, was crucial to deciphering ancient Egyptian hieroglyphics. The stone contains the same message written in three scripts: hieroglyphics, Demotic script, and ancient Greek. Because scholars already understood Greek, they were able to use it as a key to unlock the mysteries of hieroglyphics.

Moving to your left, you'll see a display dedicated to Egyptian burial practices. Ancient Egyptians believed strongly in the afterlife, and great care was taken to preserve the body after death. The mummification process took approximately 70 days and involved removing internal organs, which were stored in special containers called canopic jars. The heart, however, was left inside the body, as Egyptians believed it to be the seat of intelligence and emotion.

The final section of this gallery explores daily life in ancient Egypt. Contrary to popular belief, not all Egyptians were involved in building pyramids. Most were farmers who cultivated wheat and barley along the fertile banks of the Nile River. The Nile flooded annually, depositing rich silt that made the surrounding land extraordinarily productive — allowing Egypt to become one of the ancient world's great food producers.`,
    questions: [
      {
        id: "q1", type: "mcq",
        question: "When was the Rosetta Stone discovered?",
        options: ["1779", "1789", "1799", "1809"],
        correct: 2,
        explanation: "The guide states the stone was 'discovered in 1799 by French soldiers.'"
      },
      {
        id: "q2", type: "mcq",
        question: "How many scripts appear on the Rosetta Stone?",
        options: ["Two", "Three", "Four", "Five"],
        correct: 1,
        explanation: "The guide states it 'contains the same message written in three scripts.'"
      },
      {
        id: "q3", type: "mcq",
        question: "How long did the mummification process take?",
        options: ["40 days", "50 days", "60 days", "70 days"],
        correct: 3,
        explanation: "The guide states 'The mummification process took approximately 70 days.'"
      },
      {
        id: "q4", type: "mcq",
        question: "Why was the heart left inside the body during mummification?",
        options: [
          "It was too difficult to remove",
          "It was considered sacred to the gods",
          "Egyptians believed it was the seat of intelligence",
          "It had no religious significance"
        ],
        correct: 2,
        explanation: "The guide explains 'Egyptians believed it to be the seat of intelligence and emotion.'"
      },
      {
        id: "q5", type: "mcq",
        question: "What crops did most Egyptian farmers cultivate?",
        options: ["Rice and maize", "Wheat and barley", "Cotton and flax", "Dates and figs"],
        correct: 1,
        explanation: "The guide mentions 'farmers who cultivated wheat and barley along the Nile.'"
      }
    ]
  },
  {
    id: "lt4",
    title: "Academic Lecture: Sleep Science",
    topic: "science",
    difficulty: 3,
    description: "A university lecture excerpt on sleep and cognitive function",
    transcript: `Good morning everyone. Today we continue our unit on cognitive neuroscience, focusing specifically on sleep and its critical role in brain function.

For most of human history, sleep was considered a passive state — simply the absence of wakefulness. We now understand that sleep is an extraordinarily active process. During sleep, your brain performs essential maintenance tasks that cannot occur while you're awake.

One of the most important functions of sleep is memory consolidation. When you learn something new, that information is initially stored in the hippocampus — a seahorse-shaped structure deep within the temporal lobe. During sleep, particularly during slow-wave sleep, this information is transferred to the neocortex for long-term storage. Students who sleep after studying consistently outperform those who stay awake, even when total study time is equal.

The second major function is cellular repair. Your brain produces a byproduct of neural activity called beta-amyloid, which accumulates throughout the day. During deep sleep, the brain's glymphatic system — essentially its waste disposal network — becomes 60% more active and flushes out this toxic protein. Chronic sleep deprivation has been associated with elevated beta-amyloid levels, which is a known risk factor for Alzheimer's disease.

The recommended sleep duration for adults is between 7 and 9 hours per night. Yet surveys consistently show that nearly 35% of adults in developed nations sleep fewer than 7 hours regularly. The consequences extend beyond fatigue: impaired judgment, weakened immune function, increased risk of cardiovascular disease, and significantly elevated rates of depression and anxiety.

For your essays due next week, I want you to analyze the relationship between sleep patterns and academic performance using the studies we've reviewed. Please aim for 1,500 words.`,
    questions: [
      {
        id: "q1", type: "mcq",
        question: "Where is new information initially stored in the brain?",
        options: ["The neocortex", "The cerebellum", "The hippocampus", "The amygdala"],
        correct: 2,
        explanation: "The lecturer states 'information is initially stored in the hippocampus.'"
      },
      {
        id: "q2", type: "mcq",
        question: "During which type of sleep is memory transfer to long-term storage most active?",
        options: ["REM sleep", "Light sleep", "Slow-wave sleep", "Dream sleep"],
        correct: 2,
        explanation: "The lecturer says this occurs 'particularly during slow-wave sleep.'"
      },
      {
        id: "q3", type: "mcq",
        question: "How much more active is the brain's waste disposal system during deep sleep?",
        options: ["30% more active", "50% more active", "60% more active", "80% more active"],
        correct: 2,
        explanation: "The lecturer states it 'becomes 60% more active' during deep sleep."
      },
      {
        id: "q4", type: "mcq",
        question: "What percentage of adults in developed nations sleep fewer than 7 hours?",
        options: ["25%", "30%", "35%", "40%"],
        correct: 2,
        explanation: "The lecturer cites 'nearly 35% of adults in developed nations.'"
      },
      {
        id: "q5", type: "mcq",
        question: "How long should the essay assignment be?",
        options: ["1,000 words", "1,200 words", "1,500 words", "2,000 words"],
        correct: 2,
        explanation: "The lecturer says 'Please aim for 1,500 words.'"
      }
    ]
  },
  {
    id: "lt5",
    title: "Travel Documentary: Iceland",
    topic: "geography",
    difficulty: 2,
    description: "A travel documentary narration about Iceland",
    transcript: `Iceland — a land of fire and ice, perched on the edge of the Arctic Circle — is one of Earth's most geologically active regions. Despite its name, Iceland is surprisingly green, while nearby Greenland is largely covered in ice. This naming confusion dates back to the 9th century, when Viking settlers reportedly gave each island a misleading name to discourage or attract potential settlers.

The island sits directly on the Mid-Atlantic Ridge, where the North American and Eurasian tectonic plates are gradually pulling apart. This geological tension gives Iceland its extraordinary volcanic landscape. The country has approximately 130 volcanic mountains, 30 of which have erupted since human settlement began in 874 CE. The most recent major eruption, which began in 2021 on the Reykjanes Peninsula, attracted visitors from around the world who came to witness lava flowing within meters of designated viewing paths.

Iceland has become a global leader in renewable energy. The country generates nearly 100% of its electricity from renewable sources — 70% from hydropower and 30% from geothermal energy. The abundance of geothermal energy means Icelanders can heat their homes using natural hot water pumped directly from the ground, making Iceland one of the most energy-efficient nations on Earth.

The Northern Lights, or Aurora Borealis, are perhaps Iceland's most celebrated natural spectacle. These shimmering curtains of green, purple, and red light are caused by solar particles colliding with gases in Earth's atmosphere. The best viewing conditions occur between September and March, when nights are long and skies are darkest. Visitors typically need at least 3 to 4 clear nights to have a reasonable chance of witnessing this phenomenon.`,
    questions: [
      {
        id: "q1", type: "mcq",
        question: "When did human settlement in Iceland begin?",
        options: ["774 CE", "874 CE", "974 CE", "1074 CE"],
        correct: 1,
        explanation: "The narrator states 'since human settlement began in 874 CE.'"
      },
      {
        id: "q2", type: "mcq",
        question: "What percentage of Iceland's electricity comes from hydropower?",
        options: ["30%", "50%", "70%", "90%"],
        correct: 2,
        explanation: "The narrator states '70% from hydropower.'"
      },
      {
        id: "q3", type: "mcq",
        question: "What geological feature does Iceland sit on?",
        options: ["The Pacific Ring of Fire", "The Mid-Atlantic Ridge", "The Alpine Fault", "The Mariana Trench"],
        correct: 1,
        explanation: "The narrator says 'The island sits directly on the Mid-Atlantic Ridge.'"
      },
      {
        id: "q4", type: "mcq",
        question: "When are the best conditions for viewing the Northern Lights?",
        options: ["March to June", "June to September", "September to March", "December to February only"],
        correct: 2,
        explanation: "The narrator states 'The best viewing conditions occur between September and March.'"
      },
      {
        id: "q5", type: "mcq",
        question: "How many nights does a visitor typically need for a reasonable chance to see the Aurora?",
        options: ["1 to 2 nights", "2 to 3 nights", "3 to 4 nights", "5 to 7 nights"],
        correct: 2,
        explanation: "The narrator states 'at least 3 to 4 clear nights.'"
      }
    ]
  }
];
