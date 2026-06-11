import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty state', () => {
    expect(service.query()).toBe('');
    expect(service.results()).toEqual([]);
    expect(service.answer()).toBeNull();
    expect(service.isLoading()).toBeFalse();
    expect(service.hasResults()).toBeFalse();
  });

  describe('search()', () => {
    it('should not trigger an HTTP call for empty query', () => {
      service.search('   ');
      httpMock.expectNone(() => true);
    });

    it('should set isLoading to true while waiting', () => {
      service.search('what is ai');
      expect(service.isLoading()).toBeTrue();
      const req = httpMock.expectOne(r => r.url.includes('/api/search'));
      req.flush({ query: 'what is ai', answer: 'AI is artificial intelligence.', timestamp: new Date().toISOString() });
    });

    it('should call the backend /api/search endpoint with the encoded query', () => {
      service.search('quantum computing');
      const req = httpMock.expectOne(r => r.url.includes('/api/search') && r.url.includes('quantum'));
      expect(req.request.method).toBe('GET');
      req.flush({ query: 'quantum computing', answer: 'Quantum computing uses qubits.', timestamp: new Date().toISOString() });
    });

    it('should set results and start streaming the answer on success', (done) => {
      service.search('What is AI?');
      const req = httpMock.expectOne(r => r.url.includes('/api/search'));
      req.flush({ query: 'What is AI?', answer: 'AI stands for Artificial Intelligence.', timestamp: new Date().toISOString() });

      // Allow the streaming interval to run a tick
      setTimeout(() => {
        expect(service.results().length).toBeGreaterThan(0);
        expect(service.answer()).not.toBeNull();
        done();
      }, 100);
    });

    it('should fall back gracefully when backend returns an error', (done) => {
      service.search('some question');
      const req = httpMock.expectOne(r => r.url.includes('/api/search'));
      req.error(new ProgressEvent('error'));

      setTimeout(() => {
        expect(service.answer()?.content ?? '').not.toBe('');
        done();
      }, 100);
    });

    it('should update the search history on each search', () => {
      service.search('query one');
      httpMock.expectOne(r => r.url.includes('/api/search')).flush({
        query: 'query one', answer: 'Answer one.', timestamp: new Date().toISOString()
      });

      service.search('query two');
      httpMock.expectOne(r => r.url.includes('/api/search')).flush({
        query: 'query two', answer: 'Answer two.', timestamp: new Date().toISOString()
      });

      expect(service.history().length).toBe(2);
      expect(service.history()[0].query).toBe('query two');
    });
  });

  describe('clear()', () => {
    it('should reset query, results, and answer', () => {
      service.search('test query');
      httpMock.expectOne(r => r.url.includes('/api/search')).flush({
        query: 'test query', answer: 'Some answer.', timestamp: new Date().toISOString()
      });

      service.clear();
      expect(service.query()).toBe('');
      expect(service.results()).toEqual([]);
      expect(service.answer()).toBeNull();
    });
  });
});
