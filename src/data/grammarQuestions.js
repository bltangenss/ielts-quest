export const GRAMMAR_QUESTIONS = [
  // ═══ ARTICLES ═══
  { id: "g1", topic: "articles", difficulty: 1,
    question: "Choose the correct article: 'She is ___ honest person who always tells the truth.'",
    options: ["a", "an", "the", "no article"],
    correct: 1, explanation: "Use 'an' before words starting with a vowel sound. 'Honest' starts with a silent 'h', so the vowel sound /ɒ/ requires 'an'." },
  { id: "g2", topic: "articles", difficulty: 1,
    question: "Select the correct option: '___ Amazon is the largest river by discharge in the world.'",
    options: ["A", "An", "The", "No article"],
    correct: 2, explanation: "Use 'the' with names of rivers, mountain ranges, and other unique geographical features." },
  { id: "g3", topic: "articles", difficulty: 2,
    question: "Which sentence uses articles correctly?",
    options: [
      "She plays a piano very well.",
      "She plays the piano very well.",
      "She plays piano very well.",
      "She plays an piano very well."
    ],
    correct: 1, explanation: "Use 'the' with musical instruments when referring to playing them: 'play the piano/violin/guitar.'" },
  { id: "g4", topic: "articles", difficulty: 2,
    question: "Choose the correct option: 'He was admitted to ___ hospital after the accident.'",
    options: ["a", "an", "the", "no article"],
    correct: 3, explanation: "In British English, 'go to hospital' (no article) means as a patient. 'The hospital' refers to a specific building." },
  { id: "g5", topic: "articles", difficulty: 3,
    question: "Identify the incorrect use of articles: 'The research suggests that the exercise improves the mental health.'",
    options: [
      "'The research' is incorrect",
      "'the exercise' is incorrect",
      "'the mental health' is incorrect",
      "Both B and C are incorrect"
    ],
    correct: 3, explanation: "Generic nouns used in a general sense don't take 'the': 'exercise improves mental health' (both without 'the')." },

  // ═══ CONDITIONALS ═══
  { id: "g6", topic: "conditionals", difficulty: 1,
    question: "Complete the sentence: 'If it ___ tomorrow, we will cancel the picnic.'",
    options: ["rains", "will rain", "rained", "would rain"],
    correct: 0, explanation: "First conditional: 'If + present simple, will + infinitive'. Use simple present in the if-clause." },
  { id: "g7", topic: "conditionals", difficulty: 2,
    question: "Choose the correct form: 'If I ___ a millionaire, I would travel the world.'",
    options: ["am", "was", "were", "would be"],
    correct: 2, explanation: "Second conditional uses 'were' (not 'was') for all persons in formal/correct English: 'If I were...'" },
  { id: "g8", topic: "conditionals", difficulty: 2,
    question: "Select the correct sentence:",
    options: [
      "If he would study harder, he would pass.",
      "If he studied harder, he would pass.",
      "If he studies harder, he would pass.",
      "If he had studied harder, he would pass."
    ],
    correct: 1, explanation: "Second conditional: 'If + past simple, would + infinitive'. Don't use 'would' in the if-clause." },
  { id: "g9", topic: "conditionals", difficulty: 3,
    question: "Which sentence expresses a past unreal condition?",
    options: [
      "If I have time, I will help you.",
      "If I had time, I would help you.",
      "If I had had time, I would have helped you.",
      "If I will have time, I can help you."
    ],
    correct: 2, explanation: "Third conditional: 'If + past perfect, would have + past participle' — for hypothetical past situations." },
  { id: "g10", topic: "conditionals", difficulty: 3,
    question: "Identify the mixed conditional: 'If she had taken better care of her health, she would be fine now.'",
    options: [
      "First conditional",
      "Second conditional",
      "Third conditional",
      "Mixed conditional"
    ],
    correct: 3, explanation: "Mixed conditional: past perfect in if-clause (past action) + would + infinitive (present result)." },

  // ═══ PASSIVE VOICE ═══
  { id: "g11", topic: "passive_voice", difficulty: 1,
    question: "Convert to passive: 'The manager reviews the reports every Monday.'",
    options: [
      "The reports reviewed every Monday by the manager.",
      "The reports are reviewed every Monday by the manager.",
      "The reports were reviewed every Monday by the manager.",
      "The reports have reviewed every Monday."
    ],
    correct: 1, explanation: "Present simple passive: 'am/is/are + past participle'. 'Reports' is plural, so 'are reviewed'." },
  { id: "g12", topic: "passive_voice", difficulty: 2,
    question: "Choose the correct passive form: 'The bridge ___ by the time we arrived.'",
    options: [
      "had already destroyed",
      "had already been destroyed",
      "was already destroyed",
      "has already been destroyed"
    ],
    correct: 1, explanation: "Past perfect passive: 'had been + past participle' for an action completed before a past time." },
  { id: "g13", topic: "passive_voice", difficulty: 2,
    question: "Which sentence is grammatically correct?",
    options: [
      "The experiment is being conducted by scientists currently.",
      "The experiment currently is being conducted by scientists.",
      "The experiment is currently being conducted by scientists.",
      "The experiment currently being conducted by scientists."
    ],
    correct: 2, explanation: "Present continuous passive: 'is/are being + past participle'. Adverbs like 'currently' go between 'is' and 'being'." },
  { id: "g14", topic: "passive_voice", difficulty: 3,
    question: "Identify the error: 'The new policy has announced by the government yesterday.'",
    options: [
      "Should be 'was announced' not 'has announced'",
      "'Yesterday' should be at the beginning",
      "Should use 'by' differently",
      "No error in this sentence"
    ],
    correct: 0, explanation: "'Yesterday' indicates a specific past time, requiring simple past passive 'was announced', not present perfect." },
  { id: "g15", topic: "passive_voice", difficulty: 3,
    question: "Choose the correct form: 'It is believed that the artifact ___ over 3,000 years ago.'",
    options: [
      "created",
      "was created",
      "has been created",
      "had created"
    ],
    correct: 1, explanation: "After 'it is believed that', use appropriate tense. Since it happened in the past, use simple past passive 'was created'." },

  // ═══ PERFECT TENSES ═══
  { id: "g16", topic: "perfect_tenses", difficulty: 1,
    question: "Choose the correct tense: 'I ___ this book three times and it never gets old.'",
    options: ["read", "have read", "had read", "was reading"],
    correct: 1, explanation: "Present perfect expresses an experience or action repeated up to the present time. 'I have read' connects past to present." },
  { id: "g17", topic: "perfect_tenses", difficulty: 2,
    question: "Select the correct option: 'By the time the rescue team arrived, the survivors ___ for two days.'",
    options: [
      "have been waiting",
      "were waiting",
      "had been waiting",
      "waited"
    ],
    correct: 2, explanation: "Past perfect continuous: 'had been + -ing' for an action that was ongoing before another past action." },
  { id: "g18", topic: "perfect_tenses", difficulty: 2,
    question: "Which sentence is correct?",
    options: [
      "She has worked here since five years.",
      "She has worked here for five years.",
      "She worked here since five years.",
      "She is working here for five years."
    ],
    correct: 1, explanation: "Use 'for' with a duration (for five years) and 'since' with a specific point in time (since 2019)." },
  { id: "g19", topic: "perfect_tenses", difficulty: 3,
    question: "Choose the most appropriate form: 'Scientists ___ a breakthrough in cancer research by 2030.'",
    options: [
      "will achieve",
      "will have achieved",
      "achieve",
      "have achieved"
    ],
    correct: 1, explanation: "Future perfect 'will have achieved' describes an action that will be completed before a specific future time (by 2030)." },
  { id: "g20", topic: "perfect_tenses", difficulty: 3,
    question: "Identify the correct sentence:",
    options: [
      "I have seen him yesterday at the market.",
      "I saw him yesterday at the market.",
      "I had seen him yesterday at the market.",
      "I was seeing him yesterday at the market."
    ],
    correct: 1, explanation: "With specific past time words like 'yesterday', use simple past, not present perfect." },

  // ═══ RELATIVE CLAUSES ═══
  { id: "g21", topic: "relative_clauses", difficulty: 1,
    question: "Choose the correct relative pronoun: 'The scientist ___ discovered penicillin was Alexander Fleming.'",
    options: ["which", "whose", "whom", "who"],
    correct: 3, explanation: "Use 'who' for people as the subject of the relative clause. 'Which' is for things; 'whom' is for people as the object." },
  { id: "g22", topic: "relative_clauses", difficulty: 2,
    question: "Which sentence contains a non-defining relative clause?",
    options: [
      "The car that broke down was new.",
      "Students who study regularly perform better.",
      "My sister, who lives in London, is visiting next week.",
      "The book which I borrowed was excellent."
    ],
    correct: 2, explanation: "Non-defining clauses (extra info) use commas and cannot use 'that'. 'My sister, who lives in London' adds extra information." },
  { id: "g23", topic: "relative_clauses", difficulty: 2,
    question: "Select the correct form: 'The professor ___ research I read is presenting today.'",
    options: ["who", "whom", "whose", "which"],
    correct: 2, explanation: "Use 'whose' for possession: 'the professor whose research' = 'the professor's research'." },
  { id: "g24", topic: "relative_clauses", difficulty: 3,
    question: "Identify the error: 'The company which headquarters are in New York has expanded globally.'",
    options: [
      "'which' should be 'that'",
      "'which' should be 'whose'",
      "'has expanded' should be 'have expanded'",
      "No error in this sentence"
    ],
    correct: 1, explanation: "'Whose' indicates possession. 'The company whose headquarters are in New York' is correct." },
  { id: "g25", topic: "relative_clauses", difficulty: 3,
    question: "Which sentence is grammatically acceptable in formal English?",
    options: [
      "The person that I spoke to was helpful.",
      "The person who I spoke to was helpful.",
      "The person whom I spoke to was helpful.",
      "The person which I spoke to was helpful."
    ],
    correct: 2, explanation: "In formal English, 'whom' is used as the object of a relative clause (speaking TO someone = object)." },

  // ═══ MODAL VERBS ═══
  { id: "g26", topic: "modal_verbs", difficulty: 1,
    question: "Choose the modal that expresses strong obligation: 'All passengers ___ wear seatbelts.'",
    options: ["might", "could", "must", "would"],
    correct: 2, explanation: "'Must' expresses strong obligation or necessity (from the speaker's authority). 'Have to' expresses external obligation." },
  { id: "g27", topic: "modal_verbs", difficulty: 2,
    question: "Select the correct modal for past ability: 'When I was young, I ___ run very fast.'",
    options: ["can", "could", "was able to", "Both B and C are correct"],
    correct: 3, explanation: "Both 'could' and 'was able to' express past ability. However, 'was able to' is preferred for a specific achievement." },
  { id: "g28", topic: "modal_verbs", difficulty: 2,
    question: "Choose the correct modal for logical deduction: 'She has been studying all night. She ___ be exhausted.'",
    options: ["might", "must", "should", "could"],
    correct: 1, explanation: "'Must' expresses near certainty based on evidence. 'She must be exhausted' = 'I'm almost certain she is.'" },
  { id: "g29", topic: "modal_verbs", difficulty: 3,
    question: "Identify the meaning of: 'He should have informed us about the meeting.'",
    options: [
      "He will inform us in the future",
      "He was obligated to inform us (but didn't)",
      "He was able to inform us",
      "He is allowed to inform us"
    ],
    correct: 1, explanation: "'Should have + past participle' expresses criticism or regret about something that didn't happen." },
  { id: "g30", topic: "modal_verbs", difficulty: 3,
    question: "Which sentence expresses a past possibility that didn't happen?",
    options: [
      "She might attend the conference.",
      "She might have attended the conference.",
      "She could attend the conference.",
      "She must attend the conference."
    ],
    correct: 1, explanation: "'Might have + past participle' expresses a past possibility: she possibly attended, but we're uncertain." },

  // ═══ SUBJECT-VERB AGREEMENT ═══
  { id: "g31", topic: "subject_verb_agreement", difficulty: 1,
    question: "Choose the correct verb: 'Neither the manager nor the employees ___ happy with the decision.'",
    options: ["was", "were", "is", "are"],
    correct: 1, explanation: "With 'neither...nor', the verb agrees with the subject closest to it ('employees' = plural, so 'were')." },
  { id: "g32", topic: "subject_verb_agreement", difficulty: 2,
    question: "Select the correct form: 'The committee ___ reached a unanimous decision.'",
    options: ["have", "has", "are", "were"],
    correct: 1, explanation: "Collective nouns (committee, team, government) take singular verbs in American English: 'has reached'." },
  { id: "g33", topic: "subject_verb_agreement", difficulty: 2,
    question: "Which sentence has correct subject-verb agreement?",
    options: [
      "Each of the students were given a certificate.",
      "Each of the students was given a certificate.",
      "Each of the students are given a certificate.",
      "Each of the students have been given a certificate."
    ],
    correct: 1, explanation: "'Each' is singular and takes a singular verb, even when followed by 'of the [plural noun]'." },
  { id: "g34", topic: "subject_verb_agreement", difficulty: 3,
    question: "Identify the error: 'The number of applications have increased significantly this year.'",
    options: [
      "'Number' should be 'amount'",
      "'have' should be 'has'",
      "'significantly' is in the wrong position",
      "No error in this sentence"
    ],
    correct: 1, explanation: "'The number of' is singular: 'The number... has increased'. Compare: 'A number of = several', which takes a plural verb." },
  { id: "g35", topic: "subject_verb_agreement", difficulty: 3,
    question: "Choose the correct verb: 'Five hundred kilometers ___ a long distance to travel by car.'",
    options: ["are", "is", "were", "have been"],
    correct: 1, explanation: "When a number refers to a single amount or unit, use singular: 'Five hundred kilometers IS a long distance.'" },

  // ═══ REPORTED SPEECH ═══
  { id: "g36", topic: "reported_speech", difficulty: 1,
    question: "Report this statement: He said, 'I am working on the project.'",
    options: [
      "He said that he is working on the project.",
      "He said that he was working on the project.",
      "He said that he worked on the project.",
      "He said that he has been working on the project."
    ],
    correct: 1, explanation: "In reported speech, present continuous shifts to past continuous: 'am working' → 'was working'." },
  { id: "g37", topic: "reported_speech", difficulty: 2,
    question: "Convert to reported speech: She asked, 'Have you finished the report?'",
    options: [
      "She asked if I have finished the report.",
      "She asked if I had finished the report.",
      "She asked have I finished the report.",
      "She asked did I finish the report."
    ],
    correct: 1, explanation: "In reported questions, present perfect shifts to past perfect, and word order becomes statement order: 'if I had finished'." },
  { id: "g38", topic: "reported_speech", difficulty: 2,
    question: "Which reported speech sentence is correct?",
    options: [
      "The doctor advised me to take the medicine regularly.",
      "The doctor advised me that I take the medicine regularly.",
      "The doctor advised me taking the medicine regularly.",
      "The doctor advised to take the medicine regularly."
    ],
    correct: 0, explanation: "'Advise' in reported speech takes 'advise + object + to + infinitive': 'advised me to take'." },
  { id: "g39", topic: "reported_speech", difficulty: 3,
    question: "Report: The manager said, 'I will call you tomorrow.'",
    options: [
      "The manager said he would call me tomorrow.",
      "The manager said he would call me the next day.",
      "The manager said he will call me tomorrow.",
      "The manager said he called me the next day."
    ],
    correct: 1, explanation: "'Will' becomes 'would', and 'tomorrow' becomes 'the next day' in reported speech when reporting later." },
  { id: "g40", topic: "reported_speech", difficulty: 3,
    question: "Identify the correct sentence for reporting: 'Don't touch the equipment,' the technician warned.",
    options: [
      "The technician warned not to touch the equipment.",
      "The technician warned to not touch the equipment.",
      "The technician warned that don't touch the equipment.",
      "The technician warned us to not touch the equipment."
    ],
    correct: 0, explanation: "Reporting negative imperatives: 'warn + not to + infinitive': 'warned not to touch'." },

  // ═══ GERUNDS & INFINITIVES ═══
  { id: "g41", topic: "gerunds_infinitives", difficulty: 1,
    question: "Choose the correct form: 'She enjoys ___ to music while studying.'",
    options: ["listen", "to listen", "listening", "listened"],
    correct: 2, explanation: "'Enjoy' is always followed by a gerund (-ing form): enjoy doing, enjoy swimming, enjoy listening." },
  { id: "g42", topic: "gerunds_infinitives", difficulty: 1,
    question: "Select the correct form: 'He promised ___ on time for the meeting.'",
    options: ["arriving", "to arrive", "arrive", "arrived"],
    correct: 1, explanation: "'Promise' is followed by an infinitive: promise to do, promise to arrive, promise to help." },
  { id: "g43", topic: "gerunds_infinitives", difficulty: 2,
    question: "Which sentence uses the correct form?",
    options: [
      "I remember to lock the door before I left.",
      "I remember locking the door before I left.",
      "I remember lock the door before I left.",
      "I remembered to lock the door before I left."
    ],
    correct: 1, explanation: "'Remember + gerund' = remember something that happened. 'Remember + infinitive' = remember to do something in the future." },
  { id: "g44", topic: "gerunds_infinitives", difficulty: 2,
    question: "Choose the correct form: 'They decided ___ the project despite the difficulties.'",
    options: ["continuing", "to continue", "continue", "continued"],
    correct: 1, explanation: "'Decide' is followed by an infinitive: decide to do, decide to continue, decide to accept." },
  { id: "g45", topic: "gerunds_infinitives", difficulty: 3,
    question: "Which sentence has a different meaning from the others?",
    options: [
      "I stopped to check my phone.",
      "I stopped checking my phone.",
      "I ceased to check my phone.",
      "I stopped looking at my phone."
    ],
    correct: 0, explanation: "'Stop + infinitive' means 'stop in order to do something else'. 'Stop + gerund' means 'cease an activity'. Only A means he paused to do something new." },

  // ═══ PREPOSITIONS ═══
  { id: "g46", topic: "prepositions", difficulty: 1,
    question: "Choose the correct preposition: 'The conference will be held ___ 15th March.'",
    options: ["in", "on", "at", "by"],
    correct: 1, explanation: "Use 'on' with specific dates: on 15th March, on Monday, on Christmas Day." },
  { id: "g47", topic: "prepositions", difficulty: 1,
    question: "Select the correct preposition: 'She has been working ___ this company ___ 2015.'",
    options: ["for / since", "in / for", "at / since", "for / for"],
    correct: 2, explanation: "Work 'at' a company. 'Since' + specific time point. 'At this company since 2015' is correct." },
  { id: "g48", topic: "prepositions", difficulty: 2,
    question: "Which preposition phrase is correct?",
    options: [
      "The report is based in recent data.",
      "The report is based of recent data.",
      "The report is based on recent data.",
      "The report is based from recent data."
    ],
    correct: 2, explanation: "'Based on' is the correct fixed preposition phrase: based on evidence, based on research." },
  { id: "g49", topic: "prepositions", difficulty: 2,
    question: "Choose the correct preposition: 'The results were different ___ what we expected.'",
    options: ["from", "than", "to", "Both A and C are correct"],
    correct: 3, explanation: "'Different from' (most common), 'different to' (British English), and 'different than' (American English) are all acceptable." },
  { id: "g50", topic: "prepositions", difficulty: 3,
    question: "Identify the preposition error: 'The increase of crime rates is attributed by poor economic conditions.'",
    options: [
      "'increase of' should be 'increase in'",
      "'attributed by' should be 'attributed to'",
      "Both A and B are errors",
      "No error in this sentence"
    ],
    correct: 2, explanation: "'An increase IN' something (not 'of'). 'Attributed TO' a cause (not 'by'). Both prepositions are wrong." },

  // ═══ COMPARATIVES ═══
  { id: "g51", topic: "comparatives", difficulty: 1,
    question: "Choose the correct comparative: 'This exam is ___ than the previous one.'",
    options: ["more difficult", "difficulter", "most difficult", "more difficultly"],
    correct: 0, explanation: "Multi-syllable adjectives form comparatives with 'more': 'more difficult', 'more interesting', 'more expensive'." },
  { id: "g52", topic: "comparatives", difficulty: 2,
    question: "Select the correct form: 'The ___ you practice, the ___ you will become.'",
    options: ["more / better", "more / more good", "most / best", "much / good"],
    correct: 0, explanation: "'The more...the better' is a fixed comparative structure showing proportional increase." },
  { id: "g53", topic: "comparatives", difficulty: 2,
    question: "Which sentence is grammatically correct?",
    options: [
      "She is by far the most intelligent student.",
      "She is by far the more intelligent student.",
      "She is far the most intelligent student.",
      "She is by far more intelligent student."
    ],
    correct: 0, explanation: "'By far' intensifies superlatives: 'by far the most...' is the correct structure." },
  { id: "g54", topic: "comparatives", difficulty: 3,
    question: "Choose the correct form: 'The new building is three times ___ the old one.'",
    options: [
      "taller than",
      "as tall as",
      "more tall than",
      "tallest as"
    ],
    correct: 0, explanation: "Multiplier + comparative + than: 'three times taller than', 'twice as large as', 'half the size of'." },
  { id: "g55", topic: "comparatives", difficulty: 3,
    question: "Identify the error: 'This is one of the most unique artwork I have ever seen.'",
    options: [
      "'most unique' should be 'more unique'",
      "'artwork' should be 'artworks'",
      "Both A and B are errors",
      "No error in this sentence"
    ],
    correct: 2, explanation: "'Unique' is absolute (can't be more/most unique). 'One of the most...' requires a plural noun: 'artworks'." },

  // ═══ CONJUNCTIONS ═══
  { id: "g56", topic: "conjunctions", difficulty: 1,
    question: "Choose the correct conjunction: 'She studied hard; ___, she failed the exam.'",
    options: ["therefore", "however", "moreover", "besides"],
    correct: 1, explanation: "'However' shows contrast or unexpected result. The studying hard but failing represents a contradiction." },
  { id: "g57", topic: "conjunctions", difficulty: 1,
    question: "Select the correct conjunction: '___ he is wealthy, he lives very modestly.'",
    options: ["Because", "Although", "Therefore", "In addition"],
    correct: 1, explanation: "'Although' (= even though, despite the fact that) introduces a contrasting or surprising idea." },
  { id: "g58", topic: "conjunctions", difficulty: 2,
    question: "Which conjunction correctly connects these ideas: 'It was raining. We went for a walk.'",
    options: [
      "It was raining, so we went for a walk.",
      "It was raining, but we went for a walk.",
      "It was raining, and we went for a walk.",
      "It was raining, yet we went for a walk — both B and D are correct."
    ],
    correct: 3, explanation: "Both 'but' and 'yet' express contrast. Going for a walk DESPITE rain shows contrast, so B and D are correct." },
  { id: "g59", topic: "conjunctions", difficulty: 2,
    question: "Choose the correct conjunction: 'The project will fail ___ we receive additional funding.'",
    options: ["unless", "until", "although", "while"],
    correct: 0, explanation: "'Unless' = 'if not': 'will fail unless we receive funding' = 'will fail if we do NOT receive funding'." },
  { id: "g60", topic: "conjunctions", difficulty: 3,
    question: "Identify the error: 'Despite of the bad weather, the event was a great success.'",
    options: [
      "'Despite of' should be 'Despite'",
      "'Despite of' should be 'In spite'",
      "'Despite of' should be 'Although'",
      "No error in this sentence"
    ],
    correct: 0, explanation: "'Despite' is NEVER followed by 'of'. Use 'despite + noun/gerund'. 'In spite of' (with 'of') is the alternative." }
];

export const GRAMMAR_TOPICS = [
  { id: "articles", name: "Articles", icon: "📖" },
  { id: "conditionals", name: "Conditionals", icon: "🔀" },
  { id: "passive_voice", name: "Passive Voice", icon: "🔄" },
  { id: "perfect_tenses", name: "Perfect Tenses", icon: "⏰" },
  { id: "relative_clauses", name: "Relative Clauses", icon: "🔗" },
  { id: "modal_verbs", name: "Modal Verbs", icon: "💬" },
  { id: "subject_verb_agreement", name: "Subject-Verb Agreement", icon: "✅" },
  { id: "reported_speech", name: "Reported Speech", icon: "💭" },
  { id: "gerunds_infinitives", name: "Gerunds & Infinitives", icon: "∞" },
  { id: "prepositions", name: "Prepositions", icon: "📍" },
  { id: "comparatives", name: "Comparatives", icon: "⚖️" },
  { id: "conjunctions", name: "Conjunctions", icon: "🔀" },
];
