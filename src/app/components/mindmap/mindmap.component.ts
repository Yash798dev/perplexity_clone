import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';

interface MindNode {
  id: string;
  label: string;
  level: number;
  children: MindNode[];
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  alpha: number;
  hovered: boolean;
  color: string;
}

@Component({
  selector: 'app-mindmap',
  standalone: true,
  templateUrl: './mindmap.component.html',
  styleUrl: './mindmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MindmapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() query = '';
  @Input() content = '';
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private nodes: MindNode[] = [];
  private animFrame = 0;
  private startTime = 0;
  private mouse = { x: -999, y: -999 };
  private pan = { x: 0, y: 0 };
  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private panStart = { x: 0, y: 0 };
  private dpr = 1;

  private readonly COLORS = [
    '#20b8cd',
    '#7c6af7',
    '#f7a26a',
    '#5ecb8a',
    '#f76a8a',
    '#a26af7',
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.dpr = window.devicePixelRatio || 1;
    this.resizeCanvas();
    if (this.content) this.buildAndAnimate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['content'] || changes['query']) && this.canvasRef) {
      this.pan = { x: 0, y: 0 };
      this.buildAndAnimate();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrame);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * this.dpr;
    canvas.height = h * this.dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(this.dpr, this.dpr);
  }

  private buildAndAnimate(): void {
    cancelAnimationFrame(this.animFrame);
    this.nodes = this.parseContent();
    this.layoutNodes();
    this.startTime = performance.now();
    this.zone.runOutsideAngular(() => this.animate());
  }

  private parseContent(): MindNode[] {
    const lines = this.content.split('\n').filter(l => l.trim());
    const root: MindNode = this.makeNode(this.query || 'Topic', 0, '#20b8cd');

    const h2Nodes: MindNode[] = [];
    let currentH2: MindNode | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const label = trimmed.replace(/^## /, '').replace(/\*\*/g, '');
        const color = this.COLORS[h2Nodes.length % this.COLORS.length];
        currentH2 = this.makeNode(label, 1, color);
        h2Nodes.push(currentH2);
      } else if (currentH2 && (trimmed.startsWith('- ') || trimmed.match(/^\d+\. /))) {
        const label = trimmed
          .replace(/^- /, '')
          .replace(/^\d+\. /, '')
          .replace(/\*\*/g, '')
          .slice(0, 38);
        const child = this.makeNode(label, 2, currentH2.color);
        currentH2.children.push(child);
      }
    }

    if (h2Nodes.length === 0) {
      const words = this.content.replace(/\*\*/g, '').split(/\s+/).slice(0, 30);
      const chunk = 6;
      for (let i = 0; i < words.length; i += chunk) {
        const label = words.slice(i, i + chunk).join(' ');
        const color = this.COLORS[Math.floor(i / chunk) % this.COLORS.length];
        const n = this.makeNode(label, 1, color);
        h2Nodes.push(n);
      }
    }

    root.children = h2Nodes;
    return this.flatten(root);
  }

  private makeNode(label: string, level: number, color: string): MindNode {
    return {
      id: Math.random().toString(36).slice(2),
      label: label.length > 28 ? label.slice(0, 26) + '…' : label,
      level,
      children: [],
      x: 0, y: 0,
      targetX: 0, targetY: 0,
      radius: level === 0 ? 50 : level === 1 ? 38 : 28,
      alpha: 0,
      hovered: false,
      color,
    };
  }

  private layoutNodes(): void {
    const canvas = this.canvasRef.nativeElement;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const cx = W / 2;
    const cy = H / 2;

    const root = this.nodes[0];
    root.targetX = cx;
    root.targetY = cy;
    root.x = cx;
    root.y = cy;

    const branches = root.children;
    const angleStep = (2 * Math.PI) / Math.max(branches.length, 1);

    branches.forEach((branch, bi) => {
      const angle = bi * angleStep - Math.PI / 2;
      const r1 = 180;
      branch.targetX = cx + Math.cos(angle) * r1;
      branch.targetY = cy + Math.sin(angle) * r1;
      branch.x = cx;
      branch.y = cy;

      const leaves = branch.children;
      const leafStep = (Math.PI * 0.8) / Math.max(leaves.length, 1);
      const leafStart = angle - (leafStep * (leaves.length - 1)) / 2;
      leaves.forEach((leaf, li) => {
        const la = leafStart + li * leafStep;
        const r2 = 290;
        leaf.targetX = cx + Math.cos(la) * r2;
        leaf.targetY = cy + Math.sin(la) * r2;
        leaf.x = branch.targetX;
        leaf.y = branch.targetY;
      });
    });
  }

  private flatten(root: MindNode): MindNode[] {
    const out: MindNode[] = [root];
    for (const b of root.children) {
      out.push(b);
      for (const l of b.children) out.push(l);
    }
    return out;
  }

  private animate(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const elapsed = (performance.now() - this.startTime) / 1000;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(this.pan.x, this.pan.y);

    const t = Math.min(elapsed / 0.9, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    for (const node of this.nodes) {
      node.x += (node.targetX - node.x) * 0.12;
      node.y += (node.targetY - node.y) * 0.12;
      node.alpha = Math.min(node.alpha + 0.04, ease);
    }

    this.drawEdges(ctx, ease);
    this.drawNodes(ctx);

    ctx.restore();

    if (elapsed < 3 || this.nodes.some(n => n.hovered)) {
      this.animFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.animFrame = requestAnimationFrame(() => this.animate());
    }
  }

  private drawEdges(ctx: CanvasRenderingContext2D, ease: number): void {
    const root = this.nodes[0];
    ctx.globalAlpha = Math.min(ease * 1.5, 1) * 0.55;

    for (const branch of root.children) {
      this.drawCurvedEdge(ctx, root, branch, branch.color, 2);
      for (const leaf of branch.children) {
        this.drawCurvedEdge(ctx, branch, leaf, leaf.color, 1.2);
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawCurvedEdge(
    ctx: CanvasRenderingContext2D,
    from: MindNode, to: MindNode,
    color: string, width: number
  ): void {
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(mx, my, to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  private drawNodes(ctx: CanvasRenderingContext2D): void {
    const mx = this.mouse.x - this.pan.x;
    const my = this.mouse.y - this.pan.y;

    for (const node of this.nodes) {
      const dist = Math.hypot(mx - node.x, my - node.y);
      node.hovered = dist < node.radius + 12;
      const scale = node.hovered ? 1.1 : 1;
      const r = node.radius * scale;

      ctx.globalAlpha = node.alpha;

      const grad = ctx.createRadialGradient(
        node.x - r * 0.3, node.y - r * 0.3, r * 0.05,
        node.x, node.y, r
      );
      grad.addColorStop(0, this.lighten(node.color, 60));
      grad.addColorStop(1, node.color);

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = node.hovered ? 20 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.globalAlpha = node.alpha;
      ctx.fillStyle = '#fff';
      ctx.font = `${node.level === 0 ? '600' : node.level === 1 ? '500' : '400'} ${node.level === 0 ? 13 : node.level === 1 ? 11 : 10}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      this.wrapText(ctx, node.label, node.x, node.y, r * 1.7, node.level === 0 ? 14 : 12);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string, x: number, y: number,
    maxWidth: number, lineHeight: number
  ): void {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineHeight));
  }

  private lighten(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  }

  onMouseMove(e: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    if (this.dragging) {
      this.pan.x = this.panStart.x + (e.clientX - this.dragStart.x);
      this.pan.y = this.panStart.y + (e.clientY - this.dragStart.y);
    }
  }

  onMouseDown(e: MouseEvent): void {
    this.dragging = true;
    this.dragStart = { x: e.clientX, y: e.clientY };
    this.panStart = { ...this.pan };
  }

  onMouseUp(): void {
    this.dragging = false;
  }

  onMouseLeave(): void {
    this.dragging = false;
    this.mouse = { x: -999, y: -999 };
  }
}
