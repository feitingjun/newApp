import React from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import gui from 'nw.gui';
import styles from "./container.css";
import quitImg from "../assets/quit.png";
import minImg from "../assets/min.png";
import maxImg from "../assets/max.png";
import unmaxImg from "../assets/unmax.png";

import MusicList from "./musicList";
import ReadFiles from "./ReadFiles";

const { SubMenu } = Menu;
let win = gui.Window.get();
class container extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ismaxisize:false
        }
    }
    componentDidMount(){
        if(!localStorage.list){
            localStorage.list = `{"defaultList":[]}`;
        }
        let list = JSON.parse(localStorage.list);
        this.props.dispatch({
            type:"list",
            payload:list
        })
    }
    //最小化
    minimize = () => {
        win.minimize();
    }
    //最大化
    maximize = () => {
        this.setState({
            ismaxisize:true
        })
        win.maximize();
    }
    //退出最大化
    unmaximize = () => {
        this.setState({
            ismaxisize:false
        })
        win.unmaximize();
    }
    //退出
    quitmize = () => {
        this.animation();
        setTimeout(() => {
            win.close();
        },100)
    }
    animation = () => {
        win.y = win.y + 30;
        win.height =  win.height - 60;
        requestAnimationFrame(this.animation);
    }
    render(){
        return(
            <div className={styles.container}>
                <div className={styles.header}>
                    <span><img onClick={this.minimize} src={minImg} /></span>
                    {!this.state.ismaxisize && <span><img onClick={this.maximize} src={maxImg} /></span>}
                    {this.state.ismaxisize && <span><img onClick={this.unmaximize} src={unmaxImg} /></span>}
                    <span><img onClick={this.quitmize} src={quitImg} /></span>
                </div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <MusicList list={this.props.list.defaultList}>默认列表</MusicList>
                    </div>
                    <div className={styles.right}>
                        <ReadFiles/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { list } = state;
    const { defaultList } = list;
	return { list,defaultList }
}
export default connect(mapStateToProps)(container);