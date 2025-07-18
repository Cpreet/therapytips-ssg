export interface PersonalityTestData {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  article_type: "personality-tests";
  author_id: number;
  publication_date: string;
  hero_image_url: string;
  hero_image_alt: string;
  meta_description: string;
  questions: Array<{
    text: string;
    order: number;
  }>;
}

export const personalityTestsData: PersonalityTestData[] = [
  {
    id: 1,
    title: "Active-Empathic Listening Scale",
    subtitle: "Discover how well you listen with empathy and understanding to others",
    slug: "active-empathic-listening-scale",
    description: "## About This Test\n\nThe Active-Empathic Listening Scale measures your ability to listen to others with genuine empathy and understanding. This research-based assessment evaluates how well you:\n\n- Pay attention to emotional cues\n- Respond with empathy\n- Avoid judgment\n- Show genuine concern for others\n\n**Instructions:** Please rate each statement based on how often you typically behave this way when listening to others.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-01-15",
    hero_image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
    hero_image_alt: "Two people having a deep conversation, representing empathic listening",
    meta_description: "Test your empathic listening skills with this research-based assessment. Discover how well you listen with empathy and understanding.",
    questions: [
      { text: "I am sensitive to what others are not saying.", order: 1 },
      { text: "I listen for more than just the words.", order: 2 },
      { text: "I assure others that I will remember what they say.", order: 3 },
      { text: "I summarize what others say to clarify understanding.", order: 4 },
      { text: "I encourage others to continue speaking when they pause.", order: 5 },
      { text: "I show concern for others by maintaining eye contact.", order: 6 },
      { text: "I ask questions that show my understanding of their position.", order: 7 },
      { text: "I show others that I am listening by my body language.", order: 8 },
      { text: "I assure others that there is value in their viewpoint.", order: 9 }
    ]
  },
  {
    id: 2,
    title: "Relationship Satisfaction Scale",
    subtitle: "Assess the overall quality and satisfaction in your romantic relationship",
    slug: "relationship-satisfaction-scale",
    description: "## About This Test\n\nThe Relationship Satisfaction Scale is a validated measure that assesses various dimensions of relationship quality. This comprehensive assessment evaluates:\n\n- Communication effectiveness\n- Emotional intimacy\n- Conflict resolution\n- Shared goals and values\n- Physical and emotional connection\n\n**Instructions:** Think about your current romantic relationship and rate how much you agree with each statement.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-01-20",
    hero_image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop",
    hero_image_alt: "Happy couple holding hands, representing relationship satisfaction",
    meta_description: "Evaluate your relationship satisfaction with this comprehensive scale. Assess communication, intimacy, and overall relationship quality.",
    questions: [
      { text: "I feel satisfied with the level of communication in my relationship.", order: 1 },
      { text: "My partner and I resolve conflicts in a healthy way.", order: 2 },
      { text: "I feel emotionally connected to my partner.", order: 3 },
      { text: "We share similar values and life goals.", order: 4 },
      { text: "I feel physically satisfied in my relationship.", order: 5 },
      { text: "My partner shows appreciation for who I am.", order: 6 },
      { text: "We spend quality time together regularly.", order: 7 },
      { text: "I trust my partner completely.", order: 8 },
      { text: "We support each other's personal growth.", order: 9 },
      { text: "Overall, I am happy in my relationship.", order: 10 }
    ]
  },
  {
    id: 3,
    title: "Highly Sensitive Person Scale",
    subtitle: "Discover if you have the trait of high sensitivity and how it affects your daily life",
    slug: "highly-sensitive-person-scale",
    description: "## About This Test\n\nThe Highly Sensitive Person Scale measures sensory processing sensitivity, a trait found in 15-20% of the population. This assessment evaluates:\n\n- Environmental sensitivity\n- Emotional responsiveness\n- Aesthetic sensitivity\n- Processing depth\n\n**Instructions:** Rate each statement based on how true it is for you personally.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-01-25",
    hero_image_url: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800&h=400&fit=crop",
    hero_image_alt: "Person in quiet contemplation, representing high sensitivity",
    meta_description: "Take the Highly Sensitive Person Scale to discover if you have the trait of high sensitivity and how it impacts your life.",
    questions: [
      { text: "I get rattled when I have a lot to do in a short amount of time.", order: 1 },
      { text: "I am annoyed when people try to get me to do too many things at once.", order: 2 },
      { text: "I find it unpleasant to have a lot going on at once.", order: 3 },
      { text: "I notice or enjoy delicate or fine scents, tastes, sounds, works of art.", order: 4 },
      { text: "I have a rich, complex inner life.", order: 5 },
      { text: "I am deeply moved by the arts or music.", order: 6 },
      { text: "I get nervous when people watch me perform tasks.", order: 7 },
      { text: "I am easily overwhelmed by things like bright lights, strong smells, coarse fabrics, or sirens close by.", order: 8 },
      { text: "I make it a high priority to arrange my life to avoid upsetting or overwhelming situations.", order: 9 },
      { text: "When I must compete or be observed while performing a task, I become so nervous or shaky that I do much worse than I would otherwise.", order: 10 },
      { text: "I am made uncomfortable by loud noises.", order: 11 },
      { text: "I startle easily.", order: 12 }
    ]
  },
  {
    id: 4,
    title: "Mindful Attention Awareness Scale",
    subtitle: "Measure your dispositional mindfulness and present-moment awareness",
    slug: "mindful-attention-awareness-scale",
    description: "## About This Test\n\nThe Mindful Attention Awareness Scale (MAAS) measures trait mindfulness - your general tendency to be attentive to and aware of present-moment experience. This assessment evaluates:\n\n- Present-moment awareness\n- Attention regulation\n- Automatic pilot detection\n- Mind-wandering tendencies\n\n**Instructions:** Rate how frequently or infrequently you experience each situation.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-02-01",
    hero_image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    hero_image_alt: "Person meditating in nature, representing mindful awareness",
    meta_description: "Assess your mindfulness levels with the scientifically validated Mindful Attention Awareness Scale. Discover your present-moment awareness.",
    questions: [
      { text: "I could be experiencing some emotion and not be conscious of it until some time later.", order: 1 },
      { text: "I break or spill things because of carelessness, not paying attention, or thinking of something else.", order: 2 },
      { text: "I find it difficult to stay focused on what's happening in the present.", order: 3 },
      { text: "I tend to walk quickly to get where I'm going without paying attention to what I experience along the way.", order: 4 },
      { text: "I tend not to notice feelings of physical tension or discomfort until they really grab my attention.", order: 5 },
      { text: "I forget a person's name almost as soon as I've been told it for the first time.", order: 6 },
      { text: "It seems I am 'running on automatic' without much awareness of what I'm doing.", order: 7 },
      { text: "I rush through activities without being really attentive to them.", order: 8 },
      { text: "I get so focused on the goal I want to achieve that I lose touch with what I am doing right now to get there.", order: 9 },
      { text: "I do jobs or tasks automatically, without being aware of what I'm doing.", order: 10 },
      { text: "I find myself listening to someone with one ear, doing something else at the same time.", order: 11 },
      { text: "I drive places on 'automatic pilot' and then wonder why I went there.", order: 12 },
      { text: "I find myself preoccupied with the future or the past.", order: 13 },
      { text: "I find myself doing things without paying attention.", order: 14 },
      { text: "I snack without being aware that I'm eating.", order: 15 }
    ]
  },
  {
    id: 5,
    title: "Authenticity in Relationships Scale",
    subtitle: "Evaluate how authentic and genuine you are in your close relationships",
    slug: "authenticity-in-relationships-scale",
    description: "## About This Test\n\nThe Authenticity in Relationships Scale measures how genuine and true to yourself you are when interacting with others. This assessment evaluates:\n\n- Self-expression authenticity\n- Emotional honesty\n- Value alignment\n- Genuine communication\n\n**Instructions:** Think about your close relationships and rate how true each statement is for you.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-02-05",
    hero_image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
    hero_image_alt: "Two friends having an authentic conversation, representing relationship authenticity",
    meta_description: "Discover how authentic you are in relationships with this comprehensive scale. Assess your genuine self-expression and emotional honesty.",
    questions: [
      { text: "I feel comfortable expressing my true opinions in my relationships.", order: 1 },
      { text: "I share my real feelings, even when they might be unpopular.", order: 2 },
      { text: "I act in ways that are consistent with my values in my relationships.", order: 3 },
      { text: "I feel I can be my true self around the people I'm close to.", order: 4 },
      { text: "I'm honest about my flaws and mistakes with people I trust.", order: 5 },
      { text: "I don't pretend to be someone I'm not to gain approval.", order: 6 },
      { text: "I express my needs clearly rather than expecting others to guess.", order: 7 },
      { text: "I maintain my personal boundaries even when it's difficult.", order: 8 },
      { text: "I'm genuine in my compliments and expressions of care.", order: 9 },
      { text: "I admit when I don't know something rather than pretending I do.", order: 10 }
    ]
  },
  {
    id: 6,
    title: "Emotional Intelligence Scale",
    subtitle: "Assess your ability to understand and manage emotions in yourself and others",
    slug: "emotional-intelligence-scale",
    description: "## About This Test\n\nThe Emotional Intelligence Scale measures your ability to perceive, understand, and manage emotions effectively. This assessment evaluates:\n\n- Self-awareness\n- Self-regulation\n- Empathy\n- Social skills\n- Emotional perception\n\n**Instructions:** Rate how well each statement describes you in general.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-02-10",
    hero_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    hero_image_alt: "Person showing emotional understanding, representing emotional intelligence",
    meta_description: "Test your emotional intelligence with this comprehensive scale. Evaluate your ability to understand and manage emotions effectively.",
    questions: [
      { text: "I have a good sense of why I have certain feelings most of the time.", order: 1 },
      { text: "I can tell how people are feeling by listening to the tone of their voice.", order: 2 },
      { text: "I find it easy to understand the non-verbal messages of other people.", order: 3 },
      { text: "I can stay calm even when I'm feeling a lot of pressure.", order: 4 },
      { text: "I am aware of my emotions as I experience them.", order: 5 },
      { text: "I can easily motivate myself to do tasks I don't enjoy.", order: 6 },
      { text: "I can tell when people don't mean what they say.", order: 7 },
      { text: "I find it easy to make friends.", order: 8 },
      { text: "I know when to speak about my personal problems to others.", order: 9 },
      { text: "I can control my temper and handle difficulties rationally.", order: 10 },
      { text: "I am good at reading other people's emotions.", order: 11 },
      { text: "I can manage my emotions when I need to.", order: 12 }
    ]
  },
  {
    id: 7,
    title: "Attachment Style Assessment",
    subtitle: "Discover your attachment style and how it influences your relationships",
    slug: "attachment-style-assessment",
    description: "## About This Test\n\nThe Attachment Style Assessment identifies your primary attachment pattern based on attachment theory. This assessment evaluates:\n\n- Secure attachment\n- Anxious-preoccupied attachment\n- Dismissive-avoidant attachment\n- Disorganized attachment\n\n**Instructions:** Think about how you generally feel and behave in close relationships and rate each statement.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-02-15",
    hero_image_url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=400&fit=crop",
    hero_image_alt: "Parent and child showing secure attachment, representing attachment styles",
    meta_description: "Discover your attachment style with this research-based assessment. Learn how your attachment patterns influence your relationships.",
    questions: [
      { text: "I find it easy to become emotionally close to others.", order: 1 },
      { text: "I worry about being abandoned by people I care about.", order: 2 },
      { text: "I prefer to keep some distance in close relationships.", order: 3 },
      { text: "I get nervous when anyone gets too close to me.", order: 4 },
      { text: "I often worry that my partner doesn't care about me as much as I care about them.", order: 5 },
      { text: "I feel comfortable depending on others and having others depend on me.", order: 6 },
      { text: "I find it difficult to trust others completely.", order: 7 },
      { text: "I want to be very close to others, but I often find that others are reluctant to get as close as I would like.", order: 8 },
      { text: "I am comfortable without close emotional relationships.", order: 9 },
      { text: "I worry about people getting to know the 'real' me.", order: 10 },
      { text: "I find it easy to trust others in relationships.", order: 11 },
      { text: "Sometimes I feel like I want to merge completely with another person.", order: 12 }
    ]
  },
  {
    id: 8,
    title: "Self-Compassion Scale",
    subtitle: "Measure how kind and understanding you are toward yourself during difficult times",
    slug: "self-compassion-scale",
    description: "## About This Test\n\nThe Self-Compassion Scale measures how you typically act toward yourself in difficult times. This assessment evaluates:\n\n- Self-kindness vs. self-judgment\n- Common humanity vs. isolation\n- Mindfulness vs. over-identification\n\n**Instructions:** Please read each statement carefully and indicate how often you behave in the stated manner.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-02-20",
    hero_image_url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=400&fit=crop",
    hero_image_alt: "Person practicing self-care and compassion, representing self-compassion",
    meta_description: "Assess your self-compassion levels with this research-validated scale. Learn how to be kinder to yourself during difficult times.",
    questions: [
      { text: "I'm disapproving and judgmental about my own flaws and inadequacies.", order: 1 },
      { text: "When I'm feeling down, I tend to obsess and fixate on everything that's wrong.", order: 2 },
      { text: "When things are going badly for me, I see the difficulties as part of life that everyone goes through.", order: 3 },
      { text: "When I think about my inadequacies, it tends to make me feel more separate and cut off from the rest of the world.", order: 4 },
      { text: "I try to be loving toward myself when I'm feeling emotional pain.", order: 5 },
      { text: "When I fail at something important to me, I become consumed by feelings of inadequacy.", order: 6 },
      { text: "When I'm down and out, I remind myself that there are lots of other people in the world feeling like I am.", order: 7 },
      { text: "When I'm going through a very hard time, I give myself the caring and tenderness I need.", order: 8 },
      { text: "When something upsets me, I try to keep my emotions in balance.", order: 9 },
      { text: "When I feel inadequate in some way, I try to remind myself that feelings of inadequacy are shared by most people.", order: 10 },
      { text: "I'm intolerant and impatient towards those aspects of my personality I don't like.", order: 11 },
      { text: "When I'm going through a hard time, I approach myself with kindness and understanding.", order: 12 }
    ]
  },
  {
    id: 9,
    title: "Love Languages Assessment",
    subtitle: "Discover your primary love language and how you prefer to give and receive love",
    slug: "love-languages-assessment",
    description: "## About This Test\n\nThe Love Languages Assessment identifies your primary love language based on Dr. Gary Chapman's research. This assessment evaluates your preferences for:\n\n- Words of Affirmation\n- Quality Time\n- Physical Touch\n- Acts of Service\n- Receiving Gifts\n\n**Instructions:** Choose the statement from each pair that best describes how you prefer to give or receive love.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-02-25",
    hero_image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=400&fit=crop",
    hero_image_alt: "Couple expressing love in different ways, representing love languages",
    meta_description: "Discover your love language with this comprehensive assessment. Learn how you prefer to give and receive love in relationships.",
    questions: [
      { text: "I feel most loved when my partner tells me they appreciate me.", order: 1 },
      { text: "I feel most loved when my partner gives me their undivided attention.", order: 2 },
      { text: "I feel most loved when my partner helps me with tasks.", order: 3 },
      { text: "I feel most loved when my partner gives me thoughtful gifts.", order: 4 },
      { text: "I feel most loved when my partner hugs, kisses, or holds me.", order: 5 },
      { text: "I prefer to receive compliments and words of encouragement.", order: 6 },
      { text: "I prefer when my partner makes time for just the two of us.", order: 7 },
      { text: "I prefer when my partner does something practical to help me.", order: 8 },
      { text: "I prefer when my partner surprises me with meaningful gifts.", order: 9 },
      { text: "I prefer physical closeness and affectionate touch.", order: 10 },
      { text: "Hearing 'I love you' means a lot to me.", order: 11 },
      { text: "Having my partner's full attention during conversations is important.", order: 12 },
      { text: "When my partner helps with chores without being asked, I feel valued.", order: 13 },
      { text: "Small, thoughtful gifts make me feel special.", order: 14 },
      { text: "Physical affection like holding hands helps me feel connected.", order: 15 }
    ]
  },
  {
    id: 10,
    title: "Conflict Resolution Style Inventory",
    subtitle: "Identify your natural approach to handling conflicts and disagreements",
    slug: "conflict-resolution-style-inventory",
    description: "## About This Test\n\nThe Conflict Resolution Style Inventory identifies your preferred approach to handling conflicts based on the Thomas-Kilmann model. This assessment evaluates:\n\n- Competing (assertive, uncooperative)\n- Accommodating (unassertive, cooperative)\n- Avoiding (unassertive, uncooperative)\n- Collaborating (assertive, cooperative)\n- Compromising (moderate assertiveness and cooperation)\n\n**Instructions:** For each situation, rate how likely you are to respond in the described way.",
    article_type: "personality-tests",
    author_id: 1,
    publication_date: "2024-03-01",
    hero_image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    hero_image_alt: "People in discussion resolving conflict, representing conflict resolution",
    meta_description: "Discover your conflict resolution style with this research-based inventory. Learn how you naturally handle disagreements and conflicts.",
    questions: [
      { text: "When in conflict, I try to find a solution that meets everyone's needs.", order: 1 },
      { text: "I avoid bringing up controversial topics that might cause conflict.", order: 2 },
      { text: "I stand firm on my position when I believe I'm right.", order: 3 },
      { text: "I'm willing to give up some of what I want to reach an agreement.", order: 4 },
      { text: "I often go along with others' suggestions to avoid conflict.", order: 5 },
      { text: "I try to find a middle ground that partially satisfies everyone.", order: 6 },
      { text: "I work hard to understand all sides of a disagreement.", order: 7 },
      { text: "I tend to postpone difficult conversations.", order: 8 },
      { text: "I argue vigorously for my point of view.", order: 9 },
      { text: "I focus on preserving relationships even if I have to give in.", order: 10 },
      { text: "I seek solutions where everyone can win something.", order: 11 },
      { text: "I encourage open discussion of different viewpoints.", order: 12 },
      { text: "I try to avoid situations where conflict might arise.", order: 13 },
      { text: "I push for my preferred solution when others disagree.", order: 14 },
      { text: "I'm quick to accommodate others' wishes to maintain harmony.", order: 15 }
    ]
  }
]; 