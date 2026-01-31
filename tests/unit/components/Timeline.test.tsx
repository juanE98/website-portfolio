import { render, screen } from '@testing-library/react';
import Timeline from '@/components/Timeline/Timeline';
import { timelineEvents } from '@/data/timelineEvents';

// Mock the useScrollVisibility hook
jest.mock('@/hooks/useScrollVisibility', () => ({
  useScrollVisibility: () => ({ current: null }),
}));

// Mock the SCSS module
jest.mock('@/components/Timeline/Timeline.module.scss', () => ({
  timelineContainer: 'timelineContainer',
  timelineTitle: 'timelineTitle',
  timeline: 'timeline',
  timelineItem: 'timelineItem',
  left: 'left',
  right: 'right',
  circle: 'circle',
  content: 'content',
}));

describe('Timeline', () => {
  it('should render the Experience title', () => {
    render(<Timeline />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('should render all timeline events', () => {
    render(<Timeline />);

    timelineEvents.forEach((event) => {
      expect(screen.getByText(event.title)).toBeInTheDocument();
      expect(screen.getByText(event.subtitle)).toBeInTheDocument();
    });
  });

  it('should render event descriptions when present', () => {
    render(<Timeline />);

    const eventsWithDescriptions = timelineEvents.filter(
      (event) => event.description
    );
    eventsWithDescriptions.forEach((event) => {
      expect(screen.getByText(event.description)).toBeInTheDocument();
    });
  });

  it('should alternate left and right classes for timeline items', () => {
    const { container } = render(<Timeline />);

    const items = container.querySelectorAll('.timelineItem');
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        expect(item).toHaveClass('left');
      } else {
        expect(item).toHaveClass('right');
      }
    });
  });

  it('should render the correct number of timeline items', () => {
    const { container } = render(<Timeline />);
    const items = container.querySelectorAll('.timelineItem');
    expect(items).toHaveLength(timelineEvents.length);
  });
});
