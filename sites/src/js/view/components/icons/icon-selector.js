import React              from "react"

import Dropzone           from "react-dropzone"
import AbstractComponent  from "../widgets/abstract-component"
import LoadingImage       from "../widgets/loading-image"
import AgentIcon          from "../widgets/agent-icon"
import Theme              from "../../theme"

import FlatButton from "material-ui/FlatButton"
import Dialog from "material-ui/Dialog"

const keys = new Set([
  "icons"
]);
const modelKeys = new Set([
  "selectedId"
]);

export default class IconSelector extends AbstractComponent  {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentWillMount() {
    this.registerPropertyChangeListener(this.props.model, modelKeys);
    this.registerPropertyChangeListener(this.props.model.icons, keys);
    const state = Object.assign(
      this.collectInitialState(this.props.model, modelKeys),
      this.collectInitialState(this.props.model.icons, keys));
    this.setState(state);
  }

  render() {
    const actions = [
      <FlatButton
        label="キャンセル"
        primary={false}
        onTouchTap={this.dismiss.bind(this)}
      />
    ];
    const editLink = !this.props.readOnly
      ? <a onTouchTap={this.showDialog.bind(this)}>変更...</a>
      : null;
    return (
      <div className="icon-selector">
        <div className="icon-and-action">
          <AgentIcon className="icon"
            iconId={this.state.selectedId}
            onTouchTap={this.showDialog.bind(this)}
            urlResolver={this.props.model.icons.iconService.urlResolver} />
          {editLink}
        </div>
        <Dialog
          open={this.state.open}
          actions={actions}
          modal={true}
          className="icon-selector dialog"
          contentStyle={Theme.dialog.contentStyle}
          onRequestClose={this.dismiss.bind(this)}>
          <div className="dialog-content">
            <div className="dialog-description">使用するアイコンを選択してください。</div>
            <div className="icons">
              {this.createIcons()}
            </div>
            {this.createDropzone()}
          </div>
        </Dialog>
      </div>
    );
  }

  createDropzone() {
    if (this.state.uploading) {
      return <div className="center-information loading">
        <LoadingImage left={-20}/>
      </div>;
    } else {
      return <Dropzone onDrop={this.onDrop.bind(this)} className="drop-area">
        {this.createErrorContent(this.state.error)}
        <div>アイコンを追加したい場合は、画像をここにドロップしてください。</div>
        <ul>
          <li>png/jpg/gif形式の画像を登録できます。</li>
          <li>画像のサイズは最大100KBまで。</li>
        </ul>
      </Dropzone>;
    }
  }

  showDialog(ev) {
    this.setState({ error: null, open:true });
    ev.preventDefault();
  }

  dismiss() {
    this.setState({open:false});
  }

  createIcons() {
    return (this.state.icons||[]).map((icon, index) => {
      return <FlatButton
        className="icon"
        key={index}
        onTouchTap={(ev) => this.onIconSelected(ev, icon)}
        style={{
          lineHeight: "normal",
          minWidth: "56px",
          width: "56px",
          height: "56px",
          padding: "8px"
        }}
        labelStyle={{
          lineHeight: "normal"
        }}>
        <AgentIcon
          iconId={icon.id}
          urlResolver={this.props.model.icons.iconService.urlResolver} />
      </FlatButton>;
    });
  }

  onIconSelected(ev, icon) {
    this.props.model.selectedId = icon.id;
    this.dismiss();
    ev.preventDefault();
  }

  onDrop(files) {
    this.setState({
      uploading:true,
      error: null
    });
    this.props.model.icons.add(files[0]).then(
      () => this.setState({uploading:false}),
      (error) => {
        this.setState({
          uploading:false,
          error: "アップロードに失敗しました。画像の形式/サイズをご確認ください。"
        });
        error.preventDefault = true;
      });
  }

}
IconSelector.propTypes = {
  model: React.PropTypes.object.isRequired,
  enableUpload: React.PropTypes.bool,
  readOnly : React.PropTypes.bool
};
IconSelector.defaultProps = {
  enableUpload: false,
  readOnly: false
};
