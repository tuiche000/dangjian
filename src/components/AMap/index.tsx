import React from 'react';
import { Button, Input } from 'antd';
import { Map, MouseTool, Polyline, PolyEditor, Marker } from 'react-amap';

const Search = Input.Search;
let AMap = null;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    const self = this;
    this.state = {
      lineActive: false,
      Slatlngs: [],
      mapMake: [],
      mapCenter: {}
    };
    this.amapEvents = {
      created: mapInstance => {
        self.instance = mapInstance;
        AMap = window.AMap;
        this.pluginSearch(mapInstance);
      },
      click: e => {
        let res = [e.lnglat.lng, e.lnglat.lat];
        props.saveLatlngs([
          {
            latitude: e.lnglat.lat,
            longitude: e.lnglat.lng,
          },
        ]);
        self.setState({
          mapMake: res,
        });
      },
    };
    this.toolEvents = {
      created: tool => {
        //
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };
    this.editorEvents = {
      created: ins => {
        //
      },
      addnode: () => { },
      adjust: () => { },
      removenode: () => { },
      end: obj => {
        let distance = obj.target.getLength();
        let paths = obj.target.getPath();
        let latlngs = paths.map(item => {
          return {
            latitude: item.lat,
            longitude: item.lng,
          };
        });
        self.props.save(latlngs, distance);
      },
    };
    // this.mapCenter = props.latlngs[0]
  }

  pluginSearch(mapInstance) {
    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
      var autocomplete = new AMap.Autocomplete({
        input: 'keyword',
      });
      var placeSearch = new AMap.PlaceSearch({
        map: mapInstance,
      });
      AMap.event.addListener(autocomplete, 'select', function (e) {
        //TODO 针对选中的poi实现自己的功能
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
      });
    });
  }

  // 新增折线图
  drawWhat(obj) {
    let text = '';
    //
    switch (obj.CLASS_NAME) {
      case 'AMap.Polyline':
        let distance = obj.getLength();
        let paths = obj.getPath();
        let latlngs = paths.map(item => {
          return {
            latitude: item.lat,
            longitude: item.lng,
          };
        });
        this.props.save(latlngs, distance);
        // text = `你绘制了折线，有${obj.getPath().length}个端点`;
        break;
      default:
        text = '';
    }
  }

  // 准备绘制折线
  polyline() {
    //
    if (this.tool) {
      this.tool.polyline();
      this.setState({
        what: '准备绘制折线',
      });
    }
  }

  clearPolyline = () => {
    if (this.tool) {
      this.tool.close(true);
    }
    this.setState({
      Slatlngs: [],
    });
    this.props.save([]);
  };

  componentWillMount() {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      }
      else {
        alert("该浏览器不支持获取地理位置。")
      }
    }

    const showPosition = (position: {
      coords: {
        latitude: number;
        longitude: number;
      }
    }) => {
      this.setState({
        mapCenter: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      })
    }
    function showError(error: {
      [propName: string]: any;
    }) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("用户拒绝对获取地理位置的请求。")
          break;
        case error.POSITION_UNAVAILABLE:
          alert("位置信息是不可用的。")
          break;
        case error.TIMEOUT:
          alert("请求用户地理位置超时。")
          break;
        case error.UNKNOWN_ERROR:
          alert("未知错误。")
          break;
      }
    }
    getLocation()
    const { type, Platlngs, distance } = this.props;

    if (type === 'edit') {
      this.props.save(Platlngs, distance);
      this.setState({
        Slatlngs: Platlngs,
      });
      if (Platlngs[0])
        this.setState({
          mapCenter: { longitude: Platlngs[0].longitude, latitude: Platlngs[0].latitude }
        })
    } else {
      this.setState({
        Slatlngs: [],
      });
    }
  }

  render() {
    const { type, latlngs } = this.props;
    // const { Slatlngs, mapMake } = this.state;
    let center = [];
    if (latlngs.length) {
      // 编辑有经纬度
      center = latlngs[0];
    } else {
      // 没有经纬度或者新增
      center = this.state.mapCenter
    }
    // const latlngs = Slatlngs;
    //
    const plugins = ['ToolBar'];
    return (
      <div>
        {/* <div style={{textAlign: 'center'}}>
          <Search placeholder="请输入路名选择地图位置" id="keyword" style={{ width: 300 }}  enterButton />
        </div> */}
        <div style={{ width: '100%', height: '300px' }}>
          <Map
            version={'1.4.4'}
            zoom={17}
            center={center}
            plugins={plugins}
            events={this.amapEvents}
          >
            <Marker position={this.state.mapMake.length ? this.state.mapMake : center} />
            {/* <MouseTool events={this.toolEvents} />
            <Polyline style={{ strokeWeight: 6, lineJoin: 'round', strokeColor: "#3366FF" }} path={latlngs}>
              <PolyEditor active={this.state.lineActive} events={this.editorEvents} />
            </Polyline>
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
            }}>
            </div>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {
                (type == 'add' || true) && <Button onClick={() => { this.polyline() }}>新增地图责任网格</Button>
              }
              {
                type == 'edit' && <Button onClick={() => {
                  this.setState({
                    lineActive: !this.state.lineActive
                  })
                }}
                  style={{ marginTop: 10 }}
                >{this.state.lineActive ? `保存地图网络` : '编辑地图网络'}</Button>
              }
              <Button onClick={this.clearPolyline}
                style={{ marginTop: 10 }}
              >删除地图网络</Button>
            </div> */}
          </Map>
        </div>
      </div>
    );
  }
}
