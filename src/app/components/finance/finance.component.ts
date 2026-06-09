import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-finance',
  standalone: true,
  template: `
  <div class="fin-page">
    <div class="page-header">
      <h2>Finance</h2>
      <div class="tab-row">
        <button class="ptab active">Markets</button>
        <button class="ptab">Crypto</button>
        <button class="ptab">Stocks</button>
        <button class="ptab">News</button>
      </div>
    </div>

    <div class="fin-layout">
      <div class="fin-main">
        <!-- Market Overview -->
        <div class="section-title">Market Overview</div>
        <div class="market-grid">
          @for (m of markets; track m.name) {
            <div class="market-card">
              <div class="mk-name">{{ m.name }}</div>
              <div class="mk-value">{{ m.value }}</div>
              <div class="mk-change" [class.up]="m.up" [class.down]="!m.up">
                {{ m.up ? '↑' : '↓' }} {{ m.change }} ({{ m.pct }})
              </div>
              <div class="mk-sparkline">
                <svg width="100%" height="32" viewBox="0 0 100 32">
                  <polyline [attr.points]="m.spark" fill="none" [attr.stroke]="m.up ? '#1a9e5c' : '#e05c5c'" stroke-width="1.5"/>
                </svg>
              </div>
            </div>
          }
        </div>

        <!-- News -->
        <div class="section-title" style="margin-top:24px">Market News</div>
        @for (n of news; track n.title) {
          <div class="news-row" (click)="openNews(n)" style="cursor: pointer;">
            <div class="news-content">
              <span class="news-source">{{ n.source }}</span>
              <div class="news-title">{{ n.title }}</div>
              <div class="news-time">{{ n.time }}</div>
            </div>
            <img class="news-img" [src]="n.img" [alt]="n.title">
          </div>
        }
      </div>

      <aside class="fin-sidebar">
        <div class="widget">
          <div class="widget-title">Watchlist</div>
          @for (s of watchlist; track s.sym) {
            <div class="watch-row">
              <div>
                <div class="watch-sym">{{ s.sym }}</div>
                <div class="watch-name">{{ s.name }}</div>
              </div>
              <div style="text-align:right">
                <div class="watch-price">{{ s.price }}</div>
                <div class="watch-ch" [class.up]="s.up">{{ s.up ? '+' : '' }}{{ s.change }}</div>
              </div>
            </div>
          }
        </div>

        <div class="widget">
          <div class="widget-title">Crypto Prices</div>
          @for (c of crypto; track c.name) {
            <div class="watch-row">
              <div class="crypto-icon">{{ c.icon }}</div>
              <div style="flex:1">
                <div class="watch-sym">{{ c.name }}</div>
              </div>
              <div style="text-align:right">
                <div class="watch-price">{{ c.price }}</div>
                <div class="watch-ch up">+{{ c.pct }}</div>
              </div>
            </div>
          }
        </div>
      </aside>
    </div>
  </div>

  <!-- Dynamic Detail Modal -->
  @if (activeNews()) {
    <div class="modal-overlay" (click)="closeNews()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <button class="modal-close-btn" (click)="closeNews()">✕</button>
        <div class="modal-body">
          <span class="modal-topic">{{ activeNews()?.source }} · {{ activeNews()?.time }}</span>
          <h2 class="modal-title">{{ activeNews()?.title }}</h2>
          <hr class="modal-divider">
          <p class="modal-content">Federal policy updates and corporate developments have driven recent market spikes. Comet aggregates direct updates from major financial journals, ensuring you stay up-to-date with comprehensive global intelligence indexes and economic calendars.</p>
        </div>
      </div>
    </div>
  }
  `,
  styleUrl: './finance.component.scss'
})
export class FinanceComponent {
  protected activeNews = signal<any | null>(null);

  markets = [
    { name:'S&P 500', value:'5,842.47', change:'12.50', pct:'0.21%', up:true, spark:'10,28 20,18 30,22 40,14 50,20 60,10 70,16 80,8 90,12 100,6' },
    { name:'Dow Jones', value:'42,162.12', change:'180.20', pct:'0.43%', up:true, spark:'10,20 20,14 30,18 40,10 50,16 60,8 70,14 80,6 90,10 100,4' },
    { name:'NASDAQ', value:'18,742.65', change:'42.30', pct:'0.23%', up:true, spark:'10,24 20,20 30,26 40,16 50,22 60,12 70,18 80,8 90,14 100,4' },
    { name:'VIX', value:'18.42', change:'-1.20', pct:'6.12%', up:false, spark:'10,8 20,14 30,10 40,18 50,12 60,20 70,14 80,22 90,16 100,24' },
  ];

  news = [
    { title:'Fed signals one rate cut in 2025, markets react positively', source:'Reuters', time:'2 hours ago', img:'https://picsum.photos/seed/fn1/80/60' },
    { title:'Apple stock hits all-time high after Vision Pro 2 announcement', source:'Bloomberg', time:'4 hours ago', img:'https://picsum.photos/seed/fn2/80/60' },
    { title:'Oil prices fall 3% as OPEC+ considers production increase', source:'FT', time:'6 hours ago', img:'https://picsum.photos/seed/fn3/80/60' },
    { title:'Bitcoin surges past $70,000 amid ETF inflow surge', source:'CoinDesk', time:'8 hours ago', img:'https://picsum.photos/seed/fn4/80/60' },
  ];

  watchlist = [
    { sym:'AAPL', name:'Apple Inc.', price:'$212.40', change:'+2.3%', up:true },
    { sym:'MSFT', name:'Microsoft', price:'$428.15', change:'+1.8%', up:true },
    { sym:'GOOGL', name:'Alphabet', price:'$176.80', change:'+0.9%', up:true },
    { sym:'TSLA', name:'Tesla', price:'$248.75', change:'-1.2%', up:false },
    { sym:'NVDA', name:'NVIDIA', price:'$894.20', change:'+3.7%', up:true },
  ];

  crypto = [
    { name:'Bitcoin (BTC)', icon:'₿', price:'$67,420', pct:'1.31%' },
    { name:'Ethereum (ETH)', icon:'Ξ', price:'$3,842', pct:'2.1%' },
    { name:'Solana (SOL)', icon:'◎', price:'$172.40', pct:'4.2%' },
  ];

  protected openNews(n: any): void {
    this.activeNews.set(n);
  }

  protected closeNews(): void {
    this.activeNews.set(null);
  }
}
