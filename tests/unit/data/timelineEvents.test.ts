import { timelineEvents } from '@/data/timelineEvents';

describe('timelineEvents data', () => {
  describe('date integrity', () => {
    it('should have Contal Services with correct dates (2024 - Current)', () => {
      const contal = timelineEvents.find(e => e.title === 'Contal Services');
      expect(contal).toBeDefined();
      expect(contal?.subtitle).toContain('2024 - Current');
    });

    it('should have Dye and Durham with correct dates (2023 - 2024)', () => {
      const dyeDurham = timelineEvents.find(e => e.title === 'Dye and Durham');
      expect(dyeDurham).toBeDefined();
      expect(dyeDurham?.subtitle).toContain('2023 - 2024');
    });

    it('should have Scriptsoft with correct dates (2022 - 2023)', () => {
      const scriptsoft = timelineEvents.find(e => e.title === 'Scriptsoft');
      expect(scriptsoft).toBeDefined();
      expect(scriptsoft?.subtitle).toContain('2022 - 2023');
    });

    it('should have Bachelor of Computer Science with correct dates (2019 - 2022)', () => {
      const bcs = timelineEvents.find(e => e.title === 'Bachelor of Computer Science');
      expect(bcs).toBeDefined();
      expect(bcs?.subtitle).toContain('2019 - 2022');
    });

    it('should have Chemist Warehouse with correct dates (2017 - 2019)', () => {
      const chemist = timelineEvents.find(e => e.title === 'Pharmacy Assistant');
      expect(chemist).toBeDefined();
      expect(chemist?.subtitle).toContain('2017 - 2019');
    });

    it('should have Bachelor of Pharmaceutics with correct dates (2016 - 2018)', () => {
      const pharma = timelineEvents.find(e => e.title === 'Bachelor of Pharmaceutics and Therapeutic Science');
      expect(pharma).toBeDefined();
      expect(pharma?.subtitle).toContain('2016 - 2018');
    });

    it('should have Calanna Terrywhite with correct date (2018)', () => {
      const calanna = timelineEvents.find(e => e.title === 'Pharmacy Student');
      expect(calanna).toBeDefined();
      expect(calanna?.subtitle).toContain('2018');
    });
  });

  describe('chronological order', () => {
    it('should be in reverse chronological order (most recent first)', () => {
      const titles = timelineEvents.map(e => e.title);
      expect(titles[0]).toBe('Contal Services');
      expect(titles[1]).toBe('Dye and Durham');
      expect(titles[2]).toBe('Scriptsoft');
      expect(titles[3]).toBe('Bachelor of Computer Science');
    });
  });

  describe('data structure', () => {
    it('should have exactly 7 timeline events', () => {
      expect(timelineEvents).toHaveLength(7);
    });

    it('should have required fields for all events', () => {
      timelineEvents.forEach(event => {
        expect(event.title).toBeDefined();
        expect(event.title.length).toBeGreaterThan(0);
        expect(event.subtitle).toBeDefined();
        expect(event.subtitle.length).toBeGreaterThan(0);
        expect(event.description).toBeDefined();
      });
    });
  });
});
