import { renderHook, act } from '@testing-library/react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

describe('useTypingAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start with empty string', () => {
    const { result } = renderHook(() =>
      useTypingAnimation({
        texts: ['Hello', 'World'],
        typeSpeed: 50,
        deleteSpeed: 25,
        pauseDuration: 100,
      })
    );

    expect(result.current).toBe('');
  });

  it('should type characters one by one', () => {
    const { result } = renderHook(() =>
      useTypingAnimation({
        texts: ['Hi'],
        typeSpeed: 50,
        deleteSpeed: 25,
        pauseDuration: 100,
      })
    );

    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current).toBe('H');

    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current).toBe('Hi');
  });

  it('should complete typing the full text', () => {
    const { result } = renderHook(() =>
      useTypingAnimation({
        texts: ['Hello'],
        typeSpeed: 50,
        deleteSpeed: 25,
        pauseDuration: 100,
      })
    );

    // Type full "Hello" (5 characters * 50ms = 250ms)
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('Hello');
  });

  it('should handle multiple texts in the array', () => {
    const texts = ['First', 'Second', 'Third'];
    const { result } = renderHook(() =>
      useTypingAnimation({
        texts,
        typeSpeed: 50,
      })
    );

    // After some typing, text should be from the first item
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(texts[0].startsWith(result.current)).toBe(true);
  });

  it('should use default speeds when not provided', () => {
    const { result } = renderHook(() =>
      useTypingAnimation({
        texts: ['Test'],
      })
    );

    // Default typeSpeed is 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('T');
  });
});
