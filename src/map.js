import React, { Component } from 'react';
import ReactMapGl, {Layer, Marker, Source, Popup} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './map.css';
import {getUserData, getAreaDetails} from './actions/action'
import { connect } from 'react-redux';

const mapboxToken = 'pk.eyJ1IjoibmFtYW4yMTAyIiwiYSI6ImNreXhkb3B6bTA5ZWwyb212dWExYXh5aWgifQ.4G15ErNTNgLyNpMCVMF3bA'

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        width: '95vw',
        height: '85vh',
        latitude: 12.9716,
        longitude: 77.5946,
        zoom: 11
      }
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.handleGeocoderViewportChange = this.handleGeocoderViewportChange.bind(this)
  }
  componentDidMount = () =>{
      this.props.getUserData();
      this.props.getAreaDetails();
  }
  componentDidUpdate = (prevProps , prevState)=>{
      if(prevState.userData !== this.state.userData){
          //console.log(this.state.userData)
      }
      if(prevState.polygonData !== this.state.polygonData){
      //  console.log('this.state.polygonData')
    }
  }
  static getDerivedStateFromProps = (nextProps, state) => {
      debugger;
    if(nextProps && nextProps.userReducers && nextProps.userReducers.userData){
        return{ userData: nextProps.userReducers.userData};
    }
    if(nextProps && nextProps.userReducers && nextProps.userReducers.areaDetails){
        return{ areaId: nextProps.userReducers.areaDetails.features[0].properties.area_id, 
                polygonData: nextProps.userReducers.areaDetails.features
            };
    }

  }
  mapRef = React.createRef()

  handleViewportChange(viewport) {
    this.setState(prevState => ({
      viewport: {...prevState.viewport, ...viewport}
    }))
  }
  handleGeocoderViewportChange(viewport) {
    const geocoderDefaultOverrides = {transitionDuration: 1000}
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  }
  onClickMap = (e) =>{
    debugger;
    let polygonData= this.state.polygonData
    var pointInPolygon = require('point-in-polygon');
    var polygon = e.lngLat
    this.setState({ })
    for(let i=0; i<=100; i++){
    let geoData= polygonData[i].geometry.coordinates[0]
        if(pointInPolygon(polygon, geoData)){
        this.setState({ areaPoly: polygonData[i].geometry, areaId: polygonData[i].properties.area_id, areaName:polygonData[i].properties.name})
        }
        else{
        this.setState({ showError: true})            
        }
    }
    console.log(this.state.areaId)
    this.fetchUsers();
  }
  fetchUsers = () =>{
      let userData= this.state.userData;
      let userArea= userData.users
      let count= 0;
      let male= 0;
      let female= 0;
      let paidUsers= 0;
      for( let users of userArea){
          if(this.state.areaId === users.area_id){
              count = count + 1;
              if(users.is_pro_user === true){
                  paidUsers= paidUsers+1
              }
              if(users.gender === 'M'){
                  male= male+1
              }
              else if(users.gender === 'F'){
                  female= female+1
              }
          }
      }
      this.setState({ totalUsers: count , totalMale: male, totalFemale: female, totalPaidSubscribers: paidUsers})
      if(paidUsers > 100){
          this.setState({ fillColor: '#00ff00'})
        }
     else if(male > 160){
        this.setState({ fillColor: 'aqua'})
        }
     else if(female > 150){
        this.setState({ fillColor: '#FF0080'})
        }
    else{
        this.setState({fillColor: ''})
    }
  }
  render() {
    return (
        <div className="map">
            <div className="header"> Kyupid Analysis by Locale.ae</div>
      <div className="container">
    <div className="mapArea">
      <ReactMapGl
        ref={this.mapRef}
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({viewport})}
        mapboxApiAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onHover={(e)=>this.onClickMap(e)}
        onClick={() => this.setState({showPopup: true})}
        >
        <Source 
                id="kyupid"
                type="geojson"
                data= {this.state.areaPoly}
                />
        <Layer
            id="layer"
            type="fill"
            source="kyupid"
            paint={{
                "fill-color": this.state.fillColor ? this.state.fillColor : 'yellow',
                "fill-opacity": 0.6
            }}/>
        <Layer
            id= 'outline'
            type= 'line'
            source= 'kyupid'
            paint= {{
            'line-color': '#000',
            'line-width': 2}}
            />
      {
          this.state.showPopup &&  
          <Popup
            latitude={0}
            longitude={0}
            closeButton={true}
            closeOnClick={true}
            onClose={() => this.setState({showPopup: false})}
            anchor="top" 
            dynamicPosition={false}
            > <div className='areaInfo'>
                Area Name: {this.state.areaName}<br/>
                Total Numbers of Users: { this.state.totalUsers}<br/>
                Total Number of Paid Users: {this.state.totalPaidSubscribers}<br/>
                Total Numbers of Male Users: { this.state.totalMale}<br/>
                Total Numbers of Female Users: { this.state.totalFemale}
            </div>
            </Popup>
      }
      </ReactMapGl>
      </div>
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    ...state
   })

 const mapDispatchToProps = dispatch => ({
 	getUserData: (data) => dispatch(getUserData(data)),
    getAreaDetails: (data) => dispatch(getAreaDetails(data))
 })
export default connect(mapStateToProps , mapDispatchToProps)(Map);
