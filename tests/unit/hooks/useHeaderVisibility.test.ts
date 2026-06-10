import { renderHook, act } from '@testing-library/react';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';

// window.scrollY is defined as writable in jest.setup.ts
const setScrollY = (value: number) => {
  (window as { scrollY: number }).scrollY = value;
};

describe('useHeaderVisibility', () => {
  beforeEach(() => {
    setScrollY(0);
  });

  it('should start with header visible', () => {
    const { result } = renderHook(() => useHeaderVisibility());
    expect(result.current).toBe(false);
  });

  it('should hide header when scrolling down past header height', () => {
    const { result } = renderHook(() => useHeaderVisibility());

    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });

  it('should show header when scrolling up', () => {
    const { result } = renderHook(() => useHeaderVisibility());

    // First scroll down
    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);

    // Then scroll up
    act(() => {
      setScrollY(50);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('should not hide header when scroll position is below header height', () => {
    const { result } = renderHook(() => useHeaderVisibility());

    act(() => {
      setScrollY(30);
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
