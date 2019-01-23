import React from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import { DiscussionEmbed } from 'disqus-react'
import '../../content/assets/css/blog-nav.css'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const avatar = this.props.data.avatar
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
        <h2 style={{
          marginBottom: `0.5rem`
        }}>
          {post.frontmatter.title}
        </h2>
        <div style={{
                display: `flex`,
                alignItems: `center`,
                marginBottom: `2rem`,
                marginTop: `1rem`
              }}>
              <Image
                fixed={avatar.childImageSharp.fixed}
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
              }}>{post.frontmatter.date}</span>
              </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />

        <ul className='blog-nav'>
          {previous && (<li style={{
            backgroundColor: `rgb(245, 248, 250)`,
            flexGrow: 1,
            flexBasis: 0,
            padding: `3rem 5rem`,
            minWidth: `15rem`
          }}>
              <Link to={previous.fields.slug} rel="prev">
                <p style={{
                  textAlign: `center`,
                  color: `grey`,
                  marginBottom: `0.85rem`,
                }}> <span style={{
                  border: `solid 1px #80808096`,
                  borderRadius: `5px`,
                  padding: `5px 20px`,
                  fontFamily: `monspace`
                  }}>PREV</span></p>
                <h4 style={{
                  color: `grey`,
                  textAlign: `center`,
                  marginBottom: `0.85rem`,
                  marginTop: `1.5rem`
                }}>{previous.frontmatter.title}</h4>
                <div style={{
                  color: `grey`,
                }} dangerouslySetInnerHTML={{ __html: previous.excerpt }} />
              </Link>

          </li>)}
          {next && (<li className="next-li" style={{
            backgroundColor: `rgb(245, 248, 250)`,
            flexGrow: 1,
            flexBasis: 0,
            borderLeft: `solid 1px #eee`,
            padding: `3rem 5rem`,
            minWidth: `15rem`
          }}>
              <Link to={next.fields.slug} rel="next">
              <p style={{
                color: `#eee`,
                textAlign: `center`,
                color: `grey`,
                marginBottom: `0.85rem`,
              }}><span style={{
                border: `solid 1px #80808096`,
                borderRadius: `5px`,
                padding: `5px 20px`,
                fontFamily: `monspace`
              }}>NEXT</span></p>
                <h4 style={{
                  textAlign: `center`,
                  marginBottom: `0.85rem`,
                  color: `grey`,
                  marginTop: `1.5rem`
                }}>{next.frontmatter.title}</h4>
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
