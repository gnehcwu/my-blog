import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import { DiscussionEmbed } from 'disqus-react'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const disqusShortname = 'gnehc'
    const disqusConfig = {
      identifier: post.id,
      title: post.frontmatter.title,
      url: this.props.location.href,
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <Bio />
        <h3
          style={{
            fontWeight: 300,
          }}
        >
          {post.frontmatter.title}
        </h3>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
            marginLeft: 0,
          }}
        >
          {previous && (<li style={{
            backgroundColor: `rgb(245, 248, 250)`,
            flexGrow: 1,
            flexBasis: 0,
            padding: `30px 30px`,
            minWidth: `15rem`
          }}>

              <Link to={previous.fields.slug} rel="prev">
                <p style={{
                  textAlign: `center`,
                  color: `grey`,
                  marginBottom: `0.75rem`,
                }}> <span style={{
                  border: `solid 1px #80808096`,
                  borderRadius: `5px`,
                  padding: `5px 20px`,
                  fontFamily: `monspace`
                  }}>PREV</span></p>
                <p style={{
                  color: `grey`,
                  textAlign: `center`,
                  marginBottom: `0.5rem`
                }}>{previous.frontmatter.title}</p>
                <div style={{
                  color: `grey`,
                }} dangerouslySetInnerHTML={{ __html: previous.excerpt }} />
              </Link>

          </li>)}
          {next && (<li style={{
            backgroundColor: `rgb(245, 248, 250)`,
            flexGrow: 1,
            flexBasis: 0,
            borderLeft: `solid 1px #eee`,
            padding: `30px 30px`,
            minWidth: `15rem`
          }}>
              <Link to={next.fields.slug} rel="next">
              <p style={{
                color: `#eee`,
                textAlign: `center`,
                color: `grey`,
                marginBottom: `0.75rem`,
              }}><span style={{
                border: `solid 1px #80808096`,
                borderRadius: `5px`,
                padding: `5px 20px`,
                fontFamily: `monspace`
              }}>NEXT</span></p>
                <p style={{
                  textAlign: `center`,
                  marginBottom: `0.5rem`,
                  color: `grey`,
                }}>{next.frontmatter.title}</p>
                <div style={{
                  color: `grey`,
                }} dangerouslySetInnerHTML={{ __html: next.excerpt }} />
              </Link>
          </li>
          )}
        </ul>
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
