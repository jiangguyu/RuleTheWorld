import Motor from '../library/motor';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import * as Lib from './functionlist';
const appid = "3c68f1f063c14fb09abe8ec6d5188e02";
const secret = "1592f8b6c6b545fdec2a6e0ca65dae78";
Motor.Config.serverUrl  = "https://open.lubansoft.com/api";

let viewer = undefined;

class App extends Component{
    componentDidMount(){
        viewer = new Motor.Viewer({
            container: this.container,
            viewerMode: Motor.ViewerMode.BIM,
            appid: appid,
            secret: secret,
            antialias: true
        });
        Lib.getProjIdList(viewer).then(list=>{
            let proj = viewer.queryProject(list[0])
            proj.open();
        })
    }
    render(){
        return <div ref={element => this.container = element}></div>
    }
}
ReactDOM.render(<App/>, document.getElementById('container'));