import { Component, signal } from '@angular/core';

interface Article {
  id: string; title: string; summary: string; image: string;
  sources: number; time: string; topic: string; liked: boolean;
}

const ARTICLES: Article[] = [
  { id:'1', title:'Delhi HC issues notice to CBSE over Class 12 marking row', summary:'A vacation bench directed the Centre and CBSE to respond to NSUI\'s PIL alleging large-scale irregularities in the new on-screen marking system.', image:'https://picsum.photos/seed/1/400/220', sources:30, time:'22 minutes ago', topic:'Education', liked:false },
  { id:'2', title:'TMC\'s Jahangir Khan arrested near Nepal border', summary:'West Bengal police arrested TMC leader Jahangir Khan near the Nepal border on multiple charges including sedition and criminal conspiracy.', image:'https://picsum.photos/seed/2/400/220', sources:12, time:'1 hour ago', topic:'Politics', liked:false },
  { id:'3', title:'Indian firms hike prices, shrink packs as Iran war lifts costs', summary:'Companies across sectors are resorting to shrinkflation and outright price increases as geopolitical tensions push raw material costs higher.', image:'https://picsum.photos/seed/3/400/220', sources:29, time:'2 hours ago', topic:'Business', liked:false },
  { id:'4', title:'Amit Shah to launch digital land port system on Tuesday', summary:'Home Minister Amit Shah will inaugurate an integrated land port management system to streamline cross-border trade and reduce bottlenecks.', image:'https://picsum.photos/seed/4/400/220', sources:14, time:'3 hours ago', topic:'Technology', liked:false },
  { id:'5', title:'TMC\'s Sukhendu Sekhar Ray quits Rajya Sabha, party', summary:'Senior TMC leader and Rajya Sabha MP Sukhendu Sekhar Ray resigned from both the party and Parliament, citing irreconcilable differences.', image:'https://picsum.photos/seed/5/400/220', sources:21, time:'4 hours ago', topic:'Politics', liked:false },
  { id:'6', title:'India\'s tech startups raise record $8.2 billion in Q1 2025', summary:'Indian startups secured record funding in the first quarter of 2025, driven by AI, fintech, and enterprise software sectors.', image:'https://picsum.photos/seed/6/400/220', sources:18, time:'5 hours ago', topic:'Tech & Science', liked:false },
  { id:'7', title:'Reserve Bank holds repo rate at 6.25% amid inflation concerns', summary:'The RBI\'s Monetary Policy Committee voted unanimously to hold the benchmark interest rate steady, signaling caution on growth prospects.', image:'https://picsum.photos/seed/7/400/220', sources:33, time:'6 hours ago', topic:'Business', liked:false },
];

@Component({
  selector: 'app-discover',
  standalone: true,
  template: `
  <div class="discover-page">
    <!-- Header -->
    <div class="discover-header">
      <h2 class="discover-title">Discover</h2>
      <div class="discover-tabs">
        <button class="dtab active">Top</button>
        <button class="dtab">Topics <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      </div>
      <div class="share-btn-wrap">
        <button class="share-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="1.6"/></svg>
          Share
        </button>
      </div>
    </div>

    <div class="discover-layout">
      <!-- Articles -->
      <div class="articles-col">
        <!-- Hero article -->
        <div class="article hero-article" id="article-1" (click)="openArticle(articles()[0])" style="cursor: pointer;">
          <div class="hero-text">
            <div class="article-topic">{{ articles()[0].topic }}</div>
            <h3 class="hero-title">{{ articles()[0].title }}</h3>
            <div class="article-meta">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              Published {{ articles()[0].time }}
            </div>
            <p class="hero-summary">{{ articles()[0].summary }}</p>
            <div class="article-footer">
              <div class="sources-count">
                <div class="source-dots">
                  <span class="dot r"></span><span class="dot g"></span><span class="dot b"></span>
                </div>
                {{ articles()[0].sources }} sources
              </div>
              <div class="article-actions">
                <button class="art-btn" [attr.aria-label]="'Like article ' + articles()[0].id">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.6"/></svg>
                </button>
                <button class="art-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
                </button>
              </div>
            </div>
          </div>
          <img class="hero-image" [src]="articles()[0].image" [alt]="articles()[0].title" loading="lazy" />
        </div>

        <!-- Grid of 3 articles -->
        <div class="articles-grid">
          @for (art of articles().slice(1,4); track art.id) {
            <div class="article grid-article" [id]="'article-' + art.id" (click)="openArticle(art)" style="cursor: pointer;">
              <img class="grid-image" [src]="art.image" [alt]="art.title" loading="lazy" />
              <div class="grid-content">
                <h3 class="grid-title">{{ art.title }}</h3>
                <div class="grid-footer">
                  <div class="sources-count sm">
                    <span class="dot r"></span>{{ art.sources }} sources
                  </div>
                  <div class="article-actions">
                    <button class="art-btn sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.6"/></svg>
                    </button>
                    <button class="art-btn sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- More articles -->
        @for (art of articles().slice(4); track art.id) {
          <div class="article list-article" [id]="'article-' + art.id" (click)="openArticle(art)" style="cursor: pointer;">
            <div class="list-content">
              <h3 class="list-title">{{ art.title }}</h3>
              <div class="list-footer">
                <span class="dot r"></span>{{ art.sources }} sources &nbsp;·&nbsp; {{ art.time }}
              </div>
            </div>
            <img class="list-image" [src]="art.image" [alt]="art.title" loading="lazy" />
          </div>
        }
      </div>

      <!-- Right widgets -->
      <aside class="discover-widgets">
        <!-- Interests panel -->
        <div class="widget">
          <div class="widget-header">
            <h4>Make it yours</h4>
            <button class="widget-close">✕</button>
          </div>
          <p class="widget-sub">Select topics and interests to customize your Discover experience</p>
          <div class="interest-tags">
            @for (tag of ['Tech & Science','Business','Arts & Culture','Sports','Entertainment']; track tag) {
              <button class="interest-tag" [class.selected]="selectedInterests().includes(tag)" (click)="toggleInterest(tag)">{{ tag }}</button>
            }
          </div>
          <button class="save-interests-btn" (click)="saveInterests()">Save Interests</button>
        </div>

        <!-- Weather widget -->
        <div class="widget weather-widget">
          <div class="weather-main">
            <div class="weather-temp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              35°&nbsp;<span class="temp-unit">F/C</span>
            </div>
            <div class="weather-cond">Clouds and sun</div>
            <div class="weather-loc">Kurnool &nbsp;·&nbsp; H: 36° L: 26°</div>
          </div>
          <div class="weather-days">
            @for (day of weatherDays; track day.d) {
              <div class="weather-day">
                <span class="wd-icon">{{ day.icon }}</span>
                <span class="wd-temp">{{ day.temp }}°</span>
                <span class="wd-label">{{ day.d }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Market widget -->
        <div class="widget">
          <div class="market-header">
            <span class="market-title">Market Outlook</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </div>
          @for (stock of stocks; track stock.name) {
            <div class="stock-row">
              <div class="stock-name">{{ stock.name }}</div>
              <div class="stock-info">
                <span class="stock-change up">↑ {{ stock.pct }}</span>
                <span class="stock-price">{{ stock.price }}</span>
                <span class="stock-change up">+{{ stock.change }}</span>
              </div>
            </div>
          }
        </div>
      </aside>
    </div>
  </div>

  <!-- Dynamic Detail Modal -->
  @if (activeArticle()) {
    <div class="modal-overlay" (click)="closeArticle()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <button class="modal-close-btn" (click)="closeArticle()">✕</button>
        <img class="modal-image" [src]="activeArticle()?.image" [alt]="activeArticle()?.title" />
        <div class="modal-body">
          <span class="modal-topic">{{ activeArticle()?.topic }}</span>
          <h2 class="modal-title">{{ activeArticle()?.title }}</h2>
          <div class="modal-meta">
            <span>Published {{ activeArticle()?.time }}</span>
            <span>·</span>
            <span>{{ activeArticle()?.sources }} sources</span>
          </div>
          <p class="modal-content">{{ activeArticle()?.summary }} This deep-dive report is dynamically generated from real-time global news syndications. Comet analyzes, verifies, and extracts key entities from multiple reliable publications to form a singular, comprehensive report for our users.</p>
        </div>
      </div>
    </div>
  }
  `,
  styleUrl: './discover.component.scss'
})
export class DiscoverComponent {
  protected articles = signal<Article[]>(ARTICLES);
  protected selectedInterests = signal<string[]>(['Tech & Science', 'Business']);
  protected activeArticle = signal<Article | null>(null);

  protected weatherDays = [
    { d:'Mon', temp:'36', icon:'☁️' }, { d:'Tue', temp:'33', icon:'🌧' },
    { d:'Wed', temp:'36', icon:'⛅' }, { d:'Thu', temp:'37', icon:'🌦' }, { d:'Fri', temp:'38', icon:'🌧' }
  ];

  protected stocks = [
    { name:'S&P Futures', pct:'0.17%', price:'$7,413.00', change:'$12.50' },
    { name:'NASDAQ Fut.', pct:'0.51%', price:'$29,173.75', change:'$147.25' },
    { name:'Bitcoin', pct:'1.31%', price:'$67,420', change:'$872' },
    { name:'VIX', pct:'29.94%', price:'18.42', change:'4.27' },
  ];

  protected toggleInterest(tag: string): void {
    this.selectedInterests.update(arr =>
      arr.includes(tag) ? arr.filter(t => t !== tag) : [...arr, tag]
    );
  }

  protected saveInterests(): void {
    console.log('Saved interests:', this.selectedInterests());
  }

  protected openArticle(art: Article): void {
    this.activeArticle.set(art);
  }

  protected closeArticle(): void {
    this.activeArticle.set(null);
  }
}
