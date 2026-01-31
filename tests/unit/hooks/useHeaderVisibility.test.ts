import { renderHook, act } from '@testing-library/react';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';

describe('useHeaderVisibility', () => {
  const originalScrollTop = Object.getOwnPropertyDescriptor(
    document.documentElement,
    'scrollTop'
  );

  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalScrollTop) {
      Object.defineProperty(
        document.documentElement,
        'scrollTop',
        originalScrollTop
      );
    }
  });

  it('should start with header visible', () => {
    const { result } = renderHook(() => useHeaderVisibility());
    expect(result.current).toBe(false);
  });

  it('should hide header when scrolling down past header height', () => {
    const { result } = renderHook(() => useHeaderVisibility());

    act(() => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 100,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });

  it('should show header when scrolling up', () => {
    const { result } = renderHook(() => useHeaderVisibility());

    // First scroll down
    act(() => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 100,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);

    // Then scroll up
    act(() => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 50,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('should not hide header when scroll position is below header height', () => {
    const { result } = renderHook(() => useHeaderVisibility());

    act(() => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 30,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('should cleanup scroll listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useHeaderVisibility());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
