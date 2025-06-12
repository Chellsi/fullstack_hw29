import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import { trackMousePosition } from '../main'

describe('trackMousePosition', () => {
  let consoleSpy

  beforeEach(() => {
    // Створюємо spy для console.log
    consoleSpy = vi.spyOn(console, 'log')
  })

  afterEach(() => {
    // Очищаємо spy після кожного тесту
    consoleSpy?.mockRestore()
  })

  it('should log mouse position when mousemove event is triggered', () => {
    // Arrange
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    })

    // Act - додаємо обробник
    trackMousePosition()
    
    // Симулюємо рух миші
    document.dispatchEvent(mockEvent)

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: 100, Mouse Y: 200')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle zero coordinates', () => {
    // Arrange
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 0,
      clientY: 0
    })

    // Act
    trackMousePosition()
    document.dispatchEvent(mockEvent)

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: 0, Mouse Y: 0')
  })

  it('should handle negative coordinates', () => {
    // Arrange
    const mockEvent = new MouseEvent('mousemove', {
      clientX: -10,
      clientY: -20
    })

    // Act
    trackMousePosition()
    document.dispatchEvent(mockEvent)

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: -10, Mouse Y: -20')
  })

  it('should not log anything without mouse movement', () => {
    // Act - тільки додаємо обробник, але не рухаємо миш
    trackMousePosition()

    // Assert
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})