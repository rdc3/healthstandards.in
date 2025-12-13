import '@testing-library/jest-dom'

// Mock remark modules to avoid ES module issues in Jest
jest.mock('remark', () => ({
  remark: () => ({
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({
      toString: () => '<p>Mocked HTML content</p>'
    })
  })
}));

jest.mock('remark-gfm', () => jest.fn());
jest.mock('remark-html', () => jest.fn());