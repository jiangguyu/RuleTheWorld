import Motor from '../library/motor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Panel from './panel';
import * as Lib from './functionlist';
const appid = "3c68f1f063c14fb09abe8ec6d5188e02";
const secret = "1592f8b6c6b545fdec2a6e0ca65dae78";
Motor.Config.serverUrl = "https://open.lubansoft.com/api";

let viewer = undefined;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            majorList: [],
            floorList: [],
            typeList: [],
            subtypeList: [],
            compList: [],
            buildingList: []
        };
    }

    componentDidMount() {
        viewer = new Motor.Viewer({
            container: this.container,
            viewerMode: Motor.ViewerMode.BIM,
            appid: appid,
            secret: secret,
            antialias: true
        });
        this.openProject();
    }

    async openProject() {
        await Lib.initialize(viewer);
        let list = await Lib.getProjIdList(viewer);
        let proj = viewer.queryProject(list[1].id);
        // todo
        this.setState({ proj: proj });
        await proj.open();
        console.log(proj);

        this.setState({
            floorList: Lib.getFloors(proj),
            majorList: Lib.getZhuangye(proj),
            buildingList: Lib.getModelInfoFromProject(proj)
        });

    }

    createQueryData(data = {}) {
        const queryData = {
            floor: data.floor === undefined ? this.state.floor : data.floor,
            major: data.major === undefined ?  this.state.major : data.major,
            main_type: data.type === undefined ?  this.state.type : data.type,
            sub_type: data.subtype === undefined ?  this.state.subtype : data.subtype,
            name: data.comp === undefined ?  this.state.comp : data.comp
        };
        const ret = {};
        Object.keys(queryData).filter(k => queryData[k]).forEach(k => ret[k] = queryData[k]);
        return ret;
    }

    async updateData(data) {
        const queryData = this.createQueryData(data);
        if (!queryData.floor) {
            return;
        }
        const subtype = await Lib.getXiaolei(this.state.proj, queryData);
        const type = await Lib.getDalei(this.state.proj, queryData, this.state.building);
        const comp = await Lib.getCompName(this.state.proj, queryData, this.state.building);
        const majroList = Lib.getZhuangye(this.state.proj, data.building || this.state.building);
        console.log(type);
        this.setState({
            subtypeList: subtype,
            typeList: type,
            compList: comp,
            building: data.building,
            majorList: majroList
        });
    }

    setMajor(major) {
        this.setState({ major: major });
        this.updateData({ major: major });
    }

    setFloor(floor) {
        this.setState({ floor: floor });
        this.updateData({ floor: floor });
    }

    setType(type) {
        this.setState({ type: type });
        this.updateData({ type: type });
    }

    setSubtype(subtype) {
        this.setState({ subtype: subtype });
        this.updateData({ subtype: subtype });
    }
    
    setComp(comp) {
        this.setState({ comp: comp });
    }

    setBuilding(building) {
        this.setState({ building: building });
        this.updateData({ building: building });
    }

    handleSearch() {
        console.log(this.createQueryData());
    }

    render() {
        return <div>
            <Panel
                majorList={this.state.majorList}
                floorList={this.state.floorList}
                typeList={this.state.typeList}
                subtypeList={this.state.subtypeList}
                compList={this.state.compList}
                buildingList={this.state.buildingList}
                onMajorChange={(major) => this.setMajor(major)}
                onFloorChange={(floor) => this.setFloor(floor)}
                onTypeChange={(type) => this.setType(type)}
                onSubtypeChange={(subtype) => this.setSubtype(subtype)}
                onCompChange={(comp) => this.setComp(comp)}
                onBuildingChange={(building) => this.setBuilding(building)}
                onSearch={() => this.handleSearch()}
                major={this.state.major}
                floor={this.state.floor}
                type={this.state.type}
                subtype={this.state.subtype}
                comp={this.state.comp}
                building={this.state.building}
            ></Panel>
            <div ref={element => this.container = element}></div>
        </div>
    }
}
ReactDOM.render(<App />, document.getElementById('container'));