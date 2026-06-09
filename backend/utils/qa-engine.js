/**
 * Predefined Q&A Engine
 * Matches user questions via keyword scoring and returns relevant answers.
 * No external AI/LLM API is used.
 */

const QA_PAIRS = [
  {
    keywords: ['computer', 'what is a computer'],
    question: 'What is a computer?',
    answer: 'A computer is an electronic device that processes data and performs tasks according to programmed instructions. It consists of hardware (CPU, memory, storage, I/O devices) and software (operating system, applications). Modern computers can perform billions of calculations per second.'
  },
  {
    keywords: ['machine learning', 'ml', 'what is machine learning'],
    question: 'What is machine learning?',
    answer: 'Machine learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on building algorithms that can access data and use it to learn for themselves. Common types include supervised learning, unsupervised learning, and reinforcement learning.'
  },
  {
    keywords: ['artificial intelligence', 'ai', 'what is ai', 'what is artificial intelligence'],
    question: 'What is artificial intelligence?',
    answer: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think and learn like humans. AI encompasses a wide range of capabilities including natural language processing, computer vision, problem solving, and decision making. Key branches include machine learning, deep learning, and neural networks.'
  },
  {
    keywords: ['python', 'what is python', 'python programming'],
    question: 'What is Python?',
    answer: 'Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, it supports multiple programming paradigms including procedural, object-oriented, and functional programming. Python is widely used in web development, data science, AI/ML, automation, and scientific computing.'
  },
  {
    keywords: ['javascript', 'what is javascript', 'js'],
    question: 'What is JavaScript?',
    answer: 'JavaScript is a dynamic, interpreted programming language primarily used to create interactive and responsive web pages. It runs in the browser and on servers (via Node.js). JavaScript supports event-driven, functional, and object-oriented programming styles. It is one of the three core technologies of the World Wide Web alongside HTML and CSS.'
  },
  {
    keywords: ['database', 'what is a database', 'sql'],
    question: 'What is a database?',
    answer: 'A database is an organized collection of structured data stored and accessed electronically. Databases are managed by Database Management Systems (DBMS). Common types include relational databases (MySQL, PostgreSQL, SQLite) that use SQL, and NoSQL databases (MongoDB, Redis) for unstructured data. Databases ensure data integrity, security, and efficient retrieval.'
  },
  {
    keywords: ['internet', 'what is the internet', 'how does the internet work'],
    question: 'What is the Internet?',
    answer: 'The Internet is a global network of billions of computers and devices connected together using standardized communication protocols (primarily TCP/IP). It enables sharing of information, communication, commerce, and services worldwide. The World Wide Web (WWW) is a system built on top of the Internet that uses HTTP to link and access web pages.'
  },
  {
    keywords: ['photosynthesis', 'what is photosynthesis'],
    question: 'What is photosynthesis?',
    answer: 'Photosynthesis is the biological process by which plants, algae, and some bacteria convert light energy (usually from the sun) into chemical energy stored as glucose. The overall equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It occurs in chloroplasts and is fundamental to life on Earth as it produces oxygen and forms the base of most food chains.'
  },
  {
    keywords: ['gravity', 'what is gravity', 'how does gravity work'],
    question: 'What is gravity?',
    answer: 'Gravity is a fundamental force of nature that attracts objects with mass toward one another. Described by Newton\'s Law of Universal Gravitation (F = Gm₁m₂/r²), it keeps planets in orbit around the sun and objects on Earth\'s surface. Einstein\'s General Theory of Relativity further describes gravity as the curvature of spacetime caused by mass and energy.'
  },
  {
    keywords: ['dna', 'what is dna', 'deoxyribonucleic'],
    question: 'What is DNA?',
    answer: 'DNA (Deoxyribonucleic Acid) is the hereditary material in all known living organisms and many viruses. It is a double-helix molecule made of nucleotides containing the bases adenine (A), thymine (T), guanine (G), and cytosine (C). DNA contains the genetic instructions for development, functioning, growth, and reproduction of all living things.'
  },
  {
    keywords: ['climate change', 'global warming', 'greenhouse effect'],
    question: 'What is climate change?',
    answer: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While some variation is natural, since the 20th century human activities — particularly burning fossil fuels — have been the primary driver. This releases greenhouse gases (CO₂, methane) that trap heat in the atmosphere, causing global warming, rising sea levels, and extreme weather events.'
  },
  {
    keywords: ['blockchain', 'what is blockchain', 'cryptocurrency'],
    question: 'What is blockchain?',
    answer: 'A blockchain is a distributed, decentralized digital ledger that records transactions across many computers so that records cannot be altered retroactively. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block, forming a chain. Blockchain is the foundation of cryptocurrencies like Bitcoin and has applications in finance, supply chain, healthcare, and more.'
  },
  {
    keywords: ['france', 'capital of france', 'paris'],
    question: 'What is the capital of France?',
    answer: 'Paris is the capital and most populous city of France. Known as the "City of Light," Paris is a global center of art, fashion, gastronomy, and culture. It is home to iconic landmarks like the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral. Paris has a population of over 2 million in the city proper.'
  },
  {
    keywords: ['telephone', 'who invented the telephone', 'alexander graham bell'],
    question: 'Who invented the telephone?',
    answer: 'Alexander Graham Bell is credited with inventing and patenting the first practical telephone in 1876. He transmitted the first intelligible speech over a wire, saying "Mr. Watson, come here, I want to see you." Though Elisha Gray and Antonio Meucci also contributed to telephone development, Bell received the first patent and is historically credited with the invention.'
  },
  {
    keywords: ['solar system', 'planets', 'how many planets'],
    question: 'How many planets are in the solar system?',
    answer: 'There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a "dwarf planet" by the International Astronomical Union in 2006. The four inner rocky planets are terrestrial, while the four outer planets are gas giants (Jupiter, Saturn) and ice giants (Uranus, Neptune).'
  },
  {
    keywords: ['water', 'what is water', 'h2o', 'chemical formula of water'],
    question: 'What is the chemical formula of water?',
    answer: 'The chemical formula of water is H₂O, meaning each molecule consists of two hydrogen atoms covalently bonded to one oxygen atom. Water is a polar molecule, making it an excellent solvent. It exists in three states: liquid (water), solid (ice), and gas (steam/water vapor). Water covers about 71% of Earth\'s surface and is essential for all known life.'
  },
  {
    keywords: ['newton', 'isaac newton', 'laws of motion'],
    question: 'What are Newton\'s Laws of Motion?',
    answer: 'Newton\'s Three Laws of Motion are: (1) First Law (Inertia): An object at rest stays at rest and an object in motion stays in motion unless acted upon by a net external force. (2) Second Law: Force equals mass times acceleration (F = ma). (3) Third Law: For every action, there is an equal and opposite reaction. These laws form the foundation of classical mechanics.'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    question: 'Hello!',
    answer: 'Hello! I\'m Comet, your AI assistant. I\'m here to answer your questions across a wide range of topics including science, technology, history, geography, and more. What would you like to know today?'
  },
  {
    keywords: ['who are you', 'what are you', 'your name', 'about you'],
    question: 'Who are you?',
    answer: 'I\'m Comet, an AI assistant built to answer your questions using a curated knowledge base. I can help you with topics in computer science, science, history, geography, mathematics, and general knowledge. Ask me anything!'
  },
  {
    keywords: ['programming', 'what is programming', 'coding', 'software development'],
    question: 'What is programming?',
    answer: 'Programming (or coding) is the process of creating a set of instructions that tell a computer how to perform a task. Programmers write source code in programming languages like Python, JavaScript, Java, C++, etc. Software development encompasses the full lifecycle: design, coding, testing, and deployment of software applications.'
  },
  {
    keywords: ['india', 'capital of india', 'new delhi'],
    question: 'What is the capital of India?',
    answer: 'New Delhi is the capital of India and serves as the seat of all three branches of the Government of India. It is part of the National Capital Territory of Delhi. New Delhi was designed by British architects Edwin Lutyens and Herbert Baker and officially became India\'s capital in 1931. India\'s capital before New Delhi was Calcutta (now Kolkata).'
  },
  {
    keywords: ['moon', 'distance to moon', 'how far is the moon'],
    question: 'How far is the Moon from Earth?',
    answer: 'The Moon is approximately 384,400 km (238,855 miles) from Earth on average. This distance varies because the Moon\'s orbit is elliptical — at perigee (closest point) it is about 356,500 km away, and at apogee (farthest point) it is about 406,700 km away. Light from the Moon reaches Earth in about 1.3 seconds.'
  },
  {
    keywords: ['einstein', 'theory of relativity', 'e=mc2', 'albert einstein'],
    question: 'What is Einstein\'s Theory of Relativity?',
    answer: 'Albert Einstein proposed two theories of relativity: Special Relativity (1905) establishes that the laws of physics are the same for all non-accelerating observers and that the speed of light in a vacuum is constant (c ≈ 3×10⁸ m/s). It gave us E=mc², showing mass and energy are interchangeable. General Relativity (1915) extended this to include gravity, describing it as the curvature of spacetime caused by mass.'
  },
  {
    keywords: ['thanks', 'thank you', 'great', 'awesome'],
    question: 'You\'re welcome!',
    answer: 'You\'re welcome! Feel free to ask me any other questions. I\'m here to help you learn and explore a wide range of topics.'
  }
];

/**
 * Find the best matching answer for a given user message.
 * Uses keyword scoring: more matching keywords = higher score.
 */
function findAnswer(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const pair of QA_PAIRS) {
    let score = 0;
    for (const keyword of pair.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        score += keyword.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pair;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }

  return `I don't have a specific answer for "${userMessage}" in my knowledge base yet, but I'm constantly learning! Try asking about topics like computer science, AI, machine learning, science, geography, or history. For example: "What is machine learning?" or "What is photosynthesis?"`;
}

module.exports = { findAnswer };
