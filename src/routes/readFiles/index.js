import React from 'react';
import { connect } from "react-redux";
import { Input,Button,Spin } from "antd";
import styles from "./index.css";
import fs from "fs";
import path from "path";
import mm from "musicmetadata";
class ReadFiles extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			audios:[],
			loading:false
		}
	}
	componentDidMount(){
		document.getElementById('file').addEventListener('change', (e) => {
			this.setState({
				loading:true
			})
			this.readFiles(e.target.value).then(() => {
				let list = this.props.list;
				list.defaultList =[...list.defaultList,...this.state.audios];
				var hash = {};
				list.defaultList = list.defaultList.reduce((next, item) => {
				    hash[item.name] ? '' : hash[item.name] = true && next.push(item);
				    return next
				}, []);
				this.props.dispatch({
					type:"list",
					payload:list
				})
				this.setState({
					loading:false
				})
			});
		})
	}
	componentDidUpdate(){
		
	}
	readdirPromise = (dir) => {
		return new Promise((resolve,reject) => {
			fs.readdir(dir,(err,files) => {
				if(!err){
					resolve(files);
				}else{
					resolve(err)
				}
			})
		})
	}
	statPromise = (dir) => {
		return new Promise((resolve,reject) => {
			fs.stat(dir,(err,info) => {
				if(!err){
					resolve(info);
				}else{
					resolve(err)
				}
			})
		})
	}
	readFiles = (dir) => {
		return this.statPromise(dir).then((info) => {
			if(info.isDirectory()){
				return this.readdirPromise(dir).then( files => 
					Promise.all(files.map(v => 
						this.readFiles(path.resolve(dir, v))
					))
				).then((tree) => {
					
				})
			}else{
				var ext = path.extname(dir);
				if((ext == ".mp3" || ext == ".wav" || ext == ".ogg" ) && info.size >= 1024*1024){
					return this.analysisFile(dir,info).then(data => {
						let audios = this.state.audios;
						audios.push(data);
						this.setState({
							audios:audios
						})
					}).catch(() => undefined);
				}
			}
		})
	}
	analysisFile = (filepath,info) => {
		return new Promise((resolve,reject) => {
			mm(fs.createReadStream(filepath),{ duration: true }, (err, metadata) => {
				if(!err){
					let time = parseInt(metadata.duration);
					let m = (time/60).toFixed(0);
					let s = time%60;
					let data = {
						name:metadata.title || "未知",
						album:metadata.album || "未知",
						year:metadata.year || "未知",
						singer:metadata.artist.join("&") || "未知",
						duration:m + ":" + s,
						size:(parseInt(info.size)/1024/1024).toFixed(1) + "M",
						path:filepath
					}
					resolve(data);
				}else{
					reject(err);
				}
			});
		})
	}
	render(){
		const html = {__html:'<input type="file" nwdirectory id="file" />'};
		return(
			<div className={styles.container}>
			<Button>111111</Button>
			<Input/>
				<Spin size="large" spinning={this.state.loading}>
					<div dangerouslySetInnerHTML={html}>
					</div>
				</Spin>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
    const { list } = state;
	return { list }
}
export default connect(mapStateToProps)(ReadFiles);