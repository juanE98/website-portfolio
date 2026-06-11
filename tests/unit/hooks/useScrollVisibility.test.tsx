import { render, screen, act } from '@testing-library/react';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

type IOCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

let ioCallback: IOCallback | null = null;
let observeSpy: jest.Mock;
let unobserveSpy: jest.Mock;
let matchingQueries: string[] = [];

class ControllableIntersectionObserver {
  constructor(callback: IOCallback) {
    ioCallback = callback;
  }
  observe = (...args: unknown[]) => observeSpy(...args);
  unobserve = (...args: unknown[]) => unobserveSpy(...args);
  disconnect = jest.fn();
}

const entryFor = (target: Element, ratio: number) =>
  ({
    target,
    boundingClientRect: { height: 100 },
    rootBounds: { height: 800 },
    intersectionRect: { height: ratio * 100 },
  } as unknown as IntersectionObserverEntry);

const fire = (entries: IntersectionObserverEntry[]) => {
  act(() => {
    ioCallback?.(entries, {} as IntersectionObserver);
  });
};

function Harness() {
  const ref = useScrollVisibility({
    selector: '.reveal-item',
    visibilityThreshold: 0.3,
  });
  return (
    <div ref={ref}>
      <div className="reveal-item" data-testid="item-a" />
      <div className="reveal-item" data-testid="item-b" />
    </div>
  );
}

describe('useScrollVisibility', () => {
  beforeEach(() => {
    ioCallback = null;
    observeSpy = jest.fn();
    unobserveSpy = jest.fn();
    matchingQueries = [];

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: ControllableIntersectionObserver,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn((query: string) => ({
        matches: matchingQueries.includes(query),
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        onchange: null,
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('desktop', () => {
    it('toggles in-view and out-of-view as elements enter and leave', () => {
      render(<Harness />);
      const item = screen.getByTestId('item-a');

      fire([entryFor(item, 0.5)]);
      expect(item.classList.contains('in-view')).toBe(true);
      expect(item.classList.contains('out-of-view')).toBe(false);

      fire([entryFor(item, 0.1)]);
      expect(item.classList.contains('in-view')).toBe(false);
      expect(item.classList.contains('out-of-view')).toBe(true);
    });

    it('keeps observing elements after they reveal', () => {
      render(<Harness />);
      const item = screen.getByTestId('item-a');

      fire([entryFor(item, 0.5)]);
      expect(unobserveSpy).not.toHaveBeenCalled();
    });
  });

  describe('mobile (max-width: 768px)', () => {
    beforeEach(() => {
      matchingQueries = ['(max-width: 768px)'];
    });

    it('reveals once and never re-hides on exit', () => {
      render(<Harness />);
      const item = screen.getByTestId('item-a');

      fire([entryFor(item, 0.5)]);
      expect(item.classList.contains('in-view')).toBe(true);

      // A stale exit entry must not hide already-revealed content
      fire([entryFor(item, 0)]);
      expect(item.classList.contains('in-view')).toBe(true);
      expect(item.classList.contains('out-of-view')).toBe(false);
    });

    it('stops observing an element after it reveals', () => {
      render(<Harness />);
      const item = screen.getByTestId('item-a');

      fire([entryFor(item, 0.5)]);
      expect(unobserveSpy).toHaveBeenCalledWith(item);
    });

    it('still hides elements that have not entered yet', () => {
      render(<Harness />);
      const item = screen.getByTestId('item-b');

      expect(item.classList.contains('in-view')).toBe(false);
    });
  });

  describe('prefers-reduced-motion', () => {
    beforeEach(() => {
      matchingQueries = ['(prefers-reduced-motion: reduce)'];
    });

    it('reveals everything immediately without observing', () => {
      render(<Harness />);

      expect(
        screen.getByTestId('item-a').classList.contains('in-view')
      ).toBe(true);
      expect(
        screen.getByTestId('item-b').classList.contains('in-view')
      ).toBe(true);
      expect(observeSpy).not.toHaveBeenCalled();
    });
  });
});
