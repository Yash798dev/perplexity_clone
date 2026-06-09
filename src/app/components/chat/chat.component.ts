import { Component, inject, signal, OnInit, OnDestroy, effect, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatApiService, ChatMessage } from '../../services/chat-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private chatApi = inject(ChatApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  protected sessionId = signal<string | null>(null);
  protected messages = signal<ChatMessage[]>([]);
  protected currentMessage = signal('');
  protected isSending = signal(false);
  protected isLoadingMessages = signal(false);

  private routeSub!: Subscription;

  constructor() {
    // Scroll down automatically when messages change
    effect(() => {
      if (this.messages().length > 0) {
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.sessionId.set(id);
      if (id) {
        this.loadChatHistory(id);
      } else {
        this.messages.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private loadChatHistory(id: string): void {
    this.isLoadingMessages.set(true);
    this.chatApi.getMessages(id).subscribe({
      next: (res) => {
        this.messages.set(res.messages);
        this.isLoadingMessages.set(false);
      },
      error: () => {
        this.isLoadingMessages.set(false);
        // If session not found, redirect to home or new chat
        this.router.navigate(['/']);
      }
    });
  }

  protected formatContent(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.+)$/gm, '<h3 class="ans-h2">$1</h3>')
      .replace(/^### (.+)$/gm, '<h4 class="ans-h3">$1</h4>')
      .replace(/^> (.+)$/gm, '<blockquote class="ans-quote">$1</blockquote>')
      .replace(/^\d+\. (.+)$/gm, '<div class="ans-li">$1</div>')
      .replace(/^- (.+)$/gm, '<div class="ans-li bullet">$1</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  protected onSend(): void {
    const text = this.currentMessage().trim();
    if (!text || this.isSending()) return;

    this.currentMessage.set('');
    
    const activeSessionId = this.sessionId();
    if (!activeSessionId) {
      // Create a session first, then send
      this.isSending.set(true);
      this.chatApi.createSession(text.slice(0, 30)).subscribe({
        next: (res) => {
          this.router.navigate(['/chat', res.session.id]).then(() => {
            this.sendToApi(res.session.id, text);
          });
        },
        error: () => {
          this.isSending.set(false);
        }
      });
    } else {
      this.sendToApi(activeSessionId, text);
    }
  }

  private sendToApi(sessId: string, content: string): void {
    this.isSending.set(true);
    
    // Optimistic user message update
    const tempUserMsg: ChatMessage = {
      id: 'temp_user',
      session_id: sessId,
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };
    this.messages.update(m => [...m, tempUserMsg]);

    this.chatApi.sendMessage(sessId, content).subscribe({
      next: (res) => {
        this.isSending.set(false);
        // Replace temp and add bot message
        this.messages.update(m => {
          const filtered = m.filter(x => x.id !== 'temp_user');
          return [...filtered, res.userMessage, res.botMessage];
        });
      },
      error: () => {
        this.isSending.set(false);
        this.messages.update(m => m.filter(x => x.id !== 'temp_user'));
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch {}
  }
}
