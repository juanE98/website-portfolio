import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header/Header';

// Mock the useHeaderVisibility hook
const mockIsHidden = jest.fn(() => false);
jest.mock('@/hooks/useHeaderVisibility', () => ({
  useHeaderVisibility: () => mockIsHidden(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ priority, ...props }: { priority?: boolean } & React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} data-priority={priority} alt={props.alt} />;
  },
}));

// Mock the SCSS module
jest.mock('@/components/Header/Header.module.scss', () => ({
  header: 'header',
  hidden: 'hidden',
  logo: 'logo',
  desktopMenuNav: 'desktopMenuNav',
  menuIconOpen: 'menuIconOpen',
  mobileMenuPanel: 'mobileMenuPanel',
  active: 'active',
  menuIconClose: 'menuIconClose',
}));

describe('Header', () => {
  beforeEach(() => {
    mockIsHidden.mockReturnValue(false);
    // Reset DOM classes
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-interaction');
  });

  it('should render the logo', () => {
    render(<Header />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    render(<Header />);

    expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByText('Technologies')).toHaveLength(2);
    expect(screen.getAllByText('About Me')).toHaveLength(2);
    expect(screen.getAllByText('Experience')).toHaveLength(2);
  });

  it('should add hidden class when isHidden is true', () => {
    mockIsHidden.mockReturnValue(true);
    const { container } = render(<Header />);

    const header = container.querySelector('.header');
    expect(header).toHaveClass('hidden');
  });

  it('should open mobile menu when menu icon is clicked', () => {
    const { container } = render(<Header />);

    const menuIcon = container.querySelector('.menuIconOpen');
    fireEvent.click(menuIcon!);

    const mobilePanel = container.querySelector('.mobileMenuPanel');
    expect(mobilePanel).toHaveClass('active');
    expect(document.documentElement).toHaveClass('no-scroll');
    expect(document.body).toHaveClass('no-interaction');
  });

  it('should close mobile menu when close icon is clicked', () => {
    const { container } = render(<Header />);

    // Open menu first
    const menuIcon = container.querySelector('.menuIconOpen');
    fireEvent.click(menuIcon!);

    // Close menu
    const closeIcon = container.querySelector('.menuIconClose');
    fireEvent.click(closeIcon!);

    const mobilePanel = container.querySelector('.mobileMenuPanel');
    expect(mobilePanel).not.toHaveClass('active');
    expect(document.documentElement).not.toHaveClass('no-scroll');
    expect(document.body).not.toHaveClass('no-interaction');
  });

  it('should close mobile menu when nav item is clicked', () => {
    const { container } = render(<Header />);

    // Open menu
    const menuIcon = container.querySelector('.menuIconOpen');
    fireEvent.click(menuIcon!);

    // Click a mobile nav item
    const mobileNavItems = container.querySelectorAll('.mobileMenuPanel li');
    fireEvent.click(mobileNavItems[0]);

    const mobilePanel = container.querySelector('.mobileMenuPanel');
    expect(mobilePanel).not.toHaveClass('active');
  });

  it('should call scrollTo when nav item is clicked', () => {
    // Mock getElementById
    const mockElement = {
      getBoundingClientRect: () => ({ top: 500 }),
    };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as HTMLElement);

    render(<Header />);

    const navItems = screen.getAllByText('About Me');
    fireEvent.click(navItems[0]);

    expect(window.scrollTo).toHaveBeenCalled();
  });
});
