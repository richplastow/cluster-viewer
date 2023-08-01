import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import GLTFRenderer from '../GLTFRenderer.vue'

describe('GLTFRenderer', () => {
  it("passes props to Drie's Renderer component correctly", () => {

    // Missing 'antialias' and 'autoResize' should default to "true".
    const usesDefaults = shallowMount(GLTFRenderer)
    expect(usesDefaults.attributes('antialias')).toBe('true')
    expect(usesDefaults.attributes('autoresize')).toBe('true') // lowercase

    // true 'antialias' and 'autoResize' should be passed in as "true".
    const trueAttribs = shallowMount(GLTFRenderer, { props: {
        antialias: true,
        autoResize: true, // camel-case
    } })
    expect(trueAttribs.attributes('antialias')).toBe('true')
    expect(trueAttribs.attributes('autoresize')).toBe('true')

    // false 'antialias' and 'autoResize' should be passed in as "false".
    const falseAttribs = shallowMount(GLTFRenderer, { props: {
        antialias: false,
        autoResize: false,
    } })
    expect(falseAttribs.attributes('antialias')).toBe('false')
    expect(falseAttribs.attributes('autoresize')).toBe('false')
  })
})
