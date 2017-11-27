import React from "react";
import { Menu,Icon } from "antd";
import styles from "./index.css";
import headPortrait from "../../assets/headPortrait.png";

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item
class MusicList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            active:null,
            visible:false
        }
    }
    titleHandle = (e) => {
        this.setState({
            visible:!this.state.visible
        })
    }
    render(){

        let list = this.props.list;
        let data = list.map((v,i) => {
           return   <li key={i} 
                        className={this.state.active == i ? styles.liActive : null} 
                        onClick={() => {this.setState({active:i})}}
                    >
                        {this.state.active != i &&
                            <div className={styles.nameBox}>
                                <span className={styles.singer}>{v.singer ? `${v.singer} - ` : ""}</span>
                                <span className={styles.name}>{v.name}</span>
                                <span className={styles.duration}>{v.duration}</span>
                            </div>
                        }
                        {this.state.active == i && 
                            <div className={styles.nameBoxActive}>
                                <div className={styles.headPortrait}>
                                    <img src={headPortrait} alt=""/>
                                </div>
                            </div>
                        }
                    </li>
        })
        return(
            <div className={styles.musicList}>
                <div className={styles.title} onClick={this.titleHandle}>
                    <Icon className={styles.icon} style={this.state.visible ? {transform:"rotate(90deg)"} : {transform:"rotate(0deg)"}} type="right" />
                    {this.props.children}
                </div>
                <ul style={{maxHeight:this.state.visible ? data.length*2*36 + "px" : "0px"}} className={styles.ul}>{data}</ul>
            </div>
        )
    }
}
export default MusicList;