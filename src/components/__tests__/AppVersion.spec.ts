import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppVersion from '../AppVersion.vue'

import packageJson from '../../../package.json'

describe('AppVersion', () => {
  it('renders properly', () => {
    const wrapper = mount(AppVersion, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain(packageJson.version)
  })
})
