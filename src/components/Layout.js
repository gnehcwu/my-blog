import React from 'react'
import { Link } from 'gatsby'
import 'prismjs/themes/prism-tomorrow.css'
import Bio from '../components/Bio'
import { rhythm, scale } from '../utils/typography'
import { Span } from 'opentracing'
import Sift from 'sift'

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
      <div>
        <div>
          <Bio />
        </div>
        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(31),
            // padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            padding: `0 1.3125rem 2.625rem 1.3125rem`
          }}
        >
          {children}
        </div>
        <footer
          style={{
            marginTop: rhythm(1.3),
            marginBottom: rhythm(1.5),
            paddingTop: rhythm(0.7),
            textAlign: `center`,
            fontFamily: `monospace`,
            fontSize: rhythm(0.75),
            borderTop: `1px solid #eee`,
          }}
        >
          <p
            style={{
              marginBottom: 0,
            }}
          >
            © {new Date().getFullYear()} All rights reserved
          </p>
          <p>
            <strong>>_</strong> with love by
            {` `}
            <a href={`https://github.com/gnehcc`} target={'_blank'}>
              CHENG
            </a>
          </p>
        </footer>
      </div>
    )
  }
}

export default Layout
