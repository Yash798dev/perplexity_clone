import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({ selector:'app-patents', standalone:true, imports:[FormsModule], template:`
<div class="gen-page">
  <div class="page-header"><h2>Patents</h2></div>
  <div class="gen-layout">
    <div class="gen-main">
      <div class="patent-search">
        <input type="text" class="patent-input" placeholder="Search patents by keyword, inventor, or assignee..." [ngModel]="query()" (ngModelChange)="query.set($event)"/>
        <button class="patent-search-btn">Search</button>
      </div>
      @for (p of patents; track p.num) {
        <div class="patent-card">
          <div class="patent-num">{{ p.num }}</div>
          <div class="patent-title">{{ p.title }}</div>
          <div class="patent-meta">{{ p.assignee }} · Filed: {{ p.filed }} · Granted: {{ p.granted }}</div>
          <div class="patent-abstract">{{ p.abstract }}</div>
          <div class="patent-tags">
            @for (t of p.tags; track t) { <span class="ptag">{{ t }}</span> }
          </div>
        </div>
      }
    </div>
    <aside class="gen-sidebar">
      <div class="widget"><div class="widget-title">Categories</div>
        @for (c of categories; track c) { <div class="topic-chip">{{ c }}</div> }
      </div>
    </aside>
  </div>
</div>`, styleUrl:'./patents.component.scss' })
export class PatentsComponent {
  query = signal('');
  patents = [
    { num:'US11847649B2', title:'Systems and methods for large language model inference optimization using speculative decoding', assignee:'Google LLC', filed:'2022-08-15', granted:'2024-01-02', abstract:'A method for accelerating autoregressive language model inference by using a smaller draft model to propose candidate tokens which are verified by the target model in parallel.', tags:['AI','Machine Learning','NLP'] },
    { num:'US11831604B1', title:'Multi-modal search engine with cross-attention fusion for image and text queries', assignee:'Meta Platforms Inc.', filed:'2023-02-10', granted:'2023-12-05', abstract:'An information retrieval system that processes heterogeneous query types including natural language text, images, and audio to retrieve semantically relevant results from a unified embedding space.', tags:['Search','Computer Vision','NLP'] },
    { num:'US11792020B2', title:'Privacy-preserving federated learning with differential privacy guarantees', assignee:'Apple Inc.', filed:'2021-11-30', granted:'2023-10-17', abstract:'A federated machine learning system that trains models across distributed client devices without centralizing raw data, using local differential privacy mechanisms to provide formal privacy guarantees.', tags:['Privacy','Federated Learning','Security'] },
  ];
  categories = ['AI & Machine Learning','Semiconductors','Biotechnology','Telecommunications','Software','Medical Devices','Green Energy','Robotics'];
}
