import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

Wordpress2016.overrideThemeStyles = () => {
  return {
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
    'ul, ol': {
      marginLeft: '1.75rem'
    },
    'h3': {
      fontWeight: 300
    },
    'a': {
      color: `black`
    },
    'h1': {
      textTransform: 'none'
    },
    'h2': {
      textTransform: 'none'
    },
    'h3': {
      textTransform: 'none'
    },
    'h4': {
      textTransform: 'none'
    },
    'h5': {
      textTransform: 'none'
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
