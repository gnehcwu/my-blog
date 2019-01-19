import React from 'react'
import { Link } from 'gatsby'
import 'prismjs/themes/prism-tomorrow.css'

import { rhythm, scale } from '../utils/typography'
import { Span } from 'opentracing'
import Sift from 'sift';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const isRootPath = location.pathname === `${__PATH_PREFIX__}/`
    let header
    const pageNumber = location.pathname
      .split('/')
      .filter(Boolean)
      .pop()
    const isPaginatedPath = pageNumber && Boolean(pageNumber.match(/^[0-9]+$/))

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(33),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {children}
        <footer
          style={{
            marginTop: rhythm(3.3),
            textAlign: `center`,
            fontFamily: `monospace`,
            fontSize: rhythm(1)
          }}
        >
          © {new Date().getFullYear()} <strong>>_</strong> with love by
          {` `}
          <a href={`https://github.com/gnehcc`} target={'_blank'}>
            CHENG
          </a>
        </footer>
      </div>
    )
  }
}

export default Layout
