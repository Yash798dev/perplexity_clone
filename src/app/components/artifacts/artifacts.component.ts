import { Component } from '@angular/core';
@Component({ selector:'app-artifacts', standalone:true, template:`
<div class="gen-page">
  <div class="page-header"><h2>Artifacts</h2><p style="font-size:13px;color:var(--text-2);margin-top:4px">Documents, code, and files created with AI</p></div>
  <div style="padding:24px;max-width:900px;margin:0 auto">
    <div class="artifacts-list">
      @for (a of artifacts; track a.name) {
        <div class="artifact-row">
          <div class="artifact-icon">{{ a.icon }}</div>
          <div class="artifact-info">
            <div class="artifact-name">{{ a.name }}</div>
            <div class="artifact-meta">{{ a.type }} · Modified {{ a.modified }}</div>
          </div>
          <div class="artifact-actions">
            <button class="art-action-btn">Open</button>
            <button class="art-action-btn">Download</button>
          </div>
        </div>
      }
    </div>
  </div>
</div>`, styleUrl:'./artifacts.component.scss' })
export class ArtifactsComponent {
  artifacts = [
    { icon:'📄', name:'Market Research Report Q1 2025', type:'Document', modified:'2 hours ago' },
    { icon:'💻', name:'Python data analysis script', type:'Code (Python)', modified:'Yesterday' },
    { icon:'📊', name:'Sales forecast spreadsheet', type:'Spreadsheet', modified:'3 days ago' },
    { icon:'📝', name:'Meeting notes — AI strategy session', type:'Document', modified:'1 week ago' },
    { icon:'🖼️', name:'Product roadmap diagram', type:'Image', modified:'2 weeks ago' },
    { icon:'💻', name:'API integration boilerplate', type:'Code (TypeScript)', modified:'3 weeks ago' },
  ];
}
