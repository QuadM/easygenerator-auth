import { describe, it, expect } from 'vitest';
import { HttpError } from './httpClient';

describe('HttpError', () => {
  it('should create error with message and status', () => {
    const error = new HttpError('Test error', 400);
    
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(400);
    expect(error.name).toBe('HttpError');
  });

  it('should create error with data', () => {
    const errorData = { field: 'email', message: 'Invalid email' };
    const error = new HttpError('Validation failed', 422, errorData);
    
    expect(error.message).toBe('Validation failed');
    expect(error.status).toBe(422);
    expect(error.data).toEqual(errorData);
  });

  it('should be instance of Error', () => {
    const error = new HttpError('Test', 500);
    expect(error).toBeInstanceOf(Error);
  });
});
