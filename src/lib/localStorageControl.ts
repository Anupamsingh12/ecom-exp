// Define a generic return type for getItem. It returns either a string or null, which is the default behavior of localStorage.getItem.
const getItem = (key: string): string | null => {
  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key)
  }

  return null // Return null if not in a browser environment
}

// The value is typed as string; consider JSON.stringify for object storage if needed.
const setItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

const removeItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

const clearAll = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
}

export { getItem, setItem, removeItem, clearAll }
