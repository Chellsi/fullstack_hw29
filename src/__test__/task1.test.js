import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import { handleButtonClick } from '../main'

describe('handleButtonClick', () => {
  let consoleSpy

  beforeEach(() => {
    // Очищаємо DOM перед кожним тестом
    document.body.innerHTML = ''
    // Створюємо кнопку
    document.body.innerHTML = '<button id="testButton">Button</button>'
    // Створюємо spy для console.log
    consoleSpy = vi.spyOn(console, 'log')
  })

  afterEach(() => {
    // Очищаємо spy після кожного тесту
    consoleSpy?.mockRestore()
    // Очищаємо DOM
    document.body.innerHTML = ''
  })

  it('should log message when button is clicked', () => {
    // Arrange
    const buttonId = 'testButton'
    const message = 'Button clicked!'
    const button = document.getElementById(buttonId)
    
    // Перевіряємо, що кнопка існує
    expect(button).toBeTruthy()

    // Act - спочатку додаємо обробник події
    handleButtonClick(buttonId, message)
    
    // Потім симулюємо клік
    button.click()

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(message)
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  it('should not throw error for non-existent button', () => {
    // Arrange
    const buttonId = 'nonExistentButton'
    const message = 'Button clicked!'

    // Act & Assert - не повинно викидати помилку
    expect(() => {
      handleButtonClick(buttonId, message)
    }).not.toThrow()
    
    // Console.log не повинен викликатися
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('should add multiple listeners if called multiple times', () => {
    // Arrange
    const buttonId = 'testButton'
    const message = 'Button clicked!'
    const button = document.getElementById(buttonId)

    // Act - викликаємо функцію кілька разів (це особливість функції)
    handleButtonClick(buttonId, message)
    handleButtonClick(buttonId, message)
    
    // Клікаємо один раз
    button.click()

    // Assert - console.log викликається двічі через два обробники
    expect(consoleSpy).toHaveBeenCalledWith(message)
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })

  it('should work with different messages', () => {
    // Arrange
    const buttonId = 'testButton'
    const message1 = 'First message'
    const message2 = 'Second message'
    const button = document.getElementById(buttonId)

    // Act
    handleButtonClick(buttonId, message1)
    handleButtonClick(buttonId, message2)
    
    button.click()

    // Assert - обидва повідомлення повинні з'явитися
    expect(consoleSpy).toHaveBeenCalledWith(message1)
    expect(consoleSpy).toHaveBeenCalledWith(message2)
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })
})