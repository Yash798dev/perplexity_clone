import { Component } from '@angular/core';
@Component({ selector:'app-health', standalone:true, template:`
<div class="gen-page">
  <div class="page-header"><h2>Health</h2>
    <div class="tab-row"><button class="ptab active">Top</button><button class="ptab">Wellness</button><button class="ptab">Research</button><button class="ptab">Nutrition</button></div>
  </div>
  <div class="gen-layout">
    <div class="gen-main">
      @for (a of articles; track a.title) {
        <div class="gen-article">
          <img class="gen-img" [src]="a.img" [alt]="a.title" loading="lazy"/>
          <div class="gen-content">
            <div class="gen-topic">{{ a.topic }}</div>
            <div class="gen-title">{{ a.title }}</div>
            <div class="gen-snippet">{{ a.snippet }}</div>
            <div class="gen-meta">{{ a.sources }} sources · {{ a.time }}</div>
          </div>
        </div>
      }
    </div>
    <aside class="gen-sidebar">
      <div class="widget">
        <div class="widget-title">Health Topics</div>
        @for (t of topics; track t) { <div class="topic-chip">{{ t }}</div> }
      </div>
    </aside>
  </div>
</div>`, styleUrl:'./health.component.scss' })
export class HealthComponent {
  articles = [
    { title:'GLP-1 drugs show promise for reducing heart disease risk beyond weight loss', snippet:'New research shows semaglutide and tirzepatide may have direct cardioprotective effects independent of weight reduction.', topic:'Cardiology', sources:24, time:'1 hour ago', img:'https://picsum.photos/seed/h1/300/180' },
    { title:'Daily walking goals: New study questions 10,000-step rule', snippet:'A landmark analysis of 17 studies suggests that 7,000-8,000 steps per day may be the optimal target for longevity benefits.', topic:'Fitness', sources:16, time:'3 hours ago', img:'https://picsum.photos/seed/h2/300/180' },
    { title:'Ultra-processed foods linked to 32 health conditions in major review', snippet:'A comprehensive analysis of 45 meta-analyses found strong associations between ultra-processed food consumption and cancer, diabetes, and mental health disorders.', topic:'Nutrition', sources:31, time:'5 hours ago', img:'https://picsum.photos/seed/h3/300/180' },
    { title:'Ozempic users report unexpected mental health benefits', snippet:'A growing body of anecdotal evidence and early research suggests GLP-1 medications may reduce addictive behaviors and improve mood in some patients.', topic:'Mental Health', sources:19, time:'7 hours ago', img:'https://picsum.photos/seed/h4/300/180' },
  ];
  topics = ['Cardiology','Mental Health','Nutrition','Fitness','Cancer Research','Sleep','Vaccines','Pediatrics'];
}
