import React from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'

import SEO from '../components/seo'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`, `python`, `coding skills`, `programming`, `technology`]}
        />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h2
                style={{
                  marginBottom: rhythm(1 / 4),
                  fontWeight: 200,
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  {title}
                </Link>
              </h2>
              <div style={{
                display: `flex`,
                alignItems: `center`,
                marginBottom: `1rem`,
                marginTop: `1rem`
              }}>
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                // alt={author}
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 27,
                  borderRadius: `100%`
                }}
                imgStyle={{
                  borderRadius: `50%`,
                  marginBottom: 0
                }}
              />
              <span style={{
                fontSize: `0.75rem`,
                color: `#9EABB3`
              }}>
              Cheng Wu
              </span>
              <span style={{
                borderLeft: `solid 1px #80808096`,
                paddingLeft: `1rem`,
                marginLeft: `1rem`,
                fontSize: `0.75rem`,
                color: `#9EABB3`
              }}>{node.frontmatter.date}</span>
              </div>
              <p style={{
                marginBottom: rhythm(0.5),
              }} dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <p style={{
              }}>
                <Link
                  to={node.fields.slug}
                  style={{
                    textDecoration: 'none',
                    boxShadow: 'none',
                    color: '#ffffff',
                    background: 'black',
                    padding: `5px 15px`,
                    fontSize: rhythm(0.45),
                    fontWeight: 200,
                  }}
                >
                  Read More →
                </Link>
              </p>
            </div>
          )
        })}
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            listStyle: 'none',
            padding: 0,
            marginTop: `4.3rem`,
          }}
        >
          {!isFirst && (
            <li
              style={{
                margin: 0,
                marginRight: 10
              }}
            >
            <Link to={prevPage} rel="prev" style={{
              textDecoration: 'none',
              boxShadow: 'none',
            }}>
              <strong>←</strong>
            </Link>
            </li>
          )}
          {Array.from({ length: numPages }, (_, i) => (
            <li
              key={`pagination-number${i + 1}`}
              style={{
                margin: 0,
                marginRight: 10
              }}
            >
              <Link
                to={`/${i === 0 ? '' : i + 1}`}
                style={{
                  padding: rhythm(1 / 4),
                  textDecoration: 'none',
                  boxShadow: 'none',
                  color: i + 1 === currentPage ? '#ffffff' : '',
                  // background: i + 1 === currentPage ? '#007acc' : '',
                  background: i + 1 === currentPage ? 'black' : '',
                  backgroundColor: i + 1 === currentPage ? `hsla(0,0%,0%,0.95)` : '',
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <li
              style={{
                margin: 0,
                marginRight: 10
              }}
            >
            <Link to={nextPage} rel="next" style={{
              textDecoration: 'none',
              boxShadow: 'none'
            }}>
              <strong>→</strong>
            </Link>
            </li>
          )}
        </ul>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 27, height: 27) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(pruneLength: 233)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`
