import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppVersion from '../AppVersion.vue'

describe('AppVersion', () => {
  it('renders properly', () => {
    const wrapper = mount(AppVersion)
    expect(wrapper.text()).toContain(process.env.npm_package_version)
  })
})
