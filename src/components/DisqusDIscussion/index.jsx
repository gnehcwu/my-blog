import React from 'react'

class DisqusDiscussion extends React.Component {
  componentDidMount() {
    const doc = window.document
    window.disqus_config = this.getDisqusConfig(this.props.config)
    const scriptNode = doc.createElement('script')
    scriptNode.src = `https://${this.props.shortName}.disqus.com/embed.js`
    scriptNode.setAttribute('data-timestamp', +new Date())
    doc.body.appendChild(scriptNode)
  }

  // eslint-disable-next-line class-methods-use-this
  getDisqusConfig(config) {
    // eslint-disable-next-line func-names
    return function () {
      this.page.identifier = config.identifier
      this.page.url = config.url
      this.page.title = config.title
    }
  }

  render() {
    return <div id="disqus_thread" />
  }
}

export default DisqusDiscussion
