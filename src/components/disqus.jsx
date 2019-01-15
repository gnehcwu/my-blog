import React from 'react'

export class Disqus extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="disqus_thread"></div>
        );
    }

    componentDidMount() {
        const doc = window.document;
        window.disqus_config = this.getDisqusConfig(this.props.config)
        var scriptNode = doc.createElement('script')
        scriptNode.src = `https://${this.props.shortName}.disqus.com/embed.js`
        scriptNode.setAttribute('data-timestamp', +new Date())
        doc.body.appendChild(scriptNode)
    }

    getDisqusConfig(config) {
        return function () {
            this.page.identifier = config.identifier;
            this.page.url = config.url;
        };
    }
}