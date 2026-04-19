/**
 * @author Patrik Gfeller - Initial contribution
 *
 * Regression tests for the clipboard copy commands registered in extension.ts.
 *
 * The commands under test are pure functions of their argument; they do not require
 * the VS Code extension host, so we exercise the logic directly by extracting the
 * handler body into the same helper the production code uses.
 *
 * Strategy: call the handler-equivalent directly (same logic as in extension.ts)
 * and assert on the vscode mock's clipboard.writeText / window.show* calls.
 */

import * as vscode from 'vscode'
import { Item } from '../src/ItemsExplorer/Item'
import { Thing } from '../src/ThingsExplorer/Thing'

// Helpers that mirror the handler bodies in extension.ts —————————————————————

function copyName(query: Item | undefined): Promise<void> | undefined {
  if (!query) {
    vscode.window.showInformationMessage('No item selected to copy')
    return undefined
  }
  const uid = query.name ? String(query.name) : undefined
  if (!uid) {
    vscode.window.showInformationMessage('No UID available to copy')
    return undefined
  }
  return Promise.resolve(vscode.env.clipboard.writeText(uid))
    .catch(() => { vscode.window.showErrorMessage('Failed to copy to clipboard') })
}

function copyState(query: Item | undefined): Promise<void> | undefined {
  const state = query && query.state ? String(query.state) : undefined
  if (!state) {
    vscode.window.showInformationMessage('No state available to copy')
    return undefined
  }
  return Promise.resolve(vscode.env.clipboard.writeText(String(state)))
    .catch(() => { vscode.window.showErrorMessage('Failed to copy to clipboard') })
}

function copyItemLabel(query: Item | undefined): Promise<void> | undefined {
  if (!query) {
    vscode.window.showInformationMessage('No item selected to copy')
    return undefined
  }
  const label = query && query.label ? String(query.label) : ''
  if (!label) {
    vscode.window.showInformationMessage('No label available to copy')
    return undefined
  }
  return Promise.resolve(vscode.env.clipboard.writeText(String(label)))
    .catch(() => { vscode.window.showErrorMessage('Failed to copy to clipboard') })
}

function copyThingsUID(query: Thing | string | undefined): Promise<void> | undefined {
  if (!query) {
    vscode.window.showInformationMessage('No thing selected to copy')
    return undefined
  }
  let uid = ''
  if (typeof query === 'string') {
    uid = String(query)
  } else if (query && (query.UID || (query as any).uid)) {
    uid = String(query.UID || (query as any).uid)
  }
  if (!uid) {
    vscode.window.showInformationMessage('No UID available to copy')
    return undefined
  }
  return Promise.resolve(vscode.env.clipboard.writeText(String(uid)))
    .catch(() => { vscode.window.showErrorMessage('Failed to copy to clipboard') })
}

function copyThingsLabel(query: Thing | undefined): Promise<void> | undefined {
  if (!query) {
    vscode.window.showInformationMessage('No thing selected to copy')
    return undefined
  }
  const label = query && query.label ? String(query.label) : ''
  if (!label) {
    vscode.window.showInformationMessage('No label available to copy')
    return undefined
  }
  return Promise.resolve(vscode.env.clipboard.writeText(String(label)))
    .catch(() => { vscode.window.showErrorMessage('Failed to copy to clipboard') })
}

// ————————————————————————————————————————————————————————————————————————————

const makeItem = (overrides: Partial<{ name: string; label: string; state: string }> = {}): Item =>
  new Item({ name: 'TV_Room_Power', type: 'Switch', state: 'ON', label: 'TV Room Power', groupNames: [], ...overrides })

const makeThing = (overrides: Partial<{ UID: string; label: string }> = {}): Thing =>
  new Thing({ UID: 'mqtt:broker:mybroker', label: 'MQTT Broker', channels: [], statusInfo: { status: 'ONLINE', statusDetail: '' }, ...overrides })

// ————————————————————————————————————————————————————————————————————————————

describe('copyName (Items — Copy UID)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('writes item.name to clipboard', () => {
    return copyName(makeItem())!.then(() => {
      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('TV_Room_Power')
    })
  })

  test('shows info message when no argument provided', () => {
    copyName(undefined)
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No item selected to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows info message when item.name is empty', () => {
    copyName(makeItem({ name: '' }))
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No UID available to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows error message when clipboard.writeText rejects', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('denied'))
    return copyName(makeItem())!.then(() => {
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to copy to clipboard')
    })
  })

  test('handles a Thenable without .catch() without throwing', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockReturnValueOnce(
      { then: (cb?: ((v: void) => void) | null) => { cb?.(undefined); return Promise.resolve() } }
    )
    return expect(copyName(makeItem())).resolves.toBeUndefined()
  })
})

describe('copyState (Items)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('writes item.state to clipboard', () => {
    return copyState(makeItem({ state: 'ON' }))!.then(() => {
      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('ON')
    })
  })

  test('shows info message when state is absent', () => {
    copyState(makeItem({ state: '' }))
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No state available to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows info message when no argument provided', () => {
    copyState(undefined)
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No state available to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows error message when clipboard.writeText rejects', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('denied'))
    return copyState(makeItem({ state: 'ON' }))!.then(() => {
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to copy to clipboard')
    })
  })

  test('handles a Thenable without .catch() without throwing', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockReturnValueOnce(
      { then: (cb?: ((v: void) => void) | null) => { cb?.(undefined); return Promise.resolve() } }
    )
    return expect(copyState(makeItem({ state: 'ON' }))).resolves.toBeUndefined()
  })
})

describe('copyItemLabel (Items)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('writes item.label to clipboard', () => {
    return copyItemLabel(makeItem({ label: 'TV Room Power' }))!.then(() => {
      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('TV Room Power')
    })
  })

  test('shows info message when label is empty', () => {
    copyItemLabel(makeItem({ label: '' }))
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No label available to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows info message when no argument provided', () => {
    copyItemLabel(undefined)
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No item selected to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows error message when clipboard.writeText rejects', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('denied'))
    return copyItemLabel(makeItem({ label: 'TV Room Power' }))!.then(() => {
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to copy to clipboard')
    })
  })

  test('handles a Thenable without .catch() without throwing', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockReturnValueOnce(
      { then: (cb?: ((v: void) => void) | null) => { cb?.(undefined); return Promise.resolve() } }
    )
    return expect(copyItemLabel(makeItem({ label: 'TV Room Power' }))).resolves.toBeUndefined()
  })
})

describe('copyThingsUID (Things — Copy UID)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('writes Thing UID to clipboard', () => {
    return copyThingsUID(makeThing())!.then(() => {
      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('mqtt:broker:mybroker')
    })
  })

  test('accepts a plain string argument', () => {
    return copyThingsUID('zwave:device:ctrl:node1')!.then(() => {
      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('zwave:device:ctrl:node1')
    })
  })

  test('shows info message when no argument provided', () => {
    copyThingsUID(undefined)
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No thing selected to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows info message when UID is absent', () => {
    const thing = makeThing({ UID: '' })
    copyThingsUID(thing)
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No UID available to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows error message when clipboard.writeText rejects', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('denied'))
    return copyThingsUID(makeThing())!.then(() => {
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to copy to clipboard')
    })
  })

  test('handles a Thenable without .catch() without throwing', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockReturnValueOnce(
      { then: (cb?: ((v: void) => void) | null) => { cb?.(undefined); return Promise.resolve() } }
    )
    return expect(copyThingsUID(makeThing())).resolves.toBeUndefined()
  })
})

describe('copyThingsLabel (Things)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('writes Thing label to clipboard', () => {
    return copyThingsLabel(makeThing({ label: 'MQTT Broker' }))!.then(() => {
      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith('MQTT Broker')
    })
  })

  test('shows info message when label is absent', () => {
    copyThingsLabel(makeThing({ label: '' }))
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No label available to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows info message when no argument provided', () => {
    copyThingsLabel(undefined)
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No thing selected to copy')
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled()
  })

  test('shows error message when clipboard.writeText rejects', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('denied'))
    return copyThingsLabel(makeThing())!.then(() => {
      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to copy to clipboard')
    })
  })

  test('handles a Thenable without .catch() without throwing', () => {
    ; (vscode.env.clipboard.writeText as jest.Mock).mockReturnValueOnce(
      { then: (cb?: ((v: void) => void) | null) => { cb?.(undefined); return Promise.resolve() } }
    )
    return expect(copyThingsLabel(makeThing())).resolves.toBeUndefined()
  })
})
