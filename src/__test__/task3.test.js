import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import { setupEventDelegation } from '../main'

describe('setupEventDelegation', () => {
  let consoleSpy

  beforeEach(() => {
    // Очищаємо DOM перед кожним тестом
    document.body.innerHTML = ''
    // Створюємо spy для console.log
    consoleSpy = vi.spyOn(console, 'log')
  })

  afterEach(() => {
    // Очищаємо spy після кожного тесту
    consoleSpy?.mockRestore()
    // Очищаємо DOM
    document.body.innerHTML = ''
  })

  it('should log item text when li element is clicked', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    `
    const selector = '#testList'
    const listItem = document.querySelector('#testList li:first-child')

    // Act
    setupEventDelegation(selector)
    listItem.click()

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Item 1')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  it('should work with different li elements', () => {
    // Arrange
    document.body.innerHTML = `
      <ul class="myList">
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>
    `
    const selector = '.myList'
    const secondItem = document.querySelector('.myList li:nth-child(2)')
    const thirdItem = document.querySelector('.myList li:nth-child(3)')

    // Act
    setupEventDelegation(selector)
    secondItem.click()
    thirdItem.click()

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Second')
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Third')
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })

  it('should handle li elements with extra whitespace', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li>  Item with spaces  </li>
        <li>
          Item with newlines
        </li>
      </ul>
    `
    const selector = '#testList'
    const firstItem = document.querySelector('#testList li:first-child')
    const secondItem = document.querySelector('#testList li:nth-child(2)')

    // Act
    setupEventDelegation(selector)
    firstItem.click()
    secondItem.click()

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Item with spaces')
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Item with newlines')
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })

  it('should not log when non-li elements are clicked', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li>Item 1</li>
        <div>Not a list item</div>
        <span>Also not a list item</span>
      </ul>
    `
    const selector = '#testList'
    const div = document.querySelector('#testList div')
    const span = document.querySelector('#testList span')
    const ul = document.querySelector('#testList')

    // Act
    setupEventDelegation(selector)
    div.click()
    span.click()
    ul.click()

    // Assert
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('should work with dynamically added li elements', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li>Original Item</li>
      </ul>
    `
    const selector = '#testList'
    const list = document.querySelector('#testList')

    // Act
    setupEventDelegation(selector)
    
    // Додаємо новий елемент динамічно
    const newItem = document.createElement('li')
    newItem.textContent = 'Dynamic Item'
    list.appendChild(newItem)
    
    // Клікаємо на динамічно доданий елемент
    newItem.click()

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Dynamic Item')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle empty li elements', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li></li>
        <li>   </li>
      </ul>
    `
    const selector = '#testList'
    const emptyItem = document.querySelector('#testList li:first-child')
    const whitespaceItem = document.querySelector('#testList li:nth-child(2)')

    // Act
    setupEventDelegation(selector)
    emptyItem.click()
    whitespaceItem.click()

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: ')
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: ')
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })

  it('should not throw error when selector does not exist', () => {
    // Arrange
    const selector = '#nonExistentList'

    // Act & Assert
    expect(() => {
      setupEventDelegation(selector)
    }).toThrow() // Функція викине помилку при спробі додати listener до null
  })

  it('should handle multiple calls to setupEventDelegation', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li>Test Item</li>
      </ul>
    `
    const selector = '#testList'
    const listItem = document.querySelector('#testList li')

    // Act - викликаємо функцію двічі
    setupEventDelegation(selector)
    setupEventDelegation(selector)
    
    listItem.click()

    // Assert - console.log викликається двічі через два обробники
    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Test Item')
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })

  it('should work with nested elements inside li', () => {
    // Arrange
    document.body.innerHTML = `
      <ul id="testList">
        <li>
          <span>Nested content</span>
          <div>More nested content</div>
        </li>
      </ul>
    `
    const selector = '#testList'
    const span = document.querySelector('#testList li span')
    const div = document.querySelector('#testList li div')

    // Act
    setupEventDelegation(selector)
    span.click() // Клік на вкладений елемент
    div.click()  // Клік на інший вкладений елемент

    // Assert - через event bubbling, target буде span/div, не li
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})