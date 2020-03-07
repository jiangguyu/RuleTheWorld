import Motor from '../library/motor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Panel from './panel';
import PanelRight from './panel-right';
import * as Lib from './functionlist';
const appid = "3c68f1f063c14fb09abe8ec6d5188e02";
const secret = "1592f8b6c6b545fdec2a6e0ca65dae78";
Motor.Config.serverUrl = "https://open.lubansoft.com/api";

let viewer = undefined;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proj: null,
            projectList: [],
            majorList: [],
            floorList: [],
            typeList: [],
            subtypeList: [],
            compList: [],
            buildingList: [],
            pre: '',
        };

        this.updator = {

        };
    }

    async componentDidMount() {
        viewer = new Motor.Viewer({
            container: this.container,
            viewerMode: Motor.ViewerMode.BIM,
            appid: appid,
            secret: secret,
            antialias: true
        });
        await Lib.initialize(viewer);
        let list = await Lib.getProjIdList(viewer);
        const projItem = list[0];
        this.setState({
            projectList: list
        })
        this.projObjects = list.map(projItem => viewer.queryProject(projItem.id));
        this.openProject(projItem);
    }

    setupUpdator(proj) {
        this.updator = {
            'subtype': async (queryData) => {
                this.setState({
                    subtypeList: [],
                });
                const subtype = await Lib.getXiaolei(proj, queryData, this.state.building);
                this.setState({
                    subtypeList: subtype,
                });
            },
            'type': async (queryData) => {
                this.setState({
                    typeList: [],
                });
                const type = await Lib.getDalei(proj, queryData, this.state.building);
                this.setState({
                    typeList: type,
                })
            },
            'comp': async (queryData) => {
                this.setState({
                    compList: [],
                });
                const comp = await Lib.getCompName(proj, queryData, this.state.building);
                this.setState({
                    compList: comp
                });
            },
            'major': (queryData) => {
                this.setState({
                    majorList: [],
                });
                const major = Lib.getZhuangye(proj, this.state.building);
                this.setState({
                    majorList: major
                });
            }
        };
    }

    async openProject(projItem) {
        const oldProj =  this.state.proj ? this.projObjects.find(p => p.guid === this.state.proj.id) : null;
        this.setState({
            proj: projItem
        });
        const proj = this.projObjects.find(p => p.guid === projItem.id);
        if (!proj) {
            return;
        }
        
        this.setupUpdator(proj);
        await Lib.switchProj(oldProj, proj);
        this.query = (o, m) => Lib.query(proj, o, m)
        this.code = (comps, pre) => {
            if (!comps || comps.length === 0) {
                Lib.codeEx(proj, this.createQueryData(), this.state.building);
            }
            else {
                Lib.code(comps, pre)
            }
            
        }
        this.setState({
            floorList: Lib.getFloors(proj) || [],
            majorList: Lib.getZhuangye(proj),
            buildingList: Lib.getModelInfoFromProject(proj)
        });

    }

    createQueryData(data = {}, key = '') {
        const queryData = {
            floor: key === 'floor' ? undefined : data.floor === undefined ? this.state.floor : data.floor,
            major: key === 'major' ? undefined : data.major === undefined ? this.state.major : data.major,
            main_type: key === 'type' ? undefined : data.type === undefined ? this.state.type : data.type,
            sub_type: key === 'subtype' ? undefined : data.subtype === undefined ? this.state.subtype : data.subtype,
            name: key === 'comp' ? undefined : data.comp === undefined ? this.state.comp : data.comp
        };
        const ret = {};
        Object.keys(queryData).filter(k => queryData[k]).forEach(k => ret[k] = queryData[k]);
        return ret;
    }

    setMajor(major) {
        this.setState({ major: major });
    }

    setFloor(floor) {
        this.setState({ floor: floor });
    }

    setType(type) {
        this.setState({ type: type });
    }

    setSubtype(subtype) {
        this.setState({ subtype: subtype });
    }

    setComp(comp) {
        this.setState({ comp: comp });
    }

    setBuilding(building) {
        this.setState({ building: building });
    }

    handleSearch() {
        const queryData = this.createQueryData();
        if (!queryData.floor) {
            return;
        }

        return this.query(queryData, this.state.building);
    }

    async handleCode() {
        const comps = await this.handleSearch();
        this.code(comps || [], this.state.pre);
    }

    handlePreChange(pre) {
        this.setState({ pre: pre })
    }

    handleLoadData(key) {
        const queryData = this.createQueryData({}, key);
        if (!queryData.floor) {
            return;
        }

        if (this.updator[key]) {
            this.updator[key](queryData);
        }
    }

    render() {
        return <div>
            <Panel
                onCode={() => this.handleCode()}
                loadData={key => this.handleLoadData(key)}
                pre={this.state.pre}
                onPreChange={(pre) => this.handlePreChange(pre)}
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
            <PanelRight projectList={this.state.projectList}
                currentProject={this.state.proj}
                onCurrentProjectChange={(proj) => this.openProject(proj)}></PanelRight>
        </div>
    }
}
ReactDOM.render(<App />, document.getElementById('container'));