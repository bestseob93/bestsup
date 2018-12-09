import * as React from 'react';

import code from '../ToolBarIcons/code.svg';

export interface IToolBarItemCodeProps {
  name: string,
  handleGistCode: (txt: string) => void
}

export interface IToolBarItemCodeState {
  height: number
}

class ToolBarItemCode extends React.Component<IToolBarItemCodeProps, IToolBarItemCodeState> {
  constructor(props: IToolBarItemCodeProps) {
    super(props);

    this.state = {
      height: 0,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('message', function(e) {
      console.log(e);
    });
  }

  encodedGist = (gistId: string): string => {
    const script = '%3Cscript%3E%0Awindow.onload%20%3D%20function%28%29%20%7B%0A%20%20window.parent.postMessage%28%7B%20height%3A%20%20document.documentElement.clientHeight%20%7D%2C%20%27%2A%27%29%3B%0A%7D%3B%0A%3C%2Fscript%3E';
    const encodedURI = `data:text/html;charset=utf-8,%3Cbody%3E%3Cscript%20src%3D%22https://gist.github.com/${gistId}%22%3E%3C%2Fscript%3E${script}%3C%2Fbody%3E`;
    return encodedURI;
  }
  insertEmbedCode = () => {
    const { handleGistCode } = this.props;

    const editorContainer = document.querySelector('.tikitaka-editor div[contenteditable="true"]');

    if (editorContainer) {
      const arrayOfParagraphs = Array.from(editorContainer.children);
      const lastNode = arrayOfParagraphs[arrayOfParagraphs.length - 1];

      const fakeFigure = document.createElement('figure');
      const iFrameContainer = document.createElement('div');
      const iFrameEle = document.createElement('iframe');

      iFrameContainer.setAttribute('class', 'iframe-container');
      console.log(iFrameContainer.style);
      iFrameEle.src = this.encodedGist('bestseob93/25dcdcf38f5c5d2def9aa6cff3556a06.js');
      iFrameEle.setAttribute('sandbox', 'allow-scripts');
      iFrameEle.onload = function () {
        window.addEventListener('message', function(e) {
          iFrameContainer.style.paddingBottom = e.data.height + 'px';
        });

        console.log(iFrameContainer.style);
        setTimeout(() => {
          handleGistCode(fakeFigure.innerHTML);
        }, 100);
      }

      // TODO: 깜빡이는거 제거
      fakeFigure.appendChild(iFrameContainer);
      iFrameContainer.appendChild(iFrameEle);
      lastNode.appendChild(fakeFigure);
    }
  }
  render() {
    return (
      <li className="toolbar-btn" onClick={this.insertEmbedCode}>
        <img src={code} />
      </li>
    );
  }
}

export default ToolBarItemCode;
