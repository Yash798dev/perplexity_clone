import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'bot';
  content: string;
  created_at: string;
}

interface SendMessageResponse {
  userMessage: ChatMessage;
  botMessage: ChatMessage;
  session: ChatSession;
}

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/chats`;

  readonly sessions = signal<ChatSession[]>([]);

  loadSessions(): Observable<{ sessions: ChatSession[] }> {
    return this.http.get<{ sessions: ChatSession[] }>(this.apiUrl).pipe(
      tap(res => {
        this.sessions.set(res.sessions);
      })
    );
  }

  createSession(title?: string): Observable<{ session: ChatSession }> {
    return this.http.post<{ session: ChatSession }>(this.apiUrl, { title }).pipe(
      tap(res => {
        this.sessions.update(s => [res.session, ...s]);
      })
    );
  }

  deleteSession(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.sessions.update(s => s.filter(x => x.id !== id));
      })
    );
  }

  getMessages(sessionId: string): Observable<{ messages: ChatMessage[] }> {
    return this.http.get<{ messages: ChatMessage[] }>(`${this.apiUrl}/${sessionId}/messages`);
  }

  sendMessage(sessionId: string, content: string): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(`${this.apiUrl}/${sessionId}/messages`, { content }).pipe(
      tap(res => {
        // Update session list when session title/updated_at changes
        this.sessions.update(s => {
          const index = s.findIndex(x => x.id === sessionId);
          if (index !== -1) {
            const updated = [...s];
            updated[index] = res.session;
            // Re-sort sessions by updated_at desc
            return updated.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          }
          return s;
        });
      })
    );
  }
}
