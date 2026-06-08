import { Component } from '@angular/core';
@Component({ selector:'app-spaces', standalone:true, template:`
<div class="gen-page">
  <div class="page-header">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <h2>Spaces</h2>
      <button class="create-btn">+ Create Space</button>
    </div>
    <p style="font-size:13px;color:var(--text-2);margin-top:6px">Organize your research into collaborative spaces</p>
  </div>
  <div style="padding:24px;max-width:900px;margin:0 auto">
    <div class="spaces-grid">
      @for (s of spaces; track s.name) {
        <div class="space-card">
          <div class="space-emoji">{{ s.emoji }}</div>
          <div class="space-name">{{ s.name }}</div>
          <div class="space-desc">{{ s.desc }}</div>
          <div class="space-meta">{{ s.threads }} threads · {{ s.members }} members</div>
        </div>
      }
      <div class="space-card create-card">
        <div class="create-plus">+</div>
        <div class="space-name">New Space</div>
        <div class="space-desc">Create a collaborative space for your team</div>
      </div>
    </div>
  </div>
</div>`, styleUrl:'./spaces.component.scss' })
export class SpacesComponent {
  spaces = [
    { emoji:'🔬', name:'AI Research', desc:'Tracking breakthroughs in LLMs, computer vision, and robotics', threads:24, members:3 },
    { emoji:'💹', name:'Market Analysis', desc:'Daily market insights, earnings calls, and investment thesis', threads:18, members:2 },
    { emoji:'🌿', name:'Climate Tech', desc:'Clean energy, carbon capture, and sustainability solutions', threads:11, members:4 },
    { emoji:'⚕️', name:'Medical Insights', desc:'Latest research on drugs, treatments, and clinical trials', threads:8, members:1 },
    { emoji:'🚀', name:'Space Exploration', desc:'NASA, SpaceX, and the commercial space industry', threads:15, members:2 },
  ];
}
