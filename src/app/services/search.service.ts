import { Injectable, signal, computed } from '@angular/core';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  favicon: string;
  snippet: string;
}

export interface AiAnswer {
  content: string;
  isStreaming: boolean;
  sources: SearchResult[];
  relatedQuestions: string[];
}

const MOCK_RESULTS: Record<string, SearchResult[]> = {
  default: [
    { id:'1', title:'What is Perplexity AI? How does it work?', url:'https://www.perplexity.ai/hub/blog/what-is-perplexity-ai', domain:'perplexity.ai', favicon:'P', snippet:'Perplexity AI is a conversational search engine that uses large language models to answer questions in real-time by searching the web and synthesizing information.' },
    { id:'2', title:'Perplexity AI - Wikipedia', url:'https://en.wikipedia.org/wiki/Perplexity_AI', domain:'en.wikipedia.org', favicon:'W', snippet:'Perplexity AI is an AI-powered search engine and chatbot that was launched in 2022. It provides direct, conversational answers to user queries.' },
    { id:'3', title:'Perplexity AI Review: The Best AI Search Engine?', url:'https://www.techradar.com/best/perplexity-ai-review', domain:'techradar.com', favicon:'T', snippet:'Our comprehensive Perplexity AI review covers features, pricing, and how it compares to Google, ChatGPT, and other AI search tools.' },
    { id:'4', title:'How Perplexity AI is changing the way we search', url:'https://www.theverge.com/ai-perplexity', domain:'theverge.com', favicon:'V', snippet:'The startup\'s AI-powered search engine is trying to replace Google by giving users direct answers instead of a list of links to click through.' },
    { id:'5', title:'Perplexity AI Raises $250 Million at $9 Billion Valuation', url:'https://www.wsj.com/tech/ai/perplexity', domain:'wsj.com', favicon:'W', snippet:'The AI search startup continues its rapid growth trajectory with new funding from top-tier venture capital firms and technology companies.' },
  ],
  quantum: [
    { id:'6', title:'What is Quantum Computing? | IBM', url:'https://www.ibm.com/topics/quantum-computing', domain:'ibm.com', favicon:'I', snippet:'Quantum computing is a rapidly emerging technology that harnesses quantum mechanical phenomena like superposition and entanglement to perform computations.' },
    { id:'7', title:'Quantum Computing - Nature', url:'https://www.nature.com/subjects/quantum-computing', domain:'nature.com', favicon:'N', snippet:'The latest research and developments in quantum computing, including breakthroughs in error correction and qubit stability.' },
    { id:'8', title:'Google Achieves Quantum Supremacy', url:'https://ai.google/research/quantum', domain:'ai.google', favicon:'G', snippet:'Google\'s Sycamore processor completed a computation in 200 seconds that would take the world\'s fastest supercomputer 10,000 years.' },
  ],
  climate: [
    { id:'9', title:'Climate Change: Vital Signs of the Planet', url:'https://climate.nasa.gov', domain:'climate.nasa.gov', favicon:'N', snippet:'NASA\'s climate website provides key indicators of Earth\'s changing climate, including global temperature, sea level, and Arctic ice extent.' },
    { id:'10', title:'IPCC Sixth Assessment Report', url:'https://www.ipcc.ch/report/ar6', domain:'ipcc.ch', favicon:'I', snippet:'The IPCC\'s latest report on climate change: causes, impacts, and solutions for limiting global warming to 1.5°C.' },
  ],
};

const MOCK_AI: Record<string, string> = {
  default: `Perplexity AI is a **conversational search engine** that combines the power of large language models (LLMs) with real-time web search to provide accurate, cited answers.

## How It Works

Unlike traditional search engines that return a list of links, Perplexity:

1. **Understands your question** using advanced NLP
2. **Searches the web** in real-time across trusted sources
3. **Synthesizes an answer** with inline citations
4. **Suggests follow-up questions** to deepen exploration

## Key Features

- Real-time web search with citations
- Multiple AI models (Claude, GPT-4, Llama)
- Image and file analysis
- Collaborative Spaces for teams
- Focus modes: Web, Academic, YouTube, Reddit`,

  quantum: `**Quantum computing** is a type of computation that harnesses quantum mechanical phenomena — including **superposition**, **entanglement**, and **interference** — to process information in fundamentally different ways than classical computers.

## Core Concepts

- **Qubits**: The quantum equivalent of classical bits, which can exist in superposition (both 0 and 1 simultaneously)
- **Entanglement**: Two qubits can be correlated regardless of distance
- **Quantum gates**: Operations that manipulate qubit states

## Current State (2025)

IBM's latest **Heron r2** processor has achieved over **99.9% gate fidelity**, bringing practical quantum advantage closer. Google, Microsoft, and startups like IonQ are racing to build fault-tolerant quantum computers.

> Practical quantum advantage for chemistry and optimization problems is expected by **2027–2030**.`,

  climate: `**Climate change** refers to long-term shifts in global temperatures and weather patterns. While some climate variation is natural, since the mid-20th century, human activities — particularly **fossil fuel burning** — have been the main driver.

## Key Indicators (2025)

- Global average temperature: **1.4°C above pre-industrial levels**
- Arctic sea ice extent: At record lows for 2024–25
- CO₂ concentration: **424 ppm** (highest in 3 million years)

## Solutions

1. **Renewable energy** transition (solar now cheapest electricity source ever)
2. **Carbon capture** technology scaling
3. **Electric vehicle** adoption accelerating globally
4. **Policy frameworks** like carbon pricing

The Paris Agreement target of 1.5°C remains technically achievable but requires **immediate, drastic action**.`,
};

const RELATED_QUESTIONS: Record<string, string[]> = {
  default: ['How does Perplexity AI compare to ChatGPT?', 'Is Perplexity AI free to use?', 'What models does Perplexity use?', 'How accurate is Perplexity AI?'],
  quantum: ['What are the applications of quantum computing?', 'How many qubits does IBM\'s latest processor have?', 'When will quantum computers be commercially available?', 'What is quantum entanglement?'],
  climate: ['What is the Paris Agreement?', 'How does solar energy reduce carbon emissions?', 'What are the effects of rising sea levels?', 'Which countries have reached net zero?'],
};

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');
  readonly results = signal<SearchResult[]>([]);
  readonly answer = signal<AiAnswer | null>(null);
  readonly isLoading = signal(false);
  readonly history = signal<{id:string;query:string;ts:Date}[]>([]);
  readonly topicKey = signal('default');

  readonly hasResults = computed(() => this.results().length > 0);

  search(q: string): void {
    if (!q.trim()) return;
    this.query.set(q);
    this.isLoading.set(true);
    this.results.set([]);
    this.answer.set(null);

    const key = this.getKey(q);
    this.topicKey.set(key);
    setTimeout(() => {
      this.results.set(MOCK_RESULTS[key] ?? MOCK_RESULTS['default']);
      this.isLoading.set(false);
      this.streamAnswer(key);
      this.history.update(h => [{ id: `h${Date.now()}`, query: q, ts: new Date() }, ...h].slice(0, 20));
    }, 800);
  }

  private streamAnswer(key: string): void {
    const full = MOCK_AI[key] ?? MOCK_AI['default'];
    const sources = MOCK_RESULTS[key] ?? MOCK_RESULTS['default'];
    const related = RELATED_QUESTIONS[key] ?? RELATED_QUESTIONS['default'];

    this.answer.set({ content: '', isStreaming: true, sources, relatedQuestions: related });

    let i = 0;
    const iv = setInterval(() => {
      i += 4;
      this.answer.update(a => a ? { ...a, content: full.slice(0, i), isStreaming: i < full.length } : a);
      if (i >= full.length) clearInterval(iv);
    }, 15);
  }

  clear(): void {
    this.query.set('');
    this.results.set([]);
    this.answer.set(null);
  }

  private getKey(q: string): string {
    const lq = q.toLowerCase();
    if (lq.includes('quantum')) return 'quantum';
    if (lq.includes('climate') || lq.includes('carbon') || lq.includes('warming')) return 'climate';
    return 'default';
  }
}
